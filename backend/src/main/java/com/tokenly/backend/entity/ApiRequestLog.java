package com.tokenly.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "api_request_logs",
        indexes = {
                @Index(name = "idx_client_logged_at", columnList = "client_id,logged_at"),
                @Index(name = "idx_application_logged_at", columnList = "application_id,logged_at"),
                @Index(name = "idx_logged_at", columnList = "logged_at")
        }
)
@Getter
@Setter
public class ApiRequestLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(nullable = false, length = 255)
    private String endpoint;

    @Column(nullable = false, length = 10)
    private String method; // GET, POST, PUT, DELETE, PATCH

    @Column(nullable = false)
    private Boolean success;

    @Column(nullable = false)
    private Integer statusCode;

    @Column(length = 500)
    private String errorMessage;

    @Column(name = "response_time_ms")
    private Long responseTimeMs;

    @Column(name = "logged_at", nullable = false)
    private LocalDateTime loggedAt;
}
