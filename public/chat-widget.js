/**
 * Виджет чата для Tilda с интеграцией Telegram
 */
class TildaChatWidget {
    constructor(config) {
        this.config = {
            serverUrl: config.serverUrl || '',
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

        // Получаем session ID (через API Vercel)
        await this.connect();

        // Загружаем историю и запускаем опрос
        await this.connectSocket();

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
                        <div class="status" id="connection-status">Онлайн</div>
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
            const base = this.config.serverUrl || window.location.origin;
            const response = await fetch(`${base}/api/chat/connect`, {
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

async connectSocket() {
        // После connect() загружаем историю и запускаем опрос новых сообщений
        await this.loadHistory();
        this.enableInput();
        this.startPolling();
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

        // Отправляем в serverless API
        const base = this.config.serverUrl || window.location.origin;
        fetch(`${base}/api/chat/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.sessionId,
                message: message,
                userName: this.config.userName
            })
        }).then(() => {
            // Добавляем сразу сообщение в интерфейс
            this.addMessage({
                id: `msg_${Date.now()}`,
                text: message,
                sender: 'user',
                userName: this.config.userName,
                timestamp: new Date().toISOString()
            });
        }).catch(() => {
            this.updateStatus('Ошибка отправки');
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

// Инициализация виджета (работает и если DOM уже загружен)
function __initTildaChatWidget() {
    try {
        // Вставляем CSS если его ещё нет
        if (!document.getElementById('tilda-chat-widget-styles')) {
            const link = document.createElement('link');
            link.id = 'tilda-chat-widget-styles';
            link.rel = 'stylesheet';
            // Явно используем абсолютный путь, если задан serverUrl
            const base = (window.tildaChatWidgetConfig && window.tildaChatWidgetConfig.serverUrl) || window.location.origin;
            link.href = (window.tildaChatWidgetConfig?.stylesUrl) || `${base.replace(/\/$/, '')}/widget.css`;
            document.head.appendChild(link);
        }

        const config = window.tildaChatWidgetConfig || {
            serverUrl: '',
            userName: 'Гость'
        };
        window.tildaChatWidget = new TildaChatWidget(config);
    } catch (e) {
        // no-op
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', __initTildaChatWidget);
} else {
    __initTildaChatWidget();
}

// Новые методы для Vercel API
TildaChatWidget.prototype.enableInput = function () {
    document.getElementById('chat-input').disabled = false;
    document.getElementById('send-button').disabled = false;
};

TildaChatWidget.prototype.loadHistory = async function () {
    const base = this.config.serverUrl || window.location.origin;
    const res = await fetch(`${base}/api/chat/messages?sessionId=${encodeURIComponent(this.sessionId)}`);
    const messages = await res.json();
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'none';
    messages.forEach(m => this.addMessage(m, false));
};

TildaChatWidget.prototype.startPolling = function () {
    let lastTs = Date.now();
    this._pollTimer = setInterval(async () => {
        try {
            const base = this.config.serverUrl || window.location.origin;
            const res = await fetch(`${base}/api/chat/messages?sessionId=${encodeURIComponent(this.sessionId)}&afterTs=${lastTs}`);
            const messages = await res.json();
            messages.forEach(m => {
                this.addMessage(m);
                // Если окно закрыто, увеличиваем счетчик непрочитанных
                if (!this.isOpen && m.sender === 'admin') this.incrementUnreadCount();
            });
            if (messages.length) {
                const latest = messages[messages.length - 1];
                lastTs = new Date(latest.timestamp).getTime();
            }
        } catch (e) {
            // no-op
        }
    }, 2000);
};

