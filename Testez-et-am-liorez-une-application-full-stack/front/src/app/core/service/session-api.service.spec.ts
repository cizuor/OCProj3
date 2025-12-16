import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../models/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [SessionApiService]
    });
    service = TestBed.inject(SessionApiService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

 afterEach(() => {
    httpCtrl.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should retrieve all sessions via GET', () => {
    const mockSessions: Session[] = [
      { id: 1, name: 'Yoga', date: new Date(), description: 'Relax', teacher_id: 1, users: [] },
      { id: 2, name: 'Pilates', date: new Date(), description: 'Workout', teacher_id: 2, users: [] }
    ];

    service.all().subscribe((sessions) => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpCtrl.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });


  it('should delete a session via DELETE', () => {
    const id = '1';
    service.delete(id).subscribe(() => {
      expect(true).toBeTruthy();
    });

    const req = httpCtrl.expectOne(`api/session/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Retourne un objet vide pour simuler le succès (200 OK)
  });



  it('should create a session via POST', () => {
    const newSession: Session = { name: 'Cardio', date: new Date(), description: 'Run', teacher_id: 1, users: [] };
    const createdSession: Session = { ...newSession, id: 3 };

    service.create(newSession).subscribe((session) => {
      expect(session).toEqual(createdSession);
    });

    const req = httpCtrl.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSession);
    req.flush(createdSession);
  });


   it('should update a session via PUT', () => {
    const updateSession: Session = { id: 1, name: 'Yoga Advanced', date: new Date(), description: 'Hard', teacher_id: 1, users: [] };
    const id = '1';

    service.update(id, updateSession).subscribe((session) => {
      expect(session).toEqual(updateSession);
    });

    const req = httpCtrl.expectOne(`api/session/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateSession);
    req.flush(updateSession);
  });

  it('should participate in a session via POST', () => {
    const sessionId = '1';
    const userId = '10';

    service.participate(sessionId, userId).subscribe(() => {
      expect(true).toBeTruthy();
    });

    const req = httpCtrl.expectOne(`api/session/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull(); // Le service envoie 'null' comme body
    req.flush({});
  });



  it('should unParticipate from a session via DELETE', () => {
    const sessionId = '1';
    const userId = '10';

    service.unParticipate(sessionId, userId).subscribe(() => {
      expect(true).toBeTruthy();
    });

    const req = httpCtrl.expectOne(`api/session/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});
