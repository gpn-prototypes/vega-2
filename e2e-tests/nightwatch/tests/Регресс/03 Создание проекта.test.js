const { auth } = require('../actions/auth')
const { logout } = require('../actions/logout')
const users = require('../data/users')
const pages = require('../data/pages')
const { createProject } = require('../actions/createProject')

testcase('Создание нового проекта', () => {
  auth({
    authPageUrl: pages.login.url,
    email: users.admin.login,
    password: users.admin.password,
    redirectUrl: pages.projects.url,
  })

  step('переходим на страницу создания проекта', () => {
    browser.click('[data-testid="ProjectsPage:link:create"]');
  });

  expected('отобразилась страница создания проекта', () => {
    browser
      .waitForElementPresent('[data-testid="ProjectForm:form"]')
      .expect.url()
      .to.equal(`${browser.launch_url}${pages.projectCreate.url}`)
  });

  expected('отобразилась пустая форма создания проекта', () => {
    browser
      .assert.screenshotElement(
        '[data-testid="ProjectForm:form"]',
        'пустая форма создания проекта'
      )
  })

  step('увеличиваем размер окна', () => {
    browser.setWindowSize(1920, 1080)
  })

  const { projectName } = createProject()

  step('вводим название проекта', () => {
    browser.setValue('[data-testid="ProjectForm:field:name"] > input', projectName);
  });

  step('выбираем регион', () => {
    browser
      .click('[data-testid="ProjectForm:field:region"]')
      .click('#region-0');
  });

  expected('название и регион отобразились в хедере', () => {
    browser
      .assert.containsText('[data-testid="ProjectForm:banner:title"]', projectName)
      .assert.containsText('[data-testid="ProjectForm:banner:description"]', 'Российская Федерация, Республика Адыгея');
  });

  step('вводим координаты', () => {
    browser.setValue('[data-testid="ProjectForm:field:coordinates"] > input', 'Декартова система');
  });

  step('выбираем год начала планирования', () => {
    browser
      .click('[data-testid="ProjectForm:field:yearStart"]')
      .click('#yearStart-7');
  });

  step('вводим описание проекта', () => {
    browser.setValue('[data-testid="ProjectForm:field:description"] > textarea', 'Те, кому когда-либо приходилось делать в квартире ремонт, наверное, обращали внимание на старые газеты, наклеенные под обоями. Как правило, пока все статьи не перечитаешь, ничего другого делать не можешь. Интересно же — обрывки текста, чья-то жизнь... Так же и с рыбой. Пока заказчик не прочтет всё, он не успокоится. Бывали случаи, когда дизайн принимался именно из-за рыбного текста, который, разумеется, никакого отношения к работе не имел.');
  });

  step('нажимаем кнопку создания проекта', () => {
    browser.click('[data-testid="ProjectForm:button:create"]');
  });

  expected('отобразилась страница просмотра проекта', () => {
    browser
      .expect.url().to.contain(`${browser.launch_url}/projects/show/`)
  });

  expected('страница просмотра проекта содержит все введенные данные', () => {
    browser
      .assert.containsText('[data-testid="Notifications"]', 'Проект успешно создан')
      .assert.containsText('[data-testid="ProjectForm:banner:title"]', projectName)
      .assert.containsText('[data-testid="ProjectForm:banner:description"]', 'Российская Федерация, Республика Адыгея')
      .assert.valueContains('[data-testid="ProjectForm:field:name"] > input', projectName)
      .assert.containsText('[data-testid="ProjectForm:field:region"]', 'Адыгея')
      .assert.valueContains('[data-testid="ProjectForm:field:coordinates"] > input', 'Декартова система')
      .assert.containsText('[data-testid="ProjectForm:field:yearStart"]', '2027')
      .assert.valueContains('[data-testid="ProjectForm:field:description"] > textarea', 'Те, кому когда-либо приходилось делать в квартире ремонт, наверное, обращали внимание на старые газеты, наклеенные под обоями. Как правило, пока все статьи не перечитаешь, ничего другого делать не можешь. Интересно же — обрывки текста, чья-то жизнь... Так же и с рыбой. Пока заказчик не прочтет всё, он не успокоится. Бывали случаи, когда дизайн принимался именно из-за рыбного текста, который, разумеется, никакого отношения к работе не имел.');
  });
})

testcase.skip('Создание черновика проекта', () => {
  auth({
    authPageUrl: pages.login.url,
    email: users.admin.login,
    password: users.admin.password,
    redirectUrl: pages.projects.url,
  })

  step('переходим на страницу создания проекта', () => {
    browser.click('[data-testid="ProjectsPage:link:create"]');
  });

  expected('отобразилась страница создания проекта', () => {
    browser
      .waitForElementPresent('[data-testid="ProjectForm:form"]')
      .expect.url()
      .to.equal(`${browser.launch_url}${pages.projectCreate.url}`)
  });

  expected('отобразилась пустая форма создания проекта', () => {
    browser
      .assert.screenshotElement(
        '[data-testid="ProjectForm:form"]',
        'пустая форма создания проекта'
      )
  })

  step('увеличиваем размер окна', () => {
    browser.setWindowSize(1920, 1080)
  })

  const { projectName } = createProject()

  step('вводим название проекта', () => {
    browser.setValue('[data-testid="ProjectForm:field:name"] > input', projectName);
  });

  step('выбираем регион', () => {
    browser
      .click('[data-testid="ProjectForm:field:region"]')
      .click('#region-0');
  });

  expected('название и регион отобразились в хедере', () => {
    browser
      .assert.containsText('[data-testid="ProjectForm:banner:title"]', projectName)
      .assert.containsText('[data-testid="ProjectForm:banner:description"]', 'Российская Федерация, Республика Адыгея');
  });

  step('вводим координаты', () => {
    browser.setValue('[data-testid="ProjectForm:field:coordinates"] > input', 'Декартова система');
  });

  step('выбираем год начала планирования', () => {
    browser
      .click('[data-testid="ProjectForm:field:yearStart"]')
      .click('#yearStart-7');
  });

  step('вводим описание проекта', () => {
    browser.setValue('[data-testid="ProjectForm:field:description"] > textarea', 'Черновик');
  });

  step('обновляем страницу', () => {
    browser.refresh()
  })

  expected('отобразилась страница создания проекта с заполненным черновиком', () => {
    browser
      .expect.url().to.contain(`${browser.launch_url}/projects/create/`)
  });

  expected('черновик проекта содержит все введенные данные', () => {
    browser
      .assert.containsText('[data-testid="Notifications"]', 'Проект успешно создан')
      .assert.containsText('[data-testid="ProjectForm:banner:title"]', projectName)
      .assert.containsText('[data-testid="ProjectForm:banner:description"]', 'Российская Федерация, Республика Адыгея')
      .assert.valueContains('[data-testid="ProjectForm:field:name"] > input', projectName)
      .assert.containsText('[data-testid="ProjectForm:field:region"]', 'Адыгея')
      .assert.valueContains('[data-testid="ProjectForm:field:coordinates"] > input', 'Декартова система')
      .assert.containsText('[data-testid="ProjectForm:field:yearStart"]', '2027')
      .assert.valueContains('[data-testid="ProjectForm:field:description"] > textarea', 'Черновик');
  });

  step('переходим на страницу списка проектов', () => {
    browser.url(`${browser.launch_url}${pages.projects.url}`);
  });
})
