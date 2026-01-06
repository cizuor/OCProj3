package com.openclassrooms.testing;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;


@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc(addFilters = false) // On désactive les filtres mais on va simuler l'utilisateur
@ActiveProfiles("test")
public class UserControllerTest {
 @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    private User user;
    private UserDto userDto;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        // L'utilisateur en base de données
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setLastName("Doe");
        user.setFirstName("John");

        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("test@test.com");

        // L'utilisateur connecté (Principal)
        // On utilise UserDetailsImpl car ton contrôleur fait un cast (UserDetails)
        userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .build();
    }

    @Test
    void testFindById_Success() throws Exception {
        // ARRANGE
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);
        // ACT
        mockMvc.perform(get("/api/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@test.com"));
        // ASSERT
        verify(userService, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() throws Exception {
          // ARRANGE
        when(userService.findById(99L)).thenReturn(null);
        
        // ACT & ASSERT
        mockMvc.perform(get("/api/user/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDelete_Success() throws Exception {
        // ARRANGE
        when(userService.findById(1L)).thenReturn(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // ACT
        mockMvc.perform(delete("/api/user/1")
                .with(user(userDetails))) 
                .andExpect(status().isOk());

        // ASSERT
        verify(userService, times(1)).delete(1L);
    }

    @Test
    void testDelete_Unauthorized() throws Exception {
        // ARRANGE
        when(userService.findById(1L)).thenReturn(user);

        UserDetailsImpl hackerDetails = UserDetailsImpl.builder()
                .id(2L)
                .username("hacker@test.com")
                .build();


        Authentication authentication = new UsernamePasswordAuthenticationToken(
            hackerDetails, 
            null, 
            hackerDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // ACT
        mockMvc.perform(delete("/api/user/1")
                .with(user(hackerDetails))) 
                .andExpect(status().isUnauthorized());

        // ASSERT
        verify(userService, never()).delete(1L);
    }

    @Test
    void testDelete_NotFound() throws Exception {
        //ARRANGE
        when(userService.findById(1L)).thenReturn(null);
        // ACT & ASSERT
        mockMvc.perform(delete("/api/user/1")
                .with(user(userDetails)))
                .andExpect(status().isNotFound());
    }
}
