import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { EmergencyModal } from './components/EmergencyModal';
import { PregnancyTracker } from './components/PregnancyTracker';
import { BabyTracker } from './components/BabyTracker';
import { AiAssistant } from './components/AiAssistant';
import { DocumentVault } from './components/DocumentVault';
import { PostpartumCare } from './components/PostpartumCare';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { NearestHospitals } from './components/NearestHospitals';
import { SmartReminders } from './components/SmartReminders';
import { DailyFoodGuide } from './components/DailyFoodGuide';
import { EnvironmentalHealthIntelligence } from './components/EnvironmentalHealthIntelligence';
import { FamilyHealthAndRiskInsights } from './components/FamilyHealthAndRiskInsights';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileAppModal } from './components/MobileAppModal';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignupMultiStep } from './components/auth/SignupMultiStep';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { configureMobileStatusBar } from './utils/mobileNative';
import { ShieldCheck, Heart, AlertCircle, PhoneCall, Sparkles, Globe, Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { TRANSLATIONS } from './data/translations';

const MainContent: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    login,
    adminUser,
    isAdminAuthenticated,
    appMode,
    setAppMode,
    language,
    setShowEmergencyModal,
  } = useApp();
  const t = TRANSLATIONS[language];
  const isHi = language === 'hi';

  const [authView, setAuthView] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMobileAppModalOpen, setIsMobileAppModalOpen] = useState(false);

  useEffect(() => {
    configureMobileStatusBar();
  }, []);

  // 1. Unauthenticated State: Show Welcome, Login, or 5-Step Signup Flow
  if (!isAuthenticated && !isAdminAuthenticated && appMode !== 'admin') {
    return (
      <>
        {authView === 'welcome' && (
          <WelcomeScreen
            onStartSignup={() => setAuthView('signup')}
            onStartLogin={() => setAuthView('login')}
            onOpenAdminLogin={() => setIsAdminModalOpen(true)}
          />
        )}

        {authView === 'login' && (
          <LoginScreen
            onBackToWelcome={() => setAuthView('welcome')}
            onSwitchToSignup={() => setAuthView('signup')}
            onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
          />
        )}

        {authView === 'signup' && (
          <SignupMultiStep
            onBackToWelcome={() => setAuthView('welcome')}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          onPasswordResetSuccess={() => {
            setIsForgotPasswordOpen(false);
            setAuthView('login');
          }}
          isHi={isHi}
        />

        <AdminLoginModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onLoginSuccess={() => {
            setIsAdminModalOpen(false);
            setAppMode('admin');
          }}
        />
      </>
    );
  }

  // 2. Admin Mode Gate: If in Admin route but not admin-authenticated, show access control screen
  if (appMode === 'admin' && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Administrator Access Required</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This area contains protected clinical audit logs, user management, and AI system telemetry. Please authenticate with authorized credentials.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-red-900/30 active:scale-98"
            >
              Sign In as Administrator
            </button>
            <button
              onClick={() => setAppMode('pregnancy')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Maternal Dashboard</span>
            </button>
          </div>
        </div>

        <AdminLoginModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onLoginSuccess={() => {
            setIsAdminModalOpen(false);
          }}
        />
      </div>
    );
  }

  // 3. Authenticated Mother / Admin App Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900">
      <Header onOpenMobileModal={() => setIsMobileAppModalOpen(true)} />
      <EmergencyModal />
      <OnboardingFlow />
      <MobileAppModal
        isOpen={isMobileAppModalOpen}
        onClose={() => setIsMobileAppModalOpen(false)}
      />

      {/* Mumora Brand Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-100/50 via-pink-50/50 to-amber-50/40 border-b border-purple-100/60 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/mumora-logo.png"
              alt="Mumora Emblem"
              className="w-5 h-5 rounded-md object-contain shrink-0"
            />
            <span className="font-bold text-slate-800">Mumora</span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="text-purple-700 font-medium truncate flex items-center gap-1">
              <span>Healthy Moms</span>
              <span className="text-pink-500">♥</span>
              <span>Brighter Tomorrows</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
            {currentUser && (
              <span className="font-medium text-purple-900 hidden sm:inline">
                Welcome, {currentUser.name}
              </span>
            )}
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              WHO Guidelines
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-purple-700 font-medium">
              <Globe className="w-3 h-3" />
              45+ World Languages
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {appMode === 'pregnancy' && <PregnancyTracker />}
        {appMode === 'baby' && <BabyTracker />}
        {appMode === 'reminders' && <SmartReminders />}
        {appMode === 'nutrition' && <DailyFoodGuide />}
        {appMode === 'environmental' && <EnvironmentalHealthIntelligence />}
        {(appMode === 'risk-insights' || appMode === 'family-health') && <FamilyHealthAndRiskInsights />}
        {appMode === 'assistant' && <AiAssistant />}
        {appMode === 'vault' && <DocumentVault />}
        {appMode === 'hospitals' && <NearestHospitals />}
        {appMode === 'postpartum' && <PostpartumCare />}
        {appMode === 'admin' && <AdminPanel />}
      </main>

      {/* Clean, premium Mumora healthcare footer */}
      <footer className="mt-auto border-t border-purple-100/70 bg-white/90 backdrop-blur-md py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img
              src="/mumora-logo.png"
              alt="Mumora Logo"
              className="w-9 h-9 rounded-xl object-contain border border-purple-100 p-0.5 bg-white shadow-xs shrink-0"
            />
            <div className="space-y-0.5 text-left">
              <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>Mumora</span>
                <span className="text-xs font-normal text-purple-700">· Healthy Moms ♥ Brighter Tomorrows</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {language === 'hi'
                  ? 'चिकित्सा सूचना केवल शैक्षणिक संदर्भ के लिए है। किसी भी आपात स्थिति में तुरंत 108 या 102 डायल करें।'
                  : 'Educational clinical information. Never a substitute for doctor consultation. Call 108 / 102 in emergency.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="text-red-600 font-semibold hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '108 आपातकालीन सेवा' : 'Emergency 108'}</span>
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>DPDPA 2023 Compliant</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>WHO & UIP Standards</span>
          </div>
        </div>
      </footer>
      <MobileBottomNav onOpenMoreMenu={() => setIsMobileAppModalOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
