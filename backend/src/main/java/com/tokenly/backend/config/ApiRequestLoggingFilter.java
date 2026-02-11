package com.tokenly.backend.config;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.service.ApiRequestLogService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

@Slf4j
@Component
@Order(2) // Run after authentication filter
@RequiredArgsConstructor
public class ApiRequestLoggingFilter extends OncePerRequestFilter {

    private final ApiRequestLogService apiRequestLogService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Only log API endpoints, exclude admin endpoints and OPTIONS method
        // Only log Authentication API endpoints (Login, Signup, Verify, etc.)
        // As per user request: "record only logs which we are giving curl in the integration"
        String path = request.getRequestURI();
        if (!path.startsWith("/api/auth/") || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        long startTime = System.currentTimeMillis();
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(request, responseWrapper);
        } finally {
            long responseTime = System.currentTimeMillis() - startTime;

            // Get client and application from request attributes (set by auth filter)
            Client client = (Client) request.getAttribute("client");
            Application application = (Application) request.getAttribute("application");

            if (client != null && application != null) {
                int statusCode = responseWrapper.getStatus();
                boolean success = statusCode >= 200 && statusCode < 400;
                String errorMessage = success ? null : "HTTP " + statusCode;

                apiRequestLogService.logRequest(
                        client,
                        application,
                        path,
                        request.getMethod(),
                        success,
                        statusCode,
                        errorMessage,
                        responseTime
                );
            }

            responseWrapper.copyBodyToResponse();
        }
    }
}
