# SkillSync — Full-Stack MERN Skill Exchange Platform

A peer-to-peer skill-sharing platform where users can teach skills they know and learn skills they want. Built with **MongoDB, Express, React, Node.js (MERN)**.

## 🌿 Project Overview

SkillSync solves the problem: *"How do I learn new skills from people in my community without paying?"*

**Solution:** A platform where users exchange skills directly. You teach JavaScript, I teach Photography. We both win.

---

## 🏗️ Architecture

### **Frontend (React + Vite)**
client/

├── src/

│   ├── pages/          → Dashboard, MySkills, FindSkills, Exchanges, Analytics, AIAssistant

│   ├── components/     → Navbar, ProtectedRoute

│   ├── context/        → AuthContext (global state + dark mode)

**Key Frontend Concepts:**
- **React Router:** URL-based navigation (6 protected routes)
- **Context API:** Global auth state (user, token, darkMode)
- **Protected Routes:** Only logged-in users can access /dashboard, /exchanges, etc.
- **Axios Interceptors:** Auto-attach JWT token to all API requests
- **Dark Mode:** Persistent localStorage preference
- **Responsive Design:** Works on desktop and mobile

### **Backend (Node + Express)**
server/

├── models/             → User, Exchange (MongoDB schemas)

├── controllers/        → skillController, exchangeController (business logic)

├── routes/             → auth.js, skills.js, exchanges.js (API endpoints)

├── middleware/         → auth.js (JWT verification)

└── server.js           → Express app setup
**Key Backend Concepts:**
- **JWT Authentication:** Tokens stored in localStorage, verified on protected routes
- **Middleware Pattern:** `protect` middleware checks token before controller runs
- **Schema Validation:** Mongoose validates data before saving to DB
- **Error Handling:** Try-catch blocks, meaningful error messages
- **Database Relationships:** User references in Exchange model (initiator, recipient)

### **Database (MongoDB)**
```javascript
// User Document
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypted),
  skillsToTeach: [{name, level}],
  skillsToLearn: [String],
  totalExchanges: Number,
  completedExchanges: Number,
  rating: Number,
  reviews: [{fromUser, rating, comment}],
  points: Number,
  level: Number,
  createdAt: Date
}

// Exchange Document
{
  _id: ObjectId,
  initiator: ObjectId (ref: User),
  recipient: ObjectId (ref: User),
  skillOffered: String,
  skillRequested: String,
  status: "pending" | "accepted" | "completed",
  messages: [{sender, text, createdAt}],
  scheduledDate: Date,
  initiatorRating: {rating, comment},
  recipientRating: {rating, comment},
  createdAt: Date
}
```

---

## 🔄 Complete User Flow (with Technical Details)

### **1. Signup/Login**
User enters email + password

↓

POST /api/auth/signup

↓

Backend: Hash password with bcryptjs (salt rounds: 10)
↓

Save to MongoDB User collection

↓

Generate JWT token (7-day expiry)

↓

Return token + user data

↓

Frontend: Save token in localStorage

↓

AuthContext updates global state

↓

Redirect to /dashboard

│   ├── App.jsx         → Route configuration

│   └── main.jsx        → Entry point

**Key Concepts:**
- **Token Verification:** `protect` middleware decodes JWT using JWT_SECRET
- **MongoDB Array Operations:** `$push` operator adds to array
- **Duplicate Prevention:** `find()` before `push()`
- **Axios Interceptor:** Token auto-attached in Authorization header

---

### **3. Find & Connect with Users**
User navigates to /find-skills

↓

Frontend: GET /api/skills/all (no auth needed, public list)

↓

Backend: Query all users, return name, skills, rating

↓

Frontend: Display 3 mock users (in production: real users from DB)

↓

User clicks "Alice Johnson"

↓

User selects skill they want to learn (dropdown)

↓

User enters skill they can offer (text input)

↓

Click "Send Exchange Request"

↓

POST /api/exchanges/request

Headers: Authorization: Bearer {token}

Body: {recipientId, skillOffered, skillRequested}

↓

Backend: Create new Exchange document

initiator: current userId (from token)
recipient: selected userId
status: "pending"
messages: []

↓

Save to MongoDB

↓

Frontend: Show "✅ Request sent!" message


---

### **4. Exchange Chat & Messaging**
Recipient sees request in /exchanges page

↓

Recipient clicks "Accept Exchange"

↓

PUT /api/exchanges/{exchangeId}/accept

Status updates: "pending" → "accepted"

↓

Both users can now see chat window

↓

User types message + clicks "Send"

↓

POST /api/exchanges/{exchangeId}/message

Body: {text: "Let's meet Tuesday?"}

↓

Backend: $push message to messages array

↓

Frontend: Show message in chat (with timestamp)

↓

Both users schedule date

↓

PUT /api/exchanges/{exchangeId}/schedule

Body: {scheduledDate: "2026-06-20"}

---

### **5. Rate & Review**
After exchange is done

↓

User clicks "Rate Exchange"

↓

Modal appears: 5-star rating + optional comment

↓

User selects 4 stars, writes "Great teacher!"

↓

POST /api/exchanges/{exchangeId}/rate

Body: {rating: 4, comment: "Great teacher!"}

↓

Backend:

Save rating to Exchange document
Find the OTHER user in this exchange
Push review to User.reviews array
Calculate average rating

avgRating = sum(all reviews.rating) / count(reviews)
Update User.rating field

↓

Save to MongoDB

↓

Frontend: Show "⭐ Rating submitted!" + update Analytics page


**Why this matters in interviews:**
- Shows you understand **data aggregation** (calculating averages)
- Shows **referential integrity** (updating related documents)
- Shows **transaction-like behavior** (multiple updates together)

---

## 📊 Analytics Page (Real Data)**

All stats come from the logged-in user's document:

```javascript
// Frontend fetches user data
GET /api/skills/me
Returns: {
  totalExchanges: 4,
  completedExchanges: 2,
  points: 150,
  rating: 4.8,
  level: 2
}

// UI displays these values (NOT hardcoded)
<StatCard 
  label="Total Exchanges" 
  value={stats.totalExchanges}  ← From database
/>
```

---

## 🤖 AI Skill Matching

Simple keyword matching (not actual ML):

```javascript
searchQuery = "React"
         ↓
skillDatabase = {
  "javascript": ["React", "Node.js", ...],
  "python": ["Django", ...],
  ...
}
         ↓
Loop through database, find matches
         ↓
Return ["React", "JavaScript", "Web Development"]
         ↓
User can click to explore these skills
```

**For interviews:** "In production, we'd use collaborative filtering or content-based recommendations with a real ML model."

---

## 🔐 Security Features

| Feature | Why | How |
|---------|-----|-----|
| **Password Hashing** | Protect user passwords | bcryptjs (10 salt rounds) |
| **JWT Tokens** | Authenticate requests | Sign with JWT_SECRET, expire in 7 days |
| **Protected Routes** | Only logged-in users access | `<ProtectedRoute>` wrapper |
| **CORS** | Allow frontend-backend communication | `cors()` middleware |
| **Environment Variables** | Hide secrets | `.env` file (not in git) |
| **Input Validation** | Prevent bad data | Check required fields before saving |

---

## 🚀 How to Run Locally

### **Backend**
```bash
cd server
npm install
# Create .env with:
# MONGO_URI=mongodb://localhost:27017/skillsync
# JWT_SECRET=your_secret_key
# PORT=5000
npm start
# Server runs on http://localhost:5000
```

### **Frontend**
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

### **MongoDB**
```bash
# Install MongoDB Community Edition
# Run local instance:
mongod
# Connects to localhost:27017/skillsync
```

---

## 📚 What I Learned Building This

| Concept | Learning |
|---------|----------|
| **JWT Authentication** | Stateless, scalable, token-based auth |
| **Protected Routes** | Middleware pattern for security |
| **React Context** | Global state management without Redux |
| **MongoDB Relationships** | ObjectId references between collections |
| **API Design** | RESTful endpoints with proper HTTP methods |
| **Error Handling** | Try-catch, meaningful messages |
| **Dark Mode** | localStorage persistence + React state |
| **Responsive Design** | CSS variables + flexbox/grid |

---

## 🎯 Future Improvements (for production)

1. **Real User Matching** → GET /api/users with filtering
2. **Notifications** → WebSocket for real-time updates
3. **Image Uploads** → User avatars, skill badges
4. **Payment** → For premium features
5. **ML Recommendations** → Collaborative filtering
6. **Video Chat** → For remote exchanges
7. **Deployment** → AWS/Heroku/Vercel
8. **Testing** → Jest, React Testing Library
9. **Database Indexes** → For faster queries at scale
10. **Rate Limiting** → Prevent API abuse

---

## 📁 Project Structure
skillsync/

├── client/                 # React frontend

│   ├── src/

│   │   ├── pages/         # 6 main pages

│   │   ├── components/    # Reusable components

│   │   ├── context/       # Auth + dark mode

│   │   └── App.jsx        # Routes

│   ├── package.json

│   └── vite.config.js

│

├── server/                 # Node/Express backend

│   ├── models/            # User, Exchange schemas

│   ├── controllers/       # Business logic

│   ├── routes/            # API endpoints

│   ├── middleware/        # JWT verification

│   ├── .env              # Secrets (not in git)

│   ├── server.js         # Express app

│   └── package.json

│

└── README.md             # This file

---


---

## 👨‍💻 Author

Built by **Manseerat** for TCS on-campus placement (2027 batch)

**GitHub:** https://github.com/Seerxt01/Skillsync-final

---

## 📄 License

MIT (Open source)

