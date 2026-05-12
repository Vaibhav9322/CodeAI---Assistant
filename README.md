# CodeAI — AI-Powered Coding Assistant

A full-stack ChatGPT-style web application that helps students and beginner programmers generate, debug, explain, and convert code using Groq AI (LLaMA 3.3 70B).

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React.js, Tailwind CSS, Monaco Editor   |
| Backend    | Python FastAPI                          |
| Database   | MySQL                                   |
| AI         | Groq API (LLaMA 3.3 70B)               |
| Auth       | JWT (python-jose + bcrypt)              |

---

## Project Structure

```
AI Assistant/
├── frontend/                  # React app
│   ├── src/
│   │   ├── components/        # Sidebar, Layout, CodeBlock, etc.
│   │   ├── context/           # AuthContext (JWT state)
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Chat, History, Profile
│   │   ├── services/          # Axios API calls
│   │   └── utils/
│   └── .env
│
└── backend/                   # FastAPI app
    ├── database/              # DB connection, config, schema.sql
    ├── models/                # SQLAlchemy models (User, Chat, Message, Snippet)
    ├── middleware/            # JWT auth helpers
    ├── routes/                # auth, users, chats, ai, snippets
    ├── services/              # Groq AI service
    ├── main.py
    └── .env
```

---

## Prerequisites

- Node.js 18+
- Python 3.10+
- MySQL 8.0+
- Groq API key (free) → https://console.groq.com/keys

---

## One-Time Setup

### Step 1 — MySQL Database

Open MySQL Workbench or MySQL command line and run:

```sql
CREATE DATABASE codeai_db;
USE codeai_db;
SOURCE C:/Users/vaibh/Desktop/StartUP/AI Assistant/backend/database/schema.sql;
```

---

### Step 2 — Configure Backend `.env`

Edit `backend/.env`:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/codeai_db
SECRET_KEY=your-random-secret-key-here
GROQ_API_KEY=your-groq-api-key-here
FRONTEND_URL=http://localhost:3000
```

> If your MySQL password contains `@`, replace it with `%40`
> Example: password `abc@123` → `abc%40123`

---

### Step 3 — Install Backend Dependencies (first time only)

```bash
cd "C:\Users\vaibh\Desktop\StartUP\AI Assistant\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

### Step 4 — Install Frontend Dependencies (first time only)

```bash
cd "C:\Users\vaibh\Desktop\StartUP\AI Assistant\frontend"
npm install
```

---

## Run Commands

### Terminal 1 — Start Backend

```bash
cd "C:\Users\vaibh\Desktop\StartUP\AI Assistant\backend"
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

✅ Backend running at → http://localhost:8000
📄 API docs at → http://localhost:8000/docs

---

### Terminal 2 — Start Frontend

```bash
cd "C:\Users\vaibh\Desktop\StartUP\AI Assistant\frontend"
npm start
```

✅ Frontend running at → http://localhost:3000

---

> Both terminals must stay open at the same time.

---

## First Time Using the App

1. Open → http://localhost:3000
2. Click **Get Started**
3. Register with any username, email, password (6+ chars)
4. You're in — start chatting with AI!

---

## API Endpoints

### Auth
| Method | Endpoint         | Description       |
|--------|-----------------|-------------------|
| POST   | /auth/register  | Register new user |
| POST   | /auth/login     | Login, get JWT    |

### Users
| Method | Endpoint      | Description         |
|--------|--------------|---------------------|
| GET    | /users/me    | Get profile         |
| PUT    | /users/me    | Update profile      |
| GET    | /users/stats | Get usage stats     |

### Chats
| Method | Endpoint                    | Description        |
|--------|----------------------------|---------------------|
| POST   | /chats                     | Create chat         |
| GET    | /chats                     | List all chats      |
| DELETE | /chats/{id}                | Delete chat         |
| GET    | /chats/{id}/messages       | Get messages        |
| POST   | /chats/{id}/messages       | Send message + AI   |

### AI
| Method | Endpoint       | Description               |
|--------|---------------|---------------------------|
| POST   | /ai/generate  | Generate code             |
| POST   | /ai/explain   | Explain code              |
| POST   | /ai/debug     | Debug code                |
| POST   | /ai/convert   | Convert between languages |
| POST   | /ai/optimize  | Optimize code             |

### Snippets
| Method | Endpoint          | Description      |
|--------|------------------|------------------|
| POST   | /snippets        | Save snippet     |
| GET    | /snippets        | List snippets    |
| DELETE | /snippets/{id}   | Delete snippet   |

---

## Features

- **ChatGPT-style UI** — Full markdown rendering with headings, lists, tables, code blocks
- **JWT Authentication** — Secure login/register with bcrypt password hashing
- **AI Chat** — Conversational AI with full message history context
- **Code Generation** — Generate code in Python, JavaScript, Java, C++, C
- **Debug Assistant** — Paste code + error, get instant fix
- **Code Explanation** — Line-by-line explanation for beginners
- **Language Conversion** — Convert code between 5 languages
- **Code Optimizer** — Improve performance and readability
- **Monaco Editor** — VS Code-like editor embedded in chat
- **Save Snippets** — Bookmark useful code snippets
- **Chat History** — All conversations stored and searchable
- **Copy/Download** — Copy code or download as file
- **Dark Mode UI** — Glassmorphism design with VS Code theme

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `python not found` | Use `py` instead of `python` |
| DB connection error | Check MySQL is running + password in `.env` is correct |
| `@` in MySQL password | Replace `@` with `%40` in DATABASE_URL |
| AI quota error | Get a new free Groq key at https://console.groq.com/keys |
| Port 3000 in use | React will ask to use 3001 — press `Y` |
| `bcrypt` error | Run `pip install bcrypt==4.0.1 --force-reinstall` |

---

## Deployment

### Backend (Railway / Render)
1. Set environment variables in the platform dashboard
2. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Use a managed MySQL instance (PlanetScale, Railway MySQL)

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Run `npm run build` and deploy the `build/` folder

---

## Security Notes

- Change `SECRET_KEY` in `.env` to a long random string in production
- Never commit `.env` files to version control
- The backend uses rate limiting via `slowapi`
- All routes except `/auth/*` and `/health` require JWT
