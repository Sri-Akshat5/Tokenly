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
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Component("OAUTH")
@RequiredArgsConstructor
public class OAuthLoginHandler implements LoginMethodHandler {

    private final UserRepository userRepository;
    private final AuthConfigRepository authConfigRepository;
    private final WebClient.Builder webClientBuilder;

    @Override
    public User authenticate(Application application, UserLoginRequest request) {
        String provider = request.getProvider();
        String providerToken = request.getProviderToken();

        if (providerToken == null || providerToken.isEmpty()) {
            throw new UnauthorizedException("OAuth provider token is required");
        }

        if (provider == null || provider.isEmpty()) {
            // Default to Google for backward compatibility
            provider = "GOOGLE";
        }

        final String finalProvider = provider;

        AuthConfig config = authConfigRepository.findByApplication(application)
                .orElseThrow(() -> new UnauthorizedException("Application auth configuration not found"));

        String email;
        String name = null;

        switch (provider.toUpperCase()) {
            case "GOOGLE":
                email = verifyGoogleToken(config, providerToken);
                break;
            case "GITHUB":
                Map<String, String> githubUser = verifyGithubToken(config, providerToken);
                email = githubUser.get("email");
                name = githubUser.get("name");
                break;
            case "META":
            case "FACEBOOK":
                Map<String, String> metaUser = verifyMetaToken(config, providerToken);
                email = metaUser.get("email");
                name = metaUser.get("name");
                break;
            case "AUTH0":
                Map<String, String> auth0User = verifyAuth0Token(config, providerToken);
                email = auth0User.get("email");
                name = auth0User.get("name");
                break;
            default:
                throw new UnauthorizedException("Unsupported OAuth provider: " + provider);
        }

        if (email == null || email.isEmpty()) {
            throw new UnauthorizedException("Email not provided by OAuth provider");
        }
        

        if (email == null || email.isEmpty()) {
            throw new UnauthorizedException("Email not provided by OAuth provider");
        }

        final String finalName = name;

        // Find or create user
        return userRepository.findByApplicationAndEmail(application, email)
                .orElseGet(() -> {
                    log.info("Creating new user from {} OAuth: {}", finalProvider, email);
                    User newUser = new User();
                    newUser.setApplication(application);
                    newUser.setEmail(email);
                    newUser.setEmailVerified(true); // OAuth providers verify email
                    newUser.setStatus(UserStatus.ACTIVE);
                    
                    // Extract name if available
                    if (finalName != null && !finalName.isEmpty()) {
                        String[] parts = finalName.split(" ", 2);
                        newUser.setFirstName(parts[0]);
                        if (parts.length > 1) {
                            newUser.setLastName(parts[1]);
                        }
                    }
                    
                    // No password for OAuth users
                    return userRepository.save(newUser);
                });
    }

    private String verifyGoogleToken(AuthConfig config, String idTokenString) {
        try {
            String clientId = config.getGoogleClientId();
            if (clientId == null || clientId.isEmpty()) {
                log.warn("Google Client ID not configured");
                throw new UnauthorizedException("Google OAuth is not configured for this application");
            }

            GoogleIdTokenVerifier.Builder verifierBuilder = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    new GsonFactory()
            );
            verifierBuilder.setAudience(Collections.singletonList(clientId));
            GoogleIdTokenVerifier verifier = verifierBuilder.build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new UnauthorizedException("Invalid Google ID Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            return payload.getEmail();

        } catch (Exception e) {
            log.error("Google OAuth verification failed", e);
            String msg = e.getMessage() != null ? e.getMessage() : "Invalid token format or verification error";
            throw new UnauthorizedException("Google login failed: " + msg);
        }
    }

    private Map<String, String> verifyGithubToken(AuthConfig config, String accessToken) {
        try {
            String clientId = config.getGithubClientId();
            if (clientId == null || clientId.isEmpty()) {
                throw new UnauthorizedException("GitHub OAuth is not configured for this application");
            }

            // Verify token by calling GitHub API
            WebClient webClient = webClientBuilder.build();
            Map<String, Object> response = webClient.get()
                    .uri("https://api.github.com/user")
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                throw new UnauthorizedException("Invalid GitHub access token");
            }

            String email = (String) response.get("email");
            
            // If email is null, try to fetch from emails endpoint
            if (email == null) {
                java.util.List<Map> emails = webClient.get()
                        .uri("https://api.github.com/user/emails")
                        .header("Authorization", "Bearer " + accessToken)
                        .header("Accept", "application/json")
                        .retrieve()
                        .bodyToFlux(Map.class)
                        .collectList()
                        .block();

                if (emails != null && !emails.isEmpty()) {
                    // Find primary email
                    for (Map emailObj : emails) {
                        if (Boolean.TRUE.equals(emailObj.get("primary"))) {
                            email = (String) emailObj.get("email");
                            break;
                        }
                    }
                    // Fallback to first email
                    if (email == null) {
                        email = (String) emails.get(0).get("email");
                    }
                }
            }

            String name = (String) response.get("name");
            
            return Map.of(
                    "email", email != null ? email : "",
                    "name", name != null ? name : ""
            );

        } catch (Exception e) {
            log.error("GitHub OAuth verification failed", e);
            throw new UnauthorizedException("GitHub login failed: " + e.getMessage());
        }
    }

    private Map<String, String> verifyMetaToken(AuthConfig config, String accessToken) {
        try {
            String appId = config.getMetaAppId();
            if (appId == null || appId.isEmpty()) {
                throw new UnauthorizedException("Meta OAuth is not configured for this application");
            }

            // Verify token by calling Facebook Graph API
            WebClient webClient = webClientBuilder.build();
            Map<String, Object> response = webClient.get()
                    .uri("https://graph.facebook.com/me?fields=id,email,name&access_token=" + accessToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || response.containsKey("error")) {
                throw new UnauthorizedException("Invalid Meta/Facebook access token");
            }

            String email = (String) response.get("email");
            String name = (String) response.get("name");

            return Map.of(
                    "email", email != null ? email : "",
                    "name", name != null ? name : ""
            );

        } catch (Exception e) {
            log.error("Meta OAuth verification failed", e);
            throw new UnauthorizedException("Meta/Facebook login failed: " + e.getMessage());
        }
    }
    private Map<String, String> verifyAuth0Token(AuthConfig config, String accessToken) {
        try {
            String domain = config.getAuth0Domain();
            if (domain == null || domain.isEmpty()) {
                throw new UnauthorizedException("Auth0 Domain is not configured for this application");
            }
            
            // Normalize domain (remove https:// if present, ensuring it's just host or fully qualified URL)
            // Auth0 domains are usually "tenant.region.auth0.com"
            // We need "https://tenant.region.auth0.com/userinfo"
            String userinfoUrl = domain.startsWith("http") ? domain : "https://" + domain;
            if (!userinfoUrl.endsWith("/")) userinfoUrl += "/";
            userinfoUrl += "userinfo";

            // Verify token by calling Auth0 UserInfo API
            WebClient webClient = webClientBuilder.build();
            Map<String, Object> response = webClient.get()
                    .uri(userinfoUrl)
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                throw new UnauthorizedException("Invalid Auth0 access token");
            }

            String email = (String) response.get("email");
            String name = (String) response.get("name");
            
            // Normalize name/email if missing
            if (response.containsKey("nickname") && (name == null || name.isEmpty())) {
                 name = (String) response.get("nickname");
            }

            return Map.of(
                    "email", email != null ? email : "",
                    "name", name != null ? name : ""
            );

        } catch (Exception e) {
            log.error("Auth0 verification failed", e);
            String msg = e.getMessage() != null ? e.getMessage() : "Invalid token or verification error";
            throw new UnauthorizedException("Auth0 login failed: " + msg);
        }
    }
}
