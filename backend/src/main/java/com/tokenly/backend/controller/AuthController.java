package com.tokenly.backend.controller;

import com.tokenly.backend.config.AppProperties;
import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.auth.*;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.mapper.AuthMapper;
import com.tokenly.backend.service.AuthService;
import com.tokenly.backend.service.SessionService;
import com.tokenly.backend.service.UserService;
import com.tokenly.backend.security.JwtService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and profile management endpoints")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final SessionService sessionService;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final AppProperties appProperties;

    @GetMapping("/app-info")
    public ApiResponse<?> getAppInfo(
            @RequestAttribute Application application
    ) {
        return ApiResponse.success(authMapper.toResponse(application.getAuthConfig()));
    }

    @PostMapping("/signup")
    public ApiResponse<?> signup(
            @RequestAttribute Application application,
            @Valid @RequestBody UserSignupRequest request
    ) {
        if (application.getAuthConfig() != null && !application.getAuthConfig().isSignupEnabled()) {
             // For security, we might want to return 404 or 403. 403 Forbidden is appropriate.
             // We'll use a specific message.
             throw new com.tokenly.backend.exception.ForbiddenException("Public registration is disabled for this application.");
        }
        userService.signup(application, request);
        return ApiResponse.success("User registered successfully", null);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(
            @RequestAttribute Application application,
            @Valid @RequestBody UserLoginRequest request
    ) {
        AuthResponse response = authService.login(application, request);
        return ApiResponse.success(response);
    }

    @PostMapping("/request-otp")
    public ApiResponse<?> requestOtp(
            @RequestAttribute Application application,
            @RequestParam String email
    ) {
        authService.requestOtp(application, email);
        return ApiResponse.success("OTP sent to your email", null);
    }

    @PostMapping("/request-magic-link")
    public ApiResponse<?> requestMagicLink(
            @RequestAttribute Application application,
            @RequestParam String email
    ) {
        authService.requestMagicLink(application, email);
        return ApiResponse.success("Magic link sent to your email", null);
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(
            @RequestAttribute Application application,
            HttpServletRequest httpRequest
    ) {
        String refreshToken = httpRequest.getHeader("Authorization");
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
        }
        AuthResponse response = authService.refresh(application, refreshToken);
        return ApiResponse.success(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(
            @RequestAttribute Application application,
            HttpServletRequest httpRequest
    ) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.failure("Missing Authorization header"));
        }

        String token = authHeader.substring(7);
        UUID userId = jwtService.extractUserId(token);

        User user = userService.getUserById(application, userId);
        
        // Revoke all sessions for this user (simple implementation)
        // TODO: Track session ID in JWT for single-session logout
        sessionService.revokeAllUserSessions(user);

        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<?>> logoutAll(
            @RequestAttribute Application application,
            HttpServletRequest httpRequest
    ) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.failure("Missing Authorization header"));
        }

        String token = authHeader.substring(7);
        UUID userId = jwtService.extractUserId(token);

        User user = userService.getUserById(application, userId);
        sessionService.revokeAllUserSessions(user);

        return ResponseEntity.ok(ApiResponse.success("Logged out from all devices", null));
    }

    @org.springframework.web.bind.annotation.GetMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        try {
            userService.verifyEmail(token);
            return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                    .location(java.net.URI.create(appProperties.getUrl().getBaseFrontend() + "/auth/verified?status=success"))
                    .build();
        } catch (Exception e) {
            log.error("Email verification failed: {}", e.getMessage());
            return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                    .location(java.net.URI.create(appProperties.getUrl().getBaseFrontend() + "/auth/verified?status=error&message=" + 
                            java.net.URLEncoder.encode(e.getMessage(), java.nio.charset.StandardCharsets.UTF_8)))
                    .build();
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<?>> resendVerification(
            @RequestAttribute Application application,
            @RequestParam String email
    ) {
        userService.resendVerificationEmail(application, email);
        return ResponseEntity.ok(ApiResponse.success("Verification email sent", null));
    }

    // Password Reset Endpoints
    @PostMapping("/forgot-password")
    public ApiResponse<?> forgotPassword(
            @RequestAttribute Application application,
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        userService.requestPasswordReset(application, request.getEmail());
        return ApiResponse.success("Password reset email sent", null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ApiResponse.success("Password reset successfully", null);
    }

    // User Profile Endpoints (Requires JWT)
    @GetMapping("/profile")
    public ApiResponse<User> getProfile(
            @RequestAttribute Application application,
            HttpServletRequest request
    ) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            UUID userId = jwtService.extractUserId(jwt);
            User user = userService.getUserById(application, userId);
            return ApiResponse.success(userService.getProfile(user));
        }
        return ApiResponse.failure("Unauthorized");
    }

    @PutMapping("/profile")
    public ApiResponse<User> updateProfile(
            @RequestAttribute Application application,
            HttpServletRequest request,
            @RequestBody Map<String, Object> customData
    ) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            UUID userId = jwtService.extractUserId(jwt);
            User user = userService.getUserById(application, userId);
            User updated = userService.updateProfile(user, customData);
            return ApiResponse.success("Profile updated successfully", updated);
        }
        return ApiResponse.failure("Unauthorized");
    }

    @PutMapping("/change-password")
    public ApiResponse<?> changePassword(
            @RequestAttribute Application application,
            HttpServletRequest request,
            @Valid @RequestBody ChangePasswordRequest changeRequest
    ) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            UUID userId = jwtService.extractUserId(jwt);
            User user = userService.getUserById(application, userId);
            userService.changePassword(user, changeRequest.getCurrentPassword(), changeRequest.getNewPassword());
            return ApiResponse.success("Password changed successfully", null);
        }
        return ApiResponse.failure("Unauthorized");
    }
}
