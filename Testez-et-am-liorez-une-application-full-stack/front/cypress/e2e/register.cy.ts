/// <reference types="cypress" />

describe('Register spec', () => {

  beforeEach(() => {
    cy.visit('/register')
  })

  it('Should register successfully', () => {

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: { message: 'User registered successfully' }
    }).as('registerRequest')

    cy.get('input[formControlName=firstName]').type("Jean")
    cy.get('input[formControlName=lastName]').type("Dupont")
    cy.get('input[formControlName=email]').type("jean.dupont@test.com")
    cy.get('input[formControlName=password]').type("Test1234!")

    cy.get('button[type="submit"]').click()

    cy.wait('@registerRequest')

    cy.url().should('include', '/login')
  })

  it('Should disable submit button if fields are empty', () => {

    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('input[formControlName=firstName]').type("Jean")
    cy.get('button[type="submit"]').should('be.disabled')
  })


  // test le petit trait rouge sous le champ si on l'a select mais pas remplis
  it('Should show validation error on invalid input', () => {

    cy.get('input[formControlName=email]').focus().blur()


    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    
  })
})