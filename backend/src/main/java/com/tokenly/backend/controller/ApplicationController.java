package com.tokenly.backend.controller;

import com.tokenly.backend.config.AppProperties;
import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.application.CreateApplicationRequest;
import com.tokenly.backend.dto.responce.application.ApplicationResponse;
import com.tokenly.backend.dto.responce.application.CreateApplicationResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.mapper.ApplicationMapper;
import com.tokenly.backend.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Application management endpoints")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ApplicationMapper applicationMapper;
    private final AppProperties appProperties;

    @PostMapping
    @Operation(summary = "Create Application", description = "Create a new application for the client")
    public ApiResponse<CreateApplicationResponse> createApplication(
            @RequestAttribute Client client,
            @Valid @RequestBody CreateApplicationRequest request
    ) {
        log.info("Creating application for client: {}", client.getId());
        ApplicationService.ApplicationWithApiKey result = applicationService.createApplication(client, request);
        
        ApplicationResponse appResponse = applicationMapper.toResponse(result.application());
        CreateApplicationResponse response = CreateApplicationResponse.builder()
                .application(appResponse)
                .apiKey(result.apiKey())
                .build();
                
        return ApiResponse.success(response);
    }

    @GetMapping
    @Operation(summary = "List Applications", description = "Get all applications for the logged-in client")
    public ApiResponse<List<ApplicationResponse>> listApplications(
            @RequestAttribute Client client
    ) {
        log.info("Listing applications for client: {}", client.getId());
        List<Application> applications = applicationService.getApplicationsByClient(client);
        List<ApplicationResponse> response = applications.stream()
                .map(applicationMapper::toResponse)
                .toList();
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Application", description = "Get application details by ID")
    public ApiResponse<ApplicationResponse> getApplication(
            @RequestAttribute Client client,
            @PathVariable UUID id
    ) {
        log.info("Getting application: {} for client: {}", id, client.getId());
        Application application = applicationService.getApplicationById(client, id);
        return ApiResponse.success(applicationMapper.toResponse(application));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Application", description = "Update application details")
    public ApiResponse<ApplicationResponse> updateApplication(
            @RequestAttribute Client client,
            @PathVariable UUID id,
            @Valid @RequestBody CreateApplicationRequest request
    ) {
        log.info("Updating application: {} for client: {}", id, client.getId());
        Application application = applicationService.updateApplication(client, id, request);
        return ApiResponse.success(applicationMapper.toResponse(application));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Application", description = "Delete an application")
    public ApiResponse<?> deleteApplication(
            @RequestAttribute Client client,
            @PathVariable UUID id
    ) {
        log.info("Deleting application: {} for client: {}", id, client.getId());
        applicationService.deleteApplication(client, id);
        return ApiResponse.success("Application deleted successfully", null);
    }

    @GetMapping("/{id}/endpoints")
    @Operation(summary = "Get API Endpoints", description = "Get available API endpoints for this application")
    public ApiResponse<Map<String, Object>> getApiEndpoints(
            @RequestAttribute Client client,
            @PathVariable UUID id
    ) {
        log.info("Getting API endpoints for application: {}", id);
        Application application = applicationService.getApplicationById(client, id);
        
        Map<String, Object> endpoints = new HashMap<>();
        
        // Base URL
        String baseUrl = appProperties.getUrl().getBaseBackend() + "/api/auth";
        endpoints.put("baseUrl", baseUrl);
        endpoints.put("applicationId", application.getId());
        
        // Signup endpoint
        Map<String, Object> signup = new HashMap<>();
        signup.put("method", "POST");
        signup.put("url", baseUrl + "/signup");
        signup.put("description", "Register a new user");
        signup.put("headers", Map.of("X-API-Key", "your-api-key", "Content-Type", "application/json"));
        signup.put("body", Map.of(
            "email", "user@example.com",
            "password", "SecurePass123!",
            "customFields", Map.of("key", "value")
        ));
        endpoints.put("signup", signup);
        
        // Login endpoint
        Map<String, Object> login = new HashMap<>();
        login.put("method", "POST");
        login.put("url", baseUrl + "/login");
        login.put("description", "Authenticate user and get tokens");
        login.put("headers", Map.of("X-API-Key", "your-api-key", "Content-Type", "application/json"));
        login.put("body", Map.of(
            "email", "user@example.com",
            "password", "SecurePass123!"
        ));
        login.put("response", Map.of(
            "accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refreshToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "expiresIn", 3600
        ));
        endpoints.put("login", login);
        
        // Get user profile endpoint
        Map<String, Object> profile = new HashMap<>();
        profile.put("method", "GET");
        profile.put("url", baseUrl + "/profile");
        profile.put("description", "Get authenticated user's profile");
        profile.put("headers", Map.of(
            "X-API-Key", "your-api-key",
            "Authorization", "Bearer {accessToken}"
        ));
        endpoints.put("profile", profile);

        // Update Profile
        Map<String, Object> updateProfile = new HashMap<>();
        updateProfile.put("method", "PUT");
        updateProfile.put("url", baseUrl + "/profile");
        updateProfile.put("description", "Update authenticated user's profile");
        updateProfile.put("headers", Map.of("X-API-Key", "your-api-key", "Authorization", "Bearer {accessToken}"));
        updateProfile.put("body", Map.of("firstName", "John", "customField1", "newValue"));
        endpoints.put("updateProfile", updateProfile);

        // Change Password
        Map<String, Object> changePassword = new HashMap<>();
        changePassword.put("method", "PUT");
        changePassword.put("url", baseUrl + "/change-password");
        changePassword.put("description", "Change authenticated user's password");
        changePassword.put("headers", Map.of("X-API-Key", "your-api-key", "Authorization", "Bearer {accessToken}"));
        changePassword.put("body", Map.of("currentPassword", "oldPass", "newPassword", "newPass"));
        endpoints.put("changePassword", changePassword);

        // Logout
        Map<String, Object> logout = new HashMap<>();
        logout.put("method", "POST");
        logout.put("url", baseUrl + "/logout");
        logout.put("description", "Logout user and invalidate current session");
        logout.put("headers", Map.of("X-API-Key", "your-api-key", "Authorization", "Bearer {accessToken}"));
        endpoints.put("logout", logout);

        // Logout All
        Map<String, Object> logoutAll = new HashMap<>();
        logoutAll.put("method", "POST");
        logoutAll.put("url", baseUrl + "/logout-all");
        logoutAll.put("description", "Logout user from all devices");
        logoutAll.put("headers", Map.of("X-API-Key", "your-api-key", "Authorization", "Bearer {accessToken}"));
        endpoints.put("logoutAll", logoutAll);

        // Forgot Password
        Map<String, Object> forgotPassword = new HashMap<>();
        forgotPassword.put("method", "POST");
        forgotPassword.put("url", baseUrl + "/forgot-password");
        forgotPassword.put("description", "Request password reset email");
        forgotPassword.put("headers", Map.of("X-API-Key", "your-api-key"));
        forgotPassword.put("body", Map.of("email", "user@example.com"));
        endpoints.put("forgotPassword", forgotPassword);

        // Reset Password
        Map<String, Object> resetPassword = new HashMap<>();
        resetPassword.put("method", "POST");
        resetPassword.put("url", baseUrl + "/reset-password");
        resetPassword.put("description", "Complete password reset with token");
        resetPassword.put("headers", Map.of("X-API-Key", "your-api-key"));
        resetPassword.put("body", Map.of("token", "reset-token-from-email", "newPassword", "NewSecurePass123!"));
        endpoints.put("resetPassword", resetPassword);
        
        return ApiResponse.success(endpoints);
    }
}
