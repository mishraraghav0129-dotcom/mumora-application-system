import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { PhoneCall, AlertTriangle, X, ShieldAlert, HeartPulse, Building2 } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { language, showEmergencyModal, setShowEmergencyModal, userProfile, setAppMode } = useApp();
  const t = TRANSLATIONS[language];

  if (!showEmergencyModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
        {/* Header Alert Bar */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-white shrink-0" />
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {t.emergency.title}
              </h2>
              <p className="text-xs text-red-100">
                {t.emergency.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEmergencyModal(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick Dial Emergency Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              {t.emergency.quickDial}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm text-sm transition-transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>108 (Ambulance)</span>
              </a>
              <a
                href="tel:102"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm text-sm transition-transform active:scale-95"
              >
                <HeartPulse className="w-4 h-4" />
                <span>102 (Janani Shishu)</span>
              </a>
            </div>
          </div>

          {/* User's Registered Hospital and Doctor */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>{language === 'te' ? 'మీ నమోదిత ప్రసూతి ఆసుపత్రి:' : language === 'hi' ? 'आपका पंजीकृत मैटरनिटी अस्पताल:' : 'Your Primary Maternity Hospital:'}</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{userProfile.primaryHospital}</p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
              <span className="text-slate-600">
                {userProfile.doctorName}
              </span>
              <a
                href={`tel:${userProfile.doctorPhone}`}
                className="text-rose-600 font-semibold hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{userProfile.doctorPhone}</span>
              </a>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600">
                {userProfile.emergencyContactName}
              </span>
              <a
                href={`tel:${userProfile.emergencyContactPhone}`}
                className="text-slate-900 font-semibold hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{userProfile.emergencyContactPhone}</span>
              </a>
            </div>
          </div>

          {/* Warning Signs Checklist */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {language === 'te' ? 'ప్రమాద సంకేతాలు (వెంటనే ఆసుపత్రికి వెళ్ళండి):' : language === 'hi' ? 'खतरे के संकेत (Red Flag Symptoms):' : 'Immediate Danger Signs (Go to Hospital):'}
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {t.emergency.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 p-1.5 rounded-lg bg-amber-50/70 border border-amber-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 italic text-center">
            {language === 'te'
              ? 'అత్యవసర పరిస్థితిలో యాప్ ప్రతిస్పందనల కోసం వేచి ఉండకండి. నేరుగా సమీప ఆసుపత్రికి వెళ్ళండి.'
              : language === 'hi'
              ? 'आपात स्थिति में ऐप के उत्तर की प्रतीक्षा न करें, तुरंत निकटतम प्रसूति आपातकालीन कक्ष में जाएं।'
              : 'In an emergency, do not wait for chat responses. Proceed directly to the nearest hospital labor ward.'}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setShowEmergencyModal(false);
              setAppMode('hospitals');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-transform active:scale-95"
          >
            <Building2 className="w-4 h-4 text-rose-400" />
            <span>{language === 'te' ? 'సమీప ఆసుపత్రులు & ఫోన్ నంబర్లు చూడండి' : language === 'hi' ? 'निकटतम अस्पताल सूची एवं फोन नंबर देखें' : 'View Nearest Hospitals & Phone Numbers'}</span>
          </button>

          <button
            onClick={() => setShowEmergencyModal(false)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {t.emergency.close}
          </button>
        </div>
      </div>
    </div>
  );
};
