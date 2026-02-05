package com.tokenly.backend.service.impl;

import com.tokenly.backend.config.AppProperties;
import com.tokenly.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConsoleEmailService implements EmailService {

    private final AppProperties appProperties;

    @Override
    public void sendVerificationEmail(String email, String verificationToken, String appName) {
        log.info("[SIMULATION] Sending verification email for {} to: {}", appName, email);
        log.info("[SIMULATION] Link: {}/api/auth/verify-email?token={}", appProperties.getUrl().getBaseBackend(), verificationToken);
        log.info("Note: This will redirect to premium frontend page");
        log.info("Token expires in 24 hours");
        log.info("=".repeat(60));
    }

    @Override
    public void sendPasswordResetEmail(String email, String resetToken, String appName) {
        log.info("[SIMULATION] Sending password reset email for {} to: {}", appName, email);
        log.info("[SIMULATION] Link: {}/auth/reset-password?token={}", appProperties.getUrl().getBaseFrontend(), resetToken);
        log.info("This link expires in 1 hour.");
        log.info("==========================================");
    }

    @Override
    public void sendWelcomeEmail(String to, String username, String appName) {
        log.info("[SIMULATION] Sending welcome email for {} to: {} ({})", appName, to, username);
        log.info("Subject: Welcome to {}!", appName);
        log.info("Body: Welcome {}, Thank you for verifying your email!", username);
        log.info("===================================");
    }

    @Override
    public void sendMagicLinkEmail(String to, String magicToken, String appId, String appName) {
        log.info("[SIMULATION] Sending Magic Link for {} to: {}", appName, to);
        log.info("[SIMULATION] Link: {}/auth/verify?token={}&appId={}", appProperties.getUrl().getBaseFrontend(), magicToken, appId);
        log.info("======================================");
    }

    @Override
    public void sendOtpEmail(String to, String otp, String appName) {
        log.info("[SIMULATION] Sending OTP for {} to: {} | OTP: {}", appName, to, otp);
        log.info("Subject: Login OTP");
        log.info("Your OTP code is: {}", otp);
        log.info("===============================");
    }
}
