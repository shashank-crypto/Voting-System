///<reference types="cypress"/>


describe("Should Register a candidate", () => {
    it("check register candidate form", () => {
        cy.visit('/elections/0xbfbcF26618E157da8d9058AFA814b6c9E34B3cc3')
        cy.get('#candidateName').type("Shashank")
        cy.get('#candidateAge').type("45")
        cy.get('#candidateParty').type("BJD")
        cy.get('#candidateAadh').type("12345612938645")
        
        cy.get('#registerCandidate').submit()
    })
})