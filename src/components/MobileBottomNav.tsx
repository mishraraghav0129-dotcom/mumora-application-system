import React from 'react';
import { useApp } from '../context/AppContext';
import { AppMode } from '../types';
import { calculateReminderStatus } from '../data/vaccinationReminders';
import { triggerHaptic } from '../utils/mobileNative';
import {
  Heart,
  Baby,
  Bell,
  Utensils,
  Bot,
  Grid,
} from 'lucide-react';

import { TRANSLATIONS } from '../data/translations';

interface MobileBottomNavProps {
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMoreMenu }) => {
  const { appMode, setAppMode, healthReminders, language } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const dueSoonCount = healthReminders.filter(
    r =>
      !r.isCompleted &&
      (calculateReminderStatus(r.dueDate).isDueIn3Days ||
        calculateReminderStatus(r.dueDate).isDueToday ||
        calculateReminderStatus(r.dueDate).isOverdue)
  ).length;

  const handleTabClick = (mode: AppMode) => {
    triggerHaptic('light');
    setAppMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navTabs: { id: AppMode; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'pregnancy',
      label: t.nav.pregnancy,
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: 'baby',
      label: t.nav.baby,
      icon: <Baby className="w-5 h-5" />,
    },
    {
      id: 'reminders',
      label: t.nav.reminders,
      icon: <Bell className="w-5 h-5" />,
      badge: dueSoonCount > 0 ? dueSoonCount : undefined,
    },
    {
      id: 'nutrition',
      label: t.nav.nutrition,
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      id: 'assistant',
      label: t.nav.aiAssistant,
      icon: <Bot className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_20px_rgba(126,34,206,0.08)] pb-[calc(env(safe-area-inset-bottom,0px)+6px)] pt-2"
    >
      <div className="grid grid-cols-6 items-center px-2 max-w-md mx-auto">
        {navTabs.map(tab => {
          const isActive = appMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-purple-700 font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all relative ${
                  isActive ? 'bg-purple-100/80 shadow-2xs' : 'hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 truncate max-w-[54px] text-center leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Actions Menu Button */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenMoreMenu();
          }}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-2xl text-slate-500 hover:text-slate-800 font-medium transition-all"
        >
          <div className="p-1.5 rounded-xl hover:bg-slate-100 transition-all">
            <Grid className="w-5 h-5 text-slate-600" />
          </div>
          <span className="text-[10px] mt-0.5 truncate text-center leading-tight">
            {language === 'te' ? 'మరిన్ని' : language === 'hi' ? 'अधिक' : language === 'ta' ? 'மேலும்' : language === 'bn' ? 'আরও' : language === 'mr' ? 'अधिक' : language === 'es' ? 'Más' : 'More'}
          </span>
        </button>
      </div>
    </nav>
  );
};
