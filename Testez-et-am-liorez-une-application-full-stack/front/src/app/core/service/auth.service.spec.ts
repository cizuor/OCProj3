import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il n'y a pas de requêtes non gérées
    httpMock.verify();
  });

  it('should send a POST request to register', () => {
    const mockRequest = { email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: '123' };

    service.register(mockRequest).subscribe();

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(null); // Simule une réponse vide
  });

  it('should send a POST request and return session info on login', () => {
    const loginRequest = { email: 'test@test.com', password: '123' };
    const mockResponse = { token: 'jwt', id: 1 };

    service.login(loginRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Simule la réponse du serveur
  });
});