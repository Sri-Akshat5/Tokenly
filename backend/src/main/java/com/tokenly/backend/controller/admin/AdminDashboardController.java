package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.responce.admin.DashboardStatsResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ApiResponse<DashboardStatsResponse> getStats(HttpServletRequest request) {
        Client client = getClient(request);
        List<Application> applications = applicationRepository.findAllByClient(client);
        
        long totalApps = applications.size();
        long totalUsers = 0;
        
        for (Application app : applications) {
            totalUsers += userRepository.countByApplication(app);
        }

        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalApplications(totalApps)
                .totalUsers(totalUsers)
                .apiSuccessRate(99.9) // Mocked for now as we don't have transaction logs yet
                .activeUsers24h(totalUsers) // Mocked for now
                .userTrend("+12.5%")
                .successRateTrend("+0.2%")
                .build();

        return ApiResponse.success(stats);
    }
    
    private Client getClient(HttpServletRequest request) {
        Client client = (Client) request.getAttribute("client");
        if (client == null) {
             throw new com.tokenly.backend.exception.UnauthorizedException("User not authenticated as client");
        }
        return client;
    }
}
