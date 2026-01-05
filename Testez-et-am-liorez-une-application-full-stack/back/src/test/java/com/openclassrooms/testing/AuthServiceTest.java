package com.openclassrooms.testing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.services.AuthService;
import com.openclassrooms.starterjwt.services.UserService;


@SpringBootTest( classes = SpringBootSecurityJwtApplication.class)
@ActiveProfiles("test")
@Transactional 
public class AuthServiceTest {
    // test integration, (Junit sans mockito)
    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Test
    void testRegisterUser_success(){
        //ARRANGE 
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@test.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        //ACT
        try{
            authService.registerUser(signupRequest);
        }catch(Exception ex){

        }

        // ASSERT
        assertTrue(userService.existsByEmail("newuser@test.com"));
        User savedUser = userService.findByEmail("newuser@test.com").orElseThrow();
        assertEquals("John", savedUser.getFirstName());
        assertNotEquals("password123", savedUser.getPassword());
        
    }

    @Test
    void testRegisterUser_whenEmailAlreadyExists() {
        // ARRANGE
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("existing@test.com");
        signupRequest.setPassword("pass");
        // crée l'utilisateur en base pour bloquer le registerUser
        User existingUser = new User("existing@test.com", "Nom", "Prenom", "hash", false);
        userService.saveUser(existingUser);

        // ACT & ASSERT
        Exception exception = assertThrows(Exception.class, () -> {
            authService.registerUser(signupRequest);
        });
        assertEquals("Error: Email is already taken!", exception.getMessage());
    }

    @Test
    void testAuthenticate_success() throws Exception {
        // ARRANGE
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("login@test.com");
        signupRequest.setFirstName("Alice");
        signupRequest.setLastName("Test");
        signupRequest.setPassword("secret123");
        authService.registerUser(signupRequest);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@test.com");
        loginRequest.setPassword("secret123");

        // ACT
        JwtResponse response = authService.authenticate(loginRequest);

        // ASSERT
        assertNotNull(response.getToken());
        assertEquals("login@test.com", response.getUsername());
        assertEquals("Alice", response.getFirstName());
        assertFalse(response.getAdmin());
    }


    @Test
    void testAuthenticate_whenCredentialsAreInvalid() {
        // ARRANGE
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("wrong@test.com");
        loginRequest.setPassword("wrongpass");

        // ACT & ASSERT
        assertThrows(BadCredentialsException.class, () -> {
            authService.authenticate(loginRequest);
        });
    }



}
