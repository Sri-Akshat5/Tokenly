package com.tokenly.backend.dto.responce.client;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ClientResponse {

    private UUID id;
    private String companyName;
    private String email;
    private boolean emailVerified;
    private String token; // JWT token for authentication
}
