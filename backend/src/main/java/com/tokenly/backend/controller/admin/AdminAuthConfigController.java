package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.admin.UpdateAuthConfigRequest;
import com.tokenly.backend.dto.responce.auth.AuthConfigResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import com.tokenly.backend.exception.ForbiddenException;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.repository.AuthConfigRepository;
import com.tokenly.backend.mapper.AuthMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin/{applicationId}/auth-config")
@RequiredArgsConstructor
public class AdminAuthConfigController {

    private final ApplicationRepository applicationRepository;
    private final AuthConfigRepository authConfigRepository;
    private final AuthMapper authMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<AuthConfigResponse>> getAuthConfig(
            HttpServletRequest request,
            @PathVariable UUID applicationId
    ) {
        Client client = getClient(request);
        Application application = getAndVerifyApplication(client, applicationId);
        
        AuthConfig config = authConfigRepository.findByApplication(application)
                .orElseGet(() -> {
                    log.warn("AuthConfig missing for application: {}, creating default", application.getAppName());
                    AuthConfig c = new AuthConfig();
                    c.setApplication(application);
                    // Standard defaults
                    c.setAuthMode(AuthMode.JWT);
                    c.setLoginMethod(LoginMethod.PASSWORD);
                    c.setPasswordHashAlgorithm(PasswordHashAlgorithm.BCRYPT);
                    c.setAccessTokenTtlMinutes(60);
                    c.setRefreshTokenTtlMinutes(43200);
                    c.setRefreshTokenEnabled(true);
                    c.setSignupEnabled(true);
                    c.setEmailVerificationRequired(false);
                    return authConfigRepository.save(c);
                });

        return ResponseEntity.ok(ApiResponse.success(authMapper.toResponse(config)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AuthConfigResponse>> updateAuthConfig(
            HttpServletRequest request,
            @PathVariable UUID applicationId,
            @Valid @RequestBody UpdateAuthConfigRequest authConfigRequest
    ) {
        Client client = getClient(request);
        Application application = getAndVerifyApplication(client, applicationId);
        
        AuthConfig config = authConfigRepository.findByApplication(application)
                .orElseGet(() -> {
                    AuthConfig c = new AuthConfig();
                    c.setApplication(application);
                    return c;
                });

        // Update fields from request
        if (authConfigRequest.getAuthMode() != null) config.setAuthMode(authConfigRequest.getAuthMode());
        if (authConfigRequest.getLoginMethod() != null) config.setLoginMethod(authConfigRequest.getLoginMethod());
        if (authConfigRequest.getPasswordHashAlgorithm() != null) config.setPasswordHashAlgorithm(authConfigRequest.getPasswordHashAlgorithm());
        
        config.setAccessTokenTtlMinutes(authConfigRequest.getAccessTokenTtlMinutes());
        config.setRefreshTokenTtlMinutes(authConfigRequest.getRefreshTokenTtlMinutes());
        config.setRefreshTokenEnabled(authConfigRequest.isRefreshTokenEnabled());
        config.setSignupEnabled(authConfigRequest.isSignupEnabled());
        config.setEmailVerificationRequired(authConfigRequest.isEmailVerificationRequired());
        config.setJwtCustomClaims(authConfigRequest.getJwtCustomClaims());
        config.setGoogleClientId(authConfigRequest.getGoogleClientId());
        
        AuthConfig savedConfig = authConfigRepository.save(config);
        
        return ResponseEntity.ok(ApiResponse.success("Auth configuration updated successfully", authMapper.toResponse(savedConfig)));
    }

    private Client getClient(HttpServletRequest request) {
        Client client = (Client) request.getAttribute("client");
        if (client == null) {
             throw new com.tokenly.backend.exception.UnauthorizedException("User not authenticated as client");
        }
        return client;
    }

    private Application getAndVerifyApplication(Client client, UUID applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ForbiddenException("Application not found"));
        
        if (!application.getClient().getId().equals(client.getId())) {
            throw new ForbiddenException("You don't have access to this application");
        }
        
        return application;
    }
}
