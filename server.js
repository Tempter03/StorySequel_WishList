require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Настройки Telegram бота
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('⚠️  Ошибка: установите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env файле');
  process.exit(1);
}

// Создаем бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Хранение активных соединений
const activeConnections = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Главная страница для тестирования виджета
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API для получения токена сессии
app.post('/api/chat/connect', (req, res) => {
  const sessionId = generateSessionId();
  activeConnections.set(sessionId, {
    socketId: null,
    messages: []
  });
  res.json({ sessionId });
});

// Обработка подключений через WebSocket
io.on('connection', (socket) => {
  console.log('Новый клиент подключен:', socket.id);

  // Клиент присоединяется к сессии
  socket.on('join-session', (sessionId) => {
    console.log(`Клиент ${socket.id} присоединился к сессии: ${sessionId}`);
    
    if (activeConnections.has(sessionId)) {
      activeConnections.get(sessionId).socketId = socket.id;
      socket.join(sessionId);
      
      // Отправляем историю сообщений
      const messages = activeConnections.get(sessionId).messages;
      socket.emit('message-history', messages);
    } else {
      socket.emit('error', { message: 'Неверный session ID' });
    }
  });

  // Обработка входящих сообщений от пользователя
  socket.on('send-message', async (data) => {
    const { sessionId, message, userName = 'Гость' } = data;
    
    if (!activeConnections.has(sessionId)) {
      socket.emit('error', { message: 'Сессия не найдена' });
      return;
    }

    console.log(`Сообщение от ${userName} (${sessionId}):`, message);

    // Сохраняем сообщение пользователя
    const userMessage = {
      id: generateMessageId(),
      text: message,
      sender: 'user',
      userName,
      timestamp: new Date().toISOString()
    };
    
    activeConnections.get(sessionId).messages.push(userMessage);
    
    // Отправляем сообщение клиенту для отображения
    io.to(sessionId).emit('new-message', userMessage);

    try {
      // Отправляем сообщение в Telegram
      const telegramMessage = `👤 ${userName}:\n${message}`;
      await bot.sendMessage(TELEGRAM_CHAT_ID, telegramMessage);
      
      // Сохраняем ID сообщения в Telegram для связи
      const telegramMsgId = activeConnections.get(sessionId).messages.length - 1;
      
      console.log('Сообщение отправлено в Telegram');
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      socket.emit('error', { message: 'Не удалось отправить сообщение' });
    }
  });

  // Отключение клиента
  socket.on('disconnect', () => {
    console.log('Клиент отключен:', socket.id);
    
    // Находим и удаляем отключенное соединение
    for (const [sessionId, connection] of activeConnections.entries()) {
      if (connection.socketId === socket.id) {
        // Можно сохранить историю или удалить её после некоторого времени
        console.log(`Сессия ${sessionId} отключена`);
      }
    }
  });
});

// Обработка ответов из Telegram
bot.on('message', async (msg) => {
  try {
    const telegramChatId = msg.chat.id;
    const messageText = msg.text;
    const messageId = msg.message_id;
    
    // Проверяем, что сообщение из нужного чата
    if (telegramChatId.toString() !== TELEGRAM_CHAT_ID) {
      return;
    }

    console.log('Получен ответ из Telegram:', messageText);

    // Ищем активную сессию для отправки ответа
    // В этой версии отправляем всем активным сессиям
    for (const [sessionId, connection] of activeConnections.entries()) {
      if (connection.socketId) {
        const adminMessage = {
          id: generateMessageId(),
          text: messageText,
          sender: 'admin',
          userName: 'Администратор',
          timestamp: new Date().toISOString()
        };
        
        connection.messages.push(adminMessage);
        io.to(sessionId).emit('new-message', adminMessage);
      }
    }
  } catch (error) {
    console.error('Ошибка обработки сообщения из Telegram:', error);
  }
});

// Генерация уникальных ID
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateMessageId() {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📱 Бот Telegram активен`);
  console.log(`💬 Виджет доступен на http://localhost:${PORT}`);
});

