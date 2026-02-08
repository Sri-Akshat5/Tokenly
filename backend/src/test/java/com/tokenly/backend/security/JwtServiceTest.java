package com.tokenly.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.repository.AuthConfigRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private AuthConfigRepository authConfigRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private JwtService jwtService;

    private User testUser;
    private Application testApplication;
    private final String secretKey = "mySecretKeyMySecretKeyMySecretKeyMySecretKey"; // Must be >= 256 bits

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@example.com");

        testApplication = new Application();
        testApplication.setId(UUID.randomUUID());
        
        when(jwtProperties.getSecret()).thenReturn(secretKey);
        when(jwtProperties.getAccessTokenExpiry()).thenReturn(3600L); // Default fallback
    }

    @Test
    void generateAccessToken_ShouldReturnValidToken() {
        // Act
        String token = jwtService.generateAccessToken(testUser, testApplication);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());

        Jws<Claims> claimsJws = jwtService.validateToken(token);
        assertEquals(testUser.getId().toString(), claimsJws.getBody().getSubject());
        assertEquals(testApplication.getId().toString(), claimsJws.getBody().get("appId"));
        assertEquals(testUser.getEmail(), claimsJws.getBody().get("email"));
    }

    @Test
    void extractUserId_ShouldReturnCorrectId() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser, testApplication);

        // Act
        UUID extractedId = jwtService.extractUserId(token);

        // Assert
        assertEquals(testUser.getId(), extractedId);
    }
    
    // Note: extractApplicationId test removed if method is not present in JwtService, 
    // BUT checking JwtService.java, it seems to exist. If compile fails, I will remove it.
    // Based on previous view_file, JwtService DOES have extractApplicationId.
    @Test
    void extractApplicationId_ShouldReturnCorrectId() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser, testApplication);

        // Act
        // The method in JwtService uses: validateToken(token).getBody().get("appId", String.class) -> UUID.fromString
        UUID extractedAppId = jwtService.extractApplicationId(token);

        // Assert
        assertEquals(testApplication.getId(), extractedAppId);
    }

    @Test
    void generateRefreshToken_ShouldReturnUUIDString() {
        // Act
        String refreshToken = jwtService.generateRefreshToken();

        // Assert
        assertNotNull(refreshToken);
        assertDoesNotThrow(() -> UUID.fromString(refreshToken));
    }
}
