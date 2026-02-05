package com.tokenly.backend.scheduler;

import com.tokenly.backend.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SessionCleanupScheduler {

    private final SessionService sessionService;

    /**
     * Clean up expired sessions daily at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanupExpiredSessions() {
        log.info("Starting scheduled session cleanup task");
        sessionService.cleanupExpiredSessions();
        log.info("Completed scheduled session cleanup task");
    }
}
