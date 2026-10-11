

let activeChatUserId = null;


function initChat() {
  if (!requireAuth()) return;

  const params = new URLSearchParams(window.location.search);
  const directUser = params.get('user');

  renderChatList();

  if (directUser) {
    openChat(directUser);
  }
}


function renderChatList() {
  const currentUser = getCurrentUser();
  const matches = getUserMatches(currentUser.id);
  const container = document.getElementById('chatList');
  if (!container) return;

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:30px 16px;">
        <i class="fas fa-comments" style="font-size:2.5rem;"></i>
        <h4>Chưa có cuộc trò chuyện</h4>
        <p class="text-sm">Match với ai đó để bắt đầu chat!</p>
        <a href="discover.html" class="btn btn-primary btn-sm mt-2">Khám phá</a>
      </div>
    `;
    return;
  }

  const messages = getMessages();

  container.innerHTML = matches.map(m => {
    const other = m.otherUser;
    const chatKey = getChatKey(currentUser.id, other.id);
    const msgs = messages[chatKey] || [];
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

    return `
      <div class="chat-list-item ${activeChatUserId === other.id ? 'active' : ''}"
           onclick="openChat('${other.id}')" role="button" tabindex="0">
        <img src="${other.avatar}" alt="${other.name}">
        <div class="chat-list-info">
          <h4>${other.name}</h4>
          <p>${lastMsg ? (lastMsg.senderId === currentUser.id ? 'Bạn: ' : '') + lastMsg.text : 'Bắt đầu trò chuyện...'}</p>
        </div>
      </div>
    `;
  }).join('');
}


function openChat(userId) {
  activeChatUserId = userId;
  const currentUser = getCurrentUser();
  const users = getUsers();
  const other = users.find(u => u.id === userId);

  if (!other) {
    showToast('Không tìm thấy người dùng', 'error');
    return;
  }

  const matches = getUserMatches(currentUser.id);
  const isMatched = matches.some(m => m.otherUser.id === userId);
  if (!isMatched) {
    showToast('Bạn chỉ có thể chat với người đã Match', 'error');
    return;
  }

  renderChatList();
  renderChatHeader(other);
  renderMessages(other);
  const inputArea = document.getElementById('chatInputArea');
  if (inputArea) inputArea.classList.remove('hidden');
}


function renderChatHeader(other) {
  const header = document.getElementById('chatHeader');
  if (!header) return;

  const currentUser = getCurrentUser();
  const shared = getSharedSubjects(currentUser, other);
  const sharedNames = getSubjectNames(shared);

  header.innerHTML = `
    <img src="${other.avatar}" alt="${other.name}">
    <div>
      <h4>${other.name}</h4>
      <p class="text-sm text-muted">
        ${sharedNames.length > 0 ? sharedNames.join(', ') : 'Bạn học'} · 
        <span style="color:var(--secondary);">● Online</span>
      </p>
    </div>
  `;
}


function getChatKey(id1, id2) {
  return [id1, id2].sort().join('_');
}


function renderMessages(other) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const currentUser = getCurrentUser();
  const chatKey = getChatKey(currentUser.id, other.id);
  const messages = getMessages();
  const msgs = messages[chatKey] || [];

  if (msgs.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:40px 20px;">
        <i class="fas fa-comment-dots" style="font-size:2rem;color:var(--text-light);"></i>
        <p class="text-muted mt-2">Chưa có tin nhắn. Hãy gửi lời chào!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = msgs.map(m => {
    const isSent = m.senderId === currentUser.id;
    const time = new Date(m.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="message ${isSent ? 'message-sent' : 'message-received'}">
        ${escapeHtml(m.text)}
        <div class="message-time">${time}</div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}


function sendMessage(e) {
  e.preventDefault();
  if (!activeChatUserId) return;

  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  if (!text) return;

  const currentUser = getCurrentUser();
  const chatKey = getChatKey(currentUser.id, activeChatUserId);
  const messages = getMessages();

  if (!messages[chatKey]) {
    messages[chatKey] = [];
  }

  messages[chatKey].push({
    id: 'msg_' + Date.now(),
    senderId: currentUser.id,
    text,
    timestamp: new Date().toISOString()
  });

  saveMessages(messages);

  const matches = getMatches();
  const match = matches.find(m =>
    (m.user1Id === currentUser.id && m.user2Id === activeChatUserId) ||
    (m.user2Id === currentUser.id && m.user1Id === activeChatUserId)
  );
  if (match) {
    match.lastActivity = new Date().toISOString();
    saveMatches(matches);
  }

  input.value = '';
  const other = getUsers().find(u => u.id === activeChatUserId);
  renderMessages(other);
  renderChatList();
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
