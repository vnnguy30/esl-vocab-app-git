## English

This is a starter project for learning web dev: Frontend (HTML/CSS/JS) + Backend (Node.js/Express) + Database (SQLite).

### Folder structure

```
esl-vocab-app/
├── backend/
│   ├── server.js       # Main API server
│   ├── db.js           # SQLite database connection & setup
│   └── package.json    # Dependency list
├── frontend/
│   ├── index.html       # Main UI
│   ├── style.css        # Styling
│   ├── script.js        # API calls, add/delete words, quiz logic
│   ├── i18n.js           # Bilingual UI language switching
│   └── i18n/
│       ├── vi.json       # Vietnamese UI text strings
│       └── en.json       # English UI text strings
└── README.md
```

### Bilingual UI

The interface automatically shows the **opposite** language of what you're learning, so instructions are always in a language you already understand:

- Learning **English** → UI shows in **Vietnamese**
- Learning **Vietnamese** → UI shows in **English**

Pick your learning direction from the "I'm learning..." dropdown at the top of the page — this choice is remembered in your browser (localStorage).

### Running the backend

1. Open a terminal and go to the backend folder:
   ```
   cd esl-vocab-app/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   The server runs at `http://localhost:3001`. The `vocab.db` database file is created automatically.

### Running the frontend

**Note:** because the UI loads JSON files (to switch languages), you need to serve the frontend through a local server — double-clicking `index.html` to open it directly will **not** load the translations.

```
cd esl-vocab-app/frontend
npx serve .
```

The backend must already be running (step above) for the frontend to fetch data.

### Available API endpoints

| Method | Endpoint          | Description                     |
|--------|-------------------|----------------------------------|
| GET    | /api/words        | Get all vocabulary words         |
| GET    | /api/words/:id     | Get one word by id               |
| POST   | /api/words        | Add a new word                   |
| PUT    | /api/words/:id     | Update a word                    |
| DELETE | /api/words/:id     | Delete a word                    |
| GET    | /api/decks        | Get the list of topics (decks)   |

### Next steps to keep learning

1. **Cat mascot & mini-games:** two companion cats that animate on correct answers, plus relaxing mini-games (brushing, feeding, nail trimming)
2. **Flashcards with audio:** use the Web Speech API (`speechSynthesis`) to read English words aloud
3. **Study / Relax home screen:** two big options leading to studying or playing with the cats
4. **Add login (auth):** use AWS Cognito + DynamoDB so each user has their own word list
5. **Deploy to the internet:** backend to Render/Railway, frontend to Vercel/Netlify
6. **Rewrite the frontend in React:** once comfortable with vanilla JS, try rebuilding it in React to learn component-based thinking

### Troubleshooting

- **"Cannot find module 'better-sqlite3'"** → run `npm install` again inside the backend folder
- **Frontend can't load words** → check that the backend is running, and open the browser Console (F12) to see the error
- **CORS error** → make sure the backend has `app.use(cors())` (already included in server.js)
- **UI text doesn't switch language, or shows raw keys instead of text** → make sure you're running the frontend through a local server (`npx serve .`), not opening `index.html` directly



---

# ESL Vocab App

🇻🇳 [Tiếng Việt](#tiếng-việt) | 🇬🇧 [English](#english)

---

## Tiếng Việt

Đây là project khởi đầu để bạn học web dev: Frontend (HTML/CSS/JS) + Backend (Node.js/Express) + Database (SQLite).

### Cấu trúc thư mục

```
esl-vocab-app/
├── backend/
│   ├── server.js       # API server chính
│   ├── db.js           # Kết nối & tạo database SQLite
│   └── package.json    # Danh sách thư viện cần cài
├── frontend/
│   ├── index.html       # Giao diện chính
│   ├── style.css        # Styling
│   ├── script.js        # Logic gọi API, thêm/xóa từ, quiz
│   ├── i18n.js           # Chuyển đổi ngôn ngữ giao diện (song ngữ)
│   └── i18n/
│       ├── vi.json       # Chuỗi văn bản giao diện tiếng Việt
│       └── en.json       # Chuỗi văn bản giao diện tiếng Anh
└── README.md
```

### Giao diện song ngữ

Giao diện tự động hiển thị ngôn ngữ **ngược lại** với ngôn ngữ bạn đang học, để bạn luôn đọc được hướng dẫn:

- Đang học **tiếng Anh** → giao diện hiển thị **tiếng Việt**
- Đang học **tiếng Việt** → giao diện hiển thị **tiếng Anh**

Chọn hướng học ở menu thả xuống "Tôi đang học..." trên đầu trang — lựa chọn này được lưu lại trong trình duyệt (localStorage).

### Cách chạy (Backend)

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

### Cách chạy (Frontend)

**Lưu ý:** vì giao diện tải file JSON (để đổi ngôn ngữ), bạn cần chạy frontend qua một local server — mở trực tiếp file `index.html` bằng cách double-click sẽ **không** tải được bản dịch.

```
cd esl-vocab-app/frontend
npx serve .
```

Backend phải đang chạy (bước trên) thì frontend mới lấy được dữ liệu.

### Các API endpoints có sẵn

| Method | Endpoint          | Mô tả                          |
|--------|-------------------|---------------------------------|
| GET    | /api/words        | Lấy tất cả từ vựng             |
| GET    | /api/words/:id     | Lấy 1 từ theo id               |
| POST   | /api/words        | Thêm từ mới                    |
| PUT    | /api/words/:id     | Sửa từ                         |
| DELETE | /api/words/:id     | Xóa từ                         |
| GET    | /api/decks        | Lấy danh sách các chủ đề (deck) |

### Bước tiếp theo để học thêm

1. **Cat mascot & mini-game:** hai mèo linh vật đồng hành, chơi hoạt ảnh khi trả lời đúng, mini-game thư giãn (chải lông, cho ăn, cắt móng)
2. **Flashcard có âm thanh:** dùng Web Speech API (`speechSynthesis`) để đọc từ tiếng Anh
3. **Màn hình chính Study / Relax:** hai lựa chọn lớn dẫn tới học từ hoặc chơi với mèo
4. **Thêm đăng nhập (auth):** dùng AWS Cognito + DynamoDB để mỗi người dùng có danh sách từ riêng
5. **Deploy lên internet:** backend lên Render/Railway, frontend lên Vercel/Netlify
6. **Chuyển frontend sang React:** khi đã quen với JS thuần, thử viết lại bằng React để học component-based thinking

### Nếu gặp lỗi

- **"Cannot find module 'better-sqlite3'"** → chạy lại `npm install` trong thư mục backend
- **Frontend không load được từ** → kiểm tra backend đã chạy chưa, và mở Console (F12) trong trình duyệt để xem lỗi
- **CORS error** → đảm bảo backend có `app.use(cors())` (đã có sẵn trong server.js)
- **Chữ trong giao diện không đổi ngôn ngữ / hiện đúng key thay vì chữ** → đảm bảo bạn đang chạy frontend qua local server (`npx serve .`), không mở trực tiếp file `index.html`
