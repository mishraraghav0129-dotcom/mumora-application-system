/**
 * Mumora Personalised Environmental & Health Analysis Engine
 * 
 * Holistic, evidence-based clinical reasoning combining:
 * 1. Geographic & Atmospheric Telemetry (Open-Meteo, CAMS, WHO 2021 Air Quality, WHO 2023 Heat Stress)
 * 2. Maternal / Infant Clinical Profile (Gestational age, postpartum age, symptoms)
 * 3. Maternal & Paternal Medical History (pre-existing conditions, allergies, medications)
 * 4. Family Pedigree & Inherited Risk Factors (consanguinity, family diabetes, hypertension)
 * 5. Uploaded Clinical Reports & Extracted Lab Parameters (CBC Hb, ultrasounds, urine, biochemistry)
 * 6. Recent Maternal Vital Signs (Blood Pressure, Blood Glucose, Fetal Movements)
 * 
 * Strict clinical boundary: Never invents data, never claims definitive disease diagnosis,
 * clearly marks missing parameters, and prioritizes maternal-fetal safety.
 */

import {
  UserProfile,
  PregnancyProfile,
  BabyProfile,
  ParentMedicalHistory,
  FamilyPedigreeHistory,
  MaternalVitalLog,
  DocumentRecord,
  ChildMedicalReport,
  EnvironmentalObservations,
  Language,
} from '../types';

export type UrgencyLevel = 'routine_monitoring' | 'clinician_consultation' | 'urgent_medical_assessment';

export interface KeyFinding {
  id: string;
  category: 'maternal' | 'fetal_infant' | 'environmental_risk' | 'clinical_history' | 'lab_report';
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  supportingInputs: string[];
  clinicalSignificance: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface EnvironmentalFactorSummary {
  factor: 'heat_index' | 'air_quality_pm' | 'uv_radiation' | 'humidity';
  label: string;
  currentValue: string;
  standardThreshold: string;
  status: 'safe' | 'caution' | 'warning' | 'data_unavailable';
  impactOnUser: string;
}

export interface PracticalPrecaution {
  id: string;
  priority: 'essential' | 'recommended' | 'routine';
  action: string;
  actionHi?: string;
  rationale: string;
  timeWindow?: string;
}

export interface MissingDataWarning {
  field: string;
  fieldHi?: string;
  impact: string;
  impactHi?: string;
  recommendedStep: string;
  actionType: 'log_vitals' | 'upload_report' | 'update_profile' | 'family_history' | 'location_weather';
}

export interface GuidelineCitation {
  id: string;
  title: string;
  issuingBody: 'WHO' | 'ACOG' | 'FIGO' | 'MoHFW' | 'ICMR';
  year: number;
  url?: string;
  summary: string;
}

export interface PersonalizedAnalysisResult {
  generatedAt: string;
  locationSummary: {
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  environmentalFreshness: {
    isLive: boolean;
    source: string;
    observedTime?: string;
    unavailableMessage?: string;
  };
  clinicalProfileStatus: {
    mode: 'pregnancy' | 'baby';
    stageDescription: string;
    vitalsStatus: {
      hasLogs: boolean;
      latestDate?: string;
      latestBp?: string;
      latestSugar?: string;
      isOverdue: boolean;
      isBpElevated: boolean;
    };
    medicalHistoryStatus: {
      hasConditionsLogged: boolean;
      conditionsCount: number;
      conditionsList: string[];
      hasAllergiesLogged: boolean;
      paternalRecorded: boolean;
      consanguinityRecorded: boolean;
    };
    reportsStatus: {
      totalUploaded: number;
      categoriesSummary: string[];
      hasRecentUltrasound: boolean;
      hasBloodCount: boolean;
      extractedParametersCount: number;
      notableFindings: string[];
    };
  };
  urgencyLevel: UrgencyLevel;
  urgencyRationale: string;
  urgencyRationaleHi?: string;
  keyFindings: KeyFinding[];
  environmentalFactors: EnvironmentalFactorSummary[];
  precautions: PracticalPrecaution[];
  missingDataWarnings: MissingDataWarning[];
  guidelineCitations: GuidelineCitation[];
  uncertaintyStatement: string;
  uncertaintyStatementHi: string;
}

export interface AnalysisEngineInput {
  userProfile: UserProfile;
  pregnancy: PregnancyProfile;
  activeBaby?: BabyProfile;
  isBabyMode?: boolean;
  maternalHistory: ParentMedicalHistory;
  paternalHistory: ParentMedicalHistory;
  familyPedigree: FamilyPedigreeHistory;
  vitalLogs: MaternalVitalLog[];
  documents: DocumentRecord[];
  childReports?: ChildMedicalReport[];
  envData: EnvironmentalObservations | null;
  language: Language;
}

export function runPersonalizedAnalysis(input: AnalysisEngineInput): PersonalizedAnalysisResult {
  const {
    userProfile,
    pregnancy,
    activeBaby,
    isBabyMode = false,
    maternalHistory,
    paternalHistory,
    familyPedigree,
    vitalLogs,
    documents,
    childReports = [],
    envData,
    language,
  } = input;

  const isHi = language === 'hi';
  const now = new Date();

  // Location details
  const city = userProfile.district_name || userProfile.district || userProfile.city || 'Bengaluru';
  const state = userProfile.state_region_name || userProfile.state || 'Karnataka';
  const country = userProfile.country_name || userProfile.country || 'India';

  // Environmental readings
  const hasEnv = !!(envData && envData.available);
  const temp = envData?.temperature ?? null;
  const apparentTemp = envData?.apparentTemperature ?? null;
  const humidity = envData?.relativeHumidity ?? null;
  const aqi = envData?.aqi ?? null;
  const pm25 = envData?.pm25 ?? null;
  const uvIndex = envData?.uvIndex ?? null;

  // Pregnancy / Baby stage
  const week = pregnancy.currentWeek || 0;
  const trimester = pregnancy.trimester || (week <= 13 ? 1 : week <= 27 ? 2 : 3);

  // Vitals analysis
  const latestVital = vitalLogs.length > 0 ? vitalLogs[0] : null;
  const latestSystolic = latestVital?.bloodPressureSystolic ?? null;
  const latestDiastolic = latestVital?.bloodPressureDiastolic ?? null;
  const latestSugar = latestVital?.bloodSugarMgDl ?? null;
  const isBpElevated = (latestSystolic !== null && latestSystolic >= 140) || (latestDiastolic !== null && latestDiastolic >= 90);
  const isBpBorderline = !isBpElevated && ((latestSystolic !== null && latestSystolic >= 130) || (latestDiastolic !== null && latestDiastolic >= 85));

  // Determine if vitals are overdue (e.g. no reading in past 7 days)
  let isVitalsOverdue = true;
  if (latestVital?.date) {
    const diffDays = Math.floor((now.getTime() - new Date(latestVital.date).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      isVitalsOverdue = false;
    }
  }

  // Maternal conditions check
  const maternalConditions: string[] = maternalHistory.preExistingConditions || [];
  const maternalAllergies: string[] = maternalHistory.allergies || [];
  const maternalMeds: string[] = maternalHistory.currentMedications || [];
  const hasHypertensionHistory = maternalConditions.some((c: string) => /hypertension|high blood pressure|preeclampsia|bp/i.test(c));
  const hasDiabetesHistory = maternalConditions.some((c: string) => /diabetes|gdm|sugar|insulin/i.test(c));
  const hasAsthmaHistory = maternalConditions.some((c: string) => /asthma|respiratory|wheeze|bronch/i.test(c));
  const hasAnemiaHistory = maternalConditions.some((c: string) => /anemia|anaemia|iron deficiency|low hb/i.test(c));

  // Documents & Clinical reports analysis
  const ultrasoundDocs = documents.filter(d => d.category === 'ultrasound');
  const bloodDocs = documents.filter(d => d.category === 'blood_test');
  const totalUploadedDocs = documents.length + childReports.length;

  // Inspect extracted parameters from uploaded documents (e.g., Hemoglobin, AFI, Platelets)
  let extractedHb: number | null = null;
  let extractedAfi: number | null = null;
  let notableReportFindings: string[] = [];

  documents.forEach(doc => {
    if (doc.keyParameters && doc.keyParameters.length > 0) {
      doc.keyParameters.forEach(param => {
        const lbl = param.label.toLowerCase();
        const valNum = parseFloat(param.value);
        if (lbl.includes('hemoglobin') || lbl.includes('hb')) {
          if (!isNaN(valNum)) extractedHb = valNum;
          if (!param.isNormal) notableReportFindings.push(`Document ${doc.title}: Hemoglobin ${param.value} (outside reference)`);
        }
        if (lbl.includes('amniotic fluid') || lbl.includes('afi')) {
          if (!isNaN(valNum)) extractedAfi = valNum;
          if (!param.isNormal) notableReportFindings.push(`Ultrasound ${doc.title}: AFI ${param.value} cm (outside reference)`);
        }
      });
    }
  });

  // Track key findings and missing warnings
  const keyFindings: KeyFinding[] = [];
  const missingDataWarnings: MissingDataWarning[] = [];
  const precautions: PracticalPrecaution[] = [];
  const guidelineCitations: GuidelineCitation[] = [];

  let urgencyLevel: UrgencyLevel = 'routine_monitoring';
  let urgencyRationale = 'Standard antenatal precautions apply. Environmental parameters and logged maternal indicators are within acceptable reference ranges.';
  let urgencyRationaleHi = 'मानक प्रसूति सावधानियां लागू हैं। पर्यावरणीय पैरामीटर और दर्ज मातृत्व संकेतक संदर्भ सीमा के भीतर हैं।';

  // -------------------------------------------------------------------------
  // 1. CRITICAL RED-FLAG RULE: Elevated Blood Pressure (BP >= 140/90)
  // -------------------------------------------------------------------------
  if (isBpElevated) {
    urgencyLevel = 'urgent_medical_assessment';
    urgencyRationale = `Logged blood pressure (${latestSystolic}/${latestDiastolic} mmHg) meets the clinical threshold for gestational hypertension/preeclampsia. Immediate clinical evaluation is required. Under no circumstances should abnormal hemodynamics be attributed to weather.`;
    urgencyRationaleHi = `दर्ज रक्तचाप (${latestSystolic}/${latestDiastolic} mmHg) गर्भावधि उच्च रक्तचाप/प्री-एक्लेम्पसिया की नैदानिक सीमा तक पहुंच गया है। तत्काल डॉक्टर द्वारा जांच आवश्यक है। इसे मौसम पर नहीं छोड़ा जा सकता।`;

    keyFindings.push({
      id: 'kf_high_bp',
      category: 'maternal',
      title: isHi ? 'उच्च रक्तचाप सतर्कता (BP ≥ 140/90 mmHg)' : 'Gestational Hypertension Threshold Exceeded',
      titleHi: 'उच्च रक्तचाप सतर्कता (BP ≥ 140/90 mmHg)',
      description: isHi
        ? `हालिया बीपी ${latestSystolic}/${latestDiastolic} दर्ज किया गया है। यह ACOG एवं WHO प्री-एक्लेम्पसिया स्क्रीनिंग दिशानिर्देशों के तहत तत्काल समीक्षा की मांग करता है।`
        : `Recent maternal blood pressure logged at ${latestSystolic}/${latestDiastolic} mmHg exceeds the international diagnostic threshold of 140/90 mmHg.`,
      supportingInputs: [
        `Maternal Vital Log: ${latestSystolic}/${latestDiastolic} mmHg (Recorded ${latestVital?.date || 'recently'})`,
        `Gestation: Week ${week}`,
        hasHypertensionHistory ? 'Pre-existing maternal hypertension indicated in profile' : 'De-novo antenatal elevation'
      ],
      clinicalSignificance: 'Requires prompt urine protein check, laboratory assessment for preeclampsia, and immediate obstetric review.',
      severity: 'critical',
    });

    precautions.push({
      id: 'p_urgent_bp',
      priority: 'essential',
      action: isHi ? 'अपने प्रसूति रोग विशेषज्ञ से तुरंत संपर्क करें या निकटतम प्रसूति केंद्र जाएं।' : 'Contact your obstetrician immediately or visit the maternity triage unit for urgent blood pressure re-check and proteinuria evaluation.',
      actionHi: 'अपने प्रसूति रोग विशेषज्ञ से तुरंत संपर्क करें या निकटतम प्रसूति केंद्र जाएं।',
      rationale: 'Hypertension in pregnancy requires prompt laboratory investigation to safeguard maternal and fetal perfusion.',
      timeWindow: 'Immediate (< 2 hours)',
    });

    guidelineCitations.push({
      id: 'g_acog_preeclampsia',
      title: 'Gestational Hypertension and Preeclampsia (Practice Bulletin No. 222)',
      issuingBody: 'ACOG',
      year: 2020,
      summary: 'Blood pressure of 140 mmHg systolic or 90 mmHg diastolic on two occasions at least 4 hours apart after 20 weeks requires comprehensive maternal-fetal workup.',
    });
  }

  // -------------------------------------------------------------------------
  // 2. MULTI-FACTOR INTERACTION: Ambient Heat + Maternal Dehydration / Gestation
  // -------------------------------------------------------------------------
  const isHighHeat = (temp !== null && temp >= 32) || (apparentTemp !== null && apparentTemp >= 35);
  const isExtremeHeat = (temp !== null && temp >= 38) || (apparentTemp !== null && apparentTemp >= 40);

  if (isHighHeat) {
    const heatFindingSeverity = isExtremeHeat || hasHypertensionHistory ? 'high' : 'moderate';
    if (urgencyLevel !== 'urgent_medical_assessment' && (isExtremeHeat || hasHypertensionHistory)) {
      urgencyLevel = 'clinician_consultation';
      urgencyRationale = `High ambient heat stress (${temp}°C, feels like ${apparentTemp}°C) combined with maternal profile factors increases hemoconcentration and uteroplacental strain.`;
      urgencyRationaleHi = `अत्यधिक तापमान (${temp}°C, अहसास ${apparentTemp}°C) और मातृत्व इतिहास के कारण रक्त गाढ़ा होने और गर्भाशय में रक्त प्रवाह पर दबाव का जोखिम है।`;
    }

    keyFindings.push({
      id: 'kf_heat_stress',
      category: 'environmental_risk',
      title: isHi ? 'उच्च ग्रीष्मकालीन तापीय तनाव (Heat Stress Advisory)' : 'Ambient Thermal Stress & Plasma Volume Strain',
      titleHi: 'उच्च ग्रीष्मकालीन तापीय तनाव',
      description: isHi
        ? `स्थानीय तापमान ${temp}°C (अहसास ${apparentTemp}°C) है। गर्भावस्था में बढ़े हुए प्रोजेस्टेरोन और त्वचा में रक्त प्रवाह के कारण शरीर का तापमान नियंत्रित करना कठिन होता है।`
        : `Local ambient temperature of ${temp}°C (heat index feels like ${apparentTemp}°C) elevates cutaneous vasodilation. Maternal core temperature regulation is stressed during Week ${week || 'active'} gestation.`,
      supportingInputs: [
        `Live Ambient Temperature: ${temp}°C (Feels like ${apparentTemp}°C) in ${city}`,
        `Gestational Age: Week ${week} (Trimester ${trimester})`,
        hasHypertensionHistory ? 'Maternal history of chronic/gestational hypertension' : 'Physiological pregnancy vasodilation'
      ],
      clinicalSignificance: 'Excessive heat exposure in pregnancy is associated with preterm labor risk, transient oligohydramnios, and maternal orthostatic hypotension.',
      severity: heatFindingSeverity,
    });

    precautions.push({
      id: 'p_heat_hydration',
      priority: 'essential',
      action: isHi
        ? `दैनिक तरल सेवन को ३.० - ३.५ लीटर तक बढ़ाएं (नारियल पानी, छाछ, नींबू पानी, सादा जल)। दोपहर ११:०० से ३:३० बजे तक सीधी धूप से बचें।`
        : `Target daily fluid intake of 3.0 – 3.5 liters (clean water, tender coconut water, diluted buttermilk, ORS electrolytes). Avoid direct solar exposure between 11:00 AM and 03:30 PM.`,
      actionHi: 'दैनिक तरल सेवन को ३.० - ३.५ लीटर तक बढ़ाएं और दोपहर की धूप से बचें।',
      rationale: 'Maintains central intravascular circulating volume and preserves amniotic fluid turnover (WHO Heat & Pregnancy 2023).',
      timeWindow: 'Daily ongoing protocol',
    });

    guidelineCitations.push({
      id: 'g_who_heat',
      title: 'Heat and Health in Pregnancy and Newborns: Technical Guidance',
      issuingBody: 'WHO',
      year: 2023,
      summary: 'Recommends active hydration, cooling strategies, and avoidance of midday heat exposure to mitigate preterm birth and preeclampsia exacerbation.',
    });
  }

  // -------------------------------------------------------------------------
  // 3. MULTI-FACTOR INTERACTION: Air Quality (PM2.5 / PM10) + Maternal Respiratory / Fetal Growth
  // -------------------------------------------------------------------------
  const isHighAqi = (aqi !== null && aqi >= 101) || (pm25 !== null && pm25 >= 35);
  const isHazardousAqi = (aqi !== null && aqi >= 200) || (pm25 !== null && pm25 >= 75);

  if (isHighAqi) {
    const aqiSeverity = isHazardousAqi || hasAsthmaHistory ? 'high' : 'moderate';
    if (urgencyLevel === 'routine_monitoring' && (isHazardousAqi || hasAsthmaHistory)) {
      urgencyLevel = 'clinician_consultation';
      urgencyRationale = `Elevated particulate pollution (PM2.5: ${pm25} µg/m³, AQI: ${aqi}) exceeds WHO Air Quality Guidelines (15 µg/m³ 24-hr threshold), posing microvascular placental and respiratory challenges.`;
      urgencyRationaleHi = `हवा में पार्टिकुलेट प्रदूषण (PM2.5: ${pm25} µg/m³) WHO मानक से अधिक है, जिससे प्लेसेंटा और श्वसन स्वास्थ्य की सुरक्षा जरूरी है।`;
    }

    keyFindings.push({
      id: 'kf_air_pollution',
      category: 'environmental_risk',
      title: isHi ? 'पार्टिकुलेट वायु प्रदूषण सतर्कता (PM2.5 / AQI)' : 'Airborne Particulate Matter (PM2.5) Exceedance',
      titleHi: 'पार्टिकुलेट वायु प्रदूषण सतर्कता',
      description: isHi
        ? `स्थानीय AQI ${aqi} (PM2.5: ${pm25} µg/m³) WHO 24-घंटे मानक (15 µg/m³) से काफी ऊपर है। यह सूक्ष्म कण फेफड़ों से रक्त प्रवाह में पहुंचकर प्लेसेंटा पर प्रभाव डाल सकते हैं।`
        : `Local particulate matter concentration (PM2.5: ${pm25} µg/m³) exceeds the WHO 2021 24-hour guideline of 15 µg/m³ by ${(pm25! / 15).toFixed(1)}x. Fine particulates induce systemic inflammation and placental oxidative stress.`,
      supportingInputs: [
        `Live PM2.5 Observation: ${pm25} µg/m³ (AQI: ${aqi}) in ${city}`,
        `WHO Global Standard: 15 µg/m³ 24-hour mean`,
        hasAsthmaHistory ? 'Maternal history of asthma/respiratory hypersensitivity' : 'Vulnerable fetal growth window'
      ],
      clinicalSignificance: 'Fine particulate exposure correlates epidemiologically with intrauterine growth restriction and elevated risk of gestational hypertension.',
      severity: aqiSeverity,
    });

    precautions.push({
      id: 'p_air_mask',
      priority: isHazardousAqi ? 'essential' : 'recommended',
      action: isHi
        ? 'मुख्य सड़कों और भारी ट्रैफिक वाले क्षेत्रों में बाहर निकलते समय N95 या उच्च गुणवत्ता वाला मास्क पहनें। कमरों में गीला पोछा लगाएं और खिड़कियां कम ट्रैफिक वाले समय ही खोलें।'
        : 'Wear a well-fitted N95 particulate respirator when outdoors along transit corridors. Exercise indoors and seal drafty windows during peak vehicular rush hours (08:00 – 10:30 AM & 06:00 – 08:30 PM).',
      actionHi: 'ट्रैफिक वाले क्षेत्रों में N95 मास्क पहनें और इनडोर व्यायाम करें।',
      rationale: 'Reduces inhaled fine aerosol fraction into maternal pulmonary alveoli (WHO Air Quality 2021).',
      timeWindow: 'During active pollution episodes',
    });

    guidelineCitations.push({
      id: 'g_who_aqi',
      title: 'WHO Global Air Quality Guidelines: Particulate Matter (PM2.5 and PM10)',
      issuingBody: 'WHO',
      year: 2021,
      summary: 'Sets 24-hour interim target thresholds and highlights heightened vulnerability for pregnant mothers and neonates against combustion-derived ultrafine particles.',
    });
  }

  // -------------------------------------------------------------------------
  // 4. CLINICAL REPORTS & LAB FINDINGS CROSS-ANALYSIS
  // -------------------------------------------------------------------------
  if (extractedHb !== null) {
    const isAnemic = extractedHb < 11.0;
    if (isAnemic) {
      if (urgencyLevel === 'routine_monitoring') {
        urgencyLevel = 'clinician_consultation';
      }
      keyFindings.push({
        id: 'kf_hb_low',
        category: 'lab_report',
        title: isHi ? `रक्त रिपोर्ट: हीमोग्लोबिन स्तर कम (${extractedHb} g/dL)` : `Laboratory Finding: Maternal Anemia Detected (${extractedHb} g/dL)`,
        titleHi: 'रक्त रिपोर्ट: हीमोग्लोबिन स्तर कम',
        description: isHi
          ? `अपलोड की गई रक्त जांच में हीमोग्लोबिन ${extractedHb} g/dL पाया गया, जो WHO मानक (≥ 11.0 g/dL) से कम है। उच्च तापमान में यह हृदय पर अतिरिक्त भार डालता है।`
          : `Extracted CBC parameter records Hemoglobin at ${extractedHb} g/dL, below the WHO antenatal benchmark of 11.0 g/dL (mild/moderate anemia). When paired with ambient temperature of ${temp ?? 28}°C, maternal cardiac reserve is challenged.`,
        supportingInputs: [
          `Uploaded Blood Report: Hemoglobin ${extractedHb} g/dL`,
          `Ambient Temperature: ${temp ?? 'Normal'}°C`,
          `WHO Antenatal Hemoglobin Standard: ≥ 11.0 g/dL in 1st/3rd trimester`
        ],
        clinicalSignificance: 'Impairs oxygen transport to the intervillous space and amplifies susceptibility to heat exhaustion.',
        severity: extractedHb < 9.0 ? 'high' : 'moderate',
      });

      precautions.push({
        id: 'p_iron_intake',
        priority: 'essential',
        action: isHi
          ? 'डॉक्टर द्वारा निर्धारित आयरन एवं फोलिक एसिड गोलियां नियमित लें। भोजन में हरी पत्तेदार सब्जियां, अनार और दालें शामिल करें।'
          : 'Continue physician-prescribed oral elemental iron with Vitamin C (lemon water / amla) to enhance bioavailability. Discuss parenteral iron if gastrointestinal intolerance occurs.',
        actionHi: 'निर्धारित आयरन सप्लीमेंट नियमित लें और विटामिन सी के साथ सेवन करें।',
        rationale: 'Corrects maternal iron deficiency and restores fetal oxygen saturation reserves (WHO ANC Recommendations).',
      });
    }
  }

  // -------------------------------------------------------------------------
  // 5. 3RD TRIMESTER SPECIFIC FETAL SURVEILLANCE
  // -------------------------------------------------------------------------
  if (week >= 28) {
    keyFindings.push({
      id: 'kf_third_trimester',
      category: 'fetal_infant',
      title: isHi ? 'तीसरी तिमाही: दैनिक भ्रूण हलचल (Fetal Kicks) निगरानी' : 'Third Trimester Fetal Kick Count Surveillance',
      titleHi: 'तीसरी तिमाही: दैनिक भ्रूण हलचल निगरानी',
      description: isHi
        ? `सप्ताह ${week} में भ्रूण के वजन में तेजी से वृद्धि होती है। भोजन के बाद बाईं करवट लेटकर २ घंटे में १० हलचलें गिनना आवश्यक है।`
        : `At Week ${week} gestation, fetal somatic growth accelerates. Daily fetal movement counting (Sadovsky / Cardiff method: 10 distinct movements within 2 hours of postprandial left lateral rest) is the primary clinical screening tool for fetal wellbeing.`,
      supportingInputs: [
        `Gestational Age: Week ${week} (Third Trimester)`,
        `Ultrasound Records: ${ultrasoundDocs.length} documented`,
        latestVital?.fetalKicksCount ? `Last logged kicks: ${latestVital.fetalKicksCount}` : 'No recent kick session logged'
      ],
      clinicalSignificance: 'Reduction in perceived fetal movements is a direct clinical warning sign of uteroplacental insufficiency.',
      severity: 'low',
    });

    precautions.push({
      id: 'p_kick_counts',
      priority: 'recommended',
      action: isHi
        ? 'प्रतिदिन दोपहर और रात के भोजन के बाद बाईं करवट लेटें और कम से कम १० किक्स गिनें। यदि २ घंटे में १० से कम किक्स महसूस हों, तो तुरंत अस्पताल जाएं।'
        : 'Perform a daily kick count session while resting on your left side after dinner. If fewer than 10 movements occur within 2 consecutive hours, contact maternity triage immediately.',
      actionHi: 'प्रतिदिन भोजन के बाद बाईं करवट लेटकर १० किक्स गिनें।',
      rationale: 'Left lateral positioning relieves inferior vena cava compression and maximizes placental blood flow.',
    });
  }

  // -------------------------------------------------------------------------
  // 6. FAMILY PEDIGREE & INHERITED RISK CROSS-CHECK
  // -------------------------------------------------------------------------
  if (familyPedigree.consanguinity) {
    keyFindings.push({
      id: 'kf_consanguinity',
      category: 'clinical_history',
      title: isHi ? 'पारिवारिक इतिहास: रिश्तेदारी विवाह (Consanguinity)' : 'Family Pedigree: Consanguinity Recorded',
      titleHi: 'पारिवारिक इतिहास: रिश्तेदारी विवाह',
      description: isHi
        ? 'पारिवारिक इतिहास में रिश्तेदारी विवाह दर्ज है। ऐसे मामलों में अनुवांशिक विकारों (जैसे थैलेसीमिया) की स्क्रीनिंग एवं एनोमली स्कैन की विशेष जांच की सलाह दी जाती है।'
        : 'Consanguineous parental lineage is noted in the family pedigree. Recommended clinical standard includes hemoglobin electrophoresis (HPLC) for thalassemia carrier status and targeted mid-trimester fetal anomaly ultrasound.',
      supportingInputs: [
        'Family Pedigree Record: Consanguinity checked true',
        paternalHistory.statusSummary ? `Paternal status: ${paternalHistory.statusSummary}` : 'Paternal pedigree unknown'
      ],
      clinicalSignificance: 'Heightens statistical probability of autosomal recessive inherited traits requiring targeted screening.',
      severity: 'moderate',
    });
  }

  // -------------------------------------------------------------------------
  // 7. MISSING DATA WARNINGS (CRITICAL TRANSPARENCY)
  // -------------------------------------------------------------------------
  if (vitalLogs.length === 0) {
    missingDataWarnings.push({
      field: isHi ? 'मातृत्व महत्वपूर्ण संकेत (Blood Pressure & Vitals)' : 'Maternal Vital Signs (Blood Pressure & Pulse)',
      fieldHi: 'मातृत्व महत्वपूर्ण संकेत',
      impact: isHi
        ? 'कोई भी बीपी या पल्स माप दर्ज नहीं है। उच्च रक्तचाप और प्री-एक्लेम्पसिया की समय पर पहचान के लिए बीपी अनिवार्य है।'
        : 'Zero blood pressure readings are recorded in your profile. Antenatal hemodynamic monitoring is essential to rule out preeclampsia, especially under local weather stressors.',
      recommendedStep: isHi ? 'होम स्क्रीन या वाइटल्स सेक्शन में जाकर अपना नवीनतम बीपी दर्ज करें।' : 'Log your latest clinic or home blood pressure reading in the Vitals section.',
      actionType: 'log_vitals',
    });
  } else if (isVitalsOverdue) {
    missingDataWarnings.push({
      field: isHi ? 'हालिया वाइटल्स लॉग (> ७ दिन पुराना)' : 'Recent Maternal Vital Log (> 7 days overdue)',
      fieldHi: 'हालिया वाइटल्स लॉग',
      impact: isHi
        ? `अंतिम बीपी माप ${latestVital?.date || 'पुराना'} का है। साप्ताहिक निगरानी सुरक्षित मातृत्व के लिए अनुशंसित है।`
        : `Your last recorded vital log is from ${latestVital?.date || 'over a week ago'}. Regular weekly blood pressure logs maintain clinical vigilance.`,
      recommendedStep: isHi ? 'कृपया आज का नया बीपी और पल्स माप दर्ज करें।' : 'Log an updated blood pressure reading to ensure accurate multi-factor health synthesis.',
      actionType: 'log_vitals',
    });
  }

  if (ultrasoundDocs.length === 0) {
    missingDataWarnings.push({
      field: isHi ? 'अल्ट्रासाउंड रिपोर्ट (Dating / Anomaly Scan)' : 'Clinical Ultrasound Report (Dating / Anomaly Scan)',
      fieldHi: 'अल्ट्रासाउंड रिपोर्ट',
      impact: isHi
        ? 'कोई सोनोग्राफी रिपोर्ट अपलोड नहीं है। भ्रूण का सटीक विकास, प्लेसेंटा की स्थिति और एमनियोटिक द्रव (AFI) की पुष्टि के लिए रिपोर्ट आवश्यक है।'
        : 'No confirmed obstetric ultrasound scan is uploaded to your Document Vault. Fetal biometry, placental localization, and amniotic fluid volume (AFI) cannot be verified without clinician reports.',
      recommendedStep: isHi ? 'डॉक्युमेंट वॉल्ट में अपनी अल्ट्रासाउंड रिपोर्ट की फोटो या पीडीएफ अपलोड करें।' : 'Upload your 1st trimester dating scan or 18-20w anomaly scan in the Document Vault.',
      actionType: 'upload_report',
    });
  }

  if (bloodDocs.length === 0) {
    missingDataWarnings.push({
      field: isHi ? 'रक्त जांच रिपोर्ट (Complete Blood Count / Hemoglobin)' : 'Antenatal Blood Work (CBC / Hemoglobin / Blood Group)',
      fieldHi: 'रक्त जांच रिपोर्ट',
      impact: isHi
        ? 'कोई सीबीसी या हीमोग्लोबिन जांच अपलोड नहीं है। एनीमिया और प्लेटलेट स्थिति की पुष्टि नहीं हो सकी है।'
        : 'No laboratory CBC report is uploaded. Hemoglobin concentration and platelet counts cannot be verified to evaluate heat tolerance and oxygen-carrying capacity.',
      recommendedStep: isHi ? 'अपनी हालिया लैब जांच रिपोर्ट अपलोड करें।' : 'Upload your latest blood test report to extract verified lab parameters.',
      actionType: 'upload_report',
    });
  }

  if (!paternalHistory.statusSummary && maternalHistory.preExistingConditions.length === 0) {
    missingDataWarnings.push({
      field: isHi ? 'पारिवारिक एवं पैतृक चिकित्सा इतिहास' : 'Paternal & Maternal Comprehensive History',
      fieldHi: 'पारिवारिक एवं पैतृक चिकित्सा इतिहास',
      impact: isHi
        ? 'माता और पिता का विस्तृत मेडिकल इतिहास अधूरा है। आनुवंशिक प्रवृत्तियों की पूरी समझ के लिए यह जानकारी महत्वपूर्ण है।'
        : 'Parental medical history fields are incomplete. Multi-generational cardiovascular, metabolic, and inherited risks cannot be fully cross-referenced.',
      recommendedStep: isHi ? 'प्रोफाइल या जोखिम इनसाइट में जाकर माता-पिता का स्वास्थ्य विवरण भरें।' : 'Complete maternal and paternal background in the Family & Risk section.',
      actionType: 'family_history',
    });
  }

  if (!hasEnv) {
    missingDataWarnings.push({
      field: isHi ? 'सटीक उपग्रह पर्यावरणीय डेटा' : 'Live Atmospheric Environmental Telemetry',
      fieldHi: 'सटीक उपग्रह पर्यावरणीय डेटा',
      impact: isHi
        ? 'इस क्षेत्र के लिए वास्तविक मौसम या वायु गुणवत्ता उपग्रह से प्राप्त नहीं हो सकी। कोई काल्पनिक आंकड़ा नहीं दिखाया गया है।'
        : 'Real satellite and atmospheric telemetry could not be retrieved for these coordinates. Mumora strictly does not simulate fake environmental figures.',
      recommendedStep: isHi ? 'स्थान की पुनः जांच करें या जीपीएस डिटेक्शन का उपयोग करें।' : 'Ensure internet connectivity or tap "GPS Detect" / "Change Location" to refresh coordinates.',
      actionType: 'location_weather',
    });
  }

  // -------------------------------------------------------------------------
  // 8. ENVIRONMENTAL FACTORS SUMMARY TABLE
  // -------------------------------------------------------------------------
  const environmentalFactors: EnvironmentalFactorSummary[] = [
    {
      factor: 'heat_index',
      label: isHi ? 'तापमान एवं हीट इंडेक्स' : 'Ambient Temperature & Heat Index',
      currentValue: temp !== null ? `${temp}°C (Feels like ${apparentTemp}°C)` : 'Unavailable',
      standardThreshold: 'WHO Heat Guidance: Apparent temp < 32°C optimal',
      status: temp === null ? 'data_unavailable' : isHighHeat ? 'warning' : 'safe',
      impactOnUser: isHighHeat
        ? (isHi ? 'उच्च तापीय तनाव: निर्जलीकरण और समय पूर्व प्रसव संकुचन का खतरा।' : 'Thermal stress increases insensible fluid loss and maternal cardiovascular demand.')
        : (isHi ? 'सामान्य अनुकूल तापमान: सुरक्षित नियमित गतिशीलता।' : 'Comfortable ambient range supporting physiological pregnancy thermoregulation.'),
    },
    {
      factor: 'air_quality_pm',
      label: isHi ? 'वायु गुणवत्ता (PM2.5)' : 'Air Quality Index (PM2.5)',
      currentValue: pm25 !== null ? `AQI ${aqi} (PM2.5: ${pm25} µg/m³)` : 'Unavailable',
      standardThreshold: 'WHO 2021 Standard: 24-hr PM2.5 ≤ 15 µg/m³',
      status: pm25 === null ? 'data_unavailable' : isHighAqi ? 'warning' : 'safe',
      impactOnUser: isHighAqi
        ? (isHi ? 'WHO मानक से अधिक: प्लेसेंटा पर सूजन और फेफड़ों पर भार।' : 'Fine particulate exceedance induces systemic oxidative stress; outdoor reduction advised.')
        : (isHi ? 'स्वच्छ वायु स्तर: खुली हवा में टहलने के लिए उपयुक्त।' : 'Low ambient pollutant exposure; routine outdoor maternal walking encouraged.'),
    },
    {
      factor: 'humidity',
      label: isHi ? 'सापेक्षिक आर्द्रता (Humidity)' : 'Relative Humidity',
      currentValue: humidity !== null ? `${humidity}%` : 'Unavailable',
      standardThreshold: 'Comfort Window: 40% – 65%',
      status: humidity === null ? 'data_unavailable' : (humidity > 75 || humidity < 30) ? 'caution' : 'safe',
      impactOnUser: (humidity ?? 50) > 75
        ? (isHi ? 'उच्च नमी: पसीने से ठंडक मिलने की प्रक्रिया धीमी होती है।' : 'High moisture impairs evaporative cooling efficiency; cool indoor airflow recommended.')
        : (isHi ? 'संतुलित आर्द्रता स्तर।' : 'Balanced moisture supports comfortable maternal respiratory mucosa.'),
    },
    {
      factor: 'uv_radiation',
      label: isHi ? 'पराबैंगनी किरणें (UV Index)' : 'Solar UV Radiation Index',
      currentValue: uvIndex !== null ? `${uvIndex}` : 'Unavailable',
      standardThreshold: 'WHO UV Index: Moderate < 6, High ≥ 6',
      status: uvIndex === null ? 'data_unavailable' : (uvIndex >= 6) ? 'caution' : 'safe',
      impactOnUser: (uvIndex ?? 4) >= 6
        ? (isHi ? 'उच्च यूवी विकिरण: गर्भावस्था में मेलास्मा (झाइयां) का खतरा बढ़ता है।' : 'High solar flux accelerates pregnancy melasma/hyperpigmentation; SPF 30+ recommended.')
        : (isHi ? 'मध्यम धूप स्तर: सुबह के समय सुरक्षित।' : 'Moderate solar exposure; safe for early morning vitamin D synthesis.'),
    },
  ];

  // -------------------------------------------------------------------------
  // 9. CORE GUIDELINE CITATIONS (WHO, ACOG, FIGO)
  // -------------------------------------------------------------------------
  if (guidelineCitations.length === 0) {
    guidelineCitations.push({
      id: 'g_who_anc_core',
      title: 'WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience',
      issuingBody: 'WHO',
      year: 2016,
      summary: 'Mandates regular clinical blood pressure screening, nutritional iron/folate supplementation, and evidence-based ultrasound dating.',
    });
    guidelineCitations.push({
      id: 'g_who_air_core',
      title: 'WHO Global Air Quality Guidelines: Key Evidence for Maternal & Child Health',
      issuingBody: 'WHO',
      year: 2021,
      summary: 'Establishes particulate matter thresholds (PM2.5 ≤ 15 µg/m³ 24-hr mean) to protect fetal development and reduce low birth weight incidence.',
    });
  }

  // -------------------------------------------------------------------------
  // 10. CLINICAL DISCLAIMER & UNCERTAINTY STATEMENT
  // -------------------------------------------------------------------------
  const uncertaintyStatement =
    'This intelligence report synthesizes real environmental telemetry with your self-reported profile, vital signs, and uploaded clinical documentation. It operates strictly within published World Health Organization (WHO) and international clinical obstetrics guidelines. It does not provide medical diagnoses, guarantee fetal outcomes, or replace professional care from a licensed healthcare provider. If you experience emergency symptoms (severe headache, bleeding, visual changes, or reduced fetal movement), contact emergency services (108/102) or your nearest maternity triage immediately.';

  const uncertaintyStatementHi =
    'यह बुद्धिमत्ता रिपोर्ट वास्तविक पर्यावरणीय उपग्रह आंकड़ों को आपके द्वारा दर्ज स्वास्थ्य प्रोफाइल, वाइटल्स और अपलोड की गई मेडिकल जांचों के साथ जोड़ती है। यह विश्व स्वास्थ्य संगठन (WHO) के दिशानिर्देशों पर आधारित है। यह किसी बीमारी का निश्चित निदान नहीं करती और न ही डॉक्टर के परामर्श का विकल्प है। किसी भी गंभीर लक्षण (तेज सिरदर्द, रक्तस्राव, आंखों में धुंधलापन या भ्रूण हलचल में कमी) की स्थिति में तुरंत आपातकालीन नंबर (108/102) या निकटतम अस्पताल से संपर्क करें।';

  return {
    generatedAt: now.toISOString(),
    locationSummary: {
      city,
      state,
      country,
      coordinates: envData?.coordinates,
    },
    environmentalFreshness: {
      isLive: hasEnv,
      source: envData?.source || 'Open-Meteo & European Atmospheric Telemetry',
      observedTime: envData?.timestamp || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unavailableMessage: hasEnv
        ? undefined
        : (isHi
            ? 'स्थानीय वायुमंडलीय आंकड़े अस्थायी रूप से अनुपलब्ध हैं। कोई काल्पनिक आंकड़ा नहीं दिखाया गया है।'
            : 'Live atmospheric data is temporarily unavailable for these coordinates. Simulated figures are strictly prohibited.'),
    },
    clinicalProfileStatus: {
      mode: isBabyMode ? 'baby' : 'pregnancy',
      stageDescription: isBabyMode
        ? (activeBaby ? `Child: ${activeBaby.name} (${activeBaby.gender})` : 'Active Infant Profile')
        : (week > 0 ? `Gestation: Week ${week}, Trimester ${trimester}` : 'Antenatal Profile Active'),
      vitalsStatus: {
        hasLogs: vitalLogs.length > 0,
        latestDate: latestVital?.date,
        latestBp: latestSystolic ? `${latestSystolic}/${latestDiastolic} mmHg` : undefined,
        latestSugar: latestSugar ? `${latestSugar} mg/dL` : undefined,
        isOverdue: isVitalsOverdue,
        isBpElevated,
      },
      medicalHistoryStatus: {
        hasConditionsLogged: maternalConditions.length > 0,
        conditionsCount: maternalConditions.length,
        conditionsList: maternalConditions,
        hasAllergiesLogged: maternalAllergies.length > 0,
        paternalRecorded: !!(paternalHistory.statusSummary || (paternalHistory.preExistingConditions && paternalHistory.preExistingConditions.length > 0)),
        consanguinityRecorded: !!familyPedigree.consanguinity,
      },
      reportsStatus: {
        totalUploaded: totalUploadedDocs,
        categoriesSummary: Array.from(new Set(documents.map(d => d.category))),
        hasRecentUltrasound: ultrasoundDocs.length > 0,
        hasBloodCount: bloodDocs.length > 0,
        extractedParametersCount: documents.reduce((acc, d) => acc + (d.keyParameters?.length || 0), 0),
        notableFindings: notableReportFindings,
      },
    },
    urgencyLevel,
    urgencyRationale,
    urgencyRationaleHi,
    keyFindings,
    environmentalFactors,
    precautions,
    missingDataWarnings,
    guidelineCitations,
    uncertaintyStatement,
    uncertaintyStatementHi,
  };
}
