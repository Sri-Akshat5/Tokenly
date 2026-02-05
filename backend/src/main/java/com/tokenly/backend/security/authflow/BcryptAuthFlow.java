package com.tokenly.backend.security.authflow;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.dto.responce.auth.AuthResponse;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component("BCRYPT")
@RequiredArgsConstructor
public class BcryptAuthFlow implements AuthFlow {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(Application application, UserLoginRequest request) {

        User user = userRepository
                .findByApplicationAndEmail(application, request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // no token, just confirmation
        return AuthResponse.builder()
                .accessToken(null)
                .refreshToken(null)
                .expiresIn(null)
                .build();
    }
}
