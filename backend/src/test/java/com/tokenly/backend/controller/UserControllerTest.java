package com.tokenly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenly.backend.entity.ApiKey;
import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.service.ApiKeyService;
import com.tokenly.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private ApiKeyService apiKeyService;

    private Application testApplication;
    private User testUser;

    @BeforeEach
    void setUp() {
        testApplication = new Application();
        testApplication.setId(1L);
        testApplication.setAppName("Test App");

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@test.com");
        testUser.setApplication(testApplication);
        testUser.setStatus(UserStatus.ACTIVE);

        when(apiKeyService.validateApiKey(anyString())).thenReturn(testApplication);
    }

    @Test
    void getAllUsers_ShouldReturnPagedUsers() throws Exception {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        Page<User> page = new PageImpl<>(users);
        
        when(userService.getAllUsersByApplication(any(Application.class), any()))
            .thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/users")
                .header("X-API-Key", "test-api-key")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].email").value("user@test.com"));
    }

    @Test
    void getUserById_WithValidId_ShouldReturnUser() throws Exception {
        // Arrange
        when(userService.findById(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(get("/api/users/1")
                .header("X-API-Key", "test-api-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@test.com"));
    }

    @Test
    void blockUser_WithValidId_ShouldReturnUpdatedUser() throws Exception {
        // Arrange
        testUser.setStatus(UserStatus.BLOCKED);
        when(userService.blockUser(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/api/users/1/block")
                .header("X-API-Key", "test-api-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("BLOCKED"));
    }

    @Test
    void unblockUser_WithValidId_ShouldReturnUpdatedUser() throws Exception {
        // Arrange
        when(userService.unblockUser(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/api/users/1/unblock")
                .header("X-API-Key", "test-api-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void deleteUser_WithValidId_ShouldReturnNoContent() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/users/1")
                .header("X-API-Key", "test-api-key"))
                .andExpect(status().isNoContent());
    }

    @Test
    void searchUsers_WithQuery_ShouldReturnMatchingUsers() throws Exception {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        Page<User> page = new PageImpl<>(users);
        
        when(userService.searchUsers(anyString(), any(Application.class), any()))
            .thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/users/search")
                .header("X-API-Key", "test-api-key")
                .param("query", "user")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].email").value("user@test.com"));
    }
}
