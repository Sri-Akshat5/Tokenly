package com.tokenly.backend.mapper;

import com.tokenly.backend.dto.responce.client.ClientResponse;
import com.tokenly.backend.entity.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public ClientResponse toResponse(Client client) {
        if (client == null) {
            return null;
        }

        return ClientResponse.builder()
                .id(client.getId())
                .companyName(client.getCompanyName())
                .email(client.getEmail())
                .emailVerified(client.isEmailVerified())
                .build();
    }
}
