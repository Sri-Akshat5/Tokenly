package com.tokenly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.request.auth.UserSignupRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.service.*;
import com.tokenly.backend.security.JwtService;
import com.tokenly.backend.mapper.AuthMapper;
import com.tokenly.backend.config.AppProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

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
    private UserService userService;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AuthMapper authMapper;

    @MockBean
    private AppProperties appProperties;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private ApiKeyService apiKeyService;

    private Application testApplication;
    private User testUser;
    private ApiKey testApiKey;

    @BeforeEach
    void setUp() {
        testApplication = new Application();
        testApplication.setId(UUID.randomUUID());
        testApplication.setAppName("Test App");
        testApplication.setEnvironment(ApplicationEnvironment.DEV);

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("user@test.com");
        testUser.setApplication(testApplication);
        testUser.setStatus(UserStatus.ACTIVE);

        testApiKey = new ApiKey();
        testApiKey.setApplication(testApplication);

        when(apiKeyService.validateApiKey(anyString())).thenReturn(Optional.of(testApiKey));
    }

    @Test
    void signup_WithValidRequest_ShouldReturnCreated() throws Exception {
        // Arrange
        UserSignupRequest request = new UserSignupRequest();
        request.setEmail("newuser@test.com");
        request.setPassword("password123");

        when(userService.signup(any(Application.class), any(UserSignupRequest.class)))
            .thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .header("X-API-Key", "test-api-key")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(testUser.getId().toString()))
                .andExpect(jsonPath("$.data.email").value("user@test.com"));
    }

    @Test
    void signup_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Arrange
        UserSignupRequest request = new UserSignupRequest();
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
        UserLoginRequest request = new UserLoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        AuthResponse tokenResponse = AuthResponse.builder()
                .accessToken("accessToken")
                .refreshToken("refreshToken")
                .expiresIn(3600L)
                .build();

        when(authService.login(any(Application.class), any(UserLoginRequest.class)))
            .thenReturn(tokenResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .header("X-API-Key", "test-api-key")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.data.refreshToken").value("refreshToken"));
    }

    @Test
    void login_WithMissingApiKey_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        UserLoginRequest request = new UserLoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        when(apiKeyService.validateApiKey(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()); // Or Forbidden, depending on implementation
    }

    @Test
    void logout_WithValidRefreshToken_ShouldReturnNoContent() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout")
                .header("X-API-Key", "test-api-key")
                .param("refreshToken", "validToken"))
                .andExpect(status().isNoContent()); // Or OK
    }

    @Test
    void refreshToken_WithValidToken_ShouldReturnNewTokens() throws Exception {
        // Arrange
        AuthResponse tokenResponse = AuthResponse.builder()
                .accessToken("newAccessToken")
                .refreshToken("newRefreshToken")
                .expiresIn(3600L)
                .build();

        when(sessionService.validateAndRotateRefreshToken(any(Application.class), anyString())).thenReturn(tokenResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/refresh")
                .header("X-API-Key", "test-api-key")
                .param("refreshToken", "validToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").value("newAccessToken"))
                .andExpect(jsonPath("$.data.refreshToken").value("newRefreshToken"));
    }
}
