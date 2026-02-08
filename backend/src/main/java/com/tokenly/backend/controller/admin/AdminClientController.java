package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.responce.client.ClientResponse;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.mapper.ClientMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RequestMapping("/api/admin/client")
@RequiredArgsConstructor
public class AdminClientController {

    private final ClientMapper clientMapper;

    @GetMapping("/me")
    public ApiResponse<ClientResponse> getProfile(
            HttpServletRequest request
    ) {
        Client client = getClient(request);
        return ApiResponse.success(clientMapper.toResponse(client));
    }

    private Client getClient(HttpServletRequest request) {
        Client client = (Client) request.getAttribute("client");
        if (client == null) {
             throw new com.tokenly.backend.exception.UnauthorizedException("User not authenticated as client");
        }
        return client;
    }
}
