import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DietaryPreferenceType,
  LocalDishEvaluation,
  FoodAlternativeItem,
  GroceryItem,
  DocumentRecord,
} from '../types';
import {
  WHO_NUTRITION_REFERENCES,
  REGIONAL_FOOD_DATABASE,
  SAMPLE_FOOD_ALTERNATIVES,
} from '../data/nutritionData';
import {
  filterFoodAlternativesForDiet,
  filterLocalDishesForDiet,
} from '../utils/dietaryValidator';
import {
  Utensils,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Info,
  Droplets,
  Plus,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Heart,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  MapPin,
  Flame,
  Wheat,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  Upload,
  Activity,
  CheckCircle,
  RefreshCw,
  FileCheck,
  Sparkles as SparklesIcon,
  HelpCircle,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

const DIETARY_OPTIONS: { id: DietaryPreferenceType; label: string; icon: string; desc: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥦', desc: '100% plant foods, pulses, grains, dairy (0% meat, fish, eggs)' },
  { id: 'eggetarian', label: 'Eggetarian', icon: '🥚', desc: 'Vegetarian plus thoroughly cooked eggs' },
  { id: 'non_vegetarian', label: 'Non-Vegetarian', icon: '🍗', desc: 'Vegetarian plus poultry, freshwater fish, cooked meats' },
  { id: 'vegan', label: 'Vegan', icon: '🌱', desc: '100% plant-based, no dairy or honey' },
  { id: 'other', label: 'Custom / Other', icon: '🥗', desc: 'Specialized or personalized diet' },
];

const POPULAR_CITIES = [
  'Bengaluru',
  'Lucknow',
  'Delhi NCR',
  'Mumbai',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Jaipur',
  'Pune',
];

export const DailyFoodGuide: React.FC = () => {
  const {
    language,
    userProfile,
    pregnancy,
    nutritionProfile,
    updateNutritionProfile,
    dailyMealPlan,
    toggleMealItemStatus,
    groceryList,
    toggleGroceryItem,
    addGroceryItem,
    foodCity,
    setFoodCity,
    regenerateMealPlan,
    adaptiveDietPlan,
    reassessDietPlanWithReport,
    adaptationHistory,
    documents,
    addDocument,
  } = useApp();

  const isHi = language === 'hi';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Active view tab
  const [activeTab, setActiveTab] = useState<'meals' | 'canIEat' | 'localDishes' | 'alternatives' | 'grocery' | 'guidelines'>('meals');

  // "Can I Eat This?" search state
  const [searchDishQuery, setSearchDishQuery] = useState('');
  const [evaluatingDish, setEvaluatingDish] = useState(false);
  const [evaluatedResult, setEvaluatedResult] = useState<LocalDishEvaluation | null>(null);

  // Grocery quick-add state
  const [newGroceryName, setNewGroceryName] = useState('');
  const [newGroceryQty, setNewGroceryQty] = useState('');
  const [newGroceryCat, setNewGroceryCat] = useState<GroceryItem['category']>('Fresh Produce');

  // Hydration state (glasses of 250ml)
  const [waterGlasses, setWaterGlasses] = useState(8);
  const targetGlasses = 11; // ~2.75L per WHO / ICMR

  // Preferences modal/accordion
  const [showPrefEditor, setShowPrefEditor] = useState(false);

  // Health report simulation / upload modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [customReportTitle, setCustomReportTitle] = useState('');
  const [customHbValue, setCustomHbValue] = useState('9.8');
  const [customFbsValue, setCustomFbsValue] = useState('88');
  const [customBpValue, setCustomBpValue] = useState('118/76');
  const [customIsBlurred, setCustomIsBlurred] = useState(false);

  // Use the actively adapted meals or baseline
  const currentMeals = adaptiveDietPlan?.meals || dailyMealPlan;

  // Filtered alternatives & regional foods ensuring strict compliance
  const sanitizedAlternatives = filterFoodAlternativesForDiet(
    SAMPLE_FOOD_ALTERNATIVES,
    nutritionProfile.dietaryPreference
  );

  const filteredLocalDishes = filterLocalDishesForDiet(
    REGIONAL_FOOD_DATABASE.filter(d =>
      foodCity ? d.cityRegion.toLowerCase() === foodCity.toLowerCase() : true
    ),
    nutritionProfile.dietaryPreference
  );

  // Format date nicely
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Today';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  // Evaluate Food with API + Fallback
  const handleEvaluateFood = async (dishName: string) => {
    if (!dishName.trim()) return;
    setEvaluatingDish(true);
    setSearchDishQuery(dishName);

    try {
      const response = await fetch('/api/evaluate-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: dishName.trim(),
          pregnancyWeek: pregnancy.currentWeek,
          dietaryPreference: nutritionProfile.dietaryPreference,
          cityRegion: foodCity,
          foodAllergies: nutritionProfile.foodAllergies,
          medicalConditions: ['Pregnancy Week ' + pregnancy.currentWeek],
        }),
      });

      if (!response.ok) throw new Error('Server returned ' + response.status);
      const data = await response.json();
      setEvaluatedResult(data);
    } catch (err: any) {
      const foundInDb = REGIONAL_FOOD_DATABASE.find(
        d =>
          d.dishName.toLowerCase().includes(dishName.toLowerCase()) ||
          d.famousFor.toLowerCase().includes(dishName.toLowerCase())
      );
      if (foundInDb) {
        setEvaluatedResult(foundInDb);
      } else {
        setEvaluatedResult({
          id: 'dish-custom-' + Date.now(),
          dishName: dishName,
          dishNameHi: dishName,
          cityRegion: foodCity,
          cuisine: 'Local Indian / Global',
          famousFor: 'User queried food item',
          status: 'suitable_with_modifications',
          statusLabel: 'Safe with preparation precautions',
          statusLabelHi: 'सावधानी व पूरी तरह पका कर खाना सुरक्षित',
          clinicalReason:
            'Ensure this dish is prepared hygienically, served steaming hot (>74°C), and made with pasteurized ingredients. Avoid raw unwashed garnishes or leftover street preparations.',
          clinicalReasonHi: 'सुनिश्चित करें कि यह ताज़ा और अच्छी तरह पका हुआ हो। कच्ची चटनी या बासी भोजन से बचें।',
          portionTip: 'Consume a moderate homestyle portion alongside high-fiber vegetables.',
          healthyModification: 'Prepare with fresh home ingredients and hygienic thorough cooking (>74°C).',
          safetyCheck: {
            pregnancySafe: true,
            isRawOrUndercookedRisk: false,
            highSodiumOrSugarRisk: false,
            deepFriedRisk: false,
            potentialAllergens: [],
          },
          dietSuitability: [nutritionProfile.dietaryPreference],
          whoGuidelineAlignment: 'WHO Healthy Diet: Hygienic preparation and balanced portioning.',
        });
      }
    } finally {
      setEvaluatingDish(false);
    }
  };

  const getStatusBadge = (status: LocalDishEvaluation['status']) => {
    switch (status) {
      case 'suitable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {isHi ? 'सुरक्षित व पौष्टिक' : 'Safe to eat as part of a balanced diet'}
          </span>
        );
      case 'suitable_with_modifications':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {isHi ? 'सावधानी व संशोधन के साथ' : 'Safe with preparation precautions'}
          </span>
        );
      case 'limit_or_alternative':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">
            <Info className="w-4 h-4 text-orange-600" />
            {isHi ? 'सीमित मात्रा में लें' : 'Eat in moderation'}
          </span>
        );
      case 'avoid_safety_reason':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            {isHi ? 'गर्भावस्था में परहेज करें' : 'Avoid during pregnancy'}
          </span>
        );
      case 'insufficient_info':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <ShieldAlert className="w-4 h-4 text-purple-600" />
            {isHi ? 'डॉक्टर से परामर्श लें' : 'Consult your doctor or dietitian'}
          </span>
        );
      default:
        return null;
    }
  };

  // Helper to handle test report simulation
  const handleSimulateReport = (scenario: 'anemia' | 'gdm' | 'hypertension' | 'normal' | 'blurred') => {
    let newDoc: Omit<DocumentRecord, 'id'>;

    if (scenario === 'anemia') {
      newDoc = {
        title: '3rd Trimester Maternal CBC & Iron Panel',
        category: 'blood_test',
        date: new Date().toISOString().split('T')[0],
        fileName: 'CBC_Iron_Panel_Recent.pdf',
        extractedText: 'Hemoglobin: 9.8 g/dL. Total WBC: 9,200 /uL. Platelets: 230,000 /uL. Fasting Blood Glucose: 86 mg/dL. Serum Ferritin: 14 ng/mL (Low). Findings indicate mild-to-moderate maternal iron deficiency anemia.',
        keyParameters: [
          { label: 'Hemoglobin (Hb)', value: '9.8 g/dL', isNormal: false, referenceRange: '11.0 - 14.0 g/dL' },
          { label: 'Serum Ferritin', value: '14 ng/mL', isNormal: false, referenceRange: '30 - 150 ng/mL' },
          { label: 'Fasting Blood Sugar', value: '86 mg/dL', isNormal: true, referenceRange: '< 92 mg/dL' },
          { label: 'Platelet Count', value: '230,000 /uL', isNormal: true, referenceRange: '150,000 - 450,000 /uL' },
        ],
      };
    } else if (scenario === 'gdm') {
      newDoc = {
        title: '24-Week 75g Oral Glucose Tolerance Test (OGTT)',
        category: 'blood_test',
        date: new Date().toISOString().split('T')[0],
        fileName: 'OGTT_Screening_Report.pdf',
        extractedText: 'Fasting Plasma Glucose: 98 mg/dL. 1-Hour Post 75g Glucose: 168 mg/dL. 2-Hour Post Glucose: 146 mg/dL. Fasting glucose exceeds WHO/IADPSG pregnancy cutoff of 92 mg/dL.',
        keyParameters: [
          { label: 'Fasting Blood Sugar', value: '98 mg/dL', isNormal: false, referenceRange: '< 92 mg/dL' },
          { label: '2-Hr OGTT (75g)', value: '146 mg/dL', isNormal: true, referenceRange: '< 153 mg/dL' },
          { label: 'Hemoglobin (Hb)', value: '11.2 g/dL', isNormal: true, referenceRange: '≥ 10.5 g/dL' },
        ],
      };
    } else if (scenario === 'hypertension') {
      newDoc = {
        title: 'Antenatal Triage Vitals & Urine Dipstick Report',
        category: 'urine_test',
        date: new Date().toISOString().split('T')[0],
        fileName: 'Antenatal_Vitals_Urine_Screen.pdf',
        extractedText: 'Sitting Blood Pressure: 148/94 mmHg (Elevated). Urine Albumin (Dipstick): 1+ (Trace-to-moderate proteinuria). Serum Creatinine: 0.82 mg/dL.',
        keyParameters: [
          { label: 'Blood Pressure', value: '148/94 mmHg', isNormal: false, referenceRange: '< 140/90 mmHg' },
          { label: 'Urine Albumin / Protein', value: '1+ Positive', isNormal: false, referenceRange: 'Negative' },
          { label: 'Hemoglobin (Hb)', value: '11.4 g/dL', isNormal: true, referenceRange: '≥ 10.5 g/dL' },
        ],
      };
    } else if (scenario === 'blurred') {
      newDoc = {
        title: 'Community Health Clinic Lab Slip (Rain Stain)',
        category: 'blood_test',
        date: new Date().toISOString().split('T')[0],
        fileName: 'Clinic_Slip_Partial_Blurred.pdf',
        extractedText: 'Patient: Ananya Sharma. Hemoglobin: [BLURRED / SMUDGED INK] g/dL. Fasting Blood Glucose: 88 mg/dL. Urine Routine: [UNREADABLE TEAR ON MARGIN]. Value cannot be confirmed without original lab register.',
        keyParameters: [
          { label: 'Hemoglobin (Hb)', value: 'Unclear (9.? / 10.?)', isNormal: false, referenceRange: '≥ 10.5 g/dL' },
          { label: 'Fasting Blood Sugar', value: '88 mg/dL', isNormal: true, referenceRange: '< 92 mg/dL' },
        ],
      };
    } else {
      newDoc = {
        title: 'Routine Follow-up Hematology & Biochemical Profile',
        category: 'blood_test',
        date: new Date().toISOString().split('T')[0],
        fileName: 'Routine_Followup_CBC_Normal.pdf',
        extractedText: 'Hemoglobin: 11.6 g/dL. Platelets: 245,000 /uL. Fasting Blood Glucose: 84 mg/dL. Blood Pressure: 118/74 mmHg. Reassuring maternal antenatal parameters.',
        keyParameters: [
          { label: 'Hemoglobin (Hb)', value: '11.6 g/dL', isNormal: true, referenceRange: '≥ 10.5 g/dL' },
          { label: 'Fasting Blood Sugar', value: '84 mg/dL', isNormal: true, referenceRange: '< 92 mg/dL' },
          { label: 'Blood Pressure', value: '118/74 mmHg', isNormal: true, referenceRange: '< 140/90 mmHg' },
        ],
      };
    }

    addDocument(newDoc);
    setShowReportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Mumora Dynamic AI Nutrition Dashboard */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-purple-100">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'डायनामिक रिपोर्ट-अनुकूलित आहार योजना' : 'Dynamic Health-Report AI Diet Plan'}</span>
              <span>·</span>
              <span>Trimester {pregnancy.trimester} (Week {pregnancy.currentWeek})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isHi ? 'आपका रिपोर्ट-अनुकूलित पोषण मार्गदर्शक' : 'Your Dynamic AI Diet Plan'}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
              {isHi
                ? 'आपकी नवीनतम लैब रिपोर्ट, ब्लड प्रेशर, फोलिक/आयरन आवश्यकताओं और स्थायी शाकाहारी/मांसाहारी प्राथमिकताओं के आधार पर स्वतः नवीनीकृत भोजन योजना।'
                : 'Continuously adapts to your latest clinical blood reports, trimester milestones, and strict dietary preference with WHO & ICMR-NIN 2024 compliance.'}
            </p>
          </div>

          {/* Quick Dietary Preference Pill & Central Location */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col gap-2 shrink-0 sm:min-w-[260px]">
            <div className="flex items-center justify-between text-xs text-purple-200">
              <span>{isHi ? 'आहार प्राथमिकता (सुरक्षित)' : 'Dietary Preference'}</span>
              <button
                onClick={() => setShowPrefEditor(!showPrefEditor)}
                className="text-amber-300 font-bold hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>{showPrefEditor ? (isHi ? 'पूर्ण' : 'Close') : (isHi ? 'बदलें' : 'Change')}</span>
                {showPrefEditor ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">
                {DIETARY_OPTIONS.find(d => d.id === nutritionProfile.dietaryPreference)?.icon || '🥦'}
              </span>
              <div>
                <p className="font-extrabold text-sm capitalize">
                  {DIETARY_OPTIONS.find(d => d.id === nutritionProfile.dietaryPreference)?.label || 'Vegetarian'}
                </p>
                <p className="text-[11px] text-purple-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{userProfile.city || userProfile.district || foodCity}</span>
                  <span className="text-purple-300 text-[10px]">(Profile Sync)</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
              <span className="text-purple-200">Enforcement:</span>
              <span className="font-bold text-emerald-300 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {nutritionProfile.dietaryPreference === 'vegetarian' ? '100% Meat & Egg Free' : 'Safe Cooked Proteins'}
              </span>
            </div>
          </div>
        </div>

        {/* Expandable Preferences Customizer */}
        {showPrefEditor && (
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-800 bg-white rounded-2xl p-5 shadow-lg">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-purple-600" />
                <span>What type of food do you eat? (Permanent Restriction)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIETARY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      updateNutritionProfile({ dietaryPreference: opt.id });
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                      nutritionProfile.dietaryPreference === opt.id
                        ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Note: Selecting Vegetarian ensures the AI will never recommend meat, fish, or eggs, even in response to clinical anemia.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                <span>City & Regional Food Availability</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CITIES.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setFoodCity(c);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      (foodCity === c || userProfile.city === c)
                        ? 'bg-purple-700 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    regenerateMealPlan();
                    setShowPrefEditor(false);
                  }}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Update & Regenerate Meals</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-purple-100">
        {[
          {
            id: 'meals',
            label: language === 'te' ? 'నేటి ఆహార ప్రణాళిక' : isHi ? 'आज का आहार योजना' : "Today's Diet Plan",
            icon: Utensils,
          },
          {
            id: 'canIEat',
            label: language === 'te' ? 'నేను ఇది తినవచ్చా?' : isHi ? 'क्या मैं यह खा सकती हूँ?' : 'Can I Eat This?',
            icon: Search,
          },
          {
            id: 'localDishes',
            label: language === 'te' ? `${foodCity} స్థానిక వంటకాలు` : isHi ? `${foodCity} के स्थानीय व्यंजन` : `Local Foods (${foodCity})`,
            icon: MapPin,
          },
          {
            id: 'alternatives',
            label: language === 'te' ? 'ఆరోగ్యకరమైన ప్రత్యామ్నాయాలు' : isHi ? 'स्वस्थ विकल्प' : 'Healthy Swaps',
            icon: Wheat,
          },
          {
            id: 'grocery',
            label: language === 'te' ? 'కిరాణా జాబితా' : isHi ? 'स्मार्ट किराने की सूची' : t.nutrition.groceryList || 'Smart Grocery List',
            icon: ShoppingBag,
          },
          {
            id: 'guidelines',
            label: language === 'te' ? 'వైద్య మార్గదర్శకాలు' : isHi ? 'चिकित्सकीय प्रमाण' : t.nutrition.whoGuidance || 'Clinical Evidence',
            icon: BookOpen,
          },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TODAY'S DYNAMIC DIET PLAN DASHBOARD */}
      {activeTab === 'meals' && (
        <div className="space-y-6">
          {/* 1. LATEST HEALTH REPORT & CALIBRATION STATUS CARD */}
          <div className="bg-white border-2 border-purple-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Report-Calibrated Diet</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {adaptiveDietPlan?.isBasedOnNewReport ? 'Adapted from Lab Analysis' : 'Calibrated to Trimester Baseline'}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Latest Report Analyzed:</span>
                  <span className="text-purple-700">
                    {adaptiveDietPlan?.sourceReportTitle || (documents.length > 0 ? documents[0].title : 'Baseline Maternal Health Profile')}
                  </span>
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Report Date:</strong> {formatDate(adaptiveDietPlan?.sourceReportDate || documents[0]?.date)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Plan Last Updated:</strong> {formatDateTime(adaptiveDietPlan?.planLastUpdated)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Test/Upload Report */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  <span>Test Health Scenarios</span>
                </button>
                <button
                  onClick={() => {
                    const latestBlood = documents.find(d => d.category === 'blood_test' || d.category === 'urine_test') || documents[0];
                    reassessDietPlanWithReport(latestBlood?.id);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                  title="Re-run assessment against current vault records"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reassess</span>
                </button>
              </div>
            </div>

            {/* Notice When New Report Needs Clarification */}
            {adaptiveDietPlan?.needsClarification && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-amber-900 text-sm">
                    Medical Report Needs Clarification / Clinical Review
                  </h4>
                  <p className="text-amber-800 leading-relaxed">
                    {adaptiveDietPlan.clarificationNotice || 'The uploaded lab scan has blurry, torn, or unverified readings. To protect maternal-fetal safety, the diet planner has preserved your safe baseline meals and has NOT made unverified alterations. Please verify the exact values with your doctor or diagnostic lab.'}
                  </p>
                </div>
              </div>
            )}

            {/* Doctor Consultation Triggers Banner if severe */}
            {adaptiveDietPlan?.doctorConsultationTriggers && adaptiveDietPlan.doctorConsultationTriggers.length > 0 && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-rose-900 text-sm">
                    Doctor Consultation Recommended
                  </h4>
                  <ul className="list-disc list-inside text-rose-800 space-y-0.5">
                    {adaptiveDietPlan.doctorConsultationTriggers.map((trig, idx) => (
                      <li key={idx}>{trig}</li>
                    ))}
                  </ul>
                  <p className="text-rose-700 font-semibold pt-1">
                    * Dietary guidance complements clinical care; serious medical findings must not be managed with food alone.
                  </p>
                </div>
              </div>
            )}

            {/* 2. "WHAT CHANGED & WHY" SUMMARY */}
            <div className="bg-purple-50/50 rounded-2xl p-4.5 border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-purple-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>What Changed & Why in Your Diet Plan</span>
                </h3>
                <span className="text-[11px] font-semibold text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200">
                  Evidence-Based Clinical Reasoning
                </span>
              </div>

              <div className="space-y-2">
                {adaptiveDietPlan?.whatChangedSummary && adaptiveDietPlan.whatChangedSummary.length > 0 ? (
                  adaptiveDietPlan.whatChangedSummary.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-purple-100/70 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>{item}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Diet plan is currently matched to standard Trimester {pregnancy.trimester} requirements and your saved {nutritionProfile.dietaryPreference} preference.
                  </p>
                )}
              </div>

              {/* Clinical rationale snippet */}
              <div className="pt-2 text-[11px] text-purple-900 flex items-center gap-1.5 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>{adaptiveDietPlan?.clinicalRationale || 'Calibrated to WHO ANC 2020 and ICMR-NIN 2024 Dietary Guidelines.'}</span>
              </div>
            </div>
          </div>

          {/* 3. NUTRITIONAL GOALS & HYDRATION SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Daily Hydration Target */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      {isHi ? 'दैनिक जल सेवन लक्ष्य' : 'Daily Hydration Goal'}
                    </h3>
                    <p className="text-[11px] text-blue-700 font-medium">
                      WHO Target: {adaptiveDietPlan?.nutritionalGoals?.hydrationLitersTarget || 2.75} Liters / day
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-blue-900 text-lg">
                  {(waterGlasses * 0.25).toFixed(1)} L
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                  <span>{waterGlasses} of {targetGlasses} glasses (250 ml each)</span>
                  <span className="font-bold text-blue-800">
                    {Math.min(100, Math.round((waterGlasses / targetGlasses) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-blue-200/70 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (waterGlasses / targetGlasses) * 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setWaterGlasses(prev => Math.max(0, prev - 1))}
                    className="flex-1 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-100"
                  >
                    - 1 Glass
                  </button>
                  <button
                    onClick={() => setWaterGlasses(prev => prev + 1)}
                    className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + 1 Glass
                  </button>
                </div>
              </div>
            </div>

            {/* Trimester Energy & Protein Target */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Energy & Protein Calibration</span>
                </div>
                <p className="text-xs text-slate-600">
                  Target: <strong>{adaptiveDietPlan?.nutritionalGoals?.caloriesTarget || 2450} kcal</strong> & <strong>{adaptiveDietPlan?.nutritionalGoals?.proteinGramsTarget || 75}g protein/day</strong> (+23g maternal tissue expansion in Trimester {pregnancy.trimester}).
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {adaptiveDietPlan?.nutritionalGoals?.keyNutrientFocus?.map((nut, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      ★ {nut}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <span className="text-amber-800 font-semibold">Iron Target:</span>
                <span className="font-extrabold text-slate-800">
                  {adaptiveDietPlan?.nutritionalGoals?.ironMgTarget || 30} mg/day
                </span>
              </div>
            </div>

            {/* Strict Dietary Preference Assurance */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Dietary Safety Boundary</span>
                </div>
                <p className="text-xs text-slate-600">
                  {nutritionProfile.dietaryPreference === 'vegetarian'
                    ? 'Strict Vegetarian Restriction Enforced: All iron, calcium, and protein recommendations use exclusively 100% verified plant sources. 0% meat, fish, or eggs.'
                    : 'Non-Vegetarian Profile: Safe, thoroughly cooked lean proteins paired with diverse regional pulses and whole grains.'}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-semibold">Saved Preference:</span>
                <span className="font-extrabold text-emerald-900 uppercase">
                  {nutritionProfile.dietaryPreference}
                </span>
              </div>
            </div>
          </div>

          {/* 4. FOODS TO PRIORITIZE & FOODS TO AVOID / LIMIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Foods to Prioritize */}
            <div className="bg-white border border-emerald-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm pb-2 border-b border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recommended Foods to Prioritize</span>
              </div>
              <div className="space-y-3">
                {adaptiveDietPlan?.foodsToPrioritize && adaptiveDietPlan.foodsToPrioritize.length > 0 ? (
                  adaptiveDietPlan.foodsToPrioritize.map((item, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/70 space-y-1">
                      <p className="font-bold text-slate-900 text-xs">{item.food}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{item.reason}</p>
                      <p className="text-[10px] text-emerald-800 font-semibold pt-0.5">
                        Tip: {item.servingTip}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Sprouted pulses, seasonal dark leafy greens, millets, and fresh curd.</p>
                )}
              </div>
            </div>

            {/* Foods to Restrict */}
            <div className="bg-white border border-rose-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm pb-2 border-b border-rose-100">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Foods to Avoid or Limit (Clear Reasons)</span>
              </div>
              <div className="space-y-3">
                {adaptiveDietPlan?.foodsToRestrict && adaptiveDietPlan.foodsToRestrict.length > 0 ? (
                  adaptiveDietPlan.foodsToRestrict.map((item, idx) => (
                    <div key={idx} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/70 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-900 text-xs">{item.food}</p>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          item.severity === 'strict_avoid' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.severity === 'strict_avoid' ? 'Avoid' : 'Limit'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{item.reason}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Raw street foods, unpasteurized milk products, and unwashed raw vegetables.</p>
                )}
              </div>
            </div>
          </div>

          {/* 5. 6 STRUCTURED DAILY MEAL SLOTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-purple-600" />
                  <span>Today's 6 Recommended Meal Slots</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Adapted to your trimester, latest lab reports, and verified {nutritionProfile.dietaryPreference} ingredients.
                </p>
              </div>
              <span className="text-xs text-slate-500">
                {currentMeals.filter(m => m.isEaten).length} of {currentMeals.length} logged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMeals.map(slot => (
                <div
                  key={slot.id}
                  className={`border rounded-2xl p-4.5 transition-all ${
                    slot.isEaten
                      ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                      : 'bg-white border-purple-100 hover:border-purple-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800">
                        {slot.slotLabel}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleMealItemStatus(slot.id, 'isEaten')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        slot.isEaten
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                      }`}
                      title={slot.isEaten ? 'Marked as consumed' : 'Click to mark consumed'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{slot.isEaten ? (isHi ? 'खाया गया' : 'Eaten') : (isHi ? 'मार्क करें' : 'Log')}</span>
                    </button>
                  </div>

                  {/* Dish Name & Description */}
                  <div className="mt-3">
                    <p className="font-extrabold text-slate-900 text-sm">
                      {isHi && slot.foodNameHi ? slot.foodNameHi : slot.foodName}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {slot.description}
                    </p>
                  </div>

                  {/* Portion & Key Nutrients */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      Portion: {slot.portionGuide}
                    </span>
                    {slot.mainIngredients.map((nut, i) => (
                      <span key={i} className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md font-semibold">
                        {nut}
                      </span>
                    ))}
                  </div>

                  {/* Clinical Benefit & Kitchen Tip */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <Heart className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">
                        <strong className="text-slate-800">Clinical Benefit:</strong> {isHi && slot.clinicalWhyHi ? slot.clinicalWhyHi : slot.clinicalWhy}
                      </span>
                    </div>
                    {slot.simplePreparation && slot.simplePreparation.length > 0 && (
                      <div className="flex items-start gap-1.5 text-slate-500">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed">
                          <strong className="text-slate-700">Kitchen Prep:</strong> {slot.simplePreparation[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Substitutions & Alternatives */}
                  {slot.preferenceSubstitution && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100/70 text-[11px] text-slate-500">
                      <strong>Alternative:</strong> {slot.preferenceSubstitution}
                    </div>
                  )}

                  {/* User Feedback Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMealItemStatus(slot.id, 'isLiked')}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                          slot.isLiked
                            ? 'bg-pink-50 border-pink-400 text-pink-700 font-bold'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title="Love this dish"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Like</span>
                      </button>
                      <button
                        onClick={() => toggleMealItemStatus(slot.id, 'isDisliked')}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                          slot.isDisliked
                            ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title="Don't recommend again"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>Dislike</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleMealItemStatus(slot.id, 'isUnavailable')}
                      className={`text-[11px] font-medium transition-all ${
                        slot.isUnavailable
                          ? 'text-amber-700 underline font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {slot.isUnavailable ? 'Unavailable today' : 'Not in pantry?'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: "CAN I EAT THIS?" LOCAL FOOD SAFETY CHECKER */}
      {activeTab === 'canIEat' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                <span>Can I Eat This? — Local Food & Street Food Safety Checker</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {isHi
                  ? 'किसी भी स्थानीय व्यंजन, स्ट्रीट फूड, फल या काढ़े का नाम लिखें या नीचे दिए गए लोकप्रिय व्यंजनों पर क्लिक करें।'
                  : 'Search any local Indian or global dish, herbal decoction (kadha), street food, or fruit to receive evidence-based safety evaluation with 5 clinical outcome categories.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchDishQuery}
                  onChange={e => setSearchDishQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEvaluateFood(searchDishQuery)}
                  placeholder="e.g. Raw Papaya, Street Pani Puri, Methi Ladoo, Gond Ladoo, Sushi, Haldi Doodh..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => handleEvaluateFood(searchDishQuery)}
                disabled={evaluatingDish || !searchDishQuery.trim()}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {evaluatingDish ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check Safety</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500">Quick Check Popular Dishes & Traditional Foods:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Raw Papaya Salad',
                  'Ripe Papaya',
                  'Street Pani Puri / Golgappe',
                  'Methi Ladoo',
                  'Gond Ladoo with Cow Ghee',
                  'Raw / Undercooked Sushi',
                  'Ajwain Kadha',
                  'Haldi Doodh (Turmeric Milk)',
                  'Unpasteurized Blue Cheese',
                  'Tender Coconut Water',
                ].map(dish => (
                  <button
                    key={dish}
                    onClick={() => handleEvaluateFood(dish)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-100 transition-colors"
                  >
                    {dish}
                  </button>
                ))}
              </div>
            </div>

            {evaluatedResult && (
              <div className="mt-6 p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {isHi && evaluatedResult.dishNameHi ? evaluatedResult.dishNameHi : evaluatedResult.dishName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cuisine: {evaluatedResult.cuisine} · Region: {evaluatedResult.cityRegion}
                    </p>
                  </div>
                  <div>{getStatusBadge(evaluatedResult.status)}</div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <strong className="text-slate-800">Clinical Evaluation:</strong>
                    <p className="text-slate-700 mt-1 leading-relaxed">
                      {isHi && evaluatedResult.clinicalReasonHi ? evaluatedResult.clinicalReasonHi : evaluatedResult.clinicalReason}
                    </p>
                  </div>

                  {evaluatedResult.portionTip && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <strong className="text-amber-900 text-xs">Portion Guidance:</strong>
                      <p className="text-amber-800 text-xs mt-0.5">{evaluatedResult.portionTip}</p>
                    </div>
                  )}

                  {evaluatedResult.healthyModification && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <strong className="text-emerald-900 text-xs">Recommended Safe Modification:</strong>
                      <p className="text-emerald-800 text-xs mt-0.5">{evaluatedResult.healthyModification}</p>
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Evidence Alignment: {evaluatedResult.whoGuidelineAlignment}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LOCAL DISHES NEAR ME */}
      {activeTab === 'localDishes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>Famous Local Dishes in {foodCity} ({nutritionProfile.dietaryPreference})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Nutrient analysis and pregnancy suitability filtered for your saved dietary preference.
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {POPULAR_CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => setFoodCity(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    foodCity === c
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLocalDishes.map(dish => (
              <div
                key={dish.id}
                className="bg-white border border-purple-100 rounded-2xl p-4.5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {isHi && dish.dishNameHi ? dish.dishNameHi : dish.dishName}
                      </h3>
                      <p className="text-[11px] text-slate-500">{dish.famousFor}</p>
                    </div>
                    {getStatusBadge(dish.status)}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {isHi && dish.clinicalReasonHi ? dish.clinicalReasonHi : dish.clinicalReason}
                  </p>

                  {dish.portionTip && (
                    <div className="mt-2.5 bg-slate-50 p-2 rounded-lg text-[11px] text-slate-700">
                      <strong>Portion:</strong> {dish.portionTip}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{dish.cuisine}</span>
                  <span>{dish.whoGuidelineAlignment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HEALTHY FOOD ALTERNATIVES */}
      {activeTab === 'alternatives' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wheat className="w-4 h-4 text-purple-600" />
              <span>Smart Nutritional Swaps & Affordable Alternatives</span>
            </h2>
            <p className="text-xs text-slate-500">
              Replace refined starches, ultra-processed street fats, and unsafe items with nutrient-dense verified staples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sanitizedAlternatives.map(item => (
              <div
                key={item.id}
                className="bg-white border border-purple-100 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                    {item.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                    <p className="text-[11px] font-bold text-rose-700 uppercase">Avoid / Replace:</p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{item.originalFood}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <p className="text-[11px] font-bold text-emerald-700 uppercase">Recommended Swap:</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{item.recommendedAlternative}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Why it matters:</strong> {isHi && item.clinicalAdvantageHi ? item.clinicalAdvantageHi : item.clinicalAdvantage}
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600">
                  <strong className="text-slate-800">Affordability:</strong> {item.affordableFactor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SMART GROCERY LIST */}
      {activeTab === 'grocery' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-600" />
                <span>Smart Maternal & Baby Grocery Planner</span>
              </h2>
              <p className="text-xs text-slate-500">
                Weekly essentials categorized by nutrient density (WHO & ICMR-NIN).
              </p>
            </div>
            <div className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              {groceryList.filter(g => g.checked).length} of {groceryList.length} items checked
            </div>
          </div>

          <div className="bg-white border border-purple-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-2.5 shadow-2xs">
            <input
              type="text"
              value={newGroceryName}
              onChange={e => setNewGroceryName(e.target.value)}
              placeholder="Add item (e.g. Fresh Lemons, Sprouted Moong)..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={newGroceryQty}
              onChange={e => setNewGroceryQty(e.target.value)}
              placeholder="Qty (e.g. 500g)"
              className="w-full sm:w-28 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={newGroceryCat}
              onChange={e => setNewGroceryCat(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="Fresh Produce">Fresh Produce</option>
              <option value="Pulses & Legumes">Pulses & Legumes</option>
              <option value="Whole Grains">Whole Grains</option>
              <option value="Dairy & Alternatives">Dairy & Alternatives</option>
              <option value="Nuts & Seeds">Nuts & Seeds</option>
              <option value="Pantry & Spices">Pantry & Spices</option>
            </select>
            <button
              onClick={() => {
                if (newGroceryName.trim()) {
                  addGroceryItem(newGroceryName, newGroceryQty || '1 pack', newGroceryCat);
                  setNewGroceryName('');
                  setNewGroceryQty('');
                }
              }}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groceryList.map(g => (
              <div
                key={g.id}
                onClick={() => toggleGroceryItem(g.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  g.checked
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                    : 'bg-white border-purple-100 hover:border-purple-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    g.checked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300'
                  }`}>
                    {g.checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${g.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {g.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{g.category}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-700">{g.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CLINICAL GUIDELINES & EVIDENCE */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>WHO & National Clinical Nutrition Standards</span>
            </h2>
            <p className="text-xs text-slate-500">
              Official reference citations informing Mumora's maternal and neonatal dietary algorithms.
            </p>
          </div>

          <div className="space-y-3">
            {WHO_NUTRITION_REFERENCES.map(ref => (
              <div key={ref.id} className="bg-white border border-purple-100 rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{ref.title}</h3>
                    <p className="text-xs text-purple-700 font-semibold mt-0.5">
                      {ref.issuingOrganization} · {ref.publicationYear}
                    </p>
                  </div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-purple-700 rounded-lg hover:bg-purple-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ref.clinicalSummary}</p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <strong>Guideline Section:</strong> {ref.relevantSection}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE REPORT TESTING & SIMULATION MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Test Health Report Scenarios
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Select or simulate a health report to test how Mumora automatically adapts today's meal plan, calculates "What Changed & Why", updates nutritional targets, and strictly preserves your {nutritionProfile.dietaryPreference} preference.
            </p>

            {/* Existing Documents from Vault */}
            {documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Existing Records in Your Vault:</p>
                <div className="space-y-1.5">
                  {documents.map(d => (
                    <div
                      key={d.id}
                      onClick={() => {
                        reassessDietPlanWithReport(d.id);
                        setShowReportModal(false);
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="font-bold text-slate-800">{d.title}</p>
                          <p className="text-[11px] text-slate-400">{d.category} · {d.date}</p>
                        </div>
                      </div>
                      <span className="text-purple-700 font-bold text-[11px]">Assess & Adapt →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-Calibrated Clinical Scenarios */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700">Simulate Clinical Report Scenarios:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleSimulateReport('anemia')}
                  className="p-3 text-left rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 transition-all space-y-1"
                >
                  <p className="text-xs font-bold text-amber-950 flex items-center justify-between">
                    <span>1. Mild Anemia (Hb 9.8 g/dL)</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-extrabold">Simulate</span>
                  </p>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Tests iron density boost (sprouted moong, palak, lemon) and 2h tea/calcium restriction while guaranteeing 100% vegetarianism.
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateReport('gdm')}
                  className="p-3 text-left rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 transition-all space-y-1"
                >
                  <p className="text-xs font-bold text-purple-950 flex items-center justify-between">
                    <span>2. Gestational Glucose Spike</span>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-extrabold">Simulate</span>
                  </p>
                  <p className="text-[11px] text-purple-800 leading-snug">
                    Fasting 98 mg/dL. Replaces refined carbs with low-GI Ragi, oats, and resistant starch pulses.
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateReport('hypertension')}
                  className="p-3 text-left rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 transition-all space-y-1"
                >
                  <p className="text-xs font-bold text-rose-950 flex items-center justify-between">
                    <span>3. Hypertension & Proteinuria</span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-extrabold">Simulate</span>
                  </p>
                  <p className="text-[11px] text-rose-800 leading-snug">
                    BP 148/94 & Albumin 1+. Tests sodium restriction (&lt;5g/day salt), potassium boost, and hospital review prompt.
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateReport('blurred')}
                  className="p-3 text-left rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all space-y-1"
                >
                  <p className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>4. Smudged / Blurry Scan</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-extrabold">Simulate</span>
                  </p>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Tests unverified reading safeguard: flags for clarification without making speculative changes.
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateReport('normal')}
                  className="p-3 text-left rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 transition-all space-y-1 sm:col-span-2"
                >
                  <p className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                    <span>5. Reassuring Normal Follow-Up (Hb 11.6 g/dL, Glucose 84 mg/dL)</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold">Simulate</span>
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    Verifies recovery and re-establishes healthy trimester baseline nutrition.
                  </p>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
