package com.tokenly.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Session;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.repository.SessionRepository;
import com.tokenly.backend.security.JwtService;
import com.tokenly.backend.security.util.TokenHashUtil;
import com.tokenly.backend.service.impl.SessionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private TokenHashUtil tokenHashUtil;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private SessionServiceImpl sessionService;

    private User testUser;
    private Application testApplication;
    private Session testSession;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("user@test.com");

        testApplication = new Application();
        testApplication.setId(UUID.randomUUID());

        testSession = new Session();
        testSession.setId(UUID.randomUUID());
        testSession.setUser(testUser);
        testSession.setApplication(testApplication);
        testSession.setRefreshTokenHash("hashedToken");
        testSession.setRevoked(false);
        testSession.setExpiresAt(Instant.now().plusSeconds(3600));

        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void createSession_ShouldCreateNewSession() {
        // Arrange
        when(tokenHashUtil.hash(anyString())).thenReturn("hashedToken");
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // Act
        Session result = sessionService.createSession(testUser, testApplication, "rawToken", "127.0.0.1", "UserAgent");

        // Assert
        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertEquals("hashedToken", result.getRefreshTokenHash());
        verify(sessionRepository).save(any(Session.class));
        verify(redisTemplate).opsForValue(); // Verify redis interaction
    }

    @Test
    void revokeSession_ShouldRevokeAndRemoveFromRedis() {
        // Arrange
        when(sessionRepository.findById(testSession.getId())).thenReturn(Optional.of(testSession));
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // Act
        sessionService.revokeSession(testSession.getId());

        // Assert
        assertTrue(testSession.isRevoked());
        verify(sessionRepository).save(testSession);
        verify(redisTemplate).delete(anyString());
    }

    @Test
    void cleanupExpiredSessions_ShouldCallRepository() {
        // Act
        sessionService.cleanupExpiredSessions();

        // Assert
        verify(sessionRepository).deleteByExpiresAtBeforeAndRevokedTrue(any(Instant.class));
    }

    @Test
    void revokeAllUserSessions_ShouldCallRepository() {
        // Act
        sessionService.revokeAllUserSessions(testUser);

        // Assert
        verify(sessionRepository).revokeAllUserSessions(eq(testUser), any(Instant.class));
    }
}
