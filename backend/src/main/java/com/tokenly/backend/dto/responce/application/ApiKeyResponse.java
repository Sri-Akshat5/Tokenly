package com.tokenly.backend.dto.responce.application;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApiKeyResponse {

    private String publicKey;
    private Instant expiresAt;
    private boolean active;
}
