package com.tokenly.backend.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginRequest {

    @Email
    @NotBlank
    private String email;

    private String password; // Optional for OTP/Magic Link
    
    // Multi-factor / Passwordless
    private String otpCode;
    private String magicToken;
    
    // Social OAuth
    private String providerToken;

    // Session tracking
    private String ipAddress;
    private String userAgent;
}
