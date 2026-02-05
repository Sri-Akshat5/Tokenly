package com.tokenly.backend.service;

public interface EmailService {

    /**
     * Send verification email to user
     */
    void sendVerificationEmail(String email, String verificationToken, String appName);

    /**
     * Send password reset email
     */
    void sendPasswordResetEmail(String email, String resetToken, String appName);

    /**
     * Send welcome email after verification
     */
    void sendWelcomeEmail(String to, String username, String appName);

    /**
     * Send OTP for login
     */
    void sendOtpEmail(String to, String otp, String appName);

    /**
     * Send Magic Link for login
     */
    void sendMagicLinkEmail(String to, String magicToken, String appId, String appName);
}
