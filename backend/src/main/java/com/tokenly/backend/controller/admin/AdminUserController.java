package com.tokenly.backend.controller.admin;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.request.admin.UserSearchRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.entity.LoginLog;
import com.tokenly.backend.entity.Session;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.exception.ForbiddenException;
import com.tokenly.backend.repository.ApplicationRepository;
import com.tokenly.backend.repository.SessionRepository;
import com.tokenly.backend.repository.UserRepository;
import com.tokenly.backend.service.LoginLogService;
import com.tokenly.backend.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin/{applicationId}")
@RequiredArgsConstructor
@Tag(name = "Admin - User Management", description = "Admin endpoints for managing users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final SessionService sessionService;
    private final LoginLogService loginLogService;
    private final ApplicationRepository applicationRepository;

    @GetMapping("/users")
    @Operation(summary = "List all users", description = "Get paginated list of all users")
    public ResponseEntity<ApiResponse<Page<User>>> listUsers(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Admin listing users for application: {}", application.getAppName());
        Page<User> users = userRepository.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping("/users/search")
    @Operation(summary = "Search users", description = "Search and filter users by email or status")
    public ResponseEntity<ApiResponse<List<User>>> searchUsers(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @RequestBody UserSearchRequest request
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        log.info("Searching users: email={}, status={}", request.getEmail(), request.getStatus());
        
        List<User> users;
        
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            // Search by email
            users = userRepository.findByApplicationAndEmailContainingIgnoreCase(
                    application, request.getEmail());
        } else if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            // Filter by status
            UserStatus status = UserStatus.valueOf(request.getStatus());
            users = userRepository.findByApplicationAndStatus(application, status);
        } else {
            // Return all users for this application
            users = userRepository.findByApplication(application);
        }
        
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get user details", description = "Get detailed information about a specific user")
    public ResponseEntity<ApiResponse<User>> getUser(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @PathVariable UUID userId
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        User user = userRepository.findById(userId)
                .filter(u -> u.getApplication().getId().equals(application.getId()))
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<?>> updateUserStatus(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @PathVariable UUID userId,
            @RequestParam UserStatus status
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        User user = userRepository.findById(userId)
                .filter(u -> u.getApplication().getId().equals(application.getId()))
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setStatus(status);
        userRepository.save(user);

        // If blocking user, revoke all sessions
        if (status == UserStatus.BLOCKED) {
            sessionService.revokeAllUserSessions(user);
        }

        return ResponseEntity.ok(ApiResponse.success("User status updated", null));
    }

    @GetMapping("/users/{userId}/sessions")
    public ResponseEntity<ApiResponse<List<Session>>> getUserSessions(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @PathVariable UUID userId
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        User user = userRepository.findById(userId)
                .filter(u -> u.getApplication().getId().equals(application.getId()))
                .orElseThrow(() -> new IllegalStateException("User not found"));

        List<Session> sessions = sessionRepository.findAllByUserAndRevokedFalse(user);
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<?>> revokeSession(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @PathVariable UUID sessionId
    ) {
        getAndVerifyApplication(client, applicationId); // Verify ownership
        sessionService.revokeSession(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session revoked", null));
    }

    @GetMapping("/users/{userId}/login-history")
    public ResponseEntity<ApiResponse<Page<LoginLog>>> getUserLoginHistory(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId,
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        User user = userRepository.findById(userId)
                .filter(u -> u.getApplication().getId().equals(application.getId()))
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Page<LoginLog> logs = loginLogService.getUserLoginHistory(user, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
            @RequestAttribute Client client,
            @PathVariable UUID applicationId
    ) {
        Application application = getAndVerifyApplication(client, applicationId);
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", userRepository.count());
        analytics.put("activeUsers", userRepository.countByApplicationAndStatus(application, UserStatus.ACTIVE));
        analytics.put("activeSessions", sessionRepository.countByApplicationAndRevokedFalse(application));

        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    private Application getAndVerifyApplication(Client client, UUID applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ForbiddenException("Application not found"));
        
        if (!application.getClient().getId().equals(client.getId())) {
            throw new ForbiddenException("You don't have access to this application");
        }
        
        return application;
    }
}
