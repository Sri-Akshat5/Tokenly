package com.tokenly.backend.entity;

import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "applications",
        indexes = {
                @Index(name = "idx_app_client", columnList = "client_id")
        }
)
@Getter
@Setter
public class Application extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false)
    private String appName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ApplicationEnvironment environment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ApplicationStatus status = ApplicationStatus.ACTIVE;

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AuthConfig authConfig;
}