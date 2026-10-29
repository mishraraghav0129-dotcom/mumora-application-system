# Mumora — Maternal & Child Health Platform
**Healthy Moms ♥ Brighter Tomorrows**

Mumora is a full-stack maternal healthcare and pediatric development platform. It features week-by-week pregnancy tracking, WHO baby growth percentiles, multi-baby profiles, medical report storage, personalized daily nutrition, smart reminders, and an authorized administrative management panel.

---

## 🐳 Run with Docker (any OS)

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) or Docker Engine (Linux), then from the project folder run:

```bash
docker compose up --build
```

Open http://localhost:3000. This installs dependencies, builds the app, and starts it together with a local MongoDB container (data persists in a Docker volume).

- Optional: create a `.env` file (copy `.env.example`) to set `GEMINI_API_KEY`, or `MONGODB_URI` to use a different database.
- Browse the database with MongoDB Compass at `mongodb://localhost:27017` (set `MONGO_PORT` in `.env` if 27017 is already taken by a locally installed MongoDB).
- Stop: `Ctrl+C`, or `docker compose down` (add `-v` to also wipe the local database).
- After pulling new code, run `docker compose up --build` again.

---

## 🚀 Quick Start Instructions (without Docker)

### Prerequisites
- **Node.js**: v22 or higher
- **npm**: v10 or higher
- **MongoDB** running locally on port 27017 ([MongoDB Community Server](https://www.mongodb.com/try/download/community)); view it with [MongoDB Compass](https://www.mongodb.com/products/compass)

### 1. Installation
Unzip the project files into a folder, open your terminal inside the folder, and run:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (you can copy `.env.example`):
```bash
cp .env.example .env
```
Key configuration parameters:
- `PORT=3000`
- `NODE_ENV=development`
- `MONGODB_URI=` — leave empty to use local MongoDB (`mongodb://localhost:27017/mumora_db`, the same URI you open in Compass). Set it to your Atlas connection string for the online database.
- `GEMINI_API_KEY=` (optional, for Gemini AI report assistance)

> **MongoDB Atlas Note**: Never commit the Atlas connection string — keep it only in `.env`. Ensure your Atlas cluster allows network access for your IP (**Security → Network Access**).

### 3. Running the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Production Build
```bash
npm run build
npm start
```

---

## 🌟 Key Application Features

1. **Authentication & Multi-Step Registration**
   - Clean, professional welcome screen with instant language toggle (**English** or **हिंदी**).
   - 5-step onboarding wizard:
     1. Account Credentials & OTP verification
     2. Personal & Health Profile (blood group, city, state, pre-existing conditions)
     3. Pregnancy Journey (LMP, EDD estimation, clinical guidance)
     4. Existing Children (multi-baby anthropometry, gestational age)
     5. Summary Review & Profile Activation
   - Secure Login with show/hide password and self-service Password Reset via OTP.
   - Complete partition and isolation of each family's health data.

2. **Single Active Language System**
   - Clean toggle between **English** and **हिंदी** (Hindi).
   - When English is active, all views, metrics, and navigation are purely in English.
   - When Hindi is active, all screens, labels, and forms are strictly and cleanly in Hindi. No mixed or bilingual parentheses.

3. **Maternal Pregnancy Tracker**
   - Week-by-week fetal development insights with visual size comparisons.
   - Daily kick counter following ACOG and RCOG 2-hour clinical standards.
   - Sonography and ultrasound records.

4. **Pediatric Growth & Multi-Baby Records**
   - Independent profiles for each child with dedicated growth charts.
   - WHO z-score growth percentiles (weight-for-age, length-for-age).
   - Vaccination schedule tracking with automated due date alerts.

5. **Medical Vault & Clinical Guidance**
   - Private document vault for CBC, blood sugar, iron, and pediatric discharge summaries.
   - Safety-first clinical guidance.

6. **Dedicated Admin Portal**
   - Accessible via the "Admin Portal Access" / "प्रशासक पोर्टल" link in the footer.
   - Live analytics: registered families, pregnancy profiles, child records, report volume.
   - Searchable user management and account activation/suspension.
   - MongoDB Atlas connection monitoring tab with real-time cluster health and metrics.

---

## 🔒 Security & Privacy Notice
Mumora complies with the Digital Personal Data Protection Act (DPDPA 2023). User data is encrypted in transit and partitioned per family account.
