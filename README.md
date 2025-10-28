# 🌸 Карта желаний - StoryFlowers

Веб-приложение для создания карты желаний цветов для интернет-магазина [StoryFlowers](https://storysequel.tilda.ws/fandb).

## 📖 Описание

Приложение позволяет:
- 🎯 Создавать карту желаний с выбором букетов и дат
- 🔗 Генерировать уникальную ссылку для публикации
- 👀 Просматривать карту желаний
- 🎁 Бронировать букеты из списка желаний
- 🛍️ Переходить в магазин для оформления заказа

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ установлен на вашем компьютере
- npm или yarn

### Установка

1. Установите зависимости:
```bash
npm install
```

2. Запустите приложение в режиме разработки:
```bash
npm run dev
```

3. Откройте браузер по адресу [http://localhost:3000](http://localhost:3000)

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🌐 Развертывание на Vercel

### Вариант 1: Через GitHub (рекомендуется)

1. Загрузите проект на GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/flower-wishlist.git
git push -u origin main
```

2. Перейдите на [vercel.com](https://vercel.com)
3. Нажмите "Add New" → "Project"
4. Импортируйте ваш GitHub репозиторий
5. Vercel автоматически определит Next.js проект
6. Нажмите "Deploy"

### Вариант 2: Через Vercel CLI

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Разверните проект:
```bash
vercel
```

3. Следуйте инструкциям в терминале

### Вариант 3: Прямая загрузка

1. Создайте архив проекта (без `node_modules`)
2. Перейдите на [vercel.com](https://vercel.com)
3. Нажмите "Add New" → "Project"
4. Выберите "Upload" и загрузите архив
5. Нажмите "Deploy"

## 🔧 Настройка на Tilda

### Добавление кнопки на сайт Tilda

1. Войдите в редактор Tilda
2. Добавьте блок "Button" (кнопка)
3. В настройках кнопки:
   - Текст: "Составить карту желаний" или "🌸 Моя карта желаний"
   - Ссылка: `https://your-app.vercel.app` (ваша ссылка Vercel)
   - Откроется в: Новом окне (опционально)

### Альтернатива: HTML блок

Добавьте блок "HTML" в Tilda и вставьте:

```html
<div style="text-align: center; padding: 40px 20px;">
  <a href="https://your-app.vercel.app" 
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
            transition: all 0.3s ease;">
    🌸 Составить карту желаний
  </a>
</div>
```

Замените `https://your-app.vercel.app` на реальную ссылку вашего приложения.

## 📱 Как пользоваться приложением

### Для создателя карты желаний:

1. Откройте приложение
2. Введите ваше имя и email (опционально)
3. Добавьте желаемые букеты с датами
4. Нажмите "Создать карту желаний"
5. Скопируйте и поделитесь ссылкой с близкими

### Для гостя:

1. Откройте полученную ссылку
2. Просмотрите список желаемых букетов
3. Нажмите "Я подарю" на выбранном букете
4. Укажите ваше имя для бронирования
5. Перейдите в магазин StoryFlowers для оформления заказа

## 🗂️ Структура проекта

```
flower-wishlist/
├── pages/
│   ├── api/
│   │   └── wishlist/
│   │       ├── create.ts      # API создания карты
│   │       ├── [id].ts        # API получения карты
│   │       └── reserve.ts     # API бронирования букета
│   ├── wishlist/
│   │   └── [id].tsx           # Страница просмотра карты
│   ├── _app.tsx               # Главный компонент приложения
│   ├── _document.tsx          # HTML документ
│   └── index.tsx              # Главная страница
├── lib/
│   └── storage.ts             # Работа с хранилищем данных
├── types/
│   └── index.ts               # TypeScript типы
├── styles/
│   └── globals.css            # Глобальные стили
├── data/                      # Хранилище карт желаний
├── public/                    # Статические файлы
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json
```

## 💾 Хранение данных

По умолчанию приложение использует файловую систему для хранения данных (папка `data/`).

⚠️ **Важно для Vercel**: Vercel использует serverless функции, которые не сохраняют данные между запросами. Для production рекомендуется подключить базу данных.

### Подключение базы данных (опционально)

Вы можете использовать:
- **Vercel KV** (Redis) - бесплатный тариф доступен
- **Vercel Postgres** - бесплатный тариф доступен
- **MongoDB Atlas** - бесплатный тариф доступен
- **Supabase** - бесплатный тариф доступен

Для небольшого объема данных текущее решение будет работать.

## 🎨 Кастомизация

### Изменение цветовой схемы

Откройте `styles/globals.css` и измените градиенты:

```css
/* Основной градиент */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Цвет успеха */
background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
```

### Изменение логотипа и иконок

Замените файлы в папке `public/`.

## 📞 Контакты

- Email: storyflowerssss@gmail.com
- Телефон: +7 903 818 03 73
- Сайт: [https://storysequel.tilda.ws/fandb](https://storysequel.tilda.ws/fandb)

## 📄 Лицензия

Этот проект создан для StoryFlowers.

---

Сделано с ❤️ для StoryFlowers

