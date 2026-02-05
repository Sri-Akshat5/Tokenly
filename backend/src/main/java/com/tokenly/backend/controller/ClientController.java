package com.tokenly.backend.controller;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.client.ClientLoginRequest;
import com.tokenly.backend.dto.request.client.ClientSignupRequest;
import com.tokenly.backend.dto.responce.client.ClientResponse;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.mapper.ClientMapper;
import com.tokenly.backend.security.JwtService;
import com.tokenly.backend.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final ClientMapper clientMapper;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ApiResponse<ClientResponse> signup(
            @Valid @RequestBody ClientSignupRequest request
    ) {
        Client client = clientService.signup(request);
        return ApiResponse.success(clientMapper.toResponse(client));
    }

    @PostMapping("/login")
    public ApiResponse<ClientResponse> login(
            @Valid @RequestBody ClientLoginRequest request
    ) {
        Client client = clientService.login(request.getEmail(), request.getPassword());
        
        // Generate JWT token for client (using client ID, no application ID needed for admin portal)
        String token = jwtService.generateAccessToken(client.getId());
        
        ClientResponse response = clientMapper.toResponse(client);
        response.setToken(token);
        
        return ApiResponse.success(response);
    }
}
