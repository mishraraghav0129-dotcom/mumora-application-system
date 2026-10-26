import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { Heart, X, Sparkles, ShieldCheck, Baby, Calendar, User, Phone, MapPin } from 'lucide-react';

interface MumoraWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MumoraWelcomeModal: React.FC<MumoraWelcomeModalProps> = ({ isOpen, onClose }) => {
  const { language, userProfile, pregnancy, activeBaby, setAppMode } = useApp();
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-purple-100 flex flex-col overflow-hidden">
        {/* Brand Hero Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-[#FAF6EE] border-b border-purple-100/70 text-center flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full hover:bg-white/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Official Mumora Logo - sharp, proportional, 1:1 ratio */}
          <div className="relative mb-3">
            <div className="w-24 h-24 sm:w-28 sm:w-28 rounded-3xl bg-white p-2 shadow-md shadow-purple-200/50 border border-purple-100/80 flex items-center justify-center">
              <img
                src="/mumora-logo.png"
                alt="Mumora Official Logo"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-purple-600 to-pink-500 text-white rounded-full p-1.5 shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mumora
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-purple-700 mt-1 flex items-center justify-center gap-1.5">
            <span>Healthy Moms</span>
            <span className="text-pink-500">♥</span>
            <span>Brighter Tomorrows</span>
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Your clinical, trustworthy companion through pregnancy, fourth-trimester healing, and joyful pediatric growth.
          </p>
        </div>

        {/* Content & Quick Stats */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Active Mother Profile Card */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-purple-100/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-800">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                Mother & Family Profile
              </span>
              <span className="text-[11px] font-normal text-slate-500">ID: {userProfile.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Mother's Name</span>
                <span className="font-semibold text-slate-800">{userProfile.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Blood Group</span>
                <span className="font-semibold text-slate-800">{userProfile.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {userProfile.city}, {userProfile.state}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Emergency Contact</span>
                <span className="font-semibold text-slate-800">{userProfile.emergencyContactPhone}</span>
              </div>
            </div>
          </div>

          {/* Quick Active Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Pregnancy Status
              </span>
              <span className="text-lg font-bold text-slate-900 block mt-0.5">
                Week {pregnancy.currentWeek}, Day {pregnancy.currentDay}
              </span>
              <span className="text-[11px] text-slate-500 block">
                EDD: {pregnancy.estimatedDueDate}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
              <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">
                Baby Care Profile
              </span>
              <span className="text-lg font-bold text-slate-900 block mt-0.5">
                {activeBaby.name}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Born {activeBaby.birthDate} ({activeBaby.gender})
              </span>
            </div>
          </div>

          {/* Core Values / Trust Badges */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-around text-center text-xs text-slate-600">
            <div className="space-y-0.5">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600" />
              <span className="block text-[11px] font-medium text-slate-800">WHO Standards</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="space-y-0.5">
              <Sparkles className="w-4 h-4 mx-auto text-purple-600" />
              <span className="block text-[11px] font-medium text-slate-800">Mumora AI</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="space-y-0.5">
              <Heart className="w-4 h-4 mx-auto text-pink-500 fill-pink-500" />
              <span className="block text-[11px] font-medium text-slate-800">45+ Languages</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4 sm:p-5 border-t border-purple-100/70 bg-gradient-to-r from-purple-50/40 via-pink-50/30 to-amber-50/20 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-200 transition-all"
          >
            Explore Mumora
          </button>
        </div>
      </div>
    </div>
  );
};
