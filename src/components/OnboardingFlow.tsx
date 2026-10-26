import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DietaryPreferenceType,
  BabyProfile,
} from '../types';
import {
  Sparkles,
  Heart,
  Users,
  ShieldCheck,
  Utensils,
  MapPin,
  Calendar,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  Check,
  Baby,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Activity,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { LocationChangeModal } from './LocationChangeModal';

type ParenthoodStatusOption =
  | 'first_time_pregnant'
  | 'mother_not_pregnant'
  | 'mother_and_pregnant'
  | 'planning_pregnancy'
  | 'other';

export const OnboardingFlow: React.FC = () => {
  const {
    language,
    isOnboardingOpen,
    setIsOnboardingOpen,
    userProfile,
    updateUserProfile,
    pregnancy,
    updatePregnancyLmp,
    nutritionProfile,
    updateNutritionProfile,
    maternalHistory,
    updateMaternalHistory,
    paternalHistory,
    updatePaternalHistory,
    familyPedigree,
    updateFamilyPedigree,
    consent,
    updateConsent,
    foodCity,
    setFoodCity,
    regenerateMealPlan,
    recomputeBabyRiskAssessment,
    babies,
    addBabyProfile,
    deleteBabyProfile,
    setBabyGrowthMode,
    setFamilySituation,
  } = useApp();

  const isHi = language === 'hi';
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const totalSteps = 5;

  // Question 1: Parenthood situation state
  const [parenthoodStatus, setParenthoodStatus] = useState<ParenthoodStatusOption>(() => {
    return 'mother_and_pregnant';
  });

  // Step 2 sub-state: Has children follow-ups
  const [hasExistingChildren, setHasExistingChildren] = useState<'yes' | 'no'>('yes');
  const [numChildren, setNumChildren] = useState<number>(1);
  const [childAddChoice, setChildAddChoice] = useState<'add_now' | 'add_later' | 'prefer_not_to_say'>('add_now');

  // Multi-baby builder form state
  const [childFormSubStep, setChildFormSubStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showChildForm, setShowChildForm] = useState(false);
  const [tempChild, setTempChild] = useState<Omit<BabyProfile, 'id'>>({
    name: '',
    gender: 'boy',
    birthDate: '2026-07-15',
    birthTime: '09:00 AM',
    birthWeightKg: 3.2,
    birthLengthCm: 50.0,
    birthHeadCircumferenceCm: 34.0,
    gestationalAgeWeeksAtBirth: 39,
    isPremature: false,
    bloodGroup: 'B Positive (B+)',
    medicalConditions: [],
    allergies: [],
    currentMedications: ['Vitamin D3 drops 400 IU daily'],
    feedingMethod: 'exclusive_breastfeeding',
    pediatricianName: userProfile.doctorName || 'Dr. Suresh Rao (MD Pediatrics)',
    pediatricianPhone: userProfile.doctorPhone || '+91 98222 33445',
    householdCircumstances: {
      dietaryPattern: 'vegetarian',
      drinkingWaterSource: 'Reverse Osmosis filtration',
      indoorSmokeExposure: false,
      smokingInHousehold: false,
    },
  });

  const [conditionInput, setConditionInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  if (!isOnboardingOpen) return null;

  const handleSaveChildProfile = () => {
    if (!tempChild.name.trim()) return;
    const finalChild: Omit<BabyProfile, 'id'> = {
      ...tempChild,
      isPremature: (tempChild.gestationalAgeWeeksAtBirth || 40) < 37,
      birthHistory: (tempChild.gestationalAgeWeeksAtBirth || 40) < 37
        ? `Preterm delivery at ${tempChild.gestationalAgeWeeksAtBirth} weeks`
        : 'Full-term delivery',
    };
    addBabyProfile(finalChild);
    // Reset child form
    setTempChild({
      name: '',
      gender: 'girl',
      birthDate: new Date().toISOString().split('T')[0],
      birthTime: '10:00 AM',
      birthWeightKg: 3.1,
      birthLengthCm: 49.0,
      birthHeadCircumferenceCm: 34.0,
      gestationalAgeWeeksAtBirth: 40,
      isPremature: false,
      bloodGroup: 'B Positive (B+)',
      medicalConditions: [],
      allergies: [],
      currentMedications: ['Vitamin D3 drops 400 IU daily'],
      feedingMethod: 'exclusive_breastfeeding',
      pediatricianName: userProfile.doctorName || 'Dr. Suresh Rao (MD Pediatrics)',
      pediatricianPhone: userProfile.doctorPhone || '+91 98222 33445',
      householdCircumstances: {
        dietaryPattern: 'vegetarian',
        drinkingWaterSource: 'Reverse Osmosis filtration',
        indoorSmokeExposure: false,
        smokingInHousehold: false,
      },
    });
    setChildFormSubStep(1);
    setShowChildForm(false);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Sync familySituation
      if (parenthoodStatus === 'first_time_pregnant') {
        setFamilySituation('pregnant_only');
        setBabyGrowthMode('fetal_growth');
      } else if (parenthoodStatus === 'mother_not_pregnant') {
        setFamilySituation('has_children_only');
        setBabyGrowthMode('my_babies');
      } else if (parenthoodStatus === 'mother_and_pregnant') {
        setFamilySituation('pregnant_and_has_children');
        setBabyGrowthMode('my_babies');
      } else {
        setFamilySituation('planning_pregnancy');
        setBabyGrowthMode('fetal_growth');
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Completed!
      updateUserProfile({ onboardingCompleted: true });
      regenerateMealPlan();
      recomputeBabyRiskAssessment();
      setIsOnboardingOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-purple-100 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 p-5 sm:p-6 text-white shrink-0 relative">
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs text-purple-200 mb-1">
            <span className="font-bold">Mumora Personal Health Intelligence</span>
            <span>·</span>
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {currentStep === 1 && (isHi ? '1. पारिवारिक स्थिति व परिचय' : '1. Family & Parenthood Status')}
            {currentStep === 2 && (isHi ? '2. बच्चे व गर्भावस्था प्रोफाइल' : '2. Baby & Pregnancy Setup')}
            {currentStep === 3 && (isHi ? '3. खान-पान व पोषण प्राथमिकता' : '3. Dietary Preferences & Nutrition')}
            {currentStep === 4 && (isHi ? '4. माता-पिता का पारिवारिक चिकित्सा इतिहास' : '4. Parental & Family Medical History')}
            {currentStep === 5 && (isHi ? '5. सहमति, गोपनीयता व सारांश' : '5. Privacy Consents & Confirmation')}
          </h2>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5 mt-3">
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all ${
                  step === currentStep
                    ? 'w-8 bg-amber-300'
                    : step < currentStep
                    ? 'w-4 bg-emerald-400'
                    : 'w-3 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          {/* STEP 1: Family & Parenthood Status */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-xs text-purple-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>{isHi ? 'उद्देश्य:' : 'Why we ask this:'}</strong>{' '}
                  {isHi
                    ? 'Mumora आपकी विशिष्ट मातृत्व स्थिति के अनुरूप अनुकूलित होती है। आपकी स्थिति के अनुसार ही बच्चे या गर्भावस्था के टूल्स सक्रिय किए जाते हैं।'
                    : 'Mumora adapts strictly to your family reality. Only relevant tools (e.g. child growth curves, ultrasound logs, or kick counters) will be activated for you.'}
                </p>
              </div>

              {/* Question: “आपकी वर्तमान स्थिति क्या है?” */}
              <div>
                <label className="block text-sm font-extrabold text-slate-800 mb-2">
                  {isHi ? 'आपकी वर्तमान स्थिति क्या है?' : 'What is your current family and parenthood status?'}
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'first_time_pregnant',
                      hi: '1. मैं पहली बार माँ बनने वाली हूँ।',
                      en: '1. First-time expectant mother (Currently pregnant with first child)',
                      icon: '🤰',
                    },
                    {
                      id: 'mother_not_pregnant',
                      hi: '2. मैं पहले से माँ हूँ और अभी गर्भवती नहीं हूँ।',
                      en: '2. Already a mother, currently not pregnant',
                      icon: '👶',
                    },
                    {
                      id: 'mother_and_pregnant',
                      hi: '3. मैं पहले से माँ हूँ और अभी गर्भवती भी हूँ।',
                      en: '3. Already a mother, and currently pregnant with another baby',
                      icon: '👩‍👧‍👦',
                    },
                    {
                      id: 'planning_pregnancy',
                      hi: '4. मैं अभी गर्भवती नहीं हूँ और भविष्य में परिवार की योजना बना रही हूँ।',
                      en: '4. Currently not pregnant, planning a future family',
                      icon: '🌱',
                    },
                    {
                      id: 'other',
                      hi: '5. मैं अन्य स्थिति में हूँ / अभी यह साझा नहीं करना चाहती।',
                      en: '5. Other situation / Prefer not to specify at this time',
                      icon: '🔒',
                    },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setParenthoodStatus(opt.id as ParenthoodStatusOption)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        parenthoodStatus === opt.id
                          ? 'border-purple-600 bg-purple-50/80 text-purple-950 font-bold shadow-xs ring-1 ring-purple-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.icon}</span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold">{isHi ? opt.hi : opt.en}</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          parenthoodStatus === opt.id ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {parenthoodStatus === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mother's Basic Account Information */}
              <div className="pt-3 border-t border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm mb-3">
                  {isHi ? 'मां का बुनियादी विवरण' : 'Mother’s Basic Information'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHi ? 'मां का पूरा नाम *' : 'Mother’s Full Name *'}
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={e => updateUserProfile({ name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHi ? 'जन्म तिथि *' : 'Date of Birth *'}
                    </label>
                    <input
                      type="date"
                      value={userProfile.dateOfBirth}
                      onChange={e => updateUserProfile({ dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Location Selection with International Support */}
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-purple-700" />
                      <span>{isHi ? 'स्थान व पर्यावरणीय क्षेत्र (Location)' : 'Location & Environmental Region'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLocationModalOpen(true)}
                      className="px-3 py-1 bg-white border border-purple-200 hover:border-purple-400 text-purple-800 text-xs font-extrabold rounded-xl shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isHi ? 'स्थान बदलें / खोजें' : 'Change Location'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {isHi ? 'देश (Country)' : 'Country'}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={userProfile.country_name || userProfile.country || 'India'}
                        onClick={() => setIsLocationModalOpen(true)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {isHi ? 'राज्य / प्रांत (State)' : 'State / Province'}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={userProfile.state_region_name || userProfile.state || 'Karnataka'}
                        onClick={() => setIsLocationModalOpen(true)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {isHi ? 'शहर / जिला (City)' : 'City / District'}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={userProfile.district_name || userProfile.district || userProfile.city || 'Bengaluru'}
                        onClick={() => setIsLocationModalOpen(true)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Baby & Pregnancy Setup (Adaptive) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Branch 1: First-time pregnant */}
              {parenthoodStatus === 'first_time_pregnant' && (
                <div className="space-y-4">
                  <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-xs text-purple-900">
                    <p className="font-bold text-sm text-purple-950 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>{isHi ? 'आपकी पहली गर्भावस्था का स्वागत है!' : 'Welcome to your first pregnancy journey!'}</span>
                    </p>
                    <p className="leading-relaxed">
                      {isHi
                        ? 'जन्म से पूर्व किसी काल्पनिक नाम की आवश्यकता नहीं है। आपकी फ़ाइल में शिशु का नाम स्वतः "Baby of ' +
                          userProfile.name +
                          '" के रूप में दर्ज होगा।'
                        : 'No placeholder or baby name is forced prior to birth. Your fetal dashboard will be titled “Baby of ' +
                          userProfile.name +
                          '” with gestational age, ultrasound tracking, and kick counter recommendations.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHi ? 'अंतिम माहवारी (LMP) की तिथि' : 'Last Menstrual Period (LMP) Date'}
                    </label>
                    <input
                      type="date"
                      value={pregnancy.lastMenstrualPeriod}
                      onChange={e => updatePregnancyLmp(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-purple-950 text-sm">
                        {isHi ? `सप्ताह ${pregnancy.currentWeek} (दिन ${pregnancy.currentDay})` : `Gestational Week ${pregnancy.currentWeek} (Day ${pregnancy.currentDay})`}
                      </p>
                      <p className="text-xs text-purple-800 mt-0.5">
                        {isHi ? `अनुमानित प्रसव तिथि (EDD): ${pregnancy.estimatedDueDate}` : `Estimated Due Date (EDD): ${pregnancy.estimatedDueDate}`}
                      </p>
                      <p className="text-[11px] text-purple-600 mt-1">
                        {pregnancy.currentWeek >= 24
                          ? isHi ? '✓ 24 सप्ताह पूर्ण: दैनिक किक काउंटर सक्रिय' : '✓ 24+ weeks reached: Fetal kick counter active'
                          : isHi ? '• किक काउंटर 24वें सप्ताह से सक्रिय होगा' : '• Fetal kick counter will activate at week 24'}
                      </p>
                    </div>
                    <Baby className="w-8 h-8 text-purple-600 shrink-0" />
                  </div>
                </div>
              )}

              {/* Branch 2 & 3: Already has children */}
              {(parenthoodStatus === 'mother_not_pregnant' || parenthoodStatus === 'mother_and_pregnant') && (
                <div className="space-y-4">
                  {/* Children Questions */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                        {isHi ? 'क्या आपके पहले से बच्चे हैं?' : 'Do you already have children?'}
                      </label>
                      <div className="flex gap-2">
                        {['yes', 'no'].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setHasExistingChildren(c as 'yes' | 'no')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                              hasExistingChildren === c
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {c === 'yes' ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasExistingChildren === 'yes' && (
                      <>
                        <div>
                          <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                            {isHi ? 'आपके कितने बच्चे हैं?' : 'How many children do you have?'}
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4].map(n => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setNumChildren(n)}
                                className={`w-10 h-10 rounded-xl text-xs font-extrabold border transition-all ${
                                  numChildren === n
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {n === 4 ? '4+' : n}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                            {isHi
                              ? 'क्या आप अपने बच्चे या बच्चों की प्रोफाइल अभी Mumora में जोड़ना चाहती हैं?'
                              : 'Would you like to add your child or children’s profiles to Mumora now?'}
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                              { id: 'add_now', hi: 'हाँ, अभी जोड़ें', en: 'Yes, add now' },
                              { id: 'add_later', hi: 'बाद में जोड़ें', en: 'Add later' },
                              { id: 'prefer_not_to_say', hi: 'यह जानकारी साझा नहीं करनी', en: 'Prefer not to share' },
                            ].map(choice => (
                              <button
                                key={choice.id}
                                type="button"
                                onClick={() => setChildAddChoice(choice.id as any)}
                                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                                  childAddChoice === choice.id
                                    ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs ring-1 ring-purple-500'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {isHi ? choice.hi : choice.en}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Existing babies list */}
                  {hasExistingChildren === 'yes' && childAddChoice === 'add_now' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>{isHi ? `शिशु प्रोफाइल (${babies.length})` : `Child Profiles (${babies.length})`}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowChildForm(true)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isHi ? '+ बच्चा जोड़ें' : '+ Add Baby'}</span>
                        </button>
                      </div>

                      {/* Display existing added babies */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {babies.map(b => (
                          <div
                            key={b.id}
                            className="p-3 rounded-2xl border border-purple-100 bg-white hover:border-purple-300 shadow-2xs flex items-start justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <p className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                                <span>{b.gender === 'boy' ? '👦' : '👧'}</span>
                                <span>{b.name}</span>
                                {b.isPremature && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                                    Preterm ({b.gestationalAgeWeeksAtBirth}w)
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                DOB: {b.birthDate} · Birth Wt: {b.birthWeightKg} kg
                              </p>
                              <p className="text-[10px] text-purple-700 font-medium">
                                Blood: {b.bloodGroup || 'Recorded'}
                              </p>
                            </div>
                            {babies.length > 1 && (
                              <button
                                type="button"
                                onClick={() => deleteBabyProfile(b.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Remove child"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Modal/Inline 5-part child builder */}
                      {showChildForm && (
                        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3.5 mt-3">
                          <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                            <span className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                              <Baby className="w-4 h-4 text-purple-600" />
                              <span>{isHi ? 'नया बच्चा जोड़ें: 5-चरणीय विवरण' : 'Add Child: 5-Part Profile'}</span>
                            </span>
                            <div className="flex gap-1 text-[11px] font-bold text-purple-700">
                              <span>Part {childFormSubStep} of 5</span>
                            </div>
                          </div>

                          {/* Part 1: Basic details & prematurity */}
                          {childFormSubStep === 1 && (
                            <div className="space-y-2.5">
                              <p className="font-bold text-xs text-slate-800">1. बुनियादी विवरण (Basic Details)</p>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600">बच्चे का नाम *</label>
                                  <input
                                    type="text"
                                    value={tempChild.name}
                                    onChange={e => setTempChild({ ...tempChild, name: e.target.value })}
                                    placeholder="e.g. Aarav, Anvi..."
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600">लिंग (Gender)</label>
                                  <select
                                    value={tempChild.gender}
                                    onChange={e => setTempChild({ ...tempChild, gender: e.target.value as any })}
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                  >
                                    <option value="boy">बालक (Boy)</option>
                                    <option value="girl">बालिका (Girl)</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600">जन्म तिथि (DOB) *</label>
                                  <input
                                    type="date"
                                    value={tempChild.birthDate}
                                    onChange={e => setTempChild({ ...tempChild, birthDate: e.target.value })}
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600">जन्म वजन (kg) *</label>
                                  <input
                                    type="number"
                                    step="0.05"
                                    value={tempChild.birthWeightKg}
                                    onChange={e => setTempChild({ ...tempChild, birthWeightKg: Number(e.target.value) })}
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                  />
                                </div>
                              </div>

                              {/* Prematurity Check */}
                              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                                <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>क्या बच्चे का जन्म 37 सप्ताह से पहले (Preterm) हुआ था?</span>
                                </label>
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center gap-1 text-xs">
                                    <input
                                      type="radio"
                                      name="isPreterm"
                                      checked={Boolean(tempChild.isPremature)}
                                      onChange={() => setTempChild({ ...tempChild, isPremature: true, gestationalAgeWeeksAtBirth: 34 })}
                                    />
                                    <span>हाँ (Preterm &lt; 37w)</span>
                                  </label>
                                  <label className="flex items-center gap-1 text-xs">
                                    <input
                                      type="radio"
                                      name="isPreterm"
                                      checked={!tempChild.isPremature}
                                      onChange={() => setTempChild({ ...tempChild, isPremature: false, gestationalAgeWeeksAtBirth: 39 })}
                                    />
                                    <span>नहीं (Term ≥ 37w)</span>
                                  </label>
                                </div>
                                {tempChild.isPremature && (
                                  <div className="pt-1">
                                    <span className="text-[10px] text-amber-800 font-semibold">
                                      जन्म के समय गर्भकाल (Gestational Weeks):
                                    </span>
                                    <input
                                      type="number"
                                      min={24}
                                      max={36}
                                      value={tempChild.gestationalAgeWeeksAtBirth || 34}
                                      onChange={e =>
                                        setTempChild({
                                          ...tempChild,
                                          gestationalAgeWeeksAtBirth: Number(e.target.value),
                                        })
                                      }
                                      className="ml-2 w-16 px-2 py-0.5 text-xs bg-white border border-amber-300 rounded-md"
                                    />
                                    <p className="text-[10px] text-amber-700 mt-1">
                                      * डब्ल्यूएचओ और आईएपी के अनुसार समय से पूर्व जन्मे बच्चों के लिए 2 वर्ष तक संशोधित आयु (Corrected Age) का उपयोग किया जाएगा।
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Part 2: Current Health */}
                          {childFormSubStep === 2 && (
                            <div className="space-y-2.5">
                              <p className="font-bold text-xs text-slate-800">2. वर्तमान स्वास्थ्य व एलर्जी (Current Health & Allergies)</p>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600">ब्लड ग्रुप</label>
                                <input
                                  type="text"
                                  value={tempChild.bloodGroup}
                                  onChange={e => setTempChild({ ...tempChild, bloodGroup: e.target.value })}
                                  placeholder="e.g. B+, O+, A+..."
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600">ज्ञात एलर्जी (Allergies)</label>
                                <div className="flex gap-1.5 mt-1">
                                  <input
                                    type="text"
                                    value={allergyInput}
                                    onChange={e => setAllergyInput(e.target.value)}
                                    placeholder="e.g. Cow milk, peanuts, egg..."
                                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (allergyInput.trim()) {
                                        setTempChild({
                                          ...tempChild,
                                          allergies: [...(tempChild.allergies || []), allergyInput.trim()],
                                        });
                                        setAllergyInput('');
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold"
                                  >
                                    Add
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {tempChild.allergies?.map((al, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold">
                                      {al}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Part 3: Development & Feeding */}
                          {childFormSubStep === 3 && (
                            <div className="space-y-2.5">
                              <p className="font-bold text-xs text-slate-800">3. पोषण व दैनिक देखभाल (Nutrition & Daily Care)</p>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600">दूध पिलाने का तरीका (Feeding Method)</label>
                                <select
                                  value={tempChild.feedingMethod}
                                  onChange={e => setTempChild({ ...tempChild, feedingMethod: e.target.value as any })}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                >
                                  <option value="exclusive_breastfeeding">केवल स्तनपान (Exclusive Breastfeeding)</option>
                                  <option value="formula">फॉर्मूला मिल्क (Infant Formula)</option>
                                  <option value="mixed_breast_and_formula">स्तनपान व फॉर्मूला दोनों (Mixed Feeding)</option>
                                  <option value="solids_and_milk">ठोस आहार व दूध (Solids & Milk)</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Part 4: Household Environment */}
                          {childFormSubStep === 4 && (
                            <div className="space-y-2.5">
                              <p className="font-bold text-xs text-slate-800">4. घरेलू परिवेश (Household Environment)</p>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={!tempChild.householdCircumstances?.smokingInHousehold}
                                    onChange={e =>
                                      setTempChild({
                                        ...tempChild,
                                        householdCircumstances: {
                                          ...tempChild.householdCircumstances,
                                          smokingInHousehold: !e.target.checked,
                                          indoorSmokeExposure: !e.target.checked,
                                        },
                                      })
                                    }
                                  />
                                  <span>धूम्रपान मुक्त वातावरण (Smoke-free household)</span>
                                </label>
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600">पीने के पानी का स्रोत</label>
                                  <input
                                    type="text"
                                    value={tempChild.householdCircumstances?.drinkingWaterSource || 'Reverse Osmosis filtration'}
                                    onChange={e =>
                                      setTempChild({
                                        ...tempChild,
                                        householdCircumstances: {
                                          ...tempChild.householdCircumstances,
                                          drinkingWaterSource: e.target.value,
                                        },
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Part 5: Medical Reports */}
                          {childFormSubStep === 5 && (
                            <div className="space-y-2.5">
                              <p className="font-bold text-xs text-slate-800">5. चिकित्सा रिपोर्ट व समीक्षा (Review & Confirm Child)</p>
                              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                                <p><strong>नाम:</strong> {tempChild.name || 'Untitled'}</p>
                                <p><strong>लिंग:</strong> {tempChild.gender === 'boy' ? 'बालक' : 'बालिका'}</p>
                                <p><strong>जन्म तिथि:</strong> {tempChild.birthDate}</p>
                                <p><strong>जन्म वजन:</strong> {tempChild.birthWeightKg} kg</p>
                                <p><strong>गर्भकाल:</strong> {tempChild.gestationalAgeWeeksAtBirth} सप्ताह ({tempChild.isPremature ? 'Preterm' : 'Term'})</p>
                              </div>
                            </div>
                          )}

                          {/* Sub-step navigation */}
                          <div className="flex items-center justify-between pt-2">
                            {childFormSubStep > 1 ? (
                              <button
                                type="button"
                                onClick={() => setChildFormSubStep(prev => (prev > 1 ? (prev - 1) as 1 | 2 | 3 | 4 | 5 : 1))}
                                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                              >
                                Back
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setShowChildForm(false)}
                                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500"
                              >
                                Cancel
                              </button>
                            )}

                            {childFormSubStep < 5 ? (
                              <button
                                type="button"
                                onClick={() => setChildFormSubStep(prev => (prev < 5 ? (prev + 1) as 1 | 2 | 3 | 4 | 5 : 5))}
                                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold"
                              >
                                Next Part
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSaveChildProfile}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isHi ? 'शिशु प्रोफाइल सेव करें' : 'Save Child Profile'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If also currently pregnant, show current pregnancy setup */}
                  {parenthoodStatus === 'mother_and_pregnant' && (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                      <p className="font-extrabold text-xs text-indigo-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>{isHi ? 'वर्तमान गर्भावस्था ट्रैकर (Baby of ' + userProfile.name + ')' : 'Current Pregnancy Tracker (Baby of ' + userProfile.name + ')'}</span>
                      </p>
                      <p className="text-[11px] text-indigo-800 leading-relaxed">
                        {isHi
                          ? 'आपके पहले बच्चे का रिकॉर्ड अलग सुरक्षित रहेगा, और यह नया गर्भावस्था डैशबोर्ड अलग चलेगा।'
                          : 'Your existing child’s growth chart and medical records remain completely isolated from this ongoing pregnancy.'}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700">LMP Date</label>
                          <input
                            type="date"
                            value={pregnancy.lastMenstrualPeriod}
                            onChange={e => updatePregnancyLmp(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-indigo-200 rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col justify-end">
                          <p className="text-xs font-extrabold text-indigo-950">Week {pregnancy.currentWeek} (Trimester {pregnancy.trimester})</p>
                          <p className="text-[11px] text-indigo-700">EDD: {pregnancy.estimatedDueDate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Branch 4: Planning future family */}
              {parenthoodStatus === 'planning_pregnancy' && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <p className="font-extrabold text-sm flex items-center gap-1.5 text-emerald-900">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <span>{isHi ? 'गर्भाधान-पूर्व स्वास्थ्य व योजना' : 'Preconception Health & Guidance'}</span>
                  </p>
                  <p className="leading-relaxed">
                    {isHi
                      ? 'गर्भावस्था की योजना बनाते समय फॉलिक एसिड (400 mcg), रूबेला इम्युनिटी, और हीमोग्लोबिन स्तर की जांच प्राथमिक महत्व रखती है। Mumora आपको तैयारी में सहायता करेगी।'
                      : 'Mumora provides evidence-based preconception checklists, daily folic acid guidance, and hemoglobinopathy screening recommendations for prospective parents.'}
                  </p>
                </div>
              )}

              {/* Branch 5: Other */}
              {parenthoodStatus === 'other' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="font-bold text-sm text-slate-900">
                    {isHi ? 'सामान्य स्वास्थ्य व गोपनीयता' : 'General Health & Privacy Safeguards'}
                  </p>
                  <p className="leading-relaxed">
                    {isHi
                      ? 'आप कभी भी सेटिंग्स में जाकर अपनी पारिवारिक स्थिति को अपडेट कर सकती हैं।'
                      : 'You may update your parenthood situation anytime from Profile Settings. Full access to environmental intelligence, local nutrition, and family health is enabled.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Dietary Preferences */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-xs text-purple-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>“What type of food do you eat?”</strong>{' '}
                  {isHi
                    ? 'हम कभी भी आपके धर्म या स्थान से आहार प्राथमिकता का अनुमान नहीं लगाते। आपकी स्पष्ट पसंद के अनुसार ही संतुलित स्थानीय व्यंजन सुझाए जाते हैं।'
                    : 'We never infer diet from geography or background. Your explicitly chosen diet pattern powers culturally familiar meal plans aligned with ICMR-NIN & WHO.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2">
                  {isHi ? 'आप किस प्रकार का भोजन करती हैं?' : 'What type of food do you eat?'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'vegetarian', label: 'शाकाहारी (Vegetarian)', icon: '🥦', desc: 'Plant foods, grains, pulses, dairy' },
                    { id: 'eggetarian', label: 'एगेटेरियन (Eggetarian)', icon: '🥚', desc: 'Vegetarian plus well-cooked eggs' },
                    { id: 'non_vegetarian', label: 'मांसाहारी (Non-Vegetarian)', icon: '🍗', desc: 'Poultry, fish, well-cooked meats' },
                    { id: 'vegan', label: 'वीगन (Vegan)', icon: '🌱', desc: '100% plant-based, no dairy or honey' },
                    { id: 'other', label: 'अन्य / कस्टम आहार (Other / Custom)', icon: '🥗', desc: 'Specialized or personalized diet' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateNutritionProfile({ dietaryPreference: opt.id as DietaryPreferenceType })}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                        nutritionProfile.dietaryPreference === opt.id
                          ? 'border-purple-600 bg-purple-50/80 text-purple-950 font-bold shadow-xs ring-1 ring-purple-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{opt.label}</p>
                        <p className="text-[10px] text-slate-500">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'भोजन एलर्जी / असहनीयता (Allergies)' : 'Food Allergies & Intolerances'}
                  </label>
                  <input
                    type="text"
                    value={nutritionProfile.foodAllergies.join(', ')}
                    onChange={e =>
                      updateNutritionProfile({
                        foodAllergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. Peanuts, Lactose, Gluten..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'परहेज किए जाने वाले खाद्य पदार्थ' : 'Foods Avoided'}
                  </label>
                  <input
                    type="text"
                    value={nutritionProfile.avoidedFoods.join(', ')}
                    onChange={e =>
                      updateNutritionProfile({
                        avoidedFoods: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. Raw papaya, excess spice..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Medical History of Both Parents */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-xs text-purple-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>{isHi ? 'नैदानिक सुरक्षा:' : 'Clinical Safety & Evidence:'}</strong>{' '}
                  {isHi
                    ? 'Rh फैक्टर और हीमोग्लोबिनोपैथी (जैसे थैलेसीमिया HPLC) दोनों पार्टनर्स के इतिहास से शिशु के स्वास्थ्य जोखिमों का सटीक मूल्यांकन होता है। हम कभी भी बिना प्रमाण के प्रतिशत नहीं बनाते।'
                    : 'Rh blood group compatibility and parental hemoglobinopathy testing (HPLC HbA2) protect fetal safety. AI provides preventive clinical guidance, never unverified risk percentages.'}
                </p>
              </div>

              {/* Mother Medical Info */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isHi ? 'मां का स्वास्थ्य व रक्त समूह' : 'Maternal Medical Profile'}</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Mother’s Blood Group</label>
                    <select
                      value={userProfile.bloodGroup}
                      onChange={e => {
                        updateUserProfile({
                          bloodGroup: e.target.value,
                          rhFactor: e.target.value.includes('-') ? '-' : '+',
                        });
                        updateMaternalHistory({
                          bloodGroup: e.target.value,
                          rhFactor: e.target.value.includes('-') ? '-' : '+',
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                    >
                      {['B Positive (B+)', 'B Negative (B-)', 'O Positive (O+)', 'O Negative (O-)', 'A Positive (A+)', 'A Negative (A-)', 'AB Positive (AB+)', 'AB Negative (AB-)'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">HPLC Thalassemia Test</label>
                    <select
                      value={maternalHistory.geneticScreeningDone ? 'yes' : 'no'}
                      onChange={e => updateMaternalHistory({ geneticScreeningDone: e.target.value === 'yes' })}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="yes">Done / Screened Normal</option>
                      <option value="no">Not yet performed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Father Medical Info */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isHi ? 'पिता का स्वास्थ्य व रक्त समूह' : 'Biological Father / Partner Profile'}</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Partner Full Name</label>
                    <input
                      type="text"
                      value={paternalHistory.fullName}
                      onChange={e => updatePaternalHistory({ fullName: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Partner Blood Group</label>
                    <select
                      value={paternalHistory.bloodGroup}
                      onChange={e =>
                        updatePaternalHistory({
                          bloodGroup: e.target.value,
                          rhFactor: e.target.value.includes('-') ? '-' : '+',
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                    >
                      {['B Positive (B+)', 'B Negative (B-)', 'O Positive (O+)', 'O Negative (O-)', 'A Positive (A+)', 'A Negative (A-)', 'AB Positive (AB+)', 'AB Negative (AB-)'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Family Consanguinity */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                <label className="flex items-center gap-2 font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={familyPedigree.consanguinity}
                    onChange={e => updateFamilyPedigree({ consanguinity: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  <span>
                    {isHi
                      ? 'क्या माता-पिता आपस में रक्त-संबंधी हैं (Consanguinity)?'
                      : 'Are biological parents related by blood (Consanguinity)?'}
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 mt-1 pl-6">
                  {isHi
                    ? 'रक्त संबंध होने पर दुर्लभ आनुवंशिक विकारों के जोखिम की जांच के लिए जेनेटिक काउंसलिंग की सिफारिश की जाती है।'
                    : 'If yes, specialized carrier screening ensures timely pediatric clinical guidance.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Consents & Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{isHi ? 'डेटा सुरक्षा व गोपनीयता प्रतिज्ञा' : 'Data Privacy Safeguards & Consents'}</span>
                </div>
                <p className="leading-relaxed">
                  {isHi
                    ? 'आपकी स्वास्थ्य जानकारी एन्क्रिप्टेड है और कभी बेची नहीं जाती। AI का उपयोग केवल आपको समय पर अलर्ट, पोषण, और क्लिनिकल प्रश्न सुझाने के लिए किया जाता है।'
                    : 'Mumora processes your consented health records exclusively to deliver evidence-backed reminders, WHO growth curve plotting, and ambient environmental context.'}
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'healthDataProcessing',
                    labelHi: 'स्वास्थ्य डेटा का सुरक्षित विश्लेषण',
                    labelEn: 'Consent to private health and clinical measurement processing',
                  },
                  {
                    key: 'locationPermission',
                    labelHi: 'स्थानीय वायु गुणवत्ता व मौसम अलर्ट के लिए स्थान सहमति',
                    labelEn: 'Allow location-based ambient weather & AQI health intelligence',
                  },
                  {
                    key: 'aiAnalysisConsent',
                    labelHi: 'क्लिनिकल मार्गदर्शन हेतु एआई विश्लेषण सहमति',
                    labelEn: 'Consent to AI preventive guidance (Not a medical diagnosis substitute)',
                  },
                ].map(item => (
                  <label
                    key={item.key}
                    className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs text-slate-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean((consent as any)[item.key])}
                      onChange={e => updateConsent({ [item.key]: e.target.checked })}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>{isHi ? item.labelHi : item.labelEn}</span>
                  </label>
                ))}
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <p className="font-extrabold text-slate-900 text-sm mb-1">
                  {isHi ? 'आपकी Mumora प्रोफाइल का सारांश:' : 'Profile Setup Summary:'}
                </p>
                <p><strong>मां का नाम:</strong> {userProfile.name} ({userProfile.city}, {userProfile.state})</p>
                <p>
                  <strong>पारिवारिक स्थिति:</strong>{' '}
                  {parenthoodStatus === 'first_time_pregnant'
                    ? 'पहली बार माँ (सप्ताह ' + pregnancy.currentWeek + ')'
                    : parenthoodStatus === 'mother_and_pregnant'
                    ? `${babies.length} बच्चे + वर्तमान गर्भावस्था (सप्ताह ${pregnancy.currentWeek})`
                    : parenthoodStatus === 'mother_not_pregnant'
                    ? `${babies.length} बच्चे पंजीकृत`
                    : 'भविष्य परिवार योजना'}
                </p>
                <p><strong>आहार प्राथमिकता:</strong> {nutritionProfile.dietaryPreference.toUpperCase()}</p>
                <p><strong>ब्लड ग्रुप:</strong> मां ({userProfile.bloodGroup}), पिता ({paternalHistory.bloodGroup})</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-2xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isHi ? 'पिछला' : 'Previous'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              {isHi ? 'छोड़ें (बाद में भरें)' : 'Skip for now'}
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
          >
            <span>{currentStep === totalSteps ? (isHi ? 'डैशबोर्ड में प्रवेश करें' : 'Enter Mumora Hub') : (isHi ? 'अगला कदम' : 'Next Step')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cascading Location Change Modal */}
      <LocationChangeModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
