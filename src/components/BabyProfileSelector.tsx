import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BabyProfile } from '../types';
import { calculateCorrectedAge } from '../data/whoGrowthData';
import {
  Baby,
  Plus,
  Check,
  AlertCircle,
  Trash2,
  Calendar,
  Scale,
  Ruler,
  Activity,
  Heart,
  ShieldCheck,
  Stethoscope,
  X,
  Edit3,
  Info,
  Droplets,
  Users,
} from 'lucide-react';

interface BabyProfileSelectorProps {
  className?: string;
  onChildSelected?: (babyId: string) => void;
  isAddModalOpen?: boolean;
  onAddModalClose?: () => void;
}

export const BabyProfileSelector: React.FC<BabyProfileSelectorProps> = ({
  className = '',
  onChildSelected,
  isAddModalOpen,
  onAddModalClose,
}) => {
  const {
    language,
    babies,
    activeBabyId,
    setActiveBabyId,
    addBabyProfile,
    updateBabyProfile,
    deleteBabyProfile,
    userProfile,
    nutritionProfile,
  } = useApp();

  const isHi = language === 'hi';

  // Add Child Modal State
  const [internalShowAddModal, setInternalShowAddModal] = useState(false);
  const showAddModal = isAddModalOpen !== undefined ? isAddModalOpen : internalShowAddModal;
  const setShowAddModal = (val: boolean) => {
    setInternalShowAddModal(val);
    if (!val && onAddModalClose) {
      onAddModalClose();
    }
  };

  // Edit Child Modal State
  const [editingBaby, setEditingBaby] = useState<BabyProfile | null>(null);

  // New Baby Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [birthTime, setBirthTime] = useState('09:30 AM');
  const [birthWeightKg, setBirthWeightKg] = useState(3.2);
  const [birthLengthCm, setBirthLengthCm] = useState(50.0);
  const [birthHeadCircumferenceCm, setBirthHeadCircumferenceCm] = useState(34.0);
  const [isPremature, setIsPremature] = useState(false);
  const [gestationalAgeWeeksAtBirth, setGestationalAgeWeeksAtBirth] = useState(39);
  const [bloodGroup, setBloodGroup] = useState('B Positive (B+)');
  const [birthHistory, setBirthHistory] = useState('Full-term spontaneous vaginal delivery, APGAR 9/10');
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');
  const [currentMedications, setCurrentMedications] = useState<string[]>(['Vitamin D3 drops 400 IU daily']);
  const [customMed, setCustomMed] = useState('');
  const [feedingMethod, setFeedingMethod] = useState<
    'exclusive_breastfeeding' | 'formula' | 'mixed_breast_and_formula' | 'solids_and_milk'
  >('exclusive_breastfeeding');
  const [pediatricianName, setPediatricianName] = useState(
    userProfile.doctorName || 'Dr. Suresh Rao (MD Pediatrics)'
  );
  const [pediatricianPhone, setPediatricianPhone] = useState(
    userProfile.doctorPhone || '+91 98222 33445'
  );

  // Quick preset pills for conditions & allergies
  const COMMON_CONDITIONS = [
    'None / Known Healthy',
    'Prematurity follow-up',
    'Resolved Neonatal Jaundice',
    'Reflux (GERD)',
    'Eczema / Sensitive Skin',
    'Bronchial Hyperreactivity',
  ];

  const COMMON_ALLERGIES = [
    'No Known Allergies (NKDA)',
    'Cow Milk Protein (CMPA)',
    'Egg Albumin',
    'Peanuts / Tree Nuts',
    'Wheat / Gluten',
    'Soy',
  ];

  const resetAddForm = () => {
    setName('');
    setGender('boy');
    setBirthDate(new Date().toISOString().split('T')[0]);
    setBirthTime('09:30 AM');
    setBirthWeightKg(3.2);
    setBirthLengthCm(50.0);
    setBirthHeadCircumferenceCm(34.0);
    setIsPremature(false);
    setGestationalAgeWeeksAtBirth(39);
    setBloodGroup('B Positive (B+)');
    setBirthHistory('Full-term spontaneous vaginal delivery, APGAR 9/10');
    setMedicalConditions([]);
    setCustomCondition('');
    setAllergies([]);
    setCustomAllergy('');
    setCurrentMedications(['Vitamin D3 drops 400 IU daily']);
    setCustomMed('');
    setFeedingMethod('exclusive_breastfeeding');
    setShowAddModal(false);
  };

  const handleSelectBaby = (id: string) => {
    setActiveBabyId(id);
    if (onChildSelected) {
      onChildSelected(id);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGestWeeks = isPremature ? Math.min(36, Math.max(24, Number(gestationalAgeWeeksAtBirth))) : 39;
    const newId = addBabyProfile({
      name: name.trim(),
      gender,
      birthDate,
      birthTime,
      birthWeightKg: Number(birthWeightKg),
      birthLengthCm: Number(birthLengthCm),
      birthHeadCircumferenceCm: Number(birthHeadCircumferenceCm),
      gestationalAgeWeeksAtBirth: newGestWeeks,
      isPremature,
      bloodGroup,
      birthHistory: birthHistory || (isPremature ? `Preterm delivery at ${newGestWeeks} weeks` : 'Full-term birth'),
      medicalConditions: medicalConditions.filter(c => c !== 'None / Known Healthy'),
      allergies: allergies.filter(a => a !== 'No Known Allergies (NKDA)'),
      currentMedications,
      feedingMethod,
      pediatricianName: pediatricianName || 'Dr. Suresh Rao (MD Pediatrics)',
      pediatricianPhone: pediatricianPhone || '+91 98222 33445',
      householdCircumstances: {
        dietaryPattern: nutritionProfile.dietaryPreference,
        drinkingWaterSource: 'Reverse Osmosis filtration',
        indoorSmokeExposure: false,
        smokingInHousehold: false,
      },
    });

    handleSelectBaby(newId);
    resetAddForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBaby) return;

    updateBabyProfile(editingBaby.id, {
      name: editingBaby.name,
      gender: editingBaby.gender,
      birthDate: editingBaby.birthDate,
      birthTime: editingBaby.birthTime,
      birthWeightKg: Number(editingBaby.birthWeightKg),
      birthLengthCm: Number(editingBaby.birthLengthCm),
      birthHeadCircumferenceCm: Number(editingBaby.birthHeadCircumferenceCm),
      gestationalAgeWeeksAtBirth: Number(editingBaby.gestationalAgeWeeksAtBirth),
      isPremature: (editingBaby.gestationalAgeWeeksAtBirth || 40) < 37,
      bloodGroup: editingBaby.bloodGroup,
      birthHistory: editingBaby.birthHistory,
      medicalConditions: editingBaby.medicalConditions,
      allergies: editingBaby.allergies,
      currentMedications: editingBaby.currentMedications,
      feedingMethod: editingBaby.feedingMethod,
      pediatricianName: editingBaby.pediatricianName,
      pediatricianPhone: editingBaby.pediatricianPhone,
    });

    setEditingBaby(null);
  };

  const toggleCondition = (cond: string) => {
    if (cond === 'None / Known Healthy') {
      setMedicalConditions(['None / Known Healthy']);
      return;
    }
    const filtered = medicalConditions.filter(c => c !== 'None / Known Healthy');
    if (filtered.includes(cond)) {
      setMedicalConditions(filtered.filter(c => c !== cond));
    } else {
      setMedicalConditions([...filtered, cond]);
    }
  };

  const toggleAllergy = (al: string) => {
    if (al === 'No Known Allergies (NKDA)') {
      setAllergies(['No Known Allergies (NKDA)']);
      return;
    }
    const filtered = allergies.filter(a => a !== 'No Known Allergies (NKDA)');
    if (filtered.includes(al)) {
      setAllergies(filtered.filter(a => a !== al));
    } else {
      setAllergies([...filtered, al]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header bar: Title & Add Button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Baby className="w-4 h-4 text-purple-700" />
          <h3 className="font-extrabold text-sm text-slate-900">
            {isHi ? 'शिशु प्रोफाइल चयनकर्ता' : 'Child Profiles (BabyProfileSelector)'}
          </h3>
          <span className="text-xs text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full font-bold border border-purple-100">
            {babies.length} {babies.length === 1 ? 'Child' : 'Children'}
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHi ? '+ नया बच्चा जोड़ें' : '+ Add Child'}</span>
        </button>
      </div>

      {/* Child Switcher Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {babies.map(baby => {
          const isActive = baby.id === activeBabyId;
          const gestWeeks = baby.gestationalAgeWeeksAtBirth || (baby.isPremature ? 34 : 39);
          const ageInfo = calculateCorrectedAge(baby.birthDate, gestWeeks);

          return (
            <div
              key={baby.id}
              onClick={() => handleSelectBaby(baby.id)}
              className={`p-4 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between gap-3 relative ${
                isActive
                  ? 'border-purple-600 bg-purple-50/80 shadow-md ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              {/* Active Indicator Chip */}
              {isActive && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-purple-700 text-white text-[10px] font-extrabold shadow-xs flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{isHi ? 'सक्रिय' : 'Active Profile'}</span>
                </div>
              )}

              <div>
                {/* Top Row: Avatar, Name, Gender & Action Buttons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                        baby.gender === 'boy'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-pink-100 text-pink-700 border border-pink-200'
                      }`}
                    >
                      {baby.gender === 'boy' ? '👦' : '👧'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {baby.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>DOB: {baby.birthDate}</span>
                      </p>
                    </div>
                  </div>

                  {/* Edit & Delete Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingBaby(baby);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-100/60 transition-colors"
                      title="Edit Health History"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {babies.length > 1 && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          if (window.confirm(`Remove profile for ${baby.name}?`)) {
                            deleteBabyProfile(baby.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Age & Prematurity Badges */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Age: {ageInfo.chronologicalDisplay}
                  </span>

                  {baby.isPremature && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-200 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Preterm {baby.gestationalAgeWeeksAtBirth}w</span>
                      <span>·</span>
                      <span>Corr: {ageInfo.correctedDisplay}</span>
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                    {baby.bloodGroup || 'Blood Group Logged'}
                  </span>
                </div>

                {/* Health History Summary Chips */}
                <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Scale className="w-3 h-3 text-purple-500" />
                    <span>Birth: {baby.birthWeightKg} kg · {baby.birthLengthCm} cm · Head: {baby.birthHeadCircumferenceCm || 34} cm</span>
                  </p>

                  {/* Conditions chip */}
                  {baby.medicalConditions && baby.medicalConditions.length > 0 && (
                    <p className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 truncate">
                      <strong>Health History:</strong> {baby.medicalConditions.join(', ')}
                    </p>
                  )}

                  {/* Allergies chip */}
                  {baby.allergies && baby.allergies.length > 0 && (
                    <p className="text-[10px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 truncate">
                      <strong>Allergies:</strong> {baby.allergies.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom selection feedback */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-slate-400 capitalize">
                  {baby.feedingMethod?.replace(/_/g, ' ') || 'Exclusive Breastfeeding'}
                </span>
                <span
                  className={`text-[10px] font-extrabold flex items-center gap-1 ${
                    isActive ? 'text-purple-700' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>{isActive ? (isHi ? 'चयनित' : 'Viewing Record') : (isHi ? 'स्विच करें' : 'Switch Child')}</span>
                  <Check className={`w-3 h-3 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD CHILD PROFILE MODAL (Name, DOB, Sex, Health History)               */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-purple-100 space-y-4 my-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {isHi ? 'नया शिशु प्रोफाइल जोड़ें' : 'Add Child Profile'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Birth date, sex, growth baselines, and pediatric health history.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* SECTION A: Essential Child Details */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Baby className="w-3.5 h-3.5 text-purple-600" />
                  <span>A. Basic Identity & Sex</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Child’s Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Aarav, Anvi, Meera..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Sex / Biological Gender *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('boy')}
                        className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                          gender === 'boy'
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>👦</span>
                        <span>Boy (बालक)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('girl')}
                        className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                          gender === 'girl'
                            ? 'bg-pink-50 border-pink-600 text-pink-900 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>👧</span>
                        <span>Girl (बालिका)</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Birth Time (Optional)
                    </label>
                    <input
                      type="text"
                      value={birthTime}
                      onChange={e => setBirthTime(e.target.value)}
                      placeholder="e.g. 09:30 AM"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Birth Metrics & Prematurity Check */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-600" />
                  <span>B. Anthropometric Birth Metrics</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Birth Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={birthWeightKg}
                      onChange={e => setBirthWeightKg(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Length (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={birthLengthCm}
                      onChange={e => setBirthLengthCm(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Head Circ. (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={birthHeadCircumferenceCm}
                      onChange={e => setBirthHeadCircumferenceCm(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>

                {/* Prematurity Check */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-extrabold text-xs text-amber-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPremature}
                        onChange={e => {
                          setIsPremature(e.target.checked);
                          if (e.target.checked && gestationalAgeWeeksAtBirth >= 37) {
                            setGestationalAgeWeeksAtBirth(34);
                          }
                        }}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>Was this baby born preterm (&lt; 37 gestational weeks)?</span>
                    </label>
                    {isPremature && (
                      <span className="text-[10px] font-bold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
                        Preterm Active
                      </span>
                    )}
                  </div>

                  {isPremature && (
                    <div className="pl-6 space-y-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-900 font-semibold">
                          Gestational Age at Birth:
                        </span>
                        <input
                          type="number"
                          min={24}
                          max={36}
                          value={gestationalAgeWeeksAtBirth}
                          onChange={e => setGestationalAgeWeeksAtBirth(Number(e.target.value))}
                          className="w-18 px-2 py-1 text-xs bg-white border border-amber-300 rounded-lg font-bold"
                        />
                        <span className="text-xs text-amber-800">weeks</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        * In accordance with WHO & AAP pediatric guidelines, Mumora will plot this child's development on <strong>Corrected Age curves</strong> until 2 years of age to prevent false undergrowth classification.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION C: Health History, Conditions & Allergies */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                  <span>C. Pediatric Health History & Conditions</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Child’s Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      {[
                        'B Positive (B+)',
                        'B Negative (B-)',
                        'O Positive (O+)',
                        'O Negative (O-)',
                        'A Positive (A+)',
                        'A Negative (A-)',
                        'AB Positive (AB+)',
                        'AB Negative (AB-)',
                        'Cord blood test pending',
                      ].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Feeding Method
                    </label>
                    <select
                      value={feedingMethod}
                      onChange={e => setFeedingMethod(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="exclusive_breastfeeding">Exclusive Breastfeeding (केवल स्तनपान)</option>
                      <option value="formula">Infant Formula (फॉर्मूला मिल्क)</option>
                      <option value="mixed_breast_and_formula">Mixed Breast & Formula (दोनों)</option>
                      <option value="solids_and_milk">Solids & Milk (ठोस आहार व दूध)</option>
                    </select>
                  </div>
                </div>

                {/* Medical Conditions Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Pre-existing or Documented Medical Conditions
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_CONDITIONS.map(cond => {
                      const isSelected = medicalConditions.includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleCondition(cond)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                            isSelected
                              ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {cond}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom condition write-in */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={customCondition}
                      onChange={e => setCustomCondition(e.target.value)}
                      placeholder="Add other medical condition..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customCondition.trim()) {
                          setMedicalConditions([
                            ...medicalConditions.filter(c => c !== 'None / Known Healthy'),
                            customCondition.trim(),
                          ]);
                          setCustomCondition('');
                        }
                      }}
                      className="px-3 py-1.5 bg-purple-700 text-white rounded-xl font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Known Allergies Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Known Allergies & Sensitivities
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_ALLERGIES.map(al => {
                      const isSelected = allergies.includes(al);
                      return (
                        <button
                          key={al}
                          type="button"
                          onClick={() => toggleAllergy(al)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                            isSelected
                              ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {al}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom allergy write-in */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={customAllergy}
                      onChange={e => setCustomAllergy(e.target.value)}
                      placeholder="Add other allergy (e.g. penicillin, dust mites)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAllergy.trim()) {
                          setAllergies([
                            ...allergies.filter(a => a !== 'No Known Allergies (NKDA)'),
                            customAllergy.trim(),
                          ]);
                          setCustomAllergy('');
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-xl font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Current Medications & Supplements */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Current Medications or Supplements
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {currentMedications.map((med, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1"
                      >
                        <span>{med}</span>
                        <button
                          type="button"
                          onClick={() => setCurrentMedications(currentMedications.filter((_, i) => i !== idx))}
                          className="hover:text-rose-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customMed}
                      onChange={e => setCustomMed(e.target.value)}
                      placeholder="e.g. Iron drops (Ferrous sulfate 2 mg/kg), Probiotics..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customMed.trim()) {
                          setCurrentMedications([...currentMedications, customMed.trim()]);
                          setCustomMed('');
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Birth Delivery History & Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Birth & Perinatal History Notes
                  </label>
                  <textarea
                    rows={2}
                    value={birthHistory}
                    onChange={e => setBirthHistory(e.target.value)}
                    placeholder="e.g. Full-term normal delivery, APGAR 9/10, no NICU admission, hearing screen passed..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetAddForm}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-extrabold text-xs shadow-md shadow-purple-700/20"
                >
                  Save Child Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT CHILD PROFILE MODAL                                               */}
      {/* ========================================================================= */}
      {editingBaby && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-purple-100 space-y-4 my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Edit Health Profile: {editingBaby.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Update birth metrics, documented conditions, and allergies.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingBaby(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Child’s Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBaby.name}
                    onChange={e => setEditingBaby({ ...editingBaby, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Birth Date (DOB)
                  </label>
                  <input
                    type="date"
                    required
                    value={editingBaby.birthDate}
                    onChange={e => setEditingBaby({ ...editingBaby, birthDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Birth Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingBaby.birthWeightKg}
                    onChange={e =>
                      setEditingBaby({ ...editingBaby, birthWeightKg: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingBaby.birthLengthCm}
                    onChange={e =>
                      setEditingBaby({ ...editingBaby, birthLengthCm: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Head Circ. (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingBaby.birthHeadCircumferenceCm || 34}
                    onChange={e =>
                      setEditingBaby({
                        ...editingBaby,
                        birthHeadCircumferenceCm: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Gestational Weeks at Birth
                  </label>
                  <input
                    type="number"
                    min={24}
                    max={43}
                    value={editingBaby.gestationalAgeWeeksAtBirth || 39}
                    onChange={e =>
                      setEditingBaby({
                        ...editingBaby,
                        gestationalAgeWeeksAtBirth: Number(e.target.value),
                        isPremature: Number(e.target.value) < 37,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={editingBaby.bloodGroup}
                    onChange={e => setEditingBaby({ ...editingBaby, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Documented Medical Conditions (comma separated)
                </label>
                <input
                  type="text"
                  value={editingBaby.medicalConditions?.join(', ') || ''}
                  onChange={e =>
                    setEditingBaby({
                      ...editingBaby,
                      medicalConditions: e.target.value
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Known Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={editingBaby.allergies?.join(', ') || ''}
                  onChange={e =>
                    setEditingBaby({
                      ...editingBaby,
                      allergies: e.target.value
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Birth History & Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={editingBaby.birthHistory || ''}
                  onChange={e => setEditingBaby({ ...editingBaby, birthHistory: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBaby(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-extrabold text-xs shadow-md shadow-purple-700/20"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
