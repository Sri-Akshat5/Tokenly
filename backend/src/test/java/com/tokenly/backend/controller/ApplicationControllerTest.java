package com.tokenly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.dto.request.application.CreateApplicationRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.service.ApplicationService;
import com.tokenly.backend.service.ClientService;
import com.tokenly.backend.mapper.ApplicationMapper;
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
import java.util.UUID;

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

    @MockBean
    private ApplicationMapper applicationMapper;

    private Client testClient;
    private Application testApplication;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(UUID.randomUUID());
        testClient.setEmail("client@test.com");

        testApplication = new Application();
        testApplication.setId(UUID.randomUUID());
        testApplication.setAppName("Test App");
        testApplication.setClient(testClient);
        testApplication.setEnvironment(ApplicationEnvironment.DEV);
    }

    @Test
    @WithMockUser
    void getAllApplications_ShouldReturnList() throws Exception {
        // Arrange
        List<Application> applications = Arrays.asList(testApplication);
        when(applicationService.getApplicationsByClient(any(Client.class))).thenReturn(applications);

        // Act & Assert
        mockMvc.perform(get("/api/applications")
                .requestAttr("client", testClient) // Inject client into request attribute
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testApplication.getId().toString()))
                .andExpect(jsonPath("$[0].appName").value("Test App"));
    }

    @Test
    @WithMockUser
    void getApplicationById_WithValidId_ShouldReturnApplication() throws Exception {
        // Arrange
        when(applicationService.getApplicationById(any(Client.class), eq(testApplication.getId())))
            .thenReturn(testApplication);

        // Act & Assert
        mockMvc.perform(get("/api/applications/" + testApplication.getId())
                .requestAttr("client", testClient)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testApplication.getId().toString()))
                .andExpect(jsonPath("$.appName").value("Test App"));
    }

    @Test
    @WithMockUser
    void createApplication_WithValidRequest_ShouldReturnCreated() throws Exception {
        // Arrange
        CreateApplicationRequest request = new CreateApplicationRequest();
        request.setAppName("New App");
        request.setEnvironment(ApplicationEnvironment.PROD);

        ApplicationService.ApplicationWithApiKey result = new ApplicationService.ApplicationWithApiKey(testApplication, "api-key");
        
        when(applicationService.createApplication(any(Client.class), any(CreateApplicationRequest.class)))
            .thenReturn(result);

        // Act & Assert
        mockMvc.perform(post("/api/applications")
                .requestAttr("client", testClient)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()) // Contoller returns 200 OK (ApiResponse.success), not 201 Created explicitly in status line usually unless configured
                .andExpect(jsonPath("$.data.application.id").value(testApplication.getId().toString()));
    }

    @Test
    @WithMockUser
    void updateApplication_WithValidRequest_ShouldReturnUpdated() throws Exception {
        // Arrange
        CreateApplicationRequest request = new CreateApplicationRequest();
        request.setAppName("Updated App");
        request.setEnvironment(ApplicationEnvironment.PROD);

        when(applicationService.updateApplication(any(Client.class), eq(testApplication.getId()), any(CreateApplicationRequest.class)))
            .thenReturn(testApplication);

        // Act & Assert
        mockMvc.perform(put("/api/applications/" + testApplication.getId())
                .requestAttr("client", testClient)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(testApplication.getId().toString()));
    }

    @Test
    @WithMockUser
    void deleteApplication_WithValidId_ShouldReturnNoContent() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/applications/" + testApplication.getId())
                .requestAttr("client", testClient)
                .with(csrf()))
                .andExpect(status().isOk()); // Controller returns ApiResponse.success which is 200 OK
    }
}
