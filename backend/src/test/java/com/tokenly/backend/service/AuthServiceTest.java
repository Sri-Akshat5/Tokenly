package com.tokenly.backend.service;

import com.tokenly.backend.dto.LoginRequest;
import com.tokenly.backend.dto.SignupRequest;
import com.tokenly.backend.dto.TokenResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.entity.Session;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.Environment;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.exception.DuplicateEmailException;
import com.tokenly.backend.exception.InvalidCredentialsException;
import com.tokenly.backend.repository.UserRepository;
import com.tokenly.backend.security.JwtService;
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
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private SessionService sessionService;

    @Mock
    private LoginLogService loginLogService;

    @InjectMocks
    private AuthService authService;

    private Application testApplication;
    private Client testClient;
    private User testUser;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(1L);
        testClient.setEmail("client@test.com");
        testClient.setName("Test Client");

        testApplication = new Application();
        testApplication.setId(1L);
        testApplication.setAppName("Test App");
        testApplication.setClient(testClient);
        testApplication.setEnvironment(Environment.DEVELOPMENT);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@test.com");
        testUser.setPassword("hashedPassword");
        testUser.setApplication(testApplication);
        testUser.setStatus(UserStatus.ACTIVE);
    }

    @Test
    void signup_WithValidRequest_ShouldCreateUser() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setEmail("newuser@test.com");
        request.setPassword("password123");

        when(userRepository.existsByEmailAndApplicationId(anyString(), anyLong())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Act
        User result = authService.signup(request, testApplication);

        // Assert
        assertNotNull(result);
        assertEquals("newuser@test.com", result.getEmail());
        assertEquals(testApplication, result.getApplication());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void signup_WithDuplicateEmail_ShouldThrowException() {
        // Arrange
        SignupRequest request = new SignupRequest();
        request.setEmail("existing@test.com");
        request.setPassword("password123");

        when(userRepository.existsByEmailAndApplicationId(anyString(), anyLong())).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateEmailException.class, () -> 
            authService.signup(request, testApplication)
        );
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnTokenResponse() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmailAndApplicationId(anyString(), anyLong()))
            .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refreshToken");
        when(sessionService.createSession(any(User.class), anyString())).thenReturn(new Session());

        // Act
        TokenResponse result = authService.login(request, testApplication, "127.0.0.1", "TestAgent");

        // Assert
        assertNotNull(result);
        assertEquals("accessToken", result.getAccessToken());
        assertEquals("refreshToken", result.getRefreshToken());
        verify(sessionService).createSession(any(User.class), anyString());
        verify(loginLogService).logSuccessfulLogin(any(User.class), anyString(), anyString());
    }

    @Test
    void login_WithInvalidPassword_ShouldThrowException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("wrongPassword");

        when(userRepository.findByEmailAndApplicationId(anyString(), anyLong()))
            .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> 
            authService.login(request, testApplication, "127.0.0.1", "TestAgent")
        );
        verify(loginLogService).logFailedLogin(anyString(), anyLong(), anyString(), anyString(), anyString());
    }

    @Test
    void login_WithNonExistentUser_ShouldThrowException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmailAndApplicationId(anyString(), anyLong()))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> 
            authService.login(request, testApplication, "127.0.0.1", "TestAgent")
        );
    }

    @Test
    void login_WithBlockedUser_ShouldThrowException() {
        // Arrange
        testUser.setStatus(UserStatus.BLOCKED);
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmailAndApplicationId(anyString(), anyLong()))
            .thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> 
            authService.login(request, testApplication, "127.0.0.1", "TestAgent")
        );
    }

    @Test
    void logout_WithValidSession_ShouldInvalidateSession() {
        // Arrange
        String refreshToken = "validToken";
        Session session = new Session();
        session.setUser(testUser);

        when(sessionService.findByRefreshToken(refreshToken)).thenReturn(Optional.of(session));

        // Act
        authService.logout(refreshToken);

        // Assert
        verify(sessionService).invalidateSession(session);
    }

    @Test
    void refreshToken_WithValidToken_ShouldReturnNewTokens() {
        // Arrange
        String oldRefreshToken = "oldToken";
        Session session = new Session();
        session.setUser(testUser);

        when(sessionService.findByRefreshToken(oldRefreshToken)).thenReturn(Optional.of(session));
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("newAccessToken");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("newRefreshToken");

        // Act
        TokenResponse result = authService.refreshToken(oldRefreshToken);

        // Assert
        assertNotNull(result);
        assertEquals("newAccessToken", result.getAccessToken());
        assertEquals("newRefreshToken", result.getRefreshToken());
        verify(sessionService).invalidateSession(session);
        verify(sessionService).createSession(any(User.class), anyString());
    }
}
