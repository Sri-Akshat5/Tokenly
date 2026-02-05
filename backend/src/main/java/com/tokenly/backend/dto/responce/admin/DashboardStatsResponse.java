package com.tokenly.backend.dto.responce.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalApplications;
    private long totalUsers;
    private double apiSuccessRate;
    private long activeUsers24h;
    private String userTrend;
    private String successRateTrend;
}
