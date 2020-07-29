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

  step('вводим корректный пароль', () => {
    browser.setValue('[data-testid="AuthForm:passwordInput"] > input', 'password');
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:submit"]');
  });

  expected('отобразилась ошибка для логина', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:loginInput"].TextField_state_alert', 2000);
    browser.assert.screenshotElement(
      '[data-test-id="AuthPage:form"]',
      'ошибка авторизации при некорректном email'
    );
  });

  step('обновляем браузер', () => {
    browser.refresh();
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:submit"]');
  });

  expected('отобразилась ошибка о том, что данные отсутствуют', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:loginInput"].TextField_state_alert', 2000);
    browser.waitForElementPresent('[data-testid="AuthForm:passwordInput"].TextField_state_alert', 2000);
    browser.assert.screenshotElement(
      '[data-test-id="AuthPage:form"]',
      'ошибка авторизации при отсутствии данных'
    );
  });

  step('обновляем браузер', () => {
    browser.refresh();
  });

  step('вводим корректный логин', () => {
    browser.setValue('[data-testid="AuthForm:loginInput"] > input', admin.login);
  });

  step('вводим некорректный пароль', () => {
    browser.setValue('[data-testid="AuthForm:passwordInput"] > input', '{{{[[]]}}}');
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:submit"]');
  });

  expected('отобразилась ошибка для пароля', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:passwordInput"].TextField_state_alert', 2000);
    browser.assert.screenshotElement(
      '[data-test-id="AuthPage:form"]',
      'ошибка авторизации при некорректном пароле'
    );
  });
});
