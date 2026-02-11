package com.tokenly.backend.security.login;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.UserRepository;
import com.tokenly.backend.security.PasswordEncoderFactory;
import com.tokenly.backend.service.LoginLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("PASSWORD")
@RequiredArgsConstructor
public class PasswordLoginHandler implements LoginMethodHandler {

    private final UserRepository userRepository;
    private final PasswordEncoderFactory encoderFactory;
    private final LoginLogService loginLogService;

    @Override
    public User authenticate(Application application, UserLoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new UnauthorizedException("Email is required");
        }

        User user = userRepository
                .findByApplicationAndEmail(application, request.getEmail())
                .orElseThrow(() -> {
                    loginLogService.logFailedLogin(
                            request.getEmail(),
                            application,
                            request.getIpAddress(),
                            request.getUserAgent(),
                            "User not found"
                    );
                    return new UnauthorizedException("Invalid credentials");
                });

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new UnauthorizedException("Password is required");
        }

        // SMART VERIFICATION & LAZY MIGRATION
        // 1. Identify valid encoder for the STORED hash (might be old algorithm)
        org.springframework.security.crypto.password.PasswordEncoder encoder = encoderFactory.getEncoderForHash(user.getPasswordHash());
        
        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            loginLogService.logFailedLogin(
                    request.getEmail(),
                    application,
                    request.getIpAddress(),
                    request.getUserAgent(),
                    "Invalid password"
            );
            throw new UnauthorizedException("Invalid credentials");
        }

        // 2. Hash is valid. Check if we need to migrate to a new algorithm?
        if (application.getAuthConfig() != null) {
            com.tokenly.backend.enums.PasswordHashAlgorithm targetAlgo = application.getAuthConfig().getPasswordHashAlgorithm();
            com.tokenly.backend.enums.PasswordHashAlgorithm currentAlgo = encoderFactory.identifyAlgorithm(user.getPasswordHash());

            if (targetAlgo != null && currentAlgo != targetAlgo) {
                // Algorithm changed! Re-hash and save
                org.springframework.security.crypto.password.PasswordEncoder targetEncoder = encoderFactory.getEncoder(targetAlgo);
                String newHash = targetEncoder.encode(request.getPassword());
                user.setPasswordHash(newHash);
                userRepository.save(user);
            }
        }

        if (application.getAuthConfig() != null 
                && application.getAuthConfig().isEmailVerificationRequired() 
                && !user.isEmailVerified()) {
            loginLogService.logFailedLogin(
                    request.getEmail(),
                    application,
                    request.getIpAddress(),
                    request.getUserAgent(),
                    "Email not verified"
            );
            throw new UnauthorizedException("Email verification is required to login.");
        }

        return user;
    }
}
