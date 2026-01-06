package com.openclassrooms.testing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUsername_Success() {
        // Arrange
        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("password");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        // Act
        UserDetails result = userDetailsService.loadUserByUsername("test@test.com");

        // Assert
        assertNotNull(result);
        assertEquals("test@test.com", result.getUsername());
    }

    @Test
    void loadUserByUsername_NotFound() {
        // Arrange
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("unknown@test.com");
        });
    }

    @Test
    void testUserDetailsEquals() {
        UserDetailsImpl user1 = new UserDetailsImpl(1L, "user", "first", "last", true, "pass");
        UserDetailsImpl user1Same = new UserDetailsImpl(1L, "user", "first", "last", true, "pass");
        UserDetailsImpl user2 = new UserDetailsImpl(2L, "user", "first", "last", true, "pass");

        assertEquals(user1, user1);
        assertNotEquals(user1, null);
        assertNotEquals(user1, new Object());
        assertEquals(user1, user1Same);
        assertNotEquals(user1, user2);
    }

}
