async function api(path, options = {}) {
  const base = window.location.origin;
  const res = await fetch(`${base}${path}`, options);
  return res.json();
}

const state = { sessions: [], active: null, lastTs: 0 };

async function loadSessions() {
  state.sessions = await api('/api/chat/sessions');
  const list = document.getElementById('sessions');
  list.innerHTML = '';
  state.sessions.forEach((s) => {
    const li = document.createElement('li');
    li.textContent = s.sessionId;
    li.onclick = () => selectSession(s.sessionId);
    if (s.sessionId === state.active) li.classList.add('active');
    list.appendChild(li);
  });
}

async function selectSession(sessionId) {
  state.active = sessionId;
  state.lastTs = 0;
  document.querySelectorAll('#sessions li').forEach((li) => {
    li.classList.toggle('active', li.textContent === sessionId);
  });
  document.getElementById('messages').innerHTML = '';
  await loadMessages(true);
}

function renderMessage(m) {
  const wrap = document.createElement('div');
  wrap.className = `msg ${m.sender}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = `${m.userName}: ${m.text}`;
  wrap.appendChild(bubble);
  document.getElementById('messages').appendChild(wrap);
}

async function loadMessages(reset = false) {
  if (!state.active) return;
  const url = `/api/chat/messages?sessionId=${encodeURIComponent(state.active)}${state.lastTs ? `&afterTs=${state.lastTs}` : ''}`;
  const list = await api(url);
  list.forEach((m) => {
    renderMessage(m);
    const ts = new Date(m.timestamp).getTime();
    if (ts > state.lastTs) state.lastTs = ts;
  });
  const box = document.getElementById('messages');
  box.scrollTop = box.scrollHeight;
}

async function sendAdmin() {
  const input = document.getElementById('compose');
  const text = input.value.trim();
  if (!text || !state.active) return;
  const token = window.ADMIN_TOKEN || '';
  await fetch('/api/chat/adminSend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ sessionId: state.active, text })
  });
  input.value = '';
  await loadMessages();
}

function boot() {
  document.getElementById('send').onclick = sendAdmin;
  loadSessions();
  setInterval(loadSessions, 5000);
  setInterval(loadMessages, 1500);
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}


