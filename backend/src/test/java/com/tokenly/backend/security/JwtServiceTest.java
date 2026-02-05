package com.tokenly.backend.security;

import com.tokenly.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;
    private User testUser;
    private String secretKey = "testSecretKeyThatIsLongEnoughForHS256AlgorithmToWork123456";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600000L); // 1 hour
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 604800000L); // 7 days

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
    }

    @Test
    void generateAccessToken_ShouldGenerateValidToken() {
        // Act
        String token = jwtService.generateAccessToken(testUser);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Verify token can be parsed
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        
        assertEquals("1", claims.getSubject());
        assertEquals("test@example.com", claims.get("email"));
    }

    @Test
    void generateRefreshToken_ShouldGenerateValidToken() {
        // Act
        String token = jwtService.generateRefreshToken(testUser);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Verify token can be parsed
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        
        assertEquals("1", claims.getSubject());
    }

    @Test
    void extractUserId_FromValidToken_ShouldReturnUserId() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        Long userId = jwtService.extractUserId(token);

        // Assert
        assertNotNull(userId);
        assertEquals(1L, userId);
    }

    @Test
    void extractEmail_FromValidToken_ShouldReturnEmail() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        String email = jwtService.extractEmail(token);

        // Assert
        assertNotNull(email);
        assertEquals("test@example.com", email);
    }

    @Test
    void isTokenValid_WithValidToken_ShouldReturnTrue() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void isTokenValid_WithExpiredToken_ShouldReturnFalse() {
        // Arrange
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", -1000L);
        String token = jwtService.generateAccessToken(testUser);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600000L);

        // Act
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void isTokenValid_WithDifferentUser_ShouldReturnFalse() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);
        User differentUser = new User();
        differentUser.setId(2L);
        differentUser.setEmail("different@example.com");

        // Act
        boolean isValid = jwtService.isTokenValid(token, differentUser);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void isTokenExpired_WithValidToken_ShouldReturnFalse() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        boolean isExpired = jwtService.isTokenExpired(token);

        // Assert
        assertFalse(isExpired);
    }

    @Test
    void getExpirationDate_ShouldReturnFutureDate() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        Date expirationDate = jwtService.getExpirationDate(token);

        // Assert
        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }
}
