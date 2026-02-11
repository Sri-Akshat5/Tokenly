package com.tokenly.backend.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginRequest {

    private String email;

    private String password; // Optional for OTP/Magic Link
    
    // Multi-factor / Passwordless
    @com.fasterxml.jackson.annotation.JsonAlias("otp")
    private String otpCode;
    @com.fasterxml.jackson.annotation.JsonAlias("token")
    private String magicToken;
    
    
    // Social OAuth
    private String provider; // "GOOGLE", "GITHUB", "META"
    private String providerToken;

    // Session tracking
    private String ipAddress;
    private String userAgent;
}
