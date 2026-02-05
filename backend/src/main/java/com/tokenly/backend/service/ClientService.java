package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.client.ClientSignupRequest;
import com.tokenly.backend.entity.Client;

public interface ClientService {

    Client signup(ClientSignupRequest request);

    Client login(String email, String password);
}
