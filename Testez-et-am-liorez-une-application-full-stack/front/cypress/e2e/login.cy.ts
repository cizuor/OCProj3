/// <reference types="cypress" />
describe('Login spec', () => {

  beforeEach(() => {
    cy.visit('/login')
  })
  it('Login successfull', () => {


    // cas du test d'integration du front end
    /*cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')*/


      //todo ne pas mettre un compte admin pour test
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')

    cy.contains('Rentals available').should('be.visible')
  })


  it('Should show error on bad credentials', () => {

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    }).as('loginRequest')

    cy.get('input[formControlName=email]').type("wrong@test.com")
    cy.get('input[formControlName=password]').type("wrongpass{enter}{enter}")
    cy.get('.error').should('be.visible').and('contain', 'An error occurred')
  })

  it('Should disable submit button if fields are empty', () => {

    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('input[formControlName=email]').type('test@test.com').clear()
    cy.get('input[formControlName=password]').focus().blur() 

    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
  })
});