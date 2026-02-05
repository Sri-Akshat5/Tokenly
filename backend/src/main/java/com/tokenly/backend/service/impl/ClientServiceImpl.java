package com.tokenly.backend.service.impl;

import com.tokenly.backend.dto.request.client.ClientSignupRequest;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.enums.ClientStatus;
import com.tokenly.backend.repository.ClientRepository;
import com.tokenly.backend.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Client signup(ClientSignupRequest request) {
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }

        Client client = new Client();
        client.setCompanyName(request.getCompanyName());
        client.setEmail(request.getEmail());
        client.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        client.setStatus(ClientStatus.ACTIVE);

        return clientRepository.save(client);
    }

    @Override
    public Client login(String email, String password) {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Invalid credentials"));

        if (!passwordEncoder.matches(password, client.getPasswordHash())) {
            throw new IllegalStateException("Invalid credentials");
        }

        return client;
    }
}
