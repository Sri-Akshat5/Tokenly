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
    public PasswordEncoder getEncoderForApplication(com.tokenly.backend.entity.Application application) {
        return authConfigRepository.findByApplication(application)
                .map(AuthConfig::getPasswordHashAlgorithm)
                .map(this::getEncoder)
                .orElseGet(() -> new BCryptPasswordEncoder(12));
    }
}
