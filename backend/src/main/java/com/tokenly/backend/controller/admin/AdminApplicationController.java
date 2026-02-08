package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.responce.application.ApplicationResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.mapper.ApplicationMapper;
import com.tokenly.backend.repository.ApplicationRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RequestMapping("/api/admin/applications")
@RequiredArgsConstructor
public class AdminApplicationController {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;

    @GetMapping
    public ApiResponse<List<ApplicationResponse>> listApplications(
            HttpServletRequest request
    ) {
        Client client = getClient(request);
        List<Application> apps = applicationRepository.findByClient(client);
        return ApiResponse.success(
                apps.stream().map(applicationMapper::toResponse).toList()
        );
    }
    
    private Client getClient(HttpServletRequest request) {
        Client client = (Client) request.getAttribute("client");
        if (client == null) {
             throw new com.tokenly.backend.exception.UnauthorizedException("User not authenticated as client");
        }
        return client;
    }
}
