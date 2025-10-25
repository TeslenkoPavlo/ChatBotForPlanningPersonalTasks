### 1. NestJS Telegram Bot

* **What it is:** A fully functional bot that operates via commands and a keyboard within Telegram.
* **Technologies:** NestJS, Telegraf, **PostgreSQL**, TypeORM.
* **Features:**
    * Full CRUD (Create, Edit, Delete tasks).
    * Statistics, filtering (completed/pending).
    * Bulk actions (mark all, delete all).
    * Random task.
* **Running:**
    1.  `npm install`
    2.  Create `.env` (specify `BOT_TOKEN` and `PostgreSQL` credentials).
    3.  `npm run start:dev`

---

### 2. Web App Bot (React + Express)

* **What it is:** A hybrid system. The bot in Telegram (`/start`) only opens a Web App.
* **Technologies:**
    * **Backend:** Express, **MongoDB** (Mongoose).
    * **Frontend:** React (Vite).
* **Features:** All functionality is implemented in the web interface (CRUD, filters, statistics).
* **Running (Backend `server.js`):**
    1.  `npm install`
    2.  Create `.env` (specify `BOT_TOKEN`, `MONGO_URI`, `WEB_APP_URL`).
    3.  `node server.js`
* **Running (Frontend `App.tsx`):**
    1.  `npm install`
    2.  Create `.env.local` (specify `VITE_API_URL` – the backend address).
    3.  `npm run dev` (for Telegram integration, **requires deployment to HTTPS**).
