package com.tokenly.backend.entity;

import com.tokenly.backend.enums.ClientStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "clients",
        indexes = {
                @Index(name = "idx_client_email", columnList = "email")
        }
)
@Getter
@Setter
public class Client extends BaseEntity {

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private boolean emailVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ClientStatus status = ClientStatus.ACTIVE;
}