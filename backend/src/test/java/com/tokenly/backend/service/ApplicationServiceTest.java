package com.tokenly.backend.service;

import com.tokenly.backend.dto.ApplicationRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.Environment;
import com.tokenly.backend.exception.ResourceNotFoundException;
import com.tokenly.backend.repository.ApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private Application testApplication;
    private Client testClient;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(1L);
        testClient.setEmail("client@test.com");

        testApplication = new Application();
        testApplication.setId(1L);
        testApplication.setAppName("Test App");
        testApplication.setClient(testClient);
        testApplication.setEnvironment(Environment.DEVELOPMENT);
    }

    @Test
    void createApplication_WithValidRequest_ShouldCreateApplication() {
        // Arrange
        ApplicationRequest request = new ApplicationRequest();
        request.setAppName("New App");
        request.setEnvironment("DEVELOPMENT");

        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> {
            Application app = invocation.getArgument(0);
            app.setId(2L);
            return app;
        });

        // Act
        Application result = applicationService.createApplication(request, testClient);

        // Assert
        assertNotNull(result);
        assertEquals("New App", result.getAppName());
        assertEquals(Environment.DEVELOPMENT, result.getEnvironment());
        assertEquals(testClient, result.getClient());
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    void findById_WithValidId_ShouldReturnApplication() {
        // Arrange
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(testApplication));

        // Act
        Application result = applicationService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test App", result.getAppName());
        verify(applicationRepository).findById(1L);
    }

    @Test
    void findById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(applicationRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> applicationService.findById(999L));
    }

    @Test
    void getAllByClient_ShouldReturnClientApplications() {
        // Arrange
        List<Application> applications = Arrays.asList(testApplication, new Application());
        when(applicationRepository.findByClientId(1L)).thenReturn(applications);

        // Act
        List<Application> result = applicationService.getAllByClient(testClient);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(applicationRepository).findByClientId(1L);
    }

    @Test
    void updateApplication_WithValidData_ShouldUpdateApplication() {
        // Arrange
        ApplicationRequest request = new ApplicationRequest();
        request.setAppName("Updated App");
        request.setEnvironment("PRODUCTION");

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(testApplication));
        when(applicationRepository.save(any(Application.class))).thenReturn(testApplication);

        // Act
        Application result = applicationService.updateApplication(1L, request, testClient);

        // Assert
        assertNotNull(result);
        assertEquals("Updated App", result.getAppName());
        assertEquals(Environment.PRODUCTION, result.getEnvironment());
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    void deleteApplication_WithValidId_ShouldDeleteApplication() {
        // Arrange
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(testApplication));
        doNothing().when(applicationRepository).deleteById(1L);

        // Act
        applicationService.deleteApplication(1L, testClient);

        // Assert
        verify(applicationRepository).deleteById(1L);
    }

    @Test
    void findByIdAndClient_WithValidData_ShouldReturnApplication() {
        // Arrange
        when(applicationRepository.findByIdAndClientId(1L, 1L))
            .thenReturn(Optional.of(testApplication));

        // Act
        Application result = applicationService.findByIdAndClient(1L, testClient);

        // Assert
        assertNotNull(result);
        assertEquals("Test App", result.getAppName());
    }

    @Test
    void findByIdAndClient_WithMismatchedClient_ShouldThrowException() {
        // Arrange
        when(applicationRepository.findByIdAndClientId(1L, 1L))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> 
            applicationService.findByIdAndClient(1L, testClient)
        );
    }
}
