import React, { useState } from 'react';
import {
  Heart,
  Baby,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserCheck,
  Lock,
  Globe,
  ChevronDown,
  Activity,
  FileText,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageSelectorModal } from '../LanguageSelectorModal';
import { WORLD_LANGUAGES, TRANSLATIONS } from '../../data/translations';

interface WelcomeScreenProps {
  onStartSignup: () => void;
  onStartLogin: () => void;
  onOpenAdminLogin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartSignup,
  onStartLogin,
  onOpenAdminLogin,
}) => {
  const { language, setLanguage } = useApp();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const isHi = language === 'hi';
  const t = TRANSLATIONS[language];
  const currentLangObj = WORLD_LANGUAGES.find(l => l.code === language) || {
    code: language,
    name: 'English',
    nativeName: 'English',
    flag: '🌐',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-purple-50/40 to-[#FAF7F2] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Navbar: Brand & Language Toggle */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-purple-100 shadow-sm flex items-center justify-center shrink-0">
            <img
              src="/mumora-logo.png"
              alt="Mumora"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Mumora
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full border border-purple-200">
                {isHi ? (
                  <>
                    <span>स्वस्थ माताएं</span>
                    <span className="text-pink-500">♥</span>
                    <span>उज्जवल भविष्य</span>
                  </>
                ) : (
                  <>
                    <span>Healthy Moms</span>
                    <span className="text-pink-500">♥</span>
                    <span>Brighter Tomorrows</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {isHi
                ? 'मातृ एवं शिशु स्वास्थ्य प्रबंधन प्लेटफॉर्म'
                : 'Maternal & Child Health Care Platform'}
            </p>
          </div>
        </div>

        {/* Right Controls: Single Language Selector */}
        <div className="flex items-center gap-2">

          {/* Global Language Selector Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-2xs"
            title="Choose Interface Language"
          >
            <Globe className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="hidden sm:inline text-slate-500 font-semibold">{t.common?.language || 'Language'}:</span>
            <span className="font-extrabold flex items-center gap-1">
              <span>{currentLangObj.flag}</span>
              <span className="truncate max-w-[85px] sm:max-w-none">{currentLangObj.nativeName}</span>
            </span>
            <ChevronDown className="w-3 h-3 text-purple-500 shrink-0" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 sm:py-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        {/* Left: Headline & Key Clinical Pillars */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-extrabold shadow-2xs">
            <Sparkles className="w-4 h-4 text-purple-700 fill-purple-700" />
            <span>
              {isHi
                ? 'सुरक्षित मातृ एवं शिशु स्वास्थ्य साथी'
                : 'Safe Maternal & Pediatric Healthcare Companion'}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {isHi ? (
                <>
                  हर माँ और शिशु के लिए <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600">
                    व्यक्तिगत स्वास्थ्य सुरक्षा
                  </span>
                </>
              ) : (
                <>
                  Personalized Care for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600">
                    Mothers &amp; Growing Babies
                  </span>
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {isHi
                ? 'गर्भावस्था ट्रैकिंग, डब्ल्यूएचओ विकास चार्ट, मल्टी-बेबी प्रोफाइल और सुरक्षित मेडिकल रिपोर्ट विश्लेषण — सभी एक ही सुरक्षित परिवार खाते में।'
                : 'Antenatal fetal development, WHO growth standards, multi-baby health records, and AI-assisted pediatric report analysis — with complete privacy.'}
            </p>
          </div>

          {/* 4 Core Value Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-left">
            <div className="p-3 bg-white/90 border border-purple-100 rounded-2xl shadow-2xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs text-slate-900">
                  {isHi ? 'गर्भावस्था ट्रैकिंग' : 'Pregnancy Care'}
                </h2>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {isHi ? 'सप्ताहिक विकास व सोनोग्राफी' : 'Week-by-week antenatal logs'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/90 border border-purple-100 rounded-2xl shadow-2xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
                <Baby className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs text-slate-900">
                  {isHi ? 'मल्टी-बेबी प्रोफाइल' : 'Multi-Baby Profiles'}
                </h2>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {isHi ? 'अलग विकास चार्ट व टीके' : 'Independent child records'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/90 border border-purple-100 rounded-2xl shadow-2xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs text-slate-900">
                  {isHi ? 'मेडिकल रिपोर्ट वॉल्ट' : 'Medical Report Vault'}
                </h2>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {isHi ? 'सीबीसी, आयरन व अल्ट्रासाउंड' : 'Lab extraction & guidance'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/90 border border-purple-100 rounded-2xl shadow-2xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs text-slate-900">
                  {isHi ? 'डब्ल्यूएचओ मानक' : 'WHO Standards'}
                </h2>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {isHi ? 'क्लिनिकल साक्ष्य आधारित' : 'Evidence-based percentiles'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auth Action Box */}
        <div className="w-full max-w-sm shrink-0">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-xl space-y-5 relative overflow-hidden">
            {/* Top gradient highlight */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500" />

            <div className="space-y-1 text-center">
              <h2 className="font-black text-xl text-slate-900">
                {isHi ? 'मुमोरा में आपका स्वागत है' : 'Get Started with Mumora'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'अपने और अपने बच्चे के स्वास्थ्य की निगरानी शुरू करें'
                  : 'Sign in to access your private maternal and baby health records'}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={onStartSignup}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-900/10 transition-all active:scale-[0.99]"
              >
                <span>{isHi ? 'नया खाता बनाएं' : 'Create New Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStartLogin}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-200 text-purple-900 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <UserCheck className="w-4 h-4 text-purple-700" />
                <span>{isHi ? 'मौजूदा खाते में लॉगिन करें' : 'Login to Existing Account'}</span>
              </button>
            </div>

            {/* Security Badge */}
            <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHi ? 'व्यक्तिगत डेटा सुरक्षा व गोपनीयता' : 'End-to-End Account Data Isolation'}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-purple-100/70 text-center text-xs text-slate-500 space-y-1">
        <p className="text-[11px] text-slate-500">
          {isHi
            ? 'Mumora — स्वस्थ माताएं ♥ उज्जवल भविष्य। आपातकालीन चिकित्सा सहायता के लिए कृपया 108 या 102 डायल करें।'
            : 'Mumora — Healthy Moms ♥ Brighter Tomorrows. Clinical information is educational. Dial 108 or 102 for emergency.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-1 text-[11px]">
          <span className="text-slate-400">
            {isHi ? 'डीपीडीपीए 2023 अनुरूप · सुरक्षित पृथक डेटा' : 'DPDPA 2023 Compliant · Multi-User Isolation'}
          </span>
          {onOpenAdminLogin && (
            <>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="text-purple-700 hover:text-purple-900 font-bold hover:underline inline-flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-purple-600" />
                <span>{isHi ? 'प्रशासक पोर्टल' : 'Admin Portal Access'}</span>
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Global Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </div>
  );
};
