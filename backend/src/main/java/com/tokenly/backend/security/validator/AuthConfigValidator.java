package com.tokenly.backend.security.validator;

import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.exception.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class AuthConfigValidator {

    public void validate(AuthConfig config) {

        if (config.getAuthMode() == null) {
            throw new BadRequestException("Auth mode must be selected");
        }

        switch (config.getAuthMode()) {

            case JWT -> validateJwt(config);

            case SESSION -> validateSession(config);

            case API_TOKEN -> {
                // API_TOKEN validation (if needed)
            }
        }
    }

    private void validateJwt(AuthConfig config) {
        if (config.getJwtSecretHash() == null) {
            throw new BadRequestException("JWT secret is required");
        }
        if (config.getAccessTokenTtlMinutes() == null || config.getAccessTokenTtlMinutes() <= 0) {
            throw new BadRequestException("JWT expiry must be > 0");
        }
    }

    private void validateSession(AuthConfig config) {
        // Session mode validation
    }

    private void validatePassword(AuthConfig config) {
        if (config.getPasswordHashAlgorithm() == null) {
            throw new BadRequestException("Password hash algorithm is required");
        }
    }
}
