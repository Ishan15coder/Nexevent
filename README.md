# NexEvent — Premium Event Booking Platform

> Browse, register, and book event tickets seamlessly with 2FA OTP protection.

---

## ✨ Features

- 🎟️ **Event Browsing** — Filter events by category, search by title
- 🔐 **Auth with 2FA** — Register/Login secured with OTP email verification
- 📋 **Booking System** — Book events with OTP confirmation flow
- 💳 **Payment Tracking** — Admin marks bookings as Paid or Free
- 🛠️ **Admin Dashboard** — Create, edit, delete events; manage booking queue
- 📬 **Email Notifications** — OTP and booking confirmation emails via Nodemailer
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🧱 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| TailwindCSS v4 | Utility CSS |
| React Icons | Icon library |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| JSON Web Tokens | Authentication |
| Nodemailer | Email (OTP + booking) |
| bcrypt | Password hashing |

---

## 📁 Project Structure

```
NexEvent/
├── Frontend/               # React + Vite app
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/     # Navbar, RouteGuards, Spinner
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Home, Login, Register, AdminDashboard, UserDashboard, EventDetails
│   │   ├── utils/          # Axios instance
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vercel.json         # SPA routing fix for Vercel
│   └── package.json
│
└── Backend/                # Express REST API
    ├── controllers/        # Auth, Events, Bookings logic
    ├── middleware/         # JWT auth middleware
    ├── models/             # User, Event, Booking, OTP schemas
    ├── routes/             # Auth, Events, Bookings routes
    ├── utils/              # Email (Nodemailer)
    ├── index.js            # App entry point
    ├── .env.example        # Environment variable template
    └── package.json
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password enabled

### 1. Clone the repo
```bash
git clone https://github.com/Ishan15coder/Nexevent.git
cd NexEvent
```

### 2. Setup the Backend
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Setup the Frontend
```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## 🔐 Environment Variables

Create `Backend/.env` from `Backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/nexevent
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note:** `EMAIL_PASS` is a Gmail **App Password**, not your regular password.  
> Generate one at: Google Account → Security → App Passwords

---

## 🚀 Deployment

### Frontend → Vercel

1. Connect GitHub repo to [Vercel](https://vercel.com)
2. Set **Root Directory** → `Frontend`
3. Framework: `Vite` | Build: `npm run build` | Output: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
5. Deploy ✅

### Backend → Render

1. Connect GitHub repo to [Render](https://render.com)
2. **New Web Service** → Root Directory: `Backend`
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Add all 5 environment variables from `.env.example`
6. Deploy ✅

### Keep Backend Alive (Render Free Tier)

Set up a cron job on [cron-job.org](https://cron-job.org) to ping every 10 minutes:
```
GET https://your-render-app.onrender.com/health
```

---

## 🗺️ API Routes

### Auth — `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register with OTP email |
| POST | `/verify-otp` | Verify registration OTP |
| POST | `/login` | Login (returns JWT) |

### Events — `/api/events`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Get all events |
| GET | `/:id` | — | Get event by ID |
| POST | `/` | Admin | Create event |
| PUT | `/:id` | Admin | Update event |
| DELETE | `/:id` | Admin | Delete event |

### Bookings — `/api/bookings`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/send-otp` | User | Send booking OTP |
| POST | `/book` | User | Book an event |
| GET | `/my` | User | Get my bookings |
| GET | `/all` | Admin | Get all bookings |
| PUT | `/:id/confirm` | Admin | Confirm booking (paid/free) |
| PUT | `/:id/cancel` | User/Admin | Cancel booking |

---

## 📸 Screenshots

> Coming soon

---

## 📄 License

MIT License — feel free to use and modify.

---

Made with ❤️ by [Ishan](https://github.com/Ishan15coder)
