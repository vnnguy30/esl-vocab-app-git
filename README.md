# ESL Vocab App - Hướng dẫn chạy project

Đây là project khởi đầu để bạn học web dev: Frontend (HTML/CSS/JS) + Backend (Node.js/Express) + Database (SQLite).

## Cấu trúc thư mục

```
esl-vocab-app/
├── backend/
│   ├── server.js       # API server chính
│   ├── db.js           # Kết nối & tạo database SQLite
│   └── package.json    # Danh sách thư viện cần cài
├── frontend/
│   ├── index.html       # Giao diện chính
│   ├── style.css        # Styling
│   └── script.js        # Logic gọi API, thêm/xóa từ, quiz
└── README.md
```

## Cách chạy (Backend)

1. Mở terminal, vào thư mục backend:
   ```
   cd esl-vocab-app/backend
   ```
2. Cài thư viện:
   ```
   npm install
   ```
3. Chạy server:
   ```
   npm start
   ```
   Server sẽ chạy ở `http://localhost:3001`. Database `vocab.db` sẽ tự động được tạo.

## Cách chạy (Frontend)

Cách đơn giản nhất: mở file `frontend/index.html` trực tiếp bằng trình duyệt (double-click hoặc kéo vào Chrome).

Hoặc nếu muốn chạy qua local server (khuyến khích để tránh lỗi CORS trên một số trình duyệt):
```
cd esl-vocab-app/frontend
npx serve .
```

**Lưu ý:** Backend phải đang chạy (bước trên) thì frontend mới lấy được dữ liệu.

## Các API endpoints có sẵn

| Method | Endpoint          | Mô tả                          |
|--------|-------------------|---------------------------------|
| GET    | /api/words        | Lấy tất cả từ vựng             |
| GET    | /api/words/:id     | Lấy 1 từ theo id               |
| POST   | /api/words        | Thêm từ mới                    |
| PUT    | /api/words/:id     | Sửa từ                         |
| DELETE | /api/words/:id     | Xóa từ                         |
| GET    | /api/decks        | Lấy danh sách các chủ đề (deck) |

## Bước tiếp theo để học thêm

1. **Thêm đăng nhập (auth):** dùng `express-session` hoặc JWT để mỗi người dùng có danh sách từ riêng
2. **Thêm phát âm:** dùng Web Speech API (`speechSynthesis`) để đọc từ tiếng Anh
3. **Deploy lên internet:** backend lên Render/Railway, frontend lên Vercel/Netlify
4. **Chuyển frontend sang React:** khi đã quen với JS thuần, thử viết lại bằng React để học component-based thinking

## Nếu gặp lỗi

- **"Cannot find module 'better-sqlite3'"** → chạy lại `npm install` trong thư mục backend
- **Frontend không load được từ** → kiểm tra backend đã chạy chưa, và mở Console (F12) trong trình duyệt để xem lỗi
- **CORS error** → đảm bảo backend có `app.use(cors())` (đã có sẵn trong server.js)
