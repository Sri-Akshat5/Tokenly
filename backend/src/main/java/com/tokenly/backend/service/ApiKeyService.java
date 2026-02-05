package com.tokenly.backend.service;

import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiKeyService {
    record ApiKeyWithPlaintext(ApiKey apiKey, String publicKey) {}

    Optional<ApiKey> validateApiKey(String publicKey);

    // API Key Management
    List<ApiKey> listApiKeys(Application application);

    ApiKey generateApiKey(Application application, String keyName);

    void revokeApiKey(UUID apiKeyId);

    ApiKeyWithPlaintext generateForApplication(Application application);
}
