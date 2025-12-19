import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { SessionService } from './core/service/session.service';
import { AuthService } from './core/service/auth.service';


describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let sessionService: SessionService;

  const mockSessionService = {
    $isLogged: jest.fn(),
    logOut: jest.fn()
  };

  const mockAuthService = {};


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should return true when user is logged in', (done) => {

    mockSessionService.$isLogged.mockReturnValue(of(true));

    component.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);
      done();
    });
  });

  it('should return false when user is logged out', (done) => {
    mockSessionService.$isLogged.mockReturnValue(of(false));

    component.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(false);
      done();
    });
  });

  it('should logout and navigate to home', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.logout();

    expect(sessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });


  it('should display logout link only when logged in', () => {
    mockSessionService.$isLogged.mockReturnValue(of(true));
    fixture.detectChanges(); 
    
    const compiled = fixture.nativeElement;
    const logoutLink = Array.from(compiled.querySelectorAll('span'))
      .find((el: any) => el.textContent.includes('Logout'));
    
    expect(logoutLink).toBeTruthy();

    mockSessionService.$isLogged.mockReturnValue(of(false));
    fixture.detectChanges();
    
    const logoutLinkAfter = Array.from(fixture.nativeElement.querySelectorAll('span'))
      .find((el: any) => el.textContent.includes('Logout'));
      
    expect(logoutLinkAfter).toBeFalsy();
  });
});
