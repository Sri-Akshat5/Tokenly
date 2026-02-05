package com.tokenly.backend.service.impl;

import com.tokenly.backend.config.AppProperties;
import com.tokenly.backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class SmtpEmailService implements EmailService {

    private final AppProperties appProperties;

    @Value("${app.email.from}")
    private String fromEmail;

    @Override
    public void sendVerificationEmail(String to, String verificationToken, String appName) {
        String subject = "Verify your email for " + appName;
        String body = buildVerificationEmailBody(verificationToken, appName);
        sendHtmlEmail(to, subject, body, appName);
        log.info("Verification email sent to: {}", to);
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetToken, String appName) {
        String subject = "Reset your password for " + appName;
        String body = buildPasswordResetEmailBody(resetToken, appName);
        sendHtmlEmail(to, subject, body, appName);
        log.info("Password reset email sent to: {}", to);
    }

    @Override
    public void sendWelcomeEmail(String to, String username, String appName) {
        String subject = "Welcome to " + appName;
        String body = buildWelcomeEmailBody(username, appName);
        sendHtmlEmail(to, subject, body, appName);
        log.info("Welcome email sent to: {}", to);
    }

    @Override
    public void sendOtpEmail(String to, String otp, String appName) {
        String subject = otp + " is your " + appName + " verification code";
        String body = buildOtpEmailBody(otp, appName);
        sendHtmlEmail(to, subject, body, appName);
        log.info("OTP email sent to: {}", to);
    }

    @Override
    public void sendMagicLinkEmail(String to, String magicToken, String appId, String appName) {
        String subject = "Your " + appName + " Magic Link";
        String body = buildMagicLinkEmailBody(magicToken, appId, appName);
        sendHtmlEmail(to, subject, body, appName);
        log.info("Magic link email sent to: {}", to);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody, String appName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, appName); // Use appName as the sender name
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        } catch (Exception e) {
            log.error("Unexpected error sending email: {}", e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildVerificationEmailBody(String token, String appName) {
        String verificationLink = appProperties.getUrl().getBaseBackend() + "/api/auth/verify-email?token=" + token;
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4CAF50;">Verify your email for %s</h2>
                    <p>Thank you for joining <strong>%s</strong>!</p>
                    <p>Please click the button below to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                    <p style="color: #4CAF50; word-break: break-all;">%s</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                    <p style="color: #999; font-size: 11px; text-align: center;">Verified by <span style="font-weight: bold; color: #666;">%s</span></p>
                </div>
            </body>
            </html>
            """.formatted(appName, appName, verificationLink, verificationLink, appProperties.getBranding().getFooterText());
    }

    private String buildPasswordResetEmailBody(String token, String appName) {
        String resetLink = appProperties.getUrl().getBaseFrontend() + "/auth/reset-password?token=" + token;
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #FF5722;">Reset your password for %s</h2>
                    <p>We received a request to reset your password for your <strong>%s</strong> account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #FF5722; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                    <p style="color: #FF5722; word-break: break-all;">%s</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                    <p style="color: #999; font-size: 11px; text-align: center;">Secured by <span style="font-weight: bold; color: #666;">%s</span></p>
                </div>
            </body>
            </html>
            """.formatted(appName, appName, resetLink, resetLink, appProperties.getBranding().getSecuredByText());
    }

    private String buildWelcomeEmailBody(String username, String appName) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #2196F3;">Welcome to %s!</h2>
                    <p>Hi %s,</p>
                    <p>Your email has been successfully verified! You can now access your account at <strong>%s</strong>.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                    <p style="color: #999; font-size: 11px; text-align: center;">Verified by <span style="font-weight: bold; color: #666;">%s</span></p>
                </div>
            </body>
            </html>
            """.formatted(appName, username, appName, appProperties.getBranding().getFooterText());
    }

    private String buildOtpEmailBody(String otp, String appName) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #3f51b5;">Verification Code for %s</h2>
                    <p>Use the following code to sign in to your <strong>%s</strong> account. This code is valid for 10 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3f51b5; padding: 10px 20px; border: 2px dashed #3f51b5; border-radius: 5px; display: inline-block;">
                            %s
                        </span>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                    <p style="color: #999; font-size: 11px; text-align: center;">Secured by <span style="font-weight: bold; color: #666;">%s</span></p>
                </div>
            </body>
            </html>
            """.formatted(appName, appName, otp, appProperties.getBranding().getSecuredByText());
    }

    private String buildMagicLinkEmailBody(String token, String appId, String appName) {
        String magicLink = appProperties.getUrl().getBaseFrontend() + "/auth/verify?token=" + token + "&appId=" + appId;
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #9c27b0;">Sign in to %s</h2>
                    <p>Click the button below to sign in instantly to <strong>%s</strong>. This link is valid for 15 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #9c27b0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Sign In Instantly
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy and paste this link:</p>
                    <p style="color: #9c27b0; word-break: break-all;">%s</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                    <p style="color: #999; font-size: 11px; text-align: center;">Secured by <span style="font-weight: bold; color: #666;">%s</span></p>
                </div>
            </body>
            </html>
            """.formatted(appName, appName, magicLink, magicLink, appProperties.getBranding().getSecuredByText());
    }
}
