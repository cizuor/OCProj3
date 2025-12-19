import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';
import { of } from 'rxjs';

import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { TeacherService } from 'src/app/core/service/teacher.service';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let router: Router;
  let sessionApiService: SessionApiService;



  let sessionApiSpy: any;
  let matSnackBarSpy: any;
  let routerSpy: any;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockSession = {
    id: 1,
    name: 'Session de Yoga',
    description: 'Une session relaxante',
    teacher_id: 10,
    users: [2],
    date: new Date(),
  };

  const mockTeacher = { id: 10, firstName: 'John', lastName: 'Doe' };

  beforeEach(async () => {

    sessionApiSpy = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of(null)),
      participate: jest.fn().mockReturnValue(of(null)),
      unParticipate: jest.fn().mockReturnValue(of(null)),
    };

    const teacherServiceSpy = {
      detail: jest.fn().mockReturnValue(of(mockTeacher)),
    };

    matSnackBarSpy  = { open: jest.fn() };

    routerSpy = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DetailComponent],
      providers: [
        { provide: SessionApiService, useValue: sessionApiSpy },
        { provide: TeacherService, useValue: teacherServiceSpy },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        },]
    })
      .compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


   it('should create and fetch session details on init', () => {
    // Vérifie que les données sont chargées et affichées
    expect(component.session).toEqual(mockSession);
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    // Vérifie que le DOM contient le nom de la session
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Session De Yoga');
  });

  it('should call delete and navigate back to sessions when delete is clicked', () => {
    // On simule le clic sur le bouton supprimer
    component.delete();
    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should call participate and refresh session', () => {
    // On espionne la méthode fetchSession pour voir si elle est rappelée
    const fetchSpy = jest.spyOn(component as any, 'fetchSession');
    component.participate();
    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should go back in history when back() is called', () => {
    const spyHistory = jest.spyOn(window.history, 'back');
    component.back();
    expect(spyHistory).toHaveBeenCalled();
  });
});

