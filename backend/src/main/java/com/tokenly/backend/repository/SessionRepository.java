package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Session;
import com.tokenly.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {

    Optional<Session> findByRefreshTokenHashAndRevokedFalse(String refreshTokenHash);

    List<Session> findAllByUserAndRevokedFalse(User user);

    List<Session> findAllByTokenFamilyAndRevokedFalse(UUID tokenFamily);

    @Modifying
    @Query("UPDATE Session s SET s.revoked = true, s.revokedAt = :revokedAt WHERE s.user = :user AND s.id != :exceptSessionId AND s.revoked = false")
    void revokeAllUserSessionsExcept(User user, UUID exceptSessionId, Instant revokedAt);

    @Modifying
    @Query("UPDATE Session s SET s.revoked = true, s.revokedAt = :revokedAt WHERE s.user = :user AND s.revoked = false")
    void revokeAllUserSessions(User user, Instant revokedAt);

    @Modifying
    @Query("UPDATE Session s SET s.revoked = true, s.revokedAt = :revokedAt WHERE s.tokenFamily = :tokenFamily AND s.revoked = false")
    void revokeTokenFamily(UUID tokenFamily, Instant revokedAt);

    void deleteByExpiresAtBeforeAndRevokedTrue(Instant expiryThreshold);

    long countByApplicationAndRevokedFalse(Application application);
}
