# 🚀 Краткая инструкция по установке

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Настройка Telegram

### Получение токена бота:
1. Откройте Telegram
2. Найдите **@BotFather**
3. Отправьте `/newbot`
4. Следуйте инструкциям
5. Скопируйте токен бота

### Получение ID чата:
1. Найдите **@userinfobot** в Telegram
2. Отправьте `/start`
3. Скопируйте ваш ID (например: `123456789`)

## Шаг 3: Создание .env файла

Создайте файл `.env` в корне проекта:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
TELEGRAM_CHAT_ID=ваш_id_от_userinfobot
PORT=3000
```

## Шаг 4: Запуск сервера

```bash
npm start
```

Откройте браузер: `http://localhost:3000`

## Шаг 5: Тестирование

1. Кликните на кнопку чата в правом нижнем углу
2. Отправьте сообщение
3. Проверьте Telegram - сообщение должно прийти
4. Ответьте боту в Telegram
5. Проверьте виджет - ваш ответ должен появиться

## Шаг 6: Развертывание на хостинг

### Heroku (простой вариант):

```bash
# Установите Heroku CLI
heroku create ваше-приложение

# Настройте переменные окружения
heroku config:set TELEGRAM_BOT_TOKEN=ваш_токен
heroku config:set TELEGRAM_CHAT_ID=ваш_id

# Разверните
git push heroku main
```

### Другие варианты:
- **Railway**: подключите GitHub репозиторий, добавьте переменные окружения
- **VPS**: используйте pm2 для запуска: `pm2 start server.js`

## Шаг 7: Добавление на сайт Tilda

Добавьте этот код в настройках страницы Tilda (HTML перед `</body>`):

```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
    window.tildaChatWidgetConfig = {
        serverUrl: 'https://ваш-домен.com',
        userName: 'Гость'
    };
</script>
<link rel="stylesheet" href="https://ваш-домен.com/widget.css">
<script src="https://ваш-домен.com/chat-widget.js"></script>
```

**Важно:** Замените `https://ваш-домен.com` на реальный адрес вашего сервера!

## Готово! 🎉

Ваш виджет чата готов к работе!

