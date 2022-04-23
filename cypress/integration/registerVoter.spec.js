///<reference types="cypress"/>


describe("Should Register a voter", () => {
    it("check register voter form", () => {
        cy.visit('/elections/0xbfbcF26618E157da8d9058AFA814b6c9E34B3cc3')
        cy.get('#voterName').type("Neelesh")
        cy.get('#age').type("21")
        cy.get('#aadh').type("12345612938645")
        cy.get('#phone').type("1234567234")
        cy.get('#registerVoter').submit()
    })
})