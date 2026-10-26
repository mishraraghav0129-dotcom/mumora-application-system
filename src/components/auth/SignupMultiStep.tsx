import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Smartphone,
  Calendar,
  MapPin,
  Heart,
  Baby,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Plus,
  Trash2,
  Info,
  Check,
  Globe,
  Search,
  Navigation,
  RefreshCw,
  Droplets,
  Wind,
  Leaf,
  Utensils,
  Apple,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { requestOtpVerification, verifyOtpCode } from '../../services/authService';
import { BabyProfile, Language, NutritionProfile } from '../../types';
import { WORLD_LANGUAGES, TRANSLATIONS, isRTL } from '../../data/translations';
import { SearchableGeoSelect } from '../common/SearchableGeoSelect';
import {
  fetchCountries,
  fetchStates,
  fetchDistricts,
  detectDeviceCoordinates,
  resolveCoordinatesToLocation,
  DetectedLocationResult,
  GeolocationError,
} from '../../services/locationService';
import { GeoCountry, GeoSubdivision, GeoDistrict } from '../../data/geoData';

interface SignupMultiStepProps {
  onBackToWelcome: () => void;
  onSwitchToLogin: () => void;
}

export const SignupMultiStep: React.FC<SignupMultiStepProps> = ({
  onBackToWelcome,
  onSwitchToLogin,
}) => {
  const { language, setLanguage, signup } = useApp();
  const isHi = language === 'hi';
  const t = TRANSLATIONS[language];

  // 7-Step Workflow:
  // Step 1: Language Selection
  // Step 2: Account Credentials (Name, Email/Phone, Password, OTP, Terms)
  // Step 3: Location & Environmental Health Intelligence Toggle (GPS, Country -> State -> District, DOB, Blood Group)
  // Step 4: Food & Nutrition Preferences (Diet type, Allergies, Cuisines, Preferred/Disliked, Meal Patterns, Budget)
  // Step 5: Pregnancy & Maternal Health Details
  // Step 6: Existing Children & Family
  // Step 7: Review & Complete
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================================
  // STEP 1: LANGUAGE SELECTION STATE
  // =========================================================================
  const [langSearch, setLangSearch] = useState('');
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<Language>(language);

  const filteredLanguages = WORLD_LANGUAGES.filter(item => {
    const q = langSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.nativeName.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q)
    );
  });

  const handleSelectLanguage = (code: string) => {
    const langCode = code as Language;
    setSelectedLanguageCode(langCode);
    setLanguage(langCode);
  };

  // =========================================================================
  // STEP 2: ACCOUNT CREDENTIALS STATE
  // =========================================================================
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');

  // =========================================================================
  // STEP 3: LOCATION & PERSONAL PROFILE STATE (STRICTLY CLEAN EMPTY INITIAL)
  // =========================================================================
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [preExistingConditions, setPreExistingConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [currentMeds, setCurrentMeds] = useState<string[]>([]);
  const [medInput, setMedInput] = useState('');

  // Cascading Location Hierarchy
  const [countriesList, setCountriesList] = useState<GeoCountry[]>([]);
  const [statesList, setStatesList] = useState<GeoSubdivision[]>([]);
  const [districtsList, setDistrictsList] = useState<GeoDistrict[]>([]);

  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [cityInput, setCityInput] = useState('');

  const [detectedCoords, setDetectedCoords] = useState<{ lat?: number; lng?: number }>({});
  const [gpsPermissionGranted, setGpsPermissionGranted] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Load countries list on mount
  useEffect(() => {
    let mounted = true;
    const loadInitCountries = async () => {
      setLoadingCountries(true);
      try {
        const list = await fetchCountries();
        if (mounted) {
          setCountriesList(list);
        }
      } catch (err) {
        console.error('Error loading country list:', err);
      } finally {
        if (mounted) setLoadingCountries(false);
      }
    };
    loadInitCountries();
    return () => {
      mounted = false;
    };
  }, []);

  // When Country selection changes, cascade to fetch states
  const handleCountrySelect = async (countryCode: string, countryName: string) => {
    setSelectedCountryCode(countryCode);
    setSelectedCountryName(countryName);
    setSelectedStateCode('');
    setSelectedStateName('');
    setSelectedDistrictCode('');
    setSelectedDistrictName('');
    setDistrictsList([]);

    setLoadingStates(true);
    try {
      const states = await fetchStates(countryCode);
      setStatesList(states);
    } catch (err) {
      console.warn('Error loading states for country:', countryCode, err);
      setStatesList([]);
    } finally {
      setLoadingStates(false);
    }
  };

  // When State selection changes, cascade to fetch districts
  const handleStateSelect = async (stateCode: string, stateName: string) => {
    setSelectedStateCode(stateCode);
    setSelectedStateName(stateName);
    setSelectedDistrictCode('');
    setSelectedDistrictName('');

    setLoadingDistricts(true);
    try {
      const dists = await fetchDistricts(selectedCountryCode, stateCode, stateName);
      setDistrictsList(dists);
    } catch (err) {
      console.warn('Error loading districts:', err);
      setDistrictsList([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Handle District selection
  const handleDistrictSelect = (districtCode: string, districtName: string) => {
    setSelectedDistrictCode(districtCode);
    setSelectedDistrictName(districtName);
    if (!cityInput) {
      setCityInput(districtName);
    }
  };

  // GPS Automatic Location Detection
  const handleDetectDeviceLocation = async () => {
    setGpsLoading(true);
    setGpsStatusMessage(null);
    setErrorMsg('');

    try {
      const coords = await detectDeviceCoordinates();
      setDetectedCoords({ lat: coords.latitude, lng: coords.longitude });
      setGpsPermissionGranted(true);

      const resolved = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);

      // Auto-populate cascading fields
      setSelectedCountryCode(resolved.countryCode || 'IN');
      setSelectedCountryName(resolved.country || 'India');

      // Fetch states for country
      const states = await fetchStates(resolved.countryCode || 'IN');
      setStatesList(states);

      if (resolved.state) {
        setSelectedStateCode(resolved.stateCode || '');
        setSelectedStateName(resolved.state);

        // Fetch districts for state
        const dists = await fetchDistricts(resolved.countryCode || 'IN', resolved.stateCode || '', resolved.state);
        setDistrictsList(dists);
      }

      if (resolved.district) {
        setSelectedDistrictCode(resolved.districtCode || '');
        setSelectedDistrictName(resolved.district);
      }

      if (resolved.city) {
        setCityInput(resolved.city);
      }

      setGpsStatusMessage(
        isHi
          ? `📍 स्थान प्राप्त: ${resolved.city || resolved.district || ''}, ${resolved.state || ''}, ${resolved.country}`
          : `📍 Location Detected: ${resolved.city || resolved.district || ''}, ${resolved.state || ''}, ${resolved.country}`
      );
    } catch (err: any) {
      const geoErr = err as GeolocationError;
      setGpsPermissionGranted(false);
      setGpsStatusMessage(
        geoErr?.instruction ||
          geoErr?.message ||
          (isHi
            ? 'GPS अनुमति अस्वीकृत या अनुपलब्ध। आप नीचे सूची से अपना देश, राज्य और जिला चुन सकते हैं।'
            : 'Location permission declined or unavailable. You can easily pick your country, region, and district manually.')
      );
    } finally {
      setGpsLoading(false);
    }
  };

  // Location-based intelligence toggle state
  const [enableLocationBasedHealthIntelligence, setEnableLocationBasedHealthIntelligence] = useState<boolean>(true);

  // =========================================================================
  // STEP 4: FOOD & NUTRITION PREFERENCES STATE (CLEAN EMPTY INITIAL)
  // =========================================================================
  const [dietaryPreference, setDietaryPreference] = useState<'vegetarian' | 'non_vegetarian' | 'eggetarian' | 'vegan' | 'other'>('vegetarian');
  const [foodAllergies, setFoodAllergies] = useState<string[]>([]);
  const [allergyInputText, setAllergyInputText] = useState('');
  const [avoidedFoods, setAvoidedFoods] = useState<string[]>([]);
  const [avoidedInputText, setAvoidedInputText] = useState('');
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>(['South Indian', 'North Indian']);
  const [cuisineInputText, setCuisineInputText] = useState('');
  const [preferredIngredients, setPreferredIngredients] = useState<string[]>([]);
  const [preferredIngInput, setPreferredIngInput] = useState('');
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [dislikedInputText, setDislikedInputText] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState<number>(4);
  const [mealTimingsNote, setMealTimingsNote] = useState('Breakfast 8:00 AM, Lunch 1:00 PM, Snack 4:30 PM, Dinner 8:00 PM');
  const [culturalReligiousRestrictions, setCulturalReligiousRestrictions] = useState<string[]>([]);
  const [culturalInputText, setCulturalInputText] = useState('');
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'premium'>('moderate');

  // =========================================================================
  // STEP 5: PREGNANCY & MATERNAL HEALTH STATE (CLEAN EMPTY INITIAL)
  // =========================================================================
  const [situation, setSituation] = useState<'pregnant' | 'delivered' | 'planning' | 'other'>('pregnant');
  const [lmpDate, setLmpDate] = useState('');
  const [pregnancyType, setPregnancyType] = useState<'singleton' | 'twins'>('singleton');
  const [previousPregnancies, setPreviousPregnancies] = useState<number | ''>('');

  // =========================================================================
  // STEP 6: CHILDREN (CLEAN EMPTY INITIAL)
  // =========================================================================
  const [hasExistingChildren, setHasExistingChildren] = useState<'yes' | 'no'>('no');
  const [addChildrenNow, setAddChildrenNow] = useState<'yes' | 'later'>('later');
  const [childrenList, setChildrenList] = useState<Array<Omit<BabyProfile, 'id'>>>([]);

  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');
  const [childGender, setChildGender] = useState<'boy' | 'girl'>('boy');
  const [childWeight, setChildWeight] = useState<string>('');
  const [childLength, setChildLength] = useState<string>('');
  const [childPreterm, setChildPreterm] = useState(false);
  const [childGestWeeks, setChildGestWeeks] = useState<string>('');

  // Request OTP for Step 2
  const handleSendOtp = () => {
    const id = email || phone;
    if (!id.trim()) {
      setErrorMsg(isHi ? 'कृपया पहले ईमेल या मोबाइल नंबर दर्ज करें' : 'Please enter your email or phone first');
      return;
    }
    setErrorMsg('');
    const res = requestOtpVerification(id);
    setOtpSent(true);
    setOtpNotice(res.message);
  };

  // Verify OTP for Step 2
  const handleVerifyOtp = () => {
    const id = email || phone;
    if (!otpCode.trim()) {
      setErrorMsg(isHi ? 'कृपया 6-अंकीय ओटीपी दर्ज करें' : 'Please enter the 6-digit verification code');
      return;
    }
    const valid = verifyOtpCode(id, otpCode);
    if (valid) {
      setOtpVerified(true);
      setErrorMsg('');
    } else {
      setErrorMsg(isHi ? 'अमान्य ओटीपी कोड। परीक्षण कोड: 123456' : 'Invalid OTP code. Use test code 123456');
    }
  };

  // Step 2 Validation & Proceed
  const handleNextStep2 = () => {
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg(isHi ? 'कृपया कम से कम एक ईमेल या मोबाइल नंबर दर्ज करें' : 'Please provide either an email or mobile number');
      return;
    }
    if (password.length < 8) {
      setErrorMsg(isHi ? 'पासवर्ड में कम से कम 8 अक्षर होने चाहिए' : 'Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(isHi ? 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg(isHi ? 'कृपया नियम और शर्तें स्वीकार करें' : 'Please accept the Terms of Service & Privacy Policy');
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Validation & Proceed (Location -> Food Preferences)
  const handleNextStep3 = () => {
    setErrorMsg('');
    if (!selectedCountryCode && !selectedCountryName) {
      setErrorMsg(isHi ? 'कृपया अपना देश चुनें' : 'Please select your country');
      return;
    }
    setCurrentStep(4);
  };

  // Step 4 Validation & Proceed (Food Preferences -> Pregnancy)
  const handleNextStep4 = () => {
    setErrorMsg('');
    if (!dietaryPreference) {
      setErrorMsg(isHi ? 'कृपया अपना मुख्य आहार प्रकार चुनें' : 'Please select your primary diet type');
      return;
    }
    setCurrentStep(5);
  };

  // Step 5 Validation & Proceed (Pregnancy -> Children)
  const handleNextStep5 = () => {
    setErrorMsg('');
    setCurrentStep(6);
  };

  // Step 6: Add child to list
  const handleAddChildToList = () => {
    if (!childName.trim()) return;
    const newChild: Omit<BabyProfile, 'id'> = {
      name: childName.trim(),
      gender: childGender,
      birthDate: childDob || new Date().toISOString().split('T')[0],
      birthWeightKg: childWeight ? parseFloat(childWeight) : 3.0,
      birthLengthCm: childLength ? parseFloat(childLength) : 49.0,
      isPremature: childPreterm,
      gestationalAgeWeeksAtBirth: childGestWeeks ? parseInt(childGestWeeks, 10) : childPreterm ? 34 : 39,
      bloodGroup: '',
      pediatricianName: '',
      pediatricianPhone: '',
      medicalConditions: [],
      allergies: [],
      currentMedications: [],
      feedingMethod: 'exclusive_breastfeeding',
      householdCircumstances: {
        dietaryPattern: dietaryPreference,
        drinkingWaterSource: 'Purified water',
        indoorSmokeExposure: false,
        smokingInHousehold: false,
      },
    };
    setChildrenList(prev => [...prev, newChild]);
    setChildName('');
    setChildDob('');
    setChildWeight('');
    setChildLength('');
    setChildPreterm(false);
    setChildGestWeeks('');
  };

  // Step 7: Complete Registration & Save Clean Partition
  const handleCompleteRegistration = async () => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await signup({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        preferredLanguage: selectedLanguageCode,
        dateOfBirth: dob,
        country: selectedCountryName,
        country_code: selectedCountryCode,
        country_name: selectedCountryName,
        state: selectedStateName,
        state_region_code: selectedStateCode,
        state_region_name: selectedStateName,
        district: selectedDistrictName,
        district_code: selectedDistrictCode,
        district_name: selectedDistrictName,
        city: cityInput || selectedDistrictName || selectedStateName,
        latitude: detectedCoords.lat,
        longitude: detectedCoords.lng,
        gpsPermissionGranted,
        enableLocationBasedHealthIntelligence,
        bloodGroup: bloodGroup,
        preExistingConditions,
        allergies,
        currentMeds,
        nutritionProfile: {
          dietaryPreference,
          foodAllergies,
          avoidedFoods,
          favoriteCuisines,
          preferredIngredients,
          dislikedFoods,
          mealsPerDay,
          mealTimingsNote,
          culturalReligiousRestrictions,
          budgetLevel,
          waterIntakeLiters: 3.0,
        },
        situation,
        lmpDate: situation === 'pregnant' ? lmpDate : undefined,
        pregnancyType,
        children: childrenList,
      });

      if (!res.success) {
        setErrorMsg(res.error || (isHi ? 'पंजीकरण विफल रहा' : 'Registration failed'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-purple-50/30 to-[#FDFBF7] py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full bg-white border border-[#E5DFD3] rounded-3xl shadow-xl overflow-hidden flex flex-col">
        {/* Progress Bar & Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 text-white flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <button
              type="button"
              onClick={onBackToWelcome}
              className="hover:text-white transition-all flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHi ? 'मुख्य पृष्ठ पर वापस' : 'Back to Welcome'}</span>
            </button>
            <span className="font-extrabold uppercase tracking-wider text-[11px] bg-white/15 px-3 py-0.5 rounded-full">
              {isHi ? `चरण ${currentStep} / ७` : `Step ${currentStep} of 7`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentStep === 1 && (isHi ? 'अपनी पसंदीदा भाषा चुनें' : 'Choose Your Preferred Language')}
                {currentStep === 2 && (isHi ? 'सुरक्षित खाता बनाएं' : 'Create Your Account')}
                {currentStep === 3 && (isHi ? 'स्थान एवं पर्यावरणीय स्वास्थ्य बुद्धिमत्ता' : 'Location & Environmental Health')}
                {currentStep === 4 && (isHi ? 'आहार एवं पोषण प्राथमिकताएं' : 'Food & Nutrition Preferences')}
                {currentStep === 5 && (isHi ? 'मातृत्व एवं गर्भावस्था विवरण' : 'Pregnancy & Maternal Details')}
                {currentStep === 6 && (isHi ? 'मौजूदा बच्चे एवं परिवार' : 'Family & Children Details')}
                {currentStep === 7 && (isHi ? 'समीक्षा एवं पुष्टि' : 'Review & Confirm')}
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">
                {currentStep === 1 && (isHi ? 'विश्व भर की समर्थित भाषाओं में से चयन करें।' : 'Select from 40+ supported languages worldwide.')}
                {currentStep === 2 && (isHi ? 'आपका व्यक्तिगत सुरक्षित स्वास्थ्य खाता।' : 'Your encrypted, private maternal account.')}
                {currentStep === 3 && (isHi ? 'स्थानीय पर्यावरण और व्यक्तिगत स्वास्थ्य का समन्वय।' : 'Local climate, air quality & clinical profile.')}
                {currentStep === 4 && (isHi ? 'आहार प्रकार, एलर्जी, पसंदीदा व्यंजन एवं भोजन का समय।' : 'Diet type, allergies, regional produce & meal schedule.')}
                {currentStep === 5 && (isHi ? 'गर्भ सप्ताह और प्रसवपूर्व स्वास्थ्य देखभाल।' : 'Clinical stage, ultrasound & physiological markers.')}
                {currentStep === 6 && (isHi ? 'शिशु का विकास एवं राष्ट्रीय टीकाकरण।' : 'Pediatric growth metrics & vaccination schedule.')}
                {currentStep === 7 && (isHi ? 'सत्यापित करें और अपना मुमोरा डैशबोर्ड शुरू करें।' : 'Verify isolated account parameters and launch.')}
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {[1, 2, 3, 4, 5, 6, 7].map(st => (
              <div
                key={st}
                className={`h-1.5 rounded-full transition-all ${
                  st <= currentStep ? 'bg-amber-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: CHOOSE PREFERRED LANGUAGE                                         */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={e => setLangSearch(e.target.value)}
                  placeholder={
                    t.common?.searchLanguagePlaceholder ||
                    'Search language or script (e.g. English, Español, हिन्दी, العربية)...'
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-purple-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto p-1">
                {filteredLanguages.map(item => {
                  const isSelected = selectedLanguageCode === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelectLanguage(item.code)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-600/20 shadow-xs'
                          : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{item.flag}</span>
                        {isSelected && <Check className="w-4 h-4 text-purple-700" />}
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-black text-slate-900 block leading-tight">
                          {item.nativeName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-xs text-purple-700 font-bold hover:underline"
                >
                  {isHi ? 'पहले से खाता है? लॉगिन करें' : 'Already have an account? Sign in'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>{t.common?.continueInLanguage || 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: ACCOUNT CREDENTIALS                                               */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="font-black text-slate-700 block mb-1">
                    {isHi ? 'माता / प्राथमिक उपयोगकर्ता का पूरा नाम *' : 'Mother / Primary User Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={isHi ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-purple-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'ईमेल पता *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-purple-600"
                    />
                  </div>
                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-purple-600"
                    />
                  </div>
                </div>

                {/* OTP Box */}
                <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                      <span>{isHi ? 'ओटीपी सत्यापन' : 'Identity Verification (OTP)'}</span>
                    </span>
                    {otpVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isHi ? 'सत्यापित' : 'Verified'}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-purple-700 hover:text-purple-900 font-extrabold text-[11px] underline"
                      >
                        {otpSent ? (isHi ? 'पुनः भेजें' : 'Resend Code') : (isHi ? 'ओटीपी प्राप्त करें' : 'Send Verification OTP')}
                      </button>
                    )}
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="space-y-2 pt-1">
                      {otpNotice && <p className="text-[10px] text-purple-800">{otpNotice}</p>}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="flex-1 px-3 py-1.5 border border-purple-300 rounded-lg text-center font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-3 py-1.5 bg-purple-700 text-white rounded-lg font-bold"
                        >
                          {isHi ? 'सत्यापित करें' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'पासवर्ड (न्यूनतम 8 अक्षर) *' : 'Password (min 8 chars) *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-9 py-2.5 border border-slate-200 rounded-xl focus:outline-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'पासवर्ड की पुष्टि करें *' : 'Confirm Password *'}
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-purple-600"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-purple-700"
                  />
                  <span className="text-[11px] text-slate-600 leading-relaxed">
                    {isHi
                      ? 'मैं मुमोरा के नियम और शर्तों और गोपनीयता नीति से सहमत हूँ, और अपने स्वास्थ्य डेटा के सुरक्षित प्रसंस्करण की सहमति देती हूँ।'
                      : 'I accept Mumora’s Terms of Service and Privacy Policy, and consent to the secure processing of my health data in compliance with DPDPA 2023.'}
                  </span>
                </label>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  {isHi ? 'पिछला' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isHi ? 'अगला: स्थान एवं प्रोफाइल' : 'Continue to Location'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: LOCATION & ENVIRONMENTAL EXPLANATION & CASCADING SELECTORS       */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-5 text-xs">
              {/* TRANSPARENT EXPLANATION BANNER */}
              <div className="p-4 bg-[#F2F7F4] border border-[#C5DDCF] rounded-2xl text-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-[#1E3A2B] font-black text-xs sm:text-sm">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>
                    {isHi
                      ? 'मुमोरा लोकेशन क्यों मांगता है? (पर्यावरणीय स्वास्थ्य बुद्धिमत्ता)'
                      : 'Why Mumora Requests Location Access (Environmental Health Intelligence)'}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  {isHi
                    ? 'मुमोरा आपके स्थानीय वायु प्रदूषण (PM2.5/PM10), तापमान, हीट इंडेक्स और आर्द्रता को आपके गर्भ सप्ताह और स्वास्थ्य प्रोफाइल से जोड़कर WHO दिशानिर्देशों के अनुसार सटीक जलपान, विश्राम और सावधानियों की सलाह देता है। यदि आप GPS अनुमति नहीं देना चाहती हैं, तो आप नीचे ड्रॉपडाउन से देश, राज्य और जिला स्वयं चुन सकती हैं।'
                    : 'Mumora combines your local ambient temperature, heat index, and fine airborne pollutants (PM2.5 / PM10) with your gestation week and medical history to provide evidence-based hydration, heat stress, and respiratory precautions based on verified WHO guidelines. If location access is not granted, you can select your country, region, and district manually.'}
                </p>

                {/* GPS Trigger Button */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDetectDeviceLocation}
                    disabled={gpsLoading}
                    className="px-4 py-2 bg-[#2D5A3C] hover:bg-[#1E3A2B] text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Navigation className={`w-3.5 h-3.5 text-amber-300 ${gpsLoading ? 'animate-pulse' : ''}`} />
                    <span>{gpsLoading ? (isHi ? 'लोकेशन खोजी जा रही है...' : 'Detecting GPS...') : (isHi ? 'मेरी वर्तमान लोकेशन प्राप्त करें 📍' : 'Use My Current Location 📍')}</span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    {isHi ? 'वैकल्पिक: एकल-टैप स्वचालित पहचान' : 'Optional: Single-tap auto-detection'}
                  </span>
                </div>

                {gpsStatusMessage && (
                  <div className="p-2.5 bg-white/80 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 font-medium">
                    {gpsStatusMessage}
                  </div>
                )}

                {/* EXPLICIT TOGGLE FOR LOCATION-BASED HEALTH INTELLIGENCE */}
                <div className="mt-3 p-3 bg-white/95 border border-emerald-300 rounded-xl flex items-start gap-3 shadow-2xs">
                  <input
                    type="checkbox"
                    id="enableLocationIntel"
                    checked={enableLocationBasedHealthIntelligence}
                    onChange={e => setEnableLocationBasedHealthIntelligence(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-emerald-700 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="enableLocationIntel" className="cursor-pointer space-y-0.5 text-left">
                    <span className="font-extrabold text-emerald-950 block text-xs">
                      {isHi ? '✓ स्थान-आधारित स्वास्थ्य बुद्धिमत्ता सक्षम करें (Enable Location-Based Health Intelligence)' : 'Enable Location-Based Health Intelligence'}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isHi
                        ? 'मुमोरा को अपने स्थानीय परिवेश (तापमान, हीट इंडेक्स, AQI और आर्द्रता) को आपके स्वास्थ्य प्रोफाइल एवं WHO दिशानिर्देशों से जोड़कर पोषण, जलयोजन और सावधानियों को वैयक्तिकृत करने की अनुमति दें। इसे बाद में सेटिंग्स में कभी भी बदला जा सकता है।'
                        : 'Allows Mumora to correlate local ambient temperature, heat stress, humidity, and fine particulate pollution (PM2.5/AQI) with your clinical profile and WHO guidelines to personalize hydration, outdoor activity, and nutrition. You can change this anytime in Profile Settings.'}
                    </p>
                  </label>
                </div>
              </div>

              {/* CASCADING SEARCHABLE DROPDOWNS: Country -> State -> District */}
              <div className="space-y-3.5">
                {/* 1. Country Selector */}
                <div>
                  <SearchableGeoSelect
                    label={isHi ? 'देश (Country) *' : 'Country *'}
                    required
                    placeholder={isHi ? 'देश खोजें एवं चुनें...' : 'Search and select country...'}
                    searchPlaceholder={isHi ? 'देश का नाम लिखें...' : 'Type country name...'}
                    items={countriesList.map(c => ({
                      code: c.code,
                      name: c.name,
                      flag: c.flag,
                      subtext: c.subdivisionType,
                    }))}
                    selectedCode={selectedCountryCode}
                    selectedName={selectedCountryName}
                    onSelect={item => handleCountrySelect(item.code, item.name)}
                    onClear={() => handleCountrySelect('', '')}
                    isLoading={loadingCountries}
                    isHi={isHi}
                  />
                </div>

                {/* 2. State / Province / Region Selector */}
                <div>
                  <SearchableGeoSelect
                    label={isHi ? 'राज्य / प्रांत / क्षेत्र (State / Region)' : 'State / Province / Region'}
                    placeholder={
                      !selectedCountryCode
                        ? isHi
                          ? 'पहले देश चुनें...'
                          : 'Select country first...'
                        : isHi
                        ? 'राज्य या क्षेत्र चुनें...'
                        : 'Select state or region...'
                    }
                    searchPlaceholder={isHi ? 'राज्य खोजें...' : 'Search state or province...'}
                    items={statesList.map(s => ({
                      code: s.code,
                      name: s.name,
                      subtext: s.type,
                    }))}
                    selectedCode={selectedStateCode}
                    selectedName={selectedStateName}
                    onSelect={item => handleStateSelect(item.code, item.name)}
                    onClear={() => handleStateSelect('', '')}
                    disabled={!selectedCountryCode}
                    disabledMessage={isHi ? 'कृपया पहले देश का चयन करें' : 'Please select country first'}
                    isLoading={loadingStates}
                    allowCustomInput
                    isHi={isHi}
                  />
                </div>

                {/* 3. District / County / Local Administrative Area */}
                <div>
                  <SearchableGeoSelect
                    label={isHi ? 'जिला / काउंटी / स्थानीय क्षेत्र (District / Area)' : 'District / County / Local Area'}
                    placeholder={
                      !selectedStateName
                        ? isHi
                          ? 'पहले राज्य चुनें...'
                          : 'Select state first...'
                        : isHi
                        ? 'जिला खोजें या चुनें...'
                        : 'Select district or local area...'
                    }
                    searchPlaceholder={isHi ? 'जिला खोजें...' : 'Search district...'}
                    items={districtsList.map(d => ({
                      code: d.code,
                      name: d.name,
                    }))}
                    selectedCode={selectedDistrictCode}
                    selectedName={selectedDistrictName}
                    onSelect={item => handleDistrictSelect(item.code, item.name)}
                    onClear={() => handleDistrictSelect('', '')}
                    disabled={!selectedStateName && !selectedCountryCode}
                    disabledMessage={isHi ? 'कृपया पहले राज्य या देश चुनें' : 'Please select state first'}
                    isLoading={loadingDistricts}
                    allowCustomInput
                    isHi={isHi}
                  />
                </div>

                {/* Personal Clinical Fields: DOB & Blood Group (CLEAN EMPTY INITIAL) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'जन्म तिथि (वैकल्पिक)' : 'Date of Birth (Optional)'}
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-purple-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'रक्त समूह (Blood Group)' : 'Blood Group (Optional)'}
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-purple-600 text-xs"
                    >
                      <option value="">{isHi ? '-- रक्त समूह चुनें --' : '-- Select Blood Group --'}</option>
                      <option value="A Positive (A+)">A Positive (A+)</option>
                      <option value="A Negative (A-)">A Negative (A-)</option>
                      <option value="B Positive (B+)">B Positive (B+)</option>
                      <option value="B Negative (B-)">B Negative (B-)</option>
                      <option value="O Positive (O+)">O Positive (O+)</option>
                      <option value="O Negative (O-)">O Negative (O-)</option>
                      <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                      <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                      <option value="Unknown / Not Tested">{isHi ? 'अज्ञात / परीक्षण नहीं हुआ' : 'Unknown / Not Tested'}</option>
                    </select>
                  </div>
                </div>

                {/* Pre-existing Conditions */}
                <div>
                  <label className="font-black text-slate-700 block mb-1">
                    {isHi ? 'मौजूदा स्वास्थ्य स्थितियां (वैकल्पिक)' : 'Pre-Existing Health Conditions (Optional)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={conditionInput}
                      onChange={e => setConditionInput(e.target.value)}
                      placeholder={isHi ? 'उदा. थायराइड, अस्थमा, उच्च रक्तचाप' : 'e.g. Asthma, Gestational Diabetes, Thyroid'}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (conditionInput.trim()) {
                          setPreExistingConditions([...preExistingConditions, conditionInput.trim()]);
                          setConditionInput('');
                        }
                      }}
                      className="px-3.5 py-2 bg-purple-100 text-purple-900 rounded-xl font-bold"
                    >
                      {isHi ? 'जोड़ें' : 'Add'}
                    </button>
                  </div>
                  {preExistingConditions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {preExistingConditions.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg text-[11px] font-semibold">
                          <span>{c}</span>
                          <button
                            type="button"
                            onClick={() => setPreExistingConditions(preExistingConditions.filter((_, idx) => idx !== i))}
                            className="text-purple-400 hover:text-purple-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  {isHi ? 'पिछला' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNextStep3}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isHi ? 'आगे बढ़ें: आहार एवं पोषण' : 'Continue to Food Preferences'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: FOOD & NUTRITION PREFERENCES (REQUIRED ONBOARDING SECTION)         */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-5 text-xs">
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                <Apple className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-amber-950 block text-xs">
                    {isHi ? 'स्थान व मौसम के अनुसार व्यक्तिगत पोषण' : 'Climate & Location-Aware Personalized Nutrition'}
                  </span>
                  <p className="text-[11px] text-amber-900/80 leading-relaxed">
                    {isHi
                      ? 'मुमोरा आपके चुने हुए स्थान, स्थानीय मौसमी उपज, तापमान और गर्भावस्था चरण के अनुसार सुरक्षित एवं पौष्टिक भोजन योजना तैयार करता है।'
                      : 'Mumora tailors safe, nutrient-dense daily meals using your local region, seasonal produce availability, and ambient climate indicators.'}
                  </p>
                </div>
              </div>

              {/* 1. Dietary Type Selection */}
              <div>
                <label className="font-black text-slate-800 block mb-2">
                  {isHi ? '१. मुख्य आहार प्रकार (Diet Type) *' : '1. Primary Diet Type *'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'vegetarian', label: isHi ? 'शाकाहारी (Vegetarian)' : 'Vegetarian' },
                    { id: 'non_vegetarian', label: isHi ? 'मांसाहारी (Non-Veg)' : 'Non-Vegetarian' },
                    { id: 'eggetarian', label: isHi ? 'अंडा-शाकाहारी (Eggetarian)' : 'Eggetarian' },
                    { id: 'vegan', label: isHi ? 'वीगन (Vegan)' : 'Vegan' },
                    { id: 'other', label: isHi ? 'अन्य (Other)' : 'Other' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDietaryPreference(opt.id as any)}
                      className={`py-2.5 px-3 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
                        dietaryPreference === opt.id
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-xs">{opt.label}</span>
                      {dietaryPreference === opt.id && <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Food Allergies & Intolerances */}
              <div>
                <label className="font-black text-slate-800 block mb-1">
                  {isHi ? '२. खाद्य एलर्जी और असहिष्णुता (Allergies & Intolerances)' : '2. Food Allergies & Intolerances (Optional)'}
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  {isHi ? 'सामान्य एलर्जी पर टैप करें या नई जोड़ें:' : 'Tap common allergens or add custom ones:'}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Peanuts',
                    'Tree nuts',
                    'Cow Milk / Dairy',
                    'Gluten / Wheat',
                    'Eggs',
                    'Shellfish / Fish',
                    'Soy',
                    'Mustard',
                  ].map(item => {
                    const isSelected = foodAllergies.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setFoodAllergies(foodAllergies.filter(a => a !== item));
                          } else {
                            setFoodAllergies([...foodAllergies, item]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-red-50 border-red-300 text-red-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✕ ' : '+ '} {item}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={allergyInputText}
                    onChange={e => setAllergyInputText(e.target.value)}
                    placeholder={isHi ? 'अन्य एलर्जी लिखें (उदा. तिल, बैंगन)' : 'Type other allergy (e.g., Sesame, Brinjal)'}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (allergyInputText.trim() && !foodAllergies.includes(allergyInputText.trim())) {
                        setFoodAllergies([...foodAllergies, allergyInputText.trim()]);
                        setAllergyInputText('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    {isHi ? 'जोड़ें' : 'Add'}
                  </button>
                </div>
              </div>

              {/* 3. Foods Avoided (Pregnancy & Personal) */}
              <div>
                <label className="font-black text-slate-800 block mb-1">
                  {isHi ? '३. छोड़े जाने वाले खाद्य पदार्थ (Foods Avoided / Excluded)' : '3. Foods You Avoid (Optional)'}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={avoidedInputText}
                    onChange={e => setAvoidedInputText(e.target.value)}
                    placeholder={isHi ? 'उदा. कच्चा पपीता, ज्यादा चाय/कॉफी, अत्यधिक तला हुआ' : 'e.g., Raw papaya, High caffeine, Deep-fried items'}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (avoidedInputText.trim() && !avoidedFoods.includes(avoidedInputText.trim())) {
                        setAvoidedFoods([...avoidedFoods, avoidedInputText.trim()]);
                        setAvoidedInputText('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    {isHi ? 'जोड़ें' : 'Add'}
                  </button>
                </div>
                {avoidedFoods.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {avoidedFoods.map((f, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-lg text-[11px] font-semibold border border-amber-200">
                        <span>{f}</span>
                        <button type="button" onClick={() => setAvoidedFoods(avoidedFoods.filter((_, i) => i !== idx))} className="text-amber-500 hover:text-amber-900">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Preferred Cuisines & Ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-800 block mb-1">
                    {isHi ? '४. पसंदीदा व्यंजन शैली (Cuisines)' : '4. Favorite Cuisines'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Maharashtrian', 'Continental', 'East Asian', 'Mediterranean'].map(cuisine => {
                      const active = favoriteCuisines.includes(cuisine);
                      return (
                        <button
                          key={cuisine}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setFavoriteCuisines(favoriteCuisines.filter(c => c !== cuisine));
                            } else {
                              setFavoriteCuisines([...favoriteCuisines, cuisine]);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-all ${
                            active
                              ? 'bg-purple-100 border-purple-300 text-purple-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {cuisine}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">
                    {isHi ? '५. भोजन का प्रारूप (Meal Pattern)' : '5. Daily Meal Pattern'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {[
                      { num: 3, label: isHi ? '३ मुख्य भोजन' : '3 Meals' },
                      { num: 4, label: isHi ? '३ भोजन + १ स्नैक' : '3 Meals + 1 Snack' },
                      { num: 5, label: isHi ? '३ भोजन + २ स्नैक' : '3 Meals + 2 Snacks' },
                    ].map(pat => (
                      <button
                        key={pat.num}
                        type="button"
                        onClick={() => setMealsPerDay(pat.num)}
                        className={`py-1.5 px-2 rounded-lg border text-center font-bold text-[11px] ${
                          mealsPerDay === pat.num
                            ? 'border-purple-600 bg-purple-50 text-purple-900'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {pat.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={mealTimingsNote}
                    onChange={e => setMealTimingsNote(e.target.value)}
                    placeholder="e.g. Breakfast 8am, Lunch 1pm, Snack 4:30pm, Dinner 8pm"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px]"
                  />
                </div>
              </div>

              {/* 5. Cultural/Religious Dietary Practice & Budget Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-black text-slate-800 block mb-1">
                    {isHi ? '६. सांस्कृतिक / धार्मिक प्राथमिकता (वैकल्पिक)' : '6. Cultural / Religious Dietary (Optional)'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Halal', 'Kosher', 'Jain / Sattvic', 'Hindu Fasting Rules', 'No Restrictions'].map(crit => {
                      const sel = culturalReligiousRestrictions.includes(crit);
                      return (
                        <button
                          key={crit}
                          type="button"
                          onClick={() => {
                            if (crit === 'No Restrictions') {
                              setCulturalReligiousRestrictions([]);
                              return;
                            }
                            if (sel) {
                              setCulturalReligiousRestrictions(culturalReligiousRestrictions.filter(c => c !== crit));
                            } else {
                              setCulturalReligiousRestrictions([...culturalReligiousRestrictions.filter(c => c !== 'No Restrictions'), crit]);
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-all ${
                            sel
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {crit}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">
                    {isHi ? '७. स्थानीय उपलब्धता व बजट (Budget Level)' : '7. Budget & Local Produce Priority'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'budget', label: isHi ? 'किफायती मौसमी' : 'Affordable Seasonal' },
                      { id: 'moderate', label: isHi ? 'संतुलित मानक' : 'Moderate Balanced' },
                      { id: 'premium', label: isHi ? 'प्रीमियम जैविक' : 'Premium Organic' },
                    ].map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudgetLevel(b.id as any)}
                        className={`py-1.5 px-2 rounded-lg border text-center font-bold text-[10.5px] ${
                          budgetLevel === b.id
                            ? 'border-purple-600 bg-purple-50 text-purple-900'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  {isHi ? 'पिछला' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNextStep4}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isHi ? 'आगे बढ़ें: मातृत्व विवरण' : 'Continue to Pregnancy'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: PREGNANCY DETAILS                                                 */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'pregnant', label: isHi ? 'वर्तमान में गर्भवती' : 'Currently Pregnant' },
                  { id: 'delivered', label: isHi ? 'शिशु का जन्म हो चुका है' : 'Already Delivered / New Mother' },
                  { id: 'planning', label: isHi ? 'गर्भावस्था की योजना' : 'Planning Pregnancy' },
                  { id: 'other', label: isHi ? 'अन्य स्थिति' : 'Other / General Care' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSituation(opt.id as any)}
                    className={`p-3.5 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                      situation === opt.id
                        ? 'border-purple-600 bg-purple-50/70 text-purple-950 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {situation === opt.id && <Check className="w-4 h-4 text-purple-700" />}
                  </button>
                ))}
              </div>

              {situation === 'pregnant' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'अंतिम मासिक धर्म की तिथि (LMP Date)' : 'Last Menstrual Period (LMP Date)'}
                    </label>
                    <input
                      type="date"
                      value={lmpDate}
                      onChange={e => setLmpDate(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isHi
                        ? 'LMP से आपके गर्भावस्था सप्ताह और अनुमानित प्रसव तिथि (EDD) की स्वतः गणना होती है।'
                        : 'Calculates your clinical gestational week and Estimated Due Date (EDD).'}
                    </p>
                  </div>

                  <div>
                    <label className="font-black text-slate-700 block mb-1">
                      {isHi ? 'गर्भावस्था का प्रकार' : 'Pregnancy Type'}
                    </label>
                    <select
                      value={pregnancyType}
                      onChange={e => setPregnancyType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    >
                      <option value="singleton">{isHi ? 'एकल शिशु (Singleton)' : 'Singleton (One baby)'}</option>
                      <option value="twins">{isHi ? 'जुड़वां (Twins / Multiple)' : 'Twins / Multiple'}</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  {isHi ? 'पिछला' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNextStep5}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isHi ? 'आगे बढ़ें: बच्चे' : 'Continue to Children'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: EXISTING CHILDREN                                                 */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">
                  {isHi ? 'क्या आपके पहले से बच्चे हैं?' : 'Do you have existing children?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasExistingChildren('yes')}
                    className={`py-2 px-3 rounded-xl border font-bold text-center ${
                      hasExistingChildren === 'yes'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {isHi ? 'हाँ' : 'Yes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasExistingChildren('no');
                      setChildrenList([]);
                    }}
                    className={`py-2 px-3 rounded-xl border font-bold text-center ${
                      hasExistingChildren === 'no'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {isHi ? 'नहीं' : 'No'}
                  </button>
                </div>
              </div>

              {hasExistingChildren === 'yes' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <span className="font-black text-slate-800 block">
                    {isHi ? '+ बच्चे की जानकारी जोड़ें' : '+ Add Child Information'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={childName}
                      onChange={e => setChildName(e.target.value)}
                      placeholder={isHi ? 'बच्चे का नाम' : "Child's Name"}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="date"
                      value={childDob}
                      onChange={e => setChildDob(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={childGender}
                      onChange={e => setChildGender(e.target.value as any)}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="boy">{isHi ? 'बालक (Boy)' : 'Boy'}</option>
                      <option value="girl">{isHi ? 'बालिका (Girl)' : 'Girl'}</option>
                    </select>
                    <input
                      type="number"
                      step="0.05"
                      value={childWeight}
                      onChange={e => setChildWeight(e.target.value)}
                      placeholder={isHi ? 'वजन (किग्रा)' : 'Weight kg'}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={childLength}
                      onChange={e => setChildLength(e.target.value)}
                      placeholder={isHi ? 'लंबाई (सेमी)' : 'Length cm'}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddChildToList}
                    disabled={!childName.trim()}
                    className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg font-bold text-xs disabled:opacity-40"
                  >
                    {isHi ? '+ बच्चे को सूची में जोड़ें' : '+ Save Child to Profile'}
                  </button>

                  {childrenList.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="font-bold text-slate-700 block">
                        {isHi ? 'पंजीकृत बच्चे:' : 'Children in list:'}
                      </span>
                      {childrenList.map((ch, idx) => (
                        <div key={idx} className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                          <span>
                            <strong>{ch.name}</strong> ({ch.gender}, {ch.birthDate})
                          </span>
                          <button
                            type="button"
                            onClick={() => setChildrenList(childrenList.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  {isHi ? 'पिछला' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isHi ? 'समीक्षा एवं पुष्टि' : 'Review & Confirm'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: REVIEW & COMPLETE                                                 */}
          {/* ========================================================================= */}
          {currentStep === 7 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-black text-slate-900 text-sm">{fullName}</span>
                  <span className="text-purple-700 font-bold">{selectedLanguageCode.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div><strong>{isHi ? 'ईमेल:' : 'Email:'}</strong> {email || 'N/A'}</div>
                  <div><strong>{isHi ? 'मोबाइल:' : 'Phone:'}</strong> {phone || 'N/A'}</div>
                  <div><strong>{isHi ? 'स्थान:' : 'Location:'}</strong> {[selectedDistrictName || cityInput, selectedStateName, selectedCountryName].filter(Boolean).join(', ') || 'Not specified'}</div>
                  <div><strong>{isHi ? 'रक्त समूह:' : 'Blood Group:'}</strong> {bloodGroup || 'Not specified'}</div>
                  <div>
                    <strong>{isHi ? 'पर्यावरणीय बुद्धिमत्ता:' : 'Environmental Intel:'}</strong>{' '}
                    <span className={enableLocationBasedHealthIntelligence ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                      {enableLocationBasedHealthIntelligence ? (isHi ? 'सक्षम (Active)' : 'Enabled') : (isHi ? 'अक्षम (Disabled)' : 'Disabled')}
                    </span>
                  </div>
                  <div>
                    <strong>{isHi ? 'आहार प्रकार:' : 'Diet Type:'}</strong>{' '}
                    <span className="capitalize font-bold text-purple-800">{dietaryPreference.replace('_', ' ')}</span>
                  </div>
                </div>

                {favoriteCuisines.length > 0 && (
                  <div className="text-[11px] text-slate-600">
                    <strong>{isHi ? 'पसंदीदा व्यंजन:' : 'Cuisines:'}</strong> {favoriteCuisines.join(', ')}
                  </div>
                )}

                {foodAllergies.length > 0 && (
                  <div className="text-[11px] text-red-700 font-medium">
                    <strong>{isHi ? 'एलर्जी / असहिष्णुता:' : 'Allergies:'}</strong> {foodAllergies.join(', ')}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{isHi ? 'मातृत्व यात्रा:' : 'Journey:'}</span>{' '}
                    <span className="capitalize">{situation}</span>
                  </div>
                  <span className="text-slate-500">
                    {childrenList.length > 0 ? `${childrenList.length} child(ren)` : 'No children added'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isHi
                    ? 'आपकी प्रोफ़ाइल पूर्णतः स्वच्छ, पृथक और एन्क्रिप्टेड है। कोई पुराना या अन्य उपयोगकर्ता डेटा मौजूद नहीं है।'
                    : 'Your account starts with a 100% clean, isolated health profile. Strictly no demo or leaked data.'}
                </span>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  {isHi ? 'पिछला' : 'Back'}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleCompleteRegistration}
                  className="px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl font-black text-sm flex items-center gap-2 shadow-md shadow-purple-900/10 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isHi ? 'पंजीकरण पूर्ण करें और ऐप खोलें' : 'Complete Registration & Launch Mumora'}</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
