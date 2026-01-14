
# GigFlow – Real-Time Freelance Marketplace

GigFlow is a full-stack freelance platform where users can post gigs, place bids, and hire freelancers — all with **real-time updates**.
No refresh. No delays. Everything updates instantly.

---

## 🚀 What GigFlow Does

GigFlow connects clients and freelancers in a clean, fast, and real-time workflow:

* Clients post jobs (Gigs)
* Freelancers place Bids
* Clients hire one freelancer
* The system updates **everyone live**

---

## ⚡ Real-Time Features (Core Highlight)

GigFlow uses **Socket.io** to keep the app live and synced:

### 🏠 Homepage Updates

* New gigs appear instantly
* Gig status changes update live

### 💬 Live Bidding

* When a freelancer places a bid, the client sees it immediately
* No page refresh needed

### ✅ Hiring Updates

* When a client hires a freelancer:

  * Gig status updates to `assigned`
  * Selected bid becomes `hired`
  * Other bids become `rejected`
  * Freelancer receives instant notification

Everything happens in real time.

---

## 🔐 Authentication

* Secure signup & login
* JWT with **HttpOnly Cookies**
* Any user can act as:

  * Client (post gigs)
  * Freelancer (place bids)

---

## 📋 Gig Management

* Create gigs with title, description, and budget
* Browse all open gigs
* Search gigs by title
* Live gig updates on homepage

---

## 💬 Bidding System

* Freelancers submit:

  * Message
  * Price
* Clients see all bids instantly
* Real-time bid updates

---

## ✅ Hiring Logic (Safe + Atomic)

When a client hires a freelancer:

1. Gig status → `assigned`
2. Selected bid → `hired`
3. All other bids → `rejected`
4. Freelancer gets instant notification

Race conditions are prevented using secure transaction.

---

## 🛠 Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Context API 

**Backend**

* Node.js
* Express.js
* MongoDB + Mongoose

**Auth**

* JWT + HttpOnly Cookies

**Real-Time**

* Socket.io

---

## 📂 Project Structure

```
GigFlow/
│
├── client/        # React frontend
├── server/        # Node + Express backend
├── .env.example   # Environment variables
└── README.md
```

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | /api/auth/register | Register user      |
| POST   | /api/auth/login    | Login & set cookie |

### Gigs

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | /api/gigs | Fetch open gigs  |
| GET    | /api/appliedgigs | Fetch gigs where you placed your bids  |
| GET    | /api/postedgigs | Fetch gigs you posted  |
| POST   | /api/gigs | Create a new gig |

### Bids

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | /api/bids        | Submit a bid           |
| GET    | /api/bids/:gigId | View bids (Owner only) |

### Hiring

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| PATCH  | /api/bids/:bidId/hire | Hire a freelancer |

---

## 🗃 Database Models

### User

* name
* email
* password

### Gig

* title
* description
* budget
* ownerId
* status (open / assigned)

### Bid

* gigId
* freelancerId
* message
* status (pending / hired / rejected)

---

## ⚙️ Environment Setup

Create a `.env` file:

```
# backend (use dotenv , process.env.)
FRONTEND_ORIGIN =
MONGO_URI =
PORT =
JWT_SECRET_KEY =


# frontend ( use import.meta.env.VITE_BACKEND_URL)
VITE_BACKEND_URL = 
```

---

## ▶️ Run the Project

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🎯 Why GigFlow Stands Out

* Real-time homepage updates
* Live bidding system
* Instant hiring notifications
* Secure cookie-based auth
* Atomic hiring logic
* Clean UI + API structure

---

## 📽 Demo
* Demo Video (Loom): https://www.loom.com/share/7b536f8581df440cbe720ca4214cbff6

---

## 👤 Author

**Harshit Srivastava**

