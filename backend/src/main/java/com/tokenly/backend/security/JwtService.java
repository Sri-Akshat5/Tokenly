package com.tokenly.backend.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.repository.AuthConfigRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties properties;
    private final AuthConfigRepository authConfigRepository;
    private final ObjectMapper objectMapper;
    private Key key;

    private Key getSigningKey() {
        if (key == null) {
            key = Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8));
        }
        return key;
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    public String generateAccessToken(User user, Application application) {
        Instant now = Instant.now();
        AuthConfig config = application.getAuthConfig();
        int expiryMinutes = config != null ? config.getAccessTokenTtlMinutes() : (int) (properties.getAccessTokenExpiry() / 60);

        JwtBuilder builder = Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("appId", application.getId().toString())
                .claim("email", user.getEmail())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(expiryMinutes, ChronoUnit.MINUTES)));

        if (config != null && config.getJwtCustomClaims() != null && !config.getJwtCustomClaims().isEmpty()) {
            addCustomClaims(builder, user, config.getJwtCustomClaims());
        }

        return builder.signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private void addCustomClaims(JwtBuilder builder, User user, String claimsList) {
        String[] requestedClaims = claimsList.split(",");
        Map<String, Object> customDataMap = null;

        if (user.getCustomData() != null) {
            try {
                customDataMap = objectMapper.readValue(user.getCustomData(), new TypeReference<Map<String, Object>>() {});
            } catch (Exception e) {
                // Ignore parsing errors for now
            }
        }

        for (String claim : requestedClaims) {
            claim = claim.trim();
            if (claim.isEmpty()) continue;

            // 1. Check standard user fields first
            switch (claim.toLowerCase()) {
                case "status" -> builder.claim("status", user.getStatus().name());
                case "verified" -> builder.claim("verified", user.isEmailVerified());
                case "id" -> builder.claim("id", user.getId().toString());
                case "email" -> builder.claim("email", user.getEmail());
            }

            // 2. Check custom data map
            if (customDataMap != null && customDataMap.containsKey(claim)) {
                builder.claim(claim, customDataMap.get(claim));
            }
        }
    }

    // Overloaded method for client authentication (admin portal)
    public String generateAccessToken(UUID clientId) {
        Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(clientId.toString())
                .claim("type", "client")  // Mark this as a client token
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(properties.getAccessTokenExpiry())))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(
                validateToken(token).getBody().getSubject()
        );
    }

    public UUID extractApplicationId(String token) {
        return UUID.fromString(
                validateToken(token).getBody().get("appId", String.class)
        );
    }
}
