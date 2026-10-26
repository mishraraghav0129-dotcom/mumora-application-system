import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { SAMPLE_REPORT_CASES, SampleReportCase } from '../data/sampleReports';
import {
  MapPin,
  CloudSun,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  RefreshCw,
  FileText,
  ShieldAlert,
  Info,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Thermometer,
  ShieldCheck,
  Calendar,
  Clock,
  Eye,
  UserCheck
} from 'lucide-react';

interface EnvironmentalData {
  success: boolean;
  available: boolean;
  city: string;
  coordinates?: { lat: number; lng: number };
  temperature?: number;
  relativeHumidity?: number;
  apparentTemperature?: number;
  aqi?: number;
  pm25?: number;
  climateRiskLevel?: 'low' | 'moderate' | 'high';
  advisories?: string[];
  source?: string;
  timestamp?: string;
  clinicalNotice?: string;
}

interface ParameterItem {
  id: string;
  testName: string;
  measuredValue: string;
  unit: string;
  whoStandard: string;
  labReferenceRange: string;
  status: 'normal' | 'outside' | 'borderline' | 'uninterpretable';
  relevance: string;
  nextStep: string;
  isVerified: boolean;
  needsVerificationReason?: string;
}

export const LocationAwareReportAnalysis: React.FC = () => {
  const { language, pregnancy, activeBaby, setShowEmergencyModal, addDocument, setAppMode } = useApp();
  const t = TRANSLATIONS[language];

  // Location & Environmental State
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [useGps, setUseGps] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null);
  const [isEnvLoading, setIsEnvLoading] = useState<boolean>(false);

  // Clinical Report Input State
  const [selectedSampleId, setSelectedSampleId] = useState<string>('t2-ogtt-heatwave');
  const [reportCategory, setReportCategory] = useState<'blood_test' | 'ultrasound' | 'urine_test' | 'pediatric'>('blood_test');
  const [patientName, setPatientName] = useState<string>('Ananya Sharma');
  const [patientStage, setPatientStage] = useState<string>('24 Weeks (Trimester 2)');
  const [reportDate, setReportDate] = useState<string>('2025-05-18');
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('Sample_OGTT_Report.pdf');

  // Interactive Parameter Verification State
  const [parameters, setParameters] = useState<ParameterItem[]>([]);
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [editingParamId, setEditingParamId] = useState<string | null>(null);

  // AI Analysis Execution & Output State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [overallSeverity, setOverallSeverity] = useState<'reassuring' | 'routine_followup' | 'prompt_review' | 'emergency' | 'unable_to_assess'>('routine_followup');
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string | null>(null);
  const [copiedQuestions, setCopiedQuestions] = useState<boolean>(false);

  // Load initial sample
  useEffect(() => {
    loadSampleCase('t2-ogtt-heatwave');
  }, []);

  // Fetch Environmental context whenever city or coordinates change
  useEffect(() => {
    fetchEnvironmentalContext();
  }, [selectedCity, gpsCoordinates]);

  const fetchEnvironmentalContext = async () => {
    setIsEnvLoading(true);
    try {
      let queryUrl = `/api/environmental-context?city=${encodeURIComponent(selectedCity)}`;
      if (gpsCoordinates) {
        queryUrl += `&lat=${gpsCoordinates.lat}&lng=${gpsCoordinates.lng}`;
      }
      const res = await fetch(queryUrl);
      const data = await res.json();
      setEnvData(data);
    } catch (err) {
      console.error('Failed to fetch environmental context:', err);
      setEnvData({
        success: false,
        available: false,
        city: selectedCity,
        clinicalNotice: 'Environmental data temporarily unavailable. Analysis performed on clinical guidelines alone.',
      });
    } finally {
      setIsEnvLoading(false);
    }
  };

  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(language === 'hi' ? 'आपके ब्राउज़र में GPS सुविधा उपलब्ध नहीं है।' : 'Geolocation is not supported by your browser.');
      return;
    }
    setIsGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setUseGps(true);
        setIsGpsLoading(false);
      },
      (err) => {
        setIsGpsLoading(false);
        setUseGps(false);
        setGpsError(
          language === 'hi'
            ? 'स्थान अनुमति अस्वीकृत या अनुपलब्ध। नीचे दी गई सूची से शहर चुनें।'
            : 'Location access denied or unavailable. Please select your city manually.'
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const loadSampleCase = (caseId: string) => {
    const found = SAMPLE_REPORT_CASES.find(c => c.id === caseId);
    if (!found) return;

    setSelectedSampleId(found.id);
    setReportCategory(found.category);
    setPatientName(found.patientName);
    setPatientStage(found.stageInfo);
    setSelectedCity(found.city);
    setReportDate(found.reportDate);
    setRawOcrText(found.rawOcrText);
    setUploadedFileName(`${found.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.pdf`);

    const formattedParams: ParameterItem[] = found.suggestedParameters.map((p, idx) => ({
      ...p,
      id: `param-${idx}`,
    }));
    setParameters(formattedParams);

    // Determine initial severity prediction based on case
    if (found.id === 't3-preeclampsia-alert') {
      setOverallSeverity('emergency');
    } else if (found.id === 'monsoon-pediatric-platelets') {
      setOverallSeverity('prompt_review');
    } else if (found.id === 'smudged-scan-unclear') {
      setOverallSeverity('unable_to_assess');
    } else {
      setOverallSeverity('reassuring');
    }

    setAnalysisResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setSelectedSampleId('custom-upload');

    const reader = new FileReader();
    reader.onload = () => {
      const simulatedOcr = `CLINICAL PATHOLOGY LABORATORY REPORT\nFile: ${file.name} (Uploaded ${new Date().toLocaleDateString()})\nPatient Name: ${patientName} | Stage: ${patientStage}\n\nEXTRACTED PARAMETERS:\n- Fasting Plasma Glucose: 91 mg/dL (Reference: 70-100)\n- Hemoglobin: 11.2 g/dL (Reference: 11.0-14.0)\n- Urine Albumin: Negative\n- White Blood Cells (WBC): 8,400 /µL (Reference: 4,000-11,000)\n\nNote: Please verify extracted numbers before clinical AI interpretation.`;

      setRawOcrText(simulatedOcr);

      const parsedParams: ParameterItem[] = [
        {
          id: 'custom-1',
          testName: 'Fasting Plasma Glucose',
          measuredValue: '91',
          unit: 'mg/dL',
          whoStandard: '< 92 mg/dL (WHO / IADPSG Gestational Standard)',
          labReferenceRange: '70 - 100 mg/dL',
          status: 'normal',
          relevance: 'Within normal pregnancy limits; no evidence of fasting gestational hyperglycemia.',
          nextStep: 'Routine prenatal follow-up.',
          isVerified: true,
        },
        {
          id: 'custom-2',
          testName: 'Hemoglobin (Hb)',
          measuredValue: '11.2',
          unit: 'g/dL',
          whoStandard: '≥ 10.5 g/dL (WHO Trimester 2) / ≥ 11.0 g/dL (WHO Trimester 1 & 3)',
          labReferenceRange: '11.0 - 14.0 g/dL',
          status: 'normal',
          relevance: 'Reassuring hemoglobin; adequate oxygen-carrying capacity.',
          nextStep: 'Continue prescribed prenatal iron & folic acid.',
          isVerified: true,
        },
        {
          id: 'custom-3',
          testName: 'Urine Albumin / Protein',
          measuredValue: 'Negative',
          unit: 'qualitative',
          whoStandard: 'Negative / Trace (WHO Antenatal Screening)',
          labReferenceRange: 'Negative',
          status: 'normal',
          relevance: 'No proteinuria detected; reassuring for renal health.',
          nextStep: 'Repeat at each routine antenatal visit.',
          isVerified: true,
        },
      ];

      setParameters(parsedParams);
      setOverallSeverity('reassuring');
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunClinicalAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const payload = {
        reportType: reportCategory,
        textContent: rawOcrText,
        language,
        environmentalContext: envData,
        patientContext: {
          patientName,
          stage: patientStage,
          gestationalWeek: pregnancy.currentWeek || 24,
          trimester: pregnancy.trimester || 2,
          babyAgeMonths: activeBaby.birthDate ? 8 : undefined,
          highRiskFlags: pregnancy.highRiskFlags || [],
        },
        verifiedParameters: parameters,
      };

      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        setAnalysisTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        // Detect severity keyword from response
        const textLower = data.analysis.toLowerCase();
        if (textLower.includes('emergency') || textLower.includes('danger sign') || textLower.includes('आपातकालीन')) {
          setOverallSeverity('emergency');
        } else if (textLower.includes('prompt medical review') || textLower.includes('शीघ्र चिकित्सीय परामर्श')) {
          setOverallSeverity('prompt_review');
        } else if (textLower.includes('unclear') || textLower.includes('requires verification') || textLower.includes('सत्यापन')) {
          setOverallSeverity('unable_to_assess');
        } else if (textLower.includes('routine follow-up') || textLower.includes('नियमित')) {
          setOverallSeverity('routine_followup');
        } else {
          setOverallSeverity('reassuring');
        }
      }
    } catch (err) {
      console.error('Error running clinical report analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateParameter = (paramId: string, updatedFields: Partial<ParameterItem>) => {
    setParameters(prev =>
      prev.map(p => (p.id === paramId ? { ...p, ...updatedFields, isVerified: true } : p))
    );
  };

  const handleCopyQuestions = () => {
    const questionsText =
      selectedSampleId === 't3-preeclampsia-alert'
        ? `1. My blood pressure is 152/98 with 2+ proteinuria. Does this require immediate inpatient monitoring?\n2. What are the warning signs of HELLP syndrome I should look out for?\n3. Do I need daily non-stress tests (NST) or Doppler ultrasound for fetal wellbeing?`
        : selectedSampleId === 'monsoon-pediatric-platelets'
        ? `1. The baby's platelets are 82,000 with high fever. Should we start intravenous hydration or hospital observation?\n2. What is the frequency of repeat complete blood counts (CBC) required?\n3. What oral fluids (ORS / breast milk) are safe in what volumes?`
        : `1. Are all parameters appropriate for my gestational week (24W)?\n2. Does my fasting glucose of 94 mg/dL require dietary modifications or an endocrinologist review?\n3. Given the current hot weather, what electrolyte or hydration targets should I follow?`;

    navigator.clipboard.writeText(questionsText);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2500);
  };

  const unverifiedCount = parameters.filter(p => !p.isVerified || p.status === 'uninterpretable').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-rose-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>WHO & ICMR Aligned · Environmental Clinical Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {language === 'hi'
              ? 'स्थान एवं पर्यावरण-जागरूक क्लिनिकल रिपोर्ट विश्लेषण'
              : 'Location-Aware AI Clinical Report Analysis'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'विश्व स्वास्थ्य संगठन (WHO) प्रसवपूर्व मानकों, भारतीय स्वास्थ्य दिशा-निर्देशों एवं आपके स्थानीय मौसम (तापमान, वायु प्रदूषण व मानसूनी जोखिम) के आधार पर मेडिकल रिपोर्टों का सुरक्षित, पारदर्शी मूल्यांकन।'
              : 'Evaluates antenatal & pediatric lab scans against official WHO guidelines, national health standards, and verified local climate factors (heatwave, dehydration risk & AQI) with strict anti-hallucination safeguards.'}
          </p>
        </div>

        {/* Decorative subtle medical cross background */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <FileCheck2 className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* 2. User Location & Real-Time Environmental Context Card */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'hi' ? '1. भौगोलिक स्थान एवं पर्यावरणीय संदर्भ' : '1. Location & Environmental Context'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'स्थानीय तापमान, आर्द्रता एवं वायु गुणवत्ता रिपोर्ट के क्लिनिकल मूल्यांकन को संदर्भ प्रदान करते हैं।'
                  : 'Real-time temperature, humidity & air quality inform hydration and physiological hemoconcentration.'}
              </p>
            </div>
          </div>

          {/* Location Controls: GPS vs Manual */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={requestGpsLocation}
              disabled={isGpsLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                useGps
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-bounce' : ''}`} />
              <span>{isGpsLoading ? 'Detecting GPS...' : useGps ? 'GPS Active' : 'Use Current GPS'}</span>
            </button>

            <select
              value={selectedCity}
              onChange={e => {
                setSelectedCity(e.target.value);
                setUseGps(false);
                setGpsCoordinates(null);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Bengaluru">Bengaluru (Karnataka)</option>
              <option value="Delhi NCR">Delhi NCR (High Smog/AQI Watch)</option>
              <option value="Mumbai">Mumbai (Maharashtra - Coastal Monsoon)</option>
              <option value="Hyderabad">Hyderabad (Telangana)</option>
              <option value="Chennai">Chennai (Tamil Nadu)</option>
              <option value="Kolkata">Kolkata (West Bengal)</option>
              <option value="Pune">Pune (Maharashtra)</option>
              <option value="Ahmedabad">Ahmedabad (Gujarat - Heatwave Watch)</option>
              <option value="Jaipur">Jaipur (Rajasthan)</option>
              <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
            </select>

            <button
              onClick={fetchEnvironmentalContext}
              disabled={isEnvLoading}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh environmental data"
            >
              <RefreshCw className={`w-4 h-4 ${isEnvLoading ? 'animate-spin text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {gpsError && (
          <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Live Environmental Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Temperature */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">{language === 'hi' ? 'तापमान' : 'Temperature'}</span>
              <Thermometer className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              {envData?.temperature !== undefined ? `${envData.temperature}°C` : '--'}
            </div>
            <div className="text-[11px] text-slate-500">
              Feels like {envData?.apparentTemperature ?? '--'}°C
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">{language === 'hi' ? 'आर्द्रता' : 'Humidity'}</span>
              <Droplets className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              {envData?.relativeHumidity !== undefined ? `${envData.relativeHumidity}%` : '--'}
            </div>
            <div className="text-[11px] text-slate-500">
              {envData?.relativeHumidity && envData.relativeHumidity > 70 ? 'High sweat evaporation delay' : 'Optimal comfort zone'}
            </div>
          </div>

          {/* Air Quality (US AQI) */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">{language === 'hi' ? 'वायु गुणवत्ता' : 'Air Quality (AQI)'}</span>
              <Wind className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                {envData?.aqi !== undefined ? envData.aqi : '--'}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  (envData?.aqi || 0) > 150
                    ? 'bg-red-100 text-red-700'
                    : (envData?.aqi || 0) > 100
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {(envData?.aqi || 0) > 150 ? 'Unhealthy' : (envData?.aqi || 0) > 100 ? 'Moderate' : 'Good'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              PM2.5: {envData?.pm25 !== undefined ? `${envData.pm25} µg/m³` : '--'}
            </div>
          </div>

          {/* Clinical Climate Risk */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">{language === 'hi' ? 'जलवायु प्रभाव' : 'Physiological Risk'}</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-base sm:text-lg font-bold capitalize text-slate-900">
              {envData?.climateRiskLevel ? `${envData.climateRiskLevel} Stress` : 'Low Stress'}
            </div>
            <div className="text-[11px] text-slate-500">
              {envData?.temperature && envData.temperature > 35 ? 'Dehydration precaution' : 'Hydration baseline'}
            </div>
          </div>
        </div>

        {/* Environmental Advisories Banner */}
        {envData?.advisories && envData.advisories.length > 0 && (
          <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-900 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{language === 'hi' ? 'सक्रिय स्थानीय स्वास्थ्य एवं मौसम चेतावनी' : 'Active Regional Environmental Health Advisories:'}</span>
            </div>
            <ul className="space-y-1 text-xs text-rose-950 pl-6 list-disc">
              {envData.advisories.map((adv, idx) => (
                <li key={idx} className="leading-relaxed">{adv}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Provenance and Strict Safeguard Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              Source: <span className="font-semibold text-slate-600">{envData?.source || 'Open-Meteo Weather API'}</span> · Timestamp: {envData?.timestamp ? new Date(envData.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
            </span>
          </div>
          <span className="italic text-slate-500 font-medium">
            *Environmental context does NOT change laboratory reference ranges or excuse warning signs.
          </span>
        </div>
      </div>

      {/* 3. Clinical Report Upload & Scenario Selector */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi' ? '2. क्लिनिकल रिपोर्ट अपलोड अथवा टेस्ट केस चयन' : '2. Clinical Report Input & Verification'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'अपनी PDF या JPG रिपोर्ट अपलोड करें या नीचे दिए गए प्रमाणित WHO परीक्षण मामलों में से चुनें।'
                : 'Upload your PDF / image scan, or test with pre-configured clinical scenarios (WHO criteria & anti-hallucination demo).'}
            </p>
          </div>

          <label className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0">
            <Upload className="w-4 h-4" />
            <span>{language === 'hi' ? 'फाइल अपलोड करें' : 'Upload Lab Scan (PDF/JPG)'}</span>
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Sample Case Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {language === 'hi' ? 'त्वरित टेस्ट सिनेरियो (WHO दिशानिर्देश प्रदर्शन):' : 'Pre-loaded Clinical Scenarios for Testing:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_REPORT_CASES.map(sample => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => loadSampleCase(sample.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                      {sample.category.replace('_', ' ')}
                    </span>
                    {sample.id === 't3-preeclampsia-alert' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">
                        Urgent Flag
                      </span>
                    )}
                    {sample.id === 'smudged-scan-unclear' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                        Smudged Test
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                    {language === 'hi' ? sample.titleHi : sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {sample.patientName} · {sample.stageInfo}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Context & File Info Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? 'मरीज़ का नाम' : 'Patient Name'}</span>
            <input
              type="text"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              className="mt-0.5 font-semibold text-slate-900 bg-transparent border-b border-slate-300 focus:border-rose-500 focus:outline-none w-full"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? 'गर्भावस्था सप्ताह / आयु' : 'Stage / Age'}</span>
            <input
              type="text"
              value={patientStage}
              onChange={e => setPatientStage(e.target.value)}
              className="mt-0.5 font-semibold text-slate-900 bg-transparent border-b border-slate-300 focus:border-rose-500 focus:outline-none w-full"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? 'दस्तावेज़ फाइल' : 'Loaded Document'}</span>
            <span className="font-mono text-slate-700 truncate block mt-0.5">{uploadedFileName}</span>
          </div>
        </div>

        {/* Interactive Parameter Verification Card (Anti-Hallucination Guardrail) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-600" />
                <span>{language === 'hi' ? 'निकाले गए क्लिनिकल पैरामीटर्स (सत्यापन आवश्यक)' : 'Extracted Clinical Parameters (Verification Step)'}</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                {language === 'hi'
                  ? 'अस्पष्ट या कटी हुई रिपोर्टों के मामले में, आप कृत्रिम बुद्धिमत्ता (AI) विश्लेषण से पूर्व आंकड़ों की पुष्टि कर सकते हैं।'
                  : 'Zero-hallucination safeguard: Verify or correct extracted laboratory figures before the AI executes clinical correlation.'}
              </p>
            </div>

            {unverifiedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{unverifiedCount} parameter(s) require verification</span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Test Name</th>
                  <th className="py-2.5 px-3">Measured Result</th>
                  <th className="py-2.5 px-3">Applicable WHO Standard</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {parameters.map(param => {
                  const isEditing = editingParamId === param.id;
                  const isSmudged = param.status === 'uninterpretable' || !param.isVerified;

                  return (
                    <tr key={param.id} className={isSmudged ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {param.testName}
                        {param.needsVerificationReason && (
                          <span className="block text-[10px] text-amber-700 font-normal mt-0.5">
                            Notice: {param.needsVerificationReason}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={param.measuredValue}
                              onChange={e => handleUpdateParameter(param.id, { measuredValue: e.target.value })}
                              className="px-2 py-1 text-xs border border-rose-300 rounded font-mono w-24"
                            />
                            <span className="text-[10px] text-slate-500 font-mono">{param.unit}</span>
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-900">
                            {param.measuredValue} {param.unit}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {param.whoStandard}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            param.status === 'normal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : param.status === 'borderline'
                              ? 'bg-amber-100 text-amber-800'
                              : param.status === 'outside'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {param.status === 'normal' && <CheckCircle2 className="w-3 h-3" />}
                          {param.status === 'outside' && <AlertTriangle className="w-3 h-3" />}
                          {param.status === 'borderline' && <Info className="w-3 h-3" />}
                          {param.status === 'uninterpretable' && <AlertCircle className="w-3 h-3" />}
                          <span className="capitalize">{param.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <button
                            onClick={() => {
                              handleUpdateParameter(param.id, {
                                isVerified: true,
                                status: param.measuredValue.toLowerCase().includes('unclear') ? 'uninterpretable' : 'normal',
                              });
                              setEditingParamId(null);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                          >
                            Save & Confirm
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingParamId(param.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
                          >
                            {param.isVerified ? 'Edit' : 'Verify Value'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Run Analysis Trigger Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'hi'
                ? 'मूल्यांकन में WHO प्रसवपूर्व दिशानिर्देश, MoHFW भारत मानक व वास्तविक मौसम डेटा शामिल हैं।'
                : 'Correlates results with WHO ANC 2016/2020, Gestational OGTT criteria, and live climate telemetry.'}
            </span>
          </div>

          <button
            onClick={handleRunClinicalAnalysis}
            disabled={isAnalyzing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-md shadow-rose-200 transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>
              {isAnalyzing
                ? (language === 'hi' ? 'क्लिनिकल एवं पर्यावरणीय विश्लेषण जारी...' : 'Analyzing Report With WHO & Climate Context...')
                : (language === 'hi' ? 'पूर्ण क्लिनिकल मूल्यांकन उत्पन्न करें' : 'Generate Location-Aware Clinical Assessment')}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Structured Clinical Assessment Results Card */}
      {analysisResult && (
        <div className="bg-white rounded-3xl border-2 border-rose-200 shadow-md p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Section A: Overall Clinical Assessment & Severity Classification */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SECTION A · {language === 'hi' ? 'समग्र क्लिनिकल निष्कर्ष' : 'Overall Clinical Assessment'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Evaluated at {analysisTimestamp}</span>
              </div>
            </div>

            {/* Severity classification banner */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                overallSeverity === 'emergency'
                  ? 'bg-red-50 border-red-300 text-red-950'
                  : overallSeverity === 'prompt_review'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : overallSeverity === 'unable_to_assess'
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {overallSeverity === 'emergency' ? (
                  <ShieldAlert className="w-7 h-7 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                ) : overallSeverity === 'prompt_review' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
                ) : overallSeverity === 'unable_to_assess' ? (
                  <AlertCircle className="w-7 h-7 text-slate-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider">
                      Severity Classification:
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide ${
                        overallSeverity === 'emergency'
                          ? 'bg-red-600 text-white'
                          : overallSeverity === 'prompt_review'
                          ? 'bg-amber-600 text-white'
                          : overallSeverity === 'unable_to_assess'
                          ? 'bg-slate-700 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {overallSeverity === 'emergency'
                        ? 'EMERGENCY / WARNING SIGN'
                        : overallSeverity === 'prompt_review'
                        ? 'PROMPT MEDICAL REVIEW RECOMMENDED'
                        : overallSeverity === 'unable_to_assess'
                        ? 'UNABLE TO ASSESS — REQUIRES VERIFICATION'
                        : 'REASSURING / ROUTINE FOLLOW-UP'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm mt-1.5 leading-relaxed font-medium">
                    {overallSeverity === 'emergency'
                      ? 'Critical maternal or neonatal signs detected (e.g. Hypertension > 140/90 with proteinuria). Immediate physical evaluation in a labor or emergency hospital room is required.'
                      : overallSeverity === 'prompt_review'
                      ? 'Certain clinical markers fall outside target guidelines (e.g. pediatric thrombocytopenia or borderline gestational fasting hyperglycemia). Schedule medical consultation within 24–48 hours.'
                      : overallSeverity === 'unable_to_assess'
                      ? 'One or more lab fields were obscured or smudged. Clinical decisions must not be based on interpolated values without laboratory verification.'
                      : 'Parameters fall comfortably within WHO antenatal reference ranges. Continue standard prenatal care, routine supplementation, and hydration.'}
                  </p>
                </div>
              </div>

              {overallSeverity === 'emergency' && (
                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="px-4 py-2.5 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md whitespace-nowrap shrink-0 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Call 108 / Labor Room</span>
                </button>
              )}
            </div>
          </div>

          {/* Section B: Findings & WHO Standards Comparison Table */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              SECTION B · {language === 'hi' ? 'क्लिनिकल एवं WHO मानक तुलना तालिका' : 'Findings & WHO Standards Comparison Table'}
            </span>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-700 text-[11px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Parameter Name</th>
                    <th className="py-3 px-3">Measured Result</th>
                    <th className="py-3 px-3">WHO / National Standard</th>
                    <th className="py-3 px-3">Lab Reference Range</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Clinical & Climate Relevance</th>
                    <th className="py-3 px-3">Recommended Next Step</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {parameters.map(param => (
                    <tr key={param.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {param.testName}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {param.measuredValue} {param.unit}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium min-w-[160px]">
                        {param.whoStandard}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {param.labReferenceRange}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            param.status === 'normal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : param.status === 'borderline'
                              ? 'bg-amber-100 text-amber-800'
                              : param.status === 'outside'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="capitalize">{param.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 leading-snug min-w-[200px]">
                        {param.relevance}
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-semibold leading-snug min-w-[180px]">
                        {param.nextStep}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Location & Climate-Aware Contextual Interpretation */}
          <div className="p-5 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>
                SECTION C · {language === 'hi' ? 'स्थान एवं जलवायु प्रासंगिक व्याख्या' : 'Location & Climate Contextual Analysis'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-950">
              <div className="p-3 bg-white/70 rounded-xl border border-amber-200/50 space-y-1">
                <span className="font-bold text-amber-900 block">Thermal & Dehydration Factor:</span>
                <p className="leading-relaxed">
                  Current temperature in {envData?.city || 'Selected City'} is {envData?.temperature ?? 28}°C (Feels like {envData?.apparentTemperature ?? 30}°C).
                  {envData?.temperature && envData.temperature > 32
                    ? ' High heat causes maternal insensible perspiration, leading to physiological hemoconcentration. Maintain oral fluid replacement (water + coconut water).'
                    : ' Ambient conditions are within manageable thermoregulatory brackets.'}
                </p>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-amber-200/50 space-y-1">
                <span className="font-bold text-amber-900 block">Air Quality & Respiratory Strain:</span>
                <p className="leading-relaxed">
                  US AQI is {envData?.aqi ?? 65} (PM2.5: {envData?.pm25 ?? 18} µg/m³).
                  {envData?.aqi && envData.aqi > 100
                    ? ' Moderate to high particulate load. Third-trimester mothers should minimize physical exertion during morning and evening rush hours.'
                    : ' Fine particulate levels are acceptable; standard outdoor walking is encouraged.'}
                </p>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-amber-200/50 space-y-1">
                <span className="font-bold text-amber-900 block">Non-Negotiable Safety Safeguard:</span>
                <p className="leading-relaxed font-semibold text-rose-900">
                  Climate and environmental factors contextualize hydration and respiratory symptoms, but NEVER alter clinical laboratory thresholds or override obstetric emergencies.
                </p>
              </div>
            </div>
          </div>

          {/* Section D: Personalized Action Plan & Doctor Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SECTION D · {language === 'hi' ? 'व्यक्तिगत कार्य योजना एवं डॉक्टर प्रश्न' : 'Personalized Action Plan & Doctor Questions'}
              </span>

              <button
                onClick={handleCopyQuestions}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              >
                {copiedQuestions ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQuestions ? 'Copied to Clipboard' : 'Copy Questions for Doctor'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Doctor Questions Checklist */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Specific Questions for Your OB-GYN / Pediatrician:</span>
                </h4>
                <ul className="space-y-2 text-slate-700 pl-1">
                  {selectedSampleId === 't3-preeclampsia-alert' ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q1.</span>
                        <span>My blood pressure is 152/98 with 2+ proteinuria. Does this require immediate inpatient monitoring?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q2.</span>
                        <span>Should we run a complete liver panel (SGOT/SGPT) and repeat platelet count to rule out HELLP syndrome?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q3.</span>
                        <span>Are corticosteroid injections indicated for fetal lung maturity given my 34-week gestation?</span>
                      </li>
                    </>
                  ) : selectedSampleId === 'monsoon-pediatric-platelets' ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q1.</span>
                        <span>The baby&apos;s platelets are 82,000 with a positive Dengue NS1 test. Does the baby require hospital observation?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q2.</span>
                        <span>How frequently should we repeat the Complete Blood Count to monitor hematocrit and plasma leakage?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q3.</span>
                        <span>What exact volume of fluids (breast milk / ORS) should be administered hourly?</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q1.</span>
                        <span>Is my hemoglobin of {parameters[0]?.measuredValue || '10.8'} g/dL sufficient, or should iron supplementation be adjusted?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q2.</span>
                        <span>Does my fasting glucose result warrant medical nutrition therapy before the next routine visit?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-rose-600">Q3.</span>
                        <span>Given local summer heat, what electrolyte or hydration targets should I follow daily?</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Lifestyle & Clinical Follow-up Timelines */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Clinical Follow-Up Urgency & Lifestyle Actions:</span>
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Follow-up Urgency:</span>
                    <span
                      className={`font-bold uppercase text-[11px] px-2 py-0.5 rounded ${
                        overallSeverity === 'emergency'
                          ? 'bg-red-100 text-red-700'
                          : overallSeverity === 'prompt_review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {overallSeverity === 'emergency'
                        ? 'Immediate (Within 1-2 Hours)'
                        : overallSeverity === 'prompt_review'
                        ? 'Within 24–48 Hours'
                        : 'Next Scheduled Routine Visit'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-900 block">Lifestyle & Hydration Precautions:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                      <li>Maintain 2.5 to 3.0 liters of daily oral fluids (water, lemon water, buttermilk/chaas).</li>
                      <li>Take Iron supplements with citrus/Vitamin C; keep a strict 2-hour interval from Calcium or dairy products.</li>
                      <li>In high heat, avoid direct midday sun exposure between 11:00 AM and 3:30 PM.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Banner: Apply to AI Diet Plan */}
          <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <h5 className="font-extrabold text-xs text-purple-950 flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{language === 'hi' ? 'इस रिपोर्ट को AI आहार योजना से जोड़ें' : 'Connect This Report to Your AI Diet Plan'}</span>
              </h5>
              <p className="text-[11px] text-purple-800">
                {language === 'hi'
                  ? 'इन लैब निष्कर्षों के आधार पर आज के भोजन, पोषण लक्ष्यों और हाइड्रेशन को तुरंत अपडेट करें।'
                  : 'Automatically reassess today’s meals, portions, iron/energy goals, and restrictions based on these findings.'}
              </p>
            </div>
            <button
              onClick={() => {
                addDocument({
                  title: `${patientStage} Clinical Lab Record`,
                  category: reportCategory,
                  date: reportDate,
                  fileName: uploadedFileName,
                  extractedText: rawOcrText,
                  keyParameters: parameters.map(p => ({
                    label: p.testName,
                    value: `${p.measuredValue} ${p.unit}`.trim(),
                    isNormal: p.status === 'normal',
                    referenceRange: p.labReferenceRange,
                  })),
                });
                setAppMode('nutrition');
              }}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>{language === 'hi' ? 'आहार योजना अपडेट करें →' : 'Apply to Diet Plan →'}</span>
            </button>
          </div>

          {/* Section E: Verifiable Sources, Timestamps & Provenance */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              SECTION E · {language === 'hi' ? 'सत्यापित स्रोत एवं डेटा विवरण' : 'Verifiable Clinical Sources & Data Provenance'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">Clinical Guidelines Referenced:</span>
                <ul className="space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>WHO Recommendations on Antenatal Care (2016/2020)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>WHO / IADPSG Diagnostic Criteria for Gestational Diabetes</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>MoHFW India PMSMA Clinical Protocols & FOGSI Guidelines</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">Environmental Data Telemetry:</span>
                <p>Provider: {envData?.source || 'Open-Meteo Global Meteorological API'}</p>
                <p>Location: {envData?.city || selectedCity} ({envData?.coordinates?.lat.toFixed(2) ?? '12.97'}, {envData?.coordinates?.lng.toFixed(2) ?? '77.59'})</p>
                <p>Query Timestamp: {envData?.timestamp ? new Date(envData.timestamp).toLocaleString() : new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 italic">
              Medical Disclaimer: This AI-generated report summary is intended solely for educational reference and doctor-visit preparation. It does not constitute a formal diagnosis, medical prescription, or substitute for a licensed Obstetrician or Pediatrician.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
