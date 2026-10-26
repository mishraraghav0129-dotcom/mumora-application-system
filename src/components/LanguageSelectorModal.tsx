import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { WORLD_LANGUAGES } from '../data/translations';
import { LanguageOrigin } from '../types';
import { Globe, Search, Check, X, Sparkles } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORIGINS: (LanguageOrigin | 'All')[] = [
  'All',
  'Americas & Europe',
  'South Asia',
  'East & Southeast Asia',
  'Middle East & North Africa',
  'Sub-Saharan Africa',
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<LanguageOrigin | 'All'>('All');

  const filteredLanguages = useMemo(() => {
    return WORLD_LANGUAGES.filter(lang => {
      const matchesOrigin = selectedOrigin === 'All' || lang.origin === selectedOrigin;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query);
      return matchesOrigin && matchesSearch;
    });
  }, [searchQuery, selectedOrigin]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-purple-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-purple-100/70 bg-gradient-to-r from-purple-50/60 via-pink-50/40 to-amber-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-purple-200">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Select Your Language</span>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                  All Origins Worldwide
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Mumora AI answers & clinically guides in all global maternal languages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Origin Filters */}
        <div className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search language or script (e.g., Español, हिन्दी, Kiswahili, العربية, Français)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-slate-900 placeholder:text-slate-400 shadow-xs"
              autoFocus
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {ORIGINS.map(orig => {
              const isActive = selectedOrigin === orig;
              return (
                <button
                  key={orig}
                  onClick={() => setSelectedOrigin(orig)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  {orig === 'All' ? '🌍 All Supported Languages' : orig}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filteredLanguages.map(item => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  onClose();
                }}
                className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/70 shadow-xs ring-1 ring-purple-400'
                    : 'border-slate-200/80 bg-white hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <span
                      className={`text-sm font-bold truncate ${
                        isSelected ? 'text-purple-900' : 'text-slate-900'
                      }`}
                    >
                      {item.nativeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="truncate">{item.name}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {item.code}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-purple-300 shrink-0" />
                )}
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs sm:text-sm">
              No languages matching "{searchQuery}". You can still ask Mumora AI in any language!
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Mumora AI automatically adapts clinical responses to your language</span>
          </div>
          <button
            onClick={onClose}
            className="font-medium text-purple-700 hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
