package com.tokenly.backend.security.authflow;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.security.PasetoService;
import com.tokenly.backend.security.login.LoginHandlerResolver;
import com.tokenly.backend.service.LoginLogService;
import com.tokenly.backend.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("PASETO_PUBLIC")
@RequiredArgsConstructor
public class PasetoV2PublicAuthFlow implements AuthFlow {

    private final SessionService sessionService;
    private final PasetoService pasetoService;
    private final LoginHandlerResolver loginHandlerResolver;
    private final LoginLogService loginLogService;

    @Override
    public AuthResponse login(Application application, UserLoginRequest request) {

        User user = loginHandlerResolver.resolve(application).authenticate(application, request);

        String accessToken = pasetoService.generateV2PublicToken(user, application);
        String refreshToken = pasetoService.generateRefreshToken();

        sessionService.createSession(
                user, application, refreshToken,
                request.getIpAddress(), request.getUserAgent()
        );

        loginLogService.logSuccessfulLogin(user, application, request.getIpAddress(), request.getUserAgent());

        int accessTtl = (application.getAuthConfig() != null && application.getAuthConfig().getAccessTokenTtlMinutes() != null)
                ? application.getAuthConfig().getAccessTokenTtlMinutes() : 60;

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn((long) accessTtl * 60)
                .build();
    }
}
