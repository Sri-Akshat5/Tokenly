package com.tokenly.backend.repository;

import com.tokenly.backend.entity.Application;
import com.tokenly.backend.entity.Client;
import com.tokenly.backend.entity.User;
import com.tokenly.backend.enums.ApplicationEnvironment;
import com.tokenly.backend.enums.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
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
        client.setPasswordHash("password");
        client.setCompanyName("Test Client");
        entityManager.persist(client);

        testApplication = new Application();
        testApplication.setAppName("Test App");
        testApplication.setClient(client);
        testApplication.setEnvironment(ApplicationEnvironment.DEV);
        entityManager.persist(testApplication);

        testUser = new User();
        testUser.setEmail("user@test.com");
        testUser.setPasswordHash("password");
        testUser.setApplication(testApplication);
        testUser.setStatus(UserStatus.ACTIVE);
        entityManager.persist(testUser);

        entityManager.flush();
    }

    @Test
    void findByApplicationAndEmail_WithExistingUser_ShouldReturnUser() {
        // Act
        Optional<User> found = userRepository.findByApplicationAndEmail(
            testApplication, "user@test.com"
        );

        // Assert
        assertTrue(found.isPresent());
        assertEquals("user@test.com", found.get().getEmail());
    }

    @Test
    void findByApplicationAndEmail_WithNonExistentUser_ShouldReturnEmpty() {
        // Act
        Optional<User> found = userRepository.findByApplicationAndEmail(
            testApplication, "nonexistent@test.com"
        );

        // Assert
        assertFalse(found.isPresent());
    }

    @Test
    void existsByApplicationAndEmail_WithExistingUser_ShouldReturnTrue() {
        // Act
        boolean exists = userRepository.existsByApplicationAndEmail(
            testApplication, "user@test.com"
        );

        // Assert
        assertTrue(exists);
    }

    @Test
    void existsByApplicationAndEmail_WithNonExistentUser_ShouldReturnFalse() {
        // Act
        boolean exists = userRepository.existsByApplicationAndEmail(
            testApplication, "nonexistent@test.com"
        );

        // Assert
        assertFalse(exists);
    }

    @Test
    void findByApplication_ShouldReturnUsers() {
        // Act
        List<User> users = userRepository.findByApplication(testApplication);

        // Assert
        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals("user@test.com", users.get(0).getEmail());
    }

    @Test
    void countByApplication_ShouldReturnCount() {
        // Act
        long count = userRepository.countByApplication(testApplication);

        // Assert
        assertEquals(1, count);
    }

    @Test
    void findByApplicationAndStatus_ShouldReturnUsersWithStatus() {
        // Act
        List<User> users = userRepository.findByApplicationAndStatus(
            testApplication, UserStatus.ACTIVE
        );

        // Assert
        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals(UserStatus.ACTIVE, users.get(0).getStatus());
    }
}
