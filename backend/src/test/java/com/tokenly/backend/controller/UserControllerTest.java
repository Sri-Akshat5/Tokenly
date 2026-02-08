package com.tokenly.backend.controller;

import com.tokenly.backend.dto.responce.user.UserResponse;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserMapper userMapper;

    private User testUser;
    private UserResponse testUserResponse;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("user@test.com");

        testUserResponse = UserResponse.builder()
                .id(testUser.getId())
                .email(testUser.getEmail())
                .build();
    }

    @Test
    @WithMockUser
    void getCurrentUser_ShouldReturnUser() throws Exception {
        // Arrange
        when(userMapper.toResponse(any(User.class))).thenReturn(testUserResponse);

        // Act & Assert
        mockMvc.perform(get("/api/users/me")
                .requestAttr("user", testUser)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("user@test.com"));
    }
}
