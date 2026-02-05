package com.tokenly.backend.service;

import com.tokenly.backend.dto.request.auth.UserSignupRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;

import java.util.Map;
import java.util.UUID;

public interface UserService {

    User signup(Application application, UserSignupRequest request);

    User findByEmail(Application application, String email);

    User getUserById(Application application, UUID userId);

    void verifyEmail(String token);

    void resendVerificationEmail(Application application, String email);

    // Password reset
    void requestPasswordReset(Application application, String email);

    void resetPassword(String token, String newPassword);

    void changePassword(User user, String currentPassword, String newPassword);

    // Profile management
    User getProfile(User user);

    User updateProfile(User user, Map<String, Object> customData);
}
