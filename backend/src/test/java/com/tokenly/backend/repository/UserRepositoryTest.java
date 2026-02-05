package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.Environment;
import com.tokenly.backend.enums.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private Application testApplication;
    private User testUser;

    @BeforeEach
    void setUp() {
        Client client = new Client();
        client.setEmail("client@test.com");
        client.setPassword("password");
        client.setName("Test Client");
        entityManager.persist(client);

        testApplication = new Application();
        testApplication.setAppName("Test App");
        testApplication.setClient(client);
        testApplication.setEnvironment(Environment.DEVELOPMENT);
        entityManager.persist(testApplication);

        testUser = new User();
        testUser.setEmail("user@test.com");
        testUser.setPassword("password");
        testUser.setApplication(testApplication);
        testUser.setStatus(UserStatus.ACTIVE);
        entityManager.persist(testUser);

        entityManager.flush();
    }

    @Test
    void findByEmailAndApplicationId_WithExistingUser_ShouldReturnUser() {
        // Act
        Optional<User> found = userRepository.findByEmailAndApplicationId(
            "user@test.com", testApplication.getId()
        );

        // Assert
        assertTrue(found.isPresent());
        assertEquals("user@test.com", found.get().getEmail());
    }

    @Test
    void findByEmailAndApplicationId_WithNonExistentUser_ShouldReturnEmpty() {
        // Act
        Optional<User> found = userRepository.findByEmailAndApplicationId(
            "nonexistent@test.com", testApplication.getId()
        );

        // Assert
        assertFalse(found.isPresent());
    }

    @Test
    void existsByEmailAndApplicationId_WithExistingUser_ShouldReturnTrue() {
        // Act
        boolean exists = userRepository.existsByEmailAndApplicationId(
            "user@test.com", testApplication.getId()
        );

        // Assert
        assertTrue(exists);
    }

    @Test
    void existsByEmailAndApplicationId_WithNonExistentUser_ShouldReturnFalse() {
        // Act
        boolean exists = userRepository.existsByEmailAndApplicationId(
            "nonexistent@test.com", testApplication.getId()
        );

        // Assert
        assertFalse(exists);
    }

    @Test
    void findByApplicationId_ShouldReturnPagedUsers() {
        // Act
        Page<User> users = userRepository.findByApplicationId(
            testApplication.getId(), PageRequest.of(0, 10)
        );

        // Assert
        assertNotNull(users);
        assertEquals(1, users.getTotalElements());
        assertEquals("user@test.com", users.getContent().get(0).getEmail());
    }

    @Test
    void countByApplicationId_ShouldReturnCount() {
        // Act
        long count = userRepository.countByApplicationId(testApplication.getId());

        // Assert
        assertEquals(1, count);
    }

    @Test
    void searchByEmailOrNameInApplication_ShouldReturnMatchingUsers() {
        // Act
        Page<User> users = userRepository.searchByEmailOrNameInApplication(
            "user", testApplication.getId(), PageRequest.of(0, 10)
        );

        // Assert
        assertNotNull(users);
        assertTrue(users.getTotalElements() > 0);
    }

    @Test
    void findByStatus_ShouldReturnUsersWithStatus() {
        // Act
        Page<User> users = userRepository.findByApplicationIdAndStatus(
            testApplication.getId(), UserStatus.ACTIVE, PageRequest.of(0, 10)
        );

        // Assert
        assertNotNull(users);
        assertEquals(1, users.getTotalElements());
        assertEquals(UserStatus.ACTIVE, users.getContent().get(0).getStatus());
    }
}
