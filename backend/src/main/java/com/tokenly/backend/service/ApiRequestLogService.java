package com.tokenly.backend.service;

import com.tokenly.backend.entity.ApiRequestLog;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ApiRequestLogService {

    /**
     * Log an API request
     */
    void logRequest(Client client, Application application, String endpoint, String method,
                    boolean success, int statusCode, String errorMessage, long responseTimeMs);

    /**
     * Get API success rate for a client in the last N hours
     */
    Double getSuccessRateForClient(Client client, int hours);

    /**
     * Get paginated request logs for a client
     */
    Page<ApiRequestLog> getLogsForClient(Client client, UUID applicationId, String requestType, Pageable pageable);

    /**
     * Get total request count in last N hours (all clients)
     */
    Long getTotalRequestCount(int hours);
}
