# StudyMatch

**Tìm đúng người để cùng học.**

StudyMatch là nền tảng web frontend giúp học sinh và sinh viên tìm bạn học phù hợp dựa trên môn học, phong cách học, thời gian rảnh và mục tiêu. Lấy cảm hứng từ cơ chế swipe/matching hiện đại, nhưng được thiết kế riêng cho cộng đồng học tập.

> Đây là dự án frontend phục vụ học tập / thuyết trình. Không phải sản phẩm thương mại.

---

## Tính năng chính

- **Đăng ký / Đăng nhập** với localStorage (mô phỏng auth)
- **Tự động duy trì phiên** đăng nhập
- **Chọn môn học** & mục tiêu học tập (multi-select cards)
- **Thiết lập sở thích**: phong cách học, phương thức, thời gian rảnh, thời lượng, trình độ
- **Trang Discover** kiểu swipe với Like / Pass / Super Match
- **Thuật toán % tương thích động** (không random)
- **Recommendation** sắp xếp theo % match + bộ lọc
- **Mutual Match** khi hai bên cùng Like
- **Trang Matches** & **Chat** (lưu tin nhắn localStorage)
- **Hồ sơ cá nhân** + chỉnh sửa (CRUD đầy đủ)
- **AI Study Assistant** (rule-based, sẵn sàng gắn API thật)
- **Quote API** bên ngoài (Quotable) + fallback
- **Responsive** hoàn toàn (mobile → desktop)
- **Animation** nhẹ, accessibility cơ bản

---

## Công nghệ

| Công nghệ | Mục đích |
|-----------|----------|
| HTML5 | Semantic markup |
| CSS3 | Grid, Flexbox, Custom Properties, Animations |
| JavaScript (Vanilla) | Logic, localStorage, Fetch API |
| Font Awesome 6 | Icons |
| Google Fonts (Inter) | Typography |
| Quotable API | Câu quote tạo động lực |

**Không dùng** backend, database, framework JS, hay thư viện gesture.

---

## Cấu trúc thư mục

```
/
├── index.html          # Landing page
├── login.html
├── register.html
├── subjects.html       # Chọn môn học
├── settings.html       # Sở thích học tập
├── discover.html       # Swipe / Recommendation
├── matches.html
├── chat.html
├── profile.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── data.js         # Demo data, subjects, localStorage helpers
│   ├── auth.js         # Register, login, session
│   ├── matching.js     # Match algorithm, recommendations, AI
│   ├── discover.js
│   ├── profile.js
│   ├── chat.js
│   └── app.js          # Header/footer, quote API, toast, modal
├── images/
└── README.md
```

---

## Cách chạy

1. Clone hoặc tải project về.
2. Mở `index.html` bằng trình duyệt (hoặc dùng Live Server / bất kỳ static server nào).
3. Không cần cài đặt package hay build step.

```bash
# Ví dụ với Python
python -m http.server 8080
# Sau đó mở http://localhost:8080
```

---

## Authentication (localStorage)

| Key | Mô tả |
|-----|--------|
| `studyMatchUsers` | Mảng tất cả user |
| `studyMatchCurrentUser` | User đang đăng nhập (không chứa password) |
| `studyMatchMatches` | Danh sách mutual matches |
| `studyMatchLikes` | Object `{ userId: [likedUserIds] }` |
| `studyMatchMessages` | Object `{ chatKey: [messages] }` |

**Lưu ý bảo mật (quan trọng):**  
localStorage chỉ dùng để **mô phỏng**. Ứng dụng thật cần:
- Backend + database
- Hash password (bcrypt/argon2)
- Session/token bảo mật (HTTP-only cookie hoặc JWT)
- HTTPS

---

## Thuật toán Match

```
matchPercentage =
  (subjectScore  * 40) +
  (styleScore    * 15) +
  (goalScore     * 15) +
  (availScore    * 15) +
  (methodScore   * 10) +
  (levelScore    *  5)
```

- **Môn chung**: số môn giao / min(số môn 2 người)
- **Phong cách / Mục tiêu / Thời gian**: so khớp
- **Phương thức**: exact = 1, có “Cả hai” = 0.7
- **Trình độ**: cùng level = 1, lệch 1 bậc = 0.6

Kết quả làm tròn thành số nguyên 0–100.

---

## API bên ngoài

- **Quotable API** (`https://api.quotable.io/random`)  
  Lấy câu quote giáo dục / động lực.  
  Có loading state, error handling và fallback quote khi API lỗi.

---

## Tính năng AI

**AI Study Assistant** (trên trang Profile):
- Gợi ý phương pháp học theo phong cách
- Gợi ý lịch học theo thời gian rảnh
- Gợi ý môn nên học cùng
- Mẹo Pomodoro

Hiện dùng rule-based responses. Code được thiết kế để sau này dễ thay bằng API AI thật (OpenAI, Gemini…).

---

## CRUD

| Thao tác | Đối tượng |
|----------|-----------|
| **Create** | Tài khoản, profile, likes, matches, tin nhắn |
| **Read** | Profile, recommendations, matches, chat |
| **Update** | Profile, môn học, sở thích, bio, avatar |
| **Delete** | Tài khoản, match, tin nhắn (có thể mở rộng) |

Mọi thay đổi ghi ngay vào localStorage.

---

## Demo accounts

| Email | Password | Môn chính |
|-------|----------|-----------|
| alex@studymatch.demo | demo123 | Toán, Vật lý, Lập trình |
| emma@studymatch.demo | demo123 | Toán, Hóa, Sinh |
| david@studymatch.demo | demo123 | Lập trình, Toán, Tin |
| sophia@studymatch.demo | demo123 | Anh, Văn, Sử |

Hoặc đăng ký tài khoản mới → chọn môn → thiết lập sở thích → Discover.

---

## Luồng demo thuyết trình

1. **Trang chủ** → Đăng ký tài khoản mới  
2. **Chọn môn học** + mục tiêu  
3. **Sở thích học tập**  
4. **Discover** → xem % match, Like vài người  
5. (Tùy chọn) Đăng nhập tài khoản demo khác và Like lại để tạo **Mutual Match**  
6. **Matches** → **Chat**  
7. **Profile** → chỉnh sửa + xem AI Assistant  
8. **Logout** → mở lại web → tự động đăng nhập (nếu còn session)

---

## Responsive

Đã kiểm tra các breakpoint:
- 320px / 375px (mobile)
- 768px (tablet)
- 1024px (laptop)
- 1440px+ (desktop)

Hamburger menu, card stack, form 1 cột, chat full-width trên mobile.

---

## Hướng phát triển tương lai

- Backend (Node/Express hoặc Firebase) + auth thật
- Real-time chat (WebSocket / Firestore)
- Push notification
- Upload avatar thật
- AI API thật cho gợi ý & giải thích match
- Dark mode
- PWA / mobile app

---

## License

Dự án học tập — tự do sử dụng cho mục đích giáo dục và thuyết trình.
