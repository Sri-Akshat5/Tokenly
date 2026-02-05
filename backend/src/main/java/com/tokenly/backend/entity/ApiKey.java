package com.tokenly.backend.entity;

import com.tokenly.backend.enums.ApiKeyScope;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Set;

@Entity
@Table(
        name = "api_keys",
        indexes = {
                @Index(name = "idx_api_public_key", columnList = "publicKey")
        }
)
@Getter
@Setter
public class ApiKey extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(length = 100)
    private String keyName; // "Production Key", "Dev Key", etc.

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, unique = true, length = 255)
    private String publicKey;

    @Column(nullable = false)
    private String secretKeyHash;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private Set<ApiKeyScope> scopes;

    @Column(columnDefinition = "json")
    private String allowedOrigins;

    private Integer rateLimitPerMinute;

    private Instant expiresAt;
}