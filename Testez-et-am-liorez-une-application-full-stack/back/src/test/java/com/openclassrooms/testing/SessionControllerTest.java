package com.openclassrooms.testing;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;


@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc(addFilters = false) // Désactive la sécurité pour tester les routes librement
@ActiveProfiles("test")
public class SessionControllerTest {
 @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Session session;
    private SessionDto sessionDto;

    @BeforeEach
    void setUp() {
        session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");

        sessionDto = new SessionDto();
        sessionDto.setName("Yoga Session");
    }

    @Test
    void testFindById_Success() throws Exception {
        // Arrange
        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // Act & Assert
        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Session"));
    }

    @Test
    void testFindById_NotFound() throws Exception {
        // Arrange
        when(sessionService.getById(99L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/session/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testFindAll() throws Exception {
        // Arrange
        List<Session> sessions = Collections.singletonList(session);
        List<SessionDto> sessionDtos = Collections.singletonList(sessionDto);

        // Act & Assert
        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Yoga Session"));
    }

    @Test
    void testCreate() throws Exception {
        // Arrange
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // Act & Assert
        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Session"));
    }

    @Test
    void testDelete_Success() throws Exception {
        // Arrange
        when(sessionService.getById(1L)).thenReturn(session);

        // Act & Assert
        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete_NotFound() throws Exception {
        // Arrange
        when(sessionService.getById(1L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testParticipate_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/session/1/participate/2"))
                .andExpect(status().isOk());

        verify(sessionService, times(1)).participate(1L, 2L);
    }

    @Test
    void testNoLongerParticipate_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/session/1/participate/2"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdate() throws Exception {
        // Arrange
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(1L, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // Act & Assert
        mockMvc.perform(put("/api/session/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk());
    }
}
