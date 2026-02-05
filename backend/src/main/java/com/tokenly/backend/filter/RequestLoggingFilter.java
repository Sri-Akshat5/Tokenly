package com.tokenly.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@Order(1)
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request, 1024);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        try {
            // Log incoming request
            log.info("→ {} {} from IP: {} | User-Agent: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    getClientIp(request),
                    request.getHeader("User-Agent")
            );

            // Log request headers (DEBUG level)
            if (log.isDebugEnabled()) {
                log.debug("Request Headers: API-Key={}, Content-Type={}",
                        request.getHeader("X-API-Key") != null ? "***" + request.getHeader("X-API-Key").substring(Math.max(0, request.getHeader("X-API-Key").length() - 6)) : "none",
                        request.getHeader("Content-Type")
                );
            }

            // Execute request
            filterChain.doFilter(wrappedRequest, wrappedResponse);

        } finally {
            long duration = System.currentTimeMillis() - startTime;

            // Log response
            log.info("← {} {} | Status: {} | Duration: {}ms",
                    request.getMethod(),
                    request.getRequestURI(),
                    wrappedResponse.getStatus(),
                    duration
            );

            // Log slow requests as WARNING
            if (duration > 1000) {
                log.warn("SLOW REQUEST: {} {} took {}ms", 
                        request.getMethod(), 
                        request.getRequestURI(), 
                        duration
                );
            }

            // Log errors at ERROR level
            if (wrappedResponse.getStatus() >= 400) {
                log.error("REQUEST FAILED: {} {} | Status: {} | IP: {}",
                        request.getMethod(),
                        request.getRequestURI(),
                        wrappedResponse.getStatus(),
                        getClientIp(request)
                );
            }

            wrappedResponse.copyBodyToResponse();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
