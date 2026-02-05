package com.tokenly.backend.service;

import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.enums.ApiKeyStatus;
import com.tokenly.backend.exception.InvalidApiKeyException;
import com.tokenly.backend.exception.ResourceNotFoundException;
import com.tokenly.backend.repository.ApiKeyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiKeyServiceTest {

    @Mock
    private ApiKeyRepository apiKeyRepository;

    @InjectMocks
    private ApiKeyService apiKeyService;

    private Application testApplication;
    private ApiKey testApiKey;

    @BeforeEach
    void setUp() {
        testApplication = new Application();
        testApplication.setId(1L);
        testApplication.setAppName("Test App");

        testApiKey = new ApiKey();
        testApiKey.setId(1L);
        testApiKey.setKeyValue("tk_test_123456");
        testApiKey.setApplication(testApplication);
        testApiKey.setStatus(ApiKeyStatus.ACTIVE);
        testApiKey.setCreatedAt(LocalDateTime.now());
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
    void validateApiKey_WithValidKey_ShouldReturnApplication() {
        // Arrange
        when(apiKeyRepository.findByKeyValue(anyString())).thenReturn(Optional.of(testApiKey));

        // Act
        Application result = apiKeyService.validateApiKey("tk_test_123456");

        // Assert
        assertNotNull(result);
        assertEquals(testApplication, result);
        verify(apiKeyRepository).save(any(ApiKey.class)); // Updates last used
    }

    @Test
    void validateApiKey_WithInvalidKey_ShouldThrowException() {
        // Arrange
        when(apiKeyRepository.findByKeyValue(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(InvalidApiKeyException.class, () -> 
            apiKeyService.validateApiKey("invalid_key")
        );
    }

    @Test
    void validateApiKey_WithRevokedKey_ShouldThrowException() {
        // Arrange
        testApiKey.setStatus(ApiKeyStatus.REVOKED);
        when(apiKeyRepository.findByKeyValue(anyString())).thenReturn(Optional.of(testApiKey));

        // Act & Assert
        assertThrows(InvalidApiKeyException.class, () -> 
            apiKeyService.validateApiKey("tk_test_123456")
        );
    }

    @Test
    void validateApiKey_WithExpiredKey_ShouldThrowException() {
        // Arrange
        testApiKey.setExpiresAt(LocalDateTime.now().minusDays(1));
        when(apiKeyRepository.findByKeyValue(anyString())).thenReturn(Optional.of(testApiKey));

        // Act & Assert
        assertThrows(InvalidApiKeyException.class, () -> 
            apiKeyService.validateApiKey("tk_test_123456")
        );
    }

    @Test
    void getAllByApplication_ShouldReturnApiKeys() {
        // Arrange
        List<ApiKey> apiKeys = Arrays.asList(testApiKey);
        when(apiKeyRepository.findByApplicationId(1L)).thenReturn(apiKeys);

        // Act
        List<ApiKey> result = apiKeyService.getAllByApplication(testApplication);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(apiKeyRepository).findByApplicationId(1L);
    }

    @Test
    void revokeApiKey_WithValidId_ShouldRevokeKey() {
        // Arrange
        when(apiKeyRepository.findById(1L)).thenReturn(Optional.of(testApiKey));
        when(apiKeyRepository.save(any(ApiKey.class))).thenReturn(testApiKey);

        // Act
        ApiKey result = apiKeyService.revokeApiKey(1L);

        // Assert
        assertNotNull(result);
        assertEquals(ApiKeyStatus.REVOKED, result.getStatus());
        verify(apiKeyRepository).save(any(ApiKey.class));
    }

    @Test
    void revokeApiKey_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(apiKeyRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> 
            apiKeyService.revokeApiKey(999L)
        );
    }

    @Test
    void deleteApiKey_WithValidId_ShouldDeleteKey() {
        // Arrange
        when(apiKeyRepository.findById(1L)).thenReturn(Optional.of(testApiKey));
        doNothing().when(apiKeyRepository).deleteById(1L);

        // Act
        apiKeyService.deleteApiKey(1L);

        // Assert
        verify(apiKeyRepository).deleteById(1L);
    }

    @Test
    void rotateApiKey_ShouldRevokeOldAndCreateNew() {
        // Arrange
        when(apiKeyRepository.findById(1L)).thenReturn(Optional.of(testApiKey));
        when(apiKeyRepository.save(any(ApiKey.class))).thenReturn(testApiKey);

        // Act
        ApiKey result = apiKeyService.rotateApiKey(1L);

        // Assert
        assertNotNull(result);
        verify(apiKeyRepository, times(2)).save(any(ApiKey.class));
    }
}
