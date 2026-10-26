import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { PREGNANCY_WEEKS, getWeekData } from '../data/pregnancyWeeks';
import {
  Calendar,
  Heart,
  Activity,
  Scale,
  Sparkles,
  Timer,
  AlertCircle,
  Clock,
  Plus,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Eye,
  ShieldCheck,
  Lock,
  Unlock,
  ShieldAlert,
  Luggage,
  Info,
  Utensils,
  CloudSun,
  Bell,
  FileText,
} from 'lucide-react';
import { BcgPregnancyReminder } from './BcgPregnancyReminder';
import { DynamicFetalGraphic } from './DynamicFetalGraphic';

export const PregnancyTracker: React.FC = () => {
  const {
    language,
    pregnancy,
    updatePregnancyLmp,
    updatePregnancyWeek,
    vitalLogs,
    addVitalLog,
    userProfile,
    setAppMode,
    hospitalBag,
    healthReminders,
    nutritionProfile,
    babyRiskAssessment,
    setIsOnboardingOpen,
    foodCity,
  } = useApp();

  const t = TRANSLATIONS[language];
  const [selectedWeek, setSelectedWeek] = useState<number>(pregnancy.currentWeek || 24);

  // Form state for logging maternal vitals
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [systolic, setSystolic] = useState<number>(118);
  const [diastolic, setDiastolic] = useState<number>(76);
  const [weight, setWeight] = useState<number>(64.5);
  const [bloodSugar, setBloodSugar] = useState<number>(88);
  const [sugarType, setSugarType] = useState<'fasting' | 'post_prandial_2h'>('fasting');
  const [vitalNotes, setVitalNotes] = useState('');

  // Kick counter state
  const [kickCount, setKickCount] = useState<number>(0);
  const [kickSessionActive, setKickSessionActive] = useState<boolean>(false);
  const [kickStartTime, setKickStartTime] = useState<Date | null>(null);
  const [kickElapsedSeconds, setKickElapsedSeconds] = useState<number>(0);

  // Contraction timer state
  const [isContracting, setIsContracting] = useState<boolean>(false);
  const [contractionStartTime, setContractionStartTime] = useState<Date | null>(null);
  const [contractions, setContractions] = useState<{ id: string; durationSec: number; intervalSec: number; time: string }[]>([
    { id: 'c1', durationSec: 52, intervalSec: 360, time: '09:12 AM' },
    { id: 'c2', durationSec: 58, intervalSec: 320, time: '09:18 AM' },
    { id: 'c3', durationSec: 62, intervalSec: 295, time: '09:23 AM' },
  ]);

  // LMP update modal
  const [showLmpModal, setShowLmpModal] = useState<boolean>(false);
  const [newLmpDate, setNewLmpDate] = useState<string>(pregnancy.lastMenstrualPeriod);

  // Mother & Fetal Condition-Adaptive Stage Gating
  const currentGestationalWeek = pregnancy.currentWeek;
  const isKickCounterEligible = currentGestationalWeek >= 24;
  const isContractionTimerEligible = currentGestationalWeek >= 36;

  const [showEarlyKickCounter, setShowEarlyKickCounter] = useState<boolean>(false);
  const [showEarlyContractionTimer, setShowEarlyContractionTimer] = useState<boolean>(false);

  // Kick session interval timer
  useEffect(() => {
    let interval: any = null;
    if (kickSessionActive) {
      interval = setInterval(() => {
        setKickElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [kickSessionActive]);

  const activeWeekData = getWeekData(selectedWeek);

  const handleStartKickSession = () => {
    setKickCount(0);
    setKickSessionActive(true);
    setKickStartTime(new Date());
    setKickElapsedSeconds(0);
  };

  const handleAddKick = () => {
    if (!kickSessionActive) {
      handleStartKickSession();
      setKickCount(1);
    } else {
      const nextCount = kickCount + 1;
      setKickCount(nextCount);
      if (nextCount >= 10) {
        // Log to vitals
        addVitalLog({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          gestationalWeek: pregnancy.currentWeek,
          fetalKicksCount: 10,
          notes: `Completed 10 fetal kicks in ${Math.round(kickElapsedSeconds / 60)} minutes.`,
        });
        setKickSessionActive(false);
      }
    }
  };

  const handleToggleContraction = () => {
    const now = new Date();
    if (!isContracting) {
      setIsContracting(true);
      setContractionStartTime(now);
    } else {
      setIsContracting(false);
      if (contractionStartTime) {
        const durationSec = Math.round((now.getTime() - contractionStartTime.getTime()) / 1000);
        const lastContraction = contractions[contractions.length - 1];
        let intervalSec = 300;
        if (lastContraction) {
          intervalSec = Math.round(durationSec + 240); // realistic spacing
        }
        setContractions(prev => [
          ...prev,
          {
            id: `c_${Date.now()}`,
            durationSec,
            intervalSec,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    addVitalLog({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gestationalWeek: pregnancy.currentWeek,
      bloodPressureSystolic: systolic,
      bloodPressureDiastolic: diastolic,
      weightKg: weight,
      bloodSugarMgDl: bloodSugar,
      bloodSugarType: sugarType,
      notes: vitalNotes,
    });
    setShowVitalForm(false);
    setVitalNotes('');
  };

  // High BP Alert check
  const latestVital = vitalLogs[0];
  const isHighBp =
    (latestVital?.bloodPressureSystolic && latestVital.bloodPressureSystolic >= 140) ||
    (latestVital?.bloodPressureDiastolic && latestVital.bloodPressureDiastolic >= 90);

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* High BP Red Flag Notification */}
      {isHighBp && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-900 space-y-1">
            <span className="font-bold text-sm">
              {language === 'hi' ? 'उच्च रक्तचाप चेतावनी (BP ≥ 140/90)' : 'High Blood Pressure Warning (BP ≥ 140/90)'}
            </span>
            <p>
              {language === 'hi'
                ? 'आपका हालिया बीपी 140/90 से अधिक दर्ज हुआ है। यह प्री-एक्लेम्पसिया का संकेत हो सकता है। कृपया आराम करें और अपने स्त्री रोग विशेषज्ञ से तुरंत संपर्क करें।'
                : 'Your recent reading is above the clinical hypertension threshold for pregnancy. Please consult your obstetrician to screen for preeclampsia.'}
            </p>
          </div>
        </div>
      )}

      {/* Hero Card: Pregnancy Progression */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-rose-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Progress Info */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  {language === 'hi' ? 'वर्तमान गर्भावस्था स्थिति' : 'Current Antenatal Status'}
                </span>
                <button
                  onClick={() => setShowLmpModal(true)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'LMP / EDD बदलें' : 'Adjust EDD / LMP'}</span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                {language === 'hi' ? `सप्ताह ${pregnancy.currentWeek}, दिन ${pregnancy.currentDay}` : `Week ${pregnancy.currentWeek}, Day ${pregnancy.currentDay}`}
              </h1>

              {/* Unboxed Metadata with · separator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-2">
                <span>{language === 'hi' ? `तिमाही: ${pregnancy.trimester}` : `Trimester: ${pregnancy.trimester}`}</span>
                <span aria-hidden="true">·</span>
                <span>{language === 'hi' ? `EDD: ${pregnancy.estimatedDueDate}` : `Due Date: ${pregnancy.estimatedDueDate}`}</span>
                <span aria-hidden="true">·</span>
                <span>{language === 'hi' ? 'एकल गर्भावस्था' : 'Singleton'}</span>
              </div>
            </div>

            {/* Fruit Size Card */}
            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  {t.pregnancy.babySize}
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? activeWeekData.fruitHi : activeWeekData.fruitEn}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-700 text-right">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">{t.pregnancy.length}</span>
                  <span className="font-bold text-sm">~{activeWeekData.lengthCm} cm</span>
                </div>
                <div className="border-l border-rose-200 pl-3">
                  <span className="text-[10px] uppercase text-slate-400 block">{t.pregnancy.weight}</span>
                  <span className="font-bold text-sm">~{activeWeekData.weightGrams} g</span>
                </div>
              </div>
            </div>

            {/* Antenatal milestone tip */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-rose-700 block mb-1">
                {language === 'hi' ? '💡 इस सप्ताह का चिकित्सीय परामर्श:' : '💡 Clinical Guidance This Week:'}
              </span>
              {language === 'hi' ? activeWeekData.careTipHi : activeWeekData.careTipEn}
            </div>
          </div>

          {/* Right Column: Dynamic Visual Fetal Representation according to Current Antenatal Status & Selected Week */}
          <div className="lg:col-span-5 p-2 sm:p-4 flex items-center justify-center">
            <DynamicFetalGraphic
              week={selectedWeek}
              currentWeek={pregnancy.currentWeek}
              currentDay={pregnancy.currentDay}
              trimester={activeWeekData.trimester}
              language={language}
              fruitName={language === 'hi' ? activeWeekData.fruitHi : activeWeekData.fruitEn}
              lengthCm={activeWeekData.lengthCm}
              weightGrams={activeWeekData.weightGrams}
              babyDevelopmentText={language === 'hi' ? activeWeekData.babyDevelopmentHi : activeWeekData.babyDevelopmentEn}
            />
          </div>
        </div>
      </div>

      {/* MUMORA 4-PILLAR MATERNAL HEALTH INTELLIGENCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Daily Food Guide */}
        <div
          onClick={() => setAppMode('nutrition')}
          className="bg-white hover:bg-purple-50/40 border border-purple-100 hover:border-purple-300 rounded-2xl p-4 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Utensils className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 capitalize">
                {nutritionProfile.dietaryPreference}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
              {language === 'hi' ? 'दैनिक आहार गाइड' : 'Your Daily Food Guide'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {language === 'hi'
                ? `${foodCity} के अनुसार 6 भोजन स्लॉट्स और "क्या मैं यह खा सकती हूँ?" सुरक्षा जांच।`
                : `6 daily meal slots, hydration goals, and "Can I Eat This?" local food checker.`}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-bold">
            <span>{language === 'hi' ? 'भोजन देखें' : 'View Meals'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Smart Reminders (3-Day Rule) */}
        <div
          onClick={() => setAppMode('reminders')}
          className="bg-white hover:bg-rose-50/40 border border-rose-100 hover:border-rose-300 rounded-2xl p-4 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bell className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Default 3 Days
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-700 transition-colors">
              {language === 'hi' ? 'स्मार्ट स्वास्थ्य रिमाइंडर' : 'Smart Reminders (3-Day Rule)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {language === 'hi'
                ? 'टीकाकरण (Td, BCG) और डॉक्टर चेकअप के लिए 3 दिन पूर्व स्वचालित अलर्ट।'
                : 'Automated alerts 3 days prior for Maternal Td, BCG, and antenatal appointments.'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-rose-700 font-bold">
            <span>{language === 'hi' ? 'अलर्ट देखें' : 'View Reminders'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Antenatal Clinical Lab & Ultrasound Vault */}
        <div
          onClick={() => setAppMode('vault')}
          className="bg-white hover:bg-emerald-50/40 border border-emerald-100 hover:border-emerald-300 rounded-2xl p-4 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                OCR & Lab Review
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              {language === 'hi' ? 'नैदानिक रिपोर्ट व अल्ट्रासाउंड' : 'Antenatal Lab & Scans'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {language === 'hi'
                ? 'हीमोग्लोबिन, फास्टिंग ब्लड शुगर, टीआईएफएफए स्कैन और डॉक्टर परामर्श प्रश्न।'
                : 'Trimester Hb, OGTT, urine protein, TIFFA ultrasound scans & doctor questions.'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
            <span>{language === 'hi' ? 'रिपोर्ट्स देखें' : 'View Lab Vault'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Baby Risk Assessment */}
        <div
          onClick={() => setAppMode('family-health')}
          className="bg-white hover:bg-indigo-50/40 border border-indigo-100 hover:border-indigo-300 rounded-2xl p-4 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                DPDPA 2023
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
              {language === 'hi' ? 'शिशु जोखिम व निवारक इनसाइट' : "Baby's Risk & Prevention"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {language === 'hi'
                ? 'पारिवारिक इतिहास और क्लिनिकल दिशा-निर्देशों पर आधारित 4 स्तरीय निवारक मार्गदर्शन।'
                : 'Parental medical history, pedigree screening windows, and questions for doctor.'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-700 font-bold">
            <span>{language === 'hi' ? 'मार्गदर्शन देखें' : 'View Insights'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Condition-Adaptive Antenatal Clinical Directives & Tool Access Matrix */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'मां और भ्रूण की स्थिति अनुसार चिकित्सीय परामर्श एवं सक्रिय उपकरण' : 'Condition-Adaptive Clinical Directives & Active Tools'}
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {language === 'hi' ? `सप्ताह ${pregnancy.currentWeek} प्रोफाइल` : `Week ${pregnancy.currentWeek} Profile`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi'
                  ? 'उपकरण एवं सुझाव केवल तभी खुलते हैं जब मां व शिशु की स्थिति के अनुसार उनकी चिकित्सीय आवश्यकता होती है'
                  : 'Clinical tools and alerts dynamically unlock only when indicated for the exact maternal and fetal gestational condition'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLmpModal(true)}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline underline-offset-2 flex items-center gap-1 self-start sm:self-auto"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सप्ताह बदलें / टेस्ट करें' : 'Simulate Other Weeks'}</span>
          </button>
        </div>

        {/* Dynamic Directive Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Kick Counter Directive */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isKickCounterEligible 
              ? 'bg-rose-50/70 border-rose-200 text-rose-950 shadow-2xs' 
              : 'bg-slate-50/70 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <Heart className={`w-3.5 h-3.5 ${isKickCounterEligible ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} />
                {t.pregnancy.kickCounter}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isKickCounterEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {isKickCounterEligible ? '● Active (W24+)' : '🔒 Resting (<W24)'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isKickCounterEligible
                ? (language === 'hi'
                    ? 'शिशु की मांसपेशियां पूर्ण विकसित हैं; दैनिक 2 घंटे में 10 किक्स रिकॉर्ड करें।'
                    : 'Fetal neuromotor kicks are coordinated. Count 10 movements in a 2-hr resting window.')
                : (language === 'hi'
                    ? 'शिशु की हलचलें अभी प्रारंभिक हैं। 24वें सप्ताह में किक काउंटर स्वतः सक्रिय होगा।'
                    : 'Early flutter stage. Routine 10-kick counting is indicated starting at Week 24.')}
            </p>
          </div>

          {/* 2. BCG Birth Vaccine Planner Directive */}
          <div className={`p-4 rounded-2xl border transition-all ${
            pregnancy.currentWeek >= 20 
              ? 'bg-purple-50/70 border-purple-200 text-purple-950 shadow-2xs' 
              : 'bg-slate-50/70 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className={`w-3.5 h-3.5 ${pregnancy.currentWeek >= 20 ? 'text-purple-600' : 'text-slate-400'}`} />
                {language === 'hi' ? 'बीसीजी जन्म टीका योजना' : 'BCG Birth Vaccine'}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                pregnancy.currentWeek >= 20 ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {pregnancy.currentWeek >= 20 ? '● Active (W20+)' : '🔒 Resting (<W20)'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {pregnancy.currentWeek >= 20
                ? (language === 'hi'
                    ? 'डिलीवरी अस्पताल में कोल्ड-चेन व जन्म के 0-48 घंटे में बीसीजी की व्यवस्था सक्रिय।'
                    : 'Delivery hospital cold-chain verification and newborn birth dose reminder active.')
                : (language === 'hi'
                    ? 'जन्म पूर्व अस्पताल टीकाकरण तैयारी 20वें सप्ताह के बाद सक्रिय होगी।'
                    : 'Hospital birth vaccine readiness activates in late second trimester (Week 20+).')}
            </p>
          </div>

          {/* 3. Contraction Timer Directive */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isContractionTimerEligible 
              ? 'bg-amber-50/70 border-amber-200 text-amber-950 shadow-2xs' 
              : 'bg-slate-50/70 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <Timer className={`w-3.5 h-3.5 ${isContractionTimerEligible ? 'text-amber-600' : 'text-slate-400'}`} />
                {t.pregnancy.contractionTimer}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isContractionTimerEligible ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
              }`}>
                {isContractionTimerEligible ? '● Active (W36+)' : '🔒 Resting (<W36)'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isContractionTimerEligible
                ? (language === 'hi'
                    ? 'पूर्ण प्रसव अवधि! 5-1-1 नियम (5 मिनट अंतर, 1 मिनट अवधि, 1 घंटा) सक्रिय।'
                    : 'Full term reached! 5-1-1 active labor contraction monitoring now active.')
                : (language === 'hi'
                    ? 'असामयिक खिंचाव सामान्यतः ब्रेक्सटन हिक्स होते हैं। 5-1-1 लेबर टाइमर 36वें सप्ताह में खुलेगा।'
                    : 'Preterm tightening is typically Braxton Hicks. Active labor timer opens at Week 36.')}
            </p>
          </div>

          {/* 4. Hospital Bag Preparation Directive */}
          <div className={`p-4 rounded-2xl border transition-all ${
            pregnancy.currentWeek >= 28 
              ? 'bg-blue-50/70 border-blue-200 text-blue-950 shadow-2xs' 
              : 'bg-slate-50/70 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <Luggage className={`w-3.5 h-3.5 ${pregnancy.currentWeek >= 28 ? 'text-blue-600' : 'text-slate-400'}`} />
                {language === 'hi' ? 'हॉस्पिटल बैग' : 'Delivery Bag'}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                pregnancy.currentWeek >= 28 ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {pregnancy.currentWeek >= 28 ? '● Ready (W28+)' : 'Upcoming (W28)'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {pregnancy.currentWeek >= 28
                ? (language === 'hi'
                    ? 'तीसरी तिमाही! मां व शिशु के कपड़े, रिकॉर्ड व आवश्यक वस्तुएं पैक करना शुरू करें।'
                    : 'Third trimester packing recommended so everything is ready for delivery day.')
                : (language === 'hi'
                    ? '28वें सप्ताह के बाद डिलीवरी बैग पैक करने की चिकित्सीय सिफारिश की जाती है।'
                    : 'Recommended to begin packing hospital bag in the third trimester (Week 28+).')}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Week Scroller */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'सप्ताह दर सप्ताह विकास गाइड' : 'Week-by-Week Developmental Timeline'}
          </h2>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {language === 'hi' ? `सप्ताह ${selectedWeek} चुना गया` : `Week ${selectedWeek} Selected`}
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {PREGNANCY_WEEKS.map(w => {
            const isSelected = selectedWeek === w.week;
            const isCurrent = pregnancy.currentWeek === w.week;
            return (
              <button
                key={w.week}
                onClick={() => setSelectedWeek(w.week)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : isCurrent
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>W{w.week}</span>
                  {isCurrent && <span className="text-[9px] uppercase px-1 bg-white/20 rounded">Now</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Details Expansion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baby Development Box */}
        <div className="p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-rose-700">
            <Heart className="w-4 h-4" />
            <h3 className="text-sm font-bold">
              {language === 'hi' ? 'शिशु का शारीरिक विकास' : 'Fetal Development Milestones'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi' ? activeWeekData.babyDevelopmentHi : activeWeekData.babyDevelopmentEn}
          </p>
          {activeWeekData.scanMilestoneEn && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-amber-800 font-medium">
              <Stethoscope className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{language === 'hi' ? activeWeekData.scanMilestoneHi : activeWeekData.scanMilestoneEn}</span>
            </div>
          )}
        </div>

        {/* Maternal Changes Box */}
        <div className="p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-slate-800">
            <Activity className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold">
              {language === 'hi' ? 'मां के शरीर में परिवर्तन' : 'Maternal Changes & Symptoms'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi' ? activeWeekData.momChangesHi : activeWeekData.momChangesEn}
          </p>
          <div className="pt-2 text-xs text-slate-500">
            {language === 'hi' ? 'शारीरिक वजन में सामान्य वृद्धि और गर्भाशय का विस्तार।' : 'Normal gradual weight accretion and uterine expansion.'}
          </div>
        </div>
      </div>

      {/* Maternal Vitals & Logs Section */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.pregnancy.vitalLogs}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'बीपी, वजन और ब्लड शुगर के नियमित रिकॉर्ड' : 'Track blood pressure, weight accretion, and glycemic levels'}
            </p>
          </div>
          <button
            onClick={() => setShowVitalForm(!showVitalForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showVitalForm ? (language === 'hi' ? 'बंद करें' : 'Close Form') : t.pregnancy.logVitalsBtn}</span>
          </button>
        </div>

        {/* Vital Logging Form */}
        {showVitalForm && (
          <form onSubmit={handleSaveVitals} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">{t.pregnancy.bpSystolic}</label>
                <input
                  type="number"
                  min="80"
                  max="200"
                  value={systolic}
                  onChange={e => setSystolic(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">{t.pregnancy.bpDiastolic}</label>
                <input
                  type="number"
                  min="50"
                  max="130"
                  value={diastolic}
                  onChange={e => setDiastolic(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">{t.pregnancy.currentWeight}</label>
                <input
                  type="number"
                  step="0.1"
                  min="40"
                  max="150"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">{t.pregnancy.bloodSugar}</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="50"
                    max="300"
                    value={bloodSugar}
                    onChange={e => setBloodSugar(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <select
                    value={sugarType}
                    onChange={e => setSugarType(e.target.value as any)}
                    className="px-2 py-2 bg-white border border-slate-300 rounded-lg text-[11px]"
                  >
                    <option value="fasting">Fast</option>
                    <option value="post_prandial_2h">PP 2h</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-700 font-semibold mb-1">
                {language === 'hi' ? 'विशेष टिप्पणी (लक्षण या आहार)' : 'Clinical Notes / Symptoms'}
              </label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. सुबह हल्का सिरदर्द, पर्याप्त पानी पिया...' : 'e.g. Mild headache, well hydrated, felt regular kicks...'}
                value={vitalNotes}
                onChange={e => setVitalNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowVitalForm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                {t.common.save}
              </button>
            </div>
          </form>
        )}

        {/* Recent Vitals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BP Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">{language === 'hi' ? 'हालिया रक्तचाप (BP)' : 'Recent Blood Pressure'}</span>
              <Activity className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {latestVital?.bloodPressureSystolic || 118} / {latestVital?.bloodPressureDiastolic || 76}{' '}
              <span className="text-xs font-sans font-normal text-slate-500">mmHg</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              ✓ {language === 'hi' ? 'सामान्य सीमा (< 120/80 mmHg)' : 'Optimal (< 120/80 mmHg)'}
            </div>
          </div>

          {/* Weight Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">{language === 'hi' ? 'मातृ वजन' : 'Maternal Weight'}</span>
              <Scale className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {latestVital?.weightKg || 64.2}{' '}
              <span className="text-xs font-sans font-normal text-slate-500">kg</span>
            </div>
            <div className="text-[11px] text-slate-600">
              {language === 'hi'
                ? `गर्भावस्था पूर्व से वृद्धि: +${((latestVital?.weightKg || 64.2) - pregnancy.prePregnancyWeightKg).toFixed(1)} kg`
                : `Accretion: +${((latestVital?.weightKg || 64.2) - pregnancy.prePregnancyWeightKg).toFixed(1)} kg from baseline`}
            </div>
          </div>

          {/* Blood Sugar Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">{language === 'hi' ? 'फास्टिंग ब्लड शुगर' : 'Fasting Blood Sugar'}</span>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {latestVital?.bloodSugarMgDl || 88}{' '}
              <span className="text-xs font-sans font-normal text-slate-500">mg/dL</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              ✓ {language === 'hi' ? 'सामान्य सीमा (< 92 mg/dL)' : 'Normal Range (< 92 mg/dL)'}
            </div>
          </div>
        </div>

        {/* Recent Vital Log History List */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            {language === 'hi' ? 'हालिया माप रिकॉर्ड' : 'Recent Measurement Logs'}
          </h3>
          <div className="divide-y divide-slate-100">
            {vitalLogs.slice(0, 4).map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">
                    {log.date} · {log.time}
                  </span>
                  <div className="text-slate-500 text-[11px]">
                    Week {log.gestationalWeek} · {log.notes || 'Normal routine check'}
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums text-slate-700">
                  {log.bloodPressureSystolic && (
                    <span className="mr-3 font-semibold">BP {log.bloodPressureSystolic}/{log.bloodPressureDiastolic}</span>
                  )}
                  {log.weightKg && <span>{log.weightKg} kg</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geo-Location & Climate-Aware BCG Birth Vaccination Planner for Expectant Mothers */}
      <BcgPregnancyReminder />

      {/* Two Essential Interactive Antenatal Tools: Kick Counter & Contraction Timer (Condition-Gated) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kick Counter Card (Clinically indicated Week 24+) */}
        {isKickCounterEligible || showEarlyKickCounter ? (
          <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{t.pregnancy.kickCounter}</h3>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {isKickCounterEligible ? 'Active Milestone (W24+)' : 'Preview Mode'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.pregnancy.kickCounterDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {kickSessionActive && (
                  <span className="text-xs font-mono tabular-nums text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md">
                    {Math.floor(kickElapsedSeconds / 60)}:{(kickElapsedSeconds % 60).toString().padStart(2, '0')}
                  </span>
                )}
                {!isKickCounterEligible && showEarlyKickCounter && (
                  <button
                    onClick={() => setShowEarlyKickCounter(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    Hide
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-rose-50/40 rounded-2xl border border-rose-100/60 text-center">
              <span className="text-5xl font-extrabold font-mono tabular-nums text-rose-600 mb-1">
                {kickCount} <span className="text-xl text-slate-400 font-sans font-normal">/ 10</span>
              </span>
              <span className="text-xs text-slate-600 mb-4">
                {kickCount >= 10
                  ? (language === 'hi' ? '🎉 10 किक्स पूर्ण! भ्रूण की हलचल सामान्य है।' : '🎉 10 kicks reached! Fetal activity is reassuring.')
                  : (language === 'hi' ? 'शिशु की प्रत्येक हलचल पर टैप करें' : 'Tap button whenever you feel movement or flutter')}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddKick}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-200 transition-transform active:scale-95"
                >
                  {t.pregnancy.recordKick}
                </button>
                {kickSessionActive && (
                  <button
                    onClick={() => setKickSessionActive(false)}
                    className="px-3 py-3 text-xs text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    {t.common.cancel}
                  </button>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <strong>{language === 'hi' ? 'क्लिनिकल सलाह:' : 'Clinical Advice:'}</strong>{' '}
              {language === 'hi'
                ? 'यदि 2 घंटे बाद भी 10 से कम हलचलें महसूस हों, तो कुछ मीठा खाकर बाईं करवट 30 मिनट लेटें। फिर भी हलचल न हो तो तुरंत डॉक्टर से संपर्क करें।'
                : 'If you feel fewer than 10 kicks within 2 hours of focused monitoring, hydrate, lie on your left side, and if still decreased, contact your hospital.'}
            </div>
          </div>
        ) : (
          /* Gated Kick Counter Card when baby has not reached kick-counting stage */
          <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">{t.pregnancy.kickCounter}</h3>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      {language === 'hi' ? 'सप्ताह 24+ में सक्रिय' : 'Opens Week 24+'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {language === 'hi'
                      ? `शिशु वर्तमान में सप्ताह ${currentGestationalWeek} में है`
                      : `Baby is currently in Week ${currentGestationalWeek}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                {language === 'hi'
                  ? `सप्ताह 24 से पहले शिशु की हलचलें (Quickening) बहुत हल्की और अनियमित होती हैं। 2 घंटे में 10 किक्स गिनने का नैदानिक मानक 24 से 28 सप्ताह के बाद ही प्रासंगिक होता है, जब शिशु की मांसपेशियां और नर्वस सिस्टम पूर्ण रूप से सक्रिय होते हैं।`
                  : `Before Week 24, fetal movements are subtle flutters (quickening) or involuntary reflexes. The clinical standard of counting 10 kicks within a 2-hour window is medically indicated starting at Week 24–28 once kicks become distinct and consistent.`}
              </p>
              <div className="text-[11px] text-purple-800 font-medium">
                💡 {language === 'hi' ? 'वर्तमान सलाह: पर्याप्त जलपान करें और बाईं करवट विश्राम करें।' : 'Current Advice: Stay hydrated and rest in left-lateral position to observe gentle flutters.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {language === 'hi' ? 'चिकित्सीय आवश्यकता अनुसार सक्रिय होगा' : 'Opens when baby kicks become regular'}
              </span>
              <button
                onClick={() => setShowEarlyKickCounter(true)}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline underline-offset-2 flex items-center gap-1"
              >
                <Unlock className="w-3 h-3" />
                <span>{language === 'hi' ? 'पूर्वावलोकन खोलें' : 'Preview Counter'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Contraction Timer Card (Clinically indicated Week 36+ at term) */}
        {isContractionTimerEligible || showEarlyContractionTimer ? (
          <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{t.pregnancy.contractionTimer}</h3>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {isContractionTimerEligible ? 'Full Term Active (W36+)' : 'Preview Mode'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.pregnancy.contractionDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  5-1-1 Rule
                </span>
                {!isContractionTimerEligible && showEarlyContractionTimer && (
                  <button
                    onClick={() => setShowEarlyContractionTimer(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    Hide
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-amber-50/30 rounded-2xl border border-amber-100/60 text-center">
              <button
                onClick={handleToggleContraction}
                className={`w-36 h-36 rounded-full font-bold text-sm flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isContracting
                    ? 'bg-red-600 text-white animate-pulse shadow-red-200'
                    : 'bg-slate-900 text-white shadow-slate-300'
                }`}
              >
                <Clock className="w-6 h-6 mb-1" />
                <span>{isContracting ? t.pregnancy.stopContraction : t.pregnancy.startContraction}</span>
              </button>
            </div>

            {/* Recent Contraction Logs */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {language === 'hi' ? 'हालिया संकुचन रिकॉर्ड' : 'Recent Contraction Intervals'}
              </span>
              <div className="divide-y divide-slate-100 text-xs font-mono tabular-nums">
                {contractions.slice(-3).reverse().map(c => (
                  <div key={c.id} className="py-1.5 flex items-center justify-between text-slate-700">
                    <span className="font-sans text-slate-500">{c.time}</span>
                    <span>Duration: {c.durationSec}s</span>
                    <span className="text-slate-500">Every ~{Math.round(c.intervalSec / 60)} min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Gated Contraction Timer Card when before term */
          <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">{t.pregnancy.contractionTimer}</h3>
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {language === 'hi' ? 'सप्ताह 36+ में सक्रिय' : 'Opens Week 36+ (Full Term)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {language === 'hi'
                      ? `वर्तमान में आप सप्ताह ${currentGestationalWeek} में हैं`
                      : `Currently in Week ${currentGestationalWeek} (Antenatal Stage)`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                {language === 'hi'
                  ? `36वें सप्ताह से पूर्व कभी-कभार पेट में खिंचाव सामान्य ब्रैक्सटन हिक्स (अभ्यास संकुचन) होता है। 5-1-1 प्रसव पीड़ा टाइमर पूर्ण अवधि (36-40 सप्ताह) पर वास्तविक प्रसव (True Labor) के समय अस्पताल जाने का निर्णय लेने के लिए उपयोग किया जाता है।`
                  : `Occasional mild tightening before 36 weeks is typically physiological Braxton Hicks (practice contractions). The 5-1-1 contraction timer is clinically designed for active labor triage at full term (Week 36–40+).`}
              </p>
              <div className="text-[11px] text-red-700 bg-red-50 p-2 rounded-lg border border-red-100 font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'चेतावनी: 37 सप्ताह से पहले यदि नियमित दर्दनाक संकुचन हों, तो तुरंत अस्पताल जाएं (प्री-टर्म लेबर)।'
                    : 'Preterm Safeguard: If you feel regular painful contractions with backache before 37 weeks, contact your hospital immediately.'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {language === 'hi' ? 'प्रसव समय पर सक्रिय होगा' : 'Opens when reaching labor readiness'}
              </span>
              <button
                onClick={() => setShowEarlyContractionTimer(true)}
                className="text-xs text-amber-700 hover:text-amber-900 font-semibold underline underline-offset-2 flex items-center gap-1"
              >
                <Unlock className="w-3 h-3" />
                <span>{language === 'hi' ? 'पूर्वावलोकन खोलें' : 'Preview Timer'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3rd Trimester Condition-Gated Delivery Bag Preparation Card (Opens at Week 28+) */}
      {pregnancy.currentWeek >= 28 && (
        <div className="p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-rose-50/40 rounded-3xl border border-blue-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Luggage className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                  {language === 'hi' ? 'तीसरी तिमाही तैयारी (सप्ताह 28+)' : '3rd Trimester Antenatal Stage (Week 28+)'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {hospitalBag.filter(i => i.isPacked).length}/{hospitalBag.length} packed
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'हॉस्पिटल डिलीवरी बैग तैयार रखें' : 'Hospital Delivery Bag Readiness'}
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? 'आप तीसरी तिमाही में हैं। आकस्मिक प्रसव या लेबर दर्द शुरू होने पर तनाव से बचने के लिए मां, नवजात शिशु व आवश्यक चिकित्सीय दस्तावेजों का बैग अभी से तैयार रखना शुरू करें।'
                  : 'You have entered the 3rd trimester. Packing essential clothing, newborn swaddles, postpartum care supplies, and prenatal medical records now prevents emergency stress on delivery day.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAppMode('postpartum')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 self-start md:self-auto"
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'चेकलिस्ट खोलें और पैक करें' : 'Open Bag Checklist'}</span>
          </button>
        </div>
      )}

      {/* Adjust EDD / LMP Modal */}
      {showLmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'अंतिम मासिक धर्म (LMP) तिथि निर्धारित करें' : 'Set Last Menstrual Period (LMP)'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'Naegele नियम के अनुसार LMP से 280 दिन जोड़कर अनुमानित प्रसव तिथि (EDD) निकाली जाती है।'
                : "EDD is calculated using Naegele's rule (LMP + 280 days). Ultrasound dating can refine this."}
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'LMP तिथि (Naegele Rule)' : 'LMP Date (Naegele Rule)'}
              </label>
              <input
                type="date"
                value={newLmpDate}
                onChange={e => setNewLmpDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
              />
            </div>

            {/* Antenatal Stage Condition Simulator */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'hi' ? 'त्वरित नैदानिक अवस्था टेस्ट (Simulate Stage):' : 'Quick Stage Condition Simulator:'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    updatePregnancyWeek(14);
                    setSelectedWeek(14);
                    setShowLmpModal(false);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    pregnancy.currentWeek === 14 ? 'border-rose-500 bg-rose-50 font-bold text-rose-900' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-semibold block">Week 14 (Early 2nd)</span>
                  <span className="text-[10px] text-slate-500 block">Kicks & Timer Locked</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updatePregnancyWeek(20);
                    setSelectedWeek(20);
                    setShowLmpModal(false);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    pregnancy.currentWeek === 20 ? 'border-purple-500 bg-purple-50 font-bold text-purple-900' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-semibold block">Week 20 (Anatomy)</span>
                  <span className="text-[10px] text-purple-700 block">BCG Active; Kicks Locked</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updatePregnancyWeek(24);
                    setSelectedWeek(24);
                    setShowLmpModal(false);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    pregnancy.currentWeek === 24 ? 'border-rose-500 bg-rose-50 font-bold text-rose-900' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-semibold block">Week 24 (Kick Stage)</span>
                  <span className="text-[10px] text-rose-700 block">Kicks Active; OGTT</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updatePregnancyWeek(38);
                    setSelectedWeek(38);
                    setShowLmpModal(false);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    pregnancy.currentWeek === 38 ? 'border-amber-500 bg-amber-50 font-bold text-amber-900' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-semibold block">Week 38 (Full Term)</span>
                  <span className="text-[10px] text-amber-700 block">5-1-1 Timer & Bag Active</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLmpModal(false)}
                className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  updatePregnancyLmp(newLmpDate);
                  setShowLmpModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                {t.common.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
