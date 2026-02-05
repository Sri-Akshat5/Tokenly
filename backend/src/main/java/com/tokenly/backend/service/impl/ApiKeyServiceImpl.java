package com.tokenly.backend.service.impl;

import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.enums.ApiKeyScope;
import com.tokenly.backend.repository.ApiKeyRepository;
import com.tokenly.backend.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ApiKeyServiceImpl implements ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ApiKeyWithPlaintext generateForApplication(Application application) {
        // Generate public key (visible to client)
        String publicKey = "pk_" + UUID.randomUUID().toString().replace("-", "");
        
        // Generate secret key (returned once, then hashed)
        String secretKey = "sk_" + UUID.randomUUID().toString().replace("-", "");
        
        ApiKey apiKey = new ApiKey();
        apiKey.setApplication(application);
        apiKey.setPublicKey(publicKey);
        apiKey.setSecretKeyHash(passwordEncoder.encode(secretKey));
        apiKey.setScopes(Set.of(ApiKeyScope.AUTH_READ, ApiKeyScope.AUTH_WRITE, ApiKeyScope.USER_READ, ApiKeyScope.USER_WRITE));
        apiKey.setAllowedOrigins("[\"*\"]"); // Allow all origins by default (stored as JSON array)
        apiKey.setRateLimitPerMinute(60);
        apiKey.setActive(true);
        apiKey.setExpiresAt(Instant.now().plus(365, ChronoUnit.DAYS)); // 1 year

        ApiKey saved = apiKeyRepository.save(apiKey);
        
        // Return both entity and plaintext key (only time client sees it)
        return new ApiKeyWithPlaintext(saved, publicKey);
    }

    @Override
    @Cacheable(value = "apiKeys", key = "#publicKey")
    public java.util.Optional<ApiKey> validateApiKey(String publicKey) {
        log.debug("Validating API key (cache miss): {}", publicKey);
        return apiKeyRepository.findByPublicKey(publicKey)
                .filter(ApiKey::isActive)
                .filter(key -> key.getExpiresAt() == null || key.getExpiresAt().isAfter(Instant.now()));
    }

    @Override
    public java.util.List<ApiKey> listApiKeys(Application application) {
        return apiKeyRepository.findByApplication(application);
    }

    @Override
    @CacheEvict(value = "apiKeys", key = "#result.publicKey")
    public ApiKey generateApiKey(Application application, String keyName) {
        // Generate public key
        String publicKey = "pk_" + (application.getEnvironment().name().toLowerCase()) + "_" + 
                           UUID.randomUUID().toString().replace("-", "");

        ApiKey apiKey = new ApiKey();
        apiKey.setApplication(application);
        apiKey.setKeyName(keyName);
        apiKey.setPublicKey(publicKey);
        apiKey.setSecretKeyHash(passwordEncoder.encode(UUID.randomUUID().toString())); // Hash placeholder
        apiKey.setScopes(Set.of(ApiKeyScope.AUTH_READ, ApiKeyScope.AUTH_WRITE, 
                                ApiKeyScope.USER_READ, ApiKeyScope.USER_WRITE));
        apiKey.setActive(true);
        apiKey.setExpiresAt(Instant.now().plus(365, ChronoUnit.DAYS));

        return apiKeyRepository.save(apiKey);
    }

    @Override
    @CacheEvict(value = "apiKeys", allEntries = true)
    public void revokeApiKey(UUID apiKeyId) {
        apiKeyRepository.findById(apiKeyId).ifPresent(apiKey -> {
            apiKey.setActive(false);
            apiKeyRepository.save(apiKey);
        });
    }
}
