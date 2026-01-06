/// <reference types="cypress" />

describe('Me Component Spec (Account)', () => {

  // test admin
  it('should display admin information and no delete button', () => {
    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type("test!1234{enter}{enter}");
    
    cy.get('span[routerLink="me"]').click();

    cy.get('h1').should('contain', 'User information');
    cy.get('p').should('contain', 'Name: Admin ADMIN');
    cy.get('p').should('contain', 'Email: yoga@studio.com');
    
    cy.get('.my2').should('contain', 'You are admin');
    
    cy.get('button mat-icon').contains('delete').should('not.exist');
  });

  // test user
  it('should display simple user info and delete account', () => {
   
    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga2@studio.com");
    cy.get('input[formControlName=password]').type("test!1234{enter}{enter}");
    
    cy.get('span[routerLink="me"]').click();

    cy.get('p').should('contain', 'Delete my account:');
    
    cy.get('button[mat-icon-button]').click();
    cy.url().should('include', '/sessions');
    
    cy.get('span[routerLink="me"]').click();

    cy.intercept('DELETE', '**/api/user/**', { statusCode: 200 }).as('deleteReq');

    cy.get('button[color="warn"]').click();

    cy.wait('@deleteReq');
    cy.url().should('eq', Cypress.config().baseUrl + '/login');
  });
});