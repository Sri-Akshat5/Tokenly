package com.tokenly.backend.security.login;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.entity.AuthConfig;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.AuthConfigRepository;
import com.tokenly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Slf4j
@Component("OAUTH")
@RequiredArgsConstructor
public class OAuthLoginHandler implements LoginMethodHandler {

    private final UserRepository userRepository;
    private final AuthConfigRepository authConfigRepository;

    @Override
    public User authenticate(Application application, UserLoginRequest request) {
        String idTokenString = request.getProviderToken();

        if (idTokenString == null || idTokenString.isEmpty()) {
            throw new UnauthorizedException("OAuth provider token is required");
        }

        try {
            AuthConfig config = authConfigRepository.findByApplication(application)
                    .orElseThrow(() -> new UnauthorizedException("Application auth configuration not found"));

            String clientId = config.getGoogleClientId();
            if (clientId == null || clientId.isEmpty()) {
                log.warn("Google Client ID not configured for application: {}", application.getId());
            }

            GoogleIdTokenVerifier.Builder verifierBuilder = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory());
            if (clientId != null && !clientId.isEmpty()) {
                verifierBuilder.setAudience(Collections.singletonList(clientId));
            }
            
            GoogleIdTokenVerifier verifier = verifierBuilder.build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new UnauthorizedException("Invalid Google ID Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            // Find or create user
            return userRepository.findByApplicationAndEmail(application, email)
                    .orElseGet(() -> {
                        log.info("Creating new user from Google OAuth: {}", email);
                        User newUser = new User();
                        newUser.setApplication(application);
                        newUser.setEmail(email);
                        newUser.setEmailVerified(true);
                        newUser.setStatus(UserStatus.ACTIVE);
                        // No password for OAuth users
                        return userRepository.save(newUser);
                    });

        } catch (Exception e) {
            log.error("Google OAuth verification failed", e);
            throw new UnauthorizedException("Social login failed: " + e.getMessage());
        }
    }
}
