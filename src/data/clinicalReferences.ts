import {
  ClinicalReferenceCitation,
  BabyRiskAssessmentResult,
  BabyRiskCategory,
  CarePlanActionItem,
  HealthTimelineEvent,
} from '../types';

export const VERIFIED_CLINICAL_REFERENCES: ClinicalReferenceCitation[] = [
  {
    id: 'ref-who-anc-2016',
    title: 'WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience',
    issuingOrganization: 'World Health Organization (WHO)',
    publicationYear: '2016 (Updated 2020)',
    relevantSection: 'Recommendations on Maternal Assessment, Nutrition, and Preventive Measures',
    url: 'https://www.who.int/publications/i/item/9789241549912',
    isOfficialGuideline: true,
    clinicalSummary: 'Establishes the minimum 8-contact antenatal care model, universal screening for anemia (Hb < 11.0 g/dL in T1/T3, < 10.5 g/dL in T2), daily iron and folic acid, and early ultrasound before 24 weeks.',
  },
  {
    id: 'ref-who-gdm-2018',
    title: 'Diagnostic Criteria and Classification of Hyperglycaemia First Detected in Pregnancy',
    issuingOrganization: 'World Health Organization (WHO)',
    publicationYear: '2013 (Reaffirmed 2018)',
    relevantSection: 'Section 3: 75g Oral Glucose Tolerance Test (OGTT) Cutoffs',
    url: 'https://www.who.int/publications/i/item/9789241548687',
    isOfficialGuideline: true,
    clinicalSummary: 'Defines GDM diagnostic cutoffs via 75g OGTT at 24-28 weeks: Fasting >= 92 mg/dL (5.1 mmol/L), 1-hr >= 180 mg/dL (10.0 mmol/L), or 2-hr >= 153 mg/dL (8.5 mmol/L).',
  },
  {
    id: 'ref-who-growth-2006',
    title: 'WHO Child Growth Standards: Length/height-for-age, weight-for-age, weight-for-length and body mass index-for-age',
    issuingOrganization: 'World Health Organization (WHO)',
    publicationYear: '2006',
    relevantSection: 'Methods and Development of International Pediatric Centiles',
    url: 'https://www.who.int/tools/child-growth-standards',
    isOfficialGuideline: true,
    clinicalSummary: 'International benchmark for infant and child growth based on exclusively breastfed infants raised in healthy environments; evaluates growth between -2 SD and +2 SD.',
  },
  {
    id: 'ref-mohfw-pmsma',
    title: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) Clinical Guidelines',
    issuingOrganization: 'MoHFW India',
    publicationYear: '2016 (Continuous)',
    relevantSection: 'Standard Operating Procedures for Identification & Tracking of High-Risk Pregnancies',
    url: 'https://pmsma.mohfw.gov.in',
    isOfficialGuideline: true,
    clinicalSummary: 'Mandates guaranteed, quality antenatal checkups on the 9th of every month, universal color-coded high-risk stickers (Red for high-risk), tracking of Rh-negative mothers, and severe anemia management.',
  },
  {
    id: 'ref-fogsi-thalassemia',
    title: 'FOGSI GCPR: Universal Carrier Screening for Hemoglobinopathies in Pregnancy',
    issuingOrganization: 'FOGSI',
    publicationYear: '2021',
    relevantSection: 'Recommendations for CBC, Mentzer Index, and HPLC / Hemoglobin Electrophoresis',
    url: 'https://www.fogsi.org',
    isOfficialGuideline: true,
    clinicalSummary: 'Recommends CBC with MCV (< 80 fL) & MCH (< 27 pg) screening. If maternal HPLC shows HbA2 > 3.5% (Beta Thalassemia trait), partner testing is mandatory to evaluate autosomal recessive 25% homozygous risk.',
  },
  {
    id: 'ref-icmr-gdm',
    title: 'National Guidelines for Diagnosis and Management of Gestational Diabetes Mellitus',
    issuingOrganization: 'ICMR',
    publicationYear: '2018',
    relevantSection: 'Single-step 75g Non-fasting / Fasting DIPSI & WHO protocol',
    url: 'https://www.icmr.gov.in',
    isOfficialGuideline: true,
    clinicalSummary: 'Universal screening for all pregnant women at first visit and at 24-28 weeks to mitigate macrosomia, polyhydramnios, and neonatal hypoglycemia.',
  },
  {
    id: 'ref-uip-india',
    title: 'Universal Immunization Programme (UIP) National Schedule',
    issuingOrganization: 'MoHFW India',
    publicationYear: '2023',
    relevantSection: 'Birth Dose Protocol for BCG, OPV-0, and Hepatitis B',
    url: 'https://nhm.gov.in',
    isOfficialGuideline: true,
    clinicalSummary: 'Immediate birth dose administration within 24-48 hours of birth for BCG (0.05 ml intradermal left deltoid), bOPV 0 dose (2 drops oral), and Hepatitis B birth dose (10 mcg IM anterolateral thigh).',
  },
];

// Helper to evaluate comprehensive risk factors based on mother, father, family history, and reports
export function evaluateBabyHealthRisks(params: {
  maternal: {
    bloodGroup: string;
    rhFactor: '+' | '-' | 'unknown';
    preExistingConditions: string[];
    geneticDisorders: string[];
    allergies: string[];
    currentMedications: string[];
    previousComplications?: string[];
    infectiousHistory?: string[];
  };
  paternal: {
    bloodGroup: string;
    rhFactor: '+' | '-' | 'unknown';
    preExistingConditions: string[];
    geneticDisorders: string[];
  };
  familyHistory: {
    consanguinity: boolean;
    records: Array<{
      relationshipSide: 'maternal' | 'paternal';
      condition: string;
      isCarrier: boolean;
    }>;
    recurrentLoss: boolean;
    unexplainedEarlyDeaths: boolean;
  };
  pregnancyWeek: number;
  recentLabs?: Array<{ label: string; value: string; isNormal: boolean }>;
}): BabyRiskAssessmentResult {
  const riskFactors: BabyRiskAssessmentResult['riskFactors'] = [];
  const protectiveFactors: string[] = [];
  const recommendedConsultations: BabyRiskAssessmentResult['recommendedConsultations'] = [];
  const recommendedScreenings: BabyRiskAssessmentResult['recommendedScreenings'] = [];

  let highestSeverity: 'no_elevated_risk' | 'additional_info_needed' | 'risk_factor_identified' | 'prompt_assessment' =
    'no_elevated_risk';

  // 1. Rh Incompatibility Risk Check
  const motherIsRhNeg = params.maternal.rhFactor === '-';
  const fatherIsRhPos = params.paternal.rhFactor === '+';
  const fatherRhUnknown = params.paternal.rhFactor === 'unknown';

  if (motherIsRhNeg) {
    if (fatherIsRhPos || fatherRhUnknown) {
      riskFactors.push({
        id: 'rf-rh-incompatibility',
        domain: 'maternal',
        title: 'Rh Isoimmunization Vigilance Required (Mother Rh Negative, Partner Rh Positive/Unknown)',
        severity: 'clinical_discussion',
        clinicalRationale:
          'When an Rh-negative mother carries an Rh-positive fetus, maternal antibodies can theoretically develop if fetal red cells cross the placenta, potentially leading to hemolytic disease of the fetus/newborn (HDFN).',
        clinicalRationaleHi:
          'जब मां Rh नेगेटिव और पिता Rh पॉजिटिव होते हैं, तो गर्भस्थ शिशु में Rh एंटीबॉडीज बनने का जोखिम रहता है। इसे एंटी-डी (Anti-D) इंजेक्शन से पूरी तरह रोका जा सकता है।',
        whyItMatters:
          'Sensitization can cause fetal anemia and jaundice in current or subsequent pregnancies. Modern prophylaxis with Anti-D immunoglobulin makes this completely preventable.',
        evidenceSource: 'WHO Antenatal Care Guidelines & MoHFW PMSMA High-Risk Pregnancy Protocols',
        evidenceSourceUrl: 'https://www.who.int/publications/i/item/9789241549912',
        protectiveFactors: ['Preventable with timely Anti-D immunoglobulin administration.'],
        recommendedAction:
          'Perform Indirect Coombs Test (ICT) antibody screening now and at 28 weeks. Discuss Anti-D (RhIg 300 mcg) administration at 28 weeks and within 72 hours of delivery.',
        questionsForDoctor: [
          'What was the result of my baseline Indirect Coombs Test (ICT)?',
          'Is Anti-D immunoglobulin injection scheduled for my 28th week?',
          'Will the baby’s cord blood blood-group and direct Coombs test be tested at delivery?',
        ],
      });
      highestSeverity = 'risk_factor_identified';
      recommendedScreenings.push({
        testName: 'Indirect Coombs Test (ICT) Antibody Titer',
        windowWeeks: 'Baseline & 28 Weeks',
        guidelineStandard: 'WHO & FOGSI Rh Prophylaxis Standard',
        clinicalReason: 'Detects presence of maternal anti-D antibodies before prophylactic immunoprophylaxis.',
      });
    } else {
      protectiveFactors.push('Both mother and father are Rh-negative; no risk of Rh isoimmunization.');
    }
  } else if (params.maternal.rhFactor === '+') {
    protectiveFactors.push('Mother is Rh-positive (B+); maternal Rh-D alloimmunization risk is absent.');
  }

  // 2. Hemoglobinopathy / Thalassemia Carrier Check
  const motherThalCarrier = params.maternal.geneticDisorders.some(d =>
    d.toLowerCase().includes('thalassemia')
  );
  const fatherThalCarrier = params.paternal.geneticDisorders.some(d =>
    d.toLowerCase().includes('thalassemia')
  );
  const familyThalassemia = params.familyHistory.records.some(r =>
    r.condition.toLowerCase().includes('thalassemia')
  );

  if (motherThalCarrier && fatherThalCarrier) {
    riskFactors.push({
      id: 'rf-thal-both-carriers',
      domain: 'paternal_inherited',
      title: 'Autosomal Recessive Risk: Both Parents are Beta-Thalassemia Carriers',
      severity: 'prompt_review',
      clinicalRationale:
        'When both biological parents carry Beta-Thalassemia trait (heterozygous), each pregnancy has an established 25% Mendelian probability of inheriting Beta-Thalassemia Major (homozygous), 50% carrier trait, and 25% unaffected.',
      clinicalRationaleHi:
        'यदि दोनों माता-पिता बीटा-थैलेसीमिया वाहक हैं, तो बच्चे में थैलेसीमिया मेजर का 25% आनुवंशिक जोखिम रहता है। इसके लिए प्रसवपूर्व जेनेटिक डायग्नोसिस (CVS या एमनियोसेंटेसिस) की सलाह दी जाती है।',
      whyItMatters:
        'Beta-Thalassemia Major requires lifelong blood transfusions and chelation therapy. Early genetic counseling provides informed reproductive options.',
      evidenceSource: 'FOGSI GCPR & WHO Guidelines on Control of Haemoglobin Disorders',
      evidenceSourceUrl: 'https://www.fogsi.org',
      recommendedAction:
        'Consult a certified Clinical Geneticist and Obstetrician immediately. Discuss prenatal diagnostic testing options (Chorionic Villus Sampling at 11-13 weeks or Amniocentesis at 15-18 weeks).',
      questionsForDoctor: [
        'What are the mutation results on our parental Hb HPLC and DNA sequencing?',
        'Is Amniocentesis or Chorionic Villus Sampling indicated for fetal DNA confirmation?',
        'Can we consult a specialized Clinical Geneticist this week?',
      ],
    });
    highestSeverity = 'prompt_assessment';
    recommendedConsultations.push({
      specialty: 'Clinical Geneticist',
      timing: 'Immediate / Next 7 days',
      primaryFocus: 'Prenatal diagnostic testing (CVS/Amniocentesis) for homozygous hemoglobinopathy.',
    });
  } else if (motherThalCarrier || fatherThalCarrier || familyThalassemia) {
    riskFactors.push({
      id: 'rf-thal-single-carrier',
      domain: 'paternal_inherited',
      title: 'Hemoglobinopathy Carrier Verification Indicated (Family / Parent Thalassemia Flag)',
      severity: 'clinical_discussion',
      clinicalRationale:
        'One parent or family relative has a recorded Thalassemia trait or family history. In accordance with clinical guidelines, both parents must have documented HPLC/Hb electrophoresis to definitively clarify risk for the baby.',
      clinicalRationaleHi:
        'परिवार या माता/पिता में थैलेसीमिया का इतिहास होने पर दोनों पार्टनर्स का HPLC टेस्ट कराना जरूरी है ताकि शिशु के स्वास्थ्य की पूरी सुरक्षा सुनिश्चित हो सके।',
      whyItMatters:
        'If only one parent is a carrier and the other has normal HbA2 (< 3.5%), the baby cannot develop Thalassemia Major, though they may inherit the harmless carrier trait.',
      evidenceSource: 'MoHFW National Hemoglobinopathy Guidelines & FOGSI',
      recommendedAction:
        'Confirm that both partners have completed High-Performance Liquid Chromatography (HPLC) or Hemoglobin Electrophoresis with CBC red cell indices (MCV & MCH).',
      questionsForDoctor: [
        'Has partner HPLC testing been ordered and reviewed?',
        'Are my MCV and MCH within normal range on the recent CBC report?',
      ],
    });
    if ((highestSeverity as string) === 'no_elevated_risk' || (highestSeverity as string) === 'additional_info_needed') {
      highestSeverity = 'risk_factor_identified';
    }
  } else {
    protectiveFactors.push('No parental or family history of major hemoglobinopathy reported.');
  }

  // 3. Maternal Glycemic / Diabetes Risk
  const hasPreGestDiabetes = params.maternal.preExistingConditions.some(c =>
    c.toLowerCase().includes('diabetes')
  );
  const familyDiabetes = params.familyHistory.records.some(r =>
    r.condition.toLowerCase().includes('diabetes')
  );

  if (hasPreGestDiabetes) {
    riskFactors.push({
      id: 'rf-maternal-diabetes',
      domain: 'maternal',
      title: 'Pre-existing Maternal Diabetes: Tight Glycemic Control & Fetal Cardiac Surveillance',
      severity: 'prompt_review',
      clinicalRationale:
        'Pre-gestational diabetes requires strict target HbA1c (< 6.0-6.5%) to prevent congenital cardiac or neural anomalies, macrosomia, and preterm delivery.',
      clinicalRationaleHi:
        'मां को डायबिटीज होने पर ब्लड शुगर का सख्त नियंत्रण आवश्यक है। इसके साथ ही 20-22 हफ्ते पर फीटल इकोकार्डियोग्राफी (Fetal Echo) की जांच अनुशंसित है।',
      whyItMatters:
        'Maintaining fasting blood sugar < 90 mg/dL and post-meal < 120-140 mg/dL significantly reduces complications and supports normal fetal organogenesis.',
      evidenceSource: 'WHO 2018 Hyperglycaemia in Pregnancy Guidelines & ADA Standards of Care',
      evidenceSourceUrl: 'https://www.who.int/publications/i/item/9789241548687',
      recommendedAction:
        'Continuous endocrinology supervision, self-monitoring of blood glucose (SMBG 4x daily), and specialized Fetal Echocardiogram at 20-22 weeks.',
      questionsForDoctor: [
        'Is my current HbA1c optimal for this trimester?',
        'Is a targeted Fetal Echocardiogram scheduled between weeks 20-22?',
        'What are my customized pre-meal and post-prandial blood sugar targets?',
      ],
    });
    highestSeverity = 'prompt_assessment';
    recommendedConsultations.push({
      specialty: 'Endocrinologist',
      timing: 'Monthly review',
      primaryFocus: 'Glycemic titration, insulin/dietary optimization, and HbA1c tracking.',
    });
  } else if (familyDiabetes) {
    riskFactors.push({
      id: 'rf-family-gdm-risk',
      domain: 'pregnancy_related',
      title: 'Elevated Gestational Diabetes Susceptibility (First-Degree Family History)',
      severity: 'monitoring',
      clinicalRationale:
        'First-degree relatives with Type 2 Diabetes increase the physiological risk of gestational insulin resistance during the second and third trimesters.',
      clinicalRationaleHi:
        'परिवार में डायबिटीज होने के कारण 24-28वें हफ्ते में 75 ग्राम ग्लूकोज टेस्ट (OGTT) अनिवार्य रूप से कराने की सलाह दी जाती है।',
      whyItMatters:
        'Early detection of GDM through standardized 75g OGTT at 24-28 weeks allows timely dietary management before fetal overgrowth (macrosomia) occurs.',
      evidenceSource: 'ICMR National Guidelines for GDM & WHO ANC Standard 2016',
      protectiveFactors: ['Preventable through dietary balance, active walking, and timely screening.'],
      recommendedAction:
        'Schedule a standardized 75g Oral Glucose Tolerance Test (OGTT) at 24-28 weeks. Follow a low-glycemic, high-fiber dietary plan with 30 minutes of daily brisk walking.',
      questionsForDoctor: [
        'When exactly should I take the 75g OGTT glucose tolerance test?',
        'Do I need an early fasting blood sugar check before 24 weeks?',
      ],
    });
    if (highestSeverity === 'no_elevated_risk') {
      highestSeverity = 'additional_info_needed';
    }
    recommendedScreenings.push({
      testName: '75g Oral Glucose Tolerance Test (OGTT)',
      windowWeeks: '24 - 28 Weeks',
      guidelineStandard: 'WHO / IADPSG / ICMR Criteria',
      clinicalReason: 'Evaluates gestational insulin resistance and protects against macrosomia.',
    });
  }

  // 4. Maternal Chronic Hypertension / Preeclampsia History
  const hasHypertension = params.maternal.preExistingConditions.some(c =>
    c.toLowerCase().includes('hypertension') || c.toLowerCase().includes('blood pressure')
  );
  const hadPreeclampsia = params.maternal.previousComplications?.some(c =>
    c.toLowerCase().includes('preeclampsia')
  );

  if (hasHypertension || hadPreeclampsia) {
    riskFactors.push({
      id: 'rf-preeclampsia-surveillance',
      domain: 'maternal',
      title: 'Maternal Blood Pressure Surveillance & Preeclampsia Risk Protocol',
      severity: 'prompt_review',
      clinicalRationale:
        'Pre-existing hypertension or history of preeclampsia is a recognized risk factor for placental insufficiency, fetal growth restriction (FGR), and maternal hypertensive crises.',
      clinicalRationaleHi:
        'हाई ब्लड प्रेशर या पिछली गर्भावस्था में प्री-एक्लेम्पसिया होने पर नियमित बीपी मॉनिटरिंग और डॉक्टर की सलाह पर लो-डोज एस्पिरिन (Low-dose Aspirin) की आवश्यकता हो सकती है।',
      whyItMatters:
        'Prophylactic low-dose aspirin (75-150 mg starting at 12-16 weeks) under obstetric prescription significantly reduces recurrence and protects placental blood flow.',
      evidenceSource: 'WHO Recommendations for Prevention and Treatment of Preeclampsia and Eclampsia',
      evidenceSourceUrl: 'https://www.who.int/publications/i/item/9789241548335',
      recommendedAction:
        'Twice-weekly home BP monitoring (target < 135/85 mmHg). Discuss prophylactic low-dose aspirin with your OB-GYN. Monitor for warning signs (headache, vision changes, right upper abdominal pain).',
      questionsForDoctor: [
        'Is low-dose aspirin (150 mg at bedtime) indicated for preeclampsia prevention in my case?',
        'What specific home BP numbers should trigger an immediate hospital visit?',
        'Is uterine artery Doppler scheduled with my anomaly scan?',
      ],
    });
    highestSeverity = 'prompt_assessment';
  }

  // 5. Consanguinity / Recurrent Pregnancy Loss / Unexplained Deaths
  if (params.familyHistory.consanguinity) {
    riskFactors.push({
      id: 'rf-consanguinity',
      domain: 'paternal_inherited',
      title: 'Consanguineous Union: Enhanced Genetic & Anomaly Screening Warranted',
      severity: 'clinical_discussion',
      clinicalRationale:
        'Biological relationship between parents increases the statistical likelihood of both inheriting identical autosomal recessive pathogenic alleles from a shared common ancestor.',
      clinicalRationaleHi:
        'माता-पिता के बीच रक्त संबंध होने पर ऑटोसोमल रिसेसिव विकारों के जोखिम की जांच के लिए विस्तृत लेवल-2 अल्ट्रासाउंड और जेनेटिक काउंसलिंग की सलाह दी जाती है।',
      whyItMatters:
        'A comprehensive genetic pedigree review and high-resolution Level-II targeted anomaly scan (TIFFA) at 18-20 weeks provide non-invasive anatomical reassurance.',
      evidenceSource: 'WHO Community Genetics Guidelines & ACMG Consanguinity Practice Guidelines',
      recommendedAction:
        'Schedule a formal genetic counseling consultation and an advanced Level-II Targeted Imaging for Fetal Anomalies (TIFFA scan) with fetal echocardiogram.',
      questionsForDoctor: [
        'Would expanded carrier screening panel be beneficial for our family?',
        'Does the sonologist performing our anomaly scan have fetal medicine certification?',
      ],
    });
    if (highestSeverity !== 'prompt_assessment') {
      highestSeverity = 'risk_factor_identified';
    }
  }

  if (params.familyHistory.recurrentLoss || params.familyHistory.unexplainedEarlyDeaths) {
    riskFactors.push({
      id: 'rf-family-recurrent-loss',
      domain: 'paternal_inherited',
      title: 'Family History of Recurrent Loss or Unexplained Early Infant Health Concerns',
      severity: 'clinical_discussion',
      clinicalRationale:
        'Recurrent pregnancy losses (>= 2 or 3) or early infant loss in first-degree relatives may warrant investigating parental balanced chromosomal translocations or thrombophilias.',
      clinicalRationaleHi:
        'परिवार में बार-बार गर्भपात या शिशु के स्वास्थ्य संबंधी जटिलताओं का इतिहास होने पर पैरेंटल कैरियोटाइप (Karyotyping) और थ्रोम्बोफिलिया की जांच पर डॉक्टर से चर्चा करें।',
      whyItMatters:
        'Identifying balanced translocations or antiphospholipid syndrome allows targeted prophylactic support to sustain a healthy pregnancy.',
      evidenceSource: 'ACOG Practice Bulletin & RCOG Recurrent Pregnancy Loss Guidelines',
      recommendedAction:
        'Review maternal anticardiolipin / lupus anticoagulant history and discuss parental chromosomal karyotyping if recurrent losses occurred in immediate relatives.',
      questionsForDoctor: [
        'Do we need an evaluation for parental karyotyping or antiphospholipid syndrome?',
        'Are serial cervical length measurements recommended in the second trimester?',
      ],
    });
    if (highestSeverity === 'no_elevated_risk') {
      highestSeverity = 'additional_info_needed';
    }
  }

  // 6. Maternal Thyroid Disorder Check
  const hasThyroid = params.maternal.preExistingConditions.some(c =>
    c.toLowerCase().includes('thyroid') || c.toLowerCase().includes('hypothyroid')
  );
  if (hasThyroid) {
    riskFactors.push({
      id: 'rf-maternal-thyroid',
      domain: 'maternal',
      title: 'Maternal Thyroid Regulation: TSH Monitoring for Optimal Fetal Neurodevelopment',
      severity: 'monitoring',
      clinicalRationale:
        'The fetal thyroid gland is non-functional during the first trimester; the fetus relies entirely on maternal thyroxine crossing the placenta for brain development.',
      clinicalRationaleHi:
        'शिशु के मस्तिष्क और तंत्रिका तंत्र के विकास के लिए मां का TSH स्तर सामान्य (< 2.5 mIU/L) रहना अत्यंत आवश्यक है। हर 4-6 सप्ताह में TSH जांच कराएं।',
      whyItMatters:
        'Adequate maternal thyroid hormone prevents cognitive deficits and supports healthy gestational weight gain and full-term delivery.',
      evidenceSource: 'American Thyroid Association (ATA) & Endocrine Society Guidelines for Pregnancy',
      evidenceSourceUrl: 'https://www.endocrine.org',
      recommendedAction:
        'Test serum TSH every 4 to 6 weeks. Target TSH < 2.5 mIU/L in the first trimester and < 3.0 mIU/L in the second/third trimesters. Never skip prescribed Levothyroxine.',
      questionsForDoctor: [
        'Is my current TSH level within the trimester-specific target (< 2.5-3.0 mIU/L)?',
        'Should my Levothyroxine dosage be adjusted as pregnancy progresses?',
      ],
    });
  }

  // 7. General Universal Preventive Safeguards
  riskFactors.push({
    id: 'rf-universal-prevention',
    domain: 'preventive_care',
    title: 'Universal Preventive Antenatal Care & Immunization Protocol',
    severity: 'reassuring',
    clinicalRationale:
      'Universal preventive measures establish the foundation for healthy maternal-fetal outcomes according to WHO and National Health Mission protocols.',
    clinicalRationaleHi:
      'दैनिक आयरन-फोलिक एसिड, पर्याप्त कैल्शियम (2 घंटे के अंतर पर), टिटनेस/Tdap का टीका और जन्म के समय BCG टीका शिशु की जीवनभर सुरक्षा के आधार स्तंभ हैं।',
    whyItMatters:
      'Universal iron-folic acid prevents maternal anemia and low birth weight; maternal Tdap between 27-36 weeks transfers antibodies protecting the infant against pertussis (whooping cough).',
    evidenceSource: 'WHO Recommendations on Antenatal Care (2016/2020) & UIP National Guidelines',
    evidenceSourceUrl: 'https://www.who.int/publications/i/item/9789241549912',
    protectiveFactors: [
      'Daily 2.5-3L clean hydration',
      'Daily prenatal multivitamin with 400-500 mcg Folic Acid',
      'Scheduled Td / Tdap vaccinations in pregnancy',
      'Planned immediate birth dose immunization (BCG, OPV-0, Hep-B)',
    ],
    recommendedAction:
      'Adhere to the prescribed daily elemental iron (30-60 mg) and folic acid (400 mcg). Receive Td/Tdap vaccine at 28-32 weeks. Review the birth dose hospital plan for BCG vaccination.',
    questionsForDoctor: [
      'Is my Tdap vaccine scheduled for weeks 28-32 to protect baby against whooping cough?',
      'Will the hospital administer the BCG, Hepatitis B, and OPV-0 birth doses before newborn discharge?',
    ],
  });

  // Default protective factors if healthy
  if (protectiveFactors.length === 0) {
    protectiveFactors.push(
      'Healthy maternal age and regular attendance at antenatal care checkups.',
      'Documented normal baseline blood pressure and stable maternal weight trajectory.'
    );
  }

  // Universal screenings
  recommendedScreenings.push(
    {
      testName: 'Complete Blood Count (CBC) & Anemia Check',
      windowWeeks: 'Baseline & 28 Weeks',
      guidelineStandard: 'WHO ANC Standard (Hb threshold: 10.5-11.0 g/dL)',
      clinicalReason: 'Monitors physiological hemodilution and rules out iron deficiency anemia.',
    },
    {
      testName: 'Targeted Fetal Anomaly Ultrasound (TIFFA / Level-II)',
      windowWeeks: '18 - 22 Weeks',
      guidelineStandard: 'ISUOG / FOGSI Practice Guidelines',
      clinicalReason: 'Detailed anatomical survey of brain, heart, spine, kidneys, and extremities.',
    }
  );

  recommendedConsultations.push({
    specialty: 'Obstetrician',
    timing: 'Every 2-4 weeks (Stage dependent)',
    primaryFocus: 'Routine fetal growth monitoring, blood pressure, urine albumin, and symptom review.',
  });

  const categoryLabels: Record<
    BabyRiskCategory,
    { label: string; labelHi: string; summary: string; summaryHi: string }
  > = {
    no_elevated_risk: {
      label: 'No Specific Elevated Risk Identified from Available Information',
      labelHi: 'उपलब्ध जानकारी के अनुसार कोई विशिष्ट बढ़ा हुआ जोखिम नहीं पाया गया',
      summary:
        'Your documented family pedigree, parental health details, and clinical parameters are reassuring and align with standard antenatal milestones. Continue routine preventive care, balanced nutrition, and scheduled prenatal visits.',
      summaryHi:
        'आपकी पारिवारिक स्वास्थ्य पृष्ठभूमि और वर्तमान प्रसवपूर्व पैरामीटर्स पूरी तरह संतोषजनक हैं। नियमित डॉक्टर विज़िट, संतुलित पोषण और अनुशंसित टीकों का पालन जारी रखें।',
    },
    additional_info_needed: {
      label: 'Additional Information Needed',
      labelHi: 'अतिरिक्त चिकित्सीय जानकारी व जांच की आवश्यकता',
      summary:
        'Certain parental parameters, family history details, or laboratory values (such as partner carrier status or screening labs) require clinical verification to complete a comprehensive assessment.',
      summaryHi:
        'शिशु के संपूर्ण स्वास्थ्य विश्लेषण के लिए कुछ अतिरिक्त जानकारियों (जैसे पार्टनर की HPLC रिपोर्ट या विशिष्ट जांच) की पुष्टि की आवश्यकता है।',
    },
    risk_factor_identified: {
      label: 'Risk Factor Identified — Discuss with a Clinician',
      labelHi: 'जोखिम कारक चिन्हित — अपने स्त्री रोग विशेषज्ञ से चर्चा करें',
      summary:
        'Specific clinical risk factors (such as Rh blood group discordance, carrier history, or gestational glycemic vulnerability) have been noted. Modern clinical protocols provide highly effective preventive measures when managed proactively with your doctor.',
      summaryHi:
        'कुछ विशिष्ट स्वास्थ्य पहलुओं (जैसे Rh ब्लड ग्रुप या पारिवारिक इतिहास) पर ध्यान देने की आवश्यकता है। डॉक्टर की देखरेख में आधुनिक निवारक उपचार (जैसे एंटी-डी या सही पोषण) से शिशु पूरी तरह सुरक्षित रह सकता है।',
    },
    prompt_assessment: {
      label: 'Prompt Medical Assessment Recommended',
      labelHi: 'शीघ्र डॉक्टर परामर्श एवं विशिष्ट जांच अनुशंसित',
      summary:
        'One or more documented factors (such as pre-existing maternal medical conditions, both parents carrying genetic carrier traits, or preeclampsia history) require structured, priority evaluation by your Obstetrician or a specialist.',
      summaryHi:
        'एक या अधिक चिकित्सीय स्थितियों के कारण आपके स्त्री रोग विशेषज्ञ या विशेषज्ञ डॉक्टर (एंडोक्रिनोलॉजिस्ट/जेनेटिसिस्ट) से शीघ्र विस्तृत परामर्श व फॉलो-अप की सलाह दी जाती है।',
    },
  };

  return {
    overallCategory: highestSeverity,
    categoryLabel: categoryLabels[highestSeverity].label,
    categoryLabelHi: categoryLabels[highestSeverity].labelHi,
    summary: categoryLabels[highestSeverity].summary,
    summaryHi: categoryLabels[highestSeverity].summaryHi,
    assessmentDate: new Date().toISOString().split('T')[0],
    riskFactors,
    protectiveFactorsSummary: protectiveFactors,
    recommendedConsultations,
    recommendedScreenings,
    safetyLimitations: {
      disclaimer:
        'This assessment is an educational clinical synthesis and does NOT constitute a definitive medical diagnosis, genetic prognosis, or replacement for personalized in-person clinical care.',
      noPredictiveGuaranteeNotice:
        'AI cannot predict the exact future health status of an unborn baby. No mathematical probability of disease is generated without validated clinical laboratory methods.',
      normalReportBoundaryNotice:
        'A normal lab or ultrasound report does not guarantee the permanent absence of all future developmental or genetic concerns.',
      familyHistoryBoundaryNotice:
        'Family health history reflects statistical patterns, not a personal genetic diagnosis. Definite hereditary conditions require validated molecular diagnostic testing (e.g., DNA sequencing, karyotyping).',
    },
    references: VERIFIED_CLINICAL_REFERENCES,
  };
}

// Sample Personalized Care Plan items
export const SAMPLE_CARE_PLAN_ITEMS: CarePlanActionItem[] = [
  {
    id: 'cp-iron-calcium',
    title: 'Separated Iron & Calcium Supplementation Protocol',
    titleHi: 'आयरन और कैल्शियम की खुराक में 2 घंटे का अनिवार्य अंतर',
    category: 'routine_prenatal',
    priority: 'routine',
    whatItMeans:
      'Calcium and Iron competitively bind to the same intestinal divalent metal transporter (DMT1). Taking them together drops iron absorption by up to 60%.',
    whyItMatters:
      'Prevents maternal iron deficiency anemia and optimizes fetal brain oxygenation and birth weight.',
    practicalSteps: [
      'Take Ferrous Ascorbate/Sulfate in the morning 1-2 hours after breakfast with a source of Vitamin C (lemon water or orange juice).',
      'Take Calcium carbonate/citrate after lunch or dinner with plain water.',
      'Avoid taking iron with tea, coffee, milk, or antacids.',
    ],
    doctorSpecialty: 'Obstetrician & Clinical Dietitian',
    timing: 'Daily throughout Trimesters 2 & 3 and 6 months postpartum',
    warningSigns: [
      'Extreme dizziness, shortness of breath at rest, pale conjunctiva or fingernails (Severe Anemia).',
    ],
    isCompleted: false,
  },
  {
    id: 'cp-rh-ict',
    title: 'Indirect Coombs Test (ICT) & Anti-D Immunoprophylaxis Planning',
    titleHi: 'Rh नेगेटिव माताओं के लिए ICT टेस्ट और एंटी-डी योजना',
    category: 'clinician_review',
    priority: 'discuss_soon',
    whatItMeans:
      'An antibody titer blood test to confirm absence of anti-Rh(D) antibodies in maternal blood before routine prophylaxis.',
    whyItMatters:
      'Ensures baby is protected from maternal immune destruction of fetal red blood cells (Hemolytic Disease of Newborn).',
    practicalSteps: [
      'Confirm partner blood group and Rh factor at earliest clinic visit.',
      'Perform baseline ICT test in first/second trimester.',
      'If ICT is negative, schedule 300 mcg Anti-D injection at 28 completed weeks of gestation.',
    ],
    doctorSpecialty: 'Obstetrician',
    timing: 'Weeks 24-28 of gestation',
    neededInformation: 'Paternal blood group verification report',
    warningSigns: [
      'Any episode of vaginal bleeding or abdominal trauma requires Anti-D injection within 72 hours, regardless of gestational week.',
    ],
    isCompleted: false,
  },
  {
    id: 'cp-ogtt-75g',
    title: 'Standardized 75g Oral Glucose Tolerance Test (OGTT)',
    titleHi: '75 ग्राम ओरल ग्लूकोज टॉलरेंस टेस्ट (OGTT)',
    category: 'routine_prenatal',
    priority: 'discuss_soon',
    whatItMeans:
      'Single-step diagnostic blood test measuring fasting, 1-hour, and 2-hour venous plasma glucose after drinking 75 grams of anhydrous glucose.',
    whyItMatters:
      'Screens for Gestational Diabetes Mellitus (GDM) before symptoms emerge, protecting against macrosomia and neonatal hypoglycemia.',
    practicalSteps: [
      'Schedule lab appointment between weeks 24 and 28.',
      'Fast for 8 to 12 hours overnight before morning blood draw.',
      'Drink 75g glucose dissolved in 300ml water within 5 minutes; rest comfortably during testing without eating or walking.',
    ],
    doctorSpecialty: 'Obstetrician & Diagnostic Laboratory',
    timing: 'Weeks 24 to 28 of gestation',
    warningSigns: [
      'Excessive unquenchable thirst, rapid unexplained weight gain, or polyhydramnios on ultrasound.',
    ],
    isCompleted: false,
  },
  {
    id: 'cp-fetal-kick-counts',
    title: 'Daily Fetal Movement & Kick Counting Awareness',
    titleHi: 'दैनिक भ्रूण हलचल और किक काउंट रिकॉर्डिंग',
    category: 'lifestyle_safeguard',
    priority: 'routine',
    whatItMeans:
      'Tracking active fetal kicks, rolls, and flutters after 28 weeks as a direct clinical proxy of fetal oxygenation and neurological well-being.',
    whyItMatters:
      'A healthy placenta provides sufficient oxygen for regular muscular activity. Decreased movement is an early warning sign of fetal distress.',
    practicalSteps: [
      'Count kicks twice daily: once in the morning and once in the evening after meals.',
      'Lie on your left side in a quiet room with hands resting on your abdomen.',
      'Confirm at least 10 distinct movements within a 2-hour window.',
    ],
    doctorSpecialty: 'Obstetrician / Maternity Triage',
    timing: 'Daily from Week 28 until delivery',
    warningSigns: [
      'Fewer than 10 movements in 2 hours while resting on left side.',
      'Sudden cessation of movement or dramatic reduction compared to the previous day (Proceed to hospital labor room immediately).',
    ],
    isCompleted: false,
  },
  {
    id: 'cp-bcg-birth-dose',
    title: 'Hospital Birth Dose Newborn Immunization Preparation',
    titleHi: 'अस्पताल में जन्म के समय बीसीजी और हेपेटाइटिस बी टीके की तैयारी',
    category: 'routine_prenatal',
    priority: 'routine',
    whatItMeans:
      'Ensuring the delivery facility is prepared to administer the three mandatory birth doses: BCG (Tuberculosis), bOPV-0 (Polio), and Hepatitis B birth dose.',
    whyItMatters:
      'BCG administered within 24-48 hours provides up to 80% protection against severe childhood disseminated tuberculosis and tubercular meningitis.',
    practicalSteps: [
      'Add baby vaccination record book/MCP card to the Hospital Bag checklist.',
      'Confirm delivery hospital policy for immediate birth-dose vaccination in the labor/recovery room.',
      'Ensure pediatrician records batch number and left-deltoid site in discharge summary.',
    ],
    doctorSpecialty: 'Pediatrician / Neonatologist',
    timing: 'Third Trimester (Week 32-36 preparation; given within 24-48h of birth)',
    warningSigns: ['Never delay birth doses without documented pediatric contraindication.'],
    isCompleted: false,
  },
];

// Chronological Health Timeline milestones
export const CHRONOLOGICAL_HEALTH_TIMELINE: HealthTimelineEvent[] = [
  {
    id: 'tl-1',
    period: 'Weeks 6 - 8',
    title: 'Dating Ultrasound & Baseline Maternal Antenatal Profile',
    titleHi: 'डेटिंग अल्ट्रासाउंड एवं प्रारंभिक प्रसवपूर्व जांच',
    description:
      'Confirms intrauterine gestational sac, cardiac flicker, and precise crown-rump length (CRL) for exact EDD calculation. Baseline blood group, Rh typing, CBC, TSH, and viral serology (HIV, HBsAg, VDRL).',
    domain: 'screening',
    status: 'completed',
    whoStandardRef: 'WHO ANC Recommendation A.1',
    actionRequired: 'Record accurate EDD based on early CRL ultrasound measurement.',
  },
  {
    id: 'tl-2',
    period: 'Weeks 11 - 13+6',
    title: 'First Trimester Combined Screening (NT Scan & Dual Marker)',
    titleHi: 'प्रथम तिमाही कंबाइंड स्क्रीनिंग (NT स्कैन एवं डुअल मार्कर)',
    description:
      'Nuchal Translucency (NT) ultrasound and maternal serum PAPP-A + free beta-hCG to assess risk for Down Syndrome (Trisomy 21) and major chromosomal conditions without invasive risks.',
    domain: 'screening',
    status: 'completed',
    whoStandardRef: 'FOGSI & ISUOG First Trimester Guideline',
  },
  {
    id: 'tl-3',
    period: 'Weeks 18 - 20',
    title: 'Level-II Targeted Imaging for Fetal Anomalies (TIFFA)',
    titleHi: 'लेवल-2 टिफा स्कैन (संपूर्ण अंग संरचना सर्वेक्षण)',
    description:
      'Comprehensive anatomical survey evaluating cerebral ventricles, 4-chamber cardiac view, spine, kidneys, abdominal wall, face, limbs, and placental attachment.',
    domain: 'screening',
    status: 'completed',
    whoStandardRef: 'ISUOG Mid-Trimester Anomaly Protocol',
  },
  {
    id: 'tl-4',
    period: 'Week 24 - 28',
    title: '75g Oral Glucose Tolerance Test (OGTT) & Repeat CBC / ICT',
    titleHi: '75 ग्राम ग्लूकोज टॉलरेंस टेस्ट एवं हीमोग्लोबिन फॉलो-अप',
    description:
      'Screening for Gestational Diabetes Mellitus using WHO/IADPSG criteria. Repeat Hemoglobin to monitor physiological plasma expansion anemia. Indirect Coombs Test for Rh-negative mothers.',
    domain: 'lab_check',
    status: 'current',
    whoStandardRef: 'WHO Hyperglycaemia Guideline (2018)',
    actionRequired: 'Complete 75g OGTT morning fasting lab draw.',
  },
  {
    id: 'tl-5',
    period: 'Weeks 28 - 32',
    title: 'Maternal Tdap / Td Vaccination & Fetal Movement Daily Vigilance',
    titleHi: 'मातृ Tdap टीकाकरण एवं दैनिक किक काउंट निगरानी',
    description:
      'Maternal Tdap vaccination provides passive transplacental IgG antibody transfer protecting the infant from life-threatening pertussis (whooping cough) until 2-month pediatric shots. Active kick counting commences.',
    domain: 'vaccine',
    status: 'upcoming',
    whoStandardRef: 'WHO & CDC Maternal Immunization Standard',
  },
  {
    id: 'tl-6',
    period: 'Weeks 32 - 34',
    title: 'Third Trimester Fetal Growth & Umbilical Doppler Ultrasound',
    titleHi: 'तीसरी तिमाही भ्रूण वृद्धि एवं डॉपलर स्कैन',
    description:
      'Evaluates estimated fetal weight (EFW), Amniotic Fluid Index (AFI), fetal presentation (cephalic vs breech), and placental vascular resistance.',
    domain: 'screening',
    status: 'upcoming',
    whoStandardRef: 'WHO Positive Pregnancy Experience 2016',
  },
  {
    id: 'tl-7',
    period: 'Weeks 36 - 37',
    title: 'Birth Preparedness, GBS Screening & Contraction Awareness',
    titleHi: 'प्रसव तैयारी, जीबीएस स्क्रीनिंग एवं संकुचन निगरानी',
    description:
      'Hospital bag readiness, Group B Streptococcus (GBS) recto-vaginal swab, cervical ripening check, and identifying true labor contractions (5-1-1 rule).',
    domain: 'milestone',
    status: 'upcoming',
    whoStandardRef: 'ACOG Practice Bulletin No. 216',
  },
  {
    id: 'tl-8',
    period: 'Birth (0 - 48 Hours)',
    title: 'Immediate Newborn Birth Dose: BCG, bOPV-0, Hepatitis B',
    titleHi: 'शिशु का जन्म: बीसीजी, पोलियो जीरो डोज एवं हेपेटाइटिस बी टीका',
    description:
      'Essential newborn care including delayed cord clamping (1-3 min), early skin-to-skin contact, colostrum initiation within 1 hour, and administration of BCG, bOPV-0, and Hepatitis B birth dose.',
    domain: 'pediatric',
    status: 'upcoming',
    whoStandardRef: 'Universal Immunization Programme (UIP) & WHO Essential Newborn Care',
    actionRequired: 'Ensure pediatrician records vaccine batch numbers in child health record card.',
  },
];
