package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.ApplicationEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByClient(Client client);

    List<Application> findAllByClient(Client client);

    Optional<Application> findByIdAndClient(UUID id, Client client);

    Optional<Application> findByClientAndEnvironment(Client client, ApplicationEnvironment environment);
}
