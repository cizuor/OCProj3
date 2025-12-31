/// <reference types="cypress" />

describe('Sessions test spec', () => {
  
  const sessionName = 'Yoga E2E ' + Date.now();
  const updatedName = sessionName + ' - Updated';

  const adminUser = { id: 1, admin: true, firstName: 'Admin', lastName: 'User', email: 'yoga@studio.com' };

  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[formControlName=email]').type(adminUser.email);
    cy.get('input[formControlName=password]').type("test!1234{enter}");
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/sessions');
    cy.intercept('POST', '**/api/session').as('createReq');
    cy.intercept('PUT', '**/api/session/**').as('updateReq');
    cy.intercept('DELETE', '**/api/session/**').as('deleteReq');
  });

  it('should complete the full session lifecycle (Create -> Edit -> Delete)', () => {
    // on va dans la creation de session
    cy.get('button[routerLink="create"]').click();
    cy.url().should('include', '/sessions/create');
    
    // on verifie que on peu rien envoyer si les champ sont pas remplie
    cy.get('input[formControlName=name]').focus().blur();
    cy.get('button[type="submit"]').should('be.disabled');

    // on remplie les champ de la session test
    cy.get('input[formControlName=name]').type(sessionName);
    cy.get('input[formControlName=date]').type('2025-01-01');
    cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').first().click();
    cy.get('textarea[formControlName=description]').type('Une session créée par Cypress');
    
    cy.get('button[type="submit"]').click();

    // verifie que la session a bien été crée
    cy.contains(sessionName,{ timeout: 10000 }).should('be.visible');

    // on passe en edition
    cy.contains('mat-card', sessionName).contains('Edit').click();
    // on change le nom
    cy.get('input[formControlName=name]').clear().type(updatedName);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
    // on verifie si une session avec le nouveau nom existe
    cy.contains(updatedName,{ timeout: 10000 }).should('be.visible');


    cy.contains('mat-card', updatedName).contains('Detail').click();
    cy.get('button').contains('Delete').click();

    cy.url().should('include', '/sessions');
    cy.contains(updatedName,{ timeout: 10000 }).should('not.exist');
  });

  it('Should logout successfully after the cycle', () => {
    //cy.visit('/sessions');
    cy.contains('Logout').click();
    cy.contains('Login').should('be.visible');
  });

});