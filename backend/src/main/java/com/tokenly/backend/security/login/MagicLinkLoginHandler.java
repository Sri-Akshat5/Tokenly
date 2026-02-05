package com.tokenly.backend.security.login;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component("MAGIC_LINK")
@RequiredArgsConstructor
public class MagicLinkLoginHandler implements LoginMethodHandler {

    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;

    private static final String MAGIC_PREFIX = "tokenly:magic:";

    @Override
    public User authenticate(Application application, UserLoginRequest request) {
        String token = request.getMagicToken();

        if (token == null || token.isEmpty()) {
            throw new UnauthorizedException("Magic token is required");
        }

        String redisKey = MAGIC_PREFIX + application.getId() + ":" + token;
        String email = redisTemplate.opsForValue().get(redisKey);

        if (email == null) {
            throw new UnauthorizedException("Invalid or expired magic link");
        }

        // Token verified, remove it
        redisTemplate.delete(redisKey);

        return userRepository.findByApplicationAndEmail(application, email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
}
