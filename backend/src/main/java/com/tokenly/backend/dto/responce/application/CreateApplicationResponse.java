package com.tokenly.backend.dto.responce.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CreateApplicationResponse {
    private final ApplicationResponse application;
    private final String apiKey; // Only shown on creation, never again
}
