package com.tokenly.backend.service;

import com.tokenly.backend.entity.Session;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

    private User testUser;
    private Session testSession;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@test.com");

        testSession = new Session();
        testSession.setId(1L);
        testSession.setUser(testUser);
        testSession.setRefreshToken("refreshToken123");
        testSession.setActive(true);
        testSession.setCreatedAt(LocalDateTime.now());
        testSession.setExpiresAt(LocalDateTime.now().plusDays(7));
    }

    @Test
    void createSession_ShouldCreateNewSession() {
        // Arrange
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // Act
        Session result = sessionService.createSession(testUser, "refreshToken123");

        // Assert
        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertTrue(result.isActive());
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void findByRefreshToken_WithValidToken_ShouldReturnSession() {
        // Arrange
        when(sessionRepository.findByRefreshTokenAndActiveTrue(anyString()))
            .thenReturn(Optional.of(testSession));

        // Act
        Optional<Session> result = sessionService.findByRefreshToken("refreshToken123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("refreshToken123", result.get().getRefreshToken());
    }

    @Test
    void findByRefreshToken_WithInvalidToken_ShouldReturnEmpty() {
        // Arrange
        when(sessionRepository.findByRefreshTokenAndActiveTrue(anyString()))
            .thenReturn(Optional.empty());

        // Act
        Optional<Session> result = sessionService.findByRefreshToken("invalidToken");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void invalidateSession_ShouldDeactivateSession() {
        // Arrange
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // Act
        sessionService.invalidateSession(testSession);

        // Assert
        assertFalse(testSession.isActive());
        verify(sessionRepository).save(testSession);
    }

    @Test
    void invalidateAllUserSessions_ShouldDeactivateAllSessions() {
        // Arrange
        List<Session> sessions = Arrays.asList(testSession, new Session());
        when(sessionRepository.findByUserIdAndActiveTrue(1L)).thenReturn(sessions);

        // Act
        sessionService.invalidateAllUserSessions(testUser);

        // Assert
        verify(sessionRepository).saveAll(anyList());
    }

    @Test
    void deleteExpiredSessions_ShouldRemoveExpiredSessions() {
        // Arrange
        doNothing().when(sessionRepository).deleteByExpiresAtBefore(any(LocalDateTime.class));

        // Act
        sessionService.deleteExpiredSessions();

        // Assert
        verify(sessionRepository).deleteByExpiresAtBefore(any(LocalDateTime.class));
    }

    @Test
    void getActiveSessionsByUser_ShouldReturnActiveSessions() {
        // Arrange
        List<Session> sessions = Arrays.asList(testSession);
        when(sessionRepository.findByUserIdAndActiveTrue(1L)).thenReturn(sessions);

        // Act
        List<Session> result = sessionService.getActiveSessionsByUser(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(sessionRepository).findByUserIdAndActiveTrue(1L);
    }

    @Test
    void isSessionValid_WithValidSession_ShouldReturnTrue() {
        // Act
        boolean result = sessionService.isSessionValid(testSession);

        // Assert
        assertTrue(result);
    }

    @Test
    void isSessionValid_WithExpiredSession_ShouldReturnFalse() {
        // Arrange
        testSession.setExpiresAt(LocalDateTime.now().minusDays(1));

        // Act
        boolean result = sessionService.isSessionValid(testSession);

        // Assert
        assertFalse(result);
    }

    @Test
    void isSessionValid_WithInactiveSession_ShouldReturnFalse() {
        // Arrange
        testSession.setActive(false);

        // Act
        boolean result = sessionService.isSessionValid(testSession);

        // Assert
        assertFalse(result);
    }
}
