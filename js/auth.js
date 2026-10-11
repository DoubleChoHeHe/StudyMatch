

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} - { success: boolean, message: string, user?: Object }
 */
function registerUser(userData) {
  const users = getUsers();

  if (!userData.name || !userData.username || !userData.email || !userData.password) {
    return { success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' };
  }


  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { success: false, message: 'Email này đã được sử dụng.' };
  }


  if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
    return { success: false, message: 'Username này đã được sử dụng.' };
  }


  if (userData.password !== userData.confirmPassword) {
    return { success: false, message: 'Mật khẩu xác nhận không khớp.' };
  }

  if (userData.password.length < 6) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
  }


  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    name: userData.name.trim(),
    username: userData.username.trim().toLowerCase(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password, // DEMO ONLY - never store plain text in production
    age: parseInt(userData.age) || 18,
    school: userData.school || '',
    avatar: userData.avatar || `https://i.pravatar.cc/300?u=${userData.username}`,
    subjects: [],
    learningStyle: '',
    studyMethod: '',
    availability: [],
    duration: '',
    level: '',
    goals: [],
    bio: '',
    likes: [],
    matches: [],
    createdAt: new Date().toISOString(),
    isDemo: false
  };

  users.push(newUser);
  saveUsers(users);


  setCurrentUser(newUser);

  return { success: true, message: 'Đăng ký thành công!', user: newUser };
}

/**
 * Login user
 * @param {string} identifier 
 * @param {string} password 
 * @param {boolean} remember 
 * @returns {Object} 
 */
function loginUser(identifier, password, remember = true) {
  const users = getUsers();
  const id = identifier.trim().toLowerCase();

  const user = users.find(u =>
    (u.email.toLowerCase() === id || u.username.toLowerCase() === id) &&
    u.password === password
  );

  if (!user) {
    return { success: false, message: 'Email/Username hoặc mật khẩu không đúng.' };
  }

  setCurrentUser(user);

  if (remember) {
    localStorage.setItem('studyMatchRemember', 'true');
  } else {
    localStorage.removeItem('studyMatchRemember');
  }

  return { success: true, message: 'Đăng nhập thành công!', user };
}


function logoutUser() {
  setCurrentUser(null);
  localStorage.removeItem('studyMatchRemember');
  window.location.href = 'login.html';
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
function isAuthenticated() {
  const user = getCurrentUser();
  if (!user) return false;


  const users = getUsers();
  const exists = users.some(u => u.id === user.id);
  if (!exists) {
    setCurrentUser(null);
    return false;
  }
  return true;
}


function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}


function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    const user = getCurrentUser();
    
    if (!user.subjects || user.subjects.length === 0) {
      window.location.href = 'subjects.html';
    } else {
      window.location.href = 'discover.html';
    }
    return true;
  }
  return false;
}


function updateCurrentUser(updates) {
  const users = getUsers();
  const current = getCurrentUser();
  if (!current) return null;

  const index = users.findIndex(u => u.id === current.id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  const updated = { ...users[index] };
  delete updated.password;
  setCurrentUser(updated);

  return updated;
}


function deleteAccount() {
  const current = getCurrentUser();
  if (!current) return false;

  let users = getUsers();
  users = users.filter(u => u.id !== current.id);
  saveUsers(users);


  let matches = getMatches();
  matches = matches.filter(m => m.user1Id !== current.id && m.user2Id !== current.id);
  saveMatches(matches);


  let likes = getLikes();
  delete likes[current.id];
  Object.keys(likes).forEach(key => {
    likes[key] = (likes[key] || []).filter(id => id !== current.id);
  });
  saveLikes(likes);

  setCurrentUser(null);
  return true;
}


function initAuth() {

  const current = getCurrentUser();
  if (current) {
    const users = getUsers();
    const exists = users.find(u => u.id === current.id);
    if (!exists) {
      setCurrentUser(null);
    }
  }
}
