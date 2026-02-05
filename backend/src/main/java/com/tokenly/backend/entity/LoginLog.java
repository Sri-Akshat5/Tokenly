package com.tokenly.backend.entity;

import com.tokenly.backend.enums.FailureReason;
import com.tokenly.backend.enums.LoginStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "login_logs",
        indexes = {
                @Index(name = "idx_login_app_time", columnList = "application_id, createdAt")
        }
)
@Getter
@Setter
public class LoginLog extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String emailAttempted;

    private String ipAddress;
    private String userAgent;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private LoginStatus status;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private FailureReason failureReason;
}