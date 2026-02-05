package com.tokenly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.dto.request.application.CreateApplicationRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.service.ApplicationService;
import com.tokenly.backend.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private ClientService clientService;

    private Client testClient;
    private Application testApplication;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(1L);
        testClient.setEmail("client@test.com");

        testApplication = new Application();
        testApplication.setId(1L);
        testApplication.setAppName("Test App");
        testApplication.setClient(testClient);
        testApplication.setEnvironment(ApplicationEnvironment.DEV);
    }

    @Test
    @WithMockUser
    void getAllApplications_ShouldReturnList() throws Exception {
        // Arrange
        List<Application> applications = Arrays.asList(testApplication);
        when(clientService.getCurrentClient()).thenReturn(testClient);
        when(applicationService.getAllByClient(any(Client.class))).thenReturn(applications);

        // Act & Assert
        mockMvc.perform(get("/api/applications")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].appName").value("Test App"));
    }

    @Test
    @WithMockUser
    void getApplicationById_WithValidId_ShouldReturnApplication() throws Exception {
        // Arrange
        when(clientService.getCurrentClient()).thenReturn(testClient);
        when(applicationService.findByIdAndClient(eq(1L), any(Client.class)))
            .thenReturn(testApplication);

        // Act & Assert
        mockMvc.perform(get("/api/applications/1")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.appName").value("Test App"));
    }

    @Test
    @WithMockUser
    void createApplication_WithValidRequest_ShouldReturnCreated() throws Exception {
        // Arrange
        CreateApplicationRequest request = new CreateApplicationRequest();
        request.setAppName("New App");
        request.setEnvironment(ApplicationEnvironment.PROD);

        when(clientService.getCurrentClient()).thenReturn(testClient);
        when(applicationService.createApplication(any(CreateApplicationRequest.class), any(Client.class)))
            .thenReturn(testApplication);

        // Act & Assert
        mockMvc.perform(post("/api/applications")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser
    void updateApplication_WithValidRequest_ShouldReturnUpdated() throws Exception {
        // Arrange
        CreateApplicationRequest request = new CreateApplicationRequest();
        request.setAppName("Updated App");
        request.setEnvironment(ApplicationEnvironment.PROD);

        when(clientService.getCurrentClient()).thenReturn(testClient);
        when(applicationService.updateApplication(eq(1L), any(CreateApplicationRequest.class), any(Client.class)))
            .thenReturn(testApplication);

        // Act & Assert
        mockMvc.perform(put("/api/applications/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser
    void deleteApplication_WithValidId_ShouldReturnNoContent() throws Exception {
        // Arrange
        when(clientService.getCurrentClient()).thenReturn(testClient);

        // Act & Assert
        mockMvc.perform(delete("/api/applications/1")
                .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
