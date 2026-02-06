package com.tokenly.backend.security.filter;

import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.enums.ApplicationStatus;
import com.tokenly.backend.exception.ForbiddenException;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.ApiKeyRepository;
import com.tokenly.backend.security.rate.RateLimitService;
import com.tokenly.backend.security.util.OriginValidator;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ApiKeyFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-KEY";
    
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/api/auth/verify-email",
            "/api/auth/reset-password",
            "/api/clients/login",
            "/api/clients/signup"
    );

    private final ApiKeyRepository apiKeyRepository;
    private final OriginValidator originValidator;
    private final RateLimitService rateLimitService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Skip for CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI().replaceAll("//+", "/");
        
        // Skip API key validation for public endpoints
        if (PUBLIC_ENDPOINTS.contains(path)) {
            return true;
        }
        
        // Skip API key validation for client/admin routes (they use JWT authentication)
        if (path.startsWith("/api/clients/") || 
            path.startsWith("/api/admin/") ||
            path.startsWith("/api/applications")) {
            return true;
        }
        
        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1️⃣ Read API key
        String apiKeyValue = request.getHeader(API_KEY_HEADER);

        if (apiKeyValue == null || apiKeyValue.isBlank()) {
            throw new UnauthorizedException("API key is missing");
        }

        // 2️⃣ Validate API key
        if (!apiKeyValue.startsWith("pk_") && !apiKeyValue.startsWith("sk_")) {
            throw new UnauthorizedException("Invalid API key format");
        }

        ApiKey apiKey = apiKeyRepository
                .findByPublicKeyAndActiveTrue(apiKeyValue)
                .orElseThrow(() -> new UnauthorizedException("Invalid or inactive API key"));

        // 3️⃣ Resolve and validate application
        Application application = apiKey.getApplication();
        if (application == null) {
            throw new UnauthorizedException("Invalid API key (no application)");
        }

        if (application.getStatus() == ApplicationStatus.INACTIVE) {
            throw new UnauthorizedException("Application is inactive");
        }

        // 4️⃣ Rate limiting (API-key scoped)
        int limit = apiKey.getRateLimitPerMinute() == null
                ? 60
                : apiKey.getRateLimitPerMinute();

        boolean allowed = rateLimitService.allowRequest(
                apiKey.getPublicKey(),
                limit
        );

        if (!allowed) {
            throw new ForbiddenException("Rate limit exceeded");
        }

        // 4️⃣ Origin validation (frontend safety)
        String origin = request.getHeader("Origin");

        if (!originValidator.isAllowed(origin, apiKey.getAllowedOrigins())) {
            throw new ForbiddenException("Origin not allowed");
        }

        // 6️⃣ Resolve application (already done in step 3 but keeping for attribute)
        request.setAttribute("application", application);

        // 7️⃣ Continue request
        filterChain.doFilter(request, response);
    }
}
