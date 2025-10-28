# 🎨 Интеграция с Tilda

Подробная инструкция по добавлению кнопки "Карта желаний" на ваш сайт Tilda.

## 📋 Что вам понадобится

1. Доступ к редактору Tilda
2. Ссылка на развернутое приложение (например, `https://your-app.vercel.app`)

## Способ 1: Красивая кнопка через HTML блок (Рекомендуется)

### Шаг 1: Добавьте блок HTML

1. Войдите в редактор Tilda
2. На странице где хотите разместить кнопку нажмите "+" для добавления блока
3. Найдите блок **"T123 - HTML код"**
4. Добавьте его на страницу

### Шаг 2: Вставьте код

Вставьте следующий код в HTML блок:

```html
<div class="wishlist-banner">
  <div class="wishlist-content">
    <div class="wishlist-icon">🌸</div>
    <h2 class="wishlist-title">Создайте карту желаний</h2>
    <p class="wishlist-description">
      Расскажите близким, какие букеты вы мечтаете получить и когда
    </p>
    <a href="https://YOUR-APP-URL.vercel.app" 
       class="wishlist-button" 
       target="_blank">
      ✨ Составить карту желаний
    </a>
  </div>
</div>

<style>
.wishlist-banner {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%);
  padding: 60px 20px;
  text-align: center;
  margin: 40px 0;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.wishlist-content {
  max-width: 600px;
  margin: 0 auto;
}

.wishlist-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.wishlist-title {
  font-size: 2.5rem;
  color: #2d5f3f;
  margin-bottom: 15px;
  font-weight: 700;
}

.wishlist-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.wishlist-button {
  display: inline-block;
  background: linear-gradient(135deg, #2d5f3f 0%, #4a8c5f 100%);
  color: white !important;
  padding: 18px 45px;
  border-radius: 30px;
  text-decoration: none !important;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(45, 95, 63, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;
}

.wishlist-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 95, 63, 0.6);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .wishlist-title {
    font-size: 2rem;
  }
  .wishlist-description {
    font-size: 1rem;
  }
  .wishlist-button {
    font-size: 1rem;
    padding: 15px 35px;
  }
}
</style>
```

### Шаг 3: Замените ссылку

Замените `https://YOUR-APP-URL.vercel.app` на вашу реальную ссылку с Vercel.

### Шаг 4: Сохраните и опубликуйте

1. Нажмите "Сохранить" в HTML блоке
2. Опубликуйте страницу

## Способ 2: Компактная кнопка в меню

Если хотите добавить кнопку в шапку сайта:

```html
<style>
.wishlist-menu-btn {
  display: inline-block;
  background: linear-gradient(135deg, #2d5f3f 0%, #4a8c5f 100%);
  color: white !important;
  padding: 10px 25px;
  border-radius: 20px;
  text-decoration: none !important;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(45, 95, 63, 0.3);
  transition: all 0.3s ease;
  margin-left: 15px;
}

.wishlist-menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(45, 95, 63, 0.5);
}
</style>

<a href="https://YOUR-APP-URL.vercel.app" 
   class="wishlist-menu-btn" 
   target="_blank">
  🌸 Карта желаний
</a>
```

## Способ 3: Простая кнопка через стандартный блок Tilda

### Шаг 1: Добавьте блок кнопки

1. Найдите место для кнопки
2. Добавьте блок типа **"Button"** (BF701 или аналогичный)

### Шаг 2: Настройте кнопку

- **Текст**: 🌸 Составить карту желаний
- **Ссылка**: `https://your-app.vercel.app`
- **Открыть в**: Новой вкладке
- **Цвет фона**: #4a8c5f (зеленый)
- **Цвет текста**: #ffffff

## Способ 4: Всплывающее окно (Popup)

Если хотите открывать приложение во всплывающем окне:

```html
<a href="#" onclick="openWishlistPopup(); return false;" class="wishlist-popup-btn">
  🌸 Составить карту желаний
</a>

<style>
.wishlist-popup-btn {
  display: inline-block;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white !important;
  padding: 15px 40px;
  border-radius: 30px;
  text-decoration: none !important;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;
}

.wishlist-popup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.6);
}
</style>

<script>
function openWishlistPopup() {
  const width = 900;
  const height = 700;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;
  
  window.open(
    'https://YOUR-APP-URL.vercel.app',
    'Карта желаний',
    'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left
  );
}
</script>
```

## 🎨 Варианты дизайна

### Минималистичная кнопка

```html
<a href="https://YOUR-APP-URL.vercel.app" 
   style="display: inline-block;
          background: #4a8c5f;
          color: white;
          padding: 12px 30px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;">
  Карта желаний
</a>
```

### Кнопка с тенью

```html
<a href="https://YOUR-APP-URL.vercel.app" 
   style="display: inline-block;
          background: white;
          color: #4a8c5f;
          padding: 15px 40px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 8px 25px rgba(74, 140, 95, 0.2);
          border: 2px solid #4a8c5f;">
  🌸 Составить карту желаний
</a>
```

### Кнопка-баннер на всю ширину

```html
<div style="background: linear-gradient(135deg, #2d5f3f 0%, #4a8c5f 100%);
            padding: 40px 20px;
            text-align: center;
            border-radius: 15px;
            margin: 30px 0;">
  <h3 style="color: white; margin-bottom: 15px; font-size: 1.8rem;">
    💐 Хотите получать цветы?
  </h3>
  <p style="color: rgba(255,255,255,0.9); margin-bottom: 25px; font-size: 1.1rem;">
    Создайте карту желаний и поделитесь ей с близкими
  </p>
  <a href="https://YOUR-APP-URL.vercel.app" 
     style="display: inline-block;
            background: white;
            color: #4a8c5f;
            padding: 15px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
    ✨ Создать карту
  </a>
</div>
```

## 📱 Адаптивность

Все примеры выше адаптивны и будут хорошо выглядеть на мобильных устройствах.

## ✅ Проверка

После добавления кнопки:

1. Просмотрите страницу
2. Нажмите на кнопку
3. Убедитесь, что открывается приложение "Карта желаний"
4. Проверьте на мобильном устройстве

## 🎯 Рекомендации по размещению

Лучшие места для кнопки "Карта желаний":

1. **В шапке сайта** - всегда на виду
2. **На главной странице** - первое, что видят посетители
3. **На странице с букетами** - когда клиент уже смотрит товары
4. **В футере** - для тех, кто долистал до конца
5. **В боковом меню** - постоянный доступ

## 💡 Советы

1. Используйте эмодзи 🌸 💐 🌹 для привлечения внимания
2. Сделайте кнопку заметной, но гармонирующей с дизайном
3. Добавьте призыв к действию: "Создайте карту желаний прямо сейчас!"
4. Тестируйте разные варианты размещения

---

Если нужна помощь с интеграцией, пишите на storyflowerssss@gmail.com

---

Сделано для StorySequel 🌸

