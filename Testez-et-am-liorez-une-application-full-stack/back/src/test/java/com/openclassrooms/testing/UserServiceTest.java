package com.openclassrooms.testing;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest(classes = SpringBootSecurityJwtApplication.class) // Charge le contexte Spring
@ActiveProfiles("test") // Utilise application-test.yml (H2)
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;


    @Test
    void testSaveUser_shouldPersistUser() {
        // ARRANGE
        User user = new User();
        user.setEmail("save@test.com");
        user.setFirstName("Jean");
        user.setLastName("Dupont");
        user.setPassword("password123");

        // ACT
        User savedUser = userService.saveUser(user);

        // ASSERT
        assertNotNull(savedUser.getId(), "L'ID devrait être généré par la BDD");
        assertEquals("save@test.com", savedUser.getEmail());
    }

    @Test
    void testFindById_shouldReturnUser() {
        // ARRANGE : On crée un utilisateur d'abord
        User user = new User("find@test.com", "Nom", "Prenom", "pass", false);
        User saved = userService.saveUser(user);

        // ACT
        User found = userService.findById(saved.getId());

        // ASSERT
        assertNotNull(found);
        assertEquals(saved.getId(), found.getId());
        assertEquals("find@test.com", found.getEmail());
    }

    @Test
    void testFindByEmail_shouldReturnOptionalUser() {
        // ARRANGE
        String email = "email@test.com";
        User user = new User(email, "Nom", "Prenom", "pass", false);
        userService.saveUser(user);

        // ACT
        Optional<User> found = userService.findByEmail(email);

        // ASSERT
        assertTrue(found.isPresent());
        assertEquals(email, found.get().getEmail());
    }

    @Test
    void testExistsByEmail_shouldReturnTrueOrFalse() {
        // ARRANGE
        String email = "exists@test.com";
        User user = new User(email, "Nom", "Prenom", "pass", false);
        userService.saveUser(user);

        // ACT & ASSERT
        assertTrue(userService.existsByEmail(email), "L'email devrait exister");
        assertFalse(userService.existsByEmail("nexistepas@test.com"), "L'email ne devrait pas exister");
    }

    @Test
    void testDelete_shouldRemoveUser() {
        // ARRANGE
        User user = new User("delete@test.com", "Nom", "Prenom", "pass", false);
        User saved = userService.saveUser(user);
        Long id = saved.getId();

        // ACT
        userService.delete(id);

        // ASSERT
        User found = userService.findById(id);
        assertNull(found);
    }

}
