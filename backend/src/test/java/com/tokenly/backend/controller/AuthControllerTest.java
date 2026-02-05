package com.tokenly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.dto.LoginRequest;
import com.tokenly.backend.dto.SignupRequest;
import com.tokenly.backend.dto.TokenResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.Environment;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.service.ApiKeyService;
import com.tokenly.backend.service.ApplicationService;
import com.tokenly.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private ApiKeyService apiKeyService;

    private Application testApplication;
    private User testUser;

    @BeforeEach
    void setUp() {
        testApplication = new Application();
        testApplication.setId(1L);
        testApplication.setAppName("Test App");
        testApplication.setEnvironment(Environment.DEVELOPMENT);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@test.com");
        testUser.setApplication(testApplication);
        testUser.setStatus(UserStatus.ACTIVE);

        when(apiKeyService.validateApiKey(anyString())).thenReturn(testApplication);
    }

    @Test
    void signup_WithValidRequest_ShouldReturnCreated() throws Exception {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setEmail("newuser@test.com");
        request.setPassword("password123");

        when(authService.signup(any(SignupRequest.class), any(Application.class)))
            .thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .header("X-API-Key", "test-api-key")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@test.com"));
    }

    @Test
    void signup_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setEmail("invalid-email");
        request.setPassword("123"); // Too short

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .header("X-API-Key", "test-api-key")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_WithValidCredentials_ShouldReturnTokens() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        TokenResponse tokenResponse = new TokenResponse("accessToken", "refreshToken");

        when(authService.login(any(LoginRequest.class), any(Application.class), anyString(), anyString()))
            .thenReturn(tokenResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .header("X-API-Key", "test-api-key")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.refreshToken").value("refreshToken"));
    }

    @Test
    void login_WithMissingApiKey_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        when(apiKeyService.validateApiKey(anyString())).thenThrow(new RuntimeException("Invalid API key"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logout_WithValidRefreshToken_ShouldReturnNoContent() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout")
                .header("X-API-Key", "test-api-key")
                .param("refreshToken", "validToken"))
                .andExpect(status().isNoContent());
    }

    @Test
    void refreshToken_WithValidToken_ShouldReturnNewTokens() throws Exception {
        // Arrange
        TokenResponse tokenResponse = new TokenResponse("newAccessToken", "newRefreshToken");

        when(authService.refreshToken(anyString())).thenReturn(tokenResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/refresh")
                .header("X-API-Key", "test-api-key")
                .param("refreshToken", "validToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("newAccessToken"))
                .andExpect(jsonPath("$.refreshToken").value("newRefreshToken"));
    }
}
