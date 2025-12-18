import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;


  const mockAuthService = {
    login: jest.fn()
  };

  const mockSessionService = {
    logIn: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockSessionInfo: SessionInformation = {
    token: 'jwt-token',
    type: 'Bearer',
    id: 1,
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe', 
    admin: false
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }],
      imports: [
        LoginComponent,
        NoopAnimationsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //verif que les champ qui devrai étre visible le sont 
  it('should initialize with invalid empty form', () => {
    expect(component.form.valid).toBeFalsy();
    expect(component.hide).toBe(true);
    expect(component.onError).toBe(false);
  });


  it('should call authService.login, logIn session and navigate on success', () => {
    mockAuthService.login.mockReturnValue(of(mockSessionInfo));
    const loginData = { email: 'test@test.com', password: 'password123' };
    component.form.setValue(loginData);
    component.submit();
    expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInfo);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true on login failure', () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error('Login failed')));
    component.form.setValue({ email: 'test@test.com', password: 'wrong-password' });
    component.submit();
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(component.onError).toBe(true);
    expect(mockSessionService.logIn).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
