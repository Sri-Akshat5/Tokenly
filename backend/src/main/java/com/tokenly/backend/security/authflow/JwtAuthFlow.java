package com.tokenly.backend.security.authflow;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.security.JwtService;
import com.tokenly.backend.security.login.LoginHandlerResolver;
import com.tokenly.backend.service.LoginLogService;
import com.tokenly.backend.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("JWT")
@RequiredArgsConstructor
public class JwtAuthFlow implements AuthFlow {

    private final SessionService sessionService;
    private final JwtService jwtService;
    private final LoginHandlerResolver loginHandlerResolver;
    private final LoginLogService loginLogService;

    @Override
    public AuthResponse login(Application application, UserLoginRequest request) {

        // Authenticate user based on application's login method (Password, OTP, etc.)
        User user = loginHandlerResolver.resolve(application).authenticate(application, request);

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user, application);
        String refreshToken = jwtService.generateRefreshToken();

        // Create session using SessionService
        sessionService.createSession(
                user,
                application,
                refreshToken,
                request.getIpAddress(),
                request.getUserAgent()
        );

        // Log successful login
        loginLogService.logSuccessfulLogin(user, application, request.getIpAddress(), request.getUserAgent());

        int accessTtl = application.getAuthConfig() != null ? application.getAuthConfig().getAccessTokenTtlMinutes() : 60;

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn((long) accessTtl * 60)
                .build();
    }
}
