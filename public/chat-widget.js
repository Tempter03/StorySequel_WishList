/**
 * Виджет чата для Tilda с интеграцией Telegram
 */
class TildaChatWidget {
    constructor(config) {
        this.config = {
            serverUrl: config.serverUrl || 'http://localhost:3000',
            userName: config.userName || 'Гость',
            position: config.position || { bottom: '20px', right: '20px' },
            ...config
        };

        this.sessionId = null;
        this.socket = null;
        this.isOpen = false;
        this.unreadCount = 0;

        this.init();
    }

    async init() {
        // Создаем HTML структуру
        this.createWidgetHTML();

        // Получаем session ID
        await this.connect();

        // Подключаемся через WebSocket
        this.connectSocket();

        // Назначаем обработчики событий
        this.attachEvents();
    }

    createWidgetHTML() {
        const widget = document.createElement('div');
        widget.id = 'tilda-chat-widget';
        widget.style.position = 'fixed';
        widget.style.bottom = this.config.position.bottom;
        widget.style.right = this.config.position.right;

        widget.innerHTML = `
            <div class="chat-button" id="chat-toggle">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
                <span class="badge" id="unread-badge" style="display: none;">0</span>
            </div>
            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <div>
                        <h3>💬 Чат поддержки</h3>
                        <div class="status" id="connection-status">Подключение...</div>
                    </div>
                    <button class="close-button" id="chat-close">&times;</button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="typing-indicator" id="typing-indicator">Подключение к серверу...</div>
                </div>
                <div class="chat-input-container">
                    <form class="chat-input-form" id="chat-form">
                        <input 
                            type="text" 
                            class="chat-input" 
                            id="chat-input" 
                            placeholder="Введите ваше сообщение..."
                            disabled
                        />
                        <button type="submit" class="send-button" id="send-button" disabled>
                            <svg viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
    }

    async connect() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/chat/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            this.sessionId = data.sessionId;
            console.log('Подключено к серверу. Session ID:', this.sessionId);
        } catch (error) {
            console.error('Ошибка подключения к серверу:', error);
            this.updateStatus('Ошибка подключения');
        }
    }

    connectSocket() {
        const socket = io(this.config.serverUrl);

        socket.on('connect', () => {
            console.log('WebSocket подключен');
            this.updateStatus('Онлайн');
            this.socket = socket;

            // Отправляем session ID
            socket.emit('join-session', this.sessionId);
        });

        socket.on('disconnect', () => {
            console.log('WebSocket отключен');
            this.updateStatus('Переподключение...');
        });

        socket.on('message-history', (messages) => {
            console.log('Получена история сообщений:', messages);
            const typingIndicator = document.getElementById('typing-indicator');
            typingIndicator.style.display = 'none';

            messages.forEach(msg => {
                this.addMessage(msg, false);
            });

            // Активируем ввод
            document.getElementById('chat-input').disabled = false;
            document.getElementById('send-button').disabled = false;
        });

        socket.on('new-message', (message) => {
            console.log('Получено новое сообщение:', message);
            this.addMessage(message);

            // Если окно закрыто, увеличиваем счетчик непрочитанных
            if (!this.isOpen) {
                this.incrementUnreadCount();
            }
        });

        socket.on('error', (error) => {
            console.error('Ошибка WebSocket:', error);
            this.updateStatus('Ошибка');
        });
    }

    attachEvents() {
        // Кнопка открытия/закрытия
        document.getElementById('chat-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        // Кнопка закрытия
        document.getElementById('chat-close').addEventListener('click', () => {
            this.closeChat();
        });

        // Отправка сообщения
        document.getElementById('chat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Энтер в поле ввода
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-window');
        
        if (this.isOpen) {
            chatWindow.classList.add('active');
            this.unreadCount = 0;
            this.updateUnreadBadge();
        } else {
            chatWindow.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-window').classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Отключаем кнопку и поле ввода
        input.disabled = true;
        document.getElementById('send-button').disabled = true;

        // Отправляем сообщение
        this.socket.emit('send-message', {
            sessionId: this.sessionId,
            message: message,
            userName: this.config.userName
        });

        // Очищаем поле ввода
        input.value = '';

        // Включаем обратно
        setTimeout(() => {
            input.disabled = false;
            document.getElementById('send-button').disabled = false;
            input.focus();
        }, 500);
    }

    addMessage(messageData, scroll = true) {
        const messagesContainer = document.getElementById('chat-messages');
        const typingIndicator = document.getElementById('typing-indicator');
        
        if (typingIndicator.style.display !== 'none') {
            typingIndicator.style.display = 'none';
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageData.sender}`;
        
        const date = new Date(messageData.timestamp);
        const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-name">${messageData.userName} • ${time}</div>
            <div class="message-content">${this.escapeHtml(messageData.text)}</div>
        `;

        messagesContainer.appendChild(messageDiv);

        if (scroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    incrementUnreadCount() {
        this.unreadCount++;
        this.updateUnreadBadge();
    }

    updateUnreadBadge() {
        const badge = document.getElementById('unread-badge');
        if (this.unreadCount > 0) {
            badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    updateStatus(status) {
        document.getElementById('connection-status').textContent = status;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Инициализация виджета при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    // Вставляем CSS если его ещё нет
    if (!document.getElementById('tilda-chat-widget-styles')) {
        const link = document.createElement('link');
        link.id = 'tilda-chat-widget-styles';
        link.rel = 'stylesheet';
        link.href = window.tildaChatWidgetConfig?.stylesUrl || './widget.css';
        document.head.appendChild(link);
    }

    // Получаем конфигурацию из глобальной переменной
    const config = window.tildaChatWidgetConfig || {
        serverUrl: 'http://localhost:3000',
        userName: 'Гость'
    };

    // Создаем экземпляр виджета
    window.tildaChatWidget = new TildaChatWidget(config);
});

