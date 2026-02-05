package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.admin.UpdateAuthConfigRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.exception.ForbiddenException;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.repository.AuthConfigRepository;
import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import com.tokenly.backend.security.validator.AuthConfigValidator;
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
    private final AuthConfigValidator authConfigValidator;

    @GetMapping
    public ResponseEntity<ApiResponse<AuthConfig>> getAuthConfig(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Admin fetching AuthConfig for application: {}", application.getAppName());
        
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
                
        return ResponseEntity.ok(ApiResponse.success(config));
    }

    @PutMapping
    public ApiResponse<?> updateAuthConfig(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @Valid @RequestBody UpdateAuthConfigRequest request
    ) {
        Application app = getAndVerifyApplication(client, applicationId);

        AuthConfig config = authConfigRepository
                .findByApplication(app)
                .orElseGet(() -> {
                    AuthConfig c = new AuthConfig();
                    c.setApplication(app);
                    return c;
                });

        config.setAuthMode(request.getAuthMode());
        config.setLoginMethod(request.getLoginMethod());
        config.setPasswordHashAlgorithm(request.getPasswordHashAlgorithm());
        config.setAccessTokenTtlMinutes(request.getAccessTokenTtlMinutes());
        config.setRefreshTokenTtlMinutes(request.getRefreshTokenTtlMinutes());
        config.setRefreshTokenEnabled(request.isRefreshTokenEnabled());
        config.setSignupEnabled(request.isSignupEnabled());
        config.setEmailVerificationRequired(request.isEmailVerificationRequired());
        config.setJwtCustomClaims(request.getJwtCustomClaims());
        config.setGoogleClientId(request.getGoogleClientId());
        
        authConfigRepository.save(config);

        return ApiResponse.success("Auth config updated", null);
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
