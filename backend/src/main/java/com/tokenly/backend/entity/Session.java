package com.tokenly.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "sessions",
        indexes = {
                @Index(name = "idx_session_user", columnList = "user_id"),
                @Index(name = "idx_session_token_hash", columnList = "refreshTokenHash"),
                @Index(name = "idx_session_family", columnList = "tokenFamily"),
                @Index(name = "idx_session_user_revoked", columnList = "user_id,revoked,expiresAt")
        }
)
@Getter
@Setter
public class Session extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @JsonIgnore
    @Column(nullable = false, unique = true)
    private String refreshTokenHash;

    // Token family for rotation tracking (all rotations share same family)
    @Column(nullable = false)
    private UUID tokenFamily;

    // Revocation tracking
    @Column(nullable = false)
    private boolean revoked = false;

    private Instant revokedAt;

    // Audit fields
    private String ipAddress;
    private String userAgent;
    private Instant lastUsedAt;

    @Column(nullable = false)
    private Instant expiresAt;
}