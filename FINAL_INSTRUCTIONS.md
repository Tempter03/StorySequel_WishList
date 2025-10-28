# ✅ ФИНАЛЬНЫЕ ИНСТРУКЦИИ ДЛЯ STORYSEQUEL

## 🎉 ВСЁ ГОТОВО! Теперь настройте Railway

### ✅ Ваша конфигурация:
- **Токен бота:** `8031650322:AAGzCGH-xuuU8LDmXAV8o8SrfK49hO-pXQE`
- **ID чата:** `1841825765`
- **Сайт:** http://storysequel.tilda.ws

---

## 🚀 ШАГ 1: Настройка Railway

### Создайте проект на Railway:

1. Зайдите на https://railway.app
2. Войдите или зарегистрируйтесь
3. Нажмите **"New Project"**
4. Выберите **"Deploy from GitHub repo"** (рекомендуется) или **"Empty Project"**

### Если через GitHub:
1. Подключите репозиторий
2. Railway автоматически найдет `package.json` и установит зависимости
3. Добавьте переменные окружения

### Если Empty Project:
1. Создайте `railway.json` (уже создан!)
2. Загрузите файлы через Railway CLI или веб-интерфейс

### Добавьте переменные окружения:

В настройках проекта → **Variables** → **Add Variable**

**Первая переменная:**
```
Name: TELEGRAM_BOT_TOKEN
Value: 8031650322:AAGzCGH-xuuU8LDmXAV8o8SrfK49hO-pXQE
```

**Вторая переменная:**
```
Name: TELEGRAM_CHAT_ID
Value: 1841825765
```

### Railway автоматически:
- Установит зависимости
- Запустит сервер
- Предоставит публичный URL

**Важно:** Скопируйте ваш URL Railway! Он будет вида:
`https://storysequel-chat.up.railway.app`

---

## 🎯 ШАГ 2: Добавьте код в Tilda

### Откройте редактор Tilda:
1. Войдите на http://storysequel.tilda.ws
2. Откройте редактор любой страницы
3. Нажмите **"Настройки"** (вверху справа)
4. Выберите **"HTML-код перед </body>"**

### Вставьте ЭТОТ код:

```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
    window.tildaChatWidgetConfig = {
        serverUrl: 'ВАШ_АДРЕС_RAILWAY',
        userName: 'Гость'
    };
</script>
<link rel="stylesheet" href="ВАШ_АДРЕС_RAILWAY/widget.css">
<script src="ВАШ_АДРЕС_RAILWAY/chat-widget.js"></script>
```

⚠️ **ЗАМЕНИТЕ `ВАШ_АДРЕС_RAILWAY` на ваш реальный адрес от Railway!**

**Пример правильного кода:**
```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
    window.tildaChatWidgetConfig = {
        serverUrl: 'https://storysequel-chat.up.railway.app',
        userName: 'Гость'
    };
</script>
<link rel="stylesheet" href="https://storysequel-chat.up.railway.app/widget.css">
<script src="https://storysequel-chat.up.railway.app/chat-widget.js"></script>
```

5. Сохраните
6. Опубликуйте сайт

---

## 🧪 ШАГ 3: Тестирование

### Проверьте сервер:
Откройте в браузере ваш URL Railway (например: `https://storysequel-chat.up.railway.app`)
- Должна загрузиться тестовая страница с виджетом
- Если страница открылась — ✅ сервер работает!

### Проверьте сайт:
1. Откройте http://storysequel.tilda.ws
2. Прокрутите страницу вниз
3. В правом нижнем углу должна быть круглая кнопка чата 💬
4. Если видите кнопку — ✅ виджет установлен!

### Протестируйте чат:
1. Кликните на кнопку чата
2. Отправьте сообщение: **"Тест"**
3. Откройте Telegram — должно прийти сообщение
4. Ответьте в Telegram: **"Спасибо!"**
5. Вернитесь на сайт — ваш ответ должен появиться в виджете!

---

## 📋 ЧЕКЛИСТ ГОТОВНОСТИ:

- ✅ Создан проект на Railway
- ✅ Добавлены переменные окружения (TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)
- ✅ Получен URL Railway
- ✅ Код вставлен в Tilda (с правильным URL!)
- ✅ Сайт опубликован
- ✅ Виджет отображается на сайте
- ✅ Сообщения отправляются в Telegram
- ✅ Ответы приходят в виджет

---

## 🔧 Если что-то не работает:

### Виджет не появляется на сайте:
- Проверьте, что код вставлен перед `</body>`
- Убедитесь, что URL в коде правильный
- Откройте консоль браузера (F12 → Console)
- Проверьте наличие ошибок

### Сообщения не отправляются:
- Проверьте переменные окружения в Railway
- Посмотрите логи в Railway (Settings → Logs)
- Убедитесь, что TELEGRAM_CHAT_ID правильный: `1841825765`

### Ответы не приходят в виджет:
- Убедитесь, что отвечаете правильному боту
- Проверьте, что ID чата совпадает
- Посмотрите логи на Railway

---

## ✨ ФИНАЛЬНАЯ ПРОВЕРКА:

После выполнения всех шагов:
1. Откройте сайт: http://storysequel.tilda.ws
2. Виджет должен работать! 🎉

---

## 📞 Важная информация:

**Токен бота:** `8031650322:AAGzCGH-xuuU8LDmXAV8o8SrfK49hO-pXQE`
**ID чата:** `1841825765`
**Сайт:** http://storysequel.tilda.ws

Сохраните эту информацию!

---

Удачи! 🚀

