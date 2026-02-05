package com.tokenly.backend.entity;

import com.tokenly.backend.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_email_app",
                        columnNames = {"application_id", "email"}
                )
        }
)
@Getter
@Setter
public class User extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String passwordHash;

    // Email verification
    @JsonIgnore
    private String verificationToken;
    
    @JsonIgnore
    private Instant verificationTokenExpiry;

    // Password reset
    @JsonIgnore
    private String passwordResetToken;
    
    @JsonIgnore
    private Instant passwordResetTokenExpiry;

    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(columnDefinition = "TEXT")
    private String customData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private UserStatus status = UserStatus.ACTIVE;
}