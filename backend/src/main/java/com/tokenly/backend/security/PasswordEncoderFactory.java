package com.tokenly.backend.security;

import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import com.tokenly.backend.repository.AuthConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordEncoderFactory {

    private final AuthConfigRepository authConfigRepository;

    /**
     * Get the correct PasswordEncoder for a given application's configuration.
     */
    public PasswordEncoder getEncoder(PasswordHashAlgorithm algorithm) {
        if (algorithm == null) {
            return new BCryptPasswordEncoder(12); // Default
        }

        return switch (algorithm) {
            case BCRYPT -> new BCryptPasswordEncoder(12);
            case ARGON2 -> Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
            case PBKDF2 -> Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        };
    }

    /**
     * Helper to get encoder directly from application config
     */
    /**
     * Helper to get encoder directly from application config
     */
    public PasswordEncoder getEncoderForApplication(com.tokenly.backend.entity.Application application) {
        return authConfigRepository.findByApplication(application)
                .map(AuthConfig::getPasswordHashAlgorithm)
                .map(this::getEncoder)
                .orElseGet(() -> new BCryptPasswordEncoder(12)); // Default to BCrypt
    }

    /**
     * Identify the algorithm used for a given hash.
     * Useful for migration scenarios to verify the old password before re-hashing.
     */
    public PasswordHashAlgorithm identifyAlgorithm(String hash) {
        if (hash == null) return null;
        if (hash.startsWith("$argon2")) return PasswordHashAlgorithm.ARGON2;
        if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) return PasswordHashAlgorithm.BCRYPT;
        // PBKDF2 defaults often don't have a unique prefix in standard Spring encoding unless configured, 
        // but for now we focus on BCrypt/Argon migration.
        return PasswordHashAlgorithm.BCRYPT; // Fallback assumption
    }

    public PasswordEncoder getEncoderForHash(String hash) {
        PasswordHashAlgorithm algorithm = identifyAlgorithm(hash);
        return getEncoder(algorithm);
    }
}
