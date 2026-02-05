package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.client.ClientSignupRequest;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.repository.ClientRepository;
import com.tokenly.backend.service.impl.ClientServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ClientServiceImpl clientService;

    private Client testClient;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(UUID.randomUUID());
        testClient.setEmail("client@test.com");
        testClient.setPasswordHash("hashedPassword");
        testClient.setCompanyName("Test Client");
    }

    @Test
    void signup_WithValidData_ShouldCreateClient() {
        // Arrange
        ClientSignupRequest request = new ClientSignupRequest();
        request.setEmail("client@test.com");
        request.setPassword("password123");
        request.setCompanyName("Test Client");

        when(clientRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        // Act
        Client result = clientService.signup(request);

        // Assert
        assertNotNull(result);
        assertEquals("client@test.com", result.getEmail());
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnClient() {
        // Arrange
        when(clientRepository.findByEmail("client@test.com")).thenReturn(Optional.of(testClient));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);

        // Act
        Client result = clientService.login("client@test.com", "password123");

        // Assert
        assertNotNull(result);
        assertEquals("client@test.com", result.getEmail());
    }

    @Test
    void login_WithInvalidCredentials_ShouldThrowException() {
        // Arrange
        when(clientRepository.findByEmail("client@test.com")).thenReturn(Optional.of(testClient));
        when(passwordEncoder.matches("wrong", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> 
            clientService.login("client@test.com", "wrong")
        );
    }
}
