package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.admin.CreateApiKeyRequest;
import com.tokenly.backend.dto.responce.application.ApiKeyResponse;
import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.exception.ForbiddenException;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.service.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/admin/{applicationId}/api-keys")
@RequiredArgsConstructor
public class AdminApiKeyController {

    private final ApiKeyService apiKeyService;
    private final ApplicationRepository applicationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApiKeyResponse>>> listApiKeys(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Listing API keys for application: {}", application.getAppName());
        List<ApiKeyResponse> keys = apiKeyService.listApiKeys(application).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(keys));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApiKeyResponse>> generateApiKey(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @Valid @RequestBody CreateApiKeyRequest request
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Generating new API key '{}' for application: {}", 
                 request.getKeyName(), application.getAppName());
        ApiKey apiKey = apiKeyService.generateApiKey(application, request.getKeyName());
        
        ApiKeyResponse response = ApiKeyResponse.builder()
                .publicKey(apiKey.getPublicKey())
                .expiresAt(apiKey.getExpiresAt())
                .active(apiKey.isActive())
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("API key generated successfully", response));
    }

    @DeleteMapping("/{keyId}")
    public ResponseEntity<ApiResponse<?>> revokeApiKey(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @PathVariable UUID keyId
    ) {
        getAndVerifyApplication(client, applicationId); // Verify ownership
        log.info("Revoking API key: {}", keyId);
        apiKeyService.revokeApiKey(keyId);
        return ResponseEntity.ok(ApiResponse.success("API key revoked successfully", null));
    }

    private ApiKeyResponse toResponse(ApiKey apiKey) {
        return ApiKeyResponse.builder()
                .publicKey(apiKey.getPublicKey()) // Send full key (frontend handles visual truncation)
                .expiresAt(apiKey.getExpiresAt())
                .active(apiKey.isActive())
                .build();
    }

    private String maskApiKey(String publicKey) {
        // Show only first 10 and last 4 characters for security
        if (publicKey == null || publicKey.length() <= 14) {
            return publicKey;
        }
        return publicKey.substring(0, 10) + "..." + publicKey.substring(publicKey.length() - 4);
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
