///<reference types="cypress"/>

describe("Navigation to the homepage", () => {
    it("should navigate to the homepage", () => {
        cy.visit('/')
    })
})