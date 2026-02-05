package com.tokenly.backend.service.impl;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.LoginLog;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.FailureReason;
import com.tokenly.backend.enums.LoginStatus;
import com.tokenly.backend.repository.LoginLogRepository;
import com.tokenly.backend.service.LoginLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LoginLogServiceImpl implements LoginLogService {

    private final LoginLogRepository loginLogRepository;
    private static final int THROTTLE_THRESHOLD = 5; // Failed attempts
    private static final int THROTTLE_WINDOW_MINUTES = 15;

    @Override
    public void logSuccessfulLogin(User user, Application application, String ipAddress, String userAgent) {
        LoginLog loginLog = new LoginLog();
        loginLog.setUser(user);
        loginLog.setApplication(application);
        loginLog.setStatus(LoginStatus.SUCCESS);
        loginLog.setIpAddress(ipAddress);
        loginLog.setUserAgent(userAgent);

        loginLogRepository.save(loginLog);
        log.info("Logged successful login for user: {} from IP: {}", user.getEmail(), ipAddress);
    }

    @Override
    public void logFailedLogin(String email, Application application, String ipAddress, String userAgent, String reason) {
        LoginLog loginLog = new LoginLog();
        loginLog.setApplication(application);
        loginLog.setStatus(LoginStatus.FAILED);
        loginLog.setFailureReason(mapReasonToEnum(reason));
        loginLog.setEmailAttempted(email);
        loginLog.setIpAddress(ipAddress);
        loginLog.setUserAgent(userAgent);

        loginLogRepository.save(loginLog);
        log.warn("Logged failed login attempt for email: {} from IP: {} - Reason: {}", email, ipAddress, reason);
    }

    @Override
    public Page<LoginLog> getLoginHistory(Application application, Pageable pageable) {
        return loginLogRepository.findByApplicationOrderByCreatedAtDesc(application, pageable);
    }

    @Override
    public Page<LoginLog> getUserLoginHistory(User user, Pageable pageable) {
        return loginLogRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Override
    public long getFailedLoginAttempts(String ipAddress, int minutesAgo) {
        Instant since = Instant.now().minus(minutesAgo, ChronoUnit.MINUTES);
        return loginLogRepository.countFailedAttemptsByIpSince(ipAddress, since);
    }

    @Override
    public boolean isIpThrottled(String ipAddress) {
        long failedAttempts = getFailedLoginAttempts(ipAddress, THROTTLE_WINDOW_MINUTES);
        return failedAttempts >= THROTTLE_THRESHOLD;
    }

    private FailureReason mapReasonToEnum(String reason) {
        if (reason == null) return FailureReason.UNKNOWN;
        if (reason.contains("not found") || reason.contains("User not found")) return FailureReason.USER_NOT_FOUND;
        if (reason.contains("password") || reason.contains("Invalid password")) return FailureReason.INVALID_PASSWORD;
        if (reason.contains("verified")) return FailureReason.EMAIL_NOT_VERIFIED;
        return FailureReason.UNKNOWN;
    }
}
