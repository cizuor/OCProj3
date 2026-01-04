
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FormComponent } from './form.component';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let sessionApiService: SessionApiService;
  let mockSessionService: any;

  const mockSession = {
    id: 1,
    name: 'Yoga Class',
    date: '2024-01-01',
    teacher_id: 10,
    description: 'Relaxing session'
  };


  const sessionApiSpy = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    create: jest.fn().mockReturnValue(of(mockSession)),
    update: jest.fn().mockReturnValue(of(mockSession))
  };


  const teacherServiceSpy = {
    all: jest.fn().mockReturnValue(of([]))
  };

  const matSnackBarSpy = { open: jest.fn() };

  // On simule une navigation par défaut (création)
  let mockRouter = {
    url: '/sessions/create',
    navigate: jest.fn()
  };

  // --- Supprimer les erreurs CSS de la console ---
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes('Could not parse CSS stylesheet')) return;
      //console.warn(msg);
    });
  });


  beforeEach(async () => {
    
    jest.clearAllMocks();
    
    mockSessionService = {
      sessionInformation: {
        admin: true
      }
    }
    await TestBed.configureTestingModule({

      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiSpy },
        { provide: TeacherService, useValue: teacherServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: {  get: (key: string) => (mockRouter.url.includes('update') ? '1' : null) } } }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    sessionApiService = TestBed.inject(SessionApiService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect if user is not admin', () => {
    // On change le service pour simuler un non-admin affin qu'il ne puisse pas crée de session
    mockSessionService.sessionInformation.admin = false;
    
    fixture.detectChanges();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });



  describe('Create Mode', () => {
    beforeEach(() => {
      mockSessionService.sessionInformation.admin = true;
      mockRouter.url = '/sessions/create';
      fixture.detectChanges();
    });

    it('should initialize an empty form', () => {
      expect(component.onUpdate).toBe(false);
      expect(component.sessionForm?.value).toEqual({
        name: '',
        date: '',
        teacher_id: '',
        description: ''
      });
    });

    it('should call create on submit', fakeAsync(() => {
      console.log('----------------LOG ---------------');
      console.log('should call create on submit:');
      component.sessionForm?.setValue({
        name: 'New Session',
        date: '2024-12-12',
        teacher_id: 1,
        description: 'New Description'
      });
      console.log('Form validity:', component.sessionForm?.valid);
      console.log('Form errors:', component.sessionForm?.errors);
      component.submit();

      tick(); 

      expect(sessionApiSpy.create).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    }));
  });


  describe('Update Mode', () => {


    beforeEach(() => {
      mockSessionService.sessionInformation.admin = true;
      mockRouter.url = '/sessions/update/1';
      fixture.detectChanges(); 
    });

    it('should initialize form with session details', () => { 
      expect(component.onUpdate).toBe(true);
      expect(sessionApiSpy.detail).toHaveBeenCalledWith('1');
      expect(component.sessionForm?.value.name).toBe('Yoga Class');
    });

    it('should be in update mode', () => {
      expect(component.onUpdate).toBe(true);
      expect(sessionApiSpy.detail).toHaveBeenCalledWith('1');
    });

    it('should call update on submit', () => {
      component.sessionForm?.setValue({
      name: 'Yoga Class Updated',
      date: '2024-01-01',
      teacher_id: 10,
      description: 'New description'
    });
      component.submit();
      expect(sessionApiSpy.update).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  it('should have invalid form when empty', () => {
    fixture.detectChanges(); // Initialise le formulaire
    component.sessionForm?.setValue({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    });
    expect(component.sessionForm?.valid).toBeFalsy();
  });
});
