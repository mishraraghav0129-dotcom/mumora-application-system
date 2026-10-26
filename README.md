# Mumora — Maternal & Child Health Platform
**Healthy Moms ♥ Brighter Tomorrows**

Mumora is a full-stack maternal healthcare and pediatric development platform. It features week-by-week pregnancy tracking, WHO baby growth percentiles, multi-baby profiles, medical report storage, personalized daily nutrition, smart reminders, and an authorized administrative management panel.

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

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
- `MONGODB_URI=mongodb+srv://rajt35293_db_user:Abhishek@cluster0.bnvanfy.mongodb.net/mumora_db?retryWrites=true&w=majority`
- `GEMINI_API_KEY=` (optional, for Gemini AI report assistance)

> **MongoDB Atlas Note**: Ensure your MongoDB Atlas cluster has allowed network access for your local IP (or `0.0.0.0/0` under **Security → Network Access**). If MongoDB is temporarily unreachable, Mumora automatically operates with local fallback storage so you can test all features seamlessly.

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
