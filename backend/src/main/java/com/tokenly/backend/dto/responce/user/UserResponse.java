package com.tokenly.backend.dto.responce.user;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class UserResponse {

    private UUID id;
    private String email;
    private boolean emailVerified;
    private Map<String, Object> customData;
    private Instant createdAt;
}
