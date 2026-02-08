package com.tokenly.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.dto.common.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        // Use GlobalExceptionHandler's ErrorResponse format if possible, or simple map
        // But to be consistent with GlobalExceptionHandler:
        com.tokenly.backend.exception.ErrorResponse apiResponse = com.tokenly.backend.exception.ErrorResponse.builder()
                .success(false)
                .message("Unauthorized: " + authException.getMessage())
                .timestamp(java.time.Instant.now())
                .path(request.getRequestURI())
                .build();
        
        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
}
