# Blind Spot — Competitive Minesweeper Puzzle Game

A full-stack minesweeper-variant puzzle game where players race to find hidden safe tiles across as many boards as possible within a two-minute timer. Features JWT authentication, a global leaderboard, personal score tracking, and self-hosted deployment via Docker.

![Gameplay gif](./docs/gameplayVideo.gif)

![Gameplay screenshot](./docs/gameplayScreenshot.png)

## Live Demo

[https://minesweeper-puzzle-game.vercel.app](https://minesweeper-puzzle-game.vercel.app)

> **Note:** The frontend is hosted on Vercel. The backend runs on a self-hosted server via ngrok and may occasionally be unavailable.

---

````bash
git clone https://github.com/Warner141/Minesweeper-Puzzle-Game.git
cd Minesweeper-Puzzle-Game
npm install
cd backend && npm install && cd ..
npm run dev ```


---



## Table of Contents

- [How to Play](#how-to-play)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Security](#security)
---

## How to Play

1. Each round generates a 6×6 board with mines and safe tiles.
2. Safe tiles display the number of neighbouring mines — use these numbers to reason about which hidden tile is safe.
3. Exactly one safe tile is hidden per round. Click it to score a point and advance to the next board.
4. You have **two minutes** to score as many points as possible.
5. Clicking a mine costs you **3 seconds** from the timer — choose carefully.
6. You can play as a guest (scores saved to a cookie) or create an account to appear on the global leaderboard.
---

## Features

- **Puzzle gameplay** — 6×6 minesweeper boards with one hidden safe tile per round
- **Two-minute timer** — time penalties for hitting mines keep the pressure on
- **User authentication** — register and log in with JWT-based sessions
- **Personal score tracking** — top 3 scores saved per user with dates
- **Games played counter** — tracks total games across sessions
- **Global leaderboard** — top 10 players ranked by best score
- **Guest play** — scores saved to cookies for unauthenticated users
- **Responsive UI** — clean dark blue and white design
---

## Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite
- Axios
- React Router
- js-cookie
**Backend**
- Node.js with Express
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Prisma ORM
- express-rate-limit
**Database**
- MySQL 8
**Infrastructure**
- Docker & Docker Compose
- Nginx (reverse proxy for backend)
- ngrok (public tunnel for home server backend)
- Vercel (frontend hosting)
- Ubuntu Server 24.04 LTS (self-hosted on repurposed laptop)
---

## Architecture

````

Browser
│
├── Frontend requests ──► Vercel (https://minesweeper-puzzle-game.vercel.app)
│ │
│ │ React app (static, built at deploy time)
│
└── API requests (/api/\*) ──► ngrok tunnel
│
▼
Nginx (reverse proxy, port 80)
│
▼
Express Backend (port 8080)
│
▼
MySQL Database

````

The React frontend is deployed to Vercel and served as a static site. All API calls from the frontend are routed through ngrok to the Express backend running on a home Ubuntu server, with Nginx handling the reverse proxy.

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com)
- A running MySQL 8 instance (local dev only — Docker handles this automatically in production)
### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/Warner141/Minesweeper-Puzzle-Game.git
cd Minesweeper-Puzzle-Game
````

**2. Install frontend dependencies**

```bash
npm install
```

**3. Install backend dependencies**

```bash
cd backend
npm install
cd ..
```

**4. Set up environment variables**

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:8080
```

Create `backend/.env`:

```env
DATABASE_URL=mysql://root:yourpassword@localhost:3306/yourdbname
JWT_SECRET=your_jwt_secret
PORT=8080
```

**5. Run database migrations**

Make sure your local MySQL instance is running, then:

```bash
cd backend
npx prisma migrate dev
cd ..
```

**6. Start the development servers**

In one terminal (backend):

```bash
cd backend
node app.js
```

In a second terminal (frontend):

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8080`.

---

### Docker Deployment

**1. Clone the repository on your server**

```bash
git clone https://github.com/Warner141/Minesweeper-Puzzle-Game.git
cd Minesweeper-Puzzle-Game
```

**2. Create `.env.production` in the project root**

```env
VITE_API_URL=https://your-ngrok-url.ngrok-free.app
```

**3. Build and start all containers**

```bash
docker compose build
docker compose up -d
```

**4. Verify all containers are running**

```bash
docker ps
```

You should see four containers: `db`, `backend`, `frontend`, and `nginx`.

> **Note:** On first run, the backend waits 15 seconds for MySQL to initialize before running migrations. This is handled automatically by `start.sh`.

---

## Environment Variables

### Frontend (`.env` / `.env.production`)

| Variable       | Description                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:8080` for dev, your ngrok URL for production) |

### Backend (`backend/.env`)

| Variable       | Description                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL` | MySQL connection string (e.g. `mysql://user:password@host:3306/dbname`)      |
| `JWT_SECRET`   | Secret key used to sign JWT tokens — use a long, random string in production |
| `PORT`         | Port the Express server listens on (default: `8080`)                         |

---

## API Reference

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Endpoint             | Auth | Description                    |
| ------ | -------------------- | ---- | ------------------------------ |
| POST   | `/api/auth/register` | None | Register a new user            |
| POST   | `/api/auth/login`    | None | Log in and receive a JWT token |

**POST `/api/auth/register`**

```json
// Request body
{ "username": "alice", "password": "yourPassword" }

// Response 201
{ "message": "User created successfully" }
```

**POST `/api/auth/login`**

```json
// Request body
{ "username": "alice", "password": "yourPassword" }

// Response 200
{ "token": "<jwt>" }
```

---

### User

| Method | Endpoint          | Auth     | Description                                 |
| ------ | ----------------- | -------- | ------------------------------------------- |
| GET    | `/api/user/stats` | Required | Get the current user's stats and top scores |
| POST   | `/api/user/stats` | Required | Submit a new score                          |

**GET `/api/user/stats`**

```json
// Response 200
{
  "username": "alice",
  "gamesPlayed": 42,
  "scores": [
    { "score": 18, "createdAt": "2025-03-10T14:22:00.000Z" },
    { "score": 15, "createdAt": "2025-03-09T09:11:00.000Z" },
    { "score": 12, "createdAt": "2025-03-08T20:05:00.000Z" }
  ]
}
```

**POST `/api/user/stats`**

```json
// Request body
{ "score": 18 }

// Response 200
{ "message": "Score submitted" }
```

---

### Leaderboard

| Method | Endpoint                  | Auth     | Description                          |
| ------ | ------------------------- | -------- | ------------------------------------ |
| GET    | `/api/leaderboard/global` | None     | Get the top 10 players by best score |
| GET    | `/api/leaderboard/user`   | Required | Get the current user's global rank   |

**GET `/api/leaderboard/global`**

```json
// Response 200
[
  { "username": "alice", "bestScore": 18 },
  { "username": "bob", "bestScore": 15 }
]
```

**GET `/api/leaderboard/user`**

```json
// Response 200
{ "rank": 3, "bestScore": 18 }
```

---

### Profiles

| Method | Endpoint               | Auth | Description                 |
| ------ | ---------------------- | ---- | --------------------------- |
| GET    | `/api/users/:username` | None | Get a user's public profile |

**GET `/api/users/alice`**

```json
// Response 200
{
  "username": "alice",
  "gamesPlayed": 42,
  "scores": [{ "score": 18, "createdAt": "2025-03-10T14:22:00.000Z" }]
}
```

---

## Project Structure

```
Minesweeper-Puzzle-Game/
├── backend/                  # Express API
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Migration history
│   ├── app.js                # Main server entry point
│   ├── start.sh              # Docker startup script (waits for DB, runs migrations, starts server)
│   └── Dockerfile
├── src/                      # React frontend
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page components (game, login, register, profile)
│   ├── api.ts                # Axios API calls
│   ├── interfaces.ts         # TypeScript interfaces
│   └── utils/                # Utility functions (grid generation, validation)
├── nginx.conf                # Nginx config for serving the React static build
├── nginx-proxy.conf          # Nginx reverse proxy config (routes /api/* to Express)
├── docker-compose.yml        # Docker Compose orchestration
└── Dockerfile                # Frontend Docker build (Vite build + Nginx)
```

---

## Database Schema

```prisma
model User {
  id          Int      @id @default(autoincrement())
  username    String   @unique
  password    String
  createdAt   DateTime @default(now())
  gamesPlayed Int      @default(0)
  scores      Score[]
}

model Score {
  id        Int      @id @default(autoincrement())
  score     Int
  createdAt DateTime @default(now())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

Only the top 3 scores per user are stored. The `gamesPlayed` counter increments on every game submission regardless of score.

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 14 days
- Rate limiting on auth routes (10 requests per 15 minutes per IP)
- Input validation on both frontend and backend
- MySQL container not exposed outside the Docker internal network
- CORS restricted to known frontend origins

---

## Roadmap

A few ideas for future improvements:

- [ ] Add a screenshot / GIF to the top of this README
- [ ] Difficulty modes (larger boards, more mines)
- [ ] Daily challenge with a fixed seed
- [ ] OAuth login (GitHub / Google)
- [ ] Animated tile reveals

---

## Licence

This project is currently unlicensed. If you'd like to use or contribute to it, please open an issue or get in touch.
