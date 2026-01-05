package com.openclassrooms.testing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

import lombok.extern.slf4j.Slf4j;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest( classes = SpringBootSecurityJwtApplication.class)
@ActiveProfiles("test")
@Transactional 
@Slf4j // pour log
public class TeacherServiceTest {
     // test integration, (Junit sans mockito)
     @Autowired
     TeacherService teacherService;

    @Test
    void testFindAll_success(){
        //ARRANGE
        Teacher t1 = new Teacher();
        t1.setLastName("tata");
        t1.setFirstName("toto");
        t1.setCreatedAt(LocalDateTime.now());
        t1.setUpdatedAt(LocalDateTime.now());

        teacherService.create(t1);

        Teacher t2 = new Teacher();
        t2.setLastName("bob");
        t2.setFirstName("null");
        t2.setCreatedAt(LocalDateTime.now());
        t2.setUpdatedAt(LocalDateTime.now());

        teacherService.create(t2);

        //ACT
        List<Teacher> listTeacher = teacherService.findAll();

        //ASSERT (2 ajouter + 2 de base en BDD test dans data.sql)
        assertEquals(listTeacher.size(),4);

    }

    @Test
    void testFindById_success(){
        //ARRANGE
        List<Teacher> listTeacher = teacherService.findAll();
        Teacher t = listTeacher.getFirst(); // il y a déja des teacher dans le data.sql donc je recup le premier pour son ID

        //ACT
        Teacher t2 = teacherService.findById(t.getId());
        
        //ASSERT
        assertEquals(t.getId(),t2.getId());
        assertEquals(t.getFirstName(),t2.getFirstName());

    }

    @Test
    void testFindById_NotFound(){
        //ARRANGE
        List<Teacher> listTeacher = teacherService.findAll();
        Teacher t = listTeacher.getFirst(); // il y a déja des teacher dans le data.sql donc je recup le premier pour son ID

        //ACT
        Teacher tnull = teacherService.findById(t.getId()+10);

        //ASSERT
        assertNull(tnull);
    }
     


    @Test
    void testFindById_Doublon(){
        //ARRANGE
        List<Teacher> listTeacher = teacherService.findAll();
        int nbcontrol = listTeacher.size();
        Teacher toriginal = listTeacher.getFirst(); // il y a déja des teacher dans le data.sql donc je recup le premier pour son ID

        Teacher tDouble= new Teacher();
        tDouble.setId(toriginal.getId());
        tDouble.setFirstName(toriginal.getFirstName());
        tDouble.setLastName(toriginal.getLastName());
        tDouble.setCreatedAt(toriginal.getCreatedAt());
        tDouble.setUpdatedAt(toriginal.getUpdatedAt());

        //ACT
        teacherService.create(tDouble);
        listTeacher = teacherService.findAll();
        int nbtest = listTeacher.size();

        //ASSERT
        assertEquals(nbcontrol,nbtest);

    }
    
}
