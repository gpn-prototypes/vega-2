function auth({ email, password }) {
  step('авторизация' + email, () => {
    browser
      .url(browser.launch_url)
      .waitForElementPresent('[data-testid="AuthForm:form"]', 2000)
      .setValue('[data-testid="AuthForm:field:login"] > input', email)
      .setValue('[data-testid="AuthForm:field:password"] > input', password)
      .click('[data-testid="AuthForm:button:submit"]')
      .expect.url()
      .to.equal(`${browser.launch_url}/login?redirectTo=%2F`)
  })
}

module.exports = { auth }
