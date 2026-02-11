package com.tokenly.backend.dto.responce.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiRequestLogResponse {
    private UUID id;
    private String applicationName;
    private String endpoint;
    private String method;
    private Boolean success;
    private Integer statusCode;
    private String errorMessage;
    private Long responseTimeMs;
    private LocalDateTime loggedAt;
}
