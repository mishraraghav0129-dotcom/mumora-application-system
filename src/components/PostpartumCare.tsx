import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS, EPDS_QUESTIONS } from '../data/translations';
import { HospitalBag } from './HospitalBag';
import {
  HeartHandshake,
  ShieldAlert,
  Brain,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Activity,
  Luggage
} from 'lucide-react';

export const PostpartumCare: React.FC = () => {
  const { language, setShowEmergencyModal } = useApp();
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<'recovery' | 'epds' | 'hospitalBag'>('recovery');

  // EPDS Questionnaire State
  const [epdsAnswers, setEpdsAnswers] = useState<Record<number, number>>({});
  const [epdsSubmitted, setEpdsSubmitted] = useState<boolean>(false);

  const calculateEpdsScore = () => {
    return Object.values(epdsAnswers).reduce((a, b) => a + b, 0);
  };

  const handleSelectEpds = (qId: number, score: number) => {
    setEpdsAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const epdsScore = calculateEpdsScore();
  const hasSelfHarmFlag = epdsAnswers[10] && epdsAnswers[10] > 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation Tabs for Postpartum Care */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('recovery')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'recovery'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'शारीरिक सुधार (Lochia)' : 'Physical Recovery'}
        </button>
        <button
          onClick={() => setActiveTab('epds')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'epds'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'मानसिक स्वास्थ्य (EPDS)' : 'Emotional Wellbeing (EPDS)'}
        </button>
        <button
          onClick={() => setActiveTab('hospitalBag')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'hospitalBag'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'हॉस्पिटल बैग चेकलिस्ट' : 'Hospital Bag Checklist'}
        </button>
      </div>

      {/* Tab 1: Physical Recovery & Lochia Guide */}
      {activeTab === 'recovery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {t.postpartum.lochiaTracker}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'प्रसव के बाद गर्भाशय के ठीक होने और रक्तस्राव (Lochia) के विभिन्न चरण'
                  : 'Normal postpartum uterine healing and progressive vaginal discharge trajectory'}
              </p>
            </div>

            {/* Lochia Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/80 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 block">
                  Stage 1: Days 1-4
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'hi' ? 'लोकिया रूब्रा (Lochia Rubra)' : 'Lochia Rubra'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi'
                    ? 'गहरा लाल रंग, भारी रक्तस्राव। छोटे थक्के (सिक्के के आकार तक) सामान्य हैं।'
                    : 'Bright red, heavy flow like a heavy menstrual period. Small clots (< coin size) are normal.'}
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">
                  Stage 2: Days 4-10
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'hi' ? 'लोकिया सेरोसा (Lochia Serosa)' : 'Lochia Serosa'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi'
                    ? 'गुलाबी या भूरा रंग, प्रवाह काफी कम हो जाता है। कोई दुर्गंध नहीं होनी चाहिए।'
                    : 'Pinkish to brownish, watery and thinner. Flow visibly decreases.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                  Stage 3: Days 10-28+
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'hi' ? 'लोकिया अल्बा (Lochia Alba)' : 'Lochia Alba'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi'
                    ? 'हल्का पीला या सफेद स्राव। गर्भाशय का आंतरिक घाव लगभग भर चुका होता है।'
                    : 'Yellowish-white to creamy discharge. Uterine placental site heals.'}
                </p>
              </div>
            </div>

            {/* Postpartum Hemorrhage Danger Signs */}
            <div className="p-5 bg-red-50 border border-red-300 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>
                  {language === 'hi' ? 'तत्काल डॉक्टर से मिलें (Postpartum Red Flags):' : 'Seek Immediate Emergency Care If:'}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-red-900 list-disc list-inside">
                <li>
                  {language === 'hi'
                    ? '1 घंटे में एक से अधिक मैटरनिटी पैड पूरी तरह भीग जाए (अत्यधिक रक्तस्राव)'
                    : 'Soaking through more than one maternity pad an hour for 2 consecutive hours'}
                </li>
                <li>
                  {language === 'hi'
                    ? 'नींबू या गोल्फ बॉल से बड़े रक्त के थक्के निकलना'
                    : 'Passing blood clots larger than a golf ball / lemon'}
                </li>
                <li>
                  {language === 'hi'
                    ? 'स्राव से दुर्गंध आना या 100.4°F (38°C) से अधिक तेज बुखार होना'
                    : 'Foul-smelling discharge or fever above 100.4°F (38°C)'}
                </li>
                <li>
                  {language === 'hi'
                    ? 'अचानक चक्कर आना, बेहोशी या तीव्र पेट दर्द'
                    : 'Sudden dizziness, fainting, or severe worsening lower abdominal pain'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Edinburgh Postnatal Depression Scale (EPDS) */}
      {activeTab === 'epds' && (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-rose-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t.postpartum.epdsTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {t.postpartum.epdsDesc}
            </p>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {EPDS_QUESTIONS.map(q => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">
                  {q.id}. {language === 'hi' ? q.questionHi : q.question}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = epdsAnswers[q.id] === opt.score;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectEpds(q.id, opt.score)}
                        className={`p-2.5 rounded-xl text-left text-xs transition-colors border ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {language === 'hi' ? opt.textHi : opt.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Action / Result */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  {language === 'hi' ? 'कुल EPDS स्कोर' : 'Total EPDS Score'}
                </span>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                  {epdsScore} <span className="text-xs font-sans text-slate-400 font-normal">/ 30</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEpdsAnswers({})}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  {language === 'hi' ? 'पुनः सेट करें' : 'Reset'}
                </button>
                <button
                  onClick={() => setEpdsSubmitted(true)}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  {language === 'hi' ? 'परिणाम देखें' : 'View Clinical Assessment'}
                </button>
              </div>
            </div>

            {epdsSubmitted && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  epdsScore >= 13 || hasSelfHarmFlag
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : epdsScore >= 10
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <span className="font-bold text-sm block">
                  {epdsScore >= 13 || hasSelfHarmFlag
                    ? (language === 'hi' ? 'चिकित्सीय परामर्श की अनुशंसा (Score ≥ 13):' : 'Professional Consultation Strongly Advised:')
                    : epdsScore >= 10
                    ? (language === 'hi' ? 'हल्का भावनात्मक तनाव (Score 10-12):' : 'Mild Postpartum Stress / Adjustment (Score 10-12):')
                    : (language === 'hi' ? 'सामान्य भावनात्मक स्थिति (Score 0-9):' : 'Reassuring Emotional Wellbeing (Score 0-9):')}
                </span>
                <p>
                  {epdsScore >= 13 || hasSelfHarmFlag
                    ? (language === 'hi'
                        ? 'आपका स्कोर प्रसवोत्तर अवसाद (PPD) का संकेत देता है। कृपया याद रखें: यह आपकी कोई गलती नहीं है। यह हार्मोन्स और शारीरिक थकान के कारण होता है। अपने डॉक्टर या मानसिक स्वास्थ्य काउंसलर से निःसंकोच बात करें। भारत सरकार की राष्ट्रीय टेली-मानस हेल्पलाइन: 14416 (निःशुल्क)।'
                        : 'Your responses suggest noticeable distress. Postpartum depression is a medical condition caused by chemical and hormonal changes, not a personal failure. Please speak openly with your doctor. National Tele-MANAS Mental Health Helpline: 14416.')
                    : (language === 'hi'
                        ? 'आपका स्कोर सामान्य सीमा में है। प्रसव के बाद पहले 2 सप्ताह हल्की उदासी (Baby Blues) सामान्य है। भरपूर नींद और पोषण लें।'
                        : 'Your responses reflect healthy adaptation. Continue prioritizing sleep, gentle walks, and leaning on family support.')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Hospital Bag Checklist */}
      {activeTab === 'hospitalBag' && <HospitalBag />}
    </div>
  );
};
