package com.tokenly.backend.security.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OriginValidator {

    private final ObjectMapper objectMapper;

    public boolean isAllowed(String origin, String allowedOriginsJson) {
        // If no restrictions are set, allow all
        if (allowedOriginsJson == null || allowedOriginsJson.isBlank()) {
            return true;
        }

        // Non-browser clients (like curl) often don't send an Origin header
        if (origin == null || origin.isBlank()) {
            return true;
        }

        try {
            List<String> allowedOrigins = objectMapper.readValue(allowedOriginsJson, List.class);
            
            // Supporting wildcard origin
            return allowedOrigins.contains("*") || allowedOrigins.contains(origin);
        } catch (Exception e) {
            // Fallback: if we can't parse or there's an error, default to false for safety
            return false;
        }
    }
}
