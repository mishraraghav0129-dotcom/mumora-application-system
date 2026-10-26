import { LanguageItem } from '../types';

export const WORLD_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English', nativeName: 'English', origin: 'Americas & Europe', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', origin: 'South Asia', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', origin: 'South Asia', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', origin: 'South Asia', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', origin: 'South Asia', flag: '🇧🇩' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', origin: 'South Asia', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', origin: 'Americas & Europe', flag: '🇪🇸' },
];

export interface TranslationSchema {
  appName: string;
  tagline: string;
  nav: {
    pregnancy: string;
    baby: string;
    reminders: string;
    nutrition: string;
    environmental: string;
    familyHealth: string;
    aiAssistant: string;
    vault: string;
    postpartum: string;
    hospitals: string;
    adminBlueprint: string;
  };
  emergency: {
    call108: string;
    call102: string;
    title: string;
    subtitle: string;
    redFlags: string[];
    close: string;
    quickDial: string;
  };
  pregnancy: {
    weekTitle: string;
    trimester: string;
    daysToGo: string;
    dueDate: string;
    babySize: string;
    length: string;
    weight: string;
    vitalLogs: string;
    bpSystolic: string;
    bpDiastolic: string;
    currentWeight: string;
    bloodSugar: string;
    logVitalsBtn: string;
    kickCounter: string;
    kickCounterDesc: string;
    startKicks: string;
    recordKick: string;
    contractionTimer: string;
    contractionDesc: string;
    startContraction: string;
    stopContraction: string;
    hospitalBag: string;
    docQuestions: string;
    fetalUltrasoundVault: string;
    developmentMilestones: string;
  };
  baby: {
    profile: string;
    age: string;
    growthChart: string;
    feedingTracker: string;
    diaperTracker: string;
    sleepTracker: string;
    vaccinationCard: string;
    startNursingLeft: string;
    startNursingRight: string;
    formulaMl: string;
    logFeeding: string;
    wetDiaper: string;
    dirtyDiaper: string;
    mixedDiaper: string;
    logDiaper: string;
    logGrowth: string;
    weightKg: string;
    lengthCm: string;
    headCircumference: string;
    addBabyProfile: string;
    switchBaby: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    send: string;
    thinking: string;
    disclaimer: string;
    quickPrompts: string[];
  };
  records: {
    title: string;
    subtitle: string;
    uploadBtn: string;
    analyzeBtn: string;
    categoryAll: string;
    categoryUltrasound: string;
    categoryBlood: string;
    categoryPrescription: string;
    categoryVaccine: string;
    normal: string;
    abnormal: string;
    critical: string;
    clinicalSummary: string;
  };
  postpartum: {
    title: string;
    subtitle: string;
    lochiaTracker: string;
    epdsTitle: string;
    epdsDesc: string;
    takeEpds: string;
    pelvicFloor: string;
  };
  environmental: {
    title: string;
    coreHeadline: string;
    supportingTagline: string;
    generateReport: string;
    generatingReport: string;
    location: string;
    changeLocation: string;
    temperature: string;
    apparentTemp: string;
    humidity: string;
    airQuality: string;
    uvIndex: string;
    liveFreshness: string;
    unavailableTitle: string;
    unavailableDesc: string;
    retry: string;
    whoStandardNote: string;
    personalizedInsightTitle: string;
    viewFullReport: string;
    whyLocationTitle: string;
    whyLocationDesc: string;
    detectGpsBtn: string;
    manualSelectNotice: string;
  };
  reminders: {
    title: string;
    subtitle: string;
    clinical3DayRule: string;
    activeReminders: string;
    tdCalculator: string;
    customSettings: string;
    notificationHistory: string;
    addReminder: string;
    markCompleted: string;
    markPending: string;
    reschedule: string;
    remindLater: string;
    viewDetails: string;
    delete: string;
    whyMatters: string;
    doctorConfirmed: string;
    guidelineEstimate: string;
    emptyView: string;
    leadNoticeTitle: string;
  };
  nutrition: {
    title: string;
    subtitle: string;
    dietaryPref: string;
    vegetarian: string;
    eggetarian: string;
    nonVegetarian: string;
    vegan: string;
    currentLocation: string;
    changeLocation: string;
    regeneratePlan: string;
    adaptiveTitle: string;
    whyChanged: string;
    reportDate: string;
    groceryList: string;
    addGrocery: string;
    mealPlan: string;
    dishesDatabase: string;
    whoGuidance: string;
  };
  familyHealth: {
    title: string;
    subtitle: string;
    pedigreeTitle: string;
    pedigreeDesc: string;
    maternalHistory: string;
    paternalHistory: string;
    hereditaryRisks: string;
    riskAssessment: string;
    addRelative: string;
    consanguinity: string;
    carePlan: string;
  };
  auth: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    loginTitle: string;
    signupTitle: string;
    email: string;
    phone: string;
    password: string;
    name: string;
    dob: string;
    lmp: string;
    preferredLanguage: string;
    selectDiet: string;
    dietMandatoryNotice: string;
    loginBtn: string;
    signupBtn: string;
    createAccount: string;
    alreadyAccount: string;
    forgotPassword: string;
    logout: string;
    or: string;
  };
  admin: {
    title: string;
    subtitle: string;
    systemAudit: string;
    activeUsers: string;
    login: string;
    password: string;
    close: string;
    databaseStatus: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    view: string;
    edit: string;
    normal: string;
    attention: string;
    date: string;
    time: string;
    notes: string;
    completed: string;
    pending: string;
    language: string;
    chooseLanguage: string;
    continueInLanguage: string;
    searchLanguagePlaceholder: string;
    allOrigins: string;
    loading: string;
    error: string;
    success: string;
    refresh: string;
    back: string;
    next: string;
    submit: string;
    close: string;
    yes: string;
    no: string;
    or: string;
    and: string;
    details: string;
    verified: string;
    caution: string;
    mother: string;
    baby: string;
    all: string;
  };
}

export const EN_TRANSLATION: TranslationSchema = {
  appName: "Mumora",
  tagline: "Healthy Moms ♥ Brighter Tomorrows",
  nav: {
    pregnancy: "Pregnancy Track",
    baby: "Baby & Growth",
    reminders: "Vaccine Reminders",
    nutrition: "Daily Food Guide",
    environmental: "Environmental Health",
    familyHealth: "Family & Risk",
    aiAssistant: "Mumora AI Chat",
    vault: "Medical Records",
    postpartum: "Postpartum & Mood",
    hospitals: "Nearest Hospitals",
    adminBlueprint: "System Blueprint",
  },
  emergency: {
    call108: "Call 108 (Ambulance)",
    call102: "Call 102 (Janani Shishu)",
    title: "Obstetric & Pediatric Emergency Guidelines",
    subtitle: "If you observe warning signs, visit a hospital labor room immediately.",
    redFlags: [
      "Vaginal bleeding or brown spotting",
      "Decreased or absent fetal movements after 24-28 weeks",
      "Severe persistent headache with blurred vision or spots",
      "Sudden intense facial, hand, or ankle swelling",
      "Severe abdominal or upper right quadrant stomach pain",
      "Clear fluid leaking from the vagina (water breaking)",
      "High fever > 100.4°F (38°C) or severe chills",
      "For baby: High fever, breathing difficulty, grunting, blue lips"
    ],
    close: "Dismiss",
    quickDial: "Immediate Help"
  },
  pregnancy: {
    weekTitle: "Week of Pregnancy",
    trimester: "Trimester",
    daysToGo: "days remaining",
    dueDate: "Estimated Due Date (EDD)",
    babySize: "Baby is the size of a",
    length: "Length",
    weight: "Weight",
    vitalLogs: "Maternal Vitals & Logs",
    bpSystolic: "Systolic BP (mmHg)",
    bpDiastolic: "Diastolic BP (mmHg)",
    currentWeight: "Maternal Weight (kg)",
    bloodSugar: "Blood Sugar (mg/dL)",
    logVitalsBtn: "Log Today's Vitals",
    kickCounter: "Fetal Kick Counter",
    kickCounterDesc: "Target: 10 movements within 2 hours while resting on your left side.",
    startKicks: "Start Session",
    recordKick: "Tap for Kick (+1)",
    contractionTimer: "Labor Contraction Timer",
    contractionDesc: "Track duration and frequency. Follow the 5-1-1 rule.",
    startContraction: "Contraction Started",
    stopContraction: "Contraction Ended",
    hospitalBag: "Hospital Bag Checklist",
    docQuestions: "Doctor Visit Questions",
    fetalUltrasoundVault: "Antenatal Clinical Lab & Ultrasound Vault",
    developmentMilestones: "Fetal Development Milestones",
  },
  baby: {
    profile: "Baby Profile",
    age: "Age",
    growthChart: "WHO Growth Percentiles",
    feedingTracker: "Feeding & Nursing Tracker",
    diaperTracker: "Diaper Tracker",
    sleepTracker: "Sleep Tracker",
    vaccinationCard: "India National Vaccine Schedule",
    startNursingLeft: "Left Breast (L)",
    startNursingRight: "Right Breast (R)",
    formulaMl: "Formula Milk (ml)",
    logFeeding: "Save Feeding",
    wetDiaper: "Wet Diaper",
    dirtyDiaper: "Dirty Diaper",
    mixedDiaper: "Both (Wet + Dirty)",
    logDiaper: "Save Diaper Change",
    logGrowth: "Log Growth Measurement",
    weightKg: "Weight (kg)",
    lengthCm: "Length (cm)",
    headCircumference: "Head Circumference (cm)",
    addBabyProfile: "Add Child Profile",
    switchBaby: "Switch Child Profile",
  },
  assistant: {
    title: "Mumora AI Health Companion",
    subtitle: "Clinically grounded advice in your preferred language. Not a replacement for a doctor.",
    inputPlaceholder: "Ask about your week, test reports, baby care, or nutrition...",
    send: "Send",
    thinking: "Analyzing clinical guidelines...",
    disclaimer: "Medical Safety Notice: Mumora AI provides educational guidance based on clinical standards. It cannot provide definitive medical diagnoses, prescriptions, or emergency care.",
    quickPrompts: [
      "How many kicks should I feel at 28 weeks?",
      "What does AFI 12 cm mean in my ultrasound?",
      "Iron and Calcium medicines: How to take them properly?",
      "Postpartum care and traditional Indian diet tips",
      "Baby has not passed stool for 2 days, is it normal?"
    ]
  },
  records: {
    title: "Maternal & Child Medical Records Vault",
    subtitle: "Secure digital storage with automatic clinical lab parameter extraction",
    uploadBtn: "Upload Report (PDF/Image)",
    analyzeBtn: "Analyze Report",
    categoryAll: "All Documents",
    categoryUltrasound: "Ultrasound Scans",
    categoryBlood: "Blood Tests & Labs",
    categoryPrescription: "Prescriptions",
    categoryVaccine: "Immunization Cards",
    normal: "Normal Range",
    abnormal: "Requires Review",
    critical: "Urgent Attention",
    clinicalSummary: "Clinical Extraction Summary",
  },
  postpartum: {
    title: "Postpartum Recovery & Emotional Health",
    subtitle: "Clinical lochia tracking, pelvic floor exercises, and postnatal mood screening",
    lochiaTracker: "Lochia Bleeding Progression Tracker",
    epdsTitle: "Edinburgh Postnatal Depression Scale (EPDS)",
    epdsDesc: "Standardized 10-question screening validated globally for postnatal mood well-being.",
    takeEpds: "Take 2-Minute Mood Screen",
    pelvicFloor: "Pelvic Floor & Kegel Recovery Program",
  },
  environmental: {
    title: "Environmental Health & Climate Safeguards",
    coreHeadline: "Localized Environmental Telemetry & Health Precautions",
    supportingTagline: "WHO Air Quality Guidelines (2021) and heatwave hydration intelligence for maternal safety.",
    generateReport: "Generate Daily Environmental Report",
    generatingReport: "Synthesizing Observations...",
    location: "Current Location",
    changeLocation: "Change Location",
    temperature: "Temperature",
    apparentTemp: "Feels Like",
    humidity: "Relative Humidity",
    airQuality: "Air Quality (AQI)",
    uvIndex: "UV Index",
    liveFreshness: "Observed Live Telemetry",
    unavailableTitle: "Environmental Data Unavailable",
    unavailableDesc: "Live weather and air quality stations are unreachable for this region. Clinical precautions remain active.",
    retry: "Retry Connection",
    whoStandardNote: "WHO Air Quality Standard: PM2.5 24-hr limit is 15 µg/m³; PM10 is 45 µg/m³.",
    personalizedInsightTitle: "Personalized Maternal Vulnerability & Safety Steps",
    viewFullReport: "View 4-Section Environmental Report",
    whyLocationTitle: "Why Location Matters in Pregnancy",
    whyLocationDesc: "Heat stress and fine particulate pollution directly affect maternal hydration and fetal oxygenation.",
    detectGpsBtn: "Detect Current GPS Location",
    manualSelectNotice: "You can select your city or district manually from the canonical list.",
  },
  reminders: {
    title: "Smart Health & Vaccination Reminders",
    subtitle: "Timely, clinically grounded reminders for maternal Td immunizations, antenatal check-ups, and infant birth doses.",
    clinical3DayRule: "Clinical 3-Day Rule: Every confirmed appointment automatically generates an advance alert 3 days prior.",
    activeReminders: "Active Reminders",
    tdCalculator: "Maternal Td / Tdap Calculator",
    customSettings: "Reminder Settings & Channels",
    notificationHistory: "Notification History",
    addReminder: "Add Custom Reminder",
    markCompleted: "Mark Completed",
    markPending: "Mark Pending",
    reschedule: "Reschedule",
    remindLater: "Remind Later",
    viewDetails: "View Details",
    delete: "Delete Reminder",
    whyMatters: "Why this matters:",
    doctorConfirmed: "Doctor Confirmed",
    guidelineEstimate: "Guideline Estimate",
    emptyView: "No reminders in this view. All tasks are up to date.",
    leadNoticeTitle: "Advance Notification Lead Time",
  },
  nutrition: {
    title: "Adaptive Maternal Diet & Nutrition Guide",
    subtitle: "Personalized meals and nutritional guidance continuously calibrated to your latest health reports.",
    dietaryPref: "Dietary Preference",
    vegetarian: "Vegetarian",
    eggetarian: "Eggetarian",
    nonVegetarian: "Non-Vegetarian",
    vegan: "Vegan",
    currentLocation: "Selected City & Food Market",
    changeLocation: "Change City",
    regeneratePlan: "Regenerate Meal Plan",
    adaptiveTitle: "Dynamic Report-Based Diet Adaptation",
    whyChanged: "What changed and why:",
    reportDate: "Latest Health Report Date:",
    groceryList: "Smart Grocery Checklist",
    addGrocery: "Add Grocery Item",
    mealPlan: "Daily Meal Schedule",
    dishesDatabase: "Regional Dishes & Safety Analysis",
    whoGuidance: "Aligned with WHO Antenatal Nutrition & ICMR Maternal Dietary Guidelines.",
  },
  familyHealth: {
    title: "Family Medical Pedigree & Genetic Risk Insights",
    subtitle: "Multigenerational hereditary risk screening and clinical care pathways for your baby.",
    pedigreeTitle: "Three-Generation Family Pedigree",
    pedigreeDesc: "Documents maternal and paternal health conditions to screen for inherited risks.",
    maternalHistory: "Maternal Health History",
    paternalHistory: "Paternal Health History",
    hereditaryRisks: "Hereditary Conditions & Genetic Screening",
    riskAssessment: "Newborn Health Risk Assessment",
    addRelative: "Add Family Member Record",
    consanguinity: "Consanguinity (Blood Relation between Parents)",
    carePlan: "Clinician-Recommended Action Plan",
  },
  auth: {
    welcomeTitle: "Welcome to Mumora",
    welcomeSubtitle: "Comprehensive maternal healthcare, fetal tracking, and pediatric guidance.",
    loginTitle: "Sign In to Your Account",
    signupTitle: "Create Your Mumora Profile",
    email: "Email Address",
    phone: "Mobile Phone Number",
    password: "Password",
    name: "Full Name",
    dob: "Date of Birth",
    lmp: "First Day of Last Menstrual Period (LMP)",
    preferredLanguage: "Preferred Language",
    selectDiet: "Select Dietary Preference (Mandatory)",
    dietMandatoryNotice: "Your dietary preference is strictly enforced across every food recommendation and AI advice.",
    loginBtn: "Sign In",
    signupBtn: "Complete Signup",
    createAccount: "New to Mumora? Create an account",
    alreadyAccount: "Already registered? Sign in here",
    forgotPassword: "Forgot password?",
    logout: "Sign Out",
    or: "or",
  },
  admin: {
    title: "Mumora System Blueprint & Architecture",
    subtitle: "Clinical schemas, security rules, and platform infrastructure audit",
    systemAudit: "Database Schema & Rules Audit",
    activeUsers: "Registered Patient Accounts",
    login: "Administrative Portal Login",
    password: "Admin Security Key",
    close: "Close Blueprint",
    databaseStatus: "Encrypted Partitioned User Storage: Active",
  },
  common: {
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    view: "View",
    edit: "Edit",
    normal: "Normal",
    attention: "Requires Attention",
    date: "Date",
    time: "Time",
    notes: "Notes",
    completed: "Completed",
    pending: "Pending",
    language: "Language",
    chooseLanguage: "Choose Your Preferred Language",
    continueInLanguage: "Continue",
    searchLanguagePlaceholder: "Search language or script...",
    allOrigins: "All Global Languages",
    loading: "Loading...",
    error: "An error occurred",
    success: "Success",
    refresh: "Refresh",
    back: "Back",
    next: "Next",
    submit: "Submit",
    close: "Close",
    yes: "Yes",
    no: "No",
    or: "or",
    and: "and",
    details: "Details",
    verified: "Clinically Verified",
    caution: "Clinical Caution",
    mother: "Mother",
    baby: "Baby",
    all: "All",
  },
};

export const HI_TRANSLATION: TranslationSchema = {
  appName: "Mumora",
  tagline: "Healthy Moms ♥ Brighter Tomorrows",
  nav: {
    pregnancy: "गर्भावस्था ट्रैकर",
    baby: "शिशु एवं वृद्धि",
    reminders: "टीकाकरण रिमाइंडर",
    nutrition: "दैनिक आहार गाइड",
    environmental: "पर्यावरण स्वास्थ्य",
    familyHealth: "पारिवारिक जोखिम",
    aiAssistant: "मुमोरा एआई चैट",
    vault: "मेडिकल रिकॉर्ड्स",
    postpartum: "प्रसवोत्तर देखभाल",
    hospitals: "नजदीकी अस्पताल",
    adminBlueprint: "सिस्टम ब्लूप्रिंट",
  },
  emergency: {
    call108: "108 पर कॉल करें (एम्बुलेंस)",
    call102: "102 पर कॉल करें (जननी शिशु)",
    title: "आपातकालीन प्रसूति एवं बाल चिकित्सा दिशानिर्देश",
    subtitle: "यदि आपको कोई चेतावनी संकेत दिखे, तो तुरंत अस्पताल के लेबर रूम में जाएं।",
    redFlags: [
      "योनि से रक्तस्राव या भूरे रंग के धब्बे",
      "24-28 सप्ताह के बाद गर्भस्थ शिशु की हलचल में अचानक कमी या ठहराव",
      "धुंधली दृष्टि या आंखों के सामने चमक के साथ गंभीर सिरदर्द",
      "चेहरे, हाथों या टखनों में अचानक तीव्र सूजन",
      "पेट के ऊपरी दाहिने हिस्से में तेज दर्द",
      "योनि से पानी जैसा तरल रिसना (पानी की थैली फटना)",
      "100.4°F (38°C) से अधिक तेज बुखार या कंपकंपी",
      "शिशु के लिए: तेज बुखार, सांस लेने में घरघराहट, नीले होंठ"
    ],
    close: "खारिज करें",
    quickDial: "तत्काल सहायता"
  },
  pregnancy: {
    weekTitle: "गर्भावस्था का सप्ताह",
    trimester: "तिमाही",
    daysToGo: "दिन शेष हैं",
    dueDate: "प्रसव की अनुमानित तिथि (EDD)",
    babySize: "शिशु का आकार",
    length: "लंबाई",
    weight: "वजन",
    vitalLogs: "मातृ वाइटल्स एवं स्वास्थ्य लॉग",
    bpSystolic: "सिस्टोलिक बीपी (mmHg)",
    bpDiastolic: "डायस्टोलिक बीपी (mmHg)",
    currentWeight: "वर्तमान वजन (kg)",
    bloodSugar: "रक्त शर्करा (mg/dL)",
    logVitalsBtn: "आज के वाइटल्स दर्ज करें",
    kickCounter: "भ्रूण किक काउंटर",
    kickCounterDesc: "लक्ष्य: बाईं करवट आराम करते हुए 2 घंटे में कम से कम 10 हलचलें।",
    startKicks: "सत्र शुरू करें",
    recordKick: "किक दर्ज करें (+1)",
    contractionTimer: "प्रसव संकुचन टाइमर",
    contractionDesc: "संकुचन की अवधि और अंतराल ट्रैक करें। 5-1-1 नियम का पालन करें।",
    startContraction: "संकुचन शुरू हुआ",
    stopContraction: "संकुचन समाप्त हुआ",
    hospitalBag: "अस्पताल बैग चेकलिस्ट",
    docQuestions: "डॉक्टर से पूछे जाने वाले प्रश्न",
    fetalUltrasoundVault: "प्रसवपूर्व लैब टेस्ट एवं अल्ट्रासाउंड वॉल्ट",
    developmentMilestones: "गर्भस्थ शिशु विकास चरण",
  },
  baby: {
    profile: "शिशु प्रोफाइल",
    age: "आयु",
    growthChart: "डब्ल्यूएचओ बाल विकास चार्ट",
    feedingTracker: "स्तनपान एवं आहार ट्रैकर",
    diaperTracker: "डायपर ट्रैकर",
    sleepTracker: "नींद ट्रैकर",
    vaccinationCard: "राष्ट्रीय टीकाकरण अनुसूची",
    startNursingLeft: "बायां स्तन (L)",
    startNursingRight: "दायां स्तन (R)",
    formulaMl: "फॉर्मूला दूध (ml)",
    logFeeding: "आहार सहेजें",
    wetDiaper: "गीला डायपर",
    dirtyDiaper: "गंदा डायपर",
    mixedDiaper: "दोनों (गीला + गंदा)",
    logDiaper: "डायपर बदलाव सहेजें",
    logGrowth: "शारीरिक माप दर्ज करें",
    weightKg: "वजन (kg)",
    lengthCm: "लंबाई (cm)",
    headCircumference: "सिर की परिधि (cm)",
    addBabyProfile: "नया शिशु प्रोफाइल जोड़ें",
    switchBaby: "शिशु प्रोफाइल बदलें",
  },
  assistant: {
    title: "मुमोरा एआई स्वास्थ्य साथी",
    subtitle: "आपकी अपनी भाषा में चिकित्सकीय सलाह। यह डॉक्टर का विकल्प नहीं है।",
    inputPlaceholder: "अपने सप्ताह, रिपोर्ट, शिशु देखभाल या पोषण के बारे में पूछें...",
    send: "भेजें",
    thinking: "क्लिनिकल दिशानिर्देशों का विश्लेषण हो रहा है...",
    disclaimer: "चिकित्सीय सुरक्षा सूचना: मुमोरा एआई केवल शैक्षणिक मार्गदर्शन प्रदान करता है। यह निश्चित निदान, दवा की पर्ची या आपातकालीन देखभाल नहीं दे सकता।",
    quickPrompts: [
      "28वें सप्ताह में मुझे कितनी किक्स महसूस होनी चाहिए?",
      "सोनोग्राफी में AFI 12 सेमी का क्या अर्थ है?",
      "आयरन और कैल्शियम की गोलियां कब और कैसे लें?",
      "प्रसव के बाद खान-पान और पारंपरिक भारतीय सुझाव",
      "बच्चे ने 2 दिन से शौच नहीं किया, क्या यह सामान्य है?"
    ]
  },
  records: {
    title: "मातृ एवं शिशु मेडिकल रिकॉर्ड वॉल्ट",
    subtitle: "स्वचालित लैब मान विश्लेषण के साथ सुरक्षित डिजिटल स्टोरेज",
    uploadBtn: "रिपोर्ट अपलोड करें (PDF/फोटो)",
    analyzeBtn: "रिपोर्ट का विश्लेषण करें",
    categoryAll: "सभी दस्तावेज",
    categoryUltrasound: "अल्ट्रासाउंड सोनोग्राफी",
    categoryBlood: "रक्त जांच एवं लैब रिपोर्ट",
    categoryPrescription: "डॉक्टर के पर्चे",
    categoryVaccine: "टीकाकरण कार्ड",
    normal: "सामान्य सीमा",
    abnormal: "समीक्षा आवश्यक",
    critical: "तत्काल ध्यान दें",
    clinicalSummary: "नैदानिक निष्कर्षण सारांश",
  },
  postpartum: {
    title: "प्रसवोत्तर स्वास्थ्य एवं मानसिक देखभाल",
    subtitle: "लोकिया डिस्चार्ज ट्रैकिंग, पेल्विक फ्लोर व्यायाम और मूड मूल्यांकन",
    lochiaTracker: "प्रसवोत्तर रक्तस्राव (लोकिया) ट्रैकर",
    epdsTitle: "एडिनबर्ग प्रसवोत्तर अवसाद स्केल (EPDS)",
    epdsDesc: "प्रसव के बाद मानसिक स्वास्थ्य और मूड की जांच के लिए 10 प्रश्नों का मानक टेस्ट।",
    takeEpds: "2 मिनट का मूड टेस्ट लें",
    pelvicFloor: "पेल्विक फ्लोर एवं कीगेल रिकवरी प्रोग्राम",
  },
  environmental: {
    title: "पर्यावरणीय स्वास्थ्य एवं जलवायु सुरक्षा",
    coreHeadline: "स्थानीय मौसम डेटा एवं स्वास्थ्य सावधानियां",
    supportingTagline: "डब्ल्यूएचओ वायु गुणवत्ता दिशानिर्देश (2021) और लू से बचाव के निर्देश।",
    generateReport: "दैनिक पर्यावरण रिपोर्ट तैयार करें",
    generatingReport: "अवलोकन विश्लेषण जारी है...",
    location: "वर्तमान स्थान",
    changeLocation: "स्थान बदलें",
    temperature: "तापमान",
    apparentTemp: "महसूस होने वाला तापमान",
    humidity: "सापेक्ष आर्द्रता",
    airQuality: "वायु गुणवत्ता (AQI)",
    uvIndex: "यूवी इंडेक्स",
    liveFreshness: "लाइव उपग्रह डेटा",
    unavailableTitle: "पर्यावरण डेटा उपलब्ध नहीं है",
    unavailableDesc: "इस क्षेत्र के लिए लाइव मौसम और वायु गुणवत्ता स्टेशन उपलब्ध नहीं हैं।",
    retry: "पुनः प्रयास करें",
    whoStandardNote: "WHO वायु गुणवत्ता मानक: PM2.5 की 24 घंटे की सीमा 15 µg/m³ और PM10 की 45 µg/m³ है।",
    personalizedInsightTitle: "व्यक्तिगत मातृ संवेदनशीलता एवं सुरक्षा कदम",
    viewFullReport: "4-खंडीय पर्यावरण रिपोर्ट देखें",
    whyLocationTitle: "गर्भावस्था में स्थान क्यों महत्वपूर्ण है",
    whyLocationDesc: "तापमान और सूक्ष्म कणों का प्रदूषण सीधे माता के जलयोजन और शिशु के ऑक्सीजन स्तर को प्रभावित करता है।",
    detectGpsBtn: "वर्तमान GPS स्थान का पता लगाएं",
    manualSelectNotice: "आप सूची से अपना शहर या जिला मैन्युअल रूप से चुन सकते हैं।",
  },
  reminders: {
    title: "स्मार्ट स्वास्थ्य एवं टीकाकरण रिमाइंडर",
    subtitle: "मातृ टीडी टीकाकरण, प्रसवपूर्व जांच और शिशु जन्म खुराक के लिए समय पर रिमाइंडर।",
    clinical3DayRule: "क्लिनिकल 3-दिन नियम: प्रत्येक पुष्ट नियुक्ति से 3 दिन पहले स्वचालित अग्रिम सूचना मिलती है।",
    activeReminders: "सक्रिय रिमाइंडर",
    tdCalculator: "मातृ टीडी / टीडीएपी कैलकुलेटर",
    customSettings: "रिमाइंडर सेटिंग्स एवं माध्यम",
    notificationHistory: "सूचना इतिहास",
    addReminder: "नया रिमाइंडर जोड़ें",
    markCompleted: "पूर्ण चिह्नित करें",
    markPending: "लंबित चिह्नित करें",
    reschedule: "समय बदलें",
    remindLater: "बाद में याद दिलाएं",
    viewDetails: "विवरण देखें",
    delete: "हटाएं",
    whyMatters: "यह क्यों आवश्यक है:",
    doctorConfirmed: "चिकित्सक द्वारा सत्यापित",
    guidelineEstimate: "दिशानिर्देश अनुमान",
    emptyView: "इस दृश्य में कोई रिमाइंडर नहीं है। सभी कार्य पूरे हैं।",
    leadNoticeTitle: "अग्रिम सूचना की अवधि",
  },
  nutrition: {
    title: "गतिशील मातृ आहार एवं पोषण गाइड",
    subtitle: "आपकी नवीनतम स्वास्थ्य रिपोर्ट के अनुसार लगातार अनुकूलित संतुलित भोजन योजना।",
    dietaryPref: "आहार प्राथमिकता",
    vegetarian: "शाकाहारी (Vegetarian)",
    eggetarian: "अंडा युक्त (Eggetarian)",
    nonVegetarian: "मांसाहारी (Non-Vegetarian)",
    vegan: "वीगन (Vegan)",
    currentLocation: "चयनित शहर एवं खाद्य बाजार",
    changeLocation: "शहर बदलें",
    regeneratePlan: "आहार योजना पुनः बनाएं",
    adaptiveTitle: "रिपोर्ट आधारित स्वचालित आहार अनुकूलन",
    whyChanged: "क्या बदला और क्यों:",
    reportDate: "नवीनतम स्वास्थ्य रिपोर्ट तिथि:",
    groceryList: "स्मार्ट किराना चेकलिस्ट",
    addGrocery: "किराना सामग्री जोड़ें",
    mealPlan: "दैनिक भोजन अनुसूची",
    dishesDatabase: "स्थानीय व्यंजन एवं सुरक्षा विश्लेषण",
    whoGuidance: "डब्ल्यूएचओ प्रसवपूर्व पोषण और आईसीएमआर दिशानिर्देशों के अनुरूप।",
  },
  familyHealth: {
    title: "पारिवारिक वंशावली एवं आनुवंशिक जोखिम",
    subtitle: "तीन पीढ़ियों का आनुवंशिक जोखिम विश्लेषण और शिशु के लिए क्लिनिकल सुरक्षा योजना।",
    pedigreeTitle: "तीन पीढ़ियों का पारिवारिक वंशावली चार्ट",
    pedigreeDesc: "आनुवंशिक जोखिमों की जांच के लिए माता-पिता के स्वास्थ्य इतिहास का दस्तावेजीकरण।",
    maternalHistory: "मातृ स्वास्थ्य इतिहास",
    paternalHistory: "पितृ स्वास्थ्य इतिहास",
    hereditaryRisks: "वंशानुगत स्थितियां एवं स्क्रीनिंग",
    riskAssessment: "नवजात शिशु स्वास्थ्य जोखिम मूल्यांकन",
    addRelative: "परिवार के सदस्य का रिकॉर्ड जोड़ें",
    consanguinity: "रक्त संबंध (माता-पिता के बीच रिश्तेदारी)",
    carePlan: "चिकित्सक द्वारा अनुशंसित कार्य योजना",
  },
  auth: {
    welcomeTitle: "मुमोरा में आपका स्वागत है",
    welcomeSubtitle: "संपूर्ण मातृ स्वास्थ्य, गर्भस्थ शिशु ट्रैकिंग और बाल चिकित्सा मार्गदर्शन।",
    loginTitle: "अपने खाते में प्रवेश करें",
    signupTitle: "अपना मुमोरा प्रोफाइल बनाएं",
    email: "ईमेल पता",
    phone: "मोबाइल नंबर",
    password: "पासवर्ड",
    name: "पूरा नाम",
    dob: "जन्म तिथि",
    lmp: "अंतिम मासिक धर्म का पहला दिन (LMP)",
    preferredLanguage: "पसंदीदा भाषा",
    selectDiet: "आहार प्राथमिकता चुनें (अनिवार्य)",
    dietMandatoryNotice: "आपकी आहार प्राथमिकता हर भोजन सिफारिश और एआई सलाह में सख्ती से लागू होगी।",
    loginBtn: "साइन इन करें",
    signupBtn: "पंजीकरण पूरा करें",
    createAccount: "मुमोरा पर नए हैं? नया खाता बनाएं",
    alreadyAccount: "पहले से पंजीकृत हैं? यहाँ साइन इन करें",
    forgotPassword: "पासवर्ड भूल गए?",
    logout: "लॉग आउट करें",
    or: "या",
  },
  admin: {
    title: "मुमोरा सिस्टम ब्लूप्रिंट एवं आर्किटेक्चर",
    subtitle: "क्लिनिकल स्कीमा, सुरक्षा नियम और प्लेटफॉर्म अवसंरचना ऑडिट",
    systemAudit: "डेटाबेस स्कीमा एवं सुरक्षा नियम ऑडिट",
    activeUsers: "पंजीकृत मरीज खाते",
    login: "प्रशासनिक पोर्टल लॉगिन",
    password: "एडमिन सुरक्षा कुंजी",
    close: "ब्लूप्रिंट बंद करें",
    databaseStatus: "एन्क्रिप्टेड पार्टीशन यूजर स्टोरेज: सक्रिय",
  },
  common: {
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    view: "देखें",
    edit: "संपादित करें",
    normal: "सामान्य",
    attention: "ध्यान देने योग्य",
    date: "तारीख",
    time: "समय",
    notes: "टिप्पणी",
    completed: "पूर्ण हुआ",
    pending: "लंबित",
    language: "भाषा",
    chooseLanguage: "अपनी पसंदीदा भाषा चुनें",
    continueInLanguage: "आगे बढ़ें",
    searchLanguagePlaceholder: "भाषा खोजें...",
    allOrigins: "सभी वैश्विक भाषाएं",
    loading: "लोड हो रहा है...",
    error: "त्रुटि हुई",
    success: "सफलता",
    refresh: "रिफ्रेश",
    back: "वापस",
    next: "आगे",
    submit: "जमा करें",
    close: "बंद करें",
    yes: "हाँ",
    no: "नहीं",
    or: "या",
    and: "और",
    details: "विवरण",
    verified: "सत्यापित",
    caution: "सावधानी",
    mother: "माता",
    baby: "शिशु",
    all: "सभी",
  },
};

export const TE_TRANSLATION: TranslationSchema = {
  appName: "Mumora",
  tagline: "Healthy Moms ♥ Brighter Tomorrows",
  nav: {
    pregnancy: "గర్భధారణ ట్రాకర్",
    baby: "శిశువు & ఎదుగుదల",
    reminders: "టీకా రిమైండర్లు",
    nutrition: "రోజువారీ ఆహార మార్గదర్శి",
    environmental: "పర్యావరణ ఆరోగ్యం",
    familyHealth: "కుటుంబ & ప్రమాద విశ్లేషణ",
    aiAssistant: "ముమోరా AI చాట్",
    vault: "వైద్య నివేదికలు",
    postpartum: "ప్రసవానంతర సంరక్షణ",
    hospitals: "సమీప ఆసుపత్రులు",
    adminBlueprint: "సిస్టమ్ బ్లూప్రింట్",
  },
  emergency: {
    call108: "108కు కాల్ చేయండి (అంబులెన్స్)",
    call102: "102కు కాల్ చేయండి (జననీ శిశు)",
    title: "అత్యవసర ప్రసూతి మరియు శిశు సంరక్షణ మార్గదర్శకాలు",
    subtitle: "హెచ్చరిక సంకేతాలు గమనిస్తే, వెంటనే ఆసుపత్రి లేబర్ రూమ్‌కు వెళ్లండి.",
    redFlags: [
      "యోని రక్తస్రావం లేదా గోధుమ రంగు మచ్చలు",
      "24-28 వారాల తర్వాత గర్భస్థ శిశువు కదలికలు తగ్గడం లేదా ఆగిపోవడం",
      "మసక దృష్టి లేదా కళ్లముందు మెరుపులతో తీవ్రమైన తలనొప్పి",
      "ముఖం, చేతులు లేదా పాదాలలో ఆకస్మిక వాపు",
      "కడుపు పైభాగంలో తీవ్రమైన నొప్పి",
      "యోని నుండి నీరు కారడం (ఉమ్మనీరు పగలడం)",
      "100.4°F (38°C) కంటే ఎక్కువ తీవ్రమైన జ్వరం లేదా చలి",
      "శిశువుకు: తీవ్ర జ్వరం, శ్వాస తీసుకోవడంలో ఇబ్బంది, నీలిరంగు పెదవులు"
    ],
    close: "రద్దు చేయి",
    quickDial: "తక్షణ సహాయం"
  },
  pregnancy: {
    weekTitle: "గర్భధారణ వారం",
    trimester: "త్రైమాసికం",
    daysToGo: "మిగిలిన రోజులు",
    dueDate: "అంచనా వేసిన డెలివరీ తేదీ (EDD)",
    babySize: "శిశువు పరిమాణం",
    length: "పొడవు",
    weight: "బరువు",
    vitalLogs: "తల్లి ఆరోగ్య కొలతలు & లాగ్‌లు",
    bpSystolic: "సిస్టోలిక్ BP (mmHg)",
    bpDiastolic: "డయాస్టోలిక్ BP (mmHg)",
    currentWeight: "ప్రస్తుత బరువు (kg)",
    bloodSugar: "రక్తంలో చక్కెర (mg/dL)",
    logVitalsBtn: "నేటి కొలతలను నమోదు చేయండి",
    kickCounter: "శిశువు కిక్ కౌంటర్",
    kickCounterDesc: "లక్ష్యం: ఎడమ వైపుకు తిరిగి విశ్రాంతి తీసుకుంటూ 2 గంటల్లో కనీసం 10 కదలికలు.",
    startKicks: "సెషన్ ప్రారంభించండి",
    recordKick: "కిక్ నమోదు చేయండి (+1)",
    contractionTimer: "ప్రసవ నొప్పుల టైమర్",
    contractionDesc: "నొప్పుల వ్యవధి మరియు సమయాన్ని ట్రాక్ చేయండి. 5-1-1 నియమాన్ని పాటించండి.",
    startContraction: "నొప్పి ప్రారంభమైంది",
    stopContraction: "నొప్పి తగ్గింది",
    hospitalBag: "ఆసుపత్రి బ్యాగ్ చెక్‌లిస్ట్",
    docQuestions: "వైద్యుడిని అడగవలసిన ప్రశ్నలు",
    fetalUltrasoundVault: "గర్భస్థ అల్ట్రాసౌండ్ & ల్యాబ్ వాల్ట్",
    developmentMilestones: "శిశు అభివృద్ధి మైలురాళ్ళు",
  },
  baby: {
    profile: "శిశువు ప్రొఫైల్",
    age: "వయస్సు",
    growthChart: "WHO శిశు ఎదుగుదల చార్ట్",
    feedingTracker: "పాలింపు & ఆహార ట్రాకర్",
    diaperTracker: "డైపర్ ట్రాకర్",
    sleepTracker: "నిద్ర ట్రాకర్",
    vaccinationCard: "జాతీయ టీకాల పట్టిక",
    startNursingLeft: "ఎడమ రొమ్ము (L)",
    startNursingRight: "కుడి రొమ్ము (R)",
    formulaMl: "ఫార్ములా పాలు (ml)",
    logFeeding: "ఆహారాన్ని భద్రపరచండి",
    wetDiaper: "తడి డైపర్",
    dirtyDiaper: "మురికి డైపర్",
    mixedDiaper: "రెండూ (తడి + మురికి)",
    logDiaper: "డైపర్ మార్పు నమోదు",
    logGrowth: "ఎదుగుదల కొలత నమోదు",
    weightKg: "బరువు (kg)",
    lengthCm: "పొడవు (cm)",
    headCircumference: "తల చుట్టుకొలత (cm)",
    addBabyProfile: "కొత్త శిశువు ప్రొఫైల్ జోడించండి",
    switchBaby: "శిశువు ప్రొఫైల్ మార్చండి",
  },
  assistant: {
    title: "ముమోరా AI ఆరోగ్య సహాయకుడు",
    subtitle: "మీ భాషలో శాస్త్రీయ వైద్య సలహాలు. వైద్యుడికి ప్రత్యామ్నాయం కాదు.",
    inputPlaceholder: "మీ వారం, నివేదికలు, శిశు సంరక్షణ లేదా పోషకాహారం గురించి అడగండి...",
    send: "పంపండి",
    thinking: "క్లినికల్ మార్గదర్శకాలను విశ్లేషిస్తోంది...",
    disclaimer: "వైద్య భద్రతా నోటీసు: ముమోరా AI కేవలం విద్యా మార్గదర్శకత్వాన్ని మాత్రమే అందిస్తుంది. ఇది తుది రోగ నిర్ధారణ లేదా మందుల ప్రిస్క్రిప్షన్ ఇవ్వలేదు.",
    quickPrompts: [
      "28 వారాలలో నాకు ఎన్ని కదలికలు అనిపించాలి?",
      "అల్ట్రాసౌండ్‌లో AFI 12 సెం.మీ అంటే ఏమిటి?",
      "ఐరన్ మరియు కాల్షియం మాత్రలు ఎలా తీసుకోవాలి?",
      "ప్రసవానంతర సంరక్షణ మరియు సాంప్రదాయ భారతీయ ఆహార చిట్కాలు",
      "శిశువు 2 రోజులుగా మలవిసర్జన చేయలేదు, ఇది సాధారణమేనా?"
    ]
  },
  records: {
    title: "తల్లి & శిశు వైద్య నివేదికల వాల్ట్",
    subtitle: "ల్యాబ్ విలువల ఆటోమేటిక్ విశ్లేషణతో సురక్షిత డిజిటల్ నిల్వ",
    uploadBtn: "రిపోర్టును అప్‌లోడ్ చేయండి (PDF/ఫోటో)",
    analyzeBtn: "రిపోర్టును విశ్లేషించండి",
    categoryAll: "అన్ని పత్రాలు",
    categoryUltrasound: "అల్ట్రాసౌండ్ స్కాన్లు",
    categoryBlood: "రక్త పరీక్షలు & ల్యాబ్స్",
    categoryPrescription: "వైద్యుల చీటీలు",
    categoryVaccine: "టీకా కార్డులు",
    normal: "సాధారణ పరిధి",
    abnormal: "సమీక్ష అవసరం",
    critical: "తక్షణ శ్రద్ధ అవసరం",
    clinicalSummary: "క్లినికల్ సారాంశం",
  },
  postpartum: {
    title: "ప్రసవానంతర కోలుకోవడం & మానసిక ఆరోగ్యం",
    subtitle: "లోచియా రక్తస్రావం ట్రాకింగ్, పెల్విక్ వ్యాయామాలు మరియు మానసిక ఆరోగ్య పరీక్ష",
    lochiaTracker: "లోచియా రక్తస్రావ పురోగతి ట్రాకర్",
    epdsTitle: "ఎడిన్‌బర్గ్ ప్రసవానంతర డిప్రెషన్ స్కేల్ (EPDS)",
    epdsDesc: "ప్రసవం తర్వాత మానసిక శ్రేయస్సును అంచనా వేసే 10 ప్రామాణిక ప్రశ్నలు.",
    takeEpds: "2 నిమిషాల మూడ్ పరీక్ష ప్రారంభించండి",
    pelvicFloor: "పెల్విక్ ఫ్లోర్ & కీగెల్ రికవరీ ప్రోగ్రామ్",
  },
  environmental: {
    title: "పర్యావరణ ఆరోగ్యం & వాతావరణ రక్షణలు",
    coreHeadline: "స్థానిక వాతావరణ సమాచారం & ఆరోగ్య జాగ్రత్తలు",
    supportingTagline: "WHO వాయు నాణ్యతా మార్గదర్శకాలు (2021) మరియు ఎండవేడి నుండి రక్షణ.",
    generateReport: "రోజువారీ పర్యావరణ నివేదికను రూపొందించండి",
    generatingReport: "సమాచారాన్ని విశ్లేషిస్తోంది...",
    location: "ప్రస్తుత స్థానం",
    changeLocation: "స్థానాన్ని మార్చండి",
    temperature: "ఉష్ణోగ్రత",
    apparentTemp: "అనిపించే ఉష్ణోగ్రత",
    humidity: "గాలిలో తేమ",
    airQuality: "గాలి నాణ్యత (AQI)",
    uvIndex: "UV ఇండెక్స్",
    liveFreshness: "లైవ్ శాటిలైట్ సమాచారం",
    unavailableTitle: "పర్యావరణ సమాచారం అందుబాటులో లేదు",
    unavailableDesc: "ఈ ప్రాంతానికి ప్రత్యక్ష వాతావరణ కేంద్రాలు అందుబాటులో లేవు. జాగ్రత్తలు కొనసాగించండి.",
    retry: "మళ్లీ ప్రయత్నించండి",
    whoStandardNote: "WHO ప్రమాణం: PM2.5 24 గంటల పరిమితి 15 µg/m³; PM10 పరిమితి 45 µg/m³.",
    personalizedInsightTitle: "వ్యక్తిగత గర్భధారణ భద్రతా చర్యలు",
    viewFullReport: "పూర్తి 4-విభాగాల పర్యావరణ నివేదికను చూడండి",
    whyLocationTitle: "గర్భధారణలో స్థానం ఎందుకు ముఖ్యం",
    whyLocationDesc: "వేడి మరియు వాయు కాలుష్యం తల్లి డీహైడ్రేషన్ మరియు శిశువు ఆక్సిజన్ స్థాయిలపై ప్రత్యక్ష ప్రభావం చూపుతాయి.",
    detectGpsBtn: "ప్రస్తుత GPS స్థానాన్ని గుర్తించండి",
    manualSelectNotice: "మీరు జాబితా నుండి నగరాన్ని లేదా జిల్లాను మాన్యువల్‌గా ఎంచుకోవచ్చు.",
  },
  reminders: {
    title: "స్మార్ట్ ఆరోగ్య & టీకా రిమైండర్లు",
    subtitle: "తల్లి Td టీకాలు, ప్రసవపూర్వ తనిఖీలు మరియు శిశువు పుట్టినప్పటి మోతాదుల కోసం సమయానుకూల హెచ్చరికలు.",
    clinical3DayRule: "క్లినికల్ 3-రోజుల నియమం: ప్రతి నిర్ధారిత అపాయింట్‌మెంట్‌కు 3 రోజుల ముందు స్వయంచాలక హెచ్చరిక లభిస్తుంది.",
    activeReminders: "క్రియాశీల రిమైండర్లు",
    tdCalculator: "తల్లి Td / Tdap కాలిక్యులేటర్",
    customSettings: "రిమైండర్ సెట్టింగ్‌లు & మాధ్యమాలు",
    notificationHistory: "నోటిఫికేషన్ చరిత్ర",
    addReminder: "కొత్త రిమైండర్ జోడించండి",
    markCompleted: "పూర్తయినట్లు గుర్తించండి",
    markPending: "పెండింగ్‌గా గుర్తించండి",
    reschedule: "సమయం మార్చండి",
    remindLater: "తర్వాత గుర్తు చేయండి",
    viewDetails: "వివరాలు చూడండి",
    delete: "తొలగించు",
    whyMatters: "ఇది ఎందుకు ముఖ్యం:",
    doctorConfirmed: "వైద్యుడు ధృవీకరించారు",
    guidelineEstimate: "మార్గదర్శకాల అంచనా",
    emptyView: "ఈ విభాగంలో ఎటువంటి రిమైండర్‌లు లేవు. అన్నీ పూర్తయ్యాయి.",
    leadNoticeTitle: "ముందస్తు నోటీసు సమయం",
  },
  nutrition: {
    title: "డైనమిక్ తల్లి ఆహార & పోషకాహార మార్గదర్శి",
    subtitle: "మీ తాజా ఆరోగ్య నివేదికల ఆధారంగా నిరంతరం సరిచేయబడే సమతుల్య భోజన ప్రణాళిక.",
    dietaryPref: "ఆహార ప్రాధాన్యత",
    vegetarian: "శాకాహారం (Vegetarian)",
    eggetarian: "గుడ్డుతో కూడిన శాకాహారం (Eggetarian)",
    nonVegetarian: "మాంసాహారం (Non-Vegetarian)",
    vegan: "వీగన్ (Vegan)",
    currentLocation: "ఎంచుకున్న నగరం & స్థానిక మార్కెట్",
    changeLocation: "నగరాన్ని మార్చండి",
    regeneratePlan: "ఆహార ప్రణాళికను రీజెనరేట్ చేయండి",
    adaptiveTitle: "నివేదికల ఆధారిత డైనమిక్ ఆహార మార్పులు",
    whyChanged: "ఏమి మారింది మరియు ఎందుకు:",
    reportDate: "తాజా ఆరోగ్య నివేదిక తేదీ:",
    groceryList: "స్మార్ట్ కిరాణా చెక్‌లిస్ట్",
    addGrocery: "కిరాణా వస్తువును జోడించండి",
    mealPlan: "రోజువారీ భోజన షెడ్యూల్",
    dishesDatabase: "ప్రాంతీయ వంటకాలు & భద్రతా విశ్లేషణ",
    whoGuidance: "WHO మరియు ICMR ప్రసూతి పోషకాహార మార్గదర్శకాలకు అనుగుణంగా రూపొందించబడింది.",
  },
  familyHealth: {
    title: "కుటుంబ వంశవృక్షం & జన్యుపరమైన ప్రమాదాలు",
    subtitle: "మూడు తరాల వంశపారంపర్య ఆరోగ్య విశ్లేషణ మరియు మీ శిశువు సంరక్షణ ప్రణాళిక.",
    pedigreeTitle: "మూడు తరాల కుటుంబ వంశవృక్ష చార్ట్",
    pedigreeDesc: "వారసత్వ వ్యాధులను గుర్తించడానికి తల్లి మరియు తండ్రి వైపు ఆరోగ్య చరిత్ర.",
    maternalHistory: "తల్లి ఆరోగ్య చరిత్ర",
    paternalHistory: "తండ్రి ఆరోగ్య చరిత్ర",
    hereditaryRisks: "వంశపారంపర్య వ్యాధులు & స్క్రీనింగ్",
    riskAssessment: "నవజాత శిశు ఆరోగ్య ప్రమాద అంచనా",
    addRelative: "కుటుంబ సభ్యుల రికార్డు జోడించండి",
    consanguinity: "రక్త సంబంధం (తల్లిదండ్రుల మధ్య బంధుత్వం)",
    carePlan: "వైద్యులు సిఫార్సు చేసిన కార్యాచరణ ప్రణాళిక",
  },
  auth: {
    welcomeTitle: "ముమోరాకు స్వాగతం",
    welcomeSubtitle: "సమగ్ర తల్లి ఆరోగ్యం, గర్భస్థ శిశు ట్రాకింగ్ మరియు శిశు సంరక్షణ.",
    loginTitle: "మీ ఖాతాలోకి సైన్ ఇన్ చేయండి",
    signupTitle: "మీ ముమోరా ప్రొఫైల్‌ను సృష్టించండి",
    email: "ఈమెయిల్ చిరునామా",
    phone: "మొబైల్ ఫోన్ నంబర్",
    password: "పాస్‌వర్డ్",
    name: "పూర్తి పేరు",
    dob: "పుట్టిన తేదీ",
    lmp: "చివరి బహిష్టు మొదటి రోజు (LMP)",
    preferredLanguage: "ప్రాధాన్యత గల భాష",
    selectDiet: "ఆహార ప్రాధాన్యతను ఎంచుకోండి (తప్పనిసరి)",
    dietMandatoryNotice: "మీరు ఎంచుకున్న ఆహార ప్రాధాన్యత అన్ని సిఫార్సులు మరియు AI సలహాలలో ఖచ్చితంగా అమలు చేయబడుతుంది.",
    loginBtn: "సైన్ ఇన్ చేయండి",
    signupBtn: "నమోదు పూర్తి చేయండి",
    createAccount: "ముమోరాకు కొత్తవారా? ఖాతా సృష్టించండి",
    alreadyAccount: "ఇప్పటికే ఖాతా ఉందా? ఇక్కడ సైన్ ఇన్ చేయండి",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    logout: "లాగ్ అవుట్ చేయండి",
    or: "లేదా",
  },
  admin: {
    title: "ముమోరా సిస్టమ్ బ్లూప్రింట్ & ఆర్కిటెక్చర్",
    subtitle: "క్లినికల్ స్కీమాలు, భద్రతా నియమాలు మరియు ప్లాట్‌ఫారమ్ ఆడిట్",
    systemAudit: "డేటాబేస్ స్కీమా & నిబంధనల ఆడిట్",
    activeUsers: "నమోదైన రోగుల ఖాతాలు",
    login: "అడ్మిన్ పోర్టల్ లాగిన్",
    password: "అడ్మిన్ సెక్యూరిటీ కీ",
    close: "బ్లూప్రింట్ మూసివేయి",
    databaseStatus: "ఎన్‌క్రిప్టెడ్ యూజర్ స్టోరేజ్: యాక్టివ్",
  },
  common: {
    save: "భద్రపరచండి",
    cancel: "రద్దు చేయి",
    delete: "తొలగించు",
    view: "చూడండి",
    edit: "సవరించు",
    normal: "సాధారణం",
    attention: "శ్రద్ధ అవసరం",
    date: "తేదీ",
    time: "సమయం",
    notes: "గమనికలు",
    completed: "పూర్తయింది",
    pending: "పెండింగ్‌లో ఉంది",
    language: "భాష",
    chooseLanguage: "మీ ప్రాధాన్యత గల భాషను ఎంచుకోండి",
    continueInLanguage: "కొనసాగించండి",
    searchLanguagePlaceholder: "భాషను శోధించండి...",
    allOrigins: "అన్ని ప్రపంచ భాషలు",
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం సంభవించింది",
    success: "విజయవంతమైంది",
    refresh: "రిఫ్రెష్",
    back: "వెనుకకు",
    next: "తదుపరి",
    submit: "సమర్పించు",
    close: "మూసివేయి",
    yes: "అవును",
    no: "కాదు",
    or: "లేదా",
    and: "మరియు",
    details: "వివరాలు",
    verified: "ధృవీకరించబడింది",
    caution: "హెచ్చరిక",
    mother: "తల్లి",
    baby: "శిశువు",
    all: "అన్నీ",
  },
};

export const TA_TRANSLATION: TranslationSchema = {
  ...EN_TRANSLATION,
  appName: "Mumora",
  tagline: "Healthy Moms ♥ Brighter Tomorrows",
  nav: {
    pregnancy: "கர்ப்ப கால கண்காணிப்பு",
    baby: "குழந்தை & வளர்ச்சி",
    reminders: "தடுப்பூசி நினைவூட்டல்",
    nutrition: "தினசரி உணவு வழிகாட்டி",
    environmental: "சுற்றுச்சூழல் சுகாதாரம்",
    familyHealth: "குடும்ப & மரபணு அபாயம்",
    aiAssistant: "முமோரா AI மருத்துவர்",
    vault: "மருத்துவ ஆவணங்கள்",
    postpartum: "பிரசவத்திற்கு பின்",
    hospitals: "அருகிலுள்ள மருத்துவமனைகள்",
    adminBlueprint: "கட்டமைப்பு",
  },
  common: {
    ...EN_TRANSLATION.common,
    save: "சேமிக்கவும்",
    cancel: "ரத்து செய்",
    delete: "நீக்கு",
    view: "பார்க்க",
    edit: "திருத்து",
    language: "மொழி",
    chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    continueInLanguage: "தொடரவும்",
    normal: "இயல்பானது",
    attention: "கவனம் தேவை",
    mother: "தாய்",
    baby: "குழந்தை",
    all: "அனைத்தும்",
  },
};

export const BN_TRANSLATION: TranslationSchema = {
  ...EN_TRANSLATION,
  appName: "Mumora",
  tagline: "Healthy Moms ♥ Brighter Tomorrows",
  nav: {
    pregnancy: "গর্ভাবস্থা ট্র্যাকার",
    baby: "শিশু ও বৃদ্ধি",
    reminders: "টিকা রিমাইন্ডার",
    nutrition: "দৈনিক খাদ্য গাইড",
    environmental: "পরিবেশগত স্বাস্থ্য",
    familyHealth: "পারিবারিক ঝুঁকি",
    aiAssistant: "মুমোরা এআই চ্যাট",
    vault: "মেডিকেল রেকর্ড",
    postpartum: "প্রসবোত্তর যত্ন",
    hospitals: "নিকটস্থ হাসপাতাল",
    adminBlueprint: "সিস্টেম ব্লুপ্রিন্ট",
  },
  common: {
    ...EN_TRANSLATION.common,
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল",
    delete: "মুছুন",
    view: "দেখুন",
    edit: "সম্পাদনা",
    language: "ভাষা",
    chooseLanguage: "পছন্দের ভাষা নির্বাচন করুন",
    continueInLanguage: "এগিয়ে যান",
    normal: "স্বাভাবিক",
    attention: "মনোযোগ প্রয়োজন",
    mother: "মা",
    baby: "শিশু",
    all: "সব",
  },
};

export const MR_TRANSLATION: TranslationSchema = {
  ...EN_TRANSLATION,
  appName: "Mumora",
  tagline: "Healthy Moms ♥ Brighter Tomorrows",
  nav: {
    pregnancy: "गर्भधारणा ट्रॅकर",
    baby: "बाळ आणि वाढ",
    reminders: "लसीकरण स्मरणपत्रे",
    nutrition: "दैनिक आहार मार्गदर्शक",
    environmental: "पर्यावरण आरोग्य",
    familyHealth: "कौटुंबिक जोखीम",
    aiAssistant: "मुमोरा एआय संवाद",
    vault: "वैद्यकीय नोंदी",
    postpartum: "प्रसूतीनंतरची काळजी",
    hospitals: "जवळची रुग्णालये",
    adminBlueprint: "प्रणाली आराखडा",
  },
  common: {
    ...EN_TRANSLATION.common,
    save: "जतन करा",
    cancel: "रद्द करा",
    delete: "हटवा",
    view: "पहा",
    edit: "संपादित करा",
    language: "भाषा",
    chooseLanguage: "तुमची भाषा निवडा",
    continueInLanguage: "पुढे चला",
    normal: "सामान्य",
    attention: "लक्ष देणे आवश्यक",
    mother: "आई",
    baby: "बाळ",
    all: "सर्व",
  },
};

export const ES_TRANSLATION: TranslationSchema = {
  ...EN_TRANSLATION,
  appName: "Mumora",
  tagline: "Healthy Moms ♥ Brighter Tomorrows",
  nav: {
    pregnancy: "Control Prenatal",
    baby: "Bebé y Crecimiento",
    reminders: "Recordatorios de Vacunas",
    nutrition: "Guía Nutricional Diaria",
    environmental: "Salud Ambiental",
    familyHealth: "Riesgo y Familia",
    aiAssistant: "Chat con Mumora AI",
    vault: "Historial Médico",
    postpartum: "Posparto y Emociones",
    hospitals: "Hospitales Cercanos",
    adminBlueprint: "Esquema del Sistema",
  },
  common: {
    ...EN_TRANSLATION.common,
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    view: "Ver",
    edit: "Editar",
    language: "Idioma",
    chooseLanguage: "Seleccione su idioma",
    continueInLanguage: "Continuar",
    normal: "Normal",
    attention: "Requiere atención",
    mother: "Madre",
    baby: "Bebé",
    all: "Todo",
  },
};

const BASE_DICTIONARY: Record<string, TranslationSchema> = {
  en: EN_TRANSLATION,
  hi: HI_TRANSLATION,
  te: TE_TRANSLATION,
  ta: TA_TRANSLATION,
  bn: BN_TRANSLATION,
  mr: MR_TRANSLATION,
  es: ES_TRANSLATION,
};

// Check if a language script uses Right-to-Left (RTL) writing
export const isRTL = (langCode: string): boolean => {
  const code = (langCode || '').toLowerCase().split('-')[0];
  return ['ar', 'ur', 'fa', 'he'].includes(code);
};

// Safe Proxy translation retriever to ensure zero missing keys across all supported languages
export function getTranslation(lang: string): TranslationSchema {
  const selected = BASE_DICTIONARY[lang] || BASE_DICTIONARY.en;
  return {
    ...EN_TRANSLATION,
    ...selected,
    appName: "Mumora",
    tagline: "Healthy Moms ♥ Brighter Tomorrows",
    nav: { ...EN_TRANSLATION.nav, ...(selected.nav || {}) },
    emergency: { ...EN_TRANSLATION.emergency, ...(selected.emergency || {}) },
    pregnancy: { ...EN_TRANSLATION.pregnancy, ...(selected.pregnancy || {}) },
    baby: { ...EN_TRANSLATION.baby, ...(selected.baby || {}) },
    assistant: { ...EN_TRANSLATION.assistant, ...(selected.assistant || {}) },
    records: { ...EN_TRANSLATION.records, ...(selected.records || {}) },
    postpartum: { ...EN_TRANSLATION.postpartum, ...(selected.postpartum || {}) },
    environmental: { ...EN_TRANSLATION.environmental, ...(selected.environmental || {}) },
    reminders: { ...EN_TRANSLATION.reminders, ...(selected.reminders || {}) },
    nutrition: { ...EN_TRANSLATION.nutrition, ...(selected.nutrition || {}) },
    familyHealth: { ...EN_TRANSLATION.familyHealth, ...(selected.familyHealth || {}) },
    auth: { ...EN_TRANSLATION.auth, ...(selected.auth || {}) },
    admin: { ...EN_TRANSLATION.admin, ...(selected.admin || {}) },
    common: { ...EN_TRANSLATION.common, ...(selected.common || {}) },
  };
}

// Proxied TRANSLATIONS mapping for backwards compatibility
export const TRANSLATIONS: Record<string, TranslationSchema> = new Proxy(
  BASE_DICTIONARY as any,
  {
    get: (_target, prop: string) => {
      return getTranslation(prop);
    },
  }
);

export const INITIAL_HOSPITAL_BAG_ITEMS = [
  { id: 'hb_1', category: 'mother' as const, item: 'Comfortable front-open feeding nighties / Kurtas (3-4 pairs)', itemHi: 'स्तनपान के अनुकूल फ्रंट-ओपन नाइटी या कुर्ते (3-4 जोड़ी)', itemTe: 'సౌకర్యవంతమైన ఫ్రంట్-ఓపెన్ నైటీలు / కుర్తాలు (3-4 జతలు)', isPacked: true, quantity: '3-4' },
  { id: 'hb_2', category: 'mother' as const, item: 'Maternity sanitary pads (extra absorbent, 2 packs)', itemHi: 'मैटरनिटी सेनेटरी पैड्स (अतिरिक्त सोखने वाले, 2 पैकेट)', itemTe: 'మెటర్నిటీ శానిటరీ ప్యాడ్లు (ఎక్కువ పీల్చుకునేవి, 2 ప్యాకెట్లు)', isPacked: true, quantity: '2 packs' },
  { id: 'hb_3', category: 'mother' as const, item: 'Nursing bras and breast pads', itemHi: 'नर्सिंग ब्रा और ब्रेस्ट पैड्स', itemTe: 'నర్సింగ్ బ్రాలు మరియు బ్రెస్ట్ ప్యాడ్లు', isPacked: false, quantity: '3' },
  { id: 'hb_4', category: 'mother' as const, item: 'Warm socks, slippers, and shawl/cardigan', itemHi: 'गर्म मोजे, चप्पल और शॉल / कार्डिगन', itemTe: 'వెచ్చని సాక్సులు, చెప్పులు మరియు శాలువా/కార్డిగాన్', isPacked: true, quantity: '2 pairs' },
  { id: 'hb_5', category: 'mother' as const, item: 'Toiletries: Toothbrush, soap, lip balm, hair ties', itemHi: 'टूथब्रश, साबुन, लिप बाम, बालों की रबरबैंड', itemTe: 'టూత్‌బ్రష్, సబ్బు, లిప్ బామ్, హెయిర్ టైస్', isPacked: true, quantity: '1 kit' },
  { id: 'hb_6', category: 'baby' as const, item: 'Soft washed cotton baby clothes (Jhablas) & swaddle cloths', itemHi: 'मुलायम सूती बच्चे के कपड़े (झबले) और लपेटने के कपड़े', itemTe: 'మెత్తటి ఉతికిన కాటన్ శిశువు దుస్తులు (ఝబ్లాలు) & చుట్టే వస్త్రాలు', isPacked: true, quantity: '5-6 sets' },
  { id: 'hb_7', category: 'baby' as const, item: 'Newborn diapers and water-based baby wipes', itemHi: 'नवजात डायपर और वाटर-बेस्ड बेबी वाइप्स', itemTe: 'నవజాత శిశువు డైపర్లు మరియు వాటర్-బేస్డ్ వైప్స్', isPacked: false, quantity: '1 pack' },
  { id: 'hb_8', category: 'baby' as const, item: 'Baby caps, mittens, and socks booties', itemHi: 'बच्चे की टोपी, दस्ताने और मोज़े', itemTe: 'శిశువు టోపీలు, మిట్టెన్లు మరియు సాక్స్ బూటీలు', isPacked: true, quantity: '3 pairs' },
  { id: 'hb_9', category: 'baby' as const, item: 'Soft baby blanket for discharge home', itemHi: 'घर लाते समय बच्चे के लिए मुलायम कंबल', itemTe: 'ఇంటికి తీసుకువెళ్ళేటప్పుడు శిశువు కోసం మెత్తటి దుప్పటి', isPacked: false, quantity: '1' },
  { id: 'hb_10', category: 'documents' as const, item: 'Complete antenatal file: All ultrasound scans & blood reports', itemHi: 'पूरी एंटीनेटल फाइल: सभी सोनोग्राफी और ब्लड रिपोर्ट्स', itemTe: 'పూర్తి గర్భధారణ ఫైల్: అన్ని అల్ట్రాసౌండ్ స్కాన్లు & రక్త పరీక్ష నివేదికలు', isPacked: true, quantity: 'Originals' },
  { id: 'hb_11', category: 'documents' as const, item: 'Mother & Partner Aadhaar Card & Government IDs', itemHi: 'माता और पिता का आधार कार्ड एवं सरकारी पहचान पत्र', itemTe: 'తల్లి మరియు భాగస్వామి ఆధార్ కార్డు & ప్రభుత్వ గుర్తింపు కార్డులు', isPacked: true, quantity: 'Copies + Orig' },
  { id: 'hb_12', category: 'documents' as const, item: 'Health Insurance TPA Card & Pre-authorization letters', itemHi: 'स्वास्थ्य बीमा (Health Insurance) कार्ड और दस्तावेज', itemTe: 'ఆరోగ్య బీమా (హెల్త్ ఇన్సూరెన్స్) కార్డు & అనుమతి లేఖలు', isPacked: true, quantity: '1 file' },
  { id: 'hb_13', category: 'partner' as const, item: 'Phone chargers with extra long cables and power bank', itemHi: 'फोन चार्जर और पावर बैंक', itemTe: 'ఫోన్ ఛార్జర్లు మరియు పవర్ బ్యాంక్', isPacked: true, quantity: '2' },
  { id: 'hb_14', category: 'partner' as const, item: 'Healthy snacks: Dry fruits, nuts, roasted makhana, biscuits', itemHi: 'पौष्टिक नाश्ता: मेवे, भुना मखाना, बिस्कुट', itemTe: 'ఆరోగ్యకరమైన స్నాక్స్: డ్రై ఫ్రూట్స్, గింజలు, మఖానా, బిస్కెట్లు', isPacked: false, quantity: '1 box' },
  { id: 'hb_15', category: 'partner' as const, item: 'Small cash and digital payment ready on phone', itemHi: 'छुट्टा नकद और फोन पर यूपीआई डिजिटल पेमेंट', itemTe: 'చిల్లర నగదు మరియు ఫోన్‌లో సిద్ధంగా ఉన్న UPI చెల్లింపులు', isPacked: true, quantity: '₹3000-5000' },
  { id: 'hb_16', category: 'documents' as const, item: 'Newborn Vaccine Card & BCG Birth Immunization Checklist', itemHi: 'नवजात शिशु टीकाकरण कार्ड एवं बीसीजी जन्म टीका चेकलिस्ट', itemTe: 'నవజాత శిశువు టీకా కార్డు & BCG బర్త్ ఇమ్యునైజేషన్ చెక్‌లిస్ట్', isPacked: true, quantity: '1 card' },
];

export const EPDS_QUESTIONS = [
  {
    id: 1,
    question: "I have been able to laugh and see the funny side of things:",
    questionHi: "मैं हंसने और बातों के सुखद पहलू को देखने में सक्षम रही हूँ:",
    questionTe: "నేను నవ్వగలగడం మరియు విషయాలలోని సరదా వైపును చూడగలగడం జరిగింది:",
    options: [
      { text: "As much as I always could", textHi: "हमेशा की तरह पूरी तरह", textTe: "ఎప్పటిలాగే పూర్తిగా", score: 0 },
      { text: "Not quite so much now", textHi: "अब पहले जितना नहीं", textTe: "ఇప్పుడు అంతగా కాదు", score: 1 },
      { text: "Definitely not so much now", textHi: "निश्चित रूप से अब बहुत कम", textTe: "ఖచ్చితంగా ఇప్పుడు చాలా తక్కువ", score: 2 },
      { text: "Not at all", textHi: "बिल्कुल नहीं", textTe: "అస్సలు లేదు", score: 3 },
    ]
  },
  {
    id: 2,
    question: "I have looked forward with enjoyment to things:",
    questionHi: "मैं आने वाली चीजों का खुशी से इंतजार करती रही हूँ:",
    questionTe: "నేను పనులను ఆనందంతో ఎదురుచూస్తూ చేశాను:",
    options: [
      { text: "As much as I ever did", textHi: "हमेशा की तरह उमंग से", textTe: "ఎప్పటిలాగే ఉత్సాహంగా", score: 0 },
      { text: "Rather less than I used to", textHi: "पहले की तुलना में कुछ कम", textTe: "మునుపటి కంటే కాస్త తక్కువ", score: 1 },
      { text: "Definitely less than I used to", textHi: "पहले से काफी कम", textTe: "మునుపటి కంటే చాలా తక్కువ", score: 2 },
      { text: "Hardly at all", textHi: "शायद ही कभी", textTe: "దాదాపు ఎప్పుడూ లేదు", score: 3 },
    ]
  },
  {
    id: 3,
    question: "I have blamed myself unnecessarily when things went wrong:",
    questionHi: "चीजें गलत होने पर मैंने बेवजह खुद को दोषी ठहराया है:",
    questionTe: "పనులు సరిగ్గా జరగనప్పుడు నన్ను నేను అనవసరంగా నిందించుకున్నాను:",
    options: [
      { text: "Yes, most of the time", textHi: "हाँ, ज्यादातर समय", textTe: "అవును, చాలా సమయాల్లో", score: 3 },
      { text: "Yes, some of the time", textHi: "हाँ, कभी-कभी", textTe: "అవును, కొన్నిసార్లు", score: 2 },
      { text: "Not very often", textHi: "बहुत कम बार", textTe: "చాలా అరుదుగా", score: 1 },
      { text: "No, never", textHi: "नहीं, कभी नहीं", textTe: "లేదు, ఎప్పుడూ లేదు", score: 0 },
    ]
  },
  {
    id: 4,
    question: "I have been anxious or worried for no good reason:",
    questionHi: "मैं बिना किसी ठोस वजह के चिंतित या घबराई हुई रही हूँ:",
    questionTe: "సరైన కారణం లేకుండా నేను ఆందోళన లేదా దిగులు చెందాను:",
    options: [
      { text: "No, not at all", textHi: "नहीं, बिल्कुल नहीं", textTe: "లేదు, అస్సలు లేదు", score: 0 },
      { text: "Hardly ever", textHi: "शायद ही कभी", textTe: "దాదాపు ఎప్పుడూ లేదు", score: 1 },
      { text: "Yes, sometimes", textHi: "हाँ, कभी-कभी", textTe: "అవును, కొన్నిసార్లు", score: 2 },
      { text: "Yes, very often", textHi: "हाँ, बहुत अधिक बार", textTe: "అవును, చాలా తరచుగా", score: 3 },
    ]
  },
  {
    id: 5,
    question: "I have felt scared or panicky for no very good reason:",
    questionHi: "मुझे बिना किसी खास वजह के डर या पैनिक महसूस हुआ है:",
    questionTe: "ప్రత్యేక కారణం లేకుండా నేను భయం లేదా ఆందోళనకు గురయ్యాను:",
    options: [
      { text: "Yes, quite a lot", textHi: "हाँ, काफी ज्यादा", textTe: "అవును, చాలా ఎక్కువగా", score: 3 },
      { text: "Yes, sometimes", textHi: "हाँ, कभी-कभी", textTe: "అవును, కొన్నిసార్లు", score: 2 },
      { text: "No, not much", textHi: "नहीं, ज्यादा नहीं", textTe: "లేదు, పెద్దగా లేదు", score: 1 },
      { text: "No, not at all", textHi: "नहीं, बिल्कुल नहीं", textTe: "లేదు, అస్సలు లేదు", score: 0 },
    ]
  },
  {
    id: 6,
    question: "Things have been getting on top of me (feeling overwhelmed):",
    questionHi: "जिम्मेदारियां मुझ पर हावी हो रही हैं (थकावट और लाचारी महसूस होना):",
    questionTe: "బాధ్యతలు నాపై భారంగా మారాయి (విపరీతమైన అలసట అనిపించడం):",
    options: [
      { text: "Yes, most of the time I haven't been able to cope", textHi: "हाँ, ज्यादातर समय मैं संभाल नहीं पा रही हूँ", textTe: "అవును, చాలా సమయాల్లో నేను తట్టుకోలేకపోతున్నాను", score: 3 },
      { text: "Yes, sometimes I haven't been coping as well as usual", textHi: "हाँ, कभी-कभी पहले जैसा नहीं संभाल पाती", textTe: "అవును, కొన్నిసార్లు సాధారణంగా నిర్వహించలేకపోతున్నాను", score: 2 },
      { text: "No, most of the time I have coped quite well", textHi: "नहीं, ज्यादातर समय अच्छी तरह संभाल रही हूँ", textTe: "లేదు, చాలా సమయాల్లో బాగానే నిర్వహిస్తున్నాను", score: 1 },
      { text: "No, I have been coping as well as ever", textHi: "नहीं, हमेशा की तरह पूरी तरह सक्षम हूँ", textTe: "లేదు, ఎప్పటిలాగే చక్కగా నిర్వహించగలుగుతున్నాను", score: 0 },
    ]
  },
  {
    id: 7,
    question: "I have been so unhappy that I have had difficulty sleeping:",
    questionHi: "मैं इतनी दुखी रही हूँ कि मुझे सोने में परेशानी हुई है:",
    questionTe: "నేను ఎంతగానో బాధపడి నిద్రపోవడానికి ఇబ్బంది పడ్డాను:",
    options: [
      { text: "Yes, most of the time", textHi: "हाँ, अधिकतर समय", textTe: "అవును, దాదాపు ఎక్కువ సమయం", score: 3 },
      { text: "Yes, sometimes", textHi: "हाँ, कभी-कभी", textTe: "అవును, కొన్నిసార్లు", score: 2 },
      { text: "Not very often", textHi: "बहुत कम बार", textTe: "చాలా అరుదుగా", score: 1 },
      { text: "No, not at all", textHi: "नहीं, बिल्कुल नहीं", textTe: "లేదు, అస్సలు లేదు", score: 0 },
    ]
  },
  {
    id: 8,
    question: "I have felt sad or miserable:",
    questionHi: "मैंने उदास या बेबस महसूस किया है:",
    questionTe: "నేను విచారంగా లేదా నిస్సహాయంగా భావించాను:",
    options: [
      { text: "Yes, most of the time", textHi: "हाँ, ज्यादातर समय", textTe: "అవుनु, చాలా సమయాల్లో", score: 3 },
      { text: "Yes, quite often", textHi: "हाँ, काफी बार", textTe: "అవును, తరచుగా", score: 2 },
      { text: "Not very often", textHi: "कभी-कभार ही", textTe: "అరుదుగానే", score: 1 },
      { text: "No, not at all", textHi: "नहीं, बिल्कुल नहीं", textTe: "లేదు, అస్సలు లేదు", score: 0 },
    ]
  },
  {
    id: 9,
    question: "I have been so unhappy that I have been crying:",
    questionHi: "मैं इतनी परेशान रही हूँ कि रोने लगी हूँ:",
    questionTe: "నేను బాధతో కన్నీరు పెట్టుకున్నాను:",
    options: [
      { text: "Yes, most of the time", textHi: "हाँ, लगभग रोज", textTe: "అవును, దాదాపు ప్రతిరోజూ", score: 3 },
      { text: "Yes, quite often", textHi: "हाँ, अक्सर", textTe: "అవును, చాలాసార్లు", score: 2 },
      { text: "Only occasionally", textHi: "केवल कभी-कभार", textTe: "కేవలం అప్పుడప్పుడు మాత్రమే", score: 1 },
      { text: "No, never", textHi: "नहीं, कभी नहीं", textTe: "లేదు, ఎప్పుడూ లేదు", score: 0 },
    ]
  },
  {
    id: 10,
    question: "The thought of harming myself has occurred to me:",
    questionHi: "खुद को नुकसान पहुंचाने का विचार मेरे मन में आया है:",
    questionTe: "నాకు నేను హాని చేసుకోవాలనే ఆలోచన వచ్చింది:",
    options: [
      { text: "Yes, quite often", textHi: "हाँ, अक्सर", textTe: "అవును, తరచుగా", score: 3 },
      { text: "Sometimes", textHi: "कभी-कभी", textTe: "కొన్నిసార్లు", score: 2 },
      { text: "Hardly ever", textHi: "शायद ही कभी", textTe: "దాదాపు ఎప్పుడూ లేదు", score: 1 },
      { text: "Never", textHi: "कभी नहीं", textTe: "ఎప్పుడూ లేదు", score: 0 },
    ]
  }
];
