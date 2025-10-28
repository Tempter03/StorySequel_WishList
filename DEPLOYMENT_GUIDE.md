# 🚀 Подробная инструкция по развертыванию на Vercel

Это пошаговое руководство поможет вам развернуть приложение "Карта желаний" на Vercel.

## Вариант 1: Через GitHub (Рекомендуется)

### Шаг 1: Подготовка репозитория

1. Откройте терминал в папке проекта
2. Инициализируйте Git репозиторий (если еще не сделано):
```bash
git init
```

3. Добавьте все файлы:
```bash
git add .
```

4. Создайте первый коммит:
```bash
git commit -m "Initial commit: Flower Wishlist App"
```

### Шаг 2: Загрузка на GitHub

1. Перейдите на [github.com](https://github.com)
2. Войдите в свой аккаунт
3. Нажмите "+" в правом верхнем углу → "New repository"
4. Назовите репозиторий (например, `flower-wishlist`)
5. Нажмите "Create repository"
6. В терминале выполните:
```bash
git remote add origin https://github.com/ваш-username/flower-wishlist.git
git branch -M main
git push -u origin main
```

### Шаг 3: Развертывание на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Sign Up" или "Log In"
3. Войдите через GitHub
4. После входа нажмите "Add New..." → "Project"
5. Найдите ваш репозиторий `flower-wishlist`
6. Нажмите "Import"
7. Vercel автоматически определит Next.js
8. Нажмите "Deploy"
9. Дождитесь завершения (обычно 1-2 минуты)
10. Готово! Скопируйте ссылку на приложение

## Вариант 2: Через Vercel CLI

### Шаг 1: Установка Vercel CLI

```bash
npm install -g vercel
```

### Шаг 2: Развертывание

1. В папке проекта выполните:
```bash
vercel login
```

2. Следуйте инструкциям для входа

3. Разверните проект:
```bash
vercel
```

4. Ответьте на вопросы:
   - Set up and deploy? → Yes
   - Which scope? → Выберите ваш аккаунт
   - Link to existing project? → No
   - What's your project's name? → flower-wishlist
   - In which directory is your code? → ./
   - Want to override the settings? → No

5. Для продакшен деплоя:
```bash
vercel --prod
```

## Вариант 3: Загрузка zip-файла

### Шаг 1: Подготовка архива

1. Удалите папку `node_modules` (если есть)
2. Удалите папку `.next` (если есть)
3. Создайте zip-архив всего проекта

### Шаг 2: Загрузка на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите в аккаунт
3. Нажмите "Add New..." → "Project"
4. Выберите вкладку "Import Third-Party Git Repository"
5. Или нажмите кнопку для загрузки файлов
6. Загрузите zip-архив
7. Нажмите "Deploy"

## 📌 После развертывания

### Получение ссылки на приложение

После успешного деплоя вы получите ссылку вида:
```
https://flower-wishlist-xxxxx.vercel.app
```

Эту ссылку нужно:
1. Скопировать
2. Добавить на сайт Tilda

### Добавление на Tilda

#### Вариант A: Кнопка

1. Войдите в редактор Tilda
2. Найдите место для кнопки
3. Добавьте блок "Button"
4. Настройте кнопку:
   - **Текст**: "🌸 Составить карту желаний"
   - **Ссылка**: `https://ваша-ссылка.vercel.app`
   - **Цвет**: Выберите подходящий под дизайн
5. Сохраните и опубликуйте

#### Вариант B: HTML блок

1. Добавьте блок "T123 - HTML"
2. Вставьте код:

```html
<div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #fdfbfb 0%, #f7f3f0 100%);">
  <h2 style="font-size: 2rem; color: #333; margin-bottom: 20px;">
    🌸 Карта желаний
  </h2>
  <p style="color: #666; margin-bottom: 30px; font-size: 1.1rem;">
    Создайте список желаемых букетов и поделитесь им с близкими
  </p>
  <a href="https://ваша-ссылка.vercel.app" 
     target="_blank"
     style="display: inline-block; 
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
            transition: all 0.3s ease;
            cursor: pointer;">
    ✨ Создать карту желаний
  </a>
</div>

<style>
a:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.6) !important;
}
</style>
```

3. Замените `https://ваша-ссылка.vercel.app` на реальную ссылку
4. Сохраните и опубликуйте

## 🔄 Обновление приложения

### Если используете GitHub:

1. Внесите изменения в код
2. Закоммитьте изменения:
```bash
git add .
git commit -m "Update: описание изменений"
git push
```
3. Vercel автоматически пересоберет и задеплоит проект

### Если используете Vercel CLI:

1. Внесите изменения в код
2. Выполните:
```bash
vercel --prod
```

## 🔧 Настройка домена (Опционально)

### Добавление своего домена

1. Купите домен (например, на reg.ru, nic.ru)
2. В Vercel перейдите в Settings → Domains
3. Нажмите "Add Domain"
4. Введите ваш домен (например, `wishlist.storyflowers.ru`)
5. Следуйте инструкциям для настройки DNS
6. Обычно нужно добавить A-запись или CNAME

## ⚠️ Важные замечания

### Хранение данных

По умолчанию данные хранятся в папке `data/`. На Vercel serverless функции не сохраняют файлы между запусками.

**Для production рекомендуется:**

1. Использовать Vercel KV (бесплатно):
   - Project Settings → Storage → KV → Create Database
   - Следуйте инструкциям

2. Или использовать внешнюю БД:
   - MongoDB Atlas
   - Supabase
   - PostgreSQL

**Для тестирования** текущее решение будет работать в течение одной сессии.

### Лимиты бесплатного тарифа Vercel

- ✅ Безлимитный трафик для некоммерческих проектов
- ✅ 100 GB bandwidth в месяц
- ✅ Автоматический HTTPS
- ✅ Глобальный CDN

## 🆘 Решение проблем

### Ошибка при деплое "Build failed"

1. Проверьте, что все файлы загружены
2. Проверьте `package.json` на наличие всех зависимостей
3. Проверьте логи в Vercel Dashboard

### Приложение не работает после деплоя

1. Проверьте логи в Vercel Dashboard → Deployments → Select deployment → Logs
2. Убедитесь, что все API routes доступны
3. Проверьте, что путь к данным правильный

### Данные не сохраняются

Это нормально для serverless на Vercel. Подключите базу данных (см. выше).

## 📞 Поддержка

Если возникли вопросы:
- Email: storyflowerssss@gmail.com
- Telegram: @yourusername (если есть)

---

Успешного деплоя! 🚀

