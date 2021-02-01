function logout() {
  step('логаут', () => {
    browser
      .click('[data-test-id="BaseHeader:menu:trigger"]')
      .pause(500)
      .click('[data-test-id="Header:button:logout"]')
      .assert.elementPresent('[data-test-id="AuthForm:form"]')
  })
}

module.exports = { logout }
