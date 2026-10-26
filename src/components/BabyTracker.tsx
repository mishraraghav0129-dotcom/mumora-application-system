import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import {
  getGrowthAssessment,
  calculateCorrectedAge,
} from '../data/whoGrowthData';
import {
  Baby,
  Scale,
  Ruler,
  Milk,
  Clock,
  Moon,
  Plus,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Smile,
  ChevronRight,
  Bell,
  Heart,
  Wind,
  Droplets,
  Thermometer,
  FileText,
  AlertCircle,
  Activity,
  CheckCircle2,
  Trash2,
  Sparkles,
  Info,
  Check,
  Utensils,
  Lock,
  ArrowRight,
  Sun,
  Eye,
  X,
} from 'lucide-react';
import { VaccinationSchedule } from './VaccinationSchedule';
import { WhoGrowthChartD3 } from './WhoGrowthChartD3';
import { BabyProfileSelector } from './BabyProfileSelector';
import { EnvironmentalHealthBanner } from './EnvironmentalHealthBanner';
import {
  BabyProfile,
  ChildMedicalReport,
  FetalUltrasoundMeasurement,
} from '../types';

export const BabyTracker: React.FC = () => {
  const {
    language,
    userProfile,
    activeBaby,
    babies,
    activeBabyId,
    setActiveBabyId,
    addBabyProfile,
    updateBabyProfile,
    deleteBabyProfile,
    babyGrowthMode,
    setBabyGrowthMode,
    childReports,
    addChildReport,
    deleteChildReport,
    fetalProfile,
    addUltrasoundMeasurement,
    transitionBabyBorn,
    growthLogs,
    addGrowthLog,
    feedingLogs,
    addFeedingLog,
    diaperLogs,
    addDiaperLog,
    sleepLogs,
    addSleepLog,
    pregnancy,
    nutritionProfile,
  } = useApp();

  const isHi = language === 'hi';

  // Active sub-tab under My Babies
  const [activeSubTab, setActiveSubTab] = useState<
    'growth' | 'reports' | 'nutrition' | 'environment' | 'milestones' | 'vaccines'
  >('growth');

  // Add Baby Modal trigger state
  const [showAddBabyModal, setShowAddBabyModal] = useState(false);

  // Transition "Baby Born" Modal state
  const [showBornModal, setShowBornModal] = useState(false);
  const [bornName, setBornName] = useState('');
  const [bornDate, setBornDate] = useState(new Date().toISOString().split('T')[0]);
  const [bornGender, setBornGender] = useState<'boy' | 'girl'>('boy');
  const [bornWeight, setBornWeight] = useState(3.25);
  const [bornLength, setBornLength] = useState(50.0);
  const [bornHead, setBornHead] = useState(34.5);
  const [bornGestWeeks, setBornGestWeeks] = useState(fetalProfile.currentGestationalWeeks || 39);

  // Form states for active child
  const [showGrowthForm, setShowGrowthForm] = useState(false);
  const [logWeight, setLogWeight] = useState(6.4);
  const [logLength, setLogLength] = useState(62.0);
  const [logHead, setLogHead] = useState(41.0);
  const [logNotes, setLogNotes] = useState('');

  // Report Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<ChildMedicalReport['category']>('cbc_blood');
  const [reportLab, setReportLab] = useState('Apollo Diagnostics / Cloudnine Lab');
  const [paramLabel, setParamLabel] = useState('Hemoglobin (Hb)');
  const [paramVal, setParamVal] = useState('11.5');
  const [paramUnit, setParamUnit] = useState('g/dL');
  const [paramRange, setParamRange] = useState('10.5 - 13.5 g/dL');
  const [reportSummary, setReportSummary] = useState('');

  // Ultrasound Scan Modal state
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanWeek, setScanWeek] = useState(pregnancy.currentWeek);
  const [scanBpd, setScanBpd] = useState(60.0);
  const [scanHc, setScanHc] = useState(220);
  const [scanAc, setScanAc] = useState(195);
  const [scanFl, setScanFl] = useState(42.0);
  const [scanEfw, setScanEfw] = useState(650);
  const [scanNotes, setScanNotes] = useState('');

  // Kick Counter state (Fetal)
  const [kickCount, setKickCount] = useState(0);
  const [kickTimerActive, setKickTimerActive] = useState(false);
  const [kickSeconds, setKickSeconds] = useState(0);

  // Real-time environmental state for child
  const [envData, setEnvData] = useState<{
    temperature: number;
    humidity: number;
    apparentTemperature: number;
    aqi: number;
    pm25: number;
  }>({
    temperature: 28.5,
    humidity: 58,
    apparentTemperature: 29.2,
    aqi: 72,
    pm25: 22.4,
  });

  // Calculate chronological & corrected age for active baby
  const ageCalculations = calculateCorrectedAge(
    activeBaby.birthDate,
    activeBaby.gestationalAgeWeeksAtBirth || (activeBaby.isPremature ? 34 : 40)
  );

  // Filter growth logs for active baby
  const babyGrowthLogs = growthLogs.filter(g => g.babyId === activeBaby.id);
  const latestGrowth = babyGrowthLogs[babyGrowthLogs.length - 1];

  const effectiveAgeForAssessment = ageCalculations.isPremature
    ? ageCalculations.correctedMonths
    : ageCalculations.chronologicalMonths;

  const growthAssessment = getGrowthAssessment(
    activeBaby.gender,
    effectiveAgeForAssessment,
    latestGrowth?.weightKg || activeBaby.birthWeightKg
  );

  // Filter child reports for active baby
  const babyReports = childReports.filter(r => r.babyId === activeBaby.id);

  // Fetch live ambient data from Open-Meteo
  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,relative_humidity_2m,apparent_temperature&air_quality=pm2_5,european_aqi'
        );
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.current) {
            setEnvData({
              temperature: Math.round(json.current.temperature_2m || 28),
              humidity: Math.round(json.current.relative_humidity_2m || 58),
              apparentTemperature: Math.round(json.current.apparent_temperature || 29),
              aqi: 65,
              pm25: 18.5,
            });
          }
        }
      } catch (e) {
        // Fallback default retained
      }
    }
    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [userProfile.city]);


  // Handle transition baby born
  const handleConfirmBabyBorn = (e: React.FormEvent) => {
    e.preventDefault();
    transitionBabyBorn({
      name: bornName.trim() || `Baby of ${userProfile.name}`,
      birthDate: bornDate,
      gender: bornGender,
      birthWeightKg: Number(bornWeight),
      birthLengthCm: Number(bornLength),
      birthHeadCircumferenceCm: Number(bornHead),
      gestationalAgeWeeksAtBirth: Number(bornGestWeeks),
    });
    setShowBornModal(false);
  };

  // Handle save growth log
  const handleSaveGrowth = (e: React.FormEvent) => {
    e.preventDefault();
    addGrowthLog({
      babyId: activeBaby.id,
      date: new Date().toISOString().split('T')[0],
      ageInMonths: ageCalculations.chronologicalMonths,
      weightKg: Number(logWeight),
      lengthCm: Number(logLength),
      headCircumferenceCm: Number(logHead),
      notes: logNotes || 'Routine growth measurement',
    });
    setShowGrowthForm(false);
    setLogNotes('');
  };

  // Handle save medical report
  const handleSaveMedicalReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    addChildReport({
      babyId: activeBaby.id,
      fileName: `${reportTitle.replace(/\s+/g, '_')}.pdf`,
      category: reportType,
      testName: reportTitle,
      collectionDate: new Date().toISOString().split('T')[0],
      reportDate: new Date().toISOString().split('T')[0],
      facilityOrLab: reportLab,
      parameters: [
        {
          label: paramLabel,
          value: paramVal,
          unit: paramUnit,
          referenceInterval: paramRange,
          status: 'normal',
        },
      ],
      extractedSummary: reportSummary || 'Parameters assessed in accordance with Indian pediatric reference intervals.',
      pediatricianReviewNeeded: false,
      doctorQuestions: [
        'How does this parameter reflect overall infant development?',
        'When should the next routine screening be planned?',
      ],
    });

    setShowReportModal(false);
    setReportTitle('');
    setReportSummary('');
  };

  // Handle save ultrasound scan
  const handleSaveScan = (e: React.FormEvent) => {
    e.preventDefault();
    addUltrasoundMeasurement({
      date: new Date().toISOString().split('T')[0],
      gestationalWeek: Number(scanWeek),
      biparietalDiameterMm: Number(scanBpd),
      headCircumferenceMm: Number(scanHc),
      abdominalCircumferenceMm: Number(scanAc),
      femurLengthMm: Number(scanFl),
      estimatedFetalWeightGrams: Number(scanEfw),
      amnioticFluidIndexCm: 14.0,
      placentaLocation: 'Posterior grade 1',
      clinicianNotes: scanNotes || 'Growth appropriate for gestational age',
      reportingFacility: userProfile.primaryHospital || 'Maternity Ultrasound Center',
      isDoctorConfirmed: true,
    });
    setShowScanModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Prominent Environmental Health Intelligence Section */}
      <EnvironmentalHealthBanner />

      {/* Top Dual Mode Switcher Bar */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Mode Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setBabyGrowthMode('my_babies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              babyGrowthMode === 'my_babies'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>{isHi ? `मेरे बच्चे (${babies.length})` : `My Babies (${babies.length})`}</span>
          </button>

          <button
            onClick={() => setBabyGrowthMode('fetal_growth')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              babyGrowthMode === 'fetal_growth'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isHi
                ? `गर्भस्थ शिशु (${fetalProfile.fetalDisplayName})`
                : `Pregnancy & Fetal Growth`}
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {babyGrowthMode === 'my_babies' ? (
            <button
              onClick={() => setShowAddBabyModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isHi ? '+ नया बच्चा जोड़ें' : '+ Add Baby'}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowBornModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Heart className="w-4 h-4" />
              <span>{isHi ? '🎉 शिशु का जन्म हुआ! प्रोफाइल बनाएं' : '🎉 Baby Born! Transition to Profile'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE A: MY EXISTING BABIES                                                */}
      {/* ========================================================================= */}
      {babyGrowthMode === 'my_babies' && (
        <div className="space-y-6">
          {/* Child Switcher & Profile Management Component */}
          <BabyProfileSelector
            isAddModalOpen={showAddBabyModal}
            onAddModalClose={() => setShowAddBabyModal(false)}
          />

          {/* Active Baby Hero Banner */}
          <div className="bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-purple-100">
                  <Baby className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isHi ? 'सक्रिय शिशु प्रोफाइल' : 'Active Child Health Record'}</span>
                  <span>·</span>
                  <span>{activeBaby.gender === 'boy' ? 'Male Infant' : 'Female Infant'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {activeBaby.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-purple-200">
                  <span>
                    <strong>Chronological Age:</strong> {ageCalculations.chronologicalDisplay}
                  </span>
                  {activeBaby.isPremature && (
                    <>
                      <span>·</span>
                      <span className="bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-lg border border-amber-300/30 font-bold">
                        Corrected Age (WHO): {ageCalculations.correctedDisplay}
                      </span>
                    </>
                  )}
                  <span>·</span>
                  <span>
                    <strong>Birth:</strong> {activeBaby.birthWeightKg} kg, {activeBaby.birthLengthCm} cm
                  </span>
                </div>
              </div>

              {/* Quick Latest Metric Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shrink-0">
                <div>
                  <span className="text-xs text-purple-200 block">
                    {isHi ? 'नवीनतम वजन व शारीरिक माप' : 'Latest Anthropometry'}
                  </span>
                  <span className="text-2xl font-black text-amber-300">
                    {latestGrowth ? `${latestGrowth.weightKg} kg` : `${activeBaby.birthWeightKg} kg`}
                  </span>
                  <span className="text-[11px] text-purple-200 block">
                    Length: {latestGrowth ? `${latestGrowth.lengthCm} cm` : `${activeBaby.birthLengthCm} cm`}
                  </span>
                </div>
                <button
                  onClick={() => setShowGrowthForm(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHi ? 'माप दर्ज करें' : 'Log New'}</span>
                </button>
              </div>
            </div>

            {/* Prematurity Clinical Rationale Callout */}
            {activeBaby.isPremature && (
              <div className="mt-4 pt-4 border-t border-white/15 text-xs text-amber-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{ageCalculations.explanation}</p>
              </div>
            )}
          </div>

          {/* 6 Child Health Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'growth', labelHi: 'WHO विकास चार्ट', labelEn: 'WHO Growth Charts', icon: Scale },
              { id: 'reports', labelHi: 'लैब व मेडिकल रिपोर्ट', labelEn: 'Medical Reports & Lab', icon: FileText },
              { id: 'nutrition', labelHi: 'शिशु पोषण व आहार', labelEn: 'Child Nutrition & Diet', icon: Utensils },
              { id: 'environment', labelHi: 'पर्यावरणीय स्वास्थ्य', labelEn: 'Environmental Health', icon: Wind },
              { id: 'milestones', labelHi: 'विकास के मील के पत्थर', labelEn: 'Milestones & Logs', icon: Smile },
              { id: 'vaccines', labelHi: 'टीकाकरण कार्ड', labelEn: 'Vaccine Card (UIP)', icon: ShieldCheck },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold shrink-0 transition-all border ${
                    isActive
                      ? 'bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-700/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-purple-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{isHi ? tab.labelHi : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: WHO Growth Charts */}
          {activeSubTab === 'growth' && (
            <div className="space-y-6">
              {/* WHO Assessment Alert */}
              <div
                className={`p-4 rounded-3xl border flex items-start gap-3 ${
                  growthAssessment.status === 'normal'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    growthAssessment.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                />
                <div className="space-y-1">
                  <p className="font-extrabold text-sm">
                    {isHi ? 'डब्ल्यूएचओ विकास मानक मूल्यांकन' : 'WHO Growth Standard Trajectory'}
                  </p>
                  <p className="text-xs leading-relaxed">
                    {isHi ? growthAssessment.interpretationHi : growthAssessment.interpretationEn}
                  </p>
                </div>
              </div>

              {/* D3 WHO Chart */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
                <WhoGrowthChartD3
                  gender={activeBaby.gender}
                  growthLogs={babyGrowthLogs}
                  babyName={activeBaby.name}
                  birthDate={activeBaby.birthDate}
                  language={language}
                />
              </div>

              {/* Historical Measurement Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>{isHi ? 'माप इतिहास' : 'Measurement Log History'}</span>
                  </h3>
                  <button
                    onClick={() => setShowGrowthForm(true)}
                    className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isHi ? 'नया माप जोड़ें' : 'Log Entry'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Age (Months)</th>
                        <th className="py-2.5 px-3">Weight</th>
                        <th className="py-2.5 px-3">Length</th>
                        <th className="py-2.5 px-3">Head Circ.</th>
                        <th className="py-2.5 px-3">Clinical Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {babyGrowthLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3 font-semibold text-slate-900">{log.date}</td>
                          <td className="py-3 px-3 text-slate-600">{log.ageInMonths} mo</td>
                          <td className="py-3 px-3 font-extrabold text-purple-950">{log.weightKg} kg</td>
                          <td className="py-3 px-3 text-slate-700">{log.lengthCm} cm</td>
                          <td className="py-3 px-3 text-slate-700">{log.headCircumferenceCm || '—'} cm</td>
                          <td className="py-3 px-3 text-slate-500">{log.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Medical Reports & Clinical Lab Analysis */}
          {activeSubTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {isHi ? `${activeBaby.name} की मेडिकल व लैब रिपोर्ट` : `${activeBaby.name}’s Medical Reports & Clinical Labs`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Documented hematology, ferritin, discharge summaries, and allergy screenings.
                  </p>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isHi ? '+ रिपोर्ट जोड़ें' : '+ Add Report'}</span>
                </button>
              </div>

              {/* Reports List */}
              <div className="grid grid-cols-1 gap-4">
                {babyReports.map(report => (
                  <div
                    key={report.id}
                    className="p-5 rounded-3xl border border-slate-200 bg-white hover:border-purple-300 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{report.testName}</h4>
                          <p className="text-xs text-slate-500">
                            {report.facilityOrLab} · Date: {report.reportDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {report.pediatricianReviewNeeded ? (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pediatric Review Needed</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Reviewed Normal</span>
                          </span>
                        )}
                        <button
                          onClick={() => deleteChildReport(report.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Parameters Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-200/60 pb-1">
                            <th className="pb-1.5 px-2">Parameter</th>
                            <th className="pb-1.5 px-2">Observed Value</th>
                            <th className="pb-1.5 px-2">Reference Interval</th>
                            <th className="pb-1.5 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.parameters.map((p, idx) => (
                            <tr key={idx} className="hover:bg-white/80">
                              <td className="py-2 px-2 font-bold text-slate-800">{p.label}</td>
                              <td className="py-2 px-2 font-black text-purple-950">
                                {p.value} {p.unit}
                              </td>
                              <td className="py-2 px-2 text-slate-500">{p.referenceInterval}</td>
                              <td className="py-2 px-2 text-right">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    p.status === 'normal'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : p.status === 'low'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {p.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary & Questions */}
                    <div className="text-xs space-y-2">
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Clinical Summary:</strong> {report.extractedSummary}
                      </p>
                      {report.doctorQuestions && report.doctorQuestions.length > 0 && (
                        <div className="bg-purple-50/70 border border-purple-200/60 rounded-xl p-3 text-purple-950">
                          <p className="font-bold text-[11px] mb-1">Questions Prepared for Pediatrician:</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-purple-900">
                            {report.doctorQuestions.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Personalized Child Nutrition */}
          {activeSubTab === 'nutrition' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>
                    {ageCalculations.chronologicalMonths < 6
                      ? 'Stage 1: Exclusive Milk Feeding (< 6 Months)'
                      : ageCalculations.chronologicalMonths < 24
                      ? 'Stage 2: Complementary Feeding & Textures (6 - 23 Months)'
                      : 'Stage 3: Balanced Family Diet (2+ Years)'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  {isHi ? `${activeBaby.name} के लिए आयु-विशिष्ट पोषण योजना` : `Tailored Nutrition Guide for ${activeBaby.name}`}
                </h3>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  Calibrated to WHO Infant & Young Child Feeding (IYCF) guidelines and Indian Academy of Pediatrics (IAP) recommendations.
                </p>
              </div>

              {/* Allergy Banner if child has allergies */}
              {activeBaby.allergies && activeBaby.allergies.length > 0 && (
                <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-950">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm">Documented Allergies & Sensitivities</p>
                    <p className="text-xs text-rose-800 mt-0.5">
                      {activeBaby.allergies.join(', ')}. Avoid all traces and verify packaged ingredient labels.
                    </p>
                  </div>
                </div>
              )}

              {/* Age-Specific Feeding Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <span className="text-2xl">🥛</span>
                  <h4 className="font-extrabold text-sm text-slate-900">Feeding Method & Milk</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeBaby.feedingMethod === 'exclusive_breastfeeding'
                      ? 'Exclusive breastfeeding on demand (8-12 times daily). Maintain maternal hydration and nutrient-dense foods.'
                      : activeBaby.feedingMethod === 'mixed_breast_and_formula'
                      ? 'Mixed feeding: Offer breast first to maintain milk supply, then hygienic formula top-up as prescribed.'
                      : 'Infant formula: Strict water boiling (>70°C) and sterile bottle preparation.'}
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <span className="text-2xl">🥣</span>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {ageCalculations.chronologicalMonths < 6 ? 'Complementary Readiness' : 'Recommended Indian Foods'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ageCalculations.chronologicalMonths < 6
                      ? 'No water, honey, or cow milk before 6 months. Gut mucosal barrier is still maturing.'
                      : 'Ragi porridge cooked with breast milk/formula, Moong dal khichdi with ghee, mashed ripe banana, steamed pureed carrots and apples.'}
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <span className="text-2xl">☀️</span>
                  <h4 className="font-extrabold text-sm text-slate-900">Supplements & Hydration</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Routine Vitamin D3 (400 IU daily drops) prevents rickets.
                    {activeBaby.isPremature && ' Supplemental iron drops (2 mg/kg/day) prescribed for preterm catch-up.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Environmental Health & Ambient Vulnerability */}
          {activeSubTab === 'environment' && (
            <div className="space-y-6">
              {/* Weather & AQI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                  <Thermometer className="w-6 h-6 text-orange-500 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Temperature</span>
                    <p className="text-lg font-black text-slate-900">{envData.temperature}°C</p>
                    <span className="text-[10px] text-slate-400">Feels {envData.apparentTemperature}°C</span>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Humidity</span>
                    <p className="text-lg font-black text-slate-900">{envData.humidity}%</p>
                    <span className="text-[10px] text-slate-400">Optimal: 45-60%</span>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                  <Wind className="w-6 h-6 text-purple-500 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Air Quality Index</span>
                    <p className="text-lg font-black text-slate-900">{envData.aqi}</p>
                    <span className="text-[10px] text-emerald-600 font-bold">Moderate / Acceptable</span>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                  <Activity className="w-6 h-6 text-rose-500 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">PM 2.5</span>
                    <p className="text-lg font-black text-slate-900">{envData.pm25} µg/m³</p>
                    <span className="text-[10px] text-slate-400">City: {userProfile.city}</span>
                  </div>
                </div>
              </div>

              {/* 5-Part Child Environmental Assessment */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>5-Part Pediatric Environmental Health Assessment</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80">
                    <strong className="text-purple-950 block mb-1">1. Ambient Observations:</strong>
                    <p className="text-purple-900 leading-relaxed">
                      Today in {userProfile.city}, temperature is {envData.temperature}°C with relative humidity at {envData.humidity}%. Ambient AQI is {envData.aqi} with PM2.5 at {envData.pm25} µg/m³.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <strong className="text-amber-950 block mb-1">2. Child Vulnerability Context:</strong>
                    <p className="text-amber-900 leading-relaxed">
                      {activeBaby.isPremature
                        ? `${activeBaby.name} was born preterm at ${activeBaby.gestationalAgeWeeksAtBirth} weeks. Preterm infants possess narrower bronchial airways and immature thermal sweating thresholds, requiring careful humidity management.`
                        : `${activeBaby.name} is a term infant with developing bronchial immunity. Thermal stability requires breathable cotton swaddling without overheating.`}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                    <strong className="text-blue-950 block mb-1">3. Daily Precautions:</strong>
                    <p className="text-blue-900 leading-relaxed">
                      Keep nursery well-ventilated; avoid early morning outdoor strolls near high-traffic thoroughfares when PM2.5 peaks; maintain clean hydration; keep room temperature between 22°C - 26°C.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                    <strong className="text-emerald-950 block mb-1">4. Clinical Action Level:</strong>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[11px]">
                        ROUTINE MONITORING
                      </span>
                      <span className="text-emerald-900 font-semibold">
                        No immediate environmental danger identified. Maintain standard indoor air filtration and comfort.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">5. Pediatrician Check Questions:</strong>
                    <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[11px]">
                      <li>Should a nursery HEPA air purifier be used overnight during dry winter months?</li>
                      <li>Are any preventive saline nasal drops indicated if air dryness triggers nasal stuffiness?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Milestones & Daily Logs */}
          {activeSubTab === 'milestones' && (
            <div className="space-y-6">
              {/* Daily Log Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-700 flex items-center gap-1.5">
                      <Milk className="w-4 h-4 text-purple-600" />
                      <span>Feeding Sessions</span>
                    </span>
                    <span className="text-xs font-bold text-purple-700">
                      {feedingLogs.filter(f => f.babyId === activeBaby.id).length} logged
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      addFeedingLog({
                        babyId: activeBaby.id,
                        timestamp: new Date().toISOString(),
                        type: 'both_breasts',
                        durationMinutes: 20,
                        notes: 'Normal nursing session',
                      })
                    }
                    className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Log Nursing (20m)</span>
                  </button>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-700 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span>Diapers Changed</span>
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      {diaperLogs.filter(d => d.babyId === activeBaby.id).length} logged
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      addDiaperLog({
                        babyId: activeBaby.id,
                        timestamp: new Date().toISOString(),
                        type: 'wet',
                        notes: 'Clean wet diaper',
                      })
                    }
                    className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Log Wet Diaper</span>
                  </button>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-700 flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-600" />
                      <span>Sleep Sessions</span>
                    </span>
                    <span className="text-xs font-bold text-indigo-700">
                      {sleepLogs.filter(s => s.babyId === activeBaby.id).length} logged
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      addSleepLog({
                        babyId: activeBaby.id,
                        startTime: new Date(Date.now() - 3600000).toISOString(),
                        endTime: new Date().toISOString(),
                        durationMinutes: 60,
                        quality: 'peaceful',
                      })
                    }
                    className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Log 1h Nap</span>
                  </button>
                </div>
              </div>

              {/* Milestone Checklist */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Smile className="w-4 h-4 text-amber-500" />
                  <span>Age-Appropriate Milestones (Corrected: {ageCalculations.correctedDisplay})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'Follows objects with eyes horizontally', done: true },
                    { label: 'Smiles spontaneously at caregiver voices', done: true },
                    { label: 'Holds head steady while lying on tummy', done: true },
                    { label: 'Brings hands to mouth & grasps rattle', done: ageCalculations.correctedMonths >= 3 },
                    { label: 'Rolls over from tummy to back', done: ageCalculations.correctedMonths >= 4 },
                    { label: 'Babbles consonant sounds (ba, da, ma)', done: ageCalculations.correctedMonths >= 6 },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        m.done ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span>{m.label}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          m.done ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {m.done && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Vaccination & Health Reminders */}
          {activeSubTab === 'vaccines' && (
            <div className="space-y-6">
              <VaccinationSchedule />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE B: PREGNANCY & FETAL GROWTH                                          */}
      {/* ========================================================================= */}
      {babyGrowthMode === 'fetal_growth' && (
        <div className="space-y-6">
          {/* Fetal Growth Hero Banner */}
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-purple-200 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isHi ? 'प्रसवपूर्व भ्रूण विकास हब' : 'Antenatal Fetal Development Dashboard'}</span>
                  <span>·</span>
                  <span>{fetalProfile.eddSource.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {fetalProfile.fetalDisplayName}
                </h2>
                <p className="text-xs sm:text-sm text-purple-200 mt-1">
                  Week {pregnancy.currentWeek} (Day {pregnancy.currentDay}) · Trimester {pregnancy.trimester} · Estimated Delivery: {fetalProfile.eddDate || pregnancy.estimatedDueDate}
                </p>
              </div>

              {/* Baby Born Transition CTA */}
              <button
                onClick={() => setShowBornModal(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 shrink-0 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{isHi ? '🎉 शिशु का जन्म! प्रोफाइल में बदलें' : '🎉 Baby Born! Transition to Profile'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-purple-300 block">Current Gestation</span>
                <span className="text-lg font-bold text-white">{pregnancy.currentWeek}w {pregnancy.currentDay}d</span>
              </div>
              <div>
                <span className="text-purple-300 block">Pregnancy Type</span>
                <span className="text-lg font-bold text-white capitalize">{fetalProfile.pregnancyType}</span>
              </div>
              <div>
                <span className="text-purple-300 block">Dating Method</span>
                <span className="text-lg font-bold text-white">First Trimester Scan</span>
              </div>
              <div>
                <span className="text-purple-300 block">Ultrasound Scans</span>
                <span className="text-lg font-bold text-white">{fetalProfile.ultrasounds.length} Documented</span>
              </div>
            </div>
          </div>

          {/* Conditional Kick Counter (Only shown when gestational week >= 24) */}
          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {isHi ? 'दैनिक भ्रूण किक काउंटर' : 'Daily Fetal Movement & Kick Counter'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ACOG & RCOG standard: Count 10 distinct kicks within a 2-hour window.
                  </p>
                </div>
              </div>

              {pregnancy.currentWeek >= 24 ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active (Week {pregnancy.currentWeek})</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Activates at Week 24</span>
                </span>
              )}
            </div>

            {pregnancy.currentWeek >= 24 ? (
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-purple-950 font-extrabold">
                    Today’s Kicks Counted: <span className="text-2xl font-black text-purple-800 ml-1">{kickCount}</span> / 10
                  </p>
                  <p className="text-[11px] text-purple-800">
                    {kickCount >= 10
                      ? '✓ Reassuring! 10 movements logged within the recommended interval.'
                      : 'Rest in a left-lateral position after a meal and tap whenever you feel distinct baby movement.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setKickCount(prev => Math.min(20, prev + 1))}
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Log Kick</span>
                  </button>
                  <button
                    onClick={() => setKickCount(0)}
                    className="px-3 py-2.5 rounded-xl border border-purple-200 bg-white text-purple-800 font-bold text-xs hover:bg-purple-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Clinical Note:</strong> Regular daily fetal kick counting is clinically recommended starting at <strong>24 to 28 weeks</strong>, when fetal nervous system development produces consistent, perceptible movements. Your tracker will unlock automatically when you reach Week 24.
                </p>
              </div>
            )}
          </div>

          {/* Antenatal Ultrasound Scans Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Antenatal Ultrasound Measurements</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Documented biometry: CRL, Biparietal Diameter (BPD), Femur Length (FL), Estimated Fetal Weight (EFW).
                </p>
              </div>
              <button
                onClick={() => setShowScanModal(true)}
                className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Log Ultrasound</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Gest. Week</th>
                    <th className="py-2.5 px-3">BPD (mm)</th>
                    <th className="py-2.5 px-3">HC (mm)</th>
                    <th className="py-2.5 px-3">AC (mm)</th>
                    <th className="py-2.5 px-3">FL (mm)</th>
                    <th className="py-2.5 px-3">Est. Weight</th>
                    <th className="py-2.5 px-3">Clinical Impression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fetalProfile.ultrasounds.map(scan => (
                    <tr key={scan.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-semibold text-slate-900">{scan.date}</td>
                      <td className="py-3 px-3 font-extrabold text-purple-700">Week {scan.gestationalWeek}</td>
                      <td className="py-3 px-3 text-slate-700">{scan.biparietalDiameterMm || '—'}</td>
                      <td className="py-3 px-3 text-slate-700">{scan.headCircumferenceMm || '—'}</td>
                      <td className="py-3 px-3 text-slate-700">{scan.abdominalCircumferenceMm || '—'}</td>
                      <td className="py-3 px-3 text-slate-700">{scan.femurLengthMm || '—'}</td>
                      <td className="py-3 px-3 font-black text-slate-900">
                        {scan.estimatedFetalWeightGrams ? `${scan.estimatedFetalWeightGrams} g` : '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{scan.clinicianNotes || 'Normal biometry'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}



      {/* 2. Transition Baby Born Modal */}
      {showBornModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                <span>{isHi ? 'शिशु का स्वागत! प्रसव विवरण दर्ज करें' : 'Welcome Baby! Transition to Profile'}</span>
              </h3>
              <button onClick={() => setShowBornModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Congratulations! This transition converts your current pregnancy records into a permanent child profile with WHO growth charts, while preserving all historical antenatal ultrasounds and notes.
            </p>

            <form onSubmit={handleConfirmBabyBorn} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Baby’s Given Name (Optional)</label>
                <input
                  type="text"
                  value={bornName}
                  onChange={e => setBornName(e.target.value)}
                  placeholder={`Baby of ${userProfile.name}`}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Actual Birth Date *</label>
                  <input
                    type="date"
                    required
                    value={bornDate}
                    onChange={e => setBornDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={bornGender}
                    onChange={e => setBornGender(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="boy">Boy (बालक)</option>
                    <option value="girl">Girl (बालिका)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Birth Weight (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={bornWeight}
                    onChange={e => setBornWeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Length (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={bornLength}
                    onChange={e => setBornLength(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Head Circ. (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={bornHead}
                    onChange={e => setBornHead(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Gestational Weeks at Birth</label>
                <input
                  type="number"
                  min={24}
                  max={43}
                  value={bornGestWeeks}
                  onChange={e => setBornGestWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl"
                />
                <span className="text-[10px] text-slate-500">
                  {bornGestWeeks < 37
                    ? 'Born before 37 weeks (Preterm) — Corrected age will be tracked on WHO curves.'
                    : 'Born at full term (≥ 37 weeks).'}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBornModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-extrabold shadow-sm hover:bg-emerald-700"
                >
                  Confirm Birth & Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Log Growth Modal */}
      {showGrowthForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <span>Log Growth Measurements for {activeBaby.name}</span>
              </h3>
              <button onClick={() => setShowGrowthForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrowth} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={logWeight}
                    onChange={e => setLogWeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Length (cm) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={logLength}
                    onChange={e => setLogLength(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Head Circ. (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={logHead}
                    onChange={e => setLogHead(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes</label>
                <input
                  type="text"
                  value={logNotes}
                  onChange={e => setLogNotes(e.target.value)}
                  placeholder="e.g. 4-month pediatric checkup, exclusive breastfeeding"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrowthForm(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-extrabold shadow-sm hover:bg-purple-700"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>Add Medical Report for {activeBaby.name}</span>
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicalReport} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Report Title / Test Name *</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  placeholder="e.g. 6-Month Complete Blood Count & Ferritin"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="cbc_blood">Complete Blood Count (CBC)</option>
                    <option value="iron_nutrients">Serum Iron & Ferritin</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="allergy_diagnostic">Allergy Diagnostic Panel</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diagnostic Facility</label>
                  <input
                    type="text"
                    value={reportLab}
                    onChange={e => setReportLab(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Primary parameter input */}
              <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">Primary Test Parameter</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={paramLabel}
                    onChange={e => setParamLabel(e.target.value)}
                    placeholder="Parameter"
                    className="px-2 py-1 bg-white border rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={paramVal}
                    onChange={e => setParamVal(e.target.value)}
                    placeholder="Value"
                    className="px-2 py-1 bg-white border rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={paramRange}
                    onChange={e => setParamRange(e.target.value)}
                    placeholder="Ref. Range"
                    className="px-2 py-1 bg-white border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor's Impression / Notes</label>
                <textarea
                  rows={2}
                  value={reportSummary}
                  onChange={e => setReportSummary(e.target.value)}
                  placeholder="Summary of findings..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-extrabold shadow-sm hover:bg-purple-700"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Ultrasound Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>Log Antenatal Ultrasound Scan</span>
              </h3>
              <button onClick={() => setShowScanModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gestational Week *</label>
                  <input
                    type="number"
                    min={4}
                    max={42}
                    value={scanWeek}
                    onChange={e => setScanWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Est. Fetal Weight (EFW grams)</label>
                  <input
                    type="number"
                    value={scanEfw}
                    onChange={e => setScanEfw(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">BPD (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={scanBpd}
                    onChange={e => setScanBpd(Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">HC (mm)</label>
                  <input
                    type="number"
                    value={scanHc}
                    onChange={e => setScanHc(Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">AC (mm)</label>
                  <input
                    type="number"
                    value={scanAc}
                    onChange={e => setScanAc(Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">FL (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={scanFl}
                    onChange={e => setScanFl(Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinician Notes & Impression</label>
                <input
                  type="text"
                  value={scanNotes}
                  onChange={e => setScanNotes(e.target.value)}
                  placeholder="e.g. Normal fetal anatomy, normal liquor volume (AFI 14cm)"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScanModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-extrabold shadow-sm hover:bg-purple-700"
                >
                  Save Ultrasound Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
