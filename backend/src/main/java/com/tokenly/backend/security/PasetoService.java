package com.tokenly.backend.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.entity.User;
import dev.paseto.jpaseto.Paseto;
import dev.paseto.jpaseto.Pasetos;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasetoService {

    private final JwtProperties properties;
    private final ObjectMapper objectMapper;
    
    private SecretKey sharedSecret;
    private KeyPair keyPair;

    static {
        if (Security.getProvider("BC") == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    @PostConstruct
    public void init() throws NoSuchAlgorithmException, NoSuchProviderException {
        // Initialize Shared Secret
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(properties.getSecret().getBytes(StandardCharsets.UTF_8));
        this.sharedSecret = new SecretKeySpec(hash, "AES"); // PASETO requires 32-byte key

        // Initialize KeyPair
        try {
            KeyPairGenerator kpg = KeyPairGenerator.getInstance("Ed25519");
            this.keyPair = kpg.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            log.warn("Native Ed25519 not available, falling back to BouncyCastle");
            KeyPairGenerator kpg = KeyPairGenerator.getInstance("Ed25519", "BC");
            this.keyPair = kpg.generateKeyPair();
        }
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    public String generateV2LocalToken(User user, Application application) {
        return generateToken(user, application, "V2_LOCAL");
    }

    public String generateV2PublicToken(User user, Application application) {
        return generateToken(user, application, "V2_PUBLIC");
    }

    private String generateToken(User user, Application application, String type) {
        Instant now = Instant.now();
        AuthConfig config = application.getAuthConfig();
        int expiryMinutes = (config != null && config.getAccessTokenTtlMinutes() != null)
                ? config.getAccessTokenTtlMinutes()
                : (int) (properties.getAccessTokenExpiry() / 60);

        if (type.equals("V2_LOCAL")) {
            var builder = Pasetos.V2.LOCAL.builder().setSharedSecret(sharedSecret);
            builder.setSubject(user.getId().toString())
                   .claim("appId", application.getId().toString())
                   .claim("email", user.getEmail())
                   .setIssuedAt(now)
                   .setExpiration(now.plus(expiryMinutes, ChronoUnit.MINUTES));
            if (config != null && config.getJwtCustomClaims() != null && !config.getJwtCustomClaims().isEmpty()) {
                addCustomClaims(builder, user, config.getJwtCustomClaims());
            }
            return builder.compact();
        } else {
            var builder = Pasetos.V2.PUBLIC.builder().setPrivateKey(keyPair.getPrivate());
            builder.setSubject(user.getId().toString())
                   .claim("appId", application.getId().toString())
                   .claim("email", user.getEmail())
                   .setIssuedAt(now)
                   .setExpiration(now.plus(expiryMinutes, ChronoUnit.MINUTES));
            if (config != null && config.getJwtCustomClaims() != null && !config.getJwtCustomClaims().isEmpty()) {
                addCustomClaims(builder, user, config.getJwtCustomClaims());
            }
            return builder.compact();
        }
    }

    private void addCustomClaims(dev.paseto.jpaseto.PasetoBuilder builder, User user, String claimsList) {
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
}
