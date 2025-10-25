### 1. NestJS Native Telegram Bot (Main Bot)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-FE6732?style=for-the-badge&logo=typeorm&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

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

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

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

### 3. Deployment

![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

* Both projects were deployed on the [Railway](https://railway.app/) platform.
* **NestJS Bot (TaskBot):** Deployed as a `server` service (NestJS) connected to a `Postgres` database.

![](https://github.com/TeslenkoPavlo/ChatBotForPlanningPersonalTasks/blob/main/assets/Screenshot_1.png)

* **Web App Bot (TaskWebAppBot):** Deployed as two services: `client` (React) and `server` (Express), connected to a `MongoDB` database.

![](https://github.com/TeslenkoPavlo/ChatBotForPlanningPersonalTasks/blob/main/assets/Screenshot_2.png)
