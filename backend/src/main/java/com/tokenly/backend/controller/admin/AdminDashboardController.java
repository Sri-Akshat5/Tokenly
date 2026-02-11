package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.responce.admin.DashboardStatsResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.repository.UserRepository;
import com.tokenly.backend.service.ApiRequestLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ApiRequestLogService apiRequestLogService;

    @GetMapping("/stats")
    public ApiResponse<DashboardStatsResponse> getStats(HttpServletRequest request) {
        Client client = getClient(request);
        List<Application> applications = applicationRepository.findAllByClient(client);
        
        long totalApps = applications.size();
        long totalUsers = 0;
        
        for (Application app : applications) {
            totalUsers += userRepository.countByApplication(app);
        }

        // Get real API success rate from last 24 hours
        Double successRate = apiRequestLogService.getSuccessRateForClient(client, 24);
        Long totalRequests = apiRequestLogService.getTotalRequestCount(24);

        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalApplications(totalApps)
                .totalUsers(totalUsers)
                .apiSuccessRate(successRate)
                .totalRequests24h(totalRequests != null ? totalRequests : 0L)
                .build();

        return ApiResponse.success(stats);
    }

    @GetMapping("/request-logs")
    public ApiResponse<org.springframework.data.domain.Page<com.tokenly.backend.dto.responce.admin.ApiRequestLogResponse>> getRequestLogs(
            HttpServletRequest request,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "50") int size,
            @org.springframework.web.bind.annotation.RequestParam(required = false) UUID appId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String type
    ) {
        Client client = getClient(request);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        
        org.springframework.data.domain.Page<com.tokenly.backend.entity.ApiRequestLog> logs = 
                apiRequestLogService.getLogsForClient(client, appId, type, pageable);
        
        org.springframework.data.domain.Page<com.tokenly.backend.dto.responce.admin.ApiRequestLogResponse> response = 
                logs.map(log -> com.tokenly.backend.dto.responce.admin.ApiRequestLogResponse.builder()
                        .id(log.getId())
                        .applicationName(log.getApplication() != null ? log.getApplication().getAppName() : "N/A")
                        .endpoint(log.getEndpoint())
                        .method(log.getMethod())
                        .success(log.getSuccess())
                        .statusCode(log.getStatusCode())
                        .errorMessage(log.getErrorMessage())
                        .responseTimeMs(log.getResponseTimeMs())
                        .loggedAt(log.getLoggedAt())
                        .build());
        
        return ApiResponse.success(response);
    }
    
    private Client getClient(HttpServletRequest request) {
        Client client = (Client) request.getAttribute("client");
        if (client == null) {
             throw new com.tokenly.backend.exception.UnauthorizedException("User not authenticated as client");
        }
        return client;
    }
}
