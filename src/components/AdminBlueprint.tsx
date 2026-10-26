import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Layers,
  ShieldCheck,
  Server,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  FileCode,
  DollarSign,
  Cpu,
  BookOpen,
  RotateCcw
} from 'lucide-react';

export const AdminBlueprint: React.FC = () => {
  const { language, resetToSampleData } = useApp();
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'dpdpa' | 'roadmap'>('architecture');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetToSampleData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Navigation */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-rose-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? 'सिस्टम आर्किटेक्चर एवं तकनीकी ब्लूप्रिंट' : 'System Architecture & Technical Blueprint'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'कोडिंग में नए डेवलपर्स के लिए सरल हिंग्लिश/हिंदी व्याख्या, डेटाबेस स्कीमा और सुरक्षा गाइड'
              : 'Full-stack engineering architecture, relational schemas, AI safety guardrails & DPDPA compliance'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetSuccess ? 'Reset Done!' : 'Reset Sample Data'}</span>
        </button>
      </div>

      {/* Segmented Blueprint Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl max-w-2xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          {language === 'hi' ? '1. आर्किटेक्चर (सरल भाषा में)' : '1. Architecture & Tech Stack'}
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'database' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          {language === 'hi' ? '2. डेटाबेस स्कीमा' : '2. Database Schema'}
        </button>
        <button
          onClick={() => setActiveTab('dpdpa')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'dpdpa' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          {language === 'hi' ? '3. गोपनीयता एवं DPDPA 2023' : '3. Privacy & DPDPA Compliance'}
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'roadmap' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          {language === 'hi' ? '4. लागत एवं रोडमैप' : '4. Costs & Monetization'}
        </button>
      </div>

      {/* Tab 1: Architecture Explained Simply */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Beginner explanation in Hinglish/Hindi */}
          <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-200/80 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>
                {language === 'hi'
                  ? 'शुरुआती डेवलपर्स के लिए: यह ऐप कैसे काम करता है? (Hinglish Guide)'
                  : 'Architecture Primer for Beginners (How this platform works)'}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                <strong>1. Frontend (User Interface):</strong> यह वह हिस्सा है जो यूजर अपने फोन या कंप्यूटर स्क्रीन पर देखता है। हमने इसे <strong>React 19 + TypeScript + Tailwind CSS</strong> से बनाया है। यह पूरी तरह से मोबाइल और लैपटॉप दोनों पर सहजता से चलता है।
              </p>
              <p>
                <strong>2. Backend Server (Express + Node.js):</strong> यूजर के सीधे ब्राउज़र में कभी भी सीक्रेट API कीज़ (API Keys) नहीं रखी जातीं। इसलिए हमने <code>server.ts</code> बनाया है जो Express सर्वर चलाता है। जब यूजर AI से सवाल पूछता है या रिपोर्ट अपलोड करता है, तो रिक्वेस्ट बैकएंड सर्वर पर <code>/api/chat</code> या <code>/api/analyze-report</code> पर जाती है।
              </p>
              <p>
                <strong>3. AI Engine (Google Gemini 3.8 Flash):</strong> बैकएंड सर्वर पर <code>@google/genai</code> SDK के माध्यम से Google के आधुनिक <strong>gemini-3.8-flash</strong> मॉडल का उपयोग किया गया है। इसमें कड़े मेडिकल सेफ्टी प्रॉम्प्ट्स हैं ताकि AI कभी भी गलत दवाई न लिखे और आपातकालीन लक्षणों पर तुरंत 108/102 की सलाह दे।
              </p>
              <p>
                <strong>4. Cross-Platform Mobile Strategy:</strong> इसी रिएक्ट कोडबेस और बैकएंड को <strong>Capacitor</strong> या <strong>React Native</strong> के माध्यम से एंड्रॉइड (Google Play Store) और iOS (Apple App Store) के नेटिव ऐप में पैक किया जा सकता है।
              </p>
            </div>
          </div>

          {/* Architecture Flow Diagram */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              High-Level Multi-Tier System Diagram
            </h3>
            <div className="p-4 bg-slate-900 rounded-2xl text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto">
              <pre>{`[ CLIENT LAYER: Responsive Web / Android / iOS ]
  ├── React 19 SPA + Tailwind CSS
  ├── Bilingual State Engine (English / हिन्दी)
  ├── WHO Growth Percentiles & Vaccine Due Date Engine
  └── Local Encrypted Cache (Offline Resilience)
          │  HTTPS / REST APIs
          ▼
[ FULL-STACK BACKEND GATEWAY: Express on Node.js / Cloud Run ]
  ├── /api/chat             ──> Gemini 3.8 Flash (Maternal Triage Guardrails)
  ├── /api/analyze-report   ──> Gemini Multimodal Vision / OCR Explainer
  ├── /api/health           ──> Health & Telemetry Prober
  └── Strict Medical Safety Rules (Emergency 102/108 Red-Flag Interceptors)
          │
          ├──> Persistent Storage: Cloud SQL PostgreSQL / Firestore
          └──> Document Storage: Encrypted Cloud Storage Buckets (GCS)`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema & Relationships */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-rose-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Relational Database Design (PostgreSQL / Cloud SQL)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Normalized schema with foreign key constraints, encryption fields, and audit trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Table 1: users */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-rose-700 block text-sm">Table: users</span>
              <ul className="space-y-1 text-slate-700">
                <li><span className="text-blue-600 font-bold">id:</span> UUID (PRIMARY KEY)</li>
                <li><span className="text-blue-600">phone_hash:</span> VARCHAR(64) (UNIQUE, Indexed)</li>
                <li><span className="text-blue-600">name_encrypted:</span> BYTEA (AES-256)</li>
                <li><span className="text-blue-600">blood_group:</span> VARCHAR(10)</li>
                <li><span className="text-blue-600">preferred_language:</span> VARCHAR(5) DEFAULT 'en'</li>
                <li><span className="text-blue-600">dpdpa_consent_timestamp:</span> TIMESTAMPTZ</li>
                <li><span className="text-blue-600">created_at:</span> TIMESTAMPTZ DEFAULT NOW()</li>
              </ul>
            </div>

            {/* Table 2: pregnancy_profiles */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-rose-700 block text-sm">Table: pregnancy_profiles</span>
              <ul className="space-y-1 text-slate-700">
                <li><span className="text-blue-600 font-bold">id:</span> UUID (PRIMARY KEY)</li>
                <li><span className="text-blue-600 font-bold">user_id:</span> UUID (FK users.id ON DELETE CASCADE)</li>
                <li><span className="text-blue-600">lmp_date:</span> DATE NOT NULL</li>
                <li><span className="text-blue-600">edd_date:</span> DATE NOT NULL</li>
                <li><span className="text-blue-600">pregnancy_type:</span> VARCHAR(20)</li>
                <li><span className="text-blue-600">high_risk_flags:</span> TEXT[]</li>
                <li><span className="text-blue-600">pre_pregnancy_weight_kg:</span> NUMERIC(5,2)</li>
              </ul>
            </div>

            {/* Table 3: maternal_vitals */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-rose-700 block text-sm">Table: maternal_vitals</span>
              <ul className="space-y-1 text-slate-700">
                <li><span className="text-blue-600 font-bold">id:</span> UUID (PRIMARY KEY)</li>
                <li><span className="text-blue-600 font-bold">pregnancy_id:</span> UUID (FK pregnancy_profiles.id)</li>
                <li><span className="text-blue-600">log_timestamp:</span> TIMESTAMPTZ NOT NULL</li>
                <li><span className="text-blue-600">systolic_bp:</span> INT (ALERT IF ≥ 140)</li>
                <li><span className="text-blue-600">diastolic_bp:</span> INT (ALERT IF ≥ 90)</li>
                <li><span className="text-blue-600">weight_kg:</span> NUMERIC(5,2)</li>
                <li><span className="text-blue-600">blood_sugar_mg_dl:</span> INT</li>
                <li><span className="text-blue-600">fetal_kicks_count:</span> INT</li>
              </ul>
            </div>

            {/* Table 4: baby_profiles & growth */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-rose-700 block text-sm">Table: baby_profiles</span>
              <ul className="space-y-1 text-slate-700">
                <li><span className="text-blue-600 font-bold">id:</span> UUID (PRIMARY KEY)</li>
                <li><span className="text-blue-600 font-bold">mother_user_id:</span> UUID (FK users.id)</li>
                <li><span className="text-blue-600">name_encrypted:</span> BYTEA</li>
                <li><span className="text-blue-600">gender:</span> VARCHAR(10) NOT NULL</li>
                <li><span className="text-blue-600">birth_date:</span> DATE NOT NULL</li>
                <li><span className="text-blue-600">birth_weight_kg:</span> NUMERIC(4,2)</li>
                <li><span className="text-blue-600">birth_length_cm:</span> NUMERIC(4,1)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy & DPDPA 2023 India Compliance */}
      {activeTab === 'dpdpa' && (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Digital Personal Data Protection Act (DPDPA 2023) Compliance
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">
                1. Notice and Meaningful Consent (धारा 5 एवं 6):
              </span>
              <p>
                हर यूजर से उनकी भाषा (अंग्रेजी या हिंदी) में अलग-अलग स्पष्ट सहमति (Explicit Consent) ली जाती है। AI चैटबॉट के इस्तेमाल, मेडिकल रिकॉर्ड स्टोरेज और नोटिफिकेशन के लिए अलग टॉगल हैं।
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">
                2. Processing Children's Personal Data (धारा 9 - बाल डेटा संरक्षण):
              </span>
              <p>
                शिशु (नाबालिग) के स्वास्थ्य आंकड़े और जन्म रिकॉर्ड केवल माता/पिता या वैध अभिभावक (Parental Consent) की स्पष्ट पुष्टि के बाद ही स्टोर किए जाते हैं। बच्चों के डेटा पर कोई भी लक्ष्यित विज्ञापन (Behavioral Tracking) पूर्णतः प्रतिबंधित है।
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">
                3. Right to Erasure & Data Portability (धारा 12):
              </span>
              <p>
                यूजर किसी भी समय अपने सभी मेडिकल रिकॉर्ड्स, सोनोग्राफी और वजन/बीपी के आंकड़े एक क्लिक में डाउनलोड (Export PDF/JSON) कर सकते हैं और "डिलीट माय अकाउंट" का अनुरोध कर सकते हैं।
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">
                4. Data Security & Storage (Encryption at Rest & Transit):
              </span>
              <p>
                सभी दस्तावेज क्लाउड में AES-256 बिट एन्क्रिप्शन के साथ सुरक्षित रहते हैं। नेटवर्क पर सभी कम्यूनिकेशन TLS 1.3 एन्क्रिप्टेड हैं।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Monetization & Operating Costs */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-rose-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Cost Estimates & Ethical Monetization Roadmap
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Transparent, sustainable pricing model ensuring safety and emergency features remain 100% free forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* Free Tier */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Tier 1: Free Forever (Mumora Foundation)</span>
              <h3 className="text-xl font-bold text-slate-900">₹0 / Free for All Mothers</h3>
              <ul className="space-y-1.5 text-slate-700">
                <li>✓ 102 / 108 Emergency Speed Dial & Red Flag Triage</li>
                <li>✓ Full Week-by-Week Pregnancy Tracking</li>
                <li>✓ National Vaccination Schedule (UIP) & Due Dates</li>
                <li>✓ Daily Fetal Kick Counter & Contraction Timer</li>
                <li>✓ Basic Mumora AI Pregnancy Q&A (Standard quota)</li>
              </ul>
            </div>

            {/* Premium Tier */}
            <div className="p-6 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">Tier 2: Mumora Care Plus</span>
              <h3 className="text-xl font-bold text-rose-950">₹199 / month or ₹999 for full 40 weeks</h3>
              <ul className="space-y-1.5 text-slate-800">
                <li>✓ Unlimited AI Lab Report & Ultrasound Scan OCR Interpretation</li>
                <li>✓ Exportable Pediatrician & Gynecologist Visit Summaries</li>
                <li>✓ Multi-Child Baby Growth Tracking with WHO Curve Analysis</li>
                <li>✓ Partner Sync & WhatsApp Medication Reminders</li>
                <li>✓ Optional Verified Tele-Consultation with Obstetricians</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
