package com.openclassrooms.testing;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;


@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class TeacherControllerTest {
 @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private TeacherMapper teacherMapper;

    private Teacher teacher;
    private TeacherDto teacherDto;

    @BeforeEach
    void setUp() {
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Smith");
        teacher.setFirstName("John");

        teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setLastName("Smith");
        teacherDto.setFirstName("John");
    }

    @Test
    void testFindById_Success() throws Exception {
        // ARRANGE
        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        // ACT
        mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.lastName").value("Smith"));
        
        // ASSERT
        verify(teacherService, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() throws Exception {
        // ARRANGE
        when(teacherService.findById(99L)).thenReturn(null);
        // ACT & ASSERT
        mockMvc.perform(get("/api/teacher/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testFindById_BadRequest() throws Exception {
        // ACT
        mockMvc.perform(get("/api/teacher/abc"))
                .andExpect(status().isBadRequest());
        
        // ASSERT
        verifyNoInteractions(teacherService);
    }

    @Test
    void testFindAll_Success() throws Exception {
        // ARRANGE
        List<Teacher> teachers = Collections.singletonList(teacher);
        List<TeacherDto> teacherDtos = Collections.singletonList(teacherDto);

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);
        
        // ACT
        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].lastName").value("Smith"))
                .andExpect(jsonPath("$.length()").value(1));

        // ASSERT
        verify(teacherService, times(1)).findAll();
    }
}
