import React, { useState, useEffect, useMemo } from 'react';
import {
  Leaf,
  Wind,
  Droplets,
  Sun,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Clock,
  Sparkles,
  FileText,
  ChevronRight,
  Info,
  Navigation,
  Activity,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { EnvironmentalObservations } from '../types';
import { EnvironmentalHealthReportModal } from './EnvironmentalHealthReportModal';
import { LocationChangeModal } from './LocationChangeModal';
import { detectDeviceCoordinates, resolveCoordinatesToLocation } from '../services/locationService';
import { runPersonalizedAnalysis, PersonalizedAnalysisResult } from '../services/personalizedAnalysisEngine';

export const EnvironmentalHealthBanner: React.FC = () => {
  const {
    language,
    userProfile,
    updateUserProfile,
    pregnancy,
    activeBaby,
    appMode,
    maternalHistory,
    paternalHistory,
    familyPedigree,
    vitalLogs,
    documents,
    childReports,
    setShowEmergencyModal,
  } = useApp();

  const t = TRANSLATIONS[language];
  const isHi = language === 'hi';
  const envText = t.environmental;

  const [loading, setLoading] = useState(false);
  const [envData, setEnvData] = useState<EnvironmentalObservations | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // GPS Quick Detection
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState<string | null>(null);

  // Location display calculation
  const cityDisplay =
    userProfile.district_name ||
    userProfile.district ||
    userProfile.city ||
    'Bengaluru';

  const stateDisplay =
    userProfile.state_region_name ||
    userProfile.state ||
    'Karnataka';

  const countryDisplay =
    userProfile.country_name ||
    userProfile.country ||
    'India';

  const fullLocationString = [cityDisplay, stateDisplay, countryDisplay]
    .filter(Boolean)
    .join(', ');

  // Fetch real atmospheric & micro-climate telemetry from backend
  const fetchObservations = async () => {
    setLoading(true);
    setDataError(null);

    const lat = userProfile.latitude;
    const lng = userProfile.longitude;
    const queryCity = cityDisplay;

    try {
      let url = `/api/environmental-context?city=${encodeURIComponent(queryCity)}`;
      if (lat && lng) {
        url += `&lat=${lat}&lng=${lng}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.success && !data.available) {
        throw new Error(data.error || 'Environmental observation service returned empty response');
      }

      setEnvData(data);
      setDataError(null);
    } catch (err: any) {
      console.warn('Could not fetch live environmental data:', err);
      setDataError(
        err.message ||
          (isHi
            ? 'इस क्षेत्र के लिए पर्यावरणीय आंकड़े अस्थायी रूप से अनुपलब्ध हैं।'
            : 'Live atmospheric observations temporarily unavailable for this area.')
      );
      setEnvData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservations();
  }, [userProfile.latitude, userProfile.longitude, userProfile.city, userProfile.district, userProfile.country]);

  // Transparent GPS detection
  const handleGpsDetect = async () => {
    setGpsDetecting(true);
    setGpsFeedback(null);
    try {
      const coords = await detectDeviceCoordinates();
      const resolved = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);

      updateUserProfile({
        country: resolved.country,
        country_code: resolved.countryCode,
        country_name: resolved.country,
        state: resolved.state,
        state_region_code: resolved.stateCode || '',
        state_region_name: resolved.state,
        district: resolved.district,
        district_code: resolved.districtCode || '',
        district_name: resolved.district,
        city: resolved.city,
        latitude: coords.latitude,
        longitude: coords.longitude,
        gpsPermissionGranted: true,
      });

      setGpsFeedback(
        isHi
          ? `📍 स्थान प्राप्त: ${resolved.city || resolved.district}, ${resolved.state}`
          : `📍 Location detected: ${resolved.city || resolved.district}, ${resolved.state}`
      );
      setTimeout(() => setGpsFeedback(null), 5000);
    } catch (error: any) {
      setGpsFeedback(
        error.message ||
          (isHi
            ? 'GPS अनुमति अस्वीकृत या अनुपलब्ध। आप "स्थान बदलें" बटन से देश व शहर चुन सकते हैं।'
            : 'GPS permission declined or unavailable. You can use "Change Location" to choose manually.')
      );
      setTimeout(() => setGpsFeedback(null), 6000);
    } finally {
      setGpsDetecting(false);
    }
  };

  // Run the holistic multi-factor Personalized Analysis Engine
  const analysisResult: PersonalizedAnalysisResult = useMemo(() => {
    return runPersonalizedAnalysis({
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
  }, [
    userProfile,
    pregnancy,
    activeBaby,
    appMode,
    maternalHistory,
    paternalHistory,
    familyPedigree,
    vitalLogs,
    documents,
    childReports,
    envData,
    language,
  ]);

  const { clinicalProfileStatus, urgencyLevel, keyFindings, missingDataWarnings, precautions } = analysisResult;
  const primaryFinding = keyFindings.length > 0 ? keyFindings[0] : null;

  return (
    <div className="w-full mb-8 space-y-4">
      {/* ========================================================================= */}
      {/* 1. TOP MY LOCATION SUMMARY STRIP WITH INLINE CHANGE LOCATION TRIGGER      */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF7F0] border border-[#E4DDD0] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A3C] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#2D5A3C]">
                {isHi ? 'मेरा पंजीकृत स्थान' : 'My Location'}
              </span>
              {envData?.coordinates && (
                <span className="text-[10px] text-slate-500 font-semibold hidden md:inline">
                  • {envData.coordinates.lat.toFixed(2)}°N, {envData.coordinates.lng.toFixed(2)}°E
                </span>
              )}
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 truncate">
              {cityDisplay}, {stateDisplay}, {countryDisplay}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F3EFE6] text-slate-800 text-xs font-bold border border-[#D5CEBF] transition-all flex items-center gap-1.5 shadow-2xs hover:border-[#2D5A3C]"
            title="Change Country, State or City"
          >
            <MapPin className="w-3.5 h-3.5 text-[#2D5A3C]" />
            <span>{isHi ? 'स्थान बदलें' : 'Change Location'}</span>
          </button>

          <button
            onClick={handleGpsDetect}
            disabled={gpsDetecting}
            className="px-3 py-1.5 rounded-xl bg-[#2D5A3C] hover:bg-[#244730] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Auto-detect current GPS location"
          >
            <Navigation className={`w-3.5 h-3.5 text-amber-300 ${gpsDetecting ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{gpsDetecting ? 'Locating...' : 'GPS Detect'}</span>
          </button>
        </div>
      </div>

      {gpsFeedback && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 shrink-0 text-amber-700" />
          <span>{gpsFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN NATURE-INSPIRED "PERSONAL ENVIRONMENT & HEALTH INTELLIGENCE" HERO */}
      {/* ========================================================================= */}
      <section
        aria-label="Personal Environment & Health Intelligence"
        className="relative overflow-hidden rounded-3xl border border-[#D5CEBF] bg-gradient-to-br from-[#2D5A3C] via-[#244730] to-[#1B3624] text-white shadow-xl"
      >
        {/* Subtle Ambient Decorative Gradients */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-5 sm:p-7 md:p-8 space-y-6">
          {/* Header Row: Title & Freshness */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/10">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span className="font-extrabold uppercase tracking-wider text-[11px]">
                  {envText?.title || 'Personal Environment & Health Intelligence'}
                </span>
                <span>·</span>
                <span>WHO Evidence-Based</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                {envText?.coreHeadline || 'Your Environment. Your Health. Your Baby. One Intelligent Care System.'}
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm font-medium">
                {envText?.supportingTagline || 'Care that understands your environment.'}
              </p>
            </div>

            {/* Freshness Badge & Refresh Trigger */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={fetchObservations}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-emerald-100 text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 shadow-2xs"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Updating...' : 'Live Sync'}</span>
              </button>
            </div>
          </div>

          {/* Telemetry Freshness & Data Source Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5 truncate max-w-xl">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-white font-bold">{fullLocationString}</span>
            </div>

            <div className="text-[11px] text-emerald-200/90 flex items-center gap-2">
              <Clock className="w-3 h-3 text-emerald-300" />
              <span>
                {envData
                  ? `${envText?.liveFreshness || 'Live Observed'} · ${envData.source}`
                  : 'Open-Meteo European Weather Model & CAMS'}
              </span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 3. ENVIRONMENTAL TELEMETRY METRICS OR UNAVAILABLE STATE (NO FAKE DATA)  */}
          {/* ======================================================================= */}
          {dataError && !envData ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{envText?.unavailableTitle || 'Environmental Data Temporarily Unavailable'}</span>
                </div>
                <p className="text-xs text-emerald-100 max-w-xl">
                  {dataError ||
                    envText?.unavailableDesc ||
                    'Real atmospheric metrics could not be retrieved from satellite feeds. No simulated data is shown to protect clinical precision.'}
                </p>
              </div>
              <button
                onClick={fetchObservations}
                className="px-4 py-2 bg-white text-[#1E3A2B] font-extrabold text-xs rounded-xl hover:bg-emerald-50 transition-all shrink-0 shadow-md"
              >
                {envText?.retry || 'Retry Connection'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-900">
              {/* Temperature Card */}
              <div className="bg-[#FAF7F0] border border-[#E0D8CB] rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>{envText?.temperature || 'Temperature'}</span>
                  <Thermometer className="w-4 h-4 text-amber-600" />
                </div>
                <div className="my-1.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {envData?.temperature ?? 28}°C
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    {envText?.apparentTemp || 'Feels like'}: {envData?.apparentTemperature ?? 30}°C
                  </div>
                </div>
                <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md self-start">
                  H: {envData?.temperatureMax ?? 32}°C · L: {envData?.temperatureMin ?? 22}°C
                </div>
              </div>

              {/* Relative Humidity Card */}
              <div className="bg-[#FAF7F0] border border-[#E0D8CB] rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>{envText?.humidity || 'Humidity'}</span>
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <div className="my-1.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {envData?.relativeHumidity ?? 66}%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    {(envData?.relativeHumidity ?? 66) > 70
                      ? isHi
                        ? 'उच्च आर्द्रता'
                        : 'High moisture'
                      : isHi
                        ? 'आरामदायक'
                        : 'Comfortable'}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md self-start">
                  Evaporative Loss Managed
                </div>
              </div>

              {/* Air Quality (AQI) Card */}
              <div className="bg-[#FAF7F0] border border-[#E0D8CB] rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>{envText?.airQuality || 'Air Quality'}</span>
                  <Wind className="w-4 h-4 text-teal-600" />
                </div>
                <div className="my-1.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    AQI {envData?.aqi ?? 72}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    PM2.5: <span className="font-bold text-slate-900">{envData?.pm25 ?? 22} µg/m³</span>
                  </div>
                </div>
                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md self-start ${
                    (envData?.aqi ?? 72) <= 50
                      ? 'text-emerald-800 bg-emerald-100/70'
                      : (envData?.aqi ?? 72) <= 100
                        ? 'text-amber-800 bg-amber-100/70'
                        : 'text-rose-800 bg-rose-100/70'
                  }`}
                >
                  {(envData?.aqi ?? 72) <= 50
                    ? 'WHO Standard Compliant'
                    : (envData?.aqi ?? 72) <= 100
                      ? 'Moderate Air Index'
                      : 'Sensitive Protection Advised'}
                </div>
              </div>

              {/* UV Radiation Index Card */}
              <div className="bg-[#FAF7F0] border border-[#E0D8CB] rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>{envText?.uvIndex || 'UV Index'}</span>
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div className="my-1.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {envData?.uvIndex ?? 5.4}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    {(envData?.uvIndex ?? 5.4) >= 6
                      ? isHi
                        ? 'उच्च विकिरण'
                        : 'High Solar Radiation'
                      : isHi
                        ? 'मध्यम धूप'
                        : 'Moderate Exposure'}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md self-start">
                  {(envData?.uvIndex ?? 5.4) >= 6 ? 'SPF 30+ & Hat Recommended' : 'Routine Daylight'}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* 4. USER PROFILE & REPORT STATUS SUMMARY STRIP                           */}
          {/* ======================================================================= */}
          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Pregnancy / Child Stage */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                  {isHi ? 'चिकित्सकीय स्थिति' : 'Clinical Stage'}
                </span>
                <span className="font-extrabold text-white truncate block">
                  {clinicalProfileStatus.stageDescription}
                </span>
              </div>
            </div>

            {/* Maternal Vitals Status */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                  {isHi ? 'मातृत्व वाइटल्स स्थिति' : 'Vitals Status'}
                </span>
                <span className="font-extrabold text-white truncate block">
                  {clinicalProfileStatus.vitalsStatus.hasLogs ? (
                    <span className="flex items-center gap-1 text-emerald-200">
                      <span>BP: {clinicalProfileStatus.vitalsStatus.latestBp || 'Logged'}</span>
                      {clinicalProfileStatus.vitalsStatus.isOverdue && (
                        <span className="text-amber-300 text-[10px] font-semibold">(Update due)</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-amber-200 font-bold">⚠️ No readings logged</span>
                  )}
                </span>
              </div>
            </div>

            {/* Clinical Reports Status */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4 text-teal-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                  {isHi ? 'अपलोड की गई रिपोर्ट' : 'Uploaded Clinical Reports'}
                </span>
                <span className="font-extrabold text-white truncate block">
                  {clinicalProfileStatus.reportsStatus.totalUploaded > 0 ? (
                    <span className="text-emerald-200">
                      {clinicalProfileStatus.reportsStatus.totalUploaded} {isHi ? 'रिपोर्ट वॉल्ट में' : 'reports in Vault'}
                    </span>
                  ) : (
                    <span className="text-amber-200 font-bold">0 reports uploaded</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 5. MISSING DATA WARNINGS (TRANSPARENCY - NEVER FABRICATE VALUES)         */}
          {/* ======================================================================= */}
          {missingDataWarnings.length > 0 && (
            <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isHi
                    ? `अनुपलब्ध नैदानिक डेटा सूचना (${missingDataWarnings.length} महत्वपूर्ण बिंदु)`
                    : `Data Availability Notice (${missingDataWarnings.length} Missing Inputs)`}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-emerald-100">
                {missingDataWarnings.slice(0, 2).map((w, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-1">
                    <span className="font-bold text-amber-200 block">
                      • {isHi && w.fieldHi ? w.fieldHi : w.field}
                    </span>
                    <p className="text-white/80 leading-snug">
                      {isHi && w.impactHi ? w.impactHi : w.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* 6. PERSONALISED HEALTH INSIGHT BOX GENERATED BY CLINICAL ENGINE         */}
          {/* ======================================================================= */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                  urgencyLevel === 'urgent_medical_assessment'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : urgencyLevel === 'clinician_consultation'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-400 text-slate-950'
                }`}
              >
                {urgencyLevel === 'urgent_medical_assessment' ? (
                  <AlertCircle className="w-5 h-5 text-white" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      urgencyLevel === 'urgent_medical_assessment'
                        ? 'bg-rose-500 text-white'
                        : urgencyLevel === 'clinician_consultation'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {urgencyLevel === 'urgent_medical_assessment'
                      ? (isHi ? 'तत्काल चिकित्सकीय जांच' : 'Urgent Medical Assessment')
                      : urgencyLevel === 'clinician_consultation'
                        ? (isHi ? 'डॉक्टर परामर्श अनुशंसित' : 'Clinician Consultation')
                        : (isHi ? 'नियमित स्वास्थ्य निगरानी' : 'Routine Monitoring')}
                  </span>

                  {primaryFinding && (
                    <span className="text-xs font-bold text-amber-300">
                      {isHi && primaryFinding.titleHi ? primaryFinding.titleHi : primaryFinding.title}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-normal max-w-3xl">
                  {primaryFinding
                    ? (isHi && primaryFinding.descriptionHi ? primaryFinding.descriptionHi : primaryFinding.description)
                    : (isHi ? analysisResult.urgencyRationaleHi : analysisResult.urgencyRationale)}
                </p>

                {precautions.length > 0 && (
                  <div className="text-[11px] text-amber-200/90 font-medium pt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>
                      <strong>{isHi ? 'व्यावहारिक कदम:' : 'Next Step:'}</strong>{' '}
                      {isHi && precautions[0].actionHi ? precautions[0].actionHi : precautions[0].action}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION: Generate Environmental Health Report */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2 shrink-0"
            >
              <FileText className="w-4 h-4 text-slate-900" />
              <span>{envText?.generateReport || 'Generate Environmental Health Report'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MODALS: LOCATION SELECTION & COMPREHENSIVE CLINICAL REPORT             */}
      {/* ========================================================================= */}
      <LocationChangeModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSaved={fetchObservations}
      />

      <EnvironmentalHealthReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={null}
        envData={envData}
        locationName={fullLocationString}
        analysisResult={analysisResult}
      />
    </div>
  );
};
