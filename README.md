# Interview Builder

Конструктор технических интервью для подготовки к собеседованиям.

## Стек

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Redux Toolkit** + **RTK Query**
- **CSS Modules**

## Функционал

- Выбор направления: Frontend, Backend, QA, DevOps
- Выбор уровня: Junior, Middle, Senior
- Выбор технологий и категорий вопросов
- Авторизация (регистрация / вход)
- Прохождение интервью с таймером
- Подсчёт результата по категориям
- История попыток
- Личный кабинет
- Избранные вопросы
- Статистика слабых тем

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Структура

```
src/
  app/              — страницы (Next.js App Router)
  components/       — React-компоненты с CSS Modules
  store/            — Redux store, slices, RTK Query API
  data/             — вопросы и справочники
  types/            — TypeScript типы
  lib/              — утилиты (localStorage)
```

Данные хранятся в localStorage (демо-режим без бэкенда).
