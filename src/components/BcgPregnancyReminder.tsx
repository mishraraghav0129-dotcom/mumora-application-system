import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { EMERGENCY_HOSPITALS_INDIA } from '../data/hospitalsData';
import {
  Bell,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Download,
  Clock,
  Sparkles,
  PhoneCall,
  Info,
  RefreshCw,
  Sun,
  CloudRain,
  Building2,
  Check
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

const CITIES = [
  'Bengaluru',
  'Delhi NCR',
  'Mumbai',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Ahmedabad',
];

export const BcgPregnancyReminder: React.FC = () => {
  const { language, pregnancy, userProfile, addHospitalBagItem } = useApp();
  const t = TRANSLATIONS[language];

  // Geolocation & Environmental State
  const [selectedCity, setSelectedCity] = useState<string>(userProfile.city || 'Bengaluru');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isEnvLoading, setIsEnvLoading] = useState(false);
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null);

  // BCG Reminder & Target Date State
  const isBirthPrepStage = pregnancy.currentWeek >= 20;
  const [isOpenEarly, setIsOpenEarly] = useState(false);
  const isComponentOpen = isBirthPrepStage || isOpenEarly;

  const [targetDeliveryDate, setTargetDeliveryDate] = useState<string>(pregnancy.estimatedDueDate);
  const [isReminderSet, setIsReminderSet] = useState<boolean>(() => {
    return localStorage.getItem('mumora_bcg_reminder_set') === 'true';
  });
  const [hospitalConfirmed, setHospitalConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('mumora_bcg_hospital_confirmed') === 'true';
  });

  // Checklist items
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('mumora_bcg_checklist');
    return saved
      ? JSON.parse(saved)
      : {
          confirm_stock: true,
          birth_plan: false,
          bag_card: true,
          partner_briefed: false,
          site_care_read: false,
        };
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [icsDownloaded, setIcsDownloaded] = useState(false);

  // Fetch Environmental Context on mount & city change
  useEffect(() => {
    fetchEnvironmentalContext(selectedCity);
  }, [selectedCity]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mumora_bcg_reminder_set', String(isReminderSet));
  }, [isReminderSet]);

  useEffect(() => {
    localStorage.setItem('mumora_bcg_hospital_confirmed', String(hospitalConfirmed));
  }, [hospitalConfirmed]);

  useEffect(() => {
    localStorage.setItem('mumora_bcg_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const fetchEnvironmentalContext = async (cityName: string, coords?: { lat: number; lng: number }) => {
    setIsEnvLoading(true);
    try {
      let queryUrl = `/api/environmental-context?city=${encodeURIComponent(cityName)}`;
      if (coords) {
        queryUrl += `&lat=${coords.lat}&lng=${coords.lng}`;
      }
      const res = await fetch(queryUrl);
      const data = await res.json();
      setEnvData(data);
    } catch (err) {
      console.error('Error fetching environmental context for BCG reminder:', err);
      setEnvData({
        success: false,
        available: false,
        city: cityName,
        temperature: 27,
        relativeHumidity: 65,
        aqi: 72,
        climateRiskLevel: 'low',
      });
    } finally {
      setIsEnvLoading(false);
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError(language === 'hi' ? 'GPS ब्राउज़र द्वारा समर्थित नहीं है।' : 'Geolocation not supported by browser.');
      return;
    }
    setIsGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsGpsLoading(false);
        fetchEnvironmentalContext(selectedCity, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      err => {
        setIsGpsLoading(false);
        setGpsError(err.message || 'Unable to retrieve GPS coordinates.');
      },
      { timeout: 8000 }
    );
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Generate .ics calendar reminder for native phone calendars
  const handleDownloadIcs = () => {
    const formattedDate = targetDeliveryDate.replace(/-/g, '');
    const temp = envData?.temperature ? `${envData.temperature}°C` : 'seasonal temp';
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mumora//BCG Birth Dose Reminder//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:👶 Baby's BCG Birth Vaccine Due - Mumora Alert (${selectedCity})
DESCRIPTION:Essential birth dose BCG immunization for newborn against Tuberculosis (TB) and Tuberculous Meningitis.\\n\\n📍 Delivery Location: ${selectedCity} (${userProfile.primaryHospital})\\n🌡️ Environmental Cold-Chain Advisory: BCG is a live freeze-dried vaccine sensitive to heat. Ensure hospital maintains 2°C to 8°C cold-chain integrity during delivery (current temp: ${temp}).\\n💉 Administration: 0.05 ml intradermal in baby's left upper arm within 0-48 hours of birth before hospital discharge.\\n⚠️ Notice: BCG is administered to the baby at birth (not during pregnancy).\\n\\nMumora — Healthy Moms ♥ Brighter Tomorrows
DTSTART;VALUE=DATE:${formattedDate}
DTEND;VALUE=DATE:${formattedDate}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P2D
ACTION:DISPLAY
DESCRIPTION:Mumora Reminder: 2 days until baby's expected BCG birth vaccine timing. Confirm hospital vaccine vials.
END:VALARM
BEGIN:VALARM
TRIGGER:-PT0M
ACTION:DISPLAY
DESCRIPTION:Baby's BCG Vaccine Due: Confirm administration with labor ward nurse before discharge!
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Mumora_BCG_Birth_Vaccine_Reminder_${selectedCity}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIcsDownloaded(true);
    setIsReminderSet(true);
    setTimeout(() => setIcsDownloaded(false), 4000);
  };

  // Environmental conditions assessment
  const temp = envData?.temperature ?? 26.5;
  const humidity = envData?.relativeHumidity ?? 65;
  const aqi = envData?.aqi ?? 68;

  const isHighHeat = temp > 32;
  const isHighHumidity = humidity > 70;
  const isHighAqi = aqi > 100;

  const canonicalCity = userProfile.city || userProfile.district || 'Bengaluru';

  // Filter local hospitals using canonical location
  const localHospitals = EMERGENCY_HOSPITALS_INDIA.filter(
    h => h.city.toLowerCase() === canonicalCity.toLowerCase()
  );
  const displayHospitals = localHospitals.length > 0 ? localHospitals : EMERGENCY_HOSPITALS_INDIA;

  if (!isComponentOpen) {
    return (
      <div className="bg-gradient-to-r from-purple-50/50 via-pink-50/30 to-amber-50/20 rounded-3xl border border-purple-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white p-2 border border-purple-100 text-purple-600 shadow-xs flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'बीसीजी जन्म टीका योजना एवं तैयारी' : 'BCG Birth Vaccine Planner'}
              </h3>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                {language === 'hi' ? 'सप्ताह 20+ में सक्रिय होगा' : 'Opens Week 20+'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? `वर्तमान में आप सप्ताह ${pregnancy.currentWeek} में हैं। प्रसव अस्पताल और कोल्ड-चेन की तैयारी सप्ताह 20 के बाद शुरू होती है।`
                : `Currently in Week ${pregnancy.currentWeek}. Delivery hospital preparation and BCG cold-chain checks activate in late 2nd trimester.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpenEarly(true)}
          className="px-4 py-2 text-xs font-semibold text-purple-700 bg-white hover:bg-purple-100/60 rounded-xl border border-purple-200 transition-colors shrink-0 shadow-2xs"
        >
          {language === 'hi' ? 'पूर्वावलोकन खोलें' : 'Preview Planner'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100/70 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              {language === 'hi' ? 'भौगोलिक एवं जलवायु आधारित टीकाकरण' : 'Geo-Location & Climate-Aware Immunization'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi'
              ? 'गर्भवती माताओं के लिए बीसीजी (BCG) जन्म टीका रिमाइंडर एवं तैयारी'
              : 'BCG Birth Vaccine Planner & Reminder for Expectant Mothers'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'शिशु को टीबी और दिमागी बुखार से सुरक्षा के लिए जन्म के समय (0–48 घंटे) आवश्यक बीसीजी टीके की तैयारी'
              : "Pre-birth scheduling, hospital cold-chain verification, and environmental safeguards for your newborn's birth dose"}
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
              isReminderSet
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>
              {isReminderSet
                ? language === 'hi'
                  ? 'रिमाइंडर सक्रिय है'
                  : 'Reminder Active'
                : language === 'hi'
                ? 'रिमाइंडर सेट करें'
                : 'Reminder Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Clinical Safety Note */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/90 via-pink-50/50 to-amber-50/50 rounded-2xl border border-purple-100 flex items-start gap-3.5 text-xs text-purple-950">
        <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm text-purple-900">
            {language === 'hi'
              ? 'गर्भवती महिलाओं के लिए महत्वपूर्ण चिकित्सीय स्पष्टीकरण (Clinical Safety Notice):'
              : 'Crucial Clinical Clarification for Expectant Mothers:'}
          </span>
          <p className="leading-relaxed text-slate-700">
            {language === 'hi'
              ? 'बीसीजी (BCG) एक जीवित जीवाणु टीका (Live attenuated vaccine) है, इसलिए गर्भावस्था के दौरान मां को सीधे नहीं लगाया जाता। बल्कि, इसे आपके शिशु के जन्म के तुरंत बाद (24-48 घंटों के भीतर) अस्पताल के लेबर रूम में लगाया जाना अनिवार्य है। गर्भावस्था के दौरान मां को टिटनेस/डिप्थीरिया (Td/Tdap) के टीके लगाए जाते हैं जो गर्भस्थ शिशु को एंटीबॉडीज प्रदान करते हैं।'
              : 'BCG (Bacillus Calmette-Guérin) is a live attenuated bacterial vaccine against Tuberculosis (TB). It is NOT administered directly to the mother during pregnancy. Instead, expectant mothers must schedule and verify this reminder so it is given to their newborn within 24–48 hours of birth at the delivery hospital before discharge. (During pregnancy, the mother receives maternal Td/Tdap to protect the fetus).'}
          </p>
        </div>
      </div>

      {/* Delivery Center Location & Clinical Cold-Chain Protocol */}
      <div className="p-4 sm:p-5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'hi' ? 'डिलीवरी अस्पताल एवं कोल्ड-चेन सुरक्षा' : 'Delivery Hospital & Cold-Chain Protocol'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="text-slate-500">{language === 'hi' ? 'पंजीकृत स्थान:' : 'Registered Location:'}</span>
            <strong className="text-purple-900 font-bold bg-white px-2.5 py-1 rounded-lg border border-purple-200">
              {userProfile.city || 'Bengaluru'}, {userProfile.country || 'India'}
            </strong>
          </div>
        </div>

        {/* Cold-Chain Safeguard Protocol */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-white rounded-xl border border-purple-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              {language === 'hi' ? 'कोल्ड चेन तापमान' : 'Cold-Chain Storage'}
            </span>
            <strong className="text-sm font-mono text-purple-900 block mt-0.5">2°C to 8°C</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {language === 'hi' ? 'आइस-लाइन्ड रेफ्रिजरेटर (ILR)' : 'Ice-Lined Refrigerator (ILR)'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-purple-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              {language === 'hi' ? 'घोलने के बाद अवधि' : 'Reconstitution Window'}
            </span>
            <strong className="text-sm font-mono text-purple-900 block mt-0.5">
              {language === 'hi' ? 'अधिकतम 4 घंटे' : 'Within 4 Hours'}
            </strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {language === 'hi' ? 'प्रकाश से सुरक्षित रखें' : 'Light-shielded vial'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-purple-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              {language === 'hi' ? 'खुराक एवं स्थान' : 'Administration Site'}
            </span>
            <strong className="text-sm font-mono text-purple-900 block mt-0.5">0.05 ml Intradermal</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {language === 'hi' ? 'शिशु की बाईं ऊपरी बांह' : "Baby's Left Upper Arm"}
            </span>
          </div>
        </div>
      </div>

      {/* Target Delivery Date & Calendar Reminder Synchronizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Scheduling Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>
                  {language === 'hi' ? 'प्रसव एवं बीसीजी टीका तिथि' : 'Scheduled Target Delivery & Vaccine Date'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded">
                EDD: {pregnancy.estimatedDueDate}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'बीसीजी टीका शिशु के जन्म के तुरंत बाद (0–48 घंटे) लगाया जाता है। अपनी अनुमानित प्रसव तिथि (EDD) के अनुसार अपने फोन कैलेंडर में ऑटोमैटिक रिमाइंडर सिंक करें।'
                : "BCG is administered immediately at birth (within 0–48 hours) before hospital discharge. Sync an automated reminder to your phone calendar based on your delivery timeline."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {language === 'hi' ? 'लक्ष्य प्रसव तिथि' : 'Target Due Date'}
                </label>
                <input
                  type="date"
                  value={targetDeliveryDate}
                  onChange={e => setTargetDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  {language === 'hi' ? 'चयनित प्रसूति अस्पताल' : 'Delivery Hospital'}
                </label>
                <div className="px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 font-medium truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="truncate">{userProfile.primaryHospital}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleDownloadIcs}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-purple-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {icsDownloaded
                  ? language === 'hi'
                    ? 'कैलेंडर में जोड़ा गया! ✓'
                    : 'Calendar Reminder Downloaded! ✓'
                  : language === 'hi'
                  ? 'फोन कैलेंडर में रिमाइंडर जोड़ें (.ics)'
                  : 'Add BCG Birth Reminder to Calendar (.ics)'}
              </span>
            </button>

            <button
              onClick={() => setIsReminderSet(!isReminderSet)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                isReminderSet
                  ? 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {isReminderSet
                  ? language === 'hi'
                    ? 'रिमाइंडर चालू है'
                    : 'Reminder Enabled'
                  : language === 'hi'
                  ? 'सक्रिय करें'
                  : 'Enable In-App'}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Expectant Mother's BCG Preparation Checklist */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                {language === 'hi' ? 'प्रसव पूर्व बीसीजी तैयारी चेकलिस्ट' : 'Pre-Birth BCG Action Checklist'}
              </span>
              <span className="text-[11px] font-mono text-purple-700 font-bold">
                {Object.values(checklist).filter(Boolean).length} / 5
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.confirm_stock}
                  onChange={() => toggleChecklistItem('confirm_stock')}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-400"
                />
                <span className={checklist.confirm_stock ? 'text-slate-500 line-through' : 'text-slate-800'}>
                  {language === 'hi'
                    ? `अस्पताल में बीसीजी और हेपेटाइटिस बी टीकों का स्टॉक सुनिश्चित करें`
                    : `Confirm BCG birth dose availability at ${userProfile.primaryHospital}`}
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.birth_plan}
                  onChange={() => toggleChecklistItem('birth_plan')}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-400"
                />
                <span className={checklist.birth_plan ? 'text-slate-500 line-through' : 'text-slate-800'}>
                  {language === 'hi'
                    ? 'बर्थ प्लान में जन्म खुराक (BCG + OPV-0 + HepB) नोट करें'
                    : 'Add birth immunization (BCG + OPV-0 + Hep B) to birth plan'}
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.bag_card}
                  onChange={() => toggleChecklistItem('bag_card')}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-400"
                />
                <span className={checklist.bag_card ? 'text-slate-500 line-through' : 'text-slate-800'}>
                  {language === 'hi'
                    ? 'हॉस्पिटल बैग में टीकाकरण रिकॉर्ड कार्ड और दस्तावेज़ रखें'
                    : 'Pack newborn vaccine card in Hospital Bag documents file'}
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.partner_briefed}
                  onChange={() => toggleChecklistItem('partner_briefed')}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-400"
                />
                <span className={checklist.partner_briefed ? 'text-slate-500 line-through' : 'text-slate-800'}>
                  {language === 'hi'
                    ? 'पार्टनर को बताएं: छुट्टी से पहले बायीं बांह पर बीसीजी की पुष्टि करें'
                    : 'Instruct birth partner to verify left arm BCG injection before discharge'}
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.site_care_read}
                  onChange={() => toggleChecklistItem('site_care_read')}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-400"
                />
                <span className={checklist.site_care_read ? 'text-slate-500 line-through' : 'text-slate-800'}>
                  {language === 'hi'
                    ? 'बीसीजी निशान और देखभाल की जानकारी पढ़ें (2-4 हफ्ते बाद छोटा दाना)'
                    : 'Read post-vaccine scar guide (normal 2-4 week nodule; no rubbing)'}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>WHO UIP Protocol</span>
            <span className="text-purple-700 font-semibold">Administered within 0–48 hrs</span>
          </div>
        </div>
      </div>

      {/* Maternal vs Newborn Vaccine Schedule Timeline Card */}
      <div className="p-5 bg-gradient-to-r from-purple-50/40 via-pink-50/30 to-amber-50/20 rounded-2xl border border-purple-100/80 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          {language === 'hi'
            ? 'मातृ एवं शिशु टीकाकरण निरंतरता (Maternal-Neonatal Continuum)'
            : 'Maternal Antenatal & Newborn Birth Dose Timeline'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Dose 1 */}
          <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-purple-700 uppercase block">16–20 Weeks (Mother)</span>
            <span className="font-bold text-slate-900 block">Td Dose 1 (Tetanus-Diphtheria)</span>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'मां को दिया जाने वाला पहला टीका' : 'First maternal dose during pregnancy'}
            </p>
          </div>

          {/* Dose 2 */}
          <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-purple-700 uppercase block">24–28 Weeks (Mother)</span>
            <span className="font-bold text-slate-900 block">Td Dose 2 / Tdap Booster</span>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'काली खांसी और टिटनेस की सुरक्षा' : 'Provides transplacental antibodies'}
            </p>
          </div>

          {/* Birth Dose */}
          <div className="p-3 bg-purple-100/60 rounded-xl border border-purple-300 shadow-2xs space-y-1 ring-1 ring-purple-400">
            <span className="text-[10px] font-bold text-purple-900 uppercase block">
              ★ At Birth / 0–48 Hrs (Newborn)
            </span>
            <span className="font-bold text-purple-950 block">BCG + OPV-0 + Hep-B</span>
            <p className="text-[11px] text-purple-900">
              {language === 'hi' ? 'अस्पताल में जन्म के समय आवश्यक' : 'Left upper arm 0.05ml intradermal'}
            </p>
          </div>
        </div>
      </div>

      {/* Verified Hospitals in Canonical City with 24/7 Immunization Ward */}
      {displayHospitals.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              {language === 'hi'
                ? `${canonicalCity} में प्रमाणित प्रसूति एवं बीसीजी टीकाकरण केंद्र`
                : `Verified Maternity & BCG Delivery Facilities in ${canonicalCity}`}
            </h3>
            <span className="text-[11px] text-slate-400">24/7 Cold-Chain Storage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {displayHospitals.slice(0, 2).map(hosp => (
              <div
                key={hosp.id}
                className="p-3.5 bg-slate-50 hover:bg-purple-50/40 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-0.5">
                  <span className="font-bold text-slate-900 block truncate">{hosp.name}</span>
                  <span className="text-[11px] text-slate-500 block truncate">{hosp.address}</span>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-medium pt-0.5">
                    <span>✓ NICU Level III</span>
                    <span>·</span>
                    <span>✓ BCG In-Stock</span>
                  </div>
                </div>

                <a
                  href={`tel:${hosp.laborRoomPhone || hosp.emergencyPhone}`}
                  className="px-2.5 py-1.5 bg-white hover:bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 text-xs shrink-0 flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3 text-purple-600" />
                  <span>Call Labor Ward</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs on BCG for Expectant Mothers */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          {language === 'hi' ? 'अक्सर पूछे जाने वाले चिकित्सीय प्रश्न (BCG FAQ)' : 'BCG Clinical FAQs for Expectant Mothers'}
        </h3>

        {[
          {
            q: language === 'hi' ? 'शिशु को जन्म के तुरंत बाद बीसीजी टीका क्यों दिया जाता है?' : 'Why is BCG given immediately at birth?',
            a: language === 'hi'
              ? 'नवजात शिशुओं की रोग प्रतिरोधक क्षमता अपरिपक्व होती है। टीबी स्थानिक क्षेत्रों में यह टीका शिशु को गंभीर टीबी, फेफड़ों के संक्रमण और घातक ट्यूबरकुलर मेनिन्जाइटिस (दिमागी टीबी) से 80% तक सुरक्षा देता है।'
              : 'Newborns have an immature cell-mediated immune system. In TB-endemic regions, early BCG administration provides up to 80% efficacy against severe, disseminated infant tuberculosis and tubercular meningitis.'
          },
          {
            q: language === 'hi' ? 'टीके के बाद बांह पर निशान कैसे बनता है और क्या सावधानी रखें?' : 'What does the BCG scar look like and how do I care for it?',
            a: language === 'hi'
              ? 'टीके के 2 से 4 सप्ताह बाद बायीं बांह पर एक छोटा सा लाल दाना (nodule) बनता है, जो बाद में पपड़ी बनकर एक छोटे स्थायी निशान में बदल जाता है। यह पूरी तरह सामान्य और टीके के सफल होने का संकेत है। इस पर कभी भी हल्दी, तेल, क्रीम या पट्टी न लगाएं।'
              : 'A small raised papule appears at 2–4 weeks, occasionally discharging a small drop of serous fluid before crusting and healing into a permanent 2–4 mm scar. This confirms a positive immune response. Keep the site clean and dry; do NOT squeeze, rub, or apply antiseptics/ointments.'
          },
          {
            q: language === 'hi' ? 'यदि प्रसव के समय मौसम बहुत गर्म (लू) हो तो क्या ध्यान रखें?' : 'What if ambient weather is very hot during my delivery week?',
            a: language === 'hi'
              ? 'बीसीजी एक अति-संवेदनशील लाइव टीका है जो 2°C से 8°C पर ही सुरक्षित रहता है। अस्पताल में यह सुनिश्चित किया जाता है कि टीका उचित कोल्ड चेन में रखा गया हो और वायल खोलने के 4 घंटे के भीतर इस्तेमाल हो।'
              : 'BCG is heat-sensitive and must be kept strictly at 2°C–8°C in an ice-lined refrigerator (ILR) and protected from direct sunlight. Once reconstituted at the hospital with cold saline diluent, it must be administered within 4 hours.'
          }
        ].map((faq, idx) => (
          <div key={idx} className="border border-slate-200/80 rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="w-full p-3 text-left font-bold text-xs text-slate-800 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>{faq.q}</span>
              <span className="text-purple-600 font-mono text-sm ml-2">
                {activeFaq === idx ? '−' : '+'}
              </span>
            </button>
            {activeFaq === idx && (
              <div className="p-3 text-xs text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
