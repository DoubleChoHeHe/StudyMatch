
function initProfile() {
  if (!requireAuth()) return;
  renderProfile();
  renderAISuggestions();
}

function renderProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const container = document.getElementById('profileContent');
  if (!container) return;

  const matches = getUserMatches(user.id);
  const subjectNames = getSubjectNames(user.subjects);
  const styleName = LEARNING_STYLES.find(s => s.id === user.learningStyle)?.name || 'Chưa chọn';
  const methodName = STUDY_METHODS.find(s => s.id === user.studyMethod)?.name || 'Chưa chọn';
  const levelName = LEVELS.find(l => l.id === user.level)?.name || 'Chưa chọn';
  const availNames = (user.availability || []).map(a => AVAILABILITY.find(av => av.id === a)?.name).filter(Boolean);
  const goalNames = (user.goals || []).map(g => LEARNING_GOALS.find(gl => gl.id === g)?.name).filter(Boolean);
  const durationName = DURATIONS.find(d => d.id === user.duration)?.name || 'Chưa chọn';

  container.innerHTML = `
    <div class="profile-header animate-fadeInUp">
      <img src="${user.avatar}" alt="${user.name}" class="profile-avatar-lg">
      <div>
        <h1>${user.name}</h1>
        <p class="text-muted"><i class="fas fa-at"></i> ${user.username} · ${user.age} tuổi</p>
        <p class="text-muted"><i class="fas fa-university"></i> ${user.school || 'Chưa cập nhật trường'}</p>
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-value">${matches.length}</div>
            <div class="stat-label">Matches</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${(user.subjects || []).length}</div>
            <div class="stat-label">Môn học</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${(getLikes()[user.id] || []).length}</div>
            <div class="stat-label">Đã thích</div>
          </div>
        </div>
        <div class="mt-3">
          <button class="btn btn-primary" onclick="showEditProfile()">
            <i class="fas fa-edit"></i> Chỉnh sửa hồ sơ
          </button>
          <a href="subjects.html" class="btn btn-outline">
            <i class="fas fa-book"></i> Cập nhật môn học
          </a>
        </div>
      </div>
    </div>

    <div class="card mb-3 animate-fadeInUp">
      <div class="profile-section">
        <h3><i class="fas fa-info-circle text-primary"></i> Giới thiệu</h3>
        <p>${user.bio || 'Chưa có giới thiệu. Hãy viết vài dòng về bản thân!'}</p>
      </div>
    </div>

    <div class="card mb-3 animate-fadeInUp">
      <div class="profile-section">
        <h3><i class="fas fa-book text-primary"></i> Môn học</h3>
        <div class="discover-tags">
          ${subjectNames.length > 0
            ? subjectNames.map(s => `<span class="tag">${s}</span>`).join('')
            : '<span class="text-muted">Chưa chọn môn học</span>'}
        </div>
      </div>
    </div>

    <div class="card mb-3 animate-fadeInUp">
      <div class="profile-section">
        <h3><i class="fas fa-brain text-primary"></i> Sở thích học tập</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
          <div><strong>Phong cách:</strong> ${styleName}</div>
          <div><strong>Phương thức:</strong> ${methodName}</div>
          <div><strong>Trình độ:</strong> ${levelName}</div>
          <div><strong>Thời lượng:</strong> ${durationName}</div>
          <div><strong>Thời gian rảnh:</strong> ${availNames.join(', ') || '—'}</div>
          <div><strong>Mục tiêu:</strong> ${goalNames.join(', ') || '—'}</div>
        </div>
      </div>
    </div>

    <div id="aiSuggestions"></div>

    <div class="card mt-3" style="border-color: rgba(255,101,132,0.3);">
      <h3 class="text-accent mb-2"><i class="fas fa-exclamation-triangle"></i> Vùng nguy hiểm</h3>
      <p class="text-muted text-sm mb-2">Xóa tài khoản sẽ xóa toàn bộ dữ liệu, matches và tin nhắn.</p>
      <button class="btn btn-accent btn-sm" onclick="confirmDeleteAccount()">
        <i class="fas fa-trash"></i> Xóa tài khoản
      </button>
    </div>
  `;
}

function renderAISuggestions() {
  const user = getCurrentUser();
  const container = document.getElementById('aiSuggestions');
  if (!container || !user) return;

  const suggestions = getAISuggestions(user);

  container.innerHTML = `
    <div class="ai-card animate-fadeInUp">
      <h3><i class="fas fa-robot"></i> AI Study Assistant</h3>
      <p class="text-muted text-sm mb-2">Gợi ý dựa trên hồ sơ của bạn (mô phỏng AI — sẵn sàng kết nối API thật).</p>
      ${suggestions.map(s => `
        <div class="ai-suggestion">
          <i class="${s.icon}"></i>
          <div>
            <h4>${s.title}</h4>
            <p>${s.content}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function showEditProfile() {
  const user = getCurrentUser();
  const container = document.getElementById('profileContent');
  if (!container || !user) return;

  container.innerHTML = `
    <div class="card animate-fadeInUp" style="max-width:600px;margin:0 auto;">
      <h2 class="mb-3"><i class="fas fa-edit"></i> Chỉnh sửa hồ sơ</h2>
      <form id="editProfileForm" onsubmit="saveProfile(event)">
        <div class="form-group">
          <label class="form-label" for="editName">Họ và tên</label>
          <input type="text" id="editName" class="form-input" value="${user.name}" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="editAge">Tuổi</label>
          <input type="number" id="editAge" class="form-input" value="${user.age}" min="13" max="99" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="editSchool">Trường / Đại học</label>
          <input type="text" id="editSchool" class="form-input" value="${user.school || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="editAvatarFile">Ảnh đại diện</label>
          <div class="mb-2" style="text-align:center;">
            <img id="editAvatarPreview" src="${user.avatar || ''}" alt="Avatar"
              style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid rgba(167,139,250,0.5);">
          </div>
          <input type="file" id="editAvatarFile" class="form-input" accept="image/*" onchange="previewEditAvatar(event)">
          <p class="form-hint">Tải ảnh mới từ máy (JPG/PNG, tối đa ~2MB) hoặc giữ ảnh hiện tại.</p>
          <input type="hidden" id="editAvatarData" value="">
        </div>
        <div class="form-group">
          <label class="form-label" for="editBio">Giới thiệu</label>
          <textarea id="editBio" class="form-textarea" rows="4">${user.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Phong cách học</label>
          <select id="editStyle" class="form-select">
            <option value="">Chọn...</option>
            ${LEARNING_STYLES.map(s => `<option value="${s.id}" ${user.learningStyle === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Phương thức học</label>
          <select id="editMethod" class="form-select">
            <option value="">Chọn...</option>
            ${STUDY_METHODS.map(s => `<option value="${s.id}" ${user.studyMethod === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Trình độ</label>
          <select id="editLevel" class="form-select">
            <option value="">Chọn...</option>
            ${LEVELS.map(l => `<option value="${l.id}" ${user.level === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Thời lượng học</label>
          <select id="editDuration" class="form-select">
            <option value="">Chọn...</option>
            ${DURATIONS.map(d => `<option value="${d.id}" ${user.duration === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="flex gap-2 mt-3">
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
          <button type="button" class="btn btn-ghost" onclick="renderProfile(); renderAISuggestions();">
            Hủy
          </button>
        </div>
      </form>
    </div>
  `;
}

function previewEditAvatar(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('Ảnh tối đa 2MB. Vui lòng chọn ảnh nhỏ hơn.');
    e.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('editAvatarPreview').src = reader.result;
    document.getElementById('editAvatarData').value = reader.result;
  };
  reader.readAsDataURL(file);
}

function saveProfile(e) {
  e.preventDefault();

  const newAvatar = document.getElementById('editAvatarData').value.trim();
  const updates = {
    name: document.getElementById('editName').value.trim(),
    age: parseInt(document.getElementById('editAge').value) || 18,
    school: document.getElementById('editSchool').value.trim(),
    avatar: newAvatar || getCurrentUser().avatar,
    bio: document.getElementById('editBio').value.trim(),
    learningStyle: document.getElementById('editStyle').value,
    studyMethod: document.getElementById('editMethod').value,
    level: document.getElementById('editLevel').value,
    duration: document.getElementById('editDuration').value
  };

  updateCurrentUser(updates);
  showToast('Đã cập nhật hồ sơ!', 'success');
  renderProfile();
  renderAISuggestions();
}

function confirmDeleteAccount() {
  if (confirm('Bạn chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
    if (confirm('Xác nhận lần cuối: Xóa toàn bộ dữ liệu?')) {
      deleteAccount();
      showToast('Tài khoản đã được xóa.', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  }
}
