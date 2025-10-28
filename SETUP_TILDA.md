# 🌐 Инструкция по интеграции виджета на сайт Tilda

## Ваш сайт: http://storysequel.tilda.ws

После того как вы запустите сервер и получите TELEGRAM_CHAT_ID, следуйте этим шагам:

### Шаг 1: Получите адрес вашего сервера

Когда вы запустите сервер (через Heroku, Railway или VPS), вы получите адрес типа:
- `https://ваш-проект.herokuapp.com` (Heroku)
- `https://ваш-проект.railway.app` (Railway)
- `https://ваш-домен.com` (VPS)

### Шаг 2: Добавьте код на сайт Tilda

1. Откройте Tilda
2. Войдите в редактор сайта: http://storysequel.tilda.ws
3. Выберите страницу, где хотите добавить виджет
4. Нажмите **"Настройки"** → **"Добавить HTML-код перед </body>"**
5. Вставьте следующий код:

```html
<!-- Виджет чата для Storysequel -->
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
    window.tildaChatWidgetConfig = {
        serverUrl: 'ВАШ_АДРЕС_СЕРВЕРА',
        userName: 'Гость'
    };
</script>
<link rel="stylesheet" href="ВАШ_АДРЕС_СЕРВЕРА/widget.css">
<script src="ВАШ_АДРЕС_СЕРВЕРА/chat-widget.js"></script>
```

**Пример для Heroku:**
```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
    window.tildaChatWidgetConfig = {
        serverUrl: 'https://storysequel-chat.herokuapp.com',
        userName: 'Гость'
    };
</script>
<link rel="stylesheet" href="https://storysequel-chat.herokuapp.com/widget.css">
<script src="https://storysequel-chat.herokuapp.com/chat-widget.js"></script>
```

### Шаг 3: Настройте внешний вид (опционально)

Вы можете изменить:
- **Имя пользователя по умолчанию**: измените `userName: 'Гость'`
- **Позицию виджета**: отредактируйте файл `public/widget.css`
- **Цвета**: измените градиенты в CSS

### Шаг 4: Сохраните и опубликуйте

1. Сохраните изменения в Tilda
2. Опубликуйте сайт
3. Протестируйте виджет на сайте

### Тестирование

1. Откройте сайт: http://storysequel.tilda.ws
2. Кликните на кнопку чата в правом нижнем углу
3. Отправьте тестовое сообщение
4. Проверьте Telegram - сообщение должно прийти
5. Ответьте в Telegram - ответ должен появиться на сайте

## Важные замечания

⚠️ **Для продакшена обязательно:**
- Используйте HTTPS (не HTTP)
- Разверните сервер на надежном хостинге
- Регулярно проверяйте логи сервера
- Делайте резервные копии `.env` файла

✅ **Рекомендуемые платформы для хостинга:**
- Heroku (просто, но платный план нужен для 24/7)
- Railway (дешево и просто)
- VPS (DigitalOcean, Hetzner) - полный контроль

## Поддержка

Если у вас возникли проблемы:
1. Проверьте консоль браузера (F12)
2. Проверьте логи сервера
3. Убедитесь, что сервер запущен и доступен
4. Проверьте токен и CHAT_ID в `.env` файле

