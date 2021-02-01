const { admin } = require('../data/users');


testcase('Успешная авторизация', () => {
  step('переходим на сайт', () => {
    browser.url(browser.launch_url);
  });

  expected('перешли на страницу авторизации', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:form"]', 2000).expect.url().to.equal(`${browser.launch_url}/login?redirectTo=%2F`);
  });

  step('вводим логин', () => {
    browser.setValue('[data-testid="AuthForm:field:login"] > input', admin.login);
  });

  step('вводим пароль', () => {
    browser.setValue('[data-testid="AuthForm:field:password"] > input', admin.password);
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:button:submit"]');
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
    browser.waitForElementPresent('[data-testid="AuthForm:form"]', 2000).expect.url().to.equal(`${browser.launch_url}/login?redirectTo=%2F`);
  });

  step('вводим некорректный логин', () => {
    browser.setValue('[data-testid="AuthForm:field:login"] > input', 'test@m..');
  });

  step('вводим корректный пароль', () => {
    browser.setValue('[data-testid="AuthForm:field:password"] > input', 'password');
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:button:submit"]');
  });

  expected('отобразилась ошибка для логина', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:field:login"].TextField_state_alert', 2000);
    browser.assert.screenshotElement(
      '[data-test-id="AuthPage:form"]',
      'ошибка авторизации при некорректном email'
    );
  });

  step('обновляем браузер', () => {
    browser.refresh();
  });

  step('нажимаем на кнопку Войти', () => {
    browser.click('[data-testid="AuthForm:button:submit"]');
  });

  expected('отобразилась ошибка о том, что данные отсутствуют', () => {
    browser.waitForElementPresent('[data-testid="AuthForm:field:login"].TextField_state_alert', 2000);
    browser.waitForElementPresent('[data-testid="AuthForm:field:password"].TextField_state_alert', 2000);
    browser.assert.screenshotElement(
      '[data-test-id="AuthPage:form"]',
      'ошибка авторизации при отсутствии данных'
    );
  });

  step('обновляем браузер', () => {
    browser.refresh();
  });
});
