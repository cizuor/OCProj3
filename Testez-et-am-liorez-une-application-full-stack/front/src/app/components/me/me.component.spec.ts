/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeComponent } from './me.component';
import { SessionService } from 'src/app/core/service/session.service';
import { UserService } from 'src/app/core/service/user.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';


describe('MeComponent (Jest)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()
  };



const mockUserService = {
    getById: jest.fn().mockReturnValue(of({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      admin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    delete: jest.fn().mockReturnValue(of(null))
  };


  const mockRouter = {
    navigate: jest.fn()
  }

  const mockSnackBar = {
    open: jest.fn()
  };


    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          MeComponent,
          NoopAnimationsModule
        ],
        providers: [{ provide: SessionService, useValue: mockSessionService },
          { provide: UserService, useValue: mockUserService },
          { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }],
      })
      .overrideProvider(MatSnackBar, { useValue: mockSnackBar }) 
        .compileComponents();

      fixture = TestBed.createComponent(MeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

     afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load user on init', () => {
      component.ngOnInit();

      expect(mockUserService.getById).toHaveBeenCalledWith('1');
      expect(component.user).toEqual(
        expect.objectContaining({
          id: 1,
          email: 'john@doe.com'
        })
      );
    });

    it('should call window.history.back', () => {
      const spy = jest.spyOn(window.history, 'back');

      component.back();

      expect(spy).toHaveBeenCalled();
    });

it('should delete account, show snackbar, logout and navigate away', () => {
    // Appel de la méthode
    component.delete();

    // 1. Vérifie l'appel au service delete avec l'ID
    expect(mockUserService.delete).toHaveBeenCalledWith('1');

    // 2. Vérifie la Snack Bar
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      "Your account has been deleted !", 
      'Close', 
      { duration: 3000 }
    );

    // 3. Vérifie le Logout
    expect(mockSessionService.logOut).toHaveBeenCalled();

    // 4. Vérifie la redirection
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });



});
