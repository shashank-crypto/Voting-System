///<reference types="cypress"/>

describe("Should go to all elections page", () => {
    it("click on elections page", () => {
        cy.visit('/')
        cy.get('#checkElections').click()
    })
})