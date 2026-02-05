package com.tokenly.backend.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.dto.responce.user.UserResponse;
import com.tokenly.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final ObjectMapper objectMapper;

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .customData(jsonToMap(user.getCustomData()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    private Map<String, Object> jsonToMap(String json) {
        try {
            return json == null
                    ? null
                    : objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            throw new IllegalStateException("Invalid customData JSON", e);
        }
    }
}
