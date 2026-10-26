import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS, WORLD_LANGUAGES } from '../data/translations';
import { Globe, ShieldAlert, Heart, User, ChevronDown, Download, Smartphone, LogOut, Shield, KeyRound } from 'lucide-react';
import { AppMode } from '../types';
import { calculateReminderStatus } from '../data/vaccinationReminders';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { MumoraWelcomeModal } from './MumoraWelcomeModal';
import { AdminLoginModal } from './admin/AdminLoginModal';

interface HeaderProps {
  onOpenMobileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileModal }) => {
  const {
    language,
    setLanguage,
    appMode,
    setAppMode,
    setShowEmergencyModal,
    currentUser,
    isAuthenticated,
    logout,
    adminUser,
    isAdminAuthenticated,
  } = useApp();
  const t = TRANSLATIONS[language];

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const currentLangObj = WORLD_LANGUAGES.find(l => l.code === language) || {
    code: language,
    name: 'English',
    nativeName: 'English',
    flag: '🌐',
  };

  const { healthReminders, setIsOnboardingOpen } = useApp();
  const isHi = language === 'hi';

  const dueSoonCount = healthReminders.filter(
    r =>
      !r.isCompleted &&
      (calculateReminderStatus(r.dueDate).isDueIn3Days ||
        calculateReminderStatus(r.dueDate).isDueToday ||
        calculateReminderStatus(r.dueDate).isOverdue)
  ).length;

  const navItems: { id: AppMode; label: string; badge?: number }[] = [
    { id: 'pregnancy', label: t.nav.pregnancy },
    { id: 'baby', label: t.nav.baby },
    {
      id: 'reminders',
      label: t.nav.reminders,
      badge: dueSoonCount > 0 ? dueSoonCount : undefined,
    },
    { id: 'nutrition', label: t.nav.nutrition },
    { id: 'environmental', label: t.nav.environmental },
    { id: 'family-health', label: t.nav.familyHealth },
    { id: 'assistant', label: t.nav.aiAssistant },
    { id: 'vault', label: t.nav.vault },
    { id: 'hospitals', label: t.nav.hospitals },
    { id: 'postpartum', label: t.nav.postpartum },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-8 h-16 sm:h-18">
            {/* Zone 1: Official Mumora Brand Wordmark + Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setAppMode('pregnancy')}
                className="text-left group flex items-center gap-3 focus:outline-none"
                title="Mumora Home — Healthy Moms ♥ Brighter Tomorrows"
              >
                {/* Official Mumora Logo Image */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white p-1 border border-purple-100/90 shadow-xs shadow-purple-100 group-hover:border-purple-300 transition-all flex items-center justify-center shrink-0">
                  <img
                    src="/mumora-logo.png"
                    alt="Mumora"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
                      Mumora
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                      <span>Healthy Moms</span>
                      <span className="text-pink-500">♥</span>
                      <span>Brighter Tomorrows</span>
                    </span>
                  </div>
                  <span className="sm:hidden text-[10px] font-medium text-purple-600">
                    Healthy Moms ♥ Brighter Tomorrows
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = appMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAppMode(item.id)}
                    className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-amber-300 text-purple-950'
                            : 'bg-rose-500 text-white animate-pulse'
                        }`}
                        title={`${item.badge} tasks due within 3 days`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Actions (Brand Welcome, World Language Selector, Emergency SOS) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Quick Onboarding / Health Profile button */}
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100/80 rounded-xl transition-all border border-purple-100"
                title={t.auth.welcomeTitle}
              >
                <span>{t.baby.profile || 'Profile'}</span>
              </button>

              {/* Global Language Selector Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsLangModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-purple-50 text-slate-800 hover:text-purple-900 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                title="Change Interface Language"
              >
                <Globe className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="hidden md:inline text-slate-500 font-semibold">{t.common?.language || 'Language'}:</span>
                <span className="font-extrabold flex items-center gap-1">
                  <span>{currentLangObj.flag}</span>
                  <span className="truncate max-w-[85px] sm:max-w-none">{currentLangObj.nativeName}</span>
                </span>
                <ChevronDown className="w-3 h-3 text-purple-500 shrink-0" />
              </button>

              {/* Mumora Profile & Welcome modal trigger */}
              <button
                onClick={() => setIsWelcomeModalOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-100 text-purple-700 flex items-center justify-center transition-colors shadow-xs"
                title="Mumora Brand & Mother Profile"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Download Project Source ZIP */}
              <a
                href="/api/download-zip"
                download="mumora-project.zip"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/90 text-purple-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                title="Download Mumora Project (.zip)"
              >
                <Download className="w-3.5 h-3.5 text-purple-700" />
                <span className="hidden sm:inline">ZIP</span>
              </a>

              {/* Mobile App Modal Button */}
              {onOpenMobileModal && (
                <button
                  onClick={onOpenMobileModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-extrabold transition-all shadow-2xs hover:shadow-xs"
                  title="Mumora Mobile App (Android & iOS)"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">📱 App</span>
                </button>
              )}

              {/* Admin Portal Gateway */}
              {appMode === 'admin' ? (
                <button
                  onClick={() => setAppMode('pregnancy')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs"
                  title="Return to Maternal & Baby Dashboard"
                >
                  <Heart className="w-3.5 h-3.5 text-pink-300" />
                  <span className="hidden sm:inline">Exit Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (isAdminAuthenticated) {
                      setAppMode('admin');
                    } else {
                      setIsAdminModalOpen(true);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isAdminAuthenticated
                      ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                      : 'bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200'
                  }`}
                  title="Open Mumora Admin & Clinical Control Center"
                >
                  <Shield className={`w-3.5 h-3.5 ${isAdminAuthenticated ? 'text-red-600' : 'text-purple-600'}`} />
                  <span className="hidden lg:inline">Admin</span>
                </button>
              )}

              {/* Authenticated User Profile & Logout */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 bg-purple-50/70 border border-purple-100 rounded-xl p-1 pl-2">
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-bold text-slate-800 max-w-[80px] sm:max-w-[110px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] text-purple-600 font-semibold uppercase tracking-wider leading-none">
                      {currentUser.pregnancyStatus === 'pregnant' ? 'Mom' : 'Parent'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition-colors"
                    title={t.auth.logout}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              {/* Emergency SOS Button */}
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs shadow-red-200 transition-transform active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
                <span className="hidden sm:inline">
                  {t.emergency.quickDial}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile and Tablet secondary navigation scroller */}
          <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-purple-50 no-scrollbar">
            {navItems.map(item => {
              const isActive = appMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAppMode(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900 bg-white border border-purple-100/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-amber-300 text-purple-950'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
      <MumoraWelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
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
};
