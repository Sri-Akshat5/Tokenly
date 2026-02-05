package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByApplicationAndEmail(Application application, String email);

    boolean existsByApplicationAndEmail(Application application, String email);

    long countByApplicationAndStatus(Application application, UserStatus status);
    
    long countByApplication(Application application);

    Optional<User> findByVerificationToken(String verificationToken);

    Optional<User> findByPasswordResetToken(String token);

    // Search and filter
    List<User> findByApplicationAndEmailContainingIgnoreCase(Application application, String email);
    
    List<User> findByApplicationAndStatus(Application application, UserStatus status);
    
    List<User> findByApplication(Application application);
}
