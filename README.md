# GameRankd 🎮

GameRankd is a social game discovery and tracking platform where users can rate games, write reviews, create wishlists, and keep track of the games they’ve played. The goal of the project is to give gamers a centralized place to organize their gaming experiences and discover new titles through community feedback.

---

## Features

- ⭐ Rate game
- 📝 Write and edit game reviews
- 📚 Add games to:
  - Wishlist
  - Played list
- 🔍 Search and browse games
- 👤 User authentication and profiles
- 📊 Track gaming activity and statistics
- 🌐 Community-driven recommendations and reviews

---

## Tech Stack

### Frontend
- React

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Authentication
- JWT
- Mail Validation

## Installation

Clone the repository:

```bash
git clone https://github.com/veepm/Gamerankd.git
cd Gamerankd
```

## Backend

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
IGDB_CLIENT_ID =
IGDB_CLIENT_SECRET =
ACCESS_TOKEN_SECRET =
ACCESS_TOKEN_LIFETIME =
REFRESH_TOKEN_SECRET =
REFRESH_TOKEN_LIFETIME =
GMAIL_USER =
GMAIL_PASS =
EMAIL_TOKEN_LIFETIME =
EMAIL_TOKEN_SECRET =
PG_HOST =
PG_USER =
PG_PASSWORD =
PG_PORT =
PG_DATABASE =
```

Run the development server:

```bash
npm run dev
```

## Database

Run the db.sql file in your database server

## Frontend

Go to the frontend directory

```bash
cd my-vue-app
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:5173
