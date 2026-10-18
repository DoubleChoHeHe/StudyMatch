
let currentRecommendations = [];
let currentIndex = 0;
let currentFilters = {};

function initDiscover() {
  if (!requireAuth()) return;

  const user = getCurrentUser();


  if (!user.subjects || user.subjects.length === 0) {
    window.location.href = 'subjects.html';
    return;
  }

  loadRecommendations();
  setupFilters();
  setupKeyboard();
}

function loadRecommendations() {
  const user = getCurrentUser();
  currentRecommendations = getRecommendations(user, currentFilters);
  currentIndex = 0;

  renderRecommendationList();
  renderCurrentCard();
}

function renderCurrentCard() {
  const container = document.getElementById('discoverCard');
  if (!container) return;

  if (currentIndex >= currentRecommendations.length) {
    container.innerHTML = `
      <div class="empty-state animate-fadeIn">
        <i class="fas fa-search"></i>
        <h3>Không còn đề xuất nào</h3>
        <p>Hãy thử thay đổi bộ lọc hoặc quay lại sau.</p>
        <button class="btn btn-primary" onclick="resetFilters()">
          <i class="fas fa-redo"></i> Xóa bộ lọc
        </button>
      </div>
    `;
    return;
  }

  const { user, percentage, sharedSubjects, sharedAvail } = currentRecommendations[currentIndex];
  const subjectNames = getSubjectNames(user.subjects);
  const styleName = LEARNING_STYLES.find(s => s.id === user.learningStyle)?.name || '';
  const availNames = (user.availability || []).map(a => AVAILABILITY.find(av => av.id === a)?.name).filter(Boolean);
  const label = getMatchLabel(percentage);

  container.innerHTML = `
    <div class="discover-card animate-scaleIn" id="swipeCard">
      <div class="discover-avatar-wrap">
        <img ${avatarImgAttrs(user.avatar, user.name, "discover-avatar")}>
        <div class="discover-match-badge">${percentage}%</div>
      </div>
      <div class="discover-info">
        <h2 class="discover-name">${user.name}, ${user.age}</h2>
        <p class="discover-meta"><i class="fas fa-university"></i> ${user.school || 'Chưa cập nhật'}</p>
        <div class="discover-tags">
          ${subjectNames.slice(0, 4).map(s => `<span class="tag"><i class="fas fa-book"></i> ${s}</span>`).join('')}
          ${styleName ? `<span class="tag tag-secondary"><i class="fas fa-brain"></i> ${styleName}</span>` : ''}
        </div>
        <p class="discover-bio">${user.bio || 'Chưa có giới thiệu.'}</p>
        <p class="text-sm text-muted mt-1">
          <i class="fas fa-clock"></i> ${availNames.join(', ') || 'Chưa rõ thời gian'}
          &nbsp;·&nbsp;
          <i class="fas fa-star"></i> ${label}
        </p>
        ${sharedSubjects.length > 0 ? `<p class="text-sm text-primary mt-1"><i class="fas fa-link"></i> ${sharedSubjects.length} môn chung</p>` : ''}
      </div>
      <div class="discover-actions">
        <button class="action-btn action-pass" onclick="handlePass()" aria-label="Bỏ qua" title="Bỏ qua">
          <i class="fas fa-times"></i>
        </button>
        <button class="action-btn action-super" onclick="handleLike(true)" aria-label="Match đặc biệt" title="Match đặc biệt">
          <i class="fas fa-book-open"></i>
        </button>
        <button class="action-btn action-like" onclick="handleLike(false)" aria-label="Học cùng" title="Học cùng">
          <i class="fas fa-book"></i>
        </button>
      </div>
    </div>
  `;
}

function handleLike(isSuper = false) {
  if (currentIndex >= currentRecommendations.length) return;

  const currentUser = getCurrentUser();
  const target = currentRecommendations[currentIndex];
  const card = document.getElementById('swipeCard');

  if (card) {
    card.classList.add('swiping-right');
  }

  const result = likeUser(currentUser.id, target.user.id, { isSuper });

  setTimeout(() => {
    if (result.matched) {
      showMatchModal(currentUser, target.user, target.percentage);
      showToast('Bạn đã Match! 🎉', 'success');
    } else {
      showToast(isSuper ? 'Đã gửi Match đặc biệt!' : 'Đã thích! Nếu họ cũng thích bạn sẽ Match.', 'success');
    }
    
    currentRecommendations = currentRecommendations.filter(
      (r, i) => i !== currentIndex
    );
    
    renderCurrentCard();
    renderRecommendationList();
  }, 350);
}


function handlePass() {
  if (currentIndex >= currentRecommendations.length) return;

  const currentUser = getCurrentUser();
  const target = currentRecommendations[currentIndex];
  const card = document.getElementById('swipeCard');

  if (card) {
    card.classList.add('swiping-left');
  }

  passUser(currentUser.id, target.user.id);

  setTimeout(() => {
    currentRecommendations = currentRecommendations.filter(
      (r, i) => i !== currentIndex
    );
    renderCurrentCard();
  }, 350);
}


function renderRecommendationList() {
  const container = document.getElementById('recList');
  if (!container) return;

  const recs = currentRecommendations.slice(0, 6);

  if (recs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-users"></i>
        <h3>Chưa có đề xuất</h3>
        <p>Hãy cập nhật hồ sơ hoặc thử bộ lọc khác.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recs.map(({ user, percentage, sharedSubjects, sharedAvail }) => `
    <div class="card rec-card hover-lift">
      <img ${avatarImgAttrs(user.avatar, user.name, "discover-avatar")}>
      <h4>${user.name}</h4>
      <span class="match-pct">${percentage}% Match</span>
      <p class="text-sm text-muted mt-1">
        ${getSubjectNames(user.subjects).slice(0, 3).join(', ')}
      </p>
      <p class="text-sm text-primary">
        ${sharedSubjects.length} môn chung
        ${sharedAvail.length > 0 ? ` · Rảnh: ${sharedAvail.map(a => AVAILABILITY.find(av => av.id === a)?.name).filter(Boolean).join(', ')}` : ''}
      </p>
      <div class="flex gap-1 mt-2" style="justify-content:center;">
        <button class="btn btn-primary btn-sm" onclick="jumpToUser('${user.id}')">
          <i class="fas fa-book"></i> Học cùng
        </button>
      </div>
    </div>
  `).join('');
}


function jumpToUser(userId) {
  const idx = currentRecommendations.findIndex(r => r.user.id === userId);
  if (idx >= 0) {
    currentIndex = idx;
    renderCurrentCard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


function setupFilters() {
  const subjectFilter = document.getElementById('filterSubject');
  if (subjectFilter) {
    subjectFilter.innerHTML = '<option value="">Tất cả môn</option>' +
      SUBJECTS.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }

  const styleFilter = document.getElementById('filterStyle');
  if (styleFilter) {
    styleFilter.innerHTML = '<option value="">Tất cả phong cách</option>' +
      LEARNING_STYLES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }

  const availFilter = document.getElementById('filterAvail');
  if (availFilter) {
    availFilter.innerHTML = '<option value="">Tất cả thời gian</option>' +
      AVAILABILITY.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  }
}

function applyFilters() {
  currentFilters = {
    subject: document.getElementById('filterSubject')?.value || '',
    learningStyle: document.getElementById('filterStyle')?.value || '',
    availability: document.getElementById('filterAvail')?.value || '',
    studyMethod: document.getElementById('filterMethod')?.value || '',
    minPercentage: parseInt(document.getElementById('filterMinPct')?.value) || 0
  };

  Object.keys(currentFilters).forEach(k => {
    if (!currentFilters[k]) delete currentFilters[k];
  });
  loadRecommendations();
  showToast('Đã áp dụng bộ lọc', 'info');
}

function resetFilters() {
  currentFilters = {};
  ['filterSubject', 'filterStyle', 'filterAvail', 'filterMethod', 'filterMinPct'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  loadRecommendations();
}

function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowRight' || e.key === 'l') {
      e.preventDefault();
      handleLike();
    } else if (e.key === 'ArrowLeft' || e.key === 'x') {
      e.preventDefault();
      handlePass();
    }
  });
}
