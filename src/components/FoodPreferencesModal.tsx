import React, { useState, useEffect } from 'react';
import {
  X,
  Utensils,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Heart,
  Droplets,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DietaryPreferenceType, NutritionProfile } from '../types';

interface FoodPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesSaved?: () => void;
}

const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts (Almonds/Walnuts)',
  'Cow Milk / Lactose',
  'Wheat / Gluten',
  'Soy / Soya',
  'Eggs',
  'Fish',
  'Shellfish / Prawns',
  'Mustard',
  'Sesame',
];

const COMMON_AVOIDED_FOODS = [
  'Raw / Green Papaya',
  'Unpasteurized Soft Cheese',
  'Raw Sprouts',
  'Street Food / Non-potable Ice',
  'High-Mercury Marine Fish',
  'Garlic & Onion (Sattvic)',
  'Excess Chili / Spicy Masalas',
  'Artificial Sweeteners',
];

const POPULAR_CUISINES = [
  'North Indian / Awadhi',
  'South Indian (Tamil / Karnataka / Andhra / Kerala)',
  'Maharashtrian',
  'Gujarati',
  'Bengali',
  'Punjabi',
  'Continental / Mediterranean',
  'East Asian / Oriental',
];

const COMMON_PREFERRED_INGREDIENTS = [
  'Spinach & Green Leafy Vegetables',
  'Lentils & Dals',
  'Paneer / Cottage Cheese',
  'Tender Coconut',
  'Lotus Seeds (Makhana)',
  'Millets (Ragi, Jowar, Bajra)',
  'Oats & Whole Grains',
  'Eggs',
  'Freshwater Fish (Rohu/Katla)',
  'Curd & Buttermilk',
];

const CULTURAL_RESTRICTION_OPTIONS = [
  'Halal',
  'Jain (Strictly No Root Vegetables / Onion / Garlic)',
  'Kosher',
  'Hindu Fasting / Vrat Friendly (Sattvic)',
  'Strictly No Beef',
  'Strictly No Pork',
  'Buddhist Vegetarian',
  'None / No Religious Restrictions',
];

export const FoodPreferencesModal: React.FC<FoodPreferencesModalProps> = ({
  isOpen,
  onClose,
  onPreferencesSaved,
}) => {
  const { language, nutritionProfile, updateNutritionProfile, regenerateMealPlan } = useApp();
  const isHi = language === 'hi';

  const [dietType, setDietType] = useState<DietaryPreferenceType>(nutritionProfile.dietaryPreference || 'vegetarian');
  const [allergies, setAllergies] = useState<string[]>(nutritionProfile.foodAllergies || []);
  const [allergyInput, setAllergyInput] = useState('');

  const [avoidedFoods, setAvoidedFoods] = useState<string[]>(nutritionProfile.avoidedFoods || []);
  const [avoidInput, setAvoidInput] = useState('');

  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>(nutritionProfile.favoriteCuisines || []);
  const [preferredIngredients, setPreferredIngredients] = useState<string[]>(nutritionProfile.preferredIngredients || []);
  const [ingredientInput, setIngredientInput] = useState('');

  const [dislikedFoods, setDislikedFoods] = useState<string[]>(nutritionProfile.dislikedFoods || []);
  const [dislikedInput, setDislikedInput] = useState('');

  const [culturalRestrictions, setCulturalRestrictions] = useState<string[]>(nutritionProfile.culturalReligiousRestrictions || []);

  const [mealsPerDay, setMealsPerDay] = useState<number>(nutritionProfile.mealsPerDay || 4);
  const [breakfastTime, setBreakfastTime] = useState(nutritionProfile.preferredMealTimings?.breakfast || '08:30 AM');
  const [lunchTime, setLunchTime] = useState(nutritionProfile.preferredMealTimings?.lunch || '01:15 PM');
  const [dinnerTime, setDinnerTime] = useState(nutritionProfile.preferredMealTimings?.dinner || '08:00 PM');

  const [budgetLevel, setBudgetLevel] = useState<'economical' | 'moderate' | 'premium' | 'flexible'>(
    nutritionProfile.dailyBudgetLevel || 'moderate'
  );
  const [customNotes, setCustomNotes] = useState(nutritionProfile.customDietaryNotes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDietType(nutritionProfile.dietaryPreference || 'vegetarian');
      setAllergies(nutritionProfile.foodAllergies || []);
      setAvoidedFoods(nutritionProfile.avoidedFoods || []);
      setFavoriteCuisines(nutritionProfile.favoriteCuisines || []);
      setPreferredIngredients(nutritionProfile.preferredIngredients || []);
      setDislikedFoods(nutritionProfile.dislikedFoods || []);
      setCulturalRestrictions(nutritionProfile.culturalReligiousRestrictions || []);
      setMealsPerDay(nutritionProfile.mealsPerDay || 4);
      setBreakfastTime(nutritionProfile.preferredMealTimings?.breakfast || '08:30 AM');
      setLunchTime(nutritionProfile.preferredMealTimings?.lunch || '01:15 PM');
      setDinnerTime(nutritionProfile.preferredMealTimings?.dinner || '08:00 PM');
      setBudgetLevel(nutritionProfile.dailyBudgetLevel || 'moderate');
      setCustomNotes(nutritionProfile.customDietaryNotes || '');
    }
  }, [isOpen, nutritionProfile]);

  if (!isOpen) return null;

  const toggleAllergy = (item: string) => {
    setAllergies(prev => (prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]));
  };

  const addCustomAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies(prev => [...prev, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const toggleAvoided = (item: string) => {
    setAvoidedFoods(prev => (prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]));
  };

  const addCustomAvoid = () => {
    if (avoidInput.trim() && !avoidedFoods.includes(avoidInput.trim())) {
      setAvoidedFoods(prev => [...prev, avoidInput.trim()]);
      setAvoidInput('');
    }
  };

  const toggleCuisine = (item: string) => {
    setFavoriteCuisines(prev => (prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]));
  };

  const toggleIngredient = (item: string) => {
    setPreferredIngredients(prev => (prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]));
  };

  const addCustomIngredient = () => {
    if (ingredientInput.trim() && !preferredIngredients.includes(ingredientInput.trim())) {
      setPreferredIngredients(prev => [...prev, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const toggleCulturalRestriction = (item: string) => {
    setCulturalRestrictions(prev => (prev.includes(item) ? prev.filter(r => r !== item) : [...prev, item]));
  };

  const addDislikedFood = () => {
    if (dislikedInput.trim() && !dislikedFoods.includes(dislikedInput.trim())) {
      setDislikedFoods(prev => [...prev, dislikedInput.trim()]);
      setDislikedInput('');
    }
  };

  const removeDisliked = (item: string) => {
    setDislikedFoods(prev => prev.filter(d => d !== item));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedProfile: Partial<NutritionProfile> = {
      dietaryPreference: dietType,
      foodAllergies: allergies,
      avoidedFoods: avoidedFoods,
      favoriteCuisines: favoriteCuisines,
      preferredIngredients: preferredIngredients,
      culturalReligiousRestrictions: culturalRestrictions,
      dislikedFoods: dislikedFoods,
      mealsPerDay: mealsPerDay,
      dailyBudgetLevel: budgetLevel,
      customDietaryNotes: customNotes,
      preferredMealTimings: {
        breakfast: breakfastTime,
        lunch: lunchTime,
        dinner: dinnerTime,
      },
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    updateNutritionProfile(updatedProfile);
    regenerateMealPlan();

    if (onPreferencesSaved) {
      onPreferencesSaved();
    }

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-[#FDFBF7] border border-[#E2DBD0] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#244230] via-[#2D5A3C] to-[#1E3A2B] text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-xs font-semibold text-emerald-100">
              <Utensils className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'व्यक्तिगत पोषण प्राथमिकताएं' : 'Food & Nutrition Preferences'}</span>
              <span>·</span>
              <span>ICMR-NIN & WHO Aligned</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isHi ? 'अपनी आहार प्राथमिकताएं संपादित करें' : 'Edit Your Food Preferences'}
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              {isHi
                ? 'आपकी प्राथमिकताओं के आधार पर आपकी दैनिक आहार योजना स्वतः अपडेट हो जाएगी।'
                : 'Your daily food recommendations and meal suggestions adapt instantly to these settings.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-8 space-y-6 overflow-y-auto text-slate-800">
          {/* 1. Diet Type */}
          <div className="space-y-2.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              {isHi ? '१. मुख्य आहार प्रकार (Diet Type) *' : '1. Core Diet Type *'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'vegetarian', label: 'Vegetarian', labelHi: 'शाकाहारी', icon: '🥦' },
                { id: 'non_vegetarian', label: 'Non-Vegetarian', labelHi: 'मांसाहारी', icon: '🍗' },
                { id: 'eggetarian', label: 'Eggetarian', labelHi: 'अंडाहारी', icon: '🥚' },
                { id: 'vegan', label: 'Vegan', labelHi: 'वीगन (पादप)', icon: '🌱' },
                { id: 'other', label: 'Other / Custom', labelHi: 'अन्य / विशेष', icon: '🥗' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDietType(opt.id as DietaryPreferenceType)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    dietType === opt.id
                      ? 'border-[#2D5A3C] bg-emerald-50 text-[#1B3624] font-black shadow-xs ring-2 ring-[#2D5A3C]/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-bold">{isHi ? opt.labelHi : opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Food Allergies & Intolerances */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                {isHi ? '२. खाद्य एलर्जी एवं असहिष्णुता (Allergies & Intolerances)' : '2. Food Allergies & Intolerances'}
              </label>
              <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Zero AI suggestions containing these</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGIES.map(item => {
                const selected = allergies.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAllergy(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? '✕ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={allergyInput}
                onChange={e => setAllergyInput(e.target.value)}
                placeholder={isHi ? 'अन्य एलर्जी जोड़ें...' : 'Add other allergy (e.g. Kiwi, Corn)...'}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#2D5A3C]"
              />
              <button
                type="button"
                onClick={addCustomAllergy}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                {isHi ? 'जोड़ें' : 'Add'}
              </button>
            </div>
          </div>

          {/* 3. Avoided Foods & Disliked Foods */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              {isHi ? '३. छोड़े जाने वाले व नापसंद खाद्य (Avoided & Disliked Foods)' : '3. Avoided & Disliked Foods'}
            </label>
            <p className="text-[11px] text-slate-500">
              {isHi
                ? 'जिन व्यंजनों या सामग्रियों से आप परहेज करते हैं या जो आपको पसंद नहीं हैं:'
                : 'Items you strictly avoid or dislike. Mumora will never include these in your suggestions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_AVOIDED_FOODS.map(item => {
                const selected = avoidedFoods.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAvoided(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Disliked list */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                {isHi ? 'नापसंद खाद्य सूची (Disliked Foods List):' : 'Specifically Disliked Items:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {dislikedFoods.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeDisliked(item)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {dislikedFoods.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No disliked items specified.</span>
                )}
              </div>
              <div className="flex gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  value={dislikedInput}
                  onChange={e => setDislikedInput(e.target.value)}
                  placeholder={isHi ? 'नापसंद खाद्य जोड़ें (उदा. करेला)...' : 'Add disliked food (e.g. Bitter gourd, Mushrooms)...'}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addDislikedFood}
                  className="px-3 py-1.5 bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  {isHi ? 'जोड़ें' : 'Add'}
                </button>
              </div>
            </div>
          </div>

          {/* 4. Preferred Cuisines & Favorite Ingredients */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              {isHi ? '४. पसंदीदा व्यंजन शैली व सामग्रियां (Cuisines & Ingredients)' : '4. Preferred Cuisines & Ingredients'}
            </label>
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 block">Favorite Cuisines:</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CUISINES.map(item => {
                  const selected = favoriteCuisines.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleCuisine(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selected
                          ? 'bg-[#2D5A3C] text-white border-[#2D5A3C] font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-600 block">Preferred Local Ingredients:</span>
              <div className="flex flex-wrap gap-2">
                {COMMON_PREFERRED_INGREDIENTS.map(item => {
                  const selected = preferredIngredients.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleIngredient(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selected
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Cultural & Religious Dietary Restrictions (Optional & Respectful) */}
          <div className="space-y-2 pt-3 border-t border-slate-200/80">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              {isHi ? '५. सांस्कृतिक या धार्मिक आहार परंपरा (Cultural / Religious Practices)' : '5. Cultural or Religious Dietary Practices'}
            </label>
            <p className="text-[11px] text-slate-500">
              {isHi
                ? 'वैकल्पिक; हम आपकी सांस्कृतिक व आध्यात्मिक मान्यताओं का पूरा सम्मान करते हैं।'
                : 'Optional; Mumora respects and honors your spiritual and cultural dietary commitments:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {CULTURAL_RESTRICTION_OPTIONS.map(item => {
                const selected = culturalRestrictions.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleCulturalRestriction(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-purple-100 border-purple-300 text-purple-950 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Meal Pattern & Usual Timings */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              {isHi ? '६. भोजन प्रतिरूप व समय (Meal Pattern & Timings)' : '6. Meal Pattern & Usual Timings'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Meals Per Day</label>
                <select
                  value={mealsPerDay}
                  onChange={e => setMealsPerDay(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value={3}>3 Main Meals</option>
                  <option value={4}>4 Meals (3 + Evening Snack)</option>
                  <option value={5}>5 Small Frequent Meals</option>
                  <option value={6}>6 Frequent Mini Meals</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Breakfast Time</label>
                <input
                  type="text"
                  value={breakfastTime}
                  onChange={e => setBreakfastTime(e.target.value)}
                  placeholder="08:30 AM"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Lunch Time</label>
                <input
                  type="text"
                  value={lunchTime}
                  onChange={e => setLunchTime(e.target.value)}
                  placeholder="01:15 PM"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Dinner Time</label>
                <input
                  type="text"
                  value={dinnerTime}
                  onChange={e => setDinnerTime(e.target.value)}
                  placeholder="08:00 PM"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 7. Budget & Local Availability */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              {isHi ? '७. बजट व स्थानीय उपलब्धता (Budget Preference)' : '7. Budget & Ingredient Availability'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'economical', title: 'Economical / Local Staples', desc: 'Lentils, seasonal vegetables, millets, local grains' },
                { id: 'moderate', title: 'Moderate / Everyday Balanced', desc: 'Diverse fruits, nuts, dairy, cottage cheese, seasonal fresh produce' },
                { id: 'flexible', title: 'Flexible / Premium', desc: 'Specialty seeds, berries, cold-pressed oils, organic staples' },
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudgetLevel(b.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    budgetLevel === b.id
                      ? 'border-[#2D5A3C] bg-emerald-50 text-[#1B3624] font-bold ring-2 ring-[#2D5A3C]/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-extrabold text-xs block">{b.title}</span>
                  <span className="text-[11px] text-slate-500 block leading-snug mt-0.5">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#2D5A3C] hover:bg-[#244730] text-white text-xs font-black shadow-md transition-all active:scale-98 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{saving ? 'Saving...' : (isHi ? 'प्राथमिकताएं सहेजें व योजना बनाएं' : 'Save Preferences & Refresh Plan')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
