import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAuthService = {
    register: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const validRegisterForm = {
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers:[
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize with invalid empty form', () => {
    expect(component.form.valid).toBeFalsy();
    expect(component.form.get('email')?.value).toBe('');
    expect(component.onError).toBe(false);
  });

  it('should call authService.register and navigate to login on success', () => {
    mockAuthService.register.mockReturnValue(of(void 0));
    component.form.setValue(validRegisterForm);
    component.submit();
    expect(mockAuthService.register).toHaveBeenCalledWith(validRegisterForm);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true on registration failure', () => {
    mockAuthService.register.mockReturnValue(throwError(() => new Error('Sign up failed')));
    component.form.setValue(validRegisterForm);
    component.submit();
    expect(mockAuthService.register).toHaveBeenCalledWith(validRegisterForm);
    expect(component.onError).toBe(true); // Le flag d'erreur doit être activé
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // On ne doit pas changer de page
  });
});
