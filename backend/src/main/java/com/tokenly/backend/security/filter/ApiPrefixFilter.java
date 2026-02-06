package com.tokenly.backend.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class ApiPrefixFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // If path starts with /api or is a static resource or actuator, ignore
        if (path.startsWith("/api") || path.startsWith("/actuator") || path.equals("/") || path.contains(".")) {
            filterChain.doFilter(request, response);
            return;
        }

        // If path is missing /api prefix (e.g. /clients/..., /auth/...), pretend it has it
        if (path.startsWith("/clients") || path.startsWith("/auth")) {
            log.info("ApiPrefixFilter: Detected missing /api prefix for path: {}. Rewriting to /api{}", path, path);
            
            HttpServletRequestWrapper wrappedRequest = new HttpServletRequestWrapper(request) {
                @Override
                public String getRequestURI() {
                    return "/api" + super.getRequestURI();
                }

                @Override
                public String getServletPath() {
                    return "/api" + super.getServletPath();
                }
            };
            
            filterChain.doFilter(wrappedRequest, response);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
