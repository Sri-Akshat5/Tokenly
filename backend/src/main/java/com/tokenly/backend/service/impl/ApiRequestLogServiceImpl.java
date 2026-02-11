package com.tokenly.backend.service.impl;

import com.tokenly.backend.entity.ApiRequestLog;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.repository.ApiRequestLogRepository;
import com.tokenly.backend.service.ApiRequestLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApiRequestLogServiceImpl implements ApiRequestLogService {

    private final ApiRequestLogRepository apiRequestLogRepository;

    @Override
    @Async
    @Transactional
    public void logRequest(Client client, Application application, String endpoint, String method,
                           boolean success, int statusCode, String errorMessage, long responseTimeMs) {
        try {
            ApiRequestLog log = new ApiRequestLog();
            log.setClient(client);
            log.setApplication(application);
            log.setEndpoint(endpoint);
            log.setMethod(method);
            log.setSuccess(success);
            log.setStatusCode(statusCode);
            log.setErrorMessage(errorMessage);
            log.setResponseTimeMs(responseTimeMs);
            log.setLoggedAt(LocalDateTime.now());

            apiRequestLogRepository.save(log);
        } catch (Exception e) {
            log.error("Failed to log API request", e);
            // Don't throw - logging should never break the main flow
        }
    }

    @Override
    public Double getSuccessRateForClient(Client client, int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        Long total = apiRequestLogRepository.countTotalByClientSince(client, since);

        if (total == 0) {
            return 100.0; // No requests = 100% success rate
        }

        Long successful = apiRequestLogRepository.countSuccessfulByClientSince(client, since);
        return (successful * 100.0) / total;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApiRequestLog> getLogsForClient(Client client, UUID applicationId, String requestType, Pageable pageable) {
        String endpointPattern = null;
        
        if (requestType != null && !requestType.isEmpty()) {
            switch (requestType.toUpperCase()) {
                case "LOGIN":
                    endpointPattern = "/auth/login";
                    break;
                case "SIGNUP":
                    endpointPattern = "/auth/signup";
                    break;
                case "OTP":
                    endpointPattern = "/auth/request-otp";
                    break;
                case "MAGIC_LINK":
                    endpointPattern = "/auth/request-magic-link";
                    break;
                // Add more mappings as needed
                default:
                    break;
            }
        }
        
        Page<ApiRequestLog> logs = apiRequestLogRepository.searchLogs(client, applicationId, endpointPattern, pageable);
        
        // Force initialization of lazy loaded Application entity
        logs.forEach(log -> {
            if (log.getApplication() != null) {
                // Accessing a property forces Hibernate to initialize the proxy
                log.getApplication().getAppName();
            }
        });
        
        return logs;
    }

    @Override
    public Long getTotalRequestCount(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return apiRequestLogRepository.countTotalSince(since);
    }
}
