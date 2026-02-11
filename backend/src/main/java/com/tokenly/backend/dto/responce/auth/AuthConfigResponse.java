package com.tokenly.backend.dto.responce.auth;

import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthConfigResponse {
    private AuthMode authMode;
    private LoginMethod loginMethod;
    private PasswordHashAlgorithm hashingAlgorithm;
    private boolean signupEnabled;
    private boolean emailVerificationRequired;
    private String googleClientId;
    private String githubClientId;
    private String metaAppId;
    private String auth0Domain;
    private String auth0ClientId;
    private Integer accessTokenTtlMinutes;
    private Integer refreshTokenTtlMinutes;
    private String defaultRedirectUrl;
}
