package com.tokenly.backend.dto.request.client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClientSignupRequest {

    @NotBlank
    private String companyName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
