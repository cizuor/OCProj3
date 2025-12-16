import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [SessionService]});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

   it('should have initial state correctly set', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
    
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
    });
  });

  it('should update session information and observable on logIn', () => {
    // 1. Préparation d'un utilisateur fictif
    const mockUser: SessionInformation = {
      token: 'jwt_mock_token',
      type: 'Bearer',
      id: 1,
      username: 'jdoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    };
    service.logIn(mockUser);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockUser);

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
    });
  });

  it('should reset session information and observable on logOut', () => {
    service.isLogged = true;
    service.sessionInformation = { token: 'test', type: 'Bearer', id: 1, username: 'test', firstName: 't', lastName: 't', admin: false };
    
    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
    });
  });
});
