package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.responce.application.ApplicationResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.mapper.ApplicationMapper;
import com.tokenly.backend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applications")
@RequiredArgsConstructor
public class AdminApplicationController {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;

    @GetMapping
    public ApiResponse<List<ApplicationResponse>> listApplications(
            @RequestAttribute Client client
    ) {
        List<Application> apps = applicationRepository.findByClient(client);
        return ApiResponse.success(
                apps.stream().map(applicationMapper::toResponse).toList()
        );
    }
}
