
/**
 * Calculate match percentage between two users
 * @param {Object} userA - Current user profile
 * @param {Object} userB - Potential match profile
 * @returns {number} - Integer percentage 0-100
 */
function calculateMatchPercentage(userA, userB) {
  if (!userA || !userB) return 0;

  
  const subjectsA = userA.subjects || [];
  const subjectsB = userB.subjects || [];
  let subjectScore = 0;
  if (subjectsA.length > 0 && subjectsB.length > 0) {
    const shared = subjectsA.filter(s => subjectsB.includes(s));
    
    const relevant = Math.min(subjectsA.length, subjectsB.length);
    subjectScore = shared.length / relevant;
  }

  
  let styleScore = 0;
  if (userA.learningStyle && userB.learningStyle) {
    styleScore = userA.learningStyle === userB.learningStyle ? 1 : 0.3;
  }

  
  const goalsA = userA.goals || [];
  const goalsB = userB.goals || [];
  let goalScore = 0;
  if (goalsA.length > 0 && goalsB.length > 0) {
    const sharedGoals = goalsA.filter(g => goalsB.includes(g));
    goalScore = sharedGoals.length / Math.max(goalsA.length, goalsB.length);
  }

 
  const availA = userA.availability || [];
  const availB = userB.availability || [];
  let availScore = 0;
  if (availA.length > 0 && availB.length > 0) {
    const sharedAvail = availA.filter(a => availB.includes(a));
    availScore = sharedAvail.length / Math.max(availA.length, availB.length);
  }

  
  let methodScore = 0;
  if (userA.studyMethod && userB.studyMethod) {
    if (userA.studyMethod === userB.studyMethod) {
      methodScore = 1;
    } else if (userA.studyMethod === 'both' || userB.studyMethod === 'both') {
      methodScore = 0.7;
    } else {
      methodScore = 0.2;
    }
  }

  let levelScore = 0;
  if (userA.level && userB.level) {
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const diff = Math.abs((levels[userA.level] || 2) - (levels[userB.level] || 2));
    levelScore = diff === 0 ? 1 : diff === 1 ? 0.6 : 0.2;
  }

  const percentage =
    subjectScore * 40 +
    styleScore * 15 +
    goalScore * 15 +
    availScore * 15 +
    methodScore * 10 +
    levelScore * 5;

  return Math.round(Math.min(100, Math.max(0, percentage)));
}

/**
 * Get match quality label
 * @param {number} percentage
 * @returns {string}
 */
function getMatchLabel(percentage) {
  if (percentage >= 90) return 'Cực kỳ tương thích';
  if (percentage >= 80) return 'Rất tương thích';
  if (percentage >= 65) return 'Tương thích tốt';
  if (percentage >= 50) return 'Có thể phù hợp';
  return 'Tương thích thấp';
}

function getSharedSubjects(userA, userB) {
  const subjectsA = userA.subjects || [];
  const subjectsB = userB.subjects || [];
  return subjectsA.filter(s => subjectsB.includes(s));
}

function getSharedAvailability(userA, userB) {
  const availA = userA.availability || [];
  const availB = userB.availability || [];
  return availA.filter(a => availB.includes(a));
}

/**
 * Get all potential matches sorted by compatibility
 * @param {Object} currentUser
 * @param {Object} filters - Optional filters
 * @returns {Array} - Array of { user, percentage, sharedSubjects, sharedAvail }
 */
function getRecommendations(currentUser, filters = {}) {
  if (!currentUser) return [];

  const users = getUsers();
  const likes = getLikes();
  const myLikes = likes[currentUser.id] || [];
  const matches = getMatches();

 
  const matchedIds = matches
    .filter(m => m.user1Id === currentUser.id || m.user2Id === currentUser.id)
    .map(m => (m.user1Id === currentUser.id ? m.user2Id : m.user1Id));

  let candidates = users.filter(u => {
  
    if (u.id === currentUser.id) return false;

    if (matchedIds.includes(u.id)) return false;

    if (myLikes.includes(u.id)) return false;

    if (!u.subjects || u.subjects.length === 0) return false;
    return true;
  });


  if (filters.subject) {
    candidates = candidates.filter(u => (u.subjects || []).includes(filters.subject));
  }
  if (filters.minPercentage) {
    // tính xong mơi dùng tới <3
  }
  if (filters.learningStyle) {
    candidates = candidates.filter(u => u.learningStyle === filters.learningStyle);
  }
  if (filters.availability) {
    candidates = candidates.filter(u => (u.availability || []).includes(filters.availability));
  }
  if (filters.studyMethod) {
    candidates = candidates.filter(u => {
      if (filters.studyMethod === 'both') return true;
      return u.studyMethod === filters.studyMethod || u.studyMethod === 'both';
    });
  }

  let results = candidates.map(u => {
    const percentage = calculateMatchPercentage(currentUser, u);
    return {
      user: u,
      percentage,
      sharedSubjects: getSharedSubjects(currentUser, u),
      sharedAvail: getSharedAvailability(currentUser, u),
      alreadyLiked: myLikes.includes(u.id)
    };
  });

  if (filters.minPercentage) {
    results = results.filter(r => r.percentage >= filters.minPercentage);
  }

  results.sort((a, b) => b.percentage - a.percentage);

  return results;
}

/**
 * Like a user
 * @param {string} fromUserId
 * @param {string} toUserId
 * @param {Object} options - { isSuper: boolean }
 * @returns {Object} - { matched: boolean, match?: Object }
 *
 * Demo behavior: demo users auto-like back when compatibility is high
 * or when Super Match is used, so the match flow is demoable without
 * logging in as two accounts.
 */
function likeUser(fromUserId, toUserId, options = {}) {
  const likes = getLikes();
  const users = getUsers();
  const isSuper = !!options.isSuper;

  if (!likes[fromUserId]) {
    likes[fromUserId] = [];
  }


  if (likes[fromUserId].includes(toUserId)) {

    const theirLikes = likes[toUserId] || [];
    if (theirLikes.includes(fromUserId)) {
      const match = createMatch(fromUserId, toUserId);
      return { matched: !!match, match };
    }
    return { matched: false };
  }

  likes[fromUserId].push(toUserId);

  const targetUser = users.find(u => u.id === toUserId);
  const fromUser = users.find(u => u.id === fromUserId);
  const percentage = fromUser && targetUser
    ? calculateMatchPercentage(fromUser, targetUser)
    : 0;

  const shouldAutoMatch =
    targetUser &&
    targetUser.isDemo &&
    (isSuper || percentage >= 55);

  if (shouldAutoMatch) {
    if (!likes[toUserId]) {
      likes[toUserId] = [];
    }
    if (!likes[toUserId].includes(fromUserId)) {
      likes[toUserId].push(fromUserId);
    }
  }

  saveLikes(likes);


  const theirLikes = likes[toUserId] || [];
  if (theirLikes.includes(fromUserId)) {
    const match = createMatch(fromUserId, toUserId);
    return { matched: !!match, match };
  }

  return { matched: false };
}

function passUser(fromUserId, toUserId) {

  return true;
}

function createMatch(user1Id, user2Id) {
  const matches = getMatches();
  const users = getUsers();


  const exists = matches.some(
    m =>
      (m.user1Id === user1Id && m.user2Id === user2Id) ||
      (m.user1Id === user2Id && m.user2Id === user1Id)
  );
  if (exists) return null;

  const user1 = users.find(u => u.id === user1Id);
  const user2 = users.find(u => u.id === user2Id);
  if (!user1 || !user2) return null;

  const percentage = calculateMatchPercentage(user1, user2);
  const shared = getSharedSubjects(user1, user2);

  const match = {
    id: 'match_' + Date.now(),
    user1Id,
    user2Id,
    percentage,
    sharedSubjects: shared,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  };

  matches.push(match);
  saveMatches(matches);


  if (!user1.matches) user1.matches = [];
  if (!user2.matches) user2.matches = [];
  user1.matches.push(match.id);
  user2.matches.push(match.id);
  saveUsers(users);

  return match;
}

function getUserMatches(userId) {
  const matches = getMatches();
  const users = getUsers();

  return matches
    .filter(m => m.user1Id === userId || m.user2Id === userId)
    .map(m => {
      const otherId = m.user1Id === userId ? m.user2Id : m.user1Id;
      const otherUser = users.find(u => u.id === otherId);
      return {
        ...m,
        otherUser,
        sharedSubjectNames: getSubjectNames(m.sharedSubjects || [])
      };
    })
    .filter(m => m.otherUser)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function deleteMatch(matchId) {
  let matches = getMatches();
  const match = matches.find(m => m.id === matchId);
  if (!match) return false;

  matches = matches.filter(m => m.id !== matchId);
  saveMatches(matches);


  const users = getUsers();
  users.forEach(u => {
    if (u.matches) {
      u.matches = u.matches.filter(id => id !== matchId);
    }
  });
  saveUsers(users);

  return true;
}

function explainMatch(userA, userB) {
  const percentage = calculateMatchPercentage(userA, userB);
  const shared = getSharedSubjects(userA, userB);
  const sharedNames = getSubjectNames(shared);
  const sharedAvail = getSharedAvailability(userA, userB);
  const availNames = sharedAvail.map(a => {
    const found = AVAILABILITY.find(av => av.id === a);
    return found ? found.name : a;
  });

  let reasons = [];

  if (shared.length > 0) {
    reasons.push(`Các bạn cùng quan tâm đến ${sharedNames.join(', ')}`);
  }
  if (userA.learningStyle && userA.learningStyle === userB.learningStyle) {
    const style = LEARNING_STYLES.find(s => s.id === userA.learningStyle);
    reasons.push(`Cùng phong cách học: ${style ? style.name : userA.learningStyle}`);
  }
  if (sharedAvail.length > 0) {
    reasons.push(`Cùng rảnh vào: ${availNames.join(', ')}`);
  }
  if (userA.studyMethod && userB.studyMethod) {
    if (userA.studyMethod === userB.studyMethod || userA.studyMethod === 'both' || userB.studyMethod === 'both') {
      reasons.push('Phương thức học phù hợp với nhau');
    }
  }

  if (reasons.length === 0) {
    reasons.push('Hồ sơ của các bạn có điểm tương đồng về mục tiêu học tập');
  }

  return {
    percentage,
    label: getMatchLabel(percentage),
    reasons,
    summary: `Dựa trên hồ sơ, mức độ tương thích là ${percentage}%. ${reasons[0]}.`
  };
}

function getAISuggestions(user) {
  if (!user) return [];

  const suggestions = [];
  const subjects = getSubjectNames(user.subjects || []);
  const style = LEARNING_STYLES.find(s => s.id === user.learningStyle);
  const avail = (user.availability || []).map(a => {
    const found = AVAILABILITY.find(av => av.id === a);
    return found ? found.name : a;
  });


  if (style) {
    const methodTips = {
      visual: 'Hãy sử dụng sơ đồ tư duy, video và hình ảnh minh họa khi học.',
      reading: 'Đọc tài liệu kỹ và ghi chú lại những điểm quan trọng.',
      practice: 'Làm nhiều bài tập thực hành sẽ giúp bạn nắm vững kiến thức.',
      discussion: 'Thảo luận nhóm giúp bạn hiểu sâu hơn qua việc giải thích cho người khác.',
      problem: 'Tập trung giải các bài tập khó để nâng cao kỹ năng.'
    };
    suggestions.push({
      type: 'method',
      icon: 'fas fa-lightbulb',
      title: 'Phương pháp học phù hợp',
      content: methodTips[user.learningStyle] || 'Hãy thử kết hợp nhiều phương pháp học khác nhau.'
    });
  }

  if (avail.length > 0) {
    suggestions.push({
      type: 'schedule',
      icon: 'fas fa-calendar-alt',
      title: 'Gợi ý lịch học',
      content: `Bạn thường rảnh vào ${avail.join(', ')}. Hãy đặt lịch học cố định vào những khung giờ này để duy trì thói quen.`
    });
  }


  if (subjects.length >= 2) {
    suggestions.push({
      type: 'subjects',
      icon: 'fas fa-book',
      title: 'Môn nên học cùng',
      content: `Với các môn ${subjects.slice(0, 3).join(', ')}, bạn nên tìm bạn học có chung ít nhất 2 môn để hiệu quả hơn.`
    });
  }


  suggestions.push({
    type: 'tip',
    icon: 'fas fa-star',
    title: 'Mẹo từ AI',
    content: 'Học nhóm 25-50 phút sau đó nghỉ 5-10 phút (Pomodoro) giúp tăng hiệu suất và giảm mệt mỏi.'
  });

  return suggestions;
}
