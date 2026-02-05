package com.tokenly.backend.controller;

import com.tokenly.backend.dto.common.ApiResponse;
import com.tokenly.backend.dto.responce.user.UserResponse;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;

    // User will come from JWT security context later
    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser(
            @RequestAttribute User user
    ) {
        return ApiResponse.success(userMapper.toResponse(user));
    }
}
