package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.LoginLog;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.LoginStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.UUID;

public interface LoginLogRepository extends JpaRepository<LoginLog, UUID> {

    Page<LoginLog> findByApplicationOrderByCreatedAtDesc(Application application, Pageable pageable);

    Page<LoginLog> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    @Query("SELECT COUNT(l) FROM LoginLog l WHERE l.ipAddress = :ipAddress AND l.status = 'FAILED' AND l.createdAt >= :since")
    long countFailedAttemptsByIpSince(String ipAddress, Instant since);
}
