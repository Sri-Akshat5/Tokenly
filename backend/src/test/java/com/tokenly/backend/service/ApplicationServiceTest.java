package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.application.CreateApplicationRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.ApplicationEnvironment;
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
import java.util.UUID;

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
    private UUID testAppId;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(UUID.randomUUID());
        testClient.setEmail("client@test.com");

        testAppId = UUID.randomUUID();
        testApplication = new Application();
        testApplication.setId(testAppId);
        testApplication.setAppName("Test App");
        testApplication.setClient(testClient);
        testApplication.setEnvironment(ApplicationEnvironment.DEV);
    }

    @Test
    void createApplication_WithValidRequest_ShouldCreateApplication() {
        // Arrange
        CreateApplicationRequest request = new CreateApplicationRequest();
        request.setAppName("New App");
        request.setEnvironment(ApplicationEnvironment.DEV);

        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> {
            Application app = invocation.getArgument(0);
            app.setId(UUID.randomUUID());
            return app;
        });

        // Act
        ApplicationService.ApplicationWithApiKey result = applicationService.createApplication(testClient, request);

        // Assert
        assertNotNull(result);
        assertEquals("New App", result.application().getAppName());
        assertEquals(ApplicationEnvironment.DEV, result.application().getEnvironment());
        assertEquals(testClient, result.application().getClient());
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    void getApplicationById_WithValidId_ShouldReturnApplication() {
        // Arrange
        when(applicationRepository.findByIdAndClient(testAppId, testClient)).thenReturn(Optional.of(testApplication));

        // Act
        Application result = applicationService.getApplicationById(testClient, testAppId);

        // Assert
        assertNotNull(result);
        assertEquals("Test App", result.getAppName());
    }

    @Test
    void getApplicationsByClient_ShouldReturnClientApplications() {
        // Arrange
        List<Application> applications = Arrays.asList(testApplication, new Application());
        when(applicationRepository.findAllByClient(testClient)).thenReturn(applications);

        // Act
        List<Application> result = applicationService.getApplicationsByClient(testClient);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void updateApplication_WithValidData_ShouldUpdateApplication() {
        // Arrange
        CreateApplicationRequest request = new CreateApplicationRequest();
        request.setAppName("Updated App");
        request.setEnvironment(ApplicationEnvironment.PROD);

        when(applicationRepository.findByIdAndClient(testAppId, testClient)).thenReturn(Optional.of(testApplication));
        when(applicationRepository.save(any(Application.class))).thenReturn(testApplication);

        // Act
        Application result = applicationService.updateApplication(testClient, testAppId, request);

        // Assert
        assertNotNull(result);
        assertEquals("Updated App", result.getAppName());
        assertEquals(ApplicationEnvironment.PROD, result.getEnvironment());
    }

    @Test
    void deleteApplication_WithValidId_ShouldDeleteApplication() {
        // Arrange
        when(applicationRepository.findByIdAndClient(testAppId, testClient)).thenReturn(Optional.of(testApplication));
        doNothing().when(applicationRepository).delete(testApplication);

        // Act
        applicationService.deleteApplication(testClient, testAppId);

        // Assert
        verify(applicationRepository).delete(testApplication);
    }
}
