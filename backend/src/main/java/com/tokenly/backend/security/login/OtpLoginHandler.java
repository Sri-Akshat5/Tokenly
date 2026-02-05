package com.tokenly.backend.security.login;

import com.tokenly.backend.dto.request.auth.UserLoginRequest;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.exception.UnauthorizedException;
import com.tokenly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component("OTP")
@RequiredArgsConstructor
public class OtpLoginHandler implements LoginMethodHandler {

    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;

    private static final String OTP_PREFIX = "tokenly:otp:";

    @Override
    public User authenticate(Application application, UserLoginRequest request) {
        String email = request.getEmail();
        String code = request.getOtpCode();

        if (code == null || code.isEmpty()) {
            throw new UnauthorizedException("OTP code is required");
        }

        String redisKey = OTP_PREFIX + application.getId() + ":" + email;
        String storedCode = redisTemplate.opsForValue().get(redisKey);

        if (storedCode == null || !storedCode.equals(code)) {
            throw new UnauthorizedException("Invalid or expired OTP code");
        }

        // OTP verified, remove it
        redisTemplate.delete(redisKey);

        return userRepository.findByApplicationAndEmail(application, email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
}
