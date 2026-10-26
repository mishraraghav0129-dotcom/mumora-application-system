import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import {
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  FileQuestion,
  RotateCcw,
  PhoneCall,
  Info,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isEmergency?: boolean;
}

export const AiAssistant: React.FC = () => {
  const {
    language,
    setLanguage,
    pregnancy,
    activeBaby,
    appMode,
    setShowEmergencyModal,
    nutritionProfile,
    adaptiveDietPlan,
    userProfile,
    vitalLogs,
    maternalHistory,
  } = useApp();
  const t = TRANSLATIONS[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_init',
      role: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं "Mumora AI" हूँ — आपकी मातृत्व और शिशु स्वास्थ्य डिजिटल साथी (Healthy Moms ♥ Brighter Tomorrows)। आप मुझसे गर्भावस्था के सप्ताह, अल्ट्रासाउंड रिपोर्ट (CRL, AFI), पोषण या शिशु देखभाल के बारे में किसी भी भाषा में पूछ सकती हैं।'
          : 'Welcome! I am Mumora AI, your maternal and child health companion (Healthy Moms ♥ Brighter Tomorrows). Ask me about your gestational week, ultrasound scan terminology, lab results, nutrition, or baby care milestones in any language.',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: query,
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, text: m.text })),
          language,
          userContext: {
            stage: appMode === 'baby' ? 'Postpartum / Baby Care' : 'Pregnancy',
            week: pregnancy.currentWeek,
            dueDate: pregnancy.estimatedDueDate,
            babyAge: activeBaby ? `${activeBaby.name}, born ${activeBaby.birthDate}` : 'N/A',
            dietaryPreference: nutritionProfile.dietaryPreference,
            dietaryRule: nutritionProfile.dietaryPreference === 'vegetarian'
              ? 'STRICT VEGETARIAN: You must NEVER recommend meat, chicken, fish, seafood, or eggs.'
              : 'NON-VEGETARIAN: Recommend safe cooked meats, fish, or eggs alongside vegetarian staples.',
            latestDietPlanNotice: adaptiveDietPlan?.whatChangedSummary?.[0] || 'Standard trimester nutrition active',
            location: {
              city: userProfile.city || userProfile.district || 'Bengaluru',
              state: userProfile.state_region_name || userProfile.state || '',
              country: userProfile.country_name || userProfile.country || 'India',
              latitude: userProfile.latitude,
              longitude: userProfile.longitude,
            },
            medicalContext: {
              maternalConditions: maternalHistory.preExistingConditions,
              allergies: maternalHistory.allergies,
              latestVitals: vitalLogs[0]
                ? `${vitalLogs[0].bloodPressureSystolic}/${vitalLogs[0].bloodPressureDiastolic} mmHg`
                : 'Normal',
            },
          },
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Unable to load guidance at this moment. Please consult your physician.',
        isEmergency: data.isEmergencyAlert,
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (data.isEmergencyAlert) {
        setEmergencyAlertActive(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: `a_err_${Date.now()}`,
          role: 'assistant',
          text:
            language === 'hi'
              ? 'नेटवर्क समस्या के कारण उत्तर लोड नहीं हो सका। यदि आप किसी आपातकालीन लक्षण का सामना कर रही हैं, तो तुरंत 108 / 102 पर संपर्क करें।'
              : 'Network error communicating with medical assistant. If experiencing emergency symptoms, proceed to the nearest hospital labor room immediately.',
          isEmergency: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-sm flex flex-col h-[750px] max-h-[85vh] overflow-hidden animate-fadeIn">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-purple-100 bg-gradient-to-r from-purple-50/60 via-pink-50/30 to-amber-50/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-purple-100 shadow-xs shadow-purple-100 flex items-center justify-center shrink-0">
            <img src="/mumora-logo.png" alt="Mumora AI" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{t.assistant.title}</span>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                Gemini 3.8
              </span>
            </h2>
            <p className="text-xs text-slate-500">{t.assistant.subtitle}</p>
          </div>
        </div>

        <button
          onClick={() => setShowEmergencyModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors border border-red-200"
        >
          <PhoneCall className="w-3.5 h-3.5 text-red-600" />
          <span>{language === 'hi' ? '108 आपातकालीन' : '108 Helpline'}</span>
        </button>
      </div>

      {/* Emergency Alert Banner if triggered */}
      {emergencyAlertActive && (
        <div className="p-3 bg-red-600 text-white flex items-center justify-between text-xs px-5">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
            <span>
              {language === 'hi'
                ? 'आपातकालीन लक्षण पाए गए हैं। तुरंत निकटतम अस्पताल या 108/102 पर संपर्क करें।'
                : 'Emergency warning signs identified. Proceed to the nearest hospital labor/emergency room.'}
            </span>
          </div>
          <button
            onClick={() => setEmergencyAlertActive(false)}
            className="text-xs underline text-red-100 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : msg.isEmergency
                    ? 'bg-red-50 text-red-950 border border-red-200 rounded-bl-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/70 rounded-bl-xs'
                }`}
              >
                {/* Render formatted message */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.text}
                </div>

                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="italic">
                      {language === 'hi' ? 'शैक्षणिक परामर्श · डॉक्टर से पुष्टि करें' : 'Educational · Verify with Doctor'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-slate-900 flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-xs p-4 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500 animate-spin" />
              <span>{t.assistant.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex items-center gap-2 no-scrollbar">
        {t.assistant.quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 whitespace-nowrap transition-colors shrink-0 border border-slate-200/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 border-t border-rose-100 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={t.assistant.inputPlaceholder}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.assistant.send}</span>
        </button>
      </form>

      {/* Mandatory Clinical Disclaimer Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5 text-center justify-center">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{t.assistant.disclaimer}</span>
      </div>
    </div>
  );
};
