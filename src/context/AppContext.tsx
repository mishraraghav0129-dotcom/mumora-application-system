import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  PregnancyProfile,
  BabyProfile,
  MaternalVitalLog,
  BabyGrowthLog,
  FeedingLog,
  DiaperLog,
  SleepLog,
  VaccineRecord,
  DocumentRecord,
  HospitalBagItem,
  Language,
  AppMode,
  ConsentSettings,
  ParentMedicalHistory,
  FamilyPedigreeHistory,
  RelativeHealthRecord,
  LifestyleEnvironmentalProfile,
  BabyRiskAssessmentResult,
  CarePlanActionItem,
  HealthTimelineEvent,
  NutritionProfile,
  MealPlanItem,
  GroceryItem,
  HealthReminder,
  ReminderSettings,
  NotificationLog,
  ChildMedicalReport,
  ChildDietPlan,
  ChildEnvironmentalAssessment,
  FetalProfile,
  FetalUltrasoundMeasurement,
  DynamicDietAdaptation,
} from '../types';
import { calculatePregnancyProgress } from '../data/pregnancyWeeks';
import { calculateVaccineDueDates } from '../data/vaccines';
import { INITIAL_HOSPITAL_BAG_ITEMS, isRTL } from '../data/translations';
import {
  evaluateBabyHealthRisks,
  SAMPLE_CARE_PLAN_ITEMS,
  CHRONOLOGICAL_HEALTH_TIMELINE,
} from '../data/clinicalReferences';
import {
  generateDailyMealPlan,
  SAMPLE_GROCERY_LIST,
} from '../data/nutritionData';
import { generateDynamicDietPlan } from '../services/dietReportEngine';

import {
  DEFAULT_REMINDER_SETTINGS,
  INITIAL_SMART_REMINDERS,
} from '../data/vaccinationReminders';
import {
  AuthUser,
  getActiveSession,
  clearAuthSession,
  loginUserAccount,
  registerUserAccount,
  getRegisteredUsers,
  loadUserDataPartition,
  saveUserDataPartition,
} from '../services/authService';
import { AdminUser, AdminRole, AdminService } from '../services/adminService';

interface AppContextType {
  // User Authentication & Session
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, passwordAttempt: string) => Promise<{ success: boolean; error?: string }>;
  signup: (params: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Admin Authentication & Session
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  setAdminUser: (admin: AdminUser | null) => void;
  adminLogin: (role: AdminRole) => { success: boolean };
  adminLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  showEmergencyModal: boolean;
  setShowEmergencyModal: (show: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (show: boolean) => void;
  consent: ConsentSettings;
  updateConsent: (settings: Partial<ConsentSettings>) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  maternalHistory: ParentMedicalHistory;
  updateMaternalHistory: (history: Partial<ParentMedicalHistory>) => void;
  paternalHistory: ParentMedicalHistory;
  updatePaternalHistory: (history: Partial<ParentMedicalHistory>) => void;
  familyPedigree: FamilyPedigreeHistory;
  updateFamilyPedigree: (pedigree: Partial<FamilyPedigreeHistory>) => void;
  addRelativeRecord: (record: Omit<RelativeHealthRecord, 'id'>) => void;
  removeRelativeRecord: (id: string) => void;
  lifestyleProfile: LifestyleEnvironmentalProfile;
  updateLifestyleProfile: (profile: Partial<LifestyleEnvironmentalProfile>) => void;
  babyRiskAssessment: BabyRiskAssessmentResult;
  recomputeBabyRiskAssessment: () => void;
  carePlanItems: CarePlanActionItem[];
  toggleCarePlanItem: (id: string) => void;
  timelineEvents: HealthTimelineEvent[];
  // Nutrition & Local Food Recommendation Engine
  nutritionProfile: NutritionProfile;
  updateNutritionProfile: (profile: Partial<NutritionProfile>) => void;
  dailyMealPlan: MealPlanItem[];
  setDailyMealPlan: (meals: MealPlanItem[]) => void;
  toggleMealItemStatus: (mealId: string, statusKey: 'isLiked' | 'isDisliked' | 'isEaten' | 'isUnavailable') => void;
  groceryList: GroceryItem[];
  toggleGroceryItem: (id: string) => void;
  addGroceryItem: (name: string, quantity: string, category: GroceryItem['category']) => void;
  foodCity: string;
  setFoodCity: (city: string) => void;
  regenerateMealPlan: () => void;
  adaptiveDietPlan: DynamicDietAdaptation | null;
  reassessDietPlanWithReport: (reportId?: string) => void;
  adaptationHistory: DynamicDietAdaptation[];
  // Smart Vaccination & Health Reminders (3-Day Rule)
  healthReminders: HealthReminder[];
  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  addHealthReminder: (reminder: Omit<HealthReminder, 'id'>) => void;
  toggleReminderCompleted: (id: string) => void;
  snoozeReminder: (id: string, days?: number) => void;
  rescheduleReminder: (id: string, newDueDate: string, newDueTime?: string) => void;
  deleteReminder: (id: string) => void;
  notificationLogs: NotificationLog[];
  dismissNotificationLog: (id: string) => void;
  restoreDefaultReminderSettings: () => void;
  requestBrowserNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
  pregnancy: PregnancyProfile;
  updatePregnancyLmp: (lmpDate: string) => void;
  updatePregnancyWeek: (week: number) => void;
  vitalLogs: MaternalVitalLog[];
  addVitalLog: (log: Omit<MaternalVitalLog, 'id'>) => void;
  activeBaby: BabyProfile;
  babies: BabyProfile[];
  activeBabyId: string;
  setActiveBabyId: (id: string) => void;
  addBabyProfile: (baby: Omit<BabyProfile, 'id'>) => string;
  updateBabyProfile: (idOrBaby: string | Partial<BabyProfile>, updates?: Partial<BabyProfile>) => void;
  deleteBabyProfile: (id: string) => void;
  archiveBabyProfile: (id: string) => void;
  babyGrowthMode: 'my_babies' | 'fetal_growth';
  setBabyGrowthMode: (mode: 'my_babies' | 'fetal_growth') => void;
  familySituation: 'has_children_only' | 'pregnant_only' | 'pregnant_and_has_children' | 'planning_pregnancy';
  setFamilySituation: (s: 'has_children_only' | 'pregnant_only' | 'pregnant_and_has_children' | 'planning_pregnancy') => void;
  childReports: ChildMedicalReport[];
  addChildReport: (report: Omit<ChildMedicalReport, 'id'>) => void;
  deleteChildReport: (id: string) => void;
  fetalProfile: FetalProfile;
  updateFetalProfile: (profile: Partial<FetalProfile>) => void;
  addUltrasoundMeasurement: (scan: Omit<FetalUltrasoundMeasurement, 'id'>) => void;
  transitionBabyBorn: (birthDetails: {
    name: string;
    birthDate: string;
    gender: 'boy' | 'girl';
    birthWeightKg: number;
    birthLengthCm: number;
    birthHeadCircumferenceCm?: number;
    gestationalAgeWeeksAtBirth?: number;
  }) => string;
  growthLogs: BabyGrowthLog[];
  addGrowthLog: (log: Omit<BabyGrowthLog, 'id'>) => void;
  feedingLogs: FeedingLog[];
  addFeedingLog: (log: Omit<FeedingLog, 'id'>) => void;
  diaperLogs: DiaperLog[];
  addDiaperLog: (log: Omit<DiaperLog, 'id'>) => void;
  sleepLogs: SleepLog[];
  addSleepLog: (log: Omit<SleepLog, 'id'>) => void;
  vaccines: VaccineRecord[];
  toggleVaccineStatus: (id: string) => void;
  documents: DocumentRecord[];
  addDocument: (doc: Omit<DocumentRecord, 'id'>) => void;
  hospitalBag: HospitalBagItem[];
  toggleHospitalBagItem: (id: string) => void;
  addHospitalBagItem: (item: string, itemHi: string, category: 'mother' | 'baby' | 'partner' | 'documents') => void;
  exportUserDataJson: () => string;
  deleteUserData: () => void;
  resetToSampleData: () => void;
}

// Clean empty profiles for new users — strictly no pre-filled personal data
export const EMPTY_USER_PROFILE: UserProfile = {
  id: '',
  name: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  bloodGroup: '',
  rhFactor: 'unknown',
  country: '',
  country_code: '',
  country_name: '',
  city: '',
  state: '',
  state_region_code: '',
  state_region_name: '',
  district: '',
  district_code: '',
  district_name: '',
  latitude: undefined,
  longitude: undefined,
  gpsPermissionGranted: false,
  postalCode: '',
  ancestryOrigin: '',
  familyStructure: '',
  householdEnvironment: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  primaryHospital: '',
  doctorName: '',
  doctorPhone: '',
  preferredLanguage: 'en',
  enableLocationBasedHealthIntelligence: true,
  onboardingCompleted: false,
};

export const EMPTY_CONSENT: ConsentSettings = {
  healthDataProcessing: false,
  aiAnalysisConsent: false,
  locationPermission: false,
  dataRetentionAgreed: false,
  allowManualLocationOverride: true,
};

export const EMPTY_MATERNAL_HISTORY: ParentMedicalHistory = {
  parentRole: 'mother',
  fullName: '',
  dateOfBirth: '',
  bloodGroup: '',
  rhFactor: 'unknown',
  preExistingConditions: [],
  geneticDisorders: [],
  geneticScreeningDone: false,
  geneticScreeningDetails: '',
  allergies: [],
  currentMedications: [],
  currentSupplements: [],
  surgeriesAndAdmissions: [],
  infectiousDiseaseHistory: [],
  statusSummary: 'known_healthy',
};

export const EMPTY_PATERNAL_HISTORY: ParentMedicalHistory = {
  parentRole: 'father',
  fullName: '',
  dateOfBirth: '',
  bloodGroup: '',
  rhFactor: 'unknown',
  preExistingConditions: [],
  geneticDisorders: [],
  geneticScreeningDone: false,
  geneticScreeningDetails: '',
  allergies: [],
  currentMedications: [],
  currentSupplements: [],
  surgeriesAndAdmissions: [],
  infectiousDiseaseHistory: [],
  statusSummary: 'known_healthy',
};

export const EMPTY_FAMILY_PEDIGREE: FamilyPedigreeHistory = {
  maternalSideUnknown: false,
  paternalSideUnknown: false,
  consanguinity: false,
  records: [],
  knownHereditarySyndromes: [],
  recurrentPregnancyLossInFamily: false,
  unexplainedEarlyInfantDeaths: false,
  lastUpdated: '',
};

export const EMPTY_LIFESTYLE: LifestyleEnvironmentalProfile = {
  nutritionHabits: 'vegetarian',
  physicalActivityLevel: 'light_walking',
  averageSleepHours: 8,
  dailyWaterLiters: 2.5,
  tobaccoExposure: 'none',
  alcoholConsumption: 'none',
  occupationalExposures: [],
  householdAirPollution: 'none',
  accessToCare: 'good_clinic',
  vaccinesCurrent: true,
  notes: '',
};

export const EMPTY_NUTRITION_PROFILE: NutritionProfile = {
  dietaryPreference: 'vegetarian',
  customDietaryNotes: '',
  foodAllergies: [],
  avoidedFoods: [],
  avoidanceReasons: [],
  favoriteCuisines: [],
  dislikedFoods: [],
  dailyBudgetLevel: 'moderate',
  mealsPerDay: 4,
  preferredMealTimings: {
    breakfast: '08:30 AM',
    lunch: '01:15 PM',
    dinner: '08:00 PM',
  },
  cookingStyle: 'mostly_home_cooked',
  kitchenFacilities: ['Full kitchen & stove'],
  waterIntakeGoalLiters: 2.5,
  lastUpdated: '',
};

export const EMPTY_PREGNANCY: PregnancyProfile = {
  id: '',
  lastMenstrualPeriod: '',
  estimatedDueDate: '',
  currentWeek: 0,
  currentDay: 0,
  trimester: 1,
  pregnancyType: 'singleton',
  highRiskFlags: [],
  prePregnancyWeightKg: 60,
};

// Seed demo account: Ananya Sharma (Demo testing only, never for new users)
const DEFAULT_USER: UserProfile = {
  id: 'usr_ananya_001',
  name: 'Ananya Sharma',
  dateOfBirth: '1998-04-12',
  email: 'ananya.sharma@example.in',
  phone: '+91 98765 43210',
  bloodGroup: 'B Positive (B+)',
  rhFactor: '+',
  country: 'India',
  city: 'Bengaluru',
  state: 'Karnataka',
  district: 'Bengaluru Urban',
  postalCode: '560041',
  ancestryOrigin: 'South Asian (Indian)',
  familyStructure: 'Nuclear family with visiting maternal grandparents',
  householdEnvironment: 'Urban apartment, well-ventilated, water filtration installed',
  emergencyContactName: 'Rahul Sharma (Husband)',
  emergencyContactPhone: '+91 98765 43211',
  emergencyContactRelation: 'Spouse / Partner',
  primaryHospital: 'Cloudnine Maternity Hospital, Jayanagar',
  doctorName: 'Dr. Priya Venkatesh (MBBS, DGO, MD)',
  doctorPhone: '+91 98111 22334',
  preferredLanguage: 'en',
  onboardingCompleted: true,
};

const DEFAULT_CONSENT: ConsentSettings = {
  healthDataProcessing: true,
  aiAnalysisConsent: true,
  locationPermission: true,
  dataRetentionAgreed: true,
  termsAcceptedDate: '2026-05-08',
  allowManualLocationOverride: true,
};

const DEFAULT_MATERNAL_HISTORY: ParentMedicalHistory = {
  parentRole: 'mother',
  fullName: 'Ananya Sharma',
  dateOfBirth: '1998-04-12',
  bloodGroup: 'B Positive (B+)',
  rhFactor: '+',
  preExistingConditions: ['Mild Gestational Glycemic Vulnerability (Screening Pending)'],
  geneticDisorders: [],
  geneticScreeningDone: true,
  geneticScreeningDetails:
    'First-trimester dual marker combined screening completed — Screen Negative (Low Risk). HPLC normal (HbA2 2.4%).',
  allergies: ['Penicillin (Mild urticarial rash)'],
  currentMedications: [],
  currentSupplements: [
    'Folic Acid 5 mg',
    'Ferrous Ascorbate 100 mg (Elemental Iron)',
    'Calcium Carbonate 500 mg with Vitamin D3',
  ],
  surgeriesAndAdmissions: ['None'],
  previousPregnancyOutcomes: {
    totalPregnancies: 1,
    liveBirths: 0,
    miscarriages: 0,
    complications: ['Primigravida (First pregnancy)'],
  },
  infectiousDiseaseHistory: [
    'Rubella IgG Immune (> 15 IU/mL)',
    'HBsAg Non-reactive',
    'HIV Non-reactive',
    'VDRL Non-reactive',
  ],
  statusSummary: 'known_healthy',
};

const DEFAULT_PATERNAL_HISTORY: ParentMedicalHistory = {
  parentRole: 'father',
  fullName: 'Rahul Sharma',
  dateOfBirth: '1996-08-25',
  bloodGroup: 'B Positive (B+)',
  rhFactor: '+',
  preExistingConditions: ['None reported'],
  geneticDisorders: [],
  geneticScreeningDone: true,
  geneticScreeningDetails:
    'CBC red blood cell indices normal; HPLC Hemoglobin variant analysis normal (HbA2 2.2%).',
  allergies: ['No known allergies (NKDA)'],
  currentMedications: [],
  currentSupplements: [],
  surgeriesAndAdmissions: ['Appendectomy in 2018 (Resolved without complications)'],
  infectiousDiseaseHistory: ['HBsAg Non-reactive'],
  statusSummary: 'known_healthy',
};

const DEFAULT_FAMILY_PEDIGREE: FamilyPedigreeHistory = {
  maternalSideUnknown: false,
  paternalSideUnknown: false,
  consanguinity: false,
  knownHereditarySyndromes: [],
  recurrentPregnancyLossInFamily: false,
  unexplainedEarlyInfantDeaths: false,
  lastUpdated: '2026-10-22',
  records: [
    {
      id: 'ped_1',
      relationship: 'maternal_grandmother',
      relationshipSide: 'maternal',
      relativeName: 'Kalyani Devi',
      condition: 'Type 2 Diabetes Mellitus',
      ageOfOnset: 54,
      isCarrier: false,
      notes: 'Controlled on oral hypoglycemics; monitored routinely.',
      status: 'confirmed',
    },
    {
      id: 'ped_2',
      relationship: 'paternal_grandfather',
      relationshipSide: 'paternal',
      relativeName: 'Ramakant Sharma',
      condition: 'Essential Hypertension',
      ageOfOnset: 60,
      isCarrier: false,
      notes: 'Age-related essential hypertension; well-managed.',
      status: 'confirmed',
    },
  ],
};

const DEFAULT_LIFESTYLE: LifestyleEnvironmentalProfile = {
  nutritionHabits: 'balanced_omnivore',
  physicalActivityLevel: 'light_walking',
  averageSleepHours: 7.5,
  dailyWaterLiters: 2.8,
  tobaccoExposure: 'none',
  alcoholConsumption: 'none',
  occupationalExposures: ['Computer desk workstation'],
  householdAirPollution: 'none',
  accessToCare: 'excellent_tertiary',
  vaccinesCurrent: true,
  notes: 'Consistently maintains hydration, walks 30 minutes in morning.',
};

const DEFAULT_NUTRITION_PROFILE: NutritionProfile = {
  dietaryPreference: 'vegetarian',
  customDietaryNotes: 'Prefers mild spices, avoids excess green chili',
  foodAllergies: [],
  avoidedFoods: ['Raw papaya', 'Unpasteurized soft cheese', 'Deep fried street food'],
  avoidanceReasons: ['medical', 'personal'],
  favoriteCuisines: ['South Indian', 'Awadhi / North Indian', 'Maharashtrian'],
  dislikedFoods: ['Bitter gourd (Karela)'],
  dailyBudgetLevel: 'moderate',
  mealsPerDay: 5,
  preferredMealTimings: {
    breakfast: '08:30 AM',
    lunch: '01:15 PM',
    dinner: '07:45 PM',
  },
  cookingStyle: 'mostly_home_cooked',
  kitchenFacilities: ['Full kitchen & stove', 'Refrigerator', 'Blender / Mixer'],
  waterIntakeGoalLiters: 2.8,
  lastUpdated: '2026-10-23',
};

// Initial pregnancy starting ~24 weeks ago
const INITIAL_LMP = '2026-05-08';
const progress = calculatePregnancyProgress(INITIAL_LMP);

const DEFAULT_PREGNANCY: PregnancyProfile = {
  id: 'preg_001',
  lastMenstrualPeriod: INITIAL_LMP,
  estimatedDueDate: progress.eddFormatted,
  currentWeek: 24,
  currentDay: 2,
  trimester: 2,
  pregnancyType: 'singleton',
  highRiskFlags: ['Gestational Diabetes Screen Pending'],
  prePregnancyWeightKg: 58,
};

const DEFAULT_BABIES: BabyProfile[] = [
  {
    id: 'baby_001',
    name: 'Aarav Sharma',
    gender: 'boy',
    birthDate: '2026-07-15',
    birthTime: '09:42 AM',
    birthWeightKg: 3.25,
    birthLengthCm: 50.0,
    birthHeadCircumferenceCm: 34.5,
    gestationalAgeWeeksAtBirth: 39,
    isPremature: false,
    bloodGroup: 'B Positive (B+)',
    pediatricianName: 'Dr. Suresh Rao (MD Pediatrics)',
    pediatricianPhone: '+91 98222 33445',
    birthHistory: 'Full-term spontaneous vaginal delivery, APGAR 9/10, no NICU admission',
    medicalConditions: [],
    allergies: ['No known allergies (NKDA)'],
    currentMedications: ['Vitamin D3 drops 400 IU daily'],
    feedingMethod: 'exclusive_breastfeeding',
    householdCircumstances: {
      dietaryPattern: 'vegetarian',
      drinkingWaterSource: 'Reverse Osmosis filtration',
      indoorSmokeExposure: false,
      smokingInHousehold: false,
    },
  },
  {
    id: 'baby_002',
    name: 'Anvi Sharma',
    gender: 'girl',
    birthDate: '2026-08-28',
    birthTime: '03:15 PM',
    birthWeightKg: 2.15,
    birthLengthCm: 44.5,
    birthHeadCircumferenceCm: 31.0,
    gestationalAgeWeeksAtBirth: 34,
    isPremature: true,
    bloodGroup: 'B Positive (B+)',
    pediatricianName: 'Dr. Suresh Rao (MD Pediatrics)',
    pediatricianPhone: '+91 98222 33445',
    birthHistory: 'Late preterm delivery at 34 weeks due to PPROM; 8 days NICU step-down monitoring; phototherapy for physiological jaundice resolved',
    medicalConditions: ['Prematurity follow-up', 'Resolved Neonatal Hyperbilirubinemia'],
    allergies: ['Cow Milk Protein sensitive (breastfed with maternal dairy restriction)'],
    currentMedications: ['Iron supplement drops (Ferrous sulfate 2 mg/kg/day)', 'Vitamin D3 drops 400 IU'],
    feedingMethod: 'mixed_breast_and_formula',
    householdCircumstances: {
      dietaryPattern: 'vegetarian',
      drinkingWaterSource: 'RO purified + boiled water',
      indoorSmokeExposure: false,
      smokingInHousehold: false,
    },
  },
];

const DEFAULT_BABY = DEFAULT_BABIES[0];

const DEFAULT_CHILD_REPORTS: ChildMedicalReport[] = [
  {
    id: 'cr_1',
    babyId: 'baby_001',
    fileName: 'Lab_CBC_SerumFerritin_3M.pdf',
    category: 'cbc_blood',
    testName: '3-Month Well-Baby & Complete Blood Count (CBC)',
    collectionDate: '2026-10-15',
    reportDate: '2026-10-15',
    facilityOrLab: 'Cloudnine Diagnostic Laboratory',
    parameters: [
      { label: 'Hemoglobin (Hb)', value: '11.4', unit: 'g/dL', referenceInterval: '10.5 - 13.5 g/dL', status: 'normal' },
      { label: 'Hematocrit (PCV)', value: '34.2', unit: '%', referenceInterval: '31 - 41 %', status: 'normal' },
      { label: 'Total Leukocyte Count (WBC)', value: '8,400', unit: '/mcL', referenceInterval: '6,000 - 14,000 /mcL', status: 'normal' },
      { label: 'Platelet Count', value: '320,000', unit: '/mcL', referenceInterval: '150,000 - 450,000 /mcL', status: 'normal' },
      { label: 'Serum Ferritin', value: '48', unit: 'ng/mL', referenceInterval: '30 - 150 ng/mL', status: 'normal' },
    ],
    extractedSummary: 'Normocytic normochromic red cells. Adequate iron stores for age. Normal developmental progress.',
    pediatricianReviewNeeded: false,
    doctorQuestions: [
      'Should we continue routine Vitamin D3 drops (400 IU)?',
      'When is the next developmental anthropometry review scheduled?',
    ],
  },
  {
    id: 'cr_2',
    babyId: 'baby_002',
    fileName: 'NICU_Discharge_Summary_Anvi.pdf',
    category: 'discharge_summary',
    testName: 'NICU Discharge Summary & Preterm Metabolic Panel',
    collectionDate: '2026-09-08',
    reportDate: '2026-09-08',
    facilityOrLab: 'Manipal Hospital NICU Services',
    parameters: [
      { label: 'Gestational Age at Birth', value: '34+2', unit: 'weeks', referenceInterval: '37 - 42 weeks', status: 'low' },
      { label: 'Birth Weight', value: '2.15', unit: 'kg', referenceInterval: '2.5 - 4.0 kg', status: 'low' },
      { label: 'Discharge Weight', value: '2.38', unit: 'kg', referenceInterval: '> 2.2 kg', status: 'normal' },
      { label: 'Serum Bilirubin (Total at discharge)', value: '6.2', unit: 'mg/dL', referenceInterval: '< 12 mg/dL', status: 'normal' },
      { label: 'Serum Calcium', value: '9.2', unit: 'mg/dL', referenceInterval: '8.8 - 10.8 mg/dL', status: 'normal' },
    ],
    extractedSummary: 'Preterm infant discharged in stable condition. Tolerating full enteral feeds. Hearing screen (OAE) passed bilaterally. ROP screening scheduled at 4 weeks chronologic.',
    pediatricianReviewNeeded: true,
    doctorQuestions: [
      'What is the precise schedule for preterm corrected-age growth checkups?',
      'How long should supplemental elemental iron drops be maintained?',
    ],
  },
];

const DEFAULT_FETAL_PROFILE: FetalProfile = {
  id: 'fetal_001',
  motherName: 'Ananya Sharma',
  fetalDisplayName: 'Baby of Ananya Sharma',
  lmpDate: '2026-05-08',
  eddDate: '2026-08-25',
  eddSource: 'clinician_ultrasound_confirmed',
  currentGestationalWeeks: 24,
  currentGestationalDays: 2,
  pregnancyType: 'singleton',
  datingStatus: 'confirmed',
  ultrasounds: [
    {
      id: 'us_1',
      date: '2026-07-28',
      gestationalWeek: 12,
      crownRumpLengthMm: 61.2,
      biparietalDiameterMm: 21.0,
      placentaLocation: 'Posterior high',
      amnioticFluidIndexCm: 12.0,
      clinicianNotes: 'NT scan 1.3 mm (Normal). Nasal bone visualized.',
      reportingFacility: 'Cloudnine Maternity Diagnostic Center',
      isDoctorConfirmed: true,
    },
    {
      id: 'us_2',
      date: '2026-09-22',
      gestationalWeek: 20,
      biparietalDiameterMm: 48.0,
      headCircumferenceMm: 178,
      abdominalCircumferenceMm: 154,
      femurLengthMm: 33.5,
      estimatedFetalWeightGrams: 360,
      placentaLocation: 'Posterior, away from os',
      amnioticFluidIndexCm: 14.2,
      clinicianNotes: 'Anomaly scan (TIFFA): Normal fetal anatomy, no structural defects detected.',
      reportingFacility: 'Cloudnine Maternity Diagnostic Center',
      isDoctorConfirmed: true,
    },
    {
      id: 'us_3',
      date: '2026-10-18',
      gestationalWeek: 24,
      biparietalDiameterMm: 60.5,
      headCircumferenceMm: 224,
      abdominalCircumferenceMm: 198,
      femurLengthMm: 43.8,
      estimatedFetalWeightGrams: 670,
      placentaLocation: 'Posterior grade 1',
      amnioticFluidIndexCm: 13.8,
      clinicianNotes: 'Routine growth check: appropriate for gestational age (50th percentile).',
      reportingFacility: 'Cloudnine Maternity Diagnostic Center',
      isDoctorConfirmed: true,
    },
  ],
  antenatalNotes: [
    'First trimester combined screening: Low Risk (Screen Negative)',
    'TIFFA anatomy scan complete: Normal morphology',
    'Active fetal kicks documented in maternal vitals',
  ],
};

const DEFAULT_VITALS: MaternalVitalLog[] = [
  {
    id: 'v_1',
    date: '2026-10-22',
    time: '08:30 AM',
    gestationalWeek: 24,
    weightKg: 64.2,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    bloodSugarMgDl: 88,
    bloodSugarType: 'fasting',
    fetalKicksCount: 10,
    notes: 'Feeling energetic; morning walk completed.',
  },
  {
    id: 'v_2',
    date: '2026-10-20',
    time: '08:45 AM',
    gestationalWeek: 23,
    weightKg: 63.8,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 78,
    bloodSugarMgDl: 114,
    bloodSugarType: 'post_prandial_2h',
    fetalKicksCount: 11,
    notes: 'Good kicks after breakfast.',
  },
  {
    id: 'v_3',
    date: '2026-10-15',
    time: '09:00 AM',
    gestationalWeek: 23,
    weightKg: 63.3,
    bloodPressureSystolic: 116,
    bloodPressureDiastolic: 74,
    bloodSugarMgDl: 85,
    bloodSugarType: 'fasting',
    fetalKicksCount: 10,
    notes: 'Vitals stable.',
  },
];

const DEFAULT_GROWTH: BabyGrowthLog[] = [
  {
    id: 'bg_1',
    babyId: 'baby_001',
    date: '2026-07-15',
    ageInMonths: 0,
    weightKg: 3.25,
    lengthCm: 50.0,
    headCircumferenceCm: 34.5,
    notes: 'Birth measurement.',
  },
  {
    id: 'bg_2',
    babyId: 'baby_001',
    date: '2026-08-15',
    ageInMonths: 1,
    weightKg: 4.4,
    lengthCm: 54.2,
    headCircumferenceCm: 37.0,
    notes: '1 month pediatric checkup; exclusive breastfeeding.',
  },
  {
    id: 'bg_3',
    babyId: 'baby_001',
    date: '2026-09-15',
    ageInMonths: 2,
    weightKg: 5.5,
    lengthCm: 58.0,
    headCircumferenceCm: 39.2,
    notes: '2 months checkup; strong head control.',
  },
  {
    id: 'bg_4',
    babyId: 'baby_001',
    date: '2026-10-15',
    ageInMonths: 3,
    weightKg: 6.3,
    lengthCm: 61.5,
    headCircumferenceCm: 40.8,
    notes: '3 months checkup; smiling and cooing.',
  },
];

const DEFAULT_FEEDING: FeedingLog[] = [
  { id: 'f_1', babyId: 'baby_001', timestamp: '2026-10-23T07:15:00', type: 'both_breasts', durationMinutes: 20, notes: 'Good latch on both sides' },
  { id: 'f_2', babyId: 'baby_001', timestamp: '2026-10-23T10:00:00', type: 'expressed_milk', amountMl: 110, notes: 'Fed by father' },
  { id: 'f_3', babyId: 'baby_001', timestamp: '2026-10-23T13:30:00', type: 'breast_left', durationMinutes: 15, notes: 'Calm feeding' },
];

const DEFAULT_DIAPERS: DiaperLog[] = [
  { id: 'd_1', babyId: 'baby_001', timestamp: '2026-10-23T07:30:00', type: 'wet', notes: 'Heavy wet diaper' },
  { id: 'd_2', babyId: 'baby_001', timestamp: '2026-10-23T10:45:00', type: 'both', stoolConsistency: 'soft', stoolColor: 'mustard', notes: 'Normal breastfed stool' },
  { id: 'd_3', babyId: 'baby_001', timestamp: '2026-10-23T14:00:00', type: 'wet', notes: 'Clear urine' },
];

const DEFAULT_SLEEP: SleepLog[] = [
  { id: 's_1', babyId: 'baby_001', startTime: '2026-10-23T08:00', endTime: '2026-10-23T09:30', durationMinutes: 90, quality: 'peaceful' },
  { id: 's_2', babyId: 'baby_001', startTime: '2026-10-23T11:30', endTime: '2026-10-23T13:00', durationMinutes: 90, quality: 'peaceful' },
];

const DEFAULT_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc_1',
    title: 'Level II Anomaly / TIFFA Ultrasound Scan',
    category: 'ultrasound',
    date: '2026-09-22',
    fileName: 'TIFFA_Scan_Report_W20.pdf',
    extractedText: 'Single live intrauterine gestation in cephalic presentation. BPD: 48mm, FL: 33mm, AC: 152mm. Estimated fetal weight: 340g. Amniotic fluid index (AFI): 14.2 cm. Placenta: Posterior, Grade I maturity, well away from internal os. Four chamber cardiac view normal.',
    aiExplanation: 'The Level II TIFFA scan at 20 weeks confirms normal fetal anatomical development. Fetal measurements match 20 weeks and 1 day. Amniotic fluid (AFI 14.2 cm) is optimal (normal range 8-18 cm). Placenta is in a safe posterior location with no placenta previa.',
    doctorQuestions: [
      'Is the baby head-down presentation likely to remain until term?',
      'Do I need another Doppler or growth scan in the third trimester?'
    ],
    keyParameters: [
      { label: 'Gestational Age', value: '20W 1D', isNormal: true },
      { label: 'Amniotic Fluid (AFI)', value: '14.2 cm', isNormal: true, referenceRange: '8 - 18 cm' },
      { label: 'Placenta Location', value: 'Posterior Grade I', isNormal: true },
      { label: 'Fetal Heart Rate', value: '146 bpm', isNormal: true, referenceRange: '120 - 160 bpm' },
    ]
  },
  {
    id: 'doc_2',
    title: 'Second Trimester Complete Blood Count (CBC) & Sugar',
    category: 'blood_test',
    date: '2026-10-05',
    fileName: 'Lab_Hematology_CBC_OGTT.pdf',
    extractedText: 'Hemoglobin: 11.4 g/dL. Total WBC: 8,900 /uL. Platelets: 210,000 /uL. Fasting Blood Glucose: 86 mg/dL. 2-Hour Post 75g Glucose (OGTT): 122 mg/dL. TSH: 1.82 uIU/mL.',
    aiExplanation: 'Your blood counts are reassuring. Hemoglobin at 11.4 g/dL shows mild physiological hemodilution but is well within target for the 2nd trimester (≥11 g/dL). Both Fasting (86 mg/dL) and 2-Hour OGTT (122 mg/dL) are safely below gestational diabetes cutoffs (<92 mg/dL fasting, <140 mg/dL 2-hr). TSH is in the safe trimester-specific range.',
    doctorQuestions: [
      'Should I continue the current dose of Iron (Ferrous Ascorbate 100mg)?',
      'When should my next routine Hemoglobin check take place?'
    ],
    keyParameters: [
      { label: 'Hemoglobin (Hb)', value: '11.4 g/dL', isNormal: true, referenceRange: '≥ 11.0 g/dL' },
      { label: 'Fasting Blood Sugar', value: '86 mg/dL', isNormal: true, referenceRange: '< 92 mg/dL' },
      { label: '2-Hr OGTT (75g)', value: '122 mg/dL', isNormal: true, referenceRange: '< 140 mg/dL' },
      { label: 'Thyroid TSH', value: '1.82 uIU/mL', isNormal: true, referenceRange: '0.2 - 3.0 uIU/mL' }
    ]
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const session = getActiveSession();
    if (session) {
      const users = getRegisteredUsers();
      return users.find(u => u.id === session.userId) || null;
    }
    return null;
  });

  const isAuthenticated = !!currentUser;

  // Admin Authentication State
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(() => {
    return AdminService.getActiveAdminSession();
  });
  const isAdminAuthenticated = !!adminUser;

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mb_lang') as Language) || 'en';
  });

  const [appMode, setAppMode] = useState<AppMode>('pregnancy');
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  const isSeedUser = currentUser?.id === 'usr_ananya_001';

  // Consent & Privacy State
  const [consent, setConsent] = useState<ConsentSettings>(() => {
    const saved = localStorage.getItem('mb_consent');
    return saved ? JSON.parse(saved) : DEFAULT_CONSENT;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<UserProfile | null>(currentUser.id, 'profile', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_USER;
      return {
        ...EMPTY_USER_PROFILE,
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        preferredLanguage: (currentUser.preferredLanguage as Language) || 'en',
      };
    }
    return EMPTY_USER_PROFILE;
  });

  // Family and Parents Medical History
  const [maternalHistory, setMaternalHistory] = useState<ParentMedicalHistory>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<ParentMedicalHistory | null>(currentUser.id, 'maternal_hist', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_MATERNAL_HISTORY;
    }
    return EMPTY_MATERNAL_HISTORY;
  });

  const [paternalHistory, setPaternalHistory] = useState<ParentMedicalHistory>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<ParentMedicalHistory | null>(currentUser.id, 'paternal_hist', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_PATERNAL_HISTORY;
    }
    return EMPTY_PATERNAL_HISTORY;
  });

  const [familyPedigree, setFamilyPedigree] = useState<FamilyPedigreeHistory>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<FamilyPedigreeHistory | null>(currentUser.id, 'pedigree', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_FAMILY_PEDIGREE;
    }
    return EMPTY_FAMILY_PEDIGREE;
  });

  const [lifestyleProfile, setLifestyleProfile] = useState<LifestyleEnvironmentalProfile>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<LifestyleEnvironmentalProfile | null>(currentUser.id, 'lifestyle', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_LIFESTYLE;
    }
    return EMPTY_LIFESTYLE;
  });

  // Nutrition & Local Food State
  const [nutritionProfile, setNutritionProfile] = useState<NutritionProfile>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<NutritionProfile | null>(currentUser.id, 'nutrition', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_NUTRITION_PROFILE;
    }
    return EMPTY_NUTRITION_PROFILE;
  });

  const [foodCity, setFoodCityState] = useState<string>(() => {
    return localStorage.getItem('mb_food_city') || 'Bengaluru';
  });

  const [dailyMealPlan, setDailyMealPlan] = useState<MealPlanItem[]>(() => {
    const saved = localStorage.getItem('mb_daily_meal_plan');
    if (saved) return JSON.parse(saved);
    return generateDailyMealPlan({
      dietaryPreference: 'vegetarian',
      city: 'Bengaluru',
      gestationalWeek: 24,
      trimester: 2,
    });
  });

  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('mb_grocery_list');
    return saved ? JSON.parse(saved) : SAMPLE_GROCERY_LIST;
  });

  // Baby Risk Assessment & Care Plan
  const [babyRiskAssessment, setBabyRiskAssessment] = useState<BabyRiskAssessmentResult>(() => {
    const saved = localStorage.getItem('mb_baby_risk');
    if (saved) return JSON.parse(saved);
    return evaluateBabyHealthRisks({
      maternal: {
        bloodGroup: DEFAULT_USER.bloodGroup,
        rhFactor: DEFAULT_USER.rhFactor || '+',
        preExistingConditions: DEFAULT_MATERNAL_HISTORY.preExistingConditions,
        geneticDisorders: DEFAULT_MATERNAL_HISTORY.geneticDisorders,
        allergies: DEFAULT_MATERNAL_HISTORY.allergies,
        currentMedications: DEFAULT_MATERNAL_HISTORY.currentMedications,
      },
      paternal: {
        bloodGroup: DEFAULT_PATERNAL_HISTORY.bloodGroup,
        rhFactor: DEFAULT_PATERNAL_HISTORY.rhFactor,
        preExistingConditions: DEFAULT_PATERNAL_HISTORY.preExistingConditions,
        geneticDisorders: DEFAULT_PATERNAL_HISTORY.geneticDisorders,
      },
      familyHistory: {
        consanguinity: DEFAULT_FAMILY_PEDIGREE.consanguinity,
        records: DEFAULT_FAMILY_PEDIGREE.records,
        recurrentLoss: DEFAULT_FAMILY_PEDIGREE.recurrentPregnancyLossInFamily,
        unexplainedEarlyDeaths: DEFAULT_FAMILY_PEDIGREE.unexplainedEarlyInfantDeaths,
      },
      pregnancyWeek: 24,
    });
  });

  const [carePlanItems, setCarePlanItems] = useState<CarePlanActionItem[]>(() => {
    const saved = localStorage.getItem('mb_care_plan');
    return saved ? JSON.parse(saved) : SAMPLE_CARE_PLAN_ITEMS;
  });

  const [timelineEvents] = useState<HealthTimelineEvent[]>(CHRONOLOGICAL_HEALTH_TIMELINE);

  // Smart Health & Vaccination Reminders (3-Day Rule & Settings)
  const [healthReminders, setHealthReminders] = useState<HealthReminder[]>(() => {
    const saved = localStorage.getItem('mb_health_reminders');
    return saved ? JSON.parse(saved) : INITIAL_SMART_REMINDERS;
  });

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem('mb_reminder_settings');
    return saved ? JSON.parse(saved) : DEFAULT_REMINDER_SETTINGS;
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('mb_notification_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'log_1',
        reminderId: 'rem_1',
        title: 'Maternal Td-2 Vaccination',
        message: 'Advance notice: Due in 3 days on your clinical schedule.',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        channel: 'in_app',
        status: 'delivered',
      },
      {
        id: 'log_2',
        reminderId: 'rem_2',
        title: 'Routine Antenatal Care (ANC-3)',
        message: '3-Day Alert: Scheduled with Dr. Priya Venkatesh.',
        sentAt: new Date(Date.now() - 7200000).toISOString(),
        channel: 'in_app',
        status: 'delivered',
      },
    ];
  });

  const [pregnancy, setPregnancy] = useState<PregnancyProfile>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<PregnancyProfile | null>(currentUser.id, 'pregnancy', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_PREGNANCY;
    }
    return EMPTY_PREGNANCY;
  });

  const [vitalLogs, setVitalLogs] = useState<MaternalVitalLog[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<MaternalVitalLog[] | null>(currentUser.id, 'vitals', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_VITALS;
    }
    return [];
  });

  const [babies, setBabies] = useState<BabyProfile[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<BabyProfile[] | null>(currentUser.id, 'babies', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_BABIES;
    }
    return [];
  });

  const [activeBabyId, setActiveBabyId] = useState<string>(() => {
    const saved = localStorage.getItem('mb_active_baby_id');
    return saved || '';
  });

  const [babyGrowthMode, setBabyGrowthMode] = useState<'my_babies' | 'fetal_growth'>(() => {
    const saved = localStorage.getItem('mb_baby_growth_mode');
    return (saved as 'my_babies' | 'fetal_growth') || 'my_babies';
  });

  const [familySituation, setFamilySituation] = useState<'has_children_only' | 'pregnant_only' | 'pregnant_and_has_children' | 'planning_pregnancy'>(() => {
    const saved = localStorage.getItem('mb_family_situation');
    return (saved as any) || 'pregnant_only';
  });

  const [childReports, setChildReports] = useState<ChildMedicalReport[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<ChildMedicalReport[] | null>(currentUser.id, 'child_reports', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_CHILD_REPORTS;
    }
    return [];
  });

  const [fetalProfile, setFetalProfile] = useState<FetalProfile>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<FetalProfile | null>(currentUser.id, 'fetal_profile', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_FETAL_PROFILE;
    }
    return {
      id: '',
      motherName: '',
      fetalDisplayName: '',
      lmpDate: '',
      eddDate: '',
      eddSource: 'calculated_from_lmp',
      currentGestationalWeeks: 0,
      currentGestationalDays: 0,
      pregnancyType: 'singleton',
      datingStatus: 'dating_needs_confirmation',
      ultrasounds: [],
    };
  });

  const activeBaby = babies.find(b => b.id === activeBabyId) || babies[0] || (isSeedUser ? DEFAULT_BABIES[0] : ({} as BabyProfile));

  const [growthLogs, setGrowthLogs] = useState<BabyGrowthLog[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<BabyGrowthLog[] | null>(currentUser.id, 'growth', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_GROWTH;
    }
    return [];
  });

  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<FeedingLog[] | null>(currentUser.id, 'feeding', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_FEEDING;
    }
    return [];
  });

  const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<DiaperLog[] | null>(currentUser.id, 'diapers', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_DIAPERS;
    }
    return [];
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<SleepLog[] | null>(currentUser.id, 'sleep', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_SLEEP;
    }
    return [];
  });

  const [vaccines, setVaccines] = useState<VaccineRecord[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<VaccineRecord[] | null>(currentUser.id, 'vaccines', null);
      if (saved) return saved;
      if (isSeedUser) {
        const calculated = calculateVaccineDueDates(DEFAULT_BABY.birthDate);
        return calculated.map((item, idx) => ({
          id: `vac_${idx}`,
          babyId: DEFAULT_BABY.id,
          vaccineKey: item.key,
          name: item.name,
          targetAge: item.targetAge,
          targetAgeWeeks: item.targetWeeks,
          dueDate: item.dueDateFormatted,
          isGiven: idx <= 3,
          administeredDate: idx <= 3 ? item.dueDateFormatted : undefined,
          clinic: idx <= 3 ? 'Cloudnine Pediatric Clinic' : undefined,
        }));
      }
    }
    return [];
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<DocumentRecord[] | null>(currentUser.id, 'docs', null);
      if (saved) return saved;
      if (isSeedUser) return DEFAULT_DOCUMENTS;
    }
    return [];
  });

  const [adaptiveDietPlan, setAdaptiveDietPlan] = useState<DynamicDietAdaptation | null>(() => {
    if (currentUser) {
      const saved = loadUserDataPartition<DynamicDietAdaptation | null>(currentUser.id, 'adaptive_diet_plan', null);
      if (saved) return saved;
    }
    if (isSeedUser) {
      const initialReport = DEFAULT_DOCUMENTS[1];
      const prevReport = DEFAULT_DOCUMENTS[0];
      const base = generateDailyMealPlan({
        dietaryPreference: DEFAULT_NUTRITION_PROFILE.dietaryPreference,
        city: DEFAULT_USER.city || 'Bengaluru',
        gestationalWeek: DEFAULT_PREGNANCY.currentWeek,
        trimester: DEFAULT_PREGNANCY.trimester,
      });
      return generateDynamicDietPlan({
        userProfile: DEFAULT_USER,
        pregnancy: DEFAULT_PREGNANCY,
        latestReport: initialReport,
        previousReport: prevReport,
        dietaryPreference: DEFAULT_NUTRITION_PROFILE.dietaryPreference,
        city: DEFAULT_USER.city || 'Bengaluru',
        baseMeals: base,
      });
    }
    return null;
  });

  const [adaptationHistory, setAdaptationHistory] = useState<DynamicDietAdaptation[]>([]);

  const [hospitalBag, setHospitalBag] = useState<HospitalBagItem[]>(() => {
    const saved = localStorage.getItem('mb_hospital_bag');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITAL_BAG_ITEMS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mb_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mb_consent', JSON.stringify(consent));
  }, [consent]);

  useEffect(() => {
    localStorage.setItem('mb_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('mb_maternal_hist', JSON.stringify(maternalHistory));
  }, [maternalHistory]);

  useEffect(() => {
    localStorage.setItem('mb_paternal_hist', JSON.stringify(paternalHistory));
  }, [paternalHistory]);

  useEffect(() => {
    localStorage.setItem('mb_pedigree', JSON.stringify(familyPedigree));
  }, [familyPedigree]);

  useEffect(() => {
    localStorage.setItem('mb_lifestyle', JSON.stringify(lifestyleProfile));
  }, [lifestyleProfile]);

  useEffect(() => {
    localStorage.setItem('mb_nutrition_profile', JSON.stringify(nutritionProfile));
  }, [nutritionProfile]);

  useEffect(() => {
    localStorage.setItem('mb_food_city', foodCity);
  }, [foodCity]);

  useEffect(() => {
    localStorage.setItem('mb_daily_meal_plan', JSON.stringify(dailyMealPlan));
  }, [dailyMealPlan]);

  useEffect(() => {
    localStorage.setItem('mb_grocery_list', JSON.stringify(groceryList));
  }, [groceryList]);

  useEffect(() => {
    localStorage.setItem('mb_care_plan', JSON.stringify(carePlanItems));
  }, [carePlanItems]);

  useEffect(() => {
    localStorage.setItem('mb_baby_risk', JSON.stringify(babyRiskAssessment));
  }, [babyRiskAssessment]);

  useEffect(() => {
    localStorage.setItem('mb_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('mb_pregnancy', JSON.stringify(pregnancy));
  }, [pregnancy]);

  useEffect(() => {
    localStorage.setItem('mb_vitals', JSON.stringify(vitalLogs));
  }, [vitalLogs]);

  useEffect(() => {
    localStorage.setItem('mb_babies', JSON.stringify(babies));
  }, [babies]);

  useEffect(() => {
    localStorage.setItem('mb_active_baby_id', activeBabyId);
  }, [activeBabyId]);

  useEffect(() => {
    localStorage.setItem('mb_baby_growth_mode', babyGrowthMode);
  }, [babyGrowthMode]);

  useEffect(() => {
    localStorage.setItem('mb_family_situation', familySituation);
  }, [familySituation]);

  useEffect(() => {
    localStorage.setItem('mb_child_reports', JSON.stringify(childReports));
  }, [childReports]);

  useEffect(() => {
    localStorage.setItem('mb_fetal_profile', JSON.stringify(fetalProfile));
  }, [fetalProfile]);

  useEffect(() => {
    localStorage.setItem('mb_growth', JSON.stringify(growthLogs));
  }, [growthLogs]);

  useEffect(() => {
    localStorage.setItem('mb_feeding', JSON.stringify(feedingLogs));
  }, [feedingLogs]);

  useEffect(() => {
    localStorage.setItem('mb_diapers', JSON.stringify(diaperLogs));
  }, [diaperLogs]);

  useEffect(() => {
    localStorage.setItem('mb_sleep', JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  useEffect(() => {
    localStorage.setItem('mb_vaccines', JSON.stringify(vaccines));
  }, [vaccines]);

  useEffect(() => {
    localStorage.setItem('mb_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('mb_hospital_bag', JSON.stringify(hospitalBag));
  }, [hospitalBag]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mb_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      const rtlLangs = ['ar', 'ur', 'he', 'fa'];
      document.documentElement.dir = rtlLangs.includes(lang) ? 'rtl' : 'ltr';
    }
    if (currentUser) {
      setUserProfile(prev => {
        const updated = { ...prev, preferredLanguage: lang };
        saveUserDataPartition(currentUser.id, 'profile', updated);
        return updated;
      });
    }
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...profile };
      const newCity = updated.city || updated.district;
      if (newCity && newCity !== foodCity) {
        setFoodCityState(newCity);
      }
      if (currentUser) {
        saveUserDataPartition(currentUser.id, 'profile', updated);
      }
      return updated;
    });

    // If location changed, synchronize diet plan adaptations for the new location
    if (profile.city || profile.district || profile.state || profile.country) {
      setTimeout(() => {
        reassessDietPlanWithReport();
      }, 50);
    }
  };

  const updatePregnancyLmp = (lmpDate: string) => {
    const prog = calculatePregnancyProgress(lmpDate);
    setPregnancy(prev => ({
      ...prev,
      lastMenstrualPeriod: lmpDate,
      estimatedDueDate: prog.eddFormatted,
      currentWeek: prog.currentWeek,
      currentDay: prog.currentDay,
      trimester: prog.trimester,
    }));
  };

  const updatePregnancyWeek = (week: number) => {
    const safeWeek = Math.max(4, Math.min(42, Math.round(week)));
    const trimester: 1 | 2 | 3 = safeWeek <= 13 ? 1 : safeWeek <= 27 ? 2 : 3;
    setPregnancy(prev => ({
      ...prev,
      currentWeek: safeWeek,
      trimester,
    }));
  };

  const addVitalLog = (log: Omit<MaternalVitalLog, 'id'>) => {
    const newLog: MaternalVitalLog = {
      ...log,
      id: `v_${Date.now()}`,
    };
    setVitalLogs(prev => [newLog, ...prev]);
  };

  const updateBabyProfile = (idOrBaby: string | Partial<BabyProfile>, updates?: Partial<BabyProfile>) => {
    const targetId = typeof idOrBaby === 'string' ? idOrBaby : activeBabyId;
    const patch = typeof idOrBaby === 'string' ? updates || {} : idOrBaby;

    setBabies(prev =>
      prev.map(b => {
        if (b.id === targetId) {
          const updated = { ...b, ...patch };
          if (patch.birthDate && patch.birthDate !== b.birthDate) {
            const calculated = calculateVaccineDueDates(patch.birthDate);
            setVaccines(vPrev => [
              ...vPrev.filter(v => v.babyId !== targetId),
              ...calculated.map((item, idx) => ({
                id: `vac_${targetId}_${idx}`,
                babyId: targetId,
                vaccineKey: item.key,
                name: item.name,
                targetAge: item.targetAge,
                targetAgeWeeks: item.targetWeeks,
                dueDate: item.dueDateFormatted,
                isGiven: false,
              })),
            ]);
          }
          return updated;
        }
        return b;
      })
    );
  };

  const addBabyProfile = (baby: Omit<BabyProfile, 'id'>): string => {
    const newId = `baby_${Date.now()}`;
    const newBaby: BabyProfile = {
      ...baby,
      id: newId,
    };
    setBabies(prev => [...prev, newBaby]);
    setActiveBabyId(newId);
    setBabyGrowthMode('my_babies');

    if (newBaby.birthDate) {
      const calculated = calculateVaccineDueDates(newBaby.birthDate);
      setVaccines(prev => [
        ...prev,
        ...calculated.map((item, idx) => ({
          id: `vac_${newId}_${idx}`,
          babyId: newId,
          vaccineKey: item.key,
          name: item.name,
          targetAge: item.targetAge,
          targetAgeWeeks: item.targetWeeks,
          dueDate: item.dueDateFormatted,
          isGiven: false,
        })),
      ]);
    }
    return newId;
  };

  const deleteBabyProfile = (id: string) => {
    setBabies(prev => {
      const remaining = prev.filter(b => b.id !== id);
      if (activeBabyId === id && remaining.length > 0) {
        setActiveBabyId(remaining[0].id);
      }
      return remaining;
    });
    setGrowthLogs(prev => prev.filter(g => g.babyId !== id));
    setFeedingLogs(prev => prev.filter(f => f.babyId !== id));
    setDiaperLogs(prev => prev.filter(d => d.babyId !== id));
    setSleepLogs(prev => prev.filter(s => s.babyId !== id));
    setVaccines(prev => prev.filter(v => v.babyId !== id));
    setChildReports(prev => prev.filter(r => r.babyId !== id));
  };

  const archiveBabyProfile = (id: string) => {
    setBabies(prev => prev.map(b => (b.id === id ? { ...b, isArchived: true } : b)));
  };

  const addChildReport = (report: Omit<ChildMedicalReport, 'id'>) => {
    const newReport: ChildMedicalReport = {
      ...report,
      id: `cr_${Date.now()}`,
    };
    setChildReports(prev => [newReport, ...prev]);
  };

  const deleteChildReport = (id: string) => {
    setChildReports(prev => prev.filter(r => r.id !== id));
  };

  const updateFetalProfile = (profile: Partial<FetalProfile>) => {
    setFetalProfile(prev => ({ ...prev, ...profile }));
  };

  const addUltrasoundMeasurement = (scan: Omit<FetalUltrasoundMeasurement, 'id'>) => {
    const newScan: FetalUltrasoundMeasurement = {
      ...scan,
      id: `us_${Date.now()}`,
    };
    setFetalProfile(prev => ({
      ...prev,
      ultrasounds: [newScan, ...prev.ultrasounds],
    }));
  };

  const transitionBabyBorn = (birthDetails: {
    name: string;
    birthDate: string;
    gender: 'boy' | 'girl';
    birthWeightKg: number;
    birthLengthCm: number;
    birthHeadCircumferenceCm?: number;
    gestationalAgeWeeksAtBirth?: number;
  }): string => {
    const gestWeeks = birthDetails.gestationalAgeWeeksAtBirth ?? fetalProfile.currentGestationalWeeks;
    const isPremature = gestWeeks < 37;
    const newBabyId = `baby_${Date.now()}`;
    const newBaby: BabyProfile = {
      id: newBabyId,
      name: birthDetails.name || 'Baby of ' + userProfile.name,
      gender: birthDetails.gender,
      birthDate: birthDetails.birthDate,
      birthWeightKg: birthDetails.birthWeightKg,
      birthLengthCm: birthDetails.birthLengthCm,
      birthHeadCircumferenceCm: birthDetails.birthHeadCircumferenceCm || 34.0,
      gestationalAgeWeeksAtBirth: gestWeeks,
      isPremature,
      bloodGroup: userProfile.bloodGroup || 'Cord blood test pending',
      birthHistory: `Transitioned from pregnancy tracking (EDD: ${fetalProfile.eddDate || pregnancy.estimatedDueDate}). Born at ${gestWeeks} weeks.`,
      originPregnancyId: pregnancy.id,
      pediatricianName: userProfile.doctorName,
      pediatricianPhone: userProfile.doctorPhone,
      medicalConditions: isPremature ? ['Premature delivery follow-up'] : [],
      allergies: [],
      currentMedications: ['Vitamin D3 drops 400 IU daily'],
      feedingMethod: 'exclusive_breastfeeding',
      householdCircumstances: {
        dietaryPattern: nutritionProfile.dietaryPreference,
        drinkingWaterSource: 'Purified water',
        indoorSmokeExposure: false,
        smokingInHousehold: false,
      },
    };

    setBabies(prev => [...prev, newBaby]);
    setActiveBabyId(newBabyId);
    setBabyGrowthMode('my_babies');
    setAppMode('baby');

    // Add birth growth record
    const birthGrowth: BabyGrowthLog = {
      id: `bg_${Date.now()}`,
      babyId: newBabyId,
      date: birthDetails.birthDate,
      ageInMonths: 0,
      weightKg: birthDetails.birthWeightKg,
      lengthCm: birthDetails.birthLengthCm,
      headCircumferenceCm: birthDetails.birthHeadCircumferenceCm || 34.0,
      notes: 'Birth measurements logged during transition from pregnancy dashboard.',
    };
    setGrowthLogs(prev => [...prev, birthGrowth]);

    // Setup initial vaccine schedule
    const calculated = calculateVaccineDueDates(birthDetails.birthDate);
    setVaccines(prev => [
      ...prev,
      ...calculated.map((item, idx) => ({
        id: `vac_${newBabyId}_${idx}`,
        babyId: newBabyId,
        vaccineKey: item.key,
        name: item.name,
        targetAge: item.targetAge,
        targetAgeWeeks: item.targetWeeks,
        dueDate: item.dueDateFormatted,
        isGiven: false,
      })),
    ]);

    return newBabyId;
  };

  const addGrowthLog = (log: Omit<BabyGrowthLog, 'id'>) => {
    const newGrowth: BabyGrowthLog = {
      ...log,
      id: `bg_${Date.now()}`,
    };
    setGrowthLogs(prev => [...prev, newGrowth]);
  };

  const addFeedingLog = (log: Omit<FeedingLog, 'id'>) => {
    const newLog: FeedingLog = {
      ...log,
      id: `f_${Date.now()}`,
    };
    setFeedingLogs(prev => [newLog, ...prev]);
  };

  const addDiaperLog = (log: Omit<DiaperLog, 'id'>) => {
    const newLog: DiaperLog = {
      ...log,
      id: `d_${Date.now()}`,
    };
    setDiaperLogs(prev => [newLog, ...prev]);
  };

  const addSleepLog = (log: Omit<SleepLog, 'id'>) => {
    const newLog: SleepLog = {
      ...log,
      id: `s_${Date.now()}`,
    };
    setSleepLogs(prev => [newLog, ...prev]);
  };

  const toggleVaccineStatus = (id: string) => {
    setVaccines(prev =>
      prev.map(v =>
        v.id === id
          ? {
              ...v,
              isGiven: !v.isGiven,
              administeredDate: !v.isGiven ? new Date().toISOString().split('T')[0] : undefined,
            }
          : v
      )
    );
  };

  const reassessDietPlanWithDoc = (targetDoc?: DocumentRecord, previousDoc?: DocumentRecord) => {
    const city = userProfile.city || userProfile.district || foodCity || 'Bengaluru';
    const pref = nutritionProfile.dietaryPreference || 'vegetarian';

    const base = generateDailyMealPlan({
      dietaryPreference: pref,
      city,
      gestationalWeek: pregnancy.currentWeek || 24,
      trimester: pregnancy.trimester || 2,
      allergies: nutritionProfile.foodAllergies,
    });

    const newAdaptation = generateDynamicDietPlan({
      userProfile,
      pregnancy,
      latestReport: targetDoc,
      previousReport: previousDoc,
      dietaryPreference: pref,
      city,
      baseMeals: base,
    });

    setAdaptiveDietPlan(newAdaptation);
    setDailyMealPlan(newAdaptation.meals);
    setAdaptationHistory(prev => [newAdaptation, ...prev.slice(0, 9)]);

    if (currentUser) {
      saveUserDataPartition(currentUser.id, 'adaptive_diet_plan', newAdaptation);
    }
  };

  const reassessDietPlanWithReport = (reportId?: string) => {
    let targetDoc: DocumentRecord | undefined;
    let prevDoc: DocumentRecord | undefined;

    if (reportId) {
      const idx = documents.findIndex(d => d.id === reportId);
      if (idx >= 0) {
        targetDoc = documents[idx];
        prevDoc = idx + 1 < documents.length ? documents[idx + 1] : undefined;
      }
    } else {
      targetDoc = documents.find(d => d.category === 'blood_test' || d.category === 'urine_test') || documents[0];
      const targetIdx = targetDoc ? documents.indexOf(targetDoc) : -1;
      prevDoc = targetIdx >= 0 && targetIdx + 1 < documents.length ? documents[targetIdx + 1] : undefined;
    }

    reassessDietPlanWithDoc(targetDoc, prevDoc);
  };

  const addDocument = (doc: Omit<DocumentRecord, 'id'>) => {
    const newDoc: DocumentRecord = {
      ...doc,
      id: `doc_${Date.now()}`,
    };
    setDocuments(prev => {
      const updated = [newDoc, ...prev];
      if (currentUser) {
        saveUserDataPartition(currentUser.id, 'docs', updated);
      }
      // Immediately adapt the diet plan based on this new medical report
      reassessDietPlanWithDoc(newDoc, prev[0]);
      return updated;
    });
  };

  const toggleHospitalBagItem = (id: string) => {
    setHospitalBag(prev =>
      prev.map(item => (item.id === id ? { ...item, isPacked: !item.isPacked } : item))
    );
  };

  const addHospitalBagItem = (
    item: string,
    itemHi: string,
    category: 'mother' | 'baby' | 'partner' | 'documents'
  ) => {
    const newItem: HospitalBagItem = {
      id: `hb_${Date.now()}`,
      category,
      item,
      itemHi: itemHi || item,
      isPacked: false,
    };
    setHospitalBag(prev => [...prev, newItem]);
  };

  const updateConsent = (settings: Partial<ConsentSettings>) => {
    setConsent(prev => ({ ...prev, ...settings }));
  };

  const updateMaternalHistory = (hist: Partial<ParentMedicalHistory>) => {
    setMaternalHistory(prev => ({ ...prev, ...hist }));
  };

  const updatePaternalHistory = (hist: Partial<ParentMedicalHistory>) => {
    setPaternalHistory(prev => ({ ...prev, ...hist }));
  };

  const updateFamilyPedigree = (pedigree: Partial<FamilyPedigreeHistory>) => {
    setFamilyPedigree(prev => ({ ...prev, ...pedigree }));
  };

  const addRelativeRecord = (record: Omit<RelativeHealthRecord, 'id'>) => {
    const newRecord: RelativeHealthRecord = {
      ...record,
      id: `ped_${Date.now()}`,
    };
    setFamilyPedigree(prev => ({
      ...prev,
      records: [...prev.records, newRecord],
      lastUpdated: new Date().toISOString().split('T')[0],
    }));
  };

  const removeRelativeRecord = (id: string) => {
    setFamilyPedigree(prev => ({
      ...prev,
      records: prev.records.filter(r => r.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0],
    }));
  };

  const updateLifestyleProfile = (profile: Partial<LifestyleEnvironmentalProfile>) => {
    setLifestyleProfile(prev => ({ ...prev, ...profile }));
  };

  const updateNutritionProfile = (profile: Partial<NutritionProfile>) => {
    setNutritionProfile(prev => {
      const updated = { ...prev, ...profile, lastUpdated: new Date().toISOString().split('T')[0] };
      const city = userProfile.city || userProfile.district || foodCity || 'Bengaluru';
      const base = generateDailyMealPlan({
        dietaryPreference: updated.dietaryPreference,
        city,
        gestationalWeek: pregnancy.currentWeek || 24,
        trimester: pregnancy.trimester || 2,
        allergies: updated.foodAllergies,
      });

      const latestDoc = documents.find(d => d.category === 'blood_test' || d.category === 'urine_test') || documents[0];
      const prevDoc = latestDoc && documents.length > 1 ? documents[1] : undefined;

      const adapted = generateDynamicDietPlan({
        userProfile,
        pregnancy,
        latestReport: latestDoc,
        previousReport: prevDoc,
        dietaryPreference: updated.dietaryPreference,
        city,
        baseMeals: base,
      });

      setAdaptiveDietPlan(adapted);
      setDailyMealPlan(adapted.meals);

      if (currentUser) {
        saveUserDataPartition(currentUser.id, 'nutrition', updated);
        saveUserDataPartition(currentUser.id, 'adaptive_diet_plan', adapted);
      }
      return updated;
    });
  };

  const setFoodCity = (city: string) => {
    setFoodCityState(city);
    const pref = nutritionProfile.dietaryPreference || 'vegetarian';
    const base = generateDailyMealPlan({
      dietaryPreference: pref,
      city,
      gestationalWeek: pregnancy.currentWeek || 24,
      trimester: pregnancy.trimester || 2,
      allergies: nutritionProfile.foodAllergies,
    });
    const latestDoc = documents.find(d => d.category === 'blood_test' || d.category === 'urine_test') || documents[0];
    const prevDoc = latestDoc && documents.length > 1 ? documents[1] : undefined;
    const adapted = generateDynamicDietPlan({
      userProfile,
      pregnancy,
      latestReport: latestDoc,
      previousReport: prevDoc,
      dietaryPreference: pref,
      city,
      baseMeals: base,
    });
    setAdaptiveDietPlan(adapted);
    setDailyMealPlan(adapted.meals);
  };

  const regenerateMealPlan = () => {
    const city = userProfile.city || userProfile.district || foodCity || 'Bengaluru';
    const pref = nutritionProfile.dietaryPreference || 'vegetarian';
    const base = generateDailyMealPlan({
      dietaryPreference: pref,
      city,
      gestationalWeek: pregnancy.currentWeek || 24,
      trimester: pregnancy.trimester || 2,
      allergies: nutritionProfile.foodAllergies,
    });
    const latestDoc = documents.find(d => d.category === 'blood_test' || d.category === 'urine_test') || documents[0];
    const prevDoc = latestDoc && documents.length > 1 ? documents[1] : undefined;

    const adapted = generateDynamicDietPlan({
      userProfile,
      pregnancy,
      latestReport: latestDoc,
      previousReport: prevDoc,
      dietaryPreference: pref,
      city,
      baseMeals: base,
    });
    setAdaptiveDietPlan(adapted);
    setDailyMealPlan(adapted.meals);
  };

  const toggleMealItemStatus = (
    mealId: string,
    statusKey: 'isLiked' | 'isDisliked' | 'isEaten' | 'isUnavailable'
  ) => {
    setDailyMealPlan(prev =>
      prev.map(m => {
        if (m.id !== mealId) return m;
        return {
          ...m,
          [statusKey]: !m[statusKey],
          // Mutual exclusion for liked / disliked
          ...(statusKey === 'isLiked' && !m.isLiked ? { isDisliked: false } : {}),
          ...(statusKey === 'isDisliked' && !m.isDisliked ? { isLiked: false } : {}),
        };
      })
    );
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryList(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addGroceryItem = (name: string, quantity: string, category: GroceryItem['category']) => {
    const newItem: GroceryItem = {
      id: `g_${Date.now()}`,
      name,
      quantity,
      category,
      checked: false,
    };
    setGroceryList(prev => [...prev, newItem]);
  };

  const recomputeBabyRiskAssessment = () => {
    const result = evaluateBabyHealthRisks({
      maternal: {
        bloodGroup: userProfile.bloodGroup,
        rhFactor: userProfile.rhFactor || '+',
        preExistingConditions: maternalHistory.preExistingConditions,
        geneticDisorders: maternalHistory.geneticDisorders,
        allergies: maternalHistory.allergies,
        currentMedications: maternalHistory.currentMedications,
      },
      paternal: {
        bloodGroup: paternalHistory.bloodGroup,
        rhFactor: paternalHistory.rhFactor,
        preExistingConditions: paternalHistory.preExistingConditions,
        geneticDisorders: paternalHistory.geneticDisorders,
      },
      familyHistory: {
        consanguinity: familyPedigree.consanguinity,
        records: familyPedigree.records,
        recurrentLoss: familyPedigree.recurrentPregnancyLossInFamily,
        unexplainedEarlyDeaths: familyPedigree.unexplainedEarlyInfantDeaths,
      },
      pregnancyWeek: pregnancy.currentWeek,
    });
    setBabyRiskAssessment(result);
  };

  useEffect(() => {
    localStorage.setItem('mb_health_reminders', JSON.stringify(healthReminders));
  }, [healthReminders]);

  useEffect(() => {
    localStorage.setItem('mb_reminder_settings', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  useEffect(() => {
    localStorage.setItem('mb_notification_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  const updateReminderSettings = (settings: Partial<ReminderSettings>) => {
    setReminderSettings(prev => ({
      ...prev,
      ...settings,
      lastUpdated: new Date().toISOString().split('T')[0],
    }));
  };

  const addHealthReminder = (reminder: Omit<HealthReminder, 'id'>) => {
    const newRem: HealthReminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
    };
    setHealthReminders(prev => [newRem, ...prev]);

    // Add log entry
    const newLog: NotificationLog = {
      id: `log_${Date.now()}`,
      reminderId: newRem.id,
      title: newRem.title,
      message: `Scheduled with 3-day default notice rule (Due: ${newRem.dueDate})`,
      sentAt: new Date().toISOString(),
      channel: 'in_app',
      status: 'delivered',
    };
    setNotificationLogs(prev => [newLog, ...prev]);
  };

  const toggleReminderCompleted = (id: string) => {
    setHealthReminders(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const willBeCompleted = !r.isCompleted;
        return {
          ...r,
          isCompleted: willBeCompleted,
          completedDate: willBeCompleted ? new Date().toISOString().split('T')[0] : undefined,
          isSnoozed: false,
        };
      })
    );
  };

  const snoozeReminder = (id: string, days: number = 1) => {
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);
    const snoozedUntilStr = snoozeDate.toISOString().split('T')[0];

    setHealthReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, isSnoozed: true, snoozedUntil: snoozedUntilStr } : r))
    );

    const match = healthReminders.find(r => r.id === id);
    if (match) {
      setNotificationLogs(prev => [
        {
          id: `log_${Date.now()}`,
          reminderId: id,
          title: match.title,
          message: `Snoozed for ${days} day(s) until ${snoozedUntilStr}`,
          sentAt: new Date().toISOString(),
          channel: 'in_app',
          status: 'snoozed',
        },
        ...prev,
      ]);
    }
  };

  const rescheduleReminder = (id: string, newDueDate: string, newDueTime?: string) => {
    setHealthReminders(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        return {
          ...r,
          originalDueDate: r.originalDueDate || r.dueDate,
          dueDate: newDueDate,
          dueTime: newDueTime || r.dueTime,
          rescheduledCount: (r.rescheduledCount || 0) + 1,
          isSnoozed: false,
        };
      })
    );

    const match = healthReminders.find(r => r.id === id);
    if (match) {
      setNotificationLogs(prev => [
        {
          id: `log_${Date.now()}`,
          reminderId: id,
          title: match.title,
          message: `Rescheduled from ${match.dueDate} to ${newDueDate}`,
          sentAt: new Date().toISOString(),
          channel: 'in_app',
          status: 'rescheduled',
        },
        ...prev,
      ]);
    }
  };

  const deleteReminder = (id: string) => {
    setHealthReminders(prev => prev.filter(r => r.id !== id));
  };

  const dismissNotificationLog = (id: string) => {
    setNotificationLogs(prev => prev.filter(l => l.id !== id));
  };

  const restoreDefaultReminderSettings = () => {
    setReminderSettings(DEFAULT_REMINDER_SETTINGS);
  };

  const requestBrowserNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setReminderSettings(prev => ({ ...prev, enableBrowserPush: true }));
      }
      return permission;
    } catch {
      return 'denied';
    }
  };

  const toggleCarePlanItem = (id: string) => {
    setCarePlanItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const exportUserDataJson = (): string => {
    const exportObject = {
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      userProfile,
      pregnancy,
      consent,
      maternalHistory,
      paternalHistory,
      familyPedigree,
      lifestyleProfile,
      nutritionProfile,
      babyRiskAssessment,
      vitalLogs,
      documentsSummary: documents.map(d => ({ title: d.title, category: d.category, date: d.date })),
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const deleteUserData = () => {
    localStorage.clear();
    resetToSampleData();
  };

  const resetToSampleData = () => {
    setUserProfile(DEFAULT_USER);
    setConsent(DEFAULT_CONSENT);
    setMaternalHistory(DEFAULT_MATERNAL_HISTORY);
    setPaternalHistory(DEFAULT_PATERNAL_HISTORY);
    setFamilyPedigree(DEFAULT_FAMILY_PEDIGREE);
    setLifestyleProfile(DEFAULT_LIFESTYLE);
    setNutritionProfile(DEFAULT_NUTRITION_PROFILE);
    setFoodCityState('Bengaluru');
    setDailyMealPlan(
      generateDailyMealPlan({
        dietaryPreference: 'vegetarian',
        city: 'Bengaluru',
        gestationalWeek: 24,
        trimester: 2,
      })
    );
    setGroceryList(SAMPLE_GROCERY_LIST);
    setCarePlanItems(SAMPLE_CARE_PLAN_ITEMS);
    setHealthReminders(INITIAL_SMART_REMINDERS);
    setReminderSettings(DEFAULT_REMINDER_SETTINGS);
    setNotificationLogs([]);
    setPregnancy(DEFAULT_PREGNANCY);
    setVitalLogs(DEFAULT_VITALS);
    setBabies(DEFAULT_BABIES);
    setActiveBabyId('baby_001');
    setChildReports(DEFAULT_CHILD_REPORTS);
    setFetalProfile(DEFAULT_FETAL_PROFILE);
    setBabyGrowthMode('my_babies');
    setFamilySituation('pregnant_and_has_children');
    setGrowthLogs(DEFAULT_GROWTH);
    setFeedingLogs(DEFAULT_FEEDING);
    setDiaperLogs(DEFAULT_DIAPERS);
    setSleepLogs(DEFAULT_SLEEP);
    setDocuments(DEFAULT_DOCUMENTS);
    setHospitalBag(INITIAL_HOSPITAL_BAG_ITEMS);
    localStorage.clear();
  };

  // Auth Operations
  const login = async (identifier: string, passwordAttempt: string) => {
    const res = await loginUserAccount(identifier, passwordAttempt);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      const isSeed = res.user.id === 'usr_ananya_001';
      const prof = loadUserDataPartition<UserProfile>(
        res.user.id,
        'profile',
        isSeed
          ? DEFAULT_USER
          : {
              ...EMPTY_USER_PROFILE,
              id: res.user.id,
              name: res.user.name,
              email: res.user.email,
              phone: res.user.phone,
              preferredLanguage: (res.user.preferredLanguage as Language) || 'en',
            }
      );
      setUserProfile(prof);
      setPregnancy(loadUserDataPartition(res.user.id, 'pregnancy', isSeed ? DEFAULT_PREGNANCY : EMPTY_PREGNANCY));
      setMaternalHistory(loadUserDataPartition(res.user.id, 'maternal_hist', isSeed ? DEFAULT_MATERNAL_HISTORY : EMPTY_MATERNAL_HISTORY));
      setPaternalHistory(loadUserDataPartition(res.user.id, 'paternal_hist', isSeed ? DEFAULT_PATERNAL_HISTORY : EMPTY_PATERNAL_HISTORY));
      setFamilyPedigree(loadUserDataPartition(res.user.id, 'pedigree', isSeed ? DEFAULT_FAMILY_PEDIGREE : EMPTY_FAMILY_PEDIGREE));
      setLifestyleProfile(loadUserDataPartition(res.user.id, 'lifestyle', isSeed ? DEFAULT_LIFESTYLE : EMPTY_LIFESTYLE));
      setNutritionProfile(loadUserDataPartition(res.user.id, 'nutrition', isSeed ? DEFAULT_NUTRITION_PROFILE : EMPTY_NUTRITION_PROFILE));
      const loadedBabies = loadUserDataPartition<BabyProfile[]>(res.user.id, 'babies', isSeed ? DEFAULT_BABIES : []);
      setBabies(loadedBabies);
      setActiveBabyId(loadedBabies[0]?.id || '');
      setVitalLogs(loadUserDataPartition(res.user.id, 'vitals', isSeed ? DEFAULT_VITALS : []));
      setDocuments(loadUserDataPartition(res.user.id, 'docs', isSeed ? DEFAULT_DOCUMENTS : []));
      setGrowthLogs(loadUserDataPartition(res.user.id, 'growth', isSeed ? DEFAULT_GROWTH : []));
      setFeedingLogs(loadUserDataPartition(res.user.id, 'feeding', isSeed ? DEFAULT_FEEDING : []));
      setDiaperLogs(loadUserDataPartition(res.user.id, 'diapers', isSeed ? DEFAULT_DIAPERS : []));
      setSleepLogs(loadUserDataPartition(res.user.id, 'sleep', isSeed ? DEFAULT_SLEEP : []));
      if (res.user.preferredLanguage) {
        setLanguage(res.user.preferredLanguage as Language);
      }
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const signup = async (params: any) => {
    const res = await registerUserAccount({
      name: params.name,
      email: params.email,
      phone: params.phone,
      password: params.password,
      preferredLanguage: params.preferredLanguage || language,
    });
    if (res.success && res.user) {
      setCurrentUser(res.user);
      const newProf: UserProfile = {
        ...EMPTY_USER_PROFILE,
        id: res.user.id,
        name: params.name || '',
        email: params.email || '',
        phone: params.phone || '',
        dateOfBirth: params.dateOfBirth || params.dob || '',
        country: params.country || '',
        country_code: params.country_code || '',
        country_name: params.country_name || params.country || '',
        state: params.state || '',
        state_region_code: params.state_region_code || '',
        state_region_name: params.state_region_name || params.state || '',
        district: params.district || '',
        district_code: params.district_code || '',
        district_name: params.district_name || params.district || '',
        city: params.city || params.district || '',
        latitude: params.latitude,
        longitude: params.longitude,
        gpsPermissionGranted: !!params.gpsPermissionGranted,
        bloodGroup: params.bloodGroup || '',
        preferredLanguage: params.preferredLanguage || language || 'en',
        enableLocationBasedHealthIntelligence: params.enableLocationBasedHealthIntelligence !== undefined ? !!params.enableLocationBasedHealthIntelligence : true,
        onboardingCompleted: true,
      };
      setUserProfile(newProf);
      saveUserDataPartition(res.user.id, 'profile', newProf);

      // Save Nutrition Profile from signup onboarding
      const userNutri: NutritionProfile = {
        ...EMPTY_NUTRITION_PROFILE,
        ...(params.nutritionProfile || {}),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setNutritionProfile(userNutri);
      saveUserDataPartition(res.user.id, 'nutrition', userNutri);

      if (params.situation === 'pregnant' && params.lmpDate) {
        const prog = calculatePregnancyProgress(params.lmpDate);
        const pregData: PregnancyProfile = {
          ...EMPTY_PREGNANCY,
          id: `preg_${res.user.id}`,
          lastMenstrualPeriod: params.lmpDate,
          estimatedDueDate: prog.eddFormatted,
          currentWeek: prog.currentWeek,
          currentDay: prog.currentDay,
          trimester: prog.trimester,
          pregnancyType: params.pregnancyType === 'twins' ? 'twins' : 'singleton',
        };
        setPregnancy(pregData);
        saveUserDataPartition(res.user.id, 'pregnancy', pregData);
      } else {
        setPregnancy(EMPTY_PREGNANCY);
        saveUserDataPartition(res.user.id, 'pregnancy', EMPTY_PREGNANCY);
      }

      const matHist: ParentMedicalHistory = {
        ...EMPTY_MATERNAL_HISTORY,
        fullName: params.name || '',
        dateOfBirth: params.dateOfBirth || params.dob || '',
        bloodGroup: params.bloodGroup || '',
        preExistingConditions: params.preExistingConditions || [],
        allergies: params.allergies || [],
        currentMedications: params.currentMeds || [],
      };
      setMaternalHistory(matHist);
      saveUserDataPartition(res.user.id, 'maternal_hist', matHist);

      setPaternalHistory(EMPTY_PATERNAL_HISTORY);
      saveUserDataPartition(res.user.id, 'paternal_hist', EMPTY_PATERNAL_HISTORY);

      setFamilyPedigree(EMPTY_FAMILY_PEDIGREE);
      saveUserDataPartition(res.user.id, 'pedigree', EMPTY_FAMILY_PEDIGREE);

      setVitalLogs([]);
      saveUserDataPartition(res.user.id, 'vitals', []);

      setDocuments([]);
      saveUserDataPartition(res.user.id, 'docs', []);

      if (params.children && params.children.length > 0) {
        const babiesList: BabyProfile[] = params.children.map((ch: any, idx: number) => ({
          ...ch,
          id: `baby_${res.user!.id}_${Date.now()}_${idx}`,
        }));
        setBabies(babiesList);
        setActiveBabyId(babiesList[0].id);
        saveUserDataPartition(res.user.id, 'babies', babiesList);
      } else {
        setBabies([]);
        setActiveBabyId('');
        saveUserDataPartition(res.user.id, 'babies', []);
      }

      // Initialize clean, isolated adaptive diet plan for new user
      const initialUserDiet = generateDynamicDietPlan({
        userProfile: newProf,
        pregnancy: params.situation === 'pregnant' && params.lmpDate ? {
          ...EMPTY_PREGNANCY,
          id: `preg_${res.user.id}`,
          lastMenstrualPeriod: params.lmpDate,
          estimatedDueDate: calculatePregnancyProgress(params.lmpDate).eddFormatted,
          currentWeek: calculatePregnancyProgress(params.lmpDate).currentWeek,
          currentDay: calculatePregnancyProgress(params.lmpDate).currentDay,
          trimester: calculatePregnancyProgress(params.lmpDate).trimester,
        } : EMPTY_PREGNANCY,
        dietaryPreference: userNutri.dietaryPreference,
        city: newProf.city || newProf.district || 'Bengaluru',
        baseMeals: generateDailyMealPlan({
          dietaryPreference: userNutri.dietaryPreference,
          city: newProf.city || newProf.district || 'Bengaluru',
          gestationalWeek: 24,
          trimester: 2,
        }),
      });
      setAdaptiveDietPlan(initialUserDiet);
      setDailyMealPlan(initialUserDiet.meals);
      setAdaptationHistory([initialUserDiet]);
      saveUserDataPartition(res.user.id, 'adaptive_diet_plan', initialUserDiet);

      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setUserProfile(EMPTY_USER_PROFILE);
    setPregnancy(EMPTY_PREGNANCY);
    setMaternalHistory(EMPTY_MATERNAL_HISTORY);
    setPaternalHistory(EMPTY_PATERNAL_HISTORY);
    setFamilyPedigree(EMPTY_FAMILY_PEDIGREE);
    setLifestyleProfile(EMPTY_LIFESTYLE);
    setNutritionProfile(EMPTY_NUTRITION_PROFILE);
    setBabies([]);
    setActiveBabyId('');
    setVitalLogs([]);
    setChildReports([]);
    setGrowthLogs([]);
    setFeedingLogs([]);
    setDiaperLogs([]);
    setSleepLogs([]);
    setVaccines([]);
    setDocuments([]);
    setAdaptiveDietPlan(null);
    setAdaptationHistory([]);
  };

  const adminLogin = (role: AdminRole) => {
    const adm = AdminService.loginAdmin(role);
    setAdminUserState(adm);
    return { success: true };
  };

  const adminLogout = () => {
    AdminService.logoutAdmin();
    setAdminUserState(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        adminUser,
        isAdminAuthenticated,
        setAdminUser: setAdminUserState,
        adminLogin,
        adminLogout,
        language,
        setLanguage,
        appMode,
        setAppMode,
        showEmergencyModal,
        setShowEmergencyModal,
        isOnboardingOpen,
        setIsOnboardingOpen,
        consent,
        updateConsent,
        userProfile,
        updateUserProfile,
        maternalHistory,
        updateMaternalHistory,
        paternalHistory,
        updatePaternalHistory,
        familyPedigree,
        updateFamilyPedigree,
        addRelativeRecord,
        removeRelativeRecord,
        lifestyleProfile,
        updateLifestyleProfile,
        babyRiskAssessment,
        recomputeBabyRiskAssessment,
        carePlanItems,
        toggleCarePlanItem,
        timelineEvents,
        nutritionProfile,
        updateNutritionProfile,
        dailyMealPlan,
        setDailyMealPlan,
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
        healthReminders,
        reminderSettings,
        updateReminderSettings,
        addHealthReminder,
        toggleReminderCompleted,
        snoozeReminder,
        rescheduleReminder,
        deleteReminder,
        notificationLogs,
        dismissNotificationLog,
        restoreDefaultReminderSettings,
        requestBrowserNotificationPermission,
        pregnancy,
        updatePregnancyLmp,
        updatePregnancyWeek,
        vitalLogs,
        addVitalLog,
        activeBaby,
        babies,
        activeBabyId,
        setActiveBabyId,
        addBabyProfile,
        updateBabyProfile,
        deleteBabyProfile,
        archiveBabyProfile,
        babyGrowthMode,
        setBabyGrowthMode,
        familySituation,
        setFamilySituation,
        childReports,
        addChildReport,
        deleteChildReport,
        fetalProfile,
        updateFetalProfile,
        addUltrasoundMeasurement,
        transitionBabyBorn,
        growthLogs,
        addGrowthLog,
        feedingLogs,
        addFeedingLog,
        diaperLogs,
        addDiaperLog,
        sleepLogs,
        addSleepLog,
        vaccines,
        toggleVaccineStatus,
        documents,
        addDocument,
        hospitalBag,
        toggleHospitalBagItem,
        addHospitalBagItem,
        exportUserDataJson,
        deleteUserData,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
