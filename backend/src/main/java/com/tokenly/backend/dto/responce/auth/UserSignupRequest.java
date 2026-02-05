package com.tokenly.backend.dto.responce.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class UserSignupRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    // dynamic fields
    private Map<String, Object> customData;
}
