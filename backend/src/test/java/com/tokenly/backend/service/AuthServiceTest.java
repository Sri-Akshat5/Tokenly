package com.tokenly.backend.service;

import com.tokenly.backend.config.AppProperties;
import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.security.authflow.AuthFlow;
import com.tokenly.backend.security.authflow.AuthFlowResolver;
import com.tokenly.backend.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthFlowResolver authFlowResolver;

    @Mock
    private SessionService sessionService;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private EmailService emailService;

    @Mock
    private AppProperties appProperties;

    @Mock
    private AuthFlow authFlow;

    @InjectMocks
    private AuthServiceImpl authService;

    private Application testApplication;

    @BeforeEach
    void setUp() {
        testApplication = new Application();
        testApplication.setId(UUID.randomUUID());
        testApplication.setAppName("Test App");
        testApplication.setEnvironment(ApplicationEnvironment.DEV);
    }

    @Test
    void login_ShouldDelegateToResolverAndFlow() {
        // Arrange
        UserLoginRequest request = new UserLoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        AuthResponse expectedResponse = new AuthResponse("accessToken", "refreshToken");

        when(authFlowResolver.resolve(testApplication)).thenReturn(authFlow);
        when(authFlow.login(testApplication, request)).thenReturn(expectedResponse);

        // Act
        AuthResponse result = authService.login(testApplication, request);

        // Assert
        assertNotNull(result);
        assertEquals("accessToken", result.getAccessToken());
        verify(authFlowResolver).resolve(testApplication);
        verify(authFlow).login(testApplication, request);
    }

    @Test
    void requestOtp_ShouldStoreInRedisAndSendEmail() {
        // Arrange
        String email = "user@test.com";
        ValueOperations<String, String> valueOps = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        
        AppProperties.Auth auth = mock(AppProperties.Auth.class);
        when(appProperties.getAuth()).thenReturn(auth);
        when(auth.getOtpExpiryMinutes()).thenReturn(10);

        // Act
        authService.requestOtp(testApplication, email);

        // Assert
        verify(valueOps).set(anyString(), anyString(), any());
        verify(emailService).sendOtpEmail(eq(email), anyString(), eq("Test App"));
    }
}
