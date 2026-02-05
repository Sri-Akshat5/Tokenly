package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.AuthConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AuthConfigRepository extends JpaRepository<AuthConfig, UUID> {

    Optional<AuthConfig> findByApplicationId(UUID applicationId);
    Optional<AuthConfig> findByApplication(Application application);
}
