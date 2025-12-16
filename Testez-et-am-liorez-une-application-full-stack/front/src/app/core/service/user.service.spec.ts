import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { User } from '../models/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il n'y a pas de requêtes "perdues" ou inattendues
    httpCtrl.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by ID via GET', () => {
    const dummyUser: User = { id: 123, email: 'Alice@test.fr', lastName: 'Test', firstName: 'Alice', admin: false,   password: 'pass', createdAt: new Date('2025-01-01')    };
    const userId = 123;

    service.getById(userId.toString()).subscribe((user) => {
      expect(user).toEqual(dummyUser);
    });

    //On intercepte la requête
    const req = httpCtrl.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('GET');

    // On simule la réponse du serveur
    req.flush(dummyUser);
  });

  it('should delete a user via DELETE', () => {
    const userId = 456;
    service.delete(userId.toString()).subscribe();
    const req = httpCtrl.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    // On simule la réponse du serveur
    req.flush(null); 
  });
});
