package com.tokenly.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.entity.Session;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.SessionRepository;
import com.tokenly.backend.security.JwtService;
import com.tokenly.backend.security.util.TokenHashUtil;
import com.tokenly.backend.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final JwtService jwtService;
    private final TokenHashUtil tokenHashUtil;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String REDIS_SESSION_PREFIX = "tokenly:session:";

    @Override
    public AuthResponse validateAndRotateRefreshToken(Application application, String refreshToken) {
        String tokenHash = tokenHashUtil.hash(refreshToken);
        String redisKey = REDIS_SESSION_PREFIX + application.getId() + ":" + tokenHash;

        // 1. Try Redis first
        String sessionData = redisTemplate.opsForValue().get(redisKey);
        Session session;

        if (sessionData != null) {
            try {
                Map<String, String> data = objectMapper.readValue(sessionData, new TypeReference<Map<String, String>>() {});
                UUID sessionId = UUID.fromString(data.get("id"));
                session = sessionRepository.findById(sessionId).orElse(null);
            } catch (Exception e) {
                log.error("Failed to parse Redis session data", e);
                session = null;
            }
        } else {
            // 2. Fallback to DB
            session = sessionRepository.findByRefreshTokenHashAndRevokedFalse(tokenHash).orElse(null);
        }

        if (session == null || session.isRevoked() || session.getExpiresAt().isBefore(Instant.now())) {
             throw new UnauthorizedException("Invalid or expired refresh token");
        }

        // 4. Check for token reuse (security: if reused, revoke entire family)
        List<Session> familySessions = sessionRepository.findAllByTokenFamilyAndRevokedFalse(session.getTokenFamily());
        if (familySessions.size() > 1) {
            log.warn("Refresh token reuse detected for token family: {}. Revoking all sessions in family.", session.getTokenFamily());
            sessionRepository.revokeTokenFamily(session.getTokenFamily(), Instant.now());
            redisTemplate.delete(redisKey); // Immediate revocation in Redis
            throw new UnauthorizedException("Token reuse detected. All sessions revoked for security.");
        }

        User user = session.getUser();

        // 5. Revoke the current session
        session.setRevoked(true);
        session.setRevokedAt(Instant.now());
        sessionRepository.save(session);
        redisTemplate.delete(redisKey); // Remove from Redis

        // 6. Generate new tokens
        String newAccessToken = jwtService.generateAccessToken(user, application);
        String newRefreshToken = jwtService.generateRefreshToken();

        // 7. Create new session with SAME token family
        AuthConfig config = application.getAuthConfig();
        int refreshTtl = config != null ? config.getRefreshTokenTtlMinutes() : 43200; // 30 days default
        int accessTtl = config != null ? config.getAccessTokenTtlMinutes() : 60; // 1 hour default

        Session newSession = new Session();
        newSession.setUser(user);
        newSession.setApplication(application);
        newSession.setRefreshTokenHash(tokenHashUtil.hash(newRefreshToken));
        newSession.setTokenFamily(session.getTokenFamily()); 
        newSession.setIpAddress(session.getIpAddress()); 
        newSession.setUserAgent(session.getUserAgent());
        newSession.setLastUsedAt(Instant.now());
        newSession.setExpiresAt(Instant.now().plus(refreshTtl, ChronoUnit.MINUTES));
        newSession.setRevoked(false);

        sessionRepository.save(newSession);
        saveSessionToRedis(newSession);

        log.info("Refresh token rotated successfully for user: {}", user.getId());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn((long) accessTtl * 60)
                .build();
    }

    @Override
    public Session createSession(User user, Application application, String refreshToken, String ipAddress, String userAgent) {
        AuthConfig config = application.getAuthConfig();
        int refreshTtl = config != null ? config.getRefreshTokenTtlMinutes() : 43200;

        Session session = new Session();
        session.setUser(user);
        session.setApplication(application);
        session.setRefreshTokenHash(tokenHashUtil.hash(refreshToken));
        session.setTokenFamily(UUID.randomUUID()); // New token family
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);
        session.setLastUsedAt(Instant.now());
        session.setExpiresAt(Instant.now().plus(refreshTtl, ChronoUnit.MINUTES));
        session.setRevoked(false);

        Session savedSession = sessionRepository.save(session);
        saveSessionToRedis(savedSession);
        return savedSession;
    }

    private void saveSessionToRedis(Session session) {
        String redisKey = REDIS_SESSION_PREFIX + session.getApplication().getId() + ":" + session.getRefreshTokenHash();
        try {
            Map<String, String> data = Map.of(
                    "id", session.getId().toString(),
                    "userId", session.getUser().getId().toString(),
                    "expiresAt", session.getExpiresAt().toString()
            );
            String json = objectMapper.writeValueAsString(data);
            long ttlSeconds = Duration.between(Instant.now(), session.getExpiresAt()).getSeconds();
            if (ttlSeconds > 0) {
                redisTemplate.opsForValue().set(redisKey, json, Duration.ofSeconds(ttlSeconds));
            }
        } catch (Exception e) {
            log.error("Failed to save session to Redis", e);
        }
    }

    @Override
    public void revokeSession(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalStateException("Session not found"));

        session.setRevoked(true);
        session.setRevokedAt(Instant.now());
        sessionRepository.save(session);
        
        String redisKey = REDIS_SESSION_PREFIX + session.getApplication().getId() + ":" + session.getRefreshTokenHash();
        redisTemplate.delete(redisKey);

        log.info("Session revoked: {}", sessionId);
    }

    @Override
    public void revokeAllUserSessions(User user, UUID exceptSessionId) {
        sessionRepository.revokeAllUserSessionsExcept(user, exceptSessionId, Instant.now());
        log.info("All sessions revoked for user: {} except session: {}", user.getId(), exceptSessionId);
    }

    @Override
    public void revokeAllUserSessions(User user) {
        sessionRepository.revokeAllUserSessions(user, Instant.now());
        log.info("All sessions revoked for user: {}", user.getId());
    }

    @Override
    public void cleanupExpiredSessions() {
        Instant threshold = Instant.now().minus(7, ChronoUnit.DAYS);
        sessionRepository.deleteByExpiresAtBeforeAndRevokedTrue(threshold);
        log.info("Cleaned up expired sessions older than: {}", threshold);
    }
}
