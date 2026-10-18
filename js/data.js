const DEFAULT_AVATAR = "images/default-avatar.jpg";

function getAvatarUrl(url) {
  if (url && String(url).trim()) return String(url).trim();
  return DEFAULT_AVATAR;
}
function avatarImgAttrs(url, alt, className) {
  const src = getAvatarUrl(url);
  const safeAlt = (alt || "Avatar").replace(/"/g, "&quot;");
  const cls = className ? ` class="${className}"` : "";
  const onerr = ` onerror="this.onerror=null;this.src=DEFAULT_AVATAR"`;
  return `src="${src}" alt="${safeAlt}"${cls}${onerr}`;
}
const SUBJECTS = [
  { id: 'math', name: 'Toán', icon: 'fas fa-calculator', description: 'Đại số, Giải tích, Hình học' },
  { id: 'physics', name: 'Vật lý', icon: 'fas fa-atom', description: 'Cơ học, Điện từ, Quang học' },
  { id: 'chemistry', name: 'Hóa học', icon: 'fas fa-flask', description: 'Hữu cơ, Vô cơ, Hóa lý' },
  { id: 'biology', name: 'Sinh học', icon: 'fas fa-dna', description: 'Tế bào, Di truyền, Sinh thái' },
  { id: 'informatics', name: 'Tin học', icon: 'fas fa-laptop-code', description: 'Máy tính, Mạng, Hệ thống' },
  { id: 'programming', name: 'Lập trình', icon: 'fas fa-code', description: 'Python, JavaScript, C++' },
  { id: 'english', name: 'Tiếng Anh', icon: 'fas fa-language', description: 'Giao tiếp, IELTS, TOEIC' },
  { id: 'vietnamese', name: 'Tiếng Việt', icon: 'fas fa-book', description: 'Ngữ pháp, Văn bản' },
  { id: 'history', name: 'Lịch sử', icon: 'fas fa-landmark', description: 'Lịch sử Việt Nam & Thế giới' },
  { id: 'geography', name: 'Địa lý', icon: 'fas fa-globe-asia', description: 'Địa lý tự nhiên & Kinh tế' },
  { id: 'literature', name: 'Ngữ văn', icon: 'fas fa-feather-alt', description: 'Văn học, Phân tích tác phẩm' },
  { id: 'economics', name: 'Kinh tế', icon: 'fas fa-chart-line', description: 'Kinh tế vi mô, vĩ mô' },
  { id: 'business', name: 'Kinh doanh', icon: 'fas fa-briefcase', description: 'Marketing, Quản trị' },
  { id: 'design', name: 'Thiết kế', icon: 'fas fa-palette', description: 'UI/UX, Đồ họa' },
  { id: 'art', name: 'Nghệ thuật', icon: 'fas fa-paint-brush', description: 'Hội họa, Điêu khắc' },
  { id: 'music', name: 'Âm nhạc', icon: 'fas fa-music', description: 'Lý thuyết, Nhạc cụ' },
  { id: 'foreign', name: 'Ngoại ngữ', icon: 'fas fa-globe', description: 'Tiếng Nhật, Hàn, Trung...' },
  { id: 'other', name: 'Khác', icon: 'fas fa-ellipsis-h', description: 'Môn học khác' }
];


const LEARNING_GOALS = [
  { id: 'exam', name: 'Chuẩn bị cho kỳ thi', icon: 'fas fa-graduation-cap' },
  { id: 'homework', name: 'Làm bài tập', icon: 'fas fa-tasks' },
  { id: 'skill', name: 'Học kỹ năng mới', icon: 'fas fa-lightbulb' },
  { id: 'practice', name: 'Cùng luyện tập', icon: 'fas fa-dumbbell' },
  { id: 'teach', name: 'Dạy người khác', icon: 'fas fa-chalkboard-teacher' },
  { id: 'friend', name: 'Tìm bạn học', icon: 'fas fa-user-friends' },
  { id: 'group', name: 'Học nhóm', icon: 'fas fa-users' }
];


const LEARNING_STYLES = [
  { id: 'visual', name: 'Hình ảnh', icon: 'fas fa-eye' },
  { id: 'reading', name: 'Đọc/Viết', icon: 'fas fa-book-open' },
  { id: 'practice', name: 'Thực hành', icon: 'fas fa-hands' },
  { id: 'discussion', name: 'Thảo luận', icon: 'fas fa-comments' },
  { id: 'problem', name: 'Giải bài tập', icon: 'fas fa-puzzle-piece' }
];


const STUDY_METHODS = [
  { id: 'online', name: 'Online', icon: 'fas fa-video' },
  { id: 'offline', name: 'Trực tiếp', icon: 'fas fa-map-marker-alt' },
  { id: 'both', name: 'Cả hai', icon: 'fas fa-exchange-alt' }
];


const AVAILABILITY = [
  { id: 'morning', name: 'Buổi sáng', icon: 'fas fa-sun' },
  { id: 'afternoon', name: 'Buổi chiều', icon: 'fas fa-cloud-sun' },
  { id: 'evening', name: 'Buổi tối', icon: 'fas fa-moon' },
  { id: 'night', name: 'Ban đêm', icon: 'fas fa-star' },
  { id: 'weekend', name: 'Cuối tuần', icon: 'fas fa-calendar-week' }
];


const DURATIONS = [
  { id: '30min', name: '30 phút' },
  { id: '1hour', name: '1 giờ' },
  { id: '2hours', name: '2 giờ' },
  { id: '3plus', name: '3+ giờ' }
];

const LEVELS = [
  { id: 'beginner', name: 'Người mới' },
  { id: 'intermediate', name: 'Trung cấp' },
  { id: 'advanced', name: 'Nâng cao' }
];


function generateDemoUsers() {
  return [
    {
      id: 'demo_alex',
      name: 'Alex Nguyễn',
      username: 'alexnguyen',
      email: 'alex@studymatch.demo',
      password: 'demo123', 
      age: 20,
      school: 'Đại học Bách Khoa Hà Nội',
      avatar: 'https://i.pravatar.cc/300?u=alex',
      subjects: ['math', 'physics', 'programming'],
      learningStyle: 'problem',
      studyMethod: 'both',
      availability: ['evening', 'weekend'],
      duration: '2hours',
      level: 'intermediate',
      goals: ['exam', 'practice'],
      bio: 'Mình thích giải bài tập Toán và Vật lý. Đang chuẩn bị cho kỳ thi giữa kỳ. Rảnh buổi tối và cuối tuần!',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_emma',
      name: 'Emma Trần',
      username: 'emmatran',
      email: 'emma@studymatch.demo',
      password: 'demo123',
      age: 19,
      school: 'Đại học Khoa học Tự nhiên',
      avatar: 'https://i.pravatar.cc/300?u=emma',
      subjects: ['math', 'chemistry', 'biology'],
      learningStyle: 'visual',
      studyMethod: 'online',
      availability: ['evening', 'afternoon'],
      duration: '1hour',
      level: 'intermediate',
      goals: ['homework', 'exam'],
      bio: 'Học bằng hình ảnh giúp mình nhớ lâu hơn. Thích làm bài tập nhóm online vào buổi tối.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_david',
      name: 'David Lê',
      username: 'davidle',
      email: 'david@studymatch.demo',
      password: 'demo123',
      age: 21,
      school: 'Đại học Công nghệ Thông tin',
      avatar: 'https://i.pravatar.cc/300?u=david',
      subjects: ['programming', 'math', 'informatics'],
      learningStyle: 'practice',
      studyMethod: 'both',
      availability: ['weekend', 'night'],
      duration: '3plus',
      level: 'advanced',
      goals: ['skill', 'practice'],
      bio: 'Đam mê lập trình và giải thuật. Thường code xuyên đêm và cuối tuần. Sẵn sàng chia sẻ kiến thức!',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_sophia',
      name: 'Sophia Phạm',
      username: 'sophiapham',
      email: 'sophia@studymatch.demo',
      password: 'demo123',
      age: 18,
      school: 'Đại học Sư phạm Hà Nội',
      avatar: 'https://i.pravatar.cc/300?u=sophia',
      subjects: ['english', 'literature', 'history'],
      learningStyle: 'discussion',
      studyMethod: 'offline',
      availability: ['afternoon', 'weekend'],
      duration: '1hour',
      level: 'intermediate',
      goals: ['friend', 'group'],
      bio: 'Thích thảo luận về văn học và lịch sử. Muốn tìm bạn học để cùng ôn thi IELTS và Văn.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_minh',
      name: 'Minh Hoàng',
      username: 'minhhoang',
      email: 'minh@studymatch.demo',
      password: 'demo123',
      age: 22,
      school: 'Đại học Kinh tế Quốc dân',
      avatar: 'https://i.pravatar.cc/300?u=minh',
      subjects: ['economics', 'business', 'math'],
      learningStyle: 'reading',
      studyMethod: 'online',
      availability: ['morning', 'evening'],
      duration: '2hours',
      level: 'advanced',
      goals: ['exam', 'skill'],
      bio: 'Sinh viên năm cuối Kinh tế. Thích đọc sách và phân tích case study. Rảnh sáng sớm và tối.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_linh',
      name: 'Linh Vũ',
      username: 'linhvu',
      email: 'linh@studymatch.demo',
      password: 'demo123',
      age: 20,
      school: 'Đại học Mỹ thuật Công nghiệp',
      avatar: 'https://i.pravatar.cc/300?u=linh',
      subjects: ['design', 'art', 'programming'],
      learningStyle: 'visual',
      studyMethod: 'both',
      availability: ['afternoon', 'evening'],
      duration: '2hours',
      level: 'intermediate',
      goals: ['skill', 'practice'],
      bio: 'UI/UX designer đang học thêm frontend. Thích làm project thực tế và chia sẻ portfolio.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_khoa',
      name: 'Khoa Đặng',
      username: 'khoadang',
      email: 'khoa@studymatch.demo',
      password: 'demo123',
      age: 19,
      school: 'Đại học Ngoại thương',
      avatar: 'https://i.pravatar.cc/300?u=khoa',
      subjects: ['english', 'business', 'economics'],
      learningStyle: 'discussion',
      studyMethod: 'offline',
      availability: ['evening', 'weekend'],
      duration: '1hour',
      level: 'beginner',
      goals: ['friend', 'exam'],
      bio: 'Muốn cải thiện tiếng Anh giao tiếp và tìm hiểu về kinh doanh. Thích học nhóm trực tiếp.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_huyen',
      name: 'Huyền Ngô',
      username: 'huyenngo',
      email: 'huyen@studymatch.demo',
      password: 'demo123',
      age: 21,
      school: 'Đại học Y Hà Nội',
      avatar: 'https://i.pravatar.cc/300?u=huyen',
      subjects: ['biology', 'chemistry', 'math'],
      learningStyle: 'problem',
      studyMethod: 'online',
      availability: ['night', 'weekend'],
      duration: '3plus',
      level: 'advanced',
      goals: ['exam', 'homework'],
      bio: 'Sinh viên Y khoa. Thường ôn bài ban đêm. Cần bạn cùng giải bài tập Sinh và Hóa.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_an',
      name: 'An Bùi',
      username: 'anbui',
      email: 'an@studymatch.demo',
      password: 'demo123',
      age: 20,
      school: 'Đại học Ngoại ngữ - ĐHQGHN',
      avatar: 'https://i.pravatar.cc/300?u=anbui',
      subjects: ['english', 'foreign', 'literature'],
      learningStyle: 'discussion',
      studyMethod: 'both',
      availability: ['morning', 'evening'],
      duration: '1hour',
      level: 'intermediate',
      goals: ['skill', 'exam'],
      bio: 'Học tiếng Anh và tiếng Nhật. Thích luyện speaking và đọc sách ngoại ngữ vào buổi sáng.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_tuan',
      name: 'Tuấn Phạm',
      username: 'tuanpham',
      email: 'tuan@studymatch.demo',
      password: 'demo123',
      age: 19,
      school: 'Đại học Sư phạm TP.HCM',
      avatar: 'https://i.pravatar.cc/300?u=tuanpham',
      subjects: ['history', 'geography', 'literature'],
      learningStyle: 'reading',
      studyMethod: 'offline',
      availability: ['afternoon', 'weekend'],
      duration: '2hours',
      level: 'intermediate',
      goals: ['exam', 'group'],
      bio: 'Đam mê Lịch sử và Địa lý. Hay tóm tắt bài và vẽ sơ đồ tư duy. Rảnh chiều và cuối tuần.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_mai',
      name: 'Mai Nguyễn',
      username: 'mainguyen',
      email: 'mai@studymatch.demo',
      password: 'demo123',
      age: 18,
      school: 'Đại học Văn hóa Hà Nội',
      avatar: 'https://i.pravatar.cc/300?u=mainguyen',
      subjects: ['music', 'art', 'english'],
      learningStyle: 'visual',
      studyMethod: 'both',
      availability: ['evening', 'weekend'],
      duration: '1hour',
      level: 'beginner',
      goals: ['skill', 'friend'],
      bio: 'Học nhạc lý và piano. Muốn tìm bạn cùng luyện nghe nhạc tiếng Anh và vẽ minh họa.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_hung',
      name: 'Hùng Trần',
      username: 'hungtran',
      email: 'hung@studymatch.demo',
      password: 'demo123',
      age: 22,
      school: 'Đại học Bách Khoa TP.HCM',
      avatar: 'https://i.pravatar.cc/300?u=hungtran',
      subjects: ['physics', 'math', 'informatics'],
      learningStyle: 'problem',
      studyMethod: 'online',
      availability: ['night', 'weekend'],
      duration: '3plus',
      level: 'advanced',
      goals: ['exam', 'practice'],
      bio: 'Sinh viên Cơ điện tử. Thích giải bài Vật lý khó và lập trình nhúng. Học khuya là chính.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_thao',
      name: 'Thảo Lê',
      username: 'thaole',
      email: 'thao@studymatch.demo',
      password: 'demo123',
      age: 20,
      school: 'Đại học Kinh tế TP.HCM',
      avatar: 'https://i.pravatar.cc/300?u=thaole',
      subjects: ['business', 'economics', 'english'],
      learningStyle: 'discussion',
      studyMethod: 'offline',
      availability: ['morning', 'afternoon'],
      duration: '2hours',
      level: 'intermediate',
      goals: ['exam', 'group'],
      bio: 'Học Marketing và Kinh tế. Thích case study nhóm và thảo luận tiếng Anh thương mại.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_nam',
      name: 'Nam Võ',
      username: 'namvo',
      email: 'nam@studymatch.demo',
      password: 'demo123',
      age: 21,
      school: 'Đại học FPT',
      avatar: 'https://i.pravatar.cc/300?u=namvo',
      subjects: ['programming', 'informatics', 'english'],
      learningStyle: 'practice',
      studyMethod: 'both',
      availability: ['evening', 'night'],
      duration: '3plus',
      level: 'advanced',
      goals: ['skill', 'practice'],
      bio: 'Full-stack developer. Thích pair programming và luyện LeetCode. Rảnh tối và đêm.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_ha',
      name: 'Hà Đỗ',
      username: 'hado',
      email: 'ha@studymatch.demo',
      password: 'demo123',
      age: 19,
      school: 'Đại học Khoa học Xã hội & Nhân văn',
      avatar: 'https://i.pravatar.cc/300?u=hado',
      subjects: ['vietnamese', 'literature', 'history'],
      learningStyle: 'reading',
      studyMethod: 'online',
      availability: ['afternoon', 'evening'],
      duration: '1hour',
      level: 'intermediate',
      goals: ['homework', 'exam'],
      bio: 'Chuyên Ngữ văn và Tiếng Việt. Hay phân tích tác phẩm và viết luận. Học online buổi chiều tối.',
      likes: [],
      matches: [],
      isDemo: true
    },
    {
      id: 'demo_phuc',
      name: 'Phúc Hoàng',
      username: 'phuchoang',
      email: 'phuc@studymatch.demo',
      password: 'demo123',
      age: 20,
      school: 'Đại học Công nghiệp Hà Nội',
      avatar: 'https://i.pravatar.cc/300?u=phuchoang',
      subjects: ['chemistry', 'math', 'physics'],
      learningStyle: 'visual',
      studyMethod: 'both',
      availability: ['morning', 'weekend'],
      duration: '2hours',
      level: 'beginner',
      goals: ['homework', 'friend'],
      bio: 'Học Hóa và Toán cơ bản. Thích dùng video và sơ đồ. Muốn tìm bạn học nhóm cuối tuần.',
      likes: [],
      matches: [],
      isDemo: true
    }
  ];
}

function initializeData() {
  const demoUsers = generateDemoUsers();
  const existingRaw = localStorage.getItem('studyMatchUsers');

  if (!existingRaw) {
    localStorage.setItem('studyMatchUsers', JSON.stringify(demoUsers));
  } else {

    try {
      const existing = JSON.parse(existingRaw);
      const existingIds = new Set(existing.map(u => u.id));
      let changed = false;
      demoUsers.forEach(demo => {
        if (!existingIds.has(demo.id)) {
          existing.push(demo);
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('studyMatchUsers', JSON.stringify(existing));
      }
    } catch {
      localStorage.setItem('studyMatchUsers', JSON.stringify(demoUsers));
    }
  }

  if (!localStorage.getItem('studyMatchMatches')) {
    localStorage.setItem('studyMatchMatches', JSON.stringify([]));
  }

  if (!localStorage.getItem('studyMatchMessages')) {
    localStorage.setItem('studyMatchMessages', JSON.stringify({}));
  }

  if (!localStorage.getItem('studyMatchLikes')) {
    localStorage.setItem('studyMatchLikes', JSON.stringify({}));
  }
}

function getUsers() {
  const users = localStorage.getItem('studyMatchUsers');
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem('studyMatchUsers', JSON.stringify(users));
}

function getCurrentUser() {
  const current = localStorage.getItem('studyMatchCurrentUser');
  if (!current) return null;
  try {
    return JSON.parse(current);
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem('studyMatchCurrentUser', JSON.stringify(sessionUser));
  } else {
    localStorage.removeItem('studyMatchCurrentUser');
  }
}

function getMatches() {
  const matches = localStorage.getItem('studyMatchMatches');
  return matches ? JSON.parse(matches) : [];
}

function saveMatches(matches) {
  localStorage.setItem('studyMatchMatches', JSON.stringify(matches));
}

function getLikes() {
  const likes = localStorage.getItem('studyMatchLikes');
  return likes ? JSON.parse(likes) : {};
}

function saveLikes(likes) {
  localStorage.setItem('studyMatchLikes', JSON.stringify(likes));
}

function getMessages() {
  const messages = localStorage.getItem('studyMatchMessages');
  return messages ? JSON.parse(messages) : {};
}

function saveMessages(messages) {
  localStorage.setItem('studyMatchMessages', JSON.stringify(messages));
}

function getSubjectById(id) {
  return SUBJECTS.find(s => s.id === id);
}

function getSubjectNames(ids) {
  return (ids || []).map(id => {
    const s = getSubjectById(id);
    return s ? s.name : id;
  });
}

initializeData();
