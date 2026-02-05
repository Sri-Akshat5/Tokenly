package com.tokenly.backend.entity;

import com.tokenly.backend.enums.AuthMode;
import com.tokenly.backend.enums.AuthType;
import com.tokenly.backend.enums.LoginMethod;
import com.tokenly.backend.enums.PasswordHashAlgorithm;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "auth_config")
public class AuthConfig extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private AuthMode authMode;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private LoginMethod loginMethod;

    @Enumerated(EnumType.STRING)
    @Column(length = 32)
    private PasswordHashAlgorithm passwordHashAlgorithm;

    // JWT
    private String jwtSecretHash;
    private Integer accessTokenTtlMinutes;
    private Integer refreshTokenTtlMinutes;
    private boolean refreshTokenEnabled;

    // behavior
    private boolean signupEnabled;
    private boolean emailVerificationRequired;

    @Column(length = 1000)
    private String jwtCustomClaims; // Comma-separated list of user fields or custom field keys

    private String googleClientId;
}
