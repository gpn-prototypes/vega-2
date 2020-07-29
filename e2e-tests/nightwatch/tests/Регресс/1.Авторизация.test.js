const { admin } = require('../data/users');


testcase('Успешная авторизация', () => {
  step('переходим на сайт', () => {
    browser.url(browser.launch_url);
  });

  expected('перешли на страницу авторизации', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:form"]', 2000).expect.url().to.equal(`${browser.launch_url}/auth`);
  });

  step('вводим логин', () => {
    browser.setValue('[data-testid="AuthForm:loginInput"] > input', admin.login);
  });

  step('вводим пароль', () => {
    browser.setValue('[data-testid="AuthForm:passwordInput"] > input', admin.password);
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:submit"]');
  });

  expected('отобразилась страница проектов', () => {
    browser.waitForElementPresent('[data-testid="ProjectsPage:root"', 5000).expect.url().to.equal(`${browser.launch_url}/projects`);
  })
});

testcase('Ошибки при валидации', () => {
  step('переходим на сайт', () => {
    browser.url(browser.launch_url);
  });

  expected('перешли на страницу авторизации', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:form"]', 2000).expect.url().to.equal(`${browser.launch_url}/auth`);
  });

  step('вводим некорректный логин', () => {
    browser.setValue('[data-testid="AuthForm:loginInput"] > input', 'test@m..');
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:submit"]');
  });

  expected('отобразилась ошибка для логина', () => {
    browser.waitForElementPresent('.TextField_state_alert', 2000);
    browser.assert.screenshotElement(
      '[data-test-id="AuthPage:form"]',
      'ошибка авторизации при некорректном email'
    );
  });
});
