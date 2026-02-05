package com.tokenly.backend.service;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.UserStatus;
import com.tokenly.backend.exception.ResourceNotFoundException;
import com.tokenly.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Application testApplication;

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
    }

    @Test
    void findById_WithValidId_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("user@test.com", result.getEmail());
        verify(userRepository).findById(1L);
    }

    @Test
    void findById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.findById(999L));
    }

    @Test
    void findByEmailAndApplication_WithValidData_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByEmailAndApplicationId("user@test.com", 1L))
            .thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.findByEmailAndApplication("user@test.com", testApplication);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("user@test.com", result.get().getEmail());
    }

    @Test
    void getAllUsersByApplication_ShouldReturnPagedUsers() {
        // Arrange
        List<User> users = Arrays.asList(testUser, new User());
        Page<User> page = new PageImpl<>(users);
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findByApplicationId(eq(1L), any(Pageable.class))).thenReturn(page);

        // Act
        Page<User> result = userService.getAllUsersByApplication(testApplication, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        verify(userRepository).findByApplicationId(eq(1L), any(Pageable.class));
    }

    @Test
    void blockUser_WithValidUser_ShouldUpdateStatus() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.blockUser(1L);

        // Assert
        assertNotNull(result);
        assertEquals(UserStatus.BLOCKED, result.getStatus());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void unblockUser_WithValidUser_ShouldUpdateStatus() {
        // Arrange
        testUser.setStatus(UserStatus.BLOCKED);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.unblockUser(1L);

        // Assert
        assertNotNull(result);
        assertEquals(UserStatus.ACTIVE, result.getStatus());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void deleteUser_WithValidId_ShouldDeleteUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).deleteById(1L);

        // Act
        userService.deleteUser(1L);

        // Assert
        verify(userRepository).deleteById(1L);
    }

    @Test
    void searchUsers_WithQuery_ShouldReturnMatchingUsers() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        Page<User> page = new PageImpl<>(users);
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.searchByEmailOrNameInApplication(anyString(), anyLong(), any(Pageable.class)))
            .thenReturn(page);

        // Act
        Page<User> result = userService.searchUsers("user", testApplication, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(userRepository).searchByEmailOrNameInApplication(anyString(), anyLong(), any(Pageable.class));
    }

    @Test
    void updateUser_WithValidData_ShouldUpdateUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        testUser.setEmail("updated@test.com");
        User result = userService.updateUser(testUser);

        // Assert
        assertNotNull(result);
        assertEquals("updated@test.com", result.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void countUsersByApplication_ShouldReturnCount() {
        // Arrange
        when(userRepository.countByApplicationId(1L)).thenReturn(10L);

        // Act
        long result = userService.countUsersByApplication(testApplication);

        // Assert
        assertEquals(10L, result);
        verify(userRepository).countByApplicationId(1L);
    }
}
