# ⚡ Быстрый старт для Storysequel

## Шаг 1: Получите TELEGRAM_CHAT_ID

**Способ 1 (самый простой):**
1. Откройте Telegram
2. Найдите **@userinfobot**
3. Отправьте `/start`
4. Скопируйте ваш ID (например: `123456789`)

**Способ 2 (через API):**
1. Откройте в браузере: https://api.telegram.org/bot8031650322:AAGzCGH-xuuU8LDmXAV8o8SrfK49hO-pXQE/getUpdates
2. Отправьте сообщение этому боту в Telegram
3. Обновите страницу браузера
4. Найдите в JSON поле `"chat":{"id":123456789}`
5. Скопируйте это число

## Шаг 2: Обновите .env файл

Откройте файл `.env` и замените `YOUR_CHAT_ID_HERE` на полученный ID:

```env
TELEGRAM_BOT_TOKEN=8031650322:AAGzCGH-xuuU8LDmXAV8o8SrfK49hO-pXQE
TELEGRAM_CHAT_ID=123456789  ← сюда ваш ID
PORT=3000
```

## Шаг 3: Установите зависимости

```bash
npm install
```

## Шаг 4: Запустите сервер

```bash
npm start
```

Вы увидите:
```
🚀 Сервер запущен на порту 3000
📱 Бот Telegram активен
💬 Виджет доступен на http://localhost:3000
```

## Шаг 5: Тестирование

1. Откройте http://localhost:3000
2. Кликните на кнопку чата в правом нижнем углу
3. Отправьте сообщение "Тест"
4. Проверьте Telegram - должно прийти сообщение
5. Ответьте боту в Telegram
6. Проверьте виджет - ваш ответ должен появиться!

## Шаг 6: Развертывание на хостинг

### Вариант 1: Heroku (5 минут)

```bash
# Установите Heroku CLI
# Войдите
heroku login

# Создайте приложение
heroku create storysequel-chat

# Добавьте переменные окружения
heroku config:set TELEGRAM_BOT_TOKEN=8031650322:AAGzCGH-xuuU8LDmXAV8o8SrfK49hO-pXQE
heroku config:set TELEGRAM_CHAT_ID=ваш_полученный_id

# Разверните
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Посмотрите логи
heroku logs --tail
```

Ваш сервер будет доступен по адресу: `https://storysequel-chat.herokuapp.com`

### Вариант 2: Railway (бесплатно)

1. Зайдите на https://railway.app
2. Создайте аккаунт
3. Создайте новый проект
4. Подключите GitHub репозиторий
5. Добавьте переменные окружения:
   - `TELEGRAM_BOT_TOKEN=8031650322:AAGzCGH-xuuU8LDmXAV8o8SrfK49hO-pXQE`
   - `TELEGRAM_CHAT_ID=ваш_полученный_id`
6. Railway автоматически развернет приложение

## Шаг 7: Добавление на сайт Tilda

После развертывания сервера получите его адрес (например: `https://storysequel-chat.railway.app`)

1. Откройте Tilda
2. Войдите на сайт: http://storysequel.tilda.ws
3. Редактор → Настройки страницы
4. HTML-код перед `</body>`
5. Вставьте:

```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
    window.tildaChatWidgetConfig = {
        serverUrl: 'https://storysequel-chat.railway.app',
        userName: 'Гость'
    };
</script>
<link rel="stylesheet" href="https://storysequel-chat.railway.app/widget.css">
<script src="https://storysequel-chat.railway.app/chat-widget.js"></script>
```

6. Сохраните и опубликуйте

## Готово! 🎉

Теперь посетители сайта смогут отправлять вам сообщения через виджет, а вы будете получать их в Telegram и сможете отвечать!

## Проверка работы

1. Откройте сайт: http://storysequel.tilda.ws
2. Кликните на кнопку чата (правый нижний угол)
3. Отправьте сообщение
4. Проверьте Telegram
5. Ответьте в Telegram
6. Проверьте сайт - ответ должен появиться!

## Нужна помощь?

- Ошибки: проверьте логи сервера
- Не приходят сообщения: проверьте токен и CHAT_ID
- Не отображается виджет: проверьте консоль браузера (F12)
- Не приходят ответы: убедитесь, что отвечаете правильному боту

