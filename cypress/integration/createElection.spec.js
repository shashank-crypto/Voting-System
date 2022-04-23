///<reference types="cypress"/>

describe("Should go to create election page and create it", () => {
    it("should create an election", () => {
        // cy.visit('/elections/create')
        cy.visit('/')
        cy.get('#createElectionButton').click()
        cy.get('#electionName').type("India 2024 elections")
        cy.get('#electionForm').submit()
    })
})