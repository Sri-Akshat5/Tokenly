package com.tokenly.backend.service;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.LoginLog;
import com.tokenly.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoginLogService {

    void logSuccessfulLogin(User user, Application application, String ipAddress, String userAgent);

    void logFailedLogin(String email, Application application, String ipAddress, String userAgent, String reason);

    Page<LoginLog> getLoginHistory(Application application, Pageable pageable);

    Page<LoginLog> getUserLoginHistory(User user, Pageable pageable);

    long getFailedLoginAttempts(String ipAddress, int minutesAgo);

    boolean isIpThrottled(String ipAddress);
}
