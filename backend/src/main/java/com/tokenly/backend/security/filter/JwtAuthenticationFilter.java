package com.tokenly.backend.security.filter;

import com.tokenly.backend.entity.Client;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.ClientRepository;
import com.tokenly.backend.repository.UserRepository;
import com.tokenly.backend.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader(AUTH_HEADER);

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Jws<Claims> claims = jwtService.validateToken(token);
            String tokenType = claims.getBody().get("type", String.class);
            
            // Check if this is a client token (admin portal) or user token (end-user app)
            if ("client".equals(tokenType)) {
                // Client token - for admin portal access
                UUID clientId = UUID.fromString(claims.getBody().getSubject());
                
                // Load the client entity from database
                Client client = clientRepository.findById(clientId)
                        .orElseThrow(() -> new UnauthorizedException("Client not found"));
                
                request.setAttribute("client", client);
                request.setAttribute("clientId", clientId);
                request.setAttribute("isClientToken", true);
                
                // Set Spring Security authentication context
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(client, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
            } else {
                // User token - for end-user app authentication
                UUID userId = UUID.fromString(claims.getBody().getSubject());
                
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new UnauthorizedException("User not found"));
                
                request.setAttribute("user", user);
                request.setAttribute("isClientToken", false);
                
                // Set Spring Security authentication context
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception ex) {
            // Token validation failed - allow request to proceed as anonymous
            // SecurityContextHolder is already empty by default
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
