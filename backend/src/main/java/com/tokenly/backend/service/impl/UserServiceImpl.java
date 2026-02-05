package com.tokenly.backend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.config.AppProperties;
import com.tokenly.backend.dto.request.auth.UserSignupRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.repository.UserRepository;
import com.tokenly.backend.security.PasswordEncoderFactory;
import com.tokenly.backend.service.ApplicationFieldService;
import com.tokenly.backend.service.EmailService;
import com.tokenly.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoderFactory encoderFactory;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;
    private final ApplicationFieldService fieldService;
    private final AppProperties appProperties;

    @Override
    public User signup(Application application, UserSignupRequest request) {
        if (userRepository.existsByApplicationAndEmail(application, request.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        // Validate custom data against application field schema
        Map<String, Object> validationData = new HashMap<>();
        if (request.getCustomData() != null) {
            validationData.putAll(request.getCustomData());
        }
        // Include core fields in validation data in case they are defined in the schema
        validationData.put("email", request.getEmail());
        validationData.put("password", request.getPassword());

        fieldService.validateCustomData(application, validationData);

        User user = new User();
        user.setApplication(application);
        user.setEmail(request.getEmail());
        if (request.getPassword() != null) {
            user.setPasswordHash(encoderFactory.getEncoderForApplication(application).encode(request.getPassword()));
        }
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(false);

        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(Instant.now().plus(appProperties.getAuth().getVerificationTokenExpiryHours(), ChronoUnit.HOURS));

        try {
            user.setCustomData(
                    request.getCustomData() == null
                            ? null
                            : objectMapper.writeValueAsString(request.getCustomData())
            );
        } catch (Exception e) {
            throw new IllegalStateException("Invalid custom data");
        }

        User savedUser = userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken, application.getAppName());

        return savedUser;
    }

    @Override
    public User findByEmail(Application application, String email) {
        return userRepository.findByApplicationAndEmail(application, email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }

    @Override
    public User getUserById(Application application, UUID userId) {
        return userRepository.findById(userId)
                .filter(user -> application == null || user.getApplication().getId().equals(application.getId()))
                .orElseThrow(() -> new IllegalStateException("User not found in this application context"));
    }

    @Override
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalStateException("Invalid or expired verification token"));

        if (user.getVerificationTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalStateException("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getEmail(), user.getApplication().getAppName());
    }

    @Override
    public void resendVerificationEmail(Application application, String email) {
        User user = userRepository.findByApplicationAndEmail(application, email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (user.isEmailVerified()) {
            throw new IllegalStateException("Email already verified");
        }

        // Generate new token
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(Instant.now().plus(appProperties.getAuth().getVerificationTokenExpiryHours(), ChronoUnit.HOURS));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken, application.getAppName());
    }

    @Override
    public void requestPasswordReset(Application application, String email) {
        User user = userRepository.findByApplicationAndEmail(application, email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(Instant.now().plus(appProperties.getAuth().getPasswordResetTokenExpiryHours(), ChronoUnit.HOURS));

        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken, application.getAppName());
        log.info("Password reset requested for user: {}", email);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new IllegalStateException("Invalid reset token"));

        if (user.getPasswordResetTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalStateException("Reset token expired");
        }

        user.setPasswordHash(encoderFactory.getEncoderForApplication(user.getApplication()).encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);

        userRepository.save(user);
        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    @Override
    public void changePassword(User user, String currentPassword, String newPassword) {
        if (!encoderFactory.getEncoderForApplication(user.getApplication()).matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalStateException("Current password is incorrect");
        }

        user.setPasswordHash(encoderFactory.getEncoderForApplication(user.getApplication()).encode(newPassword));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    @Override
    public User getProfile(User user) {
        return user;
    }

    @Override
    public User updateProfile(User user, Map<String, Object> customData) {
        // Validate custom data against application field schema
        if (customData != null && !customData.isEmpty()) {
            fieldService.validateCustomData(user.getApplication(), customData);
        }

        try {
            user.setCustomData(
                    customData == null
                            ? null
                            : objectMapper.writeValueAsString(customData)
            );
        } catch (Exception e) {
            throw new IllegalStateException("Invalid custom data");
        }

        userRepository.save(user);
        log.info("Profile updated for user: {}", user.getEmail());
        return user;
    }
}
