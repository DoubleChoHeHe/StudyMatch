
function renderHeader(activePage = '') {
  const user = getCurrentUser();
  const isAuth = !!user;

  const navItems = isAuth
    ? `
      <a href="discover.html" class="nav-link ${activePage === 'discover' ? 'active' : ''}" aria-label="Khám phá">
        <i class="fas fa-compass"></i> <span>Khám phá</span>
      </a>
      <a href="matches.html" class="nav-link ${activePage === 'matches' ? 'active' : ''}" aria-label="Matches">
        <i class="fas fa-book"></i> <span>Matches</span>
      </a>
      <a href="chat.html" class="nav-link ${activePage === 'chat' ? 'active' : ''}" aria-label="Chat">
        <i class="fas fa-comments"></i> <span>Chat</span>
      </a>
      <a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}" aria-label="Hồ sơ">
        <i class="fas fa-user"></i> <span>Hồ sơ</span>
      </a>
      <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}" aria-label="Giới thiệu">
        <i class="fas fa-info-circle"></i> <span>Giới thiệu</span>
      </a>
      <a href="feedback.html" class="nav-link ${activePage === 'feedback' ? 'active' : ''}" aria-label="Góp ý">
        <i class="fas fa-comment-dots"></i> <span>Góp ý</span>
      </a>
    `
    : `
      <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">
        <i class="fas fa-home"></i> <span>Trang chủ</span>
      </a>
      <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">
        <i class="fas fa-info-circle"></i> <span>Giới thiệu</span>
      </a>
      <a href="feedback.html" class="nav-link ${activePage === 'feedback' ? 'active' : ''}">
        <i class="fas fa-comment-dots"></i> <span>Góp ý</span>
      </a>
    `;

  const actions = isAuth
    ? `
      <a href="profile.html" title="${user.name}">
        <img src="${user.avatar}" alt="${user.name}" class="user-avatar" width="40" height="40">
      </a>
      <button class="btn btn-ghost btn-sm" onclick="logoutUser()" aria-label="Đăng xuất">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    `
    : `
      <a href="login.html" class="btn btn-outline btn-sm">Đăng nhập</a>
      <a href="register.html" class="btn btn-primary btn-sm">Đăng ký</a>
    `;

  return `
    <header class="header">
      <div class="container header-inner">
        <a href="${isAuth ? 'discover.html' : 'index.html'}" class="logo" aria-label="StudyMatch Home">
          <i class="fas fa-graduation-cap"></i>
          <span>StudyMatch</span>
        </a>
        <nav class="nav" role="navigation" aria-label="Main">
          ${navItems}
        </nav>
        <div class="header-actions">
          ${actions}
          <button class="hamburger" onclick="toggleMobileMenu()" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu" role="menu">
        ${navItems}
        ${isAuth
          ? `<button class="nav-link" onclick="logoutUser()" style="width:100%;text-align:left;background:none;border:none;">
               <i class="fas fa-sign-out-alt"></i> Đăng xuất
             </button>`
          : `<a href="login.html" class="nav-link"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a>
             <a href="register.html" class="nav-link"><i class="fas fa-user-plus"></i> Đăng ký</a>`
        }
      </div>
    </header>
  `;
}


function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="logo">
              <i class="fas fa-graduation-cap"></i> StudyMatch
            </a>
            <p>Nền tảng kết nối bạn học thông minh dành cho học sinh và sinh viên. Tìm đúng người, học hiệu quả hơn.</p>
          </div>
          <div>
            <h4 class="footer-title">Sản phẩm</h4>
            <div class="footer-links">
              <a href="index.html">Trang chủ</a>
              <a href="about.html">Giới thiệu</a>
              <a href="discover.html">Khám phá</a>
              <a href="matches.html">Matches</a>
              <a href="chat.html">Chat</a>
            </div>
          </div>
          <div>
            <h4 class="footer-title">Hỗ trợ</h4>
            <div class="footer-links">
              <a href="feedback.html">Góp ý / Feedback</a>
              <a href="about.html">Giới thiệu</a>
              <a href="coming-soon.html">Câu hỏi thường gặp</a>
              <a href="coming-soon.html">Hướng dẫn</a>
            </div>
          </div>
          <div>
            <h4 class="footer-title">Pháp lý</h4>
            <div class="footer-links">
              <a href="coming-soon.html">Chính sách bảo mật</a>
              <a href="coming-soon.html">Điều khoản sử dụng</a>
              <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} StudyMatch. Dự án học tập frontend — Không phải sản phẩm thương mại.</p>
        </div>
      </div>
    </footer>
  `;
}


function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.hamburger');
  if (menu) {
    menu.classList.toggle('open');
    if (btn) {
      btn.setAttribute('aria-expanded', menu.classList.contains('open'));
    }
  }
}


document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.hamburger');
  if (menu && menu.classList.contains('open') && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('open');
  }
});


async function fetchQuote() {
  const container = document.getElementById('quoteContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Đang tải động lực...</span>
    </div>
  `;

  try {
    
    const response = await fetch('https://api.quotable.io/random?tags=education|motivational|wisdom&maxLength=120');
    
    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    container.innerHTML = `
      <div class="quote-section animate-fadeIn">
        <i class="fas fa-quote-left"></i>
        <p class="quote-text">"${data.content}"</p>
        <p class="quote-author">— ${data.author}</p>
      </div>
    `;
  } catch (error) {
    
    const fallbacks = [
      { content: 'Tiến bộ nhỏ mỗi ngày vẫn tạo nên sự khác biệt lớn.', author: 'StudyMatch' },
      { content: 'Học tập là hành trình, không phải đích đến.', author: 'StudyMatch' },
      { content: 'Bạn không cần phải giỏi để bắt đầu, nhưng cần bắt đầu để trở nên giỏi.', author: 'StudyMatch' },
      { content: 'Người bạn học tốt là người giúp bạn trở thành phiên bản tốt hơn của chính mình.', author: 'StudyMatch' }
    ];
    const q = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    container.innerHTML = `
      <div class="quote-section animate-fadeIn">
        <i class="fas fa-quote-left"></i>
        <p class="quote-text">"${q.content}"</p>
        <p class="quote-author">— ${q.author}</p>
      </div>
    `;
  }
}


function showToast(message, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      padding: 14px 28px; border-radius: 50px; color: white; font-weight: 600;
      z-index: 9999; opacity: 0; transition: all 0.3s ease; font-size: 0.95rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2); max-width: 90%; text-align: center;
    `;
    document.body.appendChild(toast);
  }

  const colors = {
    success: '#00BFA6',
    error: '#FF6584',
    info: '#6C63FF'
  };
  toast.style.background = colors[type] || colors.info;
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}


function showMatchModal(currentUser, matchedUser, percentage) {
  let overlay = document.getElementById('matchModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'matchModal';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal match-celebration">
      <h2 style="color: var(--primary); margin-bottom: 8px;">
        <i class="fas fa-book" style="color: var(--secondary);"></i> Study Match!
      </h2>
      <p class="text-muted mb-3">Bạn đã tìm được bạn học!</p>
      <div class="match-avatars">
        <img src="${currentUser.avatar}" alt="${currentUser.name}">
        <i class="fas fa-book-open match-heart animate-heartBeat"></i>
        <img src="${matchedUser.avatar}" alt="${matchedUser.name}">
      </div>
      <h3>${currentUser.name} & ${matchedUser.name}</h3>
      <p class="match-pct" style="margin: 12px 0;">${percentage}% Tương thích</p>
      <p class="text-muted text-sm mb-3">Các môn chung: ${getSubjectNames(getSharedSubjects(currentUser, matchedUser)).join(', ') || '—'}</p>
      <div class="flex gap-2 flex-center" style="flex-wrap:wrap;">
        <a href="chat.html?user=${matchedUser.id}" class="btn btn-primary">
          <i class="fas fa-comments"></i> Bắt đầu học
        </a>
        <button class="btn btn-outline" onclick="closeMatchModal()">Tiếp tục khám phá</button>
      </div>
    </div>
  `;

  requestAnimationFrame(() => overlay.classList.add('open'));
}

function closeMatchModal() {
  const overlay = document.getElementById('matchModal');
  if (overlay) {
    overlay.classList.remove('open');
  }
}


function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Vừa xong';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' phút trước';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' giờ trước';
  return Math.floor(seconds / 86400) + ' ngày trước';
}


function initPage(activePage) {
  initAuth();
  initializeData();

 
  const headerEl = document.getElementById('appHeader');
  if (headerEl) {
    headerEl.innerHTML = renderHeader(activePage);
  }

  const footerEl = document.getElementById('appFooter');
  if (footerEl) {
    footerEl.innerHTML = renderFooter();
  }


  if (document.getElementById('quoteContainer')) {
    fetchQuote();
  }
}
