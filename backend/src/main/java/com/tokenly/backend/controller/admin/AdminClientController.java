package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.responce.client.ClientResponse;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.mapper.ClientMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/client")
@RequiredArgsConstructor
public class AdminClientController {

    private final ClientMapper clientMapper;

    @GetMapping("/me")
    public ApiResponse<ClientResponse> getProfile(
            @RequestAttribute Client client
    ) {
        return ApiResponse.success(clientMapper.toResponse(client));
    }
}
