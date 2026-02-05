package com.tokenly.backend.dto.request.application;

import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateApplicationRequest {

    @NotBlank
    private String appName;

    @NotNull
    private ApplicationEnvironment environment;

    private AuthMode authMode;

    private LoginMethod loginMethod;

    private PasswordHashAlgorithm passwordHashAlgorithm;
}
