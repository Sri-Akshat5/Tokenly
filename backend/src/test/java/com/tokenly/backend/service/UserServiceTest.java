package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.auth.UserSignupRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.repository.UserRepository;
import com.tokenly.backend.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private Application testApplication;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        testApplication = new Application();
        testApplication.setId(UUID.randomUUID());
        testApplication.setAppName("Test App");

        testUserId = UUID.randomUUID();
        testUser = new User();
        testUser.setId(testUserId);
        testUser.setEmail("user@test.com");
        testUser.setApplication(testApplication);
        testUser.setStatus(UserStatus.ACTIVE);
    }

    @Test
    void getUserById_WithValidId_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserById(testApplication, testUserId);

        // Assert
        assertNotNull(result);
        assertEquals("user@test.com", result.getEmail());
    }

    @Test
    void findByEmail_WithValidData_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByApplicationAndEmail(testApplication, "user@test.com"))
            .thenReturn(Optional.of(testUser));

        // Act
        User result = userService.findByEmail(testApplication, "user@test.com");

        // Assert
        assertNotNull(result);
        assertEquals("user@test.com", result.getEmail());
    }

    @Test
    void signup_WithValidRequest_ShouldCreateUser() {
        // Arrange
        UserSignupRequest request = new UserSignupRequest();
        request.setEmail("new@test.com");
        request.setPassword("password123");

        when(userRepository.existsByApplicationAndEmail(any(Application.class), anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        User result = userService.signup(testApplication, request);

        // Assert
        assertNotNull(result);
        assertEquals("new@test.com", result.getEmail());
        verify(userRepository).save(any(User.class));
    }
}
