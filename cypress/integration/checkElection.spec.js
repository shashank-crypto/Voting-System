///<reference types="cypress"/>

describe("Should go to the home page", () => {
    it("Checks the home page", () => {
        cy.visit('/');
    })
})