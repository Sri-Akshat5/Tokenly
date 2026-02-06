package com.tokenly.backend.service;

import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.repository.ApiKeyRepository;
import com.tokenly.backend.service.impl.ApiKeyServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiKeyServiceTest {

    @Mock
    private ApiKeyRepository apiKeyRepository;

    @InjectMocks
    private ApiKeyServiceImpl apiKeyService;

    private Application testApplication;
    private ApiKey testApiKey;
    private UUID testApiKeyId;

    @BeforeEach
    void setUp() {
        testApplication = new Application();
        testApplication.setId(UUID.randomUUID());
        testApplication.setAppName("Test App");

        testApiKeyId = UUID.randomUUID();
        testApiKey = new ApiKey();
        testApiKey.setId(testApiKeyId);
        testApiKey.setPublicKey("tk_test_123456");
        testApiKey.setApplication(testApplication);
        testApiKey.setActive(true);
        testApiKey.setCreatedAt(Instant.now());
    }

    @Test
    void generateApiKey_ShouldCreateNewApiKey() {
        // Arrange
        when(apiKeyRepository.save(any(ApiKey.class))).thenReturn(testApiKey);

        // Act
        ApiKey result = apiKeyService.generateApiKey(testApplication, "Test Key");

        // Assert
        assertNotNull(result);
        assertEquals(testApplication, result.getApplication());
        verify(apiKeyRepository).save(any(ApiKey.class));
    }

    @Test
    void validateApiKey_WithValidKey_ShouldReturnApiKey() {
        // Arrange
        when(apiKeyRepository.findByPublicKey(anyString())).thenReturn(Optional.of(testApiKey));

        // Act
        Optional<ApiKey> result = apiKeyService.validateApiKey("tk_test_123456");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testApiKey, result.get());
    }

    @Test
    void validateApiKey_WithInvalidKey_ShouldReturnEmpty() {
        // Arrange
        when(apiKeyRepository.findByPublicKey(anyString())).thenReturn(Optional.empty());

        // Act
        Optional<ApiKey> result = apiKeyService.validateApiKey("invalid_key");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void listApiKeys_ShouldReturnApiKeys() {
        // Arrange
        List<ApiKey> apiKeys = Arrays.asList(testApiKey);
        when(apiKeyRepository.findByApplication(testApplication)).thenReturn(apiKeys);

        // Act
        List<ApiKey> result = apiKeyService.listApiKeys(testApplication);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void revokeApiKey_WithValidId_ShouldRevokeKey() {
        // Arrange
        when(apiKeyRepository.findById(testApiKeyId)).thenReturn(Optional.of(testApiKey));
        when(apiKeyRepository.save(any(ApiKey.class))).thenReturn(testApiKey);

        // Act
        apiKeyService.revokeApiKey(testApiKeyId);

        // Assert
        assertFalse(testApiKey.isActive());
        verify(apiKeyRepository).save(testApiKey);
    }
}
