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

        if (!encoderFactory.getEncoderForApplication(application).matches(request.getPassword(), user.getPasswordHash())) {
            loginLogService.logFailedLogin(
                    request.getEmail(),
                    application,
                    request.getIpAddress(),
                    request.getUserAgent(),
                    "Invalid password"
            );
            throw new UnauthorizedException("Invalid credentials");
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
