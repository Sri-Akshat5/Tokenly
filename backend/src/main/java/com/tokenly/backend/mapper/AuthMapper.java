package com.tokenly.backend.mapper;

import com.tokenly.backend.dto.responce.auth.AuthConfigResponse;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.AuthConfig;

import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthConfigResponse toResponse(AuthConfig config) {
        if (config == null) return null;
        return AuthConfigResponse.builder()
                .authMode(config.getAuthMode())
                .loginMethod(config.getLoginMethod())
                .hashingAlgorithm(config.getPasswordHashAlgorithm())
                .signupEnabled(config.isSignupEnabled())
                .emailVerificationRequired(config.isEmailVerificationRequired())
                .googleClientId(config.getGoogleClientId())
                .build();
    }

    public AuthResponse toAuthResponse(
            String accessToken,
            String refreshToken,
            long expiresIn
    ) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(expiresIn)
                .build();
    }
}
