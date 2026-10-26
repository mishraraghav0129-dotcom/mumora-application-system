import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import {
  HealthReminder,
  ReminderCategory,
  ReminderSettings,
} from '../types';
import {
  calculateReminderStatus,
  evaluateMaternalTdSchedule,
  OFFICIAL_VACCINATION_SOURCES,
  getReminderStatusLabel,
  getReminderTitle,
  getReminderWhyShown,
} from '../data/vaccinationReminders';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Settings,
  Plus,
  ShieldCheck,
  MapPin,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter,
  Volume2,
  Info,
  Check,
  X,
  Syringe,
  Sparkles,
  Baby,
  Heart,
  Pill,
  Utensils,
  Stethoscope,
  Activity,
  Trash2,
} from 'lucide-react';

export const SmartReminders: React.FC = () => {
  const {
    language,
    healthReminders,
    reminderSettings,
    updateReminderSettings,
    addHealthReminder,
    toggleReminderCompleted,
    snoozeReminder,
    rescheduleReminder,
    deleteReminder,
    notificationLogs,
    dismissNotificationLog,
    restoreDefaultReminderSettings,
    requestBrowserNotificationPermission,
    pregnancy,
    userProfile,
  } = useApp();

  const t = TRANSLATIONS[language];

  // Active view: 'reminders' | 'settings' | 'td_calculator' | 'logs'
  const [activeTab, setActiveTab] = useState<'reminders' | 'settings' | 'td_calculator' | 'logs'>('reminders');
  const [selectedCategory, setSelectedCategory] = useState<ReminderCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'due_soon' | 'completed' | 'overdue'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReminderCategory>('vaccination');
  const [newTarget, setNewTarget] = useState<'mother' | 'baby'>('mother');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newDueTime, setNewDueTime] = useState('09:00');
  const [newWhyShown, setNewWhyShown] = useState('');
  const [newIsDoctorConfirmed, setNewIsDoctorConfirmed] = useState(true);

  // Td Calculator Interactive Form State
  const [tdCurrentWeek, setTdCurrentWeek] = useState<number>(pregnancy.currentWeek || 24);
  const [tdHadPregnancy3Yrs, setTdHadPregnancy3Yrs] = useState<boolean>(false);
  const [tdReceived2Prior, setTdReceived2Prior] = useState<boolean>(false);
  const [td1Received, setTd1Received] = useState<boolean>(true);
  const [td1Date, setTd1Date] = useState<string>('2026-09-25');
  const [td2Received, setTd2Received] = useState<boolean>(false);
  const [tdBoosterReceived, setTdBoosterReceived] = useState<boolean>(false);

  // Interactive Td Calculation
  const tdEvaluation = evaluateMaternalTdSchedule({
    currentWeek: tdCurrentWeek,
    edd: pregnancy.estimatedDueDate || '2026-05-18',
    hadPregnancyWithin3Years: tdHadPregnancy3Yrs,
    received2TdInPriorPregnancy: tdReceived2Prior,
    td1Received,
    td1Date: td1Received ? td1Date : undefined,
    td2Received,
    tdBoosterReceived,
  });

  // Filtered Reminders
  const filteredReminders = healthReminders.filter(rem => {
    if (selectedCategory !== 'all' && rem.category !== selectedCategory) return false;
    const status = calculateReminderStatus(rem.dueDate);
    if (filterStatus === 'completed') return rem.isCompleted;
    if (filterStatus === 'due_soon') return !rem.isCompleted && (status.isDueIn3Days || status.isDueToday || status.diffDays <= 3);
    if (filterStatus === 'overdue') return !rem.isCompleted && status.isOverdue;
    return true;
  });

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    addHealthReminder({
      title: newTitle,
      category: newCategory,
      targetPerson: newTarget,
      dueDate: newDueDate,
      dueTime: newDueTime,
      isCompleted: false,
      whyShown: newWhyShown || 'User scheduled health appointment with 3-day advance notice rule.',
      clinicalSource: 'User Profile & Healthcare Provider Schedule',
      sourceVerifiedDate: new Date().toISOString().split('T')[0],
      isDoctorConfirmed: newIsDoctorConfirmed,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewWhyShown('');
  };

  const handleApplyTdToReminders = () => {
    if (tdEvaluation.recommendedDose === 'All Doses Documented') return;

    addHealthReminder({
      title: `Maternal ${tdEvaluation.recommendedDose} Immunization`,
      titleHi: `मातृ ${tdEvaluation.recommendedDose} टीकाकरण`,
      category: 'vaccination',
      targetPerson: 'mother',
      dueDate: tdEvaluation.estimatedDueDate,
      dueTime: '09:30',
      isCompleted: false,
      whyShown: tdEvaluation.clinicalReason,
      whyShownHi: tdEvaluation.clinicalReasonHi,
      clinicalSource: tdEvaluation.officialGuideline,
      clinicalSourceUrl: tdEvaluation.sourceUrl,
      sourceVerifiedDate: '2024-06-15',
      isDoctorConfirmed: false,
      vaccineDoseCode: tdEvaluation.recommendedDose as any,
      notes: 'Guideline-based estimated schedule. Please verify with your Obstetrician.',
    });

    setActiveTab('reminders');
  };

  const handleRequestPush = async () => {
    const res = await requestBrowserNotificationPermission();
    if (res === 'granted') {
      setPushStatusMessage('Browser notifications enabled successfully!');
    } else if (res === 'denied') {
      setPushStatusMessage('Notification permission denied in browser settings.');
    } else {
      setPushStatusMessage('Notifications not supported by this browser environment.');
    }
    setTimeout(() => setPushStatusMessage(null), 4000);
  };

  const categoryIcons: Record<ReminderCategory, React.ReactNode> = {
    vaccination: <Syringe className="w-4 h-4 text-purple-600" />,
    antenatal_checkup: <Stethoscope className="w-4 h-4 text-pink-600" />,
    medical_test: <Activity className="w-4 h-4 text-blue-600" />,
    medication: <Pill className="w-4 h-4 text-emerald-600" />,
    nutrition: <Utensils className="w-4 h-4 text-amber-600" />,
    child_health: <Baby className="w-4 h-4 text-indigo-600" />,
  };

  const isHi = language === 'hi';

  const getCategoryLabel = (cat: ReminderCategory | 'all', lang: string): string => {
    const labels: Record<string, Record<string, string>> = {
      all: { en: 'All Categories', hi: 'सभी श्रेणियां', te: 'అన్ని విభాగాలు', ta: 'அனைத்து பிரிவுகள்', bn: 'সকল বিভাগ', mr: 'सर्व वर्ग', es: 'Todas las categorías' },
      vaccination: { en: 'Vaccination', hi: 'टीकाकरण', te: 'టీకాకరణ', ta: 'தடுப்பூசி', bn: 'টিকাদান', mr: 'लसीकरण', es: 'Vacunación' },
      antenatal_checkup: { en: 'Antenatal Checkup', hi: 'प्रसवपूर्व जांच', te: 'ప్రసవపూర్వ తనిఖీ', ta: 'மகப்பேறு பரிசோதனை', bn: 'প্রসবপূর্ব পরীক্ষা', mr: 'प्रसूतीपूर्व तपासणी', es: 'Control prenatal' },
      medical_test: { en: 'Medical Test', hi: 'लैब टेस्ट', te: 'వైద్య పరీక్షలు', ta: 'மருத்துவ பரிசோதனை', bn: 'মেডিকেল পরীক্ষা', mr: 'वैद्यकीय चाचणी', es: 'Pruebas médicas' },
      medication: { en: 'Medication', hi: 'दवाइयां', te: 'మందులు', ta: 'மருந்துகள்', bn: 'ওষুধপত্র', mr: 'औषधे', es: 'Medicamentos' },
      nutrition: { en: 'Nutrition', hi: 'पोषण', te: 'పోషకాహారం', ta: 'ஊட்டச்சத்து', bn: 'পুষ্টি', mr: 'पोषण', es: 'Nutrición' },
      child_health: { en: 'Child Health', hi: 'शिशु स्वास्थ्य', te: 'శిశు ఆరోగ్యం', ta: 'குழந்தை நலம்', bn: 'শিশু স্বাস্থ্য', mr: 'बाळ आरोग्य', es: 'Salud infantil' },
    };
    return labels[cat]?.[lang] || labels[cat]?.en || (cat === 'all' ? 'All' : cat.replace('_', ' '));
  };

  const getPersonLabel = (target: 'mother' | 'baby', lang: string): string => {
    if (target === 'mother') {
      return lang === 'hi' ? 'माता' : lang === 'te' ? 'తల్లి' : lang === 'ta' ? 'தாய்' : lang === 'bn' ? 'মা' : lang === 'mr' ? 'आई' : lang === 'es' ? 'Madre' : 'Mother';
    }
    return lang === 'hi' ? 'शिशु' : lang === 'te' ? 'శిశువు' : lang === 'ta' ? 'குழந்தை' : lang === 'bn' ? 'শিশু' : lang === 'mr' ? 'बाळ' : lang === 'es' ? 'Bebé' : 'Baby';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Header with Mumora Clinical Badge */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-[#FAF6EE] rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-semibold">
              <Bell className="w-3.5 h-3.5 text-purple-700 animate-bounce" />
              <span>{language === 'hi' ? 'स्वास्थ्य मंत्रालय एवं डब्ल्यूएचओ मानक' : language === 'te' ? 'MoHFW UIP & WHO ప్రమాణాలు' : 'MoHFW UIP & WHO Standard Rules'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              <span className="text-purple-700 font-bold">{language === 'hi' ? 'डिफ़ॉल्ट: 3 दिन पहले' : language === 'te' ? 'డిఫాల్ట్: 3 రోజుల ముందు' : 'Default: 3 Days Before'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.reminders.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.reminders.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {language === 'hi' ? 'स्थान: ' : language === 'te' ? 'ప్రాంతం: ' : 'Schedule: '}
                <strong className="text-slate-700">{userProfile.city || 'Bengaluru'}, {userProfile.country || 'India'}</strong>
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'hi' ? 'कोई डुप्लिकेट अलर्ट नहीं' : language === 'te' ? 'నకిలీ అలర్ట్‌లు లేవు' : 'No Duplicate Alerts'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-xs shadow-purple-300 transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t.reminders.addReminder}</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'settings' ? 'reminders' : 'settings')}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-purple-900 text-white border-purple-900'
                  : 'bg-white text-slate-700 border-purple-100 hover:bg-purple-50'
              }`}
            >
              <Settings className="w-4 h-4 text-purple-600" />
              <span>{t.reminders.customSettings}</span>
            </button>
          </div>
        </div>

        {/* 3-Day Rule Highlight Banner */}
        <div className="mt-6 pt-4 border-t border-purple-100/70 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span>
              <strong>{language === 'hi' ? 'क्लिनिकल 3-दिन नियम:' : language === 'te' ? 'క్లినికల్ 3-రోజుల నియమం:' : 'Clinical 3-Day Rule:'}</strong>{' '}
              {t.reminders.clinical3DayRule}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestPush}
              className="px-3 py-1 bg-white hover:bg-purple-50 text-purple-800 rounded-xl border border-purple-200 font-semibold text-[11px] shadow-2xs"
            >
              {reminderSettings.enableBrowserPush
                ? (language === 'hi' ? '✓ पुश सूचनाएं सक्रिय' : language === 'te' ? '✓ పుష్ నోటిఫికేషన్‌లు ప్రారంభించబడ్డాయి' : '✓ Push Enabled')
                : (language === 'hi' ? 'डिवाइस पुश सक्षम करें' : language === 'te' ? 'పరికర పుష్ ప్రారంభించండి' : 'Enable Device Push')}
            </button>
            {pushStatusMessage && (
              <span className="text-[11px] text-purple-700 font-medium animate-fadeIn">
                {pushStatusMessage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-purple-100/80 pb-2 overflow-x-auto gap-2 no-scrollbar">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'reminders'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{t.reminders.activeReminders} ({healthReminders.filter(r => !r.isCompleted).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('td_calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'td_calculator'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Syringe className="w-3.5 h-3.5 text-pink-500" />
            <span>{t.reminders.tdCalculator}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.reminders.customSettings}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.reminders.notificationHistory} ({notificationLogs.length})</span>
          </button>
        </div>

        {/* Global Disclaimer */}
        <span className="hidden lg:inline text-[11px] text-slate-400 italic">
          {language === 'hi'
            ? 'मुमोरा स्वास्थ्य जानकारी और रिमाइंडर प्रदान करता है, यह चिकित्सीय सलाह का विकल्प नहीं है।'
            : language === 'te'
            ? 'ముమోరా ఆరోగ్య సమాచారం మరియు రిమైండర్‌లను అందిస్తుంది, ఇది వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.'
            : 'Mumora provides health information and reminders, not a substitute for professional medical advice.'}
        </span>
      </div>

      {/* VIEW 1: ACTIVE REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-purple-100 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium px-2">{language === 'hi' ? 'श्रेणी:' : language === 'te' ? 'విభాగం:' : 'Category:'}</span>
              {(['all', 'vaccination', 'antenatal_checkup', 'medical_test', 'medication', 'nutrition'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-100 text-purple-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {getCategoryLabel(cat, language)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg ${filterStatus === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-500'}`}
              >
                {language === 'hi' ? 'सभी' : language === 'te' ? 'అన్నీ' : 'All'}
              </button>
              <button
                onClick={() => setFilterStatus('due_soon')}
                className={`px-2.5 py-1 rounded-lg ${filterStatus === 'due_soon' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500'}`}
              >
                {language === 'hi' ? '≤3 दिनों में देय' : language === 'te' ? '≤3 రోజుల్లో గడువు' : 'Due in ≤3 Days'}
              </button>
              <button
                onClick={() => setFilterStatus('overdue')}
                className={`px-2.5 py-1 rounded-lg ${filterStatus === 'overdue' ? 'bg-red-100 text-red-900 font-bold' : 'text-slate-500'}`}
              >
                {language === 'hi' ? 'अतिदेय' : language === 'te' ? 'గడువు ముగిసింది' : 'Overdue'}
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 rounded-lg ${filterStatus === 'completed' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-500'}`}
              >
                {t.common.completed}
              </button>
            </div>
          </div>

          {/* Reminders List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReminders.map(rem => {
              const status = calculateReminderStatus(rem.dueDate);
              const cardTitle = getReminderTitle(rem, language);
              const cardWhy = getReminderWhyShown(rem, language);
              const personLabel = getPersonLabel(rem.targetPerson, language);
              const catLabel = getCategoryLabel(rem.category, language);

              return (
                <div
                  key={rem.id}
                  className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md relative flex flex-col justify-between ${
                    rem.isCompleted
                      ? 'border-emerald-200/70 bg-emerald-50/20 opacity-75'
                      : status.isDueIn3Days
                      ? 'border-purple-300 ring-2 ring-purple-100'
                      : status.isOverdue
                      ? 'border-red-200'
                      : 'border-purple-100'
                  }`}
                >
                  <div>
                    {/* Header line: Person badge + Status badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-xl bg-purple-50 border border-purple-100 shrink-0">
                          {categoryIcons[rem.category]}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                          {personLabel} · {catLabel}
                        </span>
                      </div>

                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${status.badgeClass}`}>
                        {rem.isCompleted ? (language === 'hi' ? '✓ पूर्ण हुआ' : language === 'te' ? '✓ పూర్తయింది' : '✓ Completed') : getReminderStatusLabel(status, language)}
                      </span>
                    </div>

                    {/* Title & Timing */}
                    <h3 className={`text-base font-bold text-slate-900 leading-snug ${rem.isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {cardTitle}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        {rem.dueDate}
                      </span>
                      {rem.dueTime && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          {rem.dueTime}
                        </span>
                      )}
                      {rem.isDoctorConfirmed ? (
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                          {t.reminders.doctorConfirmed}
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                          {t.reminders.guidelineEstimate}
                        </span>
                      )}
                    </div>

                    {/* Why this reminder is shown */}
                    <p className="text-xs text-slate-600 mt-3 bg-[#FAF7F2] p-2.5 rounded-xl border border-purple-100/60 leading-relaxed">
                      <strong className="text-slate-800">{t.reminders.whyMatters}: </strong>
                      {cardWhy}
                    </p>

                    {rem.isSnoozed && (
                      <div className="mt-2 text-[11px] text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? `स्थगित: ${rem.snoozedUntil} तक` : language === 'te' ? `వాయిదా: ${rem.snoozedUntil} వరకు` : `Snoozed until ${rem.snoozedUntil}`}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => toggleReminderCompleted(rem.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        rem.isCompleted
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{rem.isCompleted ? t.reminders.markPending : t.reminders.markCompleted}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setReschedulingId(rem.id);
                          setNewRescheduleDate(rem.dueDate);
                        }}
                        className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg border border-slate-200 font-medium"
                        title={t.reminders.reschedule}
                      >
                        {t.reminders.reschedule}
                      </button>

                      <button
                        onClick={() => snoozeReminder(rem.id, 1)}
                        className="px-2.5 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-lg border border-amber-200 font-medium"
                        title={t.reminders.remindLater}
                      >
                        {t.reminders.remindLater}
                      </button>

                      <button
                        onClick={() => setViewDetailsId(rem.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                        title={t.reminders.viewDetails}
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteReminder(rem.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 rounded-lg"
                        title={t.reminders.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredReminders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-purple-100 p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">
                {t.reminders.emptyView}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {isHi
                  ? 'इस श्रेणी के सभी निर्धारित कार्य अद्यतित हैं। आप नया कस्टम रिमाइंडर जोड़ सकते हैं।'
                  : 'All scheduled tasks for this category are up to date. You can add a custom reminder or recalculate maternal Td doses.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: INTERACTIVE MATERNAL Td VACCINATION CALCULATOR */}
      {activeTab === 'td_calculator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                MoHFW India Universal Immunization Programme
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Pregnancy Td / Tdap Dose Schedule Calculator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates exact timing for Td-1, Td-2, Td-Booster, or third-trimester Tdap without guessing dates.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-purple-100/70 text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Current Gestation</span>
              <strong className="text-sm text-purple-900 font-extrabold">{pregnancy.currentWeek} Weeks</strong>
              <span className="text-[10px] text-slate-500 block">EDD: {pregnancy.estimatedDueDate}</span>
            </div>
          </div>

          {/* Interactive Form Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF7F2] p-5 rounded-2xl border border-purple-100/60">
            {/* Question 1: Pregnancy in last 3 years */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                1. Did you have a pregnancy within the last 3 years?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTdHadPregnancy3Yrs(true)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    tdHadPregnancy3Yrs
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Yes, within 3 years
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTdHadPregnancy3Yrs(false);
                    setTdReceived2Prior(false);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    !tdHadPregnancy3Yrs
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  No / First pregnancy
                </button>
              </div>
            </div>

            {/* Question 2: Received 2 Td doses in that prior pregnancy? */}
            {tdHadPregnancy3Yrs && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-slate-800 block">
                  2. Were 2 doses of Td/TT documented in that previous pregnancy?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTdReceived2Prior(true)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      tdReceived2Prior
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Yes, 2 doses received
                  </button>
                  <button
                    type="button"
                    onClick={() => setTdReceived2Prior(false)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      !tdReceived2Prior
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    No / Not verified
                  </button>
                </div>
              </div>
            )}

            {/* Question 3: Td-1 in current pregnancy */}
            {!tdHadPregnancy3Yrs && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Have you received Td-1 in this pregnancy?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTd1Received(true)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      td1Received
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Yes, Received
                  </button>
                  <button
                    type="button"
                    onClick={() => setTd1Received(false)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      !td1Received
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Not Yet / Pending
                  </button>
                </div>

                {td1Received && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-500 block mb-1">Date Td-1 Administered:</span>
                    <input
                      type="date"
                      value={td1Date}
                      onChange={e => setTd1Date(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clinical Recommendation Card Result */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl p-5 border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Next Recommended Step
              </span>
              <span className="text-xs font-extrabold text-purple-800 bg-white px-3 py-1 rounded-full border border-purple-200">
                Recommended: {tdEvaluation.recommendedDose}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {tdEvaluation.clinicalReason}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white/80 p-3 rounded-xl border border-purple-100">
                <span className="text-slate-400 block text-[10px]">Estimated Next Due Date</span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  {tdEvaluation.estimatedDueDate}
                </span>
                <span className="text-[10px] text-amber-700 block mt-1">
                  *Requires healthcare provider confirmation
                </span>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-purple-100">
                <span className="text-slate-400 block text-[10px]">Official Clinical Guideline</span>
                <span className="font-semibold text-slate-800 text-xs block mt-0.5">
                  {tdEvaluation.officialGuideline}
                </span>
                <a
                  href={tdEvaluation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-[10px] inline-flex items-center gap-1 mt-1 font-medium"
                >
                  <span>Verify Guideline</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleApplyTdToReminders}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply this Schedule to My Reminders (3-Day Rule Active)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CUSTOMIZABLE REMINDER SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Fully Customizable Reminder Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust timing rules, multiple notification alerts, preferred hours, and device channels.
              </p>
            </div>

            <button
              onClick={restoreDefaultReminderSettings}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-purple-50 font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore 3-Day Default Rules</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setting 1: Default Advance Notice Rule */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Advance Notification Lead Time</span>
                <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded-full">
                  Current: {reminderSettings.defaultAdvanceDays.join(', ')} Days Before
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Select which days prior to your appointment you wish to receive alerts:
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { days: 0, label: 'Due Date' },
                  { days: 1, label: '1 Day Before' },
                  { days: 2, label: '2 Days Before' },
                  { days: 3, label: '3 Days Before (Default)' },
                  { days: 5, label: '5 Days Before' },
                  { days: 7, label: '7 Days Before' },
                  { days: 14, label: '14 Days Before' },
                ].map(opt => {
                  const isSelected = reminderSettings.defaultAdvanceDays.includes(opt.days);
                  return (
                    <button
                      key={opt.days}
                      onClick={() => {
                        let newDays = isSelected
                          ? reminderSettings.defaultAdvanceDays.filter(d => d !== opt.days)
                          : [...reminderSettings.defaultAdvanceDays, opt.days];
                        if (newDays.length === 0) newDays = [3]; // Always keep at least 3
                        updateReminderSettings({ defaultAdvanceDays: newDays });
                      }}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all text-xs ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Setting 2: Preferred Time & Time Zone */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-purple-100 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Preferred Time of Day</span>
              <p className="text-xs text-slate-500">
                Morning delivery prevents disruptions during work or nighttime sleep:
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={reminderSettings.preferredTime}
                  onChange={e => updateReminderSettings({ preferredTime: e.target.value })}
                  className="bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold"
                />
                <span className="text-xs text-slate-500">
                  Local Timezone: <strong>{reminderSettings.timeZone}</strong>
                </span>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={reminderSettings.privacySafeLockScreen}
                    onChange={e => updateReminderSettings({ privacySafeLockScreen: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>
                    <strong>Privacy-Safe Notifications:</strong> Hide sensitive medical diagnostics on phone lock-screen
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Setting 3: Category Enable / Disable */}
          <div className="border border-purple-100 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">Active Health Categories</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {(Object.keys(reminderSettings.categories) as ReminderCategory[]).map(cat => {
                const config = reminderSettings.categories[cat];
                return (
                  <label
                    key={cat}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-purple-50/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={e => {
                        updateReminderSettings({
                          categories: {
                            ...reminderSettings.categories,
                            [cat]: { ...config, enabled: e.target.checked },
                          },
                        });
                      }}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-semibold capitalize text-slate-800">
                      {cat.replace('_', ' ')}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
            <span className="text-xs font-bold text-purple-900 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Live Notification Preview (Based on your current settings)
            </span>
            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-purple-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-slate-900 block">
                  Mumora · Maternal Td-2 Vaccination (Due in 3 days)
                </span>
                <p className="text-slate-600">
                  Scheduled for Oct 26 at 10:00 AM. 3-day reminder rule active. Consult Dr. Priya Venkatesh.
                </p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Scheduled at {reminderSettings.preferredTime} · Device Push & In-App Alerts
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: NOTIFICATION HISTORY & LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notification History & Logs</h2>
              <p className="text-xs text-slate-500">Record of scheduled, snoozed, and delivered reminders.</p>
            </div>
            <span className="text-xs text-slate-400">{notificationLogs.length} entries</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {notificationLogs.map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    log.status === 'delivered' ? 'bg-purple-500' : log.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <strong className="text-slate-800">{log.title}</strong>
                    <p className="text-slate-600 text-[11px]">{log.message}</p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.sentAt).toLocaleString()} · Channel: {log.channel}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => dismissNotificationLog(log.id)}
                  className="p-1 text-slate-300 hover:text-slate-600"
                  title="Dismiss log"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {notificationLogs.length === 0 && (
              <p className="text-center py-8 text-xs text-slate-400">
                No notification activity recorded yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM REMINDER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" />
                Add Confirmed Health Task or Vaccine
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title / Appointment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Third Trimester Growth Scan or Infant Tdap"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-purple-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-purple-200 rounded-xl px-3 py-2 text-slate-800"
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="antenatal_checkup">Antenatal Check-up</option>
                    <option value="medical_test">Diagnostic Lab Test</option>
                    <option value="medication">Medication / Supplement</option>
                    <option value="nutrition">Nutrition & Diet</option>
                    <option value="child_health">Child Health Check</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">For Whom</label>
                  <select
                    value={newTarget}
                    onChange={e => setNewTarget(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-purple-200 rounded-xl px-3 py-2 text-slate-800"
                  >
                    <option value="mother">Mother</option>
                    <option value="baby">Baby / Child</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-purple-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Time</label>
                  <input
                    type="time"
                    value={newDueTime}
                    onChange={e => setNewDueTime(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-purple-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Why is this scheduled?</label>
                <textarea
                  rows={2}
                  placeholder="Clinical reason, doctor instructions, or hospital name..."
                  value={newWhyShown}
                  onChange={e => setNewWhyShown(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-purple-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirmed_check"
                  checked={newIsDoctorConfirmed}
                  onChange={e => setNewIsDoctorConfirmed(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="confirmed_check" className="text-slate-700 cursor-pointer">
                  Confirmed by my Obstetrician / Pediatrician
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save (3-Day Rule Active)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESCHEDULE */}
      {reschedulingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-purple-100 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">
              {isHi ? 'रिमाइंडर का समय बदलें' : 'Reschedule Reminder'}
            </h3>
            <p className="text-slate-500">
              {isHi
                ? 'नई तारीख चुनें। 3-दिन पूर्व सूचना नियम स्वतः समायोजित हो जाएगा।'
                : 'Pick a new appointment or lab test date. Advance notices will adjust automatically.'}
            </p>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isHi ? 'नई तारीख' : 'New Due Date'}
              </label>
              <input
                type="date"
                value={newRescheduleDate}
                onChange={e => setNewRescheduleDate(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-purple-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingId(null)}
                className="px-3 py-1.5 border rounded-xl text-slate-600"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (reschedulingId && newRescheduleDate) {
                    rescheduleReminder(reschedulingId, newRescheduleDate);
                    setReschedulingId(null);
                  }
                }}
                className="px-4 py-1.5 bg-purple-600 text-white font-semibold rounded-xl"
              >
                {isHi ? 'सहेजें' : 'Save New Date'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DETAILS & CLINICAL GUIDELINES */}
      {viewDetailsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4 text-xs">
            {(() => {
              const rem = healthReminders.find(r => r.id === viewDetailsId);
              if (!rem) return null;
              const modalTitle = isHi ? (rem.titleHi || rem.title) : rem.title;
              const modalWhy = isHi ? (rem.whyShownHi || rem.whyShown) : rem.whyShown;

              return (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                    <h3 className="text-base font-bold text-slate-900">{modalTitle}</h3>
                    <button onClick={() => setViewDetailsId(null)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        {isHi ? 'नैदानिक आधार (क्लिनिकल कारण)' : 'Clinical Rationale'}
                      </span>
                      <p className="text-slate-700 font-medium mt-0.5">{modalWhy}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-purple-100/60">
                        <span className="text-slate-400 block text-[10px]">
                          {isHi ? 'स्रोत दिशानिर्देश' : 'Issuing Source'}
                        </span>
                        <strong className="text-slate-800">{rem.clinicalSource}</strong>
                      </div>
                      <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-purple-100/60">
                        <span className="text-slate-400 block text-[10px]">
                          {isHi ? 'अंतिम सत्यापन' : 'Last Verified Date'}
                        </span>
                        <strong className="text-slate-800">{rem.sourceVerifiedDate}</strong>
                      </div>
                    </div>

                    {rem.notes && (
                      <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                        <span className="text-purple-900 font-semibold block">
                          {isHi ? 'टिप्पणी:' : 'Notes:'}
                        </span>
                        <p className="text-slate-600 mt-0.5">{rem.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => setViewDetailsId(null)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold"
                    >
                      {isHi ? 'बंद करें' : 'Close'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
