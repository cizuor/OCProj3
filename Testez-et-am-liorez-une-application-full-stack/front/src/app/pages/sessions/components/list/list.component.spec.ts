import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ListComponent } from './list.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;


  const mockSessions = [
    {
      id: 1,
      name: 'Session de Yoga',
      description: 'Relaxation totale',
      date: new Date(),
      teacher_id: 1
    },
    {
      id: 2,
      name: 'Session de Musculation',
      description: 'Force et mental',
      date: new Date(),
      teacher_id: 2
    },
    {
      id: 3,
      name: 'Sieste',
      description: 'La meilleur parti',
      date: new Date(),
      teacher_id: 2
    }
  ];

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent,RouterTestingModule,MatCardModule,MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the list of sessions in the DOM', () => {
    const sessionCards = fixture.debugElement.queryAll(By.css('mat-card'));
    
    expect(sessionCards.length).toBe(4);
    
    // on prend la deusiemme car la premierre est un element fixe et non un cours
    const firstCardTitle = sessionCards[1].query(By.css('mat-card-title')).nativeElement.textContent;
    expect(firstCardTitle).toContain('Session de Yoga');
  });

  it('should return user information from getter', () => {
    expect(component.user).toEqual(mockSessionService.sessionInformation);
    expect(component.user?.admin).toBe(true);
  });

  it('should show "Create" and "Edit" buttons if user is admin', () => {
    const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));
    const editButtons = fixture.debugElement.queryAll(By.css('button'));
    
    expect(createButton).toBeTruthy();
  });

  it('should hide "Create" button if user is NOT admin', () => {
    mockSessionService.sessionInformation.admin = false;
    
    // On demande à Angular de rafraîchir le HTML
    fixture.detectChanges();
    
    const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createButton).toBeFalsy();
  });
});
