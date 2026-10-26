export type LanguageOrigin =
  | 'Americas & Europe'
  | 'South Asia'
  | 'East & Southeast Asia'
  | 'Middle East & North Africa'
  | 'Sub-Saharan Africa';

export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  origin: LanguageOrigin;
  flag: string;
  rtl?: boolean;
}

export type Language = string;

export type AppMode =
  | 'pregnancy'
  | 'baby'
  | 'reminders'
  | 'environmental'
  | 'nutrition'
  | 'risk-insights'
  | 'family-health'
  | 'assistant'
  | 'vault'
  | 'postpartum'
  | 'hospitals'
  | 'admin';

export interface EnvironmentalObservations {
  success: boolean;
  available: boolean;
  city: string;
  coordinates: { lat: number; lng: number };
  temperature: number;
  temperatureMin?: number;
  temperatureMax?: number;
  relativeHumidity: number;
  apparentTemperature: number;
  windSpeed?: number;
  windDirection?: number;
  uvIndex?: number;
  aqi: number;
  pm25: number;
  pm10?: number;
  ozone?: number;
  no2?: number;
  so2?: number;
  co?: number;
  climateRiskLevel: 'low' | 'moderate' | 'high';
  advisories: string[];
  weatherDescription?: string;
  source: string;
  timestamp: string;
  dataFreshness: 'live_observed' | 'recent_cached' | 'stale_offline';
  localTimeZone?: string;
}

export interface DailyEnvironmentalReport {
  id: string;
  generatedAt: string;
  city: string;
  sectionA_environment: {
    summary: string;
    summaryHi: string;
    temperatureObservation: string;
    airQualityObservation: string;
    otherAlerts: string[];
    sourceAndFreshness: string;
  };
  sectionB_personalRelevance: {
    vulnerabilityFactors: string[];
    clinicalRationale: string;
    clinicalRationaleHi: string;
    maternalFetalPhysiologyNote: string;
  };
  sectionC_clinicalMeasurements: {
    latestBpStatus: string;
    latestBpTimestamp: string;
    latestSugarStatus: string;
    latestSugarTimestamp: string;
    environmentalCorrelationAssessment: string;
    noFalseCausationNotice: string;
  };
  sectionD_precautions: {
    optimalOutdoorWindows: string[];
    hydrationTargetLiters: number;
    airPollutionMitigation: string[];
    monitoringSchedule: string;
    doctorConsultationTriggers: string[];
    emergencyRedFlags: string[];
  };
}

export type ReminderCategory =
  | 'vaccination'
  | 'antenatal_checkup'
  | 'medical_test'
  | 'medication'
  | 'nutrition'
  | 'child_health';

export interface CategoryReminderConfig {
  enabled: boolean;
  advanceDays: number[]; // e.g. [3, 0]
  preferredTime: string; // e.g. "09:00"
}

export interface ReminderSettings {
  defaultAdvanceDays: number[]; // Default rule: [3, 0] -> 3 days before and on due date
  preferredTime: string; // e.g. "09:00"
  timeZone: string;
  enableBrowserPush: boolean;
  enableInAppToasts: boolean;
  separateCategoryConfigs: boolean;
  useGlobalPreferences: boolean;
  privacySafeLockScreen: boolean;
  categories: {
    vaccination: CategoryReminderConfig;
    antenatal_checkup: CategoryReminderConfig;
    medical_test: CategoryReminderConfig;
    medication: CategoryReminderConfig;
    nutrition: CategoryReminderConfig;
    child_health: CategoryReminderConfig;
  };
  lastUpdated: string;
}

export interface HealthReminder {
  id: string;
  title: string;
  titleHi?: string;
  titleTe?: string;
  category: ReminderCategory;
  targetPerson: 'mother' | 'baby';
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  isCompleted: boolean;
  completedDate?: string;
  isSnoozed?: boolean;
  snoozedUntil?: string;
  rescheduledCount?: number;
  originalDueDate?: string;
  whyShown: string;
  whyShownHi?: string;
  whyShownTe?: string;
  clinicalSource: string;
  clinicalSourceUrl?: string;
  sourceVerifiedDate: string;
  isDoctorConfirmed: boolean;
  vaccineDoseCode?: 'Td-1' | 'Td-2' | 'Td-Booster' | 'BCG' | 'OPV-0' | 'HepB-0' | 'Pentavalent-1' | 'Rotavirus-1' | 'Tdap';
  notes?: string;
}

export interface NotificationLog {
  id: string;
  reminderId: string;
  title: string;
  message: string;
  sentAt: string;
  channel: 'browser_push' | 'in_app';
  status: 'delivered' | 'completed' | 'snoozed' | 'rescheduled';
}

export type DietaryPreferenceType =
  | 'vegetarian'
  | 'eggetarian'
  | 'non_vegetarian'
  | 'vegan'
  | 'other';

export interface NutritionProfile {
  dietaryPreference: DietaryPreferenceType;
  customDietaryNotes?: string;
  foodAllergies: string[]; // e.g. 'Peanuts', 'Tree nuts', 'Lactose / Cow Milk', 'Gluten / Wheat', 'Soy', 'Eggs', 'Shellfish'
  avoidedFoods: string[]; // e.g. 'Raw papaya', 'Unpasteurized cheese', 'Pork', 'Beef', 'Excess spice', 'Garlic/Onion'
  avoidanceReasons: string[]; // 'medical', 'religious', 'cultural', 'personal'
  favoriteCuisines: string[]; // e.g. 'Awadhi / North Indian', 'South Indian', 'Maharashtrian', 'Punjabi', 'Continental', 'Bengali'
  preferredIngredients?: string[]; // e.g. 'Spinach', 'Oats', 'Lentils', 'Makhana', 'Paneer', 'Eggs', 'Fresh fish'
  culturalReligiousRestrictions?: string[]; // e.g. 'Halal', 'Jain / No Root Vegetables', 'Kosher', 'No Beef', 'No Pork', 'Fasting friendly'
  dislikedFoods: string[];
  dailyBudgetLevel: 'economical' | 'moderate' | 'premium' | 'flexible';
  mealsPerDay: number; // e.g. 3, 5, 6
  preferredMealTimings: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  cookingStyle: 'mostly_home_cooked' | 'balanced_home_and_outside' | 'mostly_ordered' | 'cook_facility';
  kitchenFacilities: string[]; // e.g. 'Full kitchen & stove', 'Refrigerator', 'Blender / Mixer', 'Microwave', 'Induction only'
  waterIntakeGoalLiters: number;
  lastUpdated: string;
}

export type MealSlot =
  | 'early_morning'
  | 'breakfast'
  | 'mid_morning'
  | 'lunch'
  | 'evening_snack'
  | 'dinner'
  | 'bedtime';

export interface EstimatedNutrients {
  calories: number; // kcal
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  ironMg?: number;
  calciumMg?: number;
  folateMcg?: number;
  isReliableEstimate: boolean;
}

export interface MealPlanItem {
  id: string;
  slot: MealSlot;
  slotLabel: string;
  slotLabelHi: string;
  foodName: string;
  foodNameHi: string;
  description: string;
  portionGuide: string;
  mainIngredients: string[];
  estimatedNutrients: EstimatedNutrients;
  clinicalWhy: string;
  clinicalWhyHi?: string;
  preferenceSubstitution: string;
  affordableAlternative: string;
  simplePreparation: string[];
  isLiked?: boolean;
  isDisliked?: boolean;
  isEaten?: boolean;
  isUnavailable?: boolean;
}

export type LocalFoodSafetyStatus =
  | 'suitable'
  | 'suitable_with_modifications'
  | 'limit_or_alternative'
  | 'avoid_safety_reason'
  | 'insufficient_info';

export interface LocalDishEvaluation {
  id: string;
  dishName: string;
  dishNameHi: string;
  cityRegion: string;
  cuisine: string;
  famousFor: string;
  status: LocalFoodSafetyStatus;
  statusLabel: string;
  statusLabelHi: string;
  clinicalReason: string;
  clinicalReasonHi: string;
  portionTip: string;
  healthyModification: string;
  safetyCheck: {
    pregnancySafe: boolean;
    isRawOrUndercookedRisk: boolean;
    highSodiumOrSugarRisk: boolean;
    deepFriedRisk: boolean;
    potentialAllergens: string[];
  };
  dietSuitability: DietaryPreferenceType[];
  whoGuidelineAlignment: string;
}

export interface FoodAlternativeItem {
  id: string;
  originalFood: string;
  recommendedAlternative: string;
  category: 'grain' | 'protein' | 'dairy' | 'snack' | 'sweetener';
  clinicalAdvantage: string;
  clinicalAdvantageHi?: string;
  affordableFactor: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: 'Fresh Produce' | 'Pulses & Legumes' | 'Whole Grains' | 'Dairy & Alternatives' | 'Nuts & Seeds' | 'Pantry & Spices';
  checked: boolean;
}

export interface ConsentSettings {
  healthDataProcessing: boolean;
  aiAnalysisConsent: boolean;
  locationPermission: boolean;
  dataRetentionAgreed: boolean;
  termsAcceptedDate?: string;
  allowManualLocationOverride: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  dateOfBirth?: string;
  email: string;
  phone: string;
  bloodGroup: string;
  rhFactor?: '+' | '-' | 'unknown';
  country?: string;
  country_code?: string;
  country_name?: string;
  city: string;
  state: string;
  state_region_code?: string;
  state_region_name?: string;
  district?: string;
  district_code?: string;
  district_name?: string;
  latitude?: number;
  longitude?: number;
  gpsPermissionGranted?: boolean;
  postalCode?: string;
  ancestryOrigin?: string; // voluntary and medically relevant
  familyStructure?: string; // e.g. Nuclear, Joint family, Single parent
  householdEnvironment?: string; // e.g. Urban apartment, Suburban home, Well-ventilated
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation?: string;
  primaryHospital: string;
  doctorName: string;
  doctorPhone: string;
  preferredLanguage: Language;
  enableLocationBasedHealthIntelligence?: boolean; // Controls whether local atmospheric conditions personalize recommendations
  onboardingCompleted?: boolean;
}

export interface ParentMedicalHistory {
  parentRole: 'mother' | 'father';
  fullName: string;
  dateOfBirth?: string;
  bloodGroup: string;
  rhFactor: '+' | '-' | 'unknown';
  preExistingConditions: string[]; // e.g. 'Type 1 Diabetes', 'Type 2 Diabetes', 'Chronic Hypertension', 'Hypothyroidism', 'Hyperthyroidism', 'Asthma', 'Epilepsy', 'Heart Disease'
  geneticDisorders: string[]; // e.g. 'Thalassemia Trait', 'Sickle Cell Trait', 'Cystic Fibrosis Carrier', 'None Diagnosed'
  geneticScreeningDone: boolean;
  geneticScreeningDetails?: string;
  allergies: string[]; // e.g. 'Penicillin', 'Sulfa drugs', 'Latex', 'Peanuts'
  currentMedications: string[];
  currentSupplements: string[]; // e.g. 'Folic Acid 5mg', 'Iron', 'Calcium', 'Vitamin D3'
  surgeriesAndAdmissions: string[];
  previousPregnancyOutcomes?: {
    totalPregnancies: number;
    liveBirths: number;
    miscarriages: number;
    complications: string[]; // e.g. 'Preeclampsia', 'GDM', 'Preterm labor', 'None'
  };
  previousChildCongenitalCondition?: string;
  infectiousDiseaseHistory: string[]; // e.g. 'Rubella Immune', 'Hepatitis B Negative', 'Varicella Immune'
  statusSummary: 'known_healthy' | 'managed_condition' | 'elevated_risk' | 'unknown';
}

export interface RelativeHealthRecord {
  id: string;
  relationship: 'mother' | 'father' | 'sibling' | 'maternal_grandmother' | 'maternal_grandfather' | 'paternal_grandmother' | 'paternal_grandfather' | 'aunt_uncle' | 'other_relative';
  relationshipSide: 'maternal' | 'paternal';
  relativeName?: string;
  condition: string; // e.g. 'Type 2 Diabetes', 'Thalassemia', 'Congenital Heart Defect', 'Neural Tube Defect', 'Early-onset CAD', 'Hypertension'
  ageOfOnset?: number | string;
  isCarrier: boolean;
  notes?: string;
  status: 'confirmed' | 'suspected' | 'unknown' | 'not_applicable';
}

export interface FamilyPedigreeHistory {
  maternalSideUnknown: boolean;
  paternalSideUnknown: boolean;
  records: RelativeHealthRecord[];
  consanguinity: boolean; // Are parents related by blood?
  knownHereditarySyndromes: string[];
  recurrentPregnancyLossInFamily: boolean;
  unexplainedEarlyInfantDeaths: boolean;
  lastUpdated: string;
}

export interface LifestyleEnvironmentalProfile {
  nutritionHabits: 'balanced_omnivore' | 'vegetarian' | 'vegan' | 'iron_rich' | 'needs_guidance';
  physicalActivityLevel: 'sedentary' | 'light_walking' | 'prenatal_yoga' | 'active';
  averageSleepHours: number;
  dailyWaterLiters: number;
  tobaccoExposure: 'none' | 'past_smoker' | 'secondhand_smoke' | 'active_smoker';
  alcoholConsumption: 'none' | 'stopped_before_pregnancy' | 'occasional' | 'prefer_not_to_say';
  occupationalExposures: string[]; // e.g. 'Computer desk', 'Chemicals/solvents', 'Prolonged standing', 'Healthcare'
  householdAirPollution: 'none' | 'traffic_smog' | 'biomass_smoke' | 'moderate';
  accessToCare: 'excellent_tertiary' | 'good_clinic' | 'limited_rural';
  vaccinesCurrent: boolean;
  notes?: string;
}

export type BabyRiskCategory =
  | 'no_elevated_risk'
  | 'additional_info_needed'
  | 'risk_factor_identified'
  | 'prompt_assessment';

export interface BabyRiskFactorItem {
  id: string;
  domain: 'maternal' | 'paternal_inherited' | 'pregnancy_related' | 'preventive_care';
  title: string;
  severity: 'reassuring' | 'monitoring' | 'clinical_discussion' | 'prompt_review';
  clinicalRationale: string;
  clinicalRationaleHi?: string;
  whyItMatters: string;
  evidenceSource: string;
  evidenceSourceUrl?: string;
  protectiveFactors?: string[];
  recommendedAction: string;
  questionsForDoctor: string[];
}

export interface BabyRiskAssessmentResult {
  overallCategory: BabyRiskCategory;
  categoryLabel: string;
  categoryLabelHi: string;
  summary: string;
  summaryHi: string;
  assessmentDate: string;
  riskFactors: BabyRiskFactorItem[];
  protectiveFactorsSummary: string[];
  recommendedConsultations: Array<{
    specialty: 'Obstetrician' | 'Pediatrician' | 'Clinical Geneticist' | 'Endocrinologist' | 'Dietitian';
    timing: string;
    primaryFocus: string;
  }>;
  recommendedScreenings: Array<{
    testName: string;
    windowWeeks: string;
    guidelineStandard: string;
    clinicalReason: string;
  }>;
  safetyLimitations: {
    disclaimer: string;
    noPredictiveGuaranteeNotice: string;
    normalReportBoundaryNotice: string;
    familyHistoryBoundaryNotice: string;
  };
  references: ClinicalReferenceCitation[];
}

export interface CarePlanActionItem {
  id: string;
  title: string;
  titleHi?: string;
  category: 'routine_prenatal' | 'clinician_review' | 'urgent_warning' | 'lifestyle_safeguard';
  priority: 'routine' | 'discuss_soon' | 'urgent';
  whatItMeans: string;
  whyItMatters: string;
  practicalSteps: string[];
  doctorSpecialty: string;
  timing: string;
  neededInformation?: string;
  warningSigns: string[];
  isCompleted?: boolean;
}

export interface HealthTimelineEvent {
  id: string;
  period: string; // e.g. "Week 12", "Week 20", "Week 24-28", "Week 36", "Birth Dose", "Week 6"
  title: string;
  titleHi?: string;
  description: string;
  domain: 'screening' | 'milestone' | 'vaccine' | 'lab_check' | 'pediatric';
  status: 'completed' | 'current' | 'upcoming';
  whoStandardRef?: string;
  actionRequired?: string;
}

export interface ClinicalReferenceCitation {
  id: string;
  title: string;
  issuingOrganization: 'World Health Organization (WHO)' | 'MoHFW India' | 'ICMR' | 'FOGSI' | 'IAP' | 'ACOG';
  publicationYear: string;
  relevantSection: string;
  url: string;
  isOfficialGuideline: boolean;
  clinicalSummary: string;
}

export interface PregnancyProfile {
  id: string;
  lastMenstrualPeriod: string; // YYYY-MM-DD
  estimatedDueDate: string; // YYYY-MM-DD
  conceptionDate?: string;
  currentWeek: number;
  currentDay: number;
  trimester: 1 | 2 | 3;
  pregnancyType: 'singleton' | 'twins' | 'multiple';
  highRiskFlags: string[]; // e.g. "Gestational Hypertension", "Gestational Diabetes", "Rh Negative"
  prePregnancyWeightKg: number;
}

export interface MaternalVitalLog {
  id: string;
  date: string;
  time: string;
  gestationalWeek: number;
  weightKg?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugarMgDl?: number;
  bloodSugarType?: 'fasting' | 'post_prandial_1h' | 'post_prandial_2h' | 'random';
  fetalKicksCount?: number;
  notes?: string;
}

export interface SymptomLog {
  id: string;
  date: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  mood: 'happy' | 'calm' | 'anxious' | 'tired' | 'overwhelmed';
  sleepHours: number;
  waterGlasses: number;
  notes: string;
}

export interface BabyProfile {
  id: string;
  name: string;
  gender: 'boy' | 'girl';
  birthDate: string; // YYYY-MM-DD
  birthTime?: string;
  birthWeightKg: number;
  birthLengthCm: number;
  birthHeadCircumferenceCm?: number;
  gestationalAgeWeeksAtBirth?: number; // e.g. 33 for premature, 39 for term
  isPremature?: boolean; // true if gestationalAgeWeeksAtBirth < 37
  birthHistory?: string; // e.g. Normal delivery, C-section at 34w
  medicalConditions?: string[]; // e.g. Mild jaundice, None
  allergies?: string[]; // e.g. Cow milk protein, Peanuts, None
  currentMedications?: string[];
  feedingMethod?: 'exclusive_breastfeeding' | 'formula' | 'mixed_breast_and_formula' | 'solids_and_milk';
  bloodGroup: string;
  pediatricianName: string;
  pediatricianPhone: string;
  householdCircumstances?: {
    dietaryPattern?: 'vegetarian' | 'eggetarian' | 'non_vegetarian' | 'vegan' | 'other';
    drinkingWaterSource?: string;
    indoorSmokeExposure?: boolean;
    smokingInHousehold?: boolean;
    daycareOrSchool?: string;
  };
  originPregnancyId?: string; // linked pregnancy record if born
  notes?: string;
  isArchived?: boolean;
  createdAt?: string;
}

export interface ChildMedicalReportParameter {
  label: string;
  value: string;
  unit: string;
  referenceInterval: string;
  status: 'normal' | 'low' | 'high' | 'abnormal';
  clinicalContext?: string;
}

export interface ChildMedicalReport {
  id: string;
  babyId: string;
  fileName: string;
  fileUrl?: string;
  category: 'cbc_blood' | 'iron_nutrients' | 'vitamins' | 'growth_anthropometry' | 'prescription' | 'discharge_summary' | 'allergy_diagnostic';
  testName: string;
  collectionDate: string;
  reportDate: string;
  facilityOrLab?: string;
  parameters: ChildMedicalReportParameter[];
  extractedSummary: string;
  pediatricianReviewNeeded: boolean;
  doctorQuestions: string[];
  previousComparisonNote?: string;
}

export interface ChildDietPlan {
  id: string;
  babyId: string;
  ageMonths: number;
  feedingStage: 'exclusive_milk_under_6m' | 'complementary_feeding_6_23m' | 'balanced_child_diet_2plus';
  dietaryPreference: 'vegetarian' | 'eggetarian' | 'non_vegetarian' | 'vegan' | 'other';
  meals: Array<{
    slot: string;
    slotHi?: string;
    foodName: string;
    texture: string;
    portion: string;
    ingredients: string[];
    whySuitable: string;
    allergensToAvoid: string[];
  }>;
  hydrationGuidance: string;
  foodSafetyTips: string[];
  affordableSwaps: Array<{
    original: string;
    swap: string;
    benefit: string;
  }>;
  weeklyMenuSummary?: string;
}

export interface ChildEnvironmentalAssessment {
  id: string;
  babyId: string;
  generatedAt: string;
  city: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  aqi: number;
  pm25: number;
  pm10?: number;
  uvIndex?: number;
  airQualityStatus: string;
  clinicalSynthesis: {
    clinicalFindings: string;
    growthStatus: string;
    environmentalExposure: string;
    nutritionReview: string;
    recommendedAction: 'routine_monitoring' | 'pediatric_consultation' | 'urgent_assessment' | 'emergency_care';
    emergencyWarning?: string;
    precautions: string[];
  };
}

export interface FetalUltrasoundMeasurement {
  id: string;
  date: string;
  gestationalWeek: number;
  crownRumpLengthMm?: number; // CRL
  biparietalDiameterMm?: number; // BPD
  headCircumferenceMm?: number; // HC
  abdominalCircumferenceMm?: number; // AC
  femurLengthMm?: number; // FL
  estimatedFetalWeightGrams?: number; // EFW
  amnioticFluidIndexCm?: number; // AFI
  fetalHeartRateBpm?: number; // FHR
  placentaLocation?: string;
  clinicianNotes?: string;
  reportingFacility?: string;
  isDoctorConfirmed: boolean;
}

export interface FetalProfile {
  id: string;
  motherName: string;
  fetalDisplayName: string; // "Baby of Ananya"
  lmpDate?: string;
  eddDate?: string;
  eddSource: 'clinician_ultrasound_confirmed' | 'calculated_from_lmp' | 'unconfirmed';
  currentGestationalWeeks: number;
  currentGestationalDays: number;
  pregnancyType: 'singleton' | 'twins' | 'multiple';
  datingStatus: 'confirmed' | 'dating_needs_confirmation';
  ultrasounds: FetalUltrasoundMeasurement[];
  antenatalNotes?: string[];
}

export interface BabyGrowthLog {
  id: string;
  babyId: string;
  date: string;
  ageInMonths: number;
  weightKg: number;
  lengthCm: number;
  headCircumferenceCm?: number;
  percentileWeight?: number;
  percentileLength?: number;
  notes?: string;
}

export interface FeedingLog {
  id: string;
  babyId: string;
  timestamp: string;
  type: 'breast_left' | 'breast_right' | 'both_breasts' | 'formula' | 'expressed_milk' | 'solids';
  durationMinutes?: number;
  amountMl?: number;
  notes?: string;
}

export interface DiaperLog {
  id: string;
  babyId: string;
  timestamp: string;
  type: 'wet' | 'dirty' | 'both';
  stoolConsistency?: 'liquid' | 'soft' | 'formed' | 'hard';
  stoolColor?: 'yellow' | 'mustard' | 'green' | 'brown' | 'black_meconium';
  notes?: string;
}

export interface SleepLog {
  id: string;
  babyId: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  quality: 'peaceful' | 'restless';
}

export interface VaccineRecord {
  id: string;
  babyId: string;
  vaccineKey: string;
  name: string;
  targetAge: string;
  targetAgeWeeks: number;
  dueDate: string;
  administeredDate?: string;
  isGiven: boolean;
  batchNumber?: string;
  clinic?: string;
  notes?: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'ultrasound' | 'blood_test' | 'urine_test' | 'prescription' | 'vaccine_card' | 'discharge_summary' | 'pediatric';
  date: string;
  fileUrl?: string;
  fileName: string;
  extractedText?: string;
  aiExplanation?: string;
  doctorQuestions?: string[];
  keyParameters?: { label: string; value: string; isNormal: boolean; referenceRange?: string }[];
}

export interface AppointmentReminder {
  id: string;
  title: string;
  doctorName: string;
  clinic: string;
  date: string;
  time: string;
  type: 'routine_prenatal' | 'ultrasound' | 'lab_work' | 'pediatrician' | 'postpartum_check';
  questionsPrepared: string[];
  isCompleted: boolean;
}

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  timing: string[]; // e.g. ["09:00", "21:00"]
  frequency: 'daily' | 'twice_daily' | 'with_food' | 'as_needed';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
}

export interface HospitalBagItem {
  id: string;
  category: 'mother' | 'baby' | 'partner' | 'documents';
  item: string;
  itemHi: string;
  isPacked: boolean;
  quantity?: string;
}

export interface EpdsQuestion {
  id: number;
  question: string;
  questionHi: string;
  options: {
    text: string;
    textHi: string;
    score: number;
  }[];
}

export interface ExtractedLabFinding {
  testName: string;
  measuredValue: string;
  numericValue?: number;
  unit: string;
  labReferenceRange: string;
  whoStandard: string;
  status: 'normal' | 'outside' | 'borderline' | 'uninterpretable';
  clinicalImplication: string;
  isVerified: boolean;
  needsClarificationReason?: string;
}

export interface ReportComparisonTrend {
  parameter: string;
  previousValue?: string;
  previousDate?: string;
  currentValue: string;
  currentDate: string;
  trendDescription: string;
  isClinicallySignificant: boolean;
}

export interface DynamicDietAdaptation {
  id: string;
  planLastUpdated: string;
  sourceReportId?: string;
  sourceReportTitle?: string;
  sourceReportDate?: string;
  reportCategory?: string;
  isBasedOnNewReport: boolean;
  needsClarification: boolean;
  clarificationNotice?: string;
  trimester: 1 | 2 | 3;
  gestationalWeek: number;
  dietaryPreference: DietaryPreferenceType;
  city: string;
  extractedFindings: ExtractedLabFinding[];
  trendsFromPrevious: ReportComparisonTrend[];
  whatChangedSummary: string[];
  clinicalRationale: string;
  nutritionalGoals: {
    caloriesTarget: number;
    proteinGramsTarget: number;
    ironMgTarget: number;
    calciumMgTarget: number;
    folateMcgTarget: number;
    hydrationLitersTarget: number;
    keyNutrientFocus: string[];
  };
  foodsToPrioritize: Array<{
    food: string;
    reason: string;
    servingTip: string;
  }>;
  foodsToRestrict: Array<{
    food: string;
    reason: string;
    severity: 'strict_avoid' | 'limit_moderation';
  }>;
  doctorConsultationTriggers: string[];
  meals: MealPlanItem[];
}

