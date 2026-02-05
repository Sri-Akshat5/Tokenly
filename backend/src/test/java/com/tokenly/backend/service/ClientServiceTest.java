package com.tokenly.backend.service;

import com.tokenly.backend.entity.Client;
import com.tokenly.backend.exception.DuplicateEmailException;
import com.tokenly.backend.exception.ResourceNotFoundException;
import com.tokenly.backend.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

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
    private ClientService clientService;

    private Client testClient;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(1L);
        testClient.setEmail("client@test.com");
        testClient.setPassword("hashedPassword");
        testClient.setName("Test Client");
    }

    @Test
    void createClient_WithValidData_ShouldCreateClient() {
        // Arrange
        when(clientRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        // Act
        Client result = clientService.createClient("client@test.com", "password123", "Test Client");

        // Assert
        assertNotNull(result);
        assertEquals("client@test.com", result.getEmail());
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void createClient_WithDuplicateEmail_ShouldThrowException() {
        // Arrange
        when(clientRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateEmailException.class, () -> 
            clientService.createClient("existing@test.com", "password", "Test")
        );
        verify(clientRepository, never()).save(any(Client.class));
    }

    @Test
    void findById_WithValidId_ShouldReturnClient() {
        // Arrange
        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));

        // Act
        Client result = clientService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("client@test.com", result.getEmail());
    }

    @Test
    void findById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(clientRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> clientService.findById(999L));
    }

    @Test
    void findByEmail_WithExistingEmail_ShouldReturnClient() {
        // Arrange
        when(clientRepository.findByEmail("client@test.com"))
            .thenReturn(Optional.of(testClient));

        // Act
        Optional<Client> result = clientService.findByEmail("client@test.com");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("client@test.com", result.get().getEmail());
    }

    @Test
    void updateClient_WithValidData_ShouldUpdateClient() {
        // Arrange
        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        // Act
        testClient.setName("Updated Name");
        Client result = clientService.updateClient(testClient);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        verify(clientRepository).save(testClient);
    }

    @Test
    void deleteClient_WithValidId_ShouldDeleteClient() {
        // Arrange
        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));
        doNothing().when(clientRepository).deleteById(1L);

        // Act
        clientService.deleteClient(1L);

        // Assert
        verify(clientRepository).deleteById(1L);
    }

    @Test
    void changePassword_WithValidData_ShouldUpdatePassword() {
        // Arrange
        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));
        when(passwordEncoder.encode(anyString())).thenReturn("newHashedPassword");
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        // Act
        clientService.changePassword(1L, "newPassword");

        // Assert
        verify(passwordEncoder).encode("newPassword");
        verify(clientRepository).save(testClient);
    }
}
