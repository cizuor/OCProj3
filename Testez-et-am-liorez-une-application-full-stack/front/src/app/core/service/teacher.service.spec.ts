import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../models/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
            providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpCtrl.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should retrieve all teachers via GET', () => {
    // 1. Préparation des données fictives (un tableau de Teacher)
    const mockTeachers: Teacher[] = [
      {
        id: 1,
        lastName: 'Doe',
        firstName: 'John',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02')
      },
      {
        id: 2,
        lastName: 'Smith',
        firstName: 'Jane',
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-02-02')
      }
    ];

    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(2); // On vérifie la taille
      expect(teachers).toEqual(mockTeachers); // On vérifie le contenu exact
    });


    //Interception de la requête
    const req = httpCtrl.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);

    });

    it('should retrieve teacher details by ID via GET', () => {
    const mockTeacher: Teacher = {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };
    const teacherId = '1';

    service.detail(teacherId).subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher);
    });

    //Interception de la requête
    const req = httpCtrl.expectOne(`api/teacher/${teacherId}`);
    expect(req.request.method).toBe('GET');
    //Envoi de la réponse simulée
    req.flush(mockTeacher);
  });

});

