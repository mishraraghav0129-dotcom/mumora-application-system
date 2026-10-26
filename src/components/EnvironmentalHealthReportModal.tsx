import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Droplets,
  Wind,
  Sun,
  Thermometer,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  AlertCircle,
  PhoneCall,
  Info,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnvironmentalObservations, DailyEnvironmentalReport } from '../types';
import { PersonalizedAnalysisResult, runPersonalizedAnalysis } from '../services/personalizedAnalysisEngine';

interface EnvironmentalHealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: DailyEnvironmentalReport | null;
  envData: EnvironmentalObservations | null;
  locationName: string;
  analysisResult?: PersonalizedAnalysisResult;
}

export const EnvironmentalHealthReportModal: React.FC<EnvironmentalHealthReportModalProps> = ({
  isOpen,
  onClose,
  envData,
  locationName,
  analysisResult: propAnalysis,
}) => {
  const {
    language,
    pregnancy,
    activeBaby,
    appMode,
    userProfile,
    maternalHistory,
    paternalHistory,
    familyPedigree,
    vitalLogs,
    documents,
    childReports,
    setShowEmergencyModal,
  } = useApp();

  const isHi = language === 'hi';

  if (!isOpen) return null;

  // Compute or reuse analysis
  const analysis =
    propAnalysis ||
    runPersonalizedAnalysis({
      userProfile,
      pregnancy,
      activeBaby,
      isBabyMode: appMode === 'baby',
      maternalHistory,
      paternalHistory,
      familyPedigree,
      vitalLogs,
      documents,
      childReports,
      envData,
      language,
    });

  const handlePrint = () => {
    window.print();
  };

  const latestVital = vitalLogs.length > 0 ? vitalLogs[0] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-[#FDFBF7] border border-[#E2DBD0] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#244230] via-[#2D5A3C] to-[#1E3A2B] text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100">
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isHi ? 'प्रमाण-आधारित पर्यावरणीय स्वास्थ्य रिपोर्ट' : 'Evidence-Based Environmental Health Report'}</span>
              <span>·</span>
              <span>WHO & ACOG Synthesized</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {isHi ? 'व्यक्तिगत पर्यावरण एवं मातृत्व-शिशु स्वास्थ्य रिपोर्ट' : 'Personal Environmental & Maternal-Infant Health Synthesis'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{locationName || userProfile.city || 'Location Active'}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </span>
              <span>·</span>
              <span className="font-bold text-amber-300">
                {analysis.clinicalProfileStatus.stageDescription}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isHi ? 'प्रिंट / पीडीएफ' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-800">
          {/* Action Urgency Classification Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              analysis.urgencyLevel === 'urgent_medical_assessment'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : analysis.urgencyLevel === 'clinician_consultation'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                analysis.urgencyLevel === 'urgent_medical_assessment'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : analysis.urgencyLevel === 'clinician_consultation'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-600 text-white'
              }`}
            >
              {analysis.urgencyLevel === 'urgent_medical_assessment' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-[11px]">
                <span>{isHi ? 'नैदानिक कार्य योजना वर्गीकरण:' : 'Action Plan Classification:'}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-extrabold ${
                    analysis.urgencyLevel === 'urgent_medical_assessment'
                      ? 'bg-rose-600 text-white'
                      : analysis.urgencyLevel === 'clinician_consultation'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-600 text-white'
                  }`}
                >
                  {analysis.urgencyLevel === 'urgent_medical_assessment'
                    ? (isHi ? 'तत्काल चिकित्सकीय जांच (Urgent Medical Assessment)' : 'Urgent Medical Assessment')
                    : analysis.urgencyLevel === 'clinician_consultation'
                      ? (isHi ? 'डॉक्टर परामर्श अनुशंसित (Clinician Consultation)' : 'Clinician Consultation')
                      : (isHi ? 'नियमित निगरानी (Routine Monitoring)' : 'Routine Monitoring')}
                </span>
              </div>
              <p className="font-medium">
                {isHi && analysis.urgencyRationaleHi ? analysis.urgencyRationaleHi : analysis.urgencyRationale}
              </p>
            </div>
          </div>

          {/* Clinical Disclaimer & Transparency Banner */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block mb-0.5">
                {isHi ? 'नैदानिक सीमाएं एवं अस्वीकरण' : 'Clinical Boundaries & Uncertainty Statement'}
              </span>
              <p>{isHi ? analysis.uncertaintyStatementHi : analysis.uncertaintyStatement}</p>
            </div>
          </div>

          {/* Section 1: Observed Environmental Metrics & WHO Standards */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#2D5A3C] text-white flex items-center justify-center font-black text-xs">
                  1
                </span>
                <h3 className="font-black text-slate-900 text-base">
                  {isHi ? 'भाग १: वास्तविक पर्यावरणीय माप एवं WHO मानक' : 'Section 1: Observed Environmental Metrics & WHO Standards'}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {analysis.environmentalFreshness.source}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#E5DFD3]">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  <span>{isHi ? 'तापमान' : 'Temperature'}</span>
                </div>
                <p className="text-xl font-black text-slate-900">
                  {envData?.temperature ?? 28}°C
                </p>
                <p className="text-[11px] text-slate-500">
                  {isHi ? 'महसूस:' : 'Feels:'} {envData?.apparentTemperature ?? 30}°C
                </p>
              </div>

              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#E5DFD3]">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>{isHi ? 'आर्द्रता' : 'Humidity'}</span>
                </div>
                <p className="text-xl font-black text-slate-900">
                  {envData?.relativeHumidity ?? 65}%
                </p>
                <p className="text-[11px] text-slate-500">
                  {(envData?.relativeHumidity ?? 65) > 70 ? (isHi ? 'उच्च नमी' : 'High moisture') : (isHi ? 'संतुलित' : 'Optimal')}
                </p>
              </div>

              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#E5DFD3]">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'वायु गुणवत्ता (AQI)' : 'Air Quality (AQI)'}</span>
                </div>
                <p className="text-xl font-black text-slate-900">
                  AQI {envData?.aqi ?? 72}
                </p>
                <p className="text-[11px] text-emerald-700 font-bold">
                  PM2.5: {envData?.pm25 ?? 22} µg/m³
                </p>
              </div>

              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#E5DFD3]">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{isHi ? 'यूवी इंडेक्स' : 'UV Index'}</span>
                </div>
                <p className="text-xl font-black text-slate-900">
                  {envData?.uvIndex ?? 5.5}
                </p>
                <p className="text-[11px] text-slate-500">
                  {(envData?.uvIndex ?? 5.5) >= 6 ? (isHi ? 'उच्च (सनस्क्रीन जरूरी)' : 'High solar flux') : (isHi ? 'मध्यम' : 'Moderate')}
                </p>
              </div>
            </div>

            {/* Environmental Factors Table */}
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden text-xs">
              {analysis.environmentalFactors.map((f, i) => (
                <div key={i} className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">{f.label}</span>
                    <span className="text-[11px] text-slate-500 block">
                      Standard: {f.standardThreshold}
                    </span>
                  </div>
                  <div className="text-right sm:max-w-xs">
                    <span className="font-extrabold text-slate-900 block">{f.currentValue}</span>
                    <span className="text-[11px] text-slate-600">{f.impactOnUser}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Patient's Personal Profile, Medical History & Uploaded Clinical Reports */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-7 h-7 rounded-xl bg-[#2D5A3C] text-white flex items-center justify-center font-black text-xs">
                2
              </span>
              <h3 className="font-black text-slate-900 text-base">
                {isHi ? 'भाग २: व्यक्तिगत स्वास्थ्य प्रोफाइल, मेडिकल इतिहास एवं नैदानिक रिपोर्ट' : 'Section 2: Health Profile, Medical History & Clinical Reports'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Pregnancy / Child Profile */}
              <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E5DFD3] space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {isHi ? 'गर्भावस्था / शिशु' : 'Gestation / Child Stage'}
                </span>
                <p className="font-extrabold text-slate-900">
                  {analysis.clinicalProfileStatus.stageDescription}
                </p>
                <p className="text-[11px] text-slate-600">
                  LMP: {pregnancy.lastMenstrualPeriod || 'Unrecorded'} · EDD: {pregnancy.estimatedDueDate || 'Calculated'}
                </p>
              </div>

              {/* Maternal & Paternal History */}
              <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E5DFD3] space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {isHi ? 'चिकित्सा एवं पारिवारिक इतिहास' : 'Medical & Family Pedigree'}
                </span>
                <p className="font-extrabold text-slate-900">
                  {analysis.clinicalProfileStatus.medicalHistoryStatus.hasConditionsLogged
                    ? analysis.clinicalProfileStatus.medicalHistoryStatus.conditionsList.join(', ')
                    : 'No chronic conditions reported'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Consanguinity: {familyPedigree.consanguinity ? 'Yes' : 'No'} · Paternal: {paternalHistory.statusSummary || 'Unrecorded'}
                </p>
              </div>

              {/* Uploaded Reports & Extracted Values */}
              <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E5DFD3] space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {isHi ? 'डॉक्युमेंट वॉल्ट रिपोर्ट' : 'Vault Clinical Reports'}
                </span>
                <p className="font-extrabold text-slate-900">
                  {documents.length + childReports.length} {isHi ? 'जांच रिपोर्ट उपलब्ध' : 'Reports uploaded'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Ultrasounds: {documents.filter(d => d.category === 'ultrasound').length} · Blood tests: {documents.filter(d => d.category === 'blood_test').length}
                </p>
              </div>
            </div>

            {/* Extracted Lab Findings if available */}
            {analysis.clinicalProfileStatus.reportsStatus.notableFindings.length > 0 && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-xs text-purple-900">
                <strong className="block font-bold">Notable Extracted Report Values:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-purple-800">
                  {analysis.clinicalProfileStatus.reportsStatus.notableFindings.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section 3: Multi-Factor Synthesized Findings & Missing Data Warnings */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-7 h-7 rounded-xl bg-[#2D5A3C] text-white flex items-center justify-center font-black text-xs">
                3
              </span>
              <h3 className="font-black text-slate-900 text-base">
                {isHi ? 'भाग ३: बहु-कारकीय विश्लेषित निष्कर्ष एवं डेटा सीमाएं' : 'Section 3: Multi-Factor Synthesized Findings & Data Limitations'}
              </h3>
            </div>

            {/* Synthesized Findings */}
            <div className="space-y-3">
              {analysis.keyFindings.map(finding => (
                <div
                  key={finding.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    finding.severity === 'critical'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : finding.severity === 'high'
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-[#F9F7F2] border-[#E8E2D8] text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-sm">
                      {isHi && finding.titleHi ? finding.titleHi : finding.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        finding.severity === 'critical'
                          ? 'bg-rose-600 text-white'
                          : finding.severity === 'high'
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {finding.severity}
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    {isHi && finding.descriptionHi ? finding.descriptionHi : finding.description}
                  </p>
                  <div className="pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-slate-600 block text-[11px] mb-0.5">Supporting Inputs:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {finding.supportingInputs.map((input, idx) => (
                        <span key={idx} className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-700">
                          {input}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Missing Data Warnings */}
            {analysis.missingDataWarnings.length > 0 && (
              <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{isHi ? 'अनुपलब्ध डेटा सूचना (Missing Information):' : 'Missing Information Notice:'}</span>
                </div>
                <div className="space-y-1.5 text-amber-800">
                  {analysis.missingDataWarnings.map((w, idx) => (
                    <div key={idx} className="p-2 bg-white/70 rounded-lg border border-amber-200 space-y-0.5">
                      <span className="font-bold text-amber-950">• {isHi && w.fieldHi ? w.fieldHi : w.field}</span>
                      <p className="text-[11px] leading-snug">{isHi && w.impactHi ? w.impactHi : w.impact}</p>
                      <span className="text-[10px] font-semibold text-emerald-800 block">
                        Action: {w.recommendedStep}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strict Medical Safety Box: Never blame weather for abnormal readings */}
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-xs text-red-950 space-y-1">
              <div className="flex items-center gap-1.5 font-black text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>CRITICAL CLINICAL CAUTION: NO FALSE ATTRIBUTION</span>
              </div>
              <p>
                High blood pressure (≥ 140/90 mmHg), severe headaches, visual disturbances, or protein in urine are clinical warning signs of <strong>preeclampsia or gestational hypertension</strong>.
                They must <strong>NEVER</strong> be dismissed as "just hot weather", "exhaustion", or "dust allergy". Any abnormal clinical reading requires immediate physical evaluation by your obstetrician.
              </p>
            </div>
          </div>

          {/* Section 4: Evidence-Based Precautions & WHO Guideline Sources */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-7 h-7 rounded-xl bg-[#2D5A3C] text-white flex items-center justify-center font-black text-xs">
                4
              </span>
              <h3 className="font-black text-slate-900 text-base">
                {isHi ? 'भाग ४: व्यावहारिक सावधानियां एवं अधिकृत दिशानिर्देश संदर्भ' : 'Section 4: Evidence-Based Precautions & Verified Guideline Sources'}
              </h3>
            </div>

            {/* Practical Precautions */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                Recommended Precautions & Protocols:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {analysis.precautions.map(p => (
                  <div key={p.id} className="p-3 bg-[#FAF7F0] border border-[#E5DFD3] rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHi && p.actionHi ? p.actionHi : p.action}</span>
                    </span>
                    <p className="text-[11px] text-slate-600 pl-5.5">{p.rationale}</p>
                    {p.timeWindow && (
                      <span className="text-[10px] text-emerald-800 font-semibold pl-5.5 block">
                        Timing: {p.timeWindow}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Guideline Sources with Date / Body */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#2D5A3C]" />
                <span>Verified Scientific Guideline Citations:</span>
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {analysis.guidelineCitations.map(g => (
                  <div key={g.id} className="p-3 bg-white space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{g.title}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {g.issuingBody} ({g.year})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{g.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Alert Strip */}
            <div className="p-3.5 bg-red-100/60 border border-red-300 rounded-xl flex items-center justify-between gap-3 text-xs text-red-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  <strong>Emergency Obstetric Alert:</strong> If bleeding, severe pain, or sudden drop in fetal movements occurs:
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setShowEmergencyModal(true);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>108 Janani</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#F6F2EB] border-t border-[#E2DBD0] flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px]">
            Mumora Clinical Intelligence Engine · Evidence Grounded in WHO Guidelines
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all"
          >
            {isHi ? 'बंद करें' : 'Close Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
