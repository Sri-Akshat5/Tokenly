package com.tokenly.backend.exception;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ErrorResponse {

    private boolean success;
    private String message;
    private Instant timestamp;
    private String path;
}
