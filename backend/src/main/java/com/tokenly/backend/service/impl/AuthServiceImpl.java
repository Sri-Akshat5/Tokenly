package com.tokenly.backend.service.impl;

import com.tokenly.backend.config.AppProperties;
import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.security.authflow.AuthFlowResolver;
import com.tokenly.backend.service.AuthService;
import com.tokenly.backend.service.SessionService;
import com.tokenly.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthFlowResolver authFlowResolver;
    private final SessionService sessionService;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;
    private final AppProperties appProperties;

    private static final String OTP_PREFIX = "tokenly:otp:";
    private static final String MAGIC_PREFIX = "tokenly:magic:";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public AuthResponse login(Application application, UserLoginRequest request) {
        return authFlowResolver
                .resolve(application)
                .login(application, request);
    }

    @Override
    public AuthResponse refresh(Application application, String refreshToken) {
        return sessionService.validateAndRotateRefreshToken(application, refreshToken);
    }

    @Override
    public void requestOtp(Application application, String email) {
        String code = String.valueOf(100000 + RANDOM.nextInt(900000));
        String redisKey = OTP_PREFIX + application.getId() + ":" + email;
        
        redisTemplate.opsForValue().set(redisKey, code, Duration.ofMinutes(appProperties.getAuth().getOtpExpiryMinutes()));
        emailService.sendOtpEmail(email, code, application.getAppName());
    }

    @Override
    public void requestMagicLink(Application application, String email) {
        String token = UUID.randomUUID().toString();
        String redisKey = MAGIC_PREFIX + application.getId() + ":" + token;
        
        redisTemplate.opsForValue().set(redisKey, email, Duration.ofMinutes(appProperties.getAuth().getMagicLinkExpiryMinutes()));
        emailService.sendMagicLinkEmail(email, token, application.getId().toString(), application.getAppName());
    }
}
