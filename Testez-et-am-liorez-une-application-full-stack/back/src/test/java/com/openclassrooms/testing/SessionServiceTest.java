package com.openclassrooms.testing;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

     @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService; // Injecte les deux mocks ci-dessus

    private Session session;
    private User user;


    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        session = new Session();
        session.setId(10L);
        session.setName("Yoga Session");
        session.setUsers(new ArrayList<>()); 
    }


    @Test
    void testCreate() {
        when(sessionRepository.save(session)).thenReturn(session);
        Session result = sessionService.create(session);
        assertEquals("Yoga Session", result.getName());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testGetById_Success() {
        when(sessionRepository.findById(10L)).thenReturn(Optional.of(session));
        Session result = sessionService.getById(10L);
        assertNotNull(result);
        assertEquals(10L, result.getId());
    }

    @Test
    void testDelete() {
        sessionService.delete(10L);
        verify(sessionRepository, times(1)).deleteById(10L);
    }

 @Test
    void participate_Success() {
        // ARRANGE
        when(sessionRepository.findById(10L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // ACT
        sessionService.participate(10L, 1L);

        // ASSERT
        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void participate_NotFound() {
        // Simuler que la session n'existe pas
        when(sessionRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            sessionService.participate(10L, 1L);
        });
    }

    @Test
    void participate_AlreadyParticipating() {
        // ARRANGE
        session.getUsers().add(user);
        when(sessionRepository.findById(10L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // ACT & ASSERT
        assertThrows(BadRequestException.class, () -> {
            sessionService.participate(10L, 1L);
        });
    }


    @Test
    void noLongerParticipate_Success() {
        // ARRANGE
        session.getUsers().add(user);
        when(sessionRepository.findById(10L)).thenReturn(Optional.of(session));

        // ACT
        sessionService.noLongerParticipate(10L, 1L);

        // ASSERT
        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void noLongerParticipate_NotParticipating() {
        // ARRANGE 
        when(sessionRepository.findById(10L)).thenReturn(Optional.of(session));

        // ACT & ASSERT
        assertThrows(BadRequestException.class, () -> {
            sessionService.noLongerParticipate(10L, 1L);
        });
    }


}
