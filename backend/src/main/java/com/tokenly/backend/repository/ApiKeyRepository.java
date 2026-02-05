package com.tokenly.backend.repository;

import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"application"})
    Optional<ApiKey> findByPublicKeyAndActiveTrue(String publicKey);

    Optional<ApiKey> findByApplicationAndActiveTrue(Application application);
    
    // Additional methods required by service layer
    Optional<ApiKey> findByPublicKey(String publicKey);
    
    List<ApiKey> findByApplication(Application application);

    boolean existsByPublicKey(String publicKey);

    void deleteByExpiresAtBefore(Instant now);
}
