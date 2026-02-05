package com.tokenly.backend.service.impl;

import com.tokenly.backend.dto.request.application.CreateApplicationRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.ApplicationStatus;
import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.enums.AuthType;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.repository.AuthConfigRepository;
import com.tokenly.backend.service.ApiKeyService;
import com.tokenly.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final AuthConfigRepository authConfigRepository;
    private final ApiKeyService apiKeyService;

    @Override
    public ApplicationService.ApplicationWithApiKey createApplication(Client client, CreateApplicationRequest request) {

        // 1️⃣ Create application
        Application app = new Application();
        app.setClient(client);
        app.setAppName(request.getAppName());
        app.setEnvironment(request.getEnvironment());
        app.setStatus(ApplicationStatus.ACTIVE);

        applicationRepository.save(app);

        // 2️⃣ Create DEFAULT auth config (CRITICAL - production-safe defaults)
        AuthConfig authConfig = new AuthConfig();
        authConfig.setApplication(app);
        
        // Use provided settings or defaults
        authConfig.setAuthMode(request.getAuthMode() != null ? request.getAuthMode() : AuthMode.JWT);
        authConfig.setLoginMethod(request.getLoginMethod() != null ? request.getLoginMethod() : LoginMethod.PASSWORD);
        authConfig.setPasswordHashAlgorithm(request.getPasswordHashAlgorithm() != null ? request.getPasswordHashAlgorithm() : PasswordHashAlgorithm.BCRYPT);
        
        authConfig.setAccessTokenTtlMinutes(60); // 1 hour
        authConfig.setRefreshTokenTtlMinutes(43200); // 30 days
        authConfig.setRefreshTokenEnabled(true); // Phase 2: enabled
        authConfig.setSignupEnabled(true);
        authConfig.setEmailVerificationRequired(false); // Phase 1 & 2: simple

        authConfigRepository.save(authConfig);

        // 3️⃣ Auto-generate API key for the application
        ApiKeyService.ApiKeyWithPlaintext apiKeyResult = apiKeyService.generateForApplication(app);

        return new ApplicationService.ApplicationWithApiKey(app, apiKeyResult.publicKey());
    }

    @Override
    public List<Application> getApplicationsByClient(Client client) {
        log.debug("Fetching applications for client: {}", client.getId());
        return applicationRepository.findAllByClient(client);
    }

    @Override
    public Application getApplicationById(Client client, UUID id) {
        log.debug("Fetching application: {} for client: {}", id, client.getId());
        return applicationRepository.findByIdAndClient(id, client)
                .orElseThrow(() -> new IllegalStateException("Application not found or access denied"));
    }

    @Override
    public Application updateApplication(Client client, UUID id, CreateApplicationRequest request) {
        Application application = getApplicationById(client, id);
        
        application.setAppName(request.getAppName());
        application.setEnvironment(request.getEnvironment());
        
        log.info("Updated application: {}", application.getId());
        return applicationRepository.save(application);
    }

    @Override
    public void deleteApplication(Client client, UUID id) {
        Application application = getApplicationById(client, id);
        
        // Soft delete by setting status to inactive
        application.setStatus(ApplicationStatus.INACTIVE);
        applicationRepository.save(application);
        
        log.info("Deleted (soft) application: {}", application.getId());
    }
}
