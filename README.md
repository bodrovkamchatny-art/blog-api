# Blog API

REST API для блогу з JWT авторизацією.

## Технології
- Node.js + Express
- PostgreSQL
- JWT авторизація
- bcrypt хешування паролів

## Маршрути

### Авторизація
- POST /auth/register — реєстрація
- POST /auth/login — логін

### Пости
- GET /posts — всі пости
- GET /posts/:id — один пост
- POST /posts — створити пост (потрібен токен)
- DELETE /posts/:id — видалити пост (потрібен токен)

## Запуск
1. Встанови залежності: npm install
2. Створи .env файл
3. Запусти: npm run dev

### Коментарі
- GET /posts/:id/comments — всі коментарі
- POST /posts/:id/comments — додати коментар (потрібен токен)