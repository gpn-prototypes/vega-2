# Vega-SP

Приложение расчетной платформы

## Зависимости

- [Vega UI Kit](https://github.com/gpn-prototypes/vega-ui)
- [Vega Frontend Configs](https://github.com/gpn-prototypes/frontend-configs)

Полный список зависимостей приведен в [package.json](package.json).

## Браузеры

Две последние мажорные версии браузеров на Chromium (в т.ч. Chrome, Yandex, Edge).

## Начало работы

Для старта вам нужно установить пакеты с помощью `yarn`.

Для запуска в dev-режиме выполните команду `yarn dev`.

Для запуска в режиме разработки в контексте single-spa выполните команду `yarn dev:shell`.

Для сборки проекта в prod-режиме выполните `yarn build`.

В проекте создана основа для написания unit-тестов. Переменные окружения можно добавить через файл .env.
