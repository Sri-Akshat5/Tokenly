package com.tokenly.backend.dto.request.admin;

import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAuthConfigRequest {
    @NotNull
    private AuthMode authMode;

    @NotNull
    private LoginMethod loginMethod;

    @NotNull
    private PasswordHashAlgorithm passwordHashAlgorithm;

    private Integer accessTokenTtlMinutes;
    private Integer refreshTokenTtlMinutes;
    private boolean refreshTokenEnabled;
    private boolean signupEnabled;
    private boolean emailVerificationRequired;
    private String jwtCustomClaims;
    private String googleClientId;
}
