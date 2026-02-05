package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.ApplicationField;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationFieldRepository extends JpaRepository<ApplicationField, UUID> {

    List<ApplicationField> findByApplicationOrderByDisplayOrder(Application application);

    Optional<ApplicationField> findByApplicationAndFieldName(Application application, String fieldName);

    boolean existsByApplicationAndFieldName(Application application, String fieldName);

    void deleteByApplicationAndFieldName(Application application, String fieldName);
}
