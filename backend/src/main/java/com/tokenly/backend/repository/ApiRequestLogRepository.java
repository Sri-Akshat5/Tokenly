package com.tokenly.backend.repository;

import com.tokenly.backend.entity.ApiRequestLog;
import com.tokenly.backend.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface ApiRequestLogRepository extends JpaRepository<ApiRequestLog, UUID> {

    // Count successful requests for a client since a specific time
    @Query("SELECT COUNT(l) FROM ApiRequestLog l WHERE l.client = :client AND l.success = true AND l.loggedAt >= :since")
    Long countSuccessfulByClientSince(@Param("client") Client client, @Param("since") LocalDateTime since);

    // Count total requests for a client since a specific time
    @Query("SELECT COUNT(l) FROM ApiRequestLog l WHERE l.client = :client AND l.loggedAt >= :since")
    Long countTotalByClientSince(@Param("client") Client client, @Param("since") LocalDateTime since);

    // Get paginated logs for a client
    Page<ApiRequestLog> findByClientOrderByLoggedAtDesc(Client client, Pageable pageable);

    // Search logs with dynamic filters
    @Query("SELECT l FROM ApiRequestLog l LEFT JOIN l.application a WHERE l.client = :client " +
           "AND (:applicationId IS NULL OR a.id = :applicationId) " +
           "AND (:endpoint IS NULL OR l.endpoint LIKE %:endpoint%) " +
           "ORDER BY l.loggedAt DESC")
    Page<ApiRequestLog> searchLogs(@Param("client") Client client,
                                   @Param("applicationId") UUID applicationId,
                                   @Param("endpoint") String endpoint,
                                   Pageable pageable);

    // Count total requests in last period (for all clients)
    @Query("SELECT COUNT(l) FROM ApiRequestLog l WHERE l.loggedAt >= :since")
    Long countTotalSince(@Param("since") LocalDateTime since);
}
