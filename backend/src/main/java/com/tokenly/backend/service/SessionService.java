package com.tokenly.backend.service;

import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Session;
import com.tokenly.backend.entity.User;

import java.util.UUID;

public interface SessionService {

    /**
     * Validate refresh token and rotate it (invalidate old, issue new)
     */
    AuthResponse validateAndRotateRefreshToken(Application application, String refreshToken);

    /**
     * Create a new session for a user
     */
    Session createSession(User user, Application application, String refreshToken, String ipAddress, String userAgent);

    /**
     * Revoke a specific session
     */
    void revokeSession(UUID sessionId);

    /**
     * Revoke all sessions for a user except the current one
     */
    void revokeAllUserSessions(User user, UUID exceptSessionId);

    /**
     * Revoke all sessions for a user
     */
    void revokeAllUserSessions(User user);

    /**
     * Cleanup expired sessions (for scheduled task)
     */
    void cleanupExpiredSessions();
}
