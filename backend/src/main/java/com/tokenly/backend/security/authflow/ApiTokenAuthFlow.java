package com.tokenly.backend.security.authflow;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.security.JwtService;
import com.tokenly.backend.security.login.LoginHandlerResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("API_TOKEN")
@RequiredArgsConstructor
public class ApiTokenAuthFlow implements AuthFlow {

    private final LoginHandlerResolver loginHandlerResolver;
    private final JwtService jwtService;

    @Override
    public AuthResponse login(Application application, UserLoginRequest request) {

        // Authenticate user based on application's login method (Password, OTP, etc.)
        User user = loginHandlerResolver.resolve(application).authenticate(application, request);

        // Generate stateless JWT for API Token auth
        String accessToken = jwtService.generateAccessToken(user, application);

        int accessTtl = application.getAuthConfig() != null ? application.getAuthConfig().getAccessTokenTtlMinutes() : 60;

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(null)
                .expiresIn((long) accessTtl * 60)
                .build();
    }
}
