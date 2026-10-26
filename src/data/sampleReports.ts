export interface SampleReportCase {
  id: string;
  title: string;
  titleHi: string;
  category: 'blood_test' | 'ultrasound' | 'urine_test' | 'pediatric';
  patientName: string;
  stageInfo: string;
  stageInfoHi: string;
  city: string;
  reportDate: string;
  rawOcrText: string;
  suggestedParameters: {
    testName: string;
    measuredValue: string;
    unit: string;
    whoStandard: string;
    labReferenceRange: string;
    status: 'normal' | 'outside' | 'borderline' | 'uninterpretable';
    relevance: string;
    nextStep: string;
    isVerified: boolean;
    needsVerificationReason?: string;
  }[];
  notes: string;
}

export const SAMPLE_REPORT_CASES: SampleReportCase[] = [
  {
    id: 't2-ogtt-heatwave',
    title: '2nd Trimester CBC & 75g OGTT (Heatwave Context)',
    titleHi: 'दूसरी तिमाही CBC एवं 75g ग्लूकोज टेस्ट (गर्मी का मौसम)',
    category: 'blood_test',
    patientName: 'Ananya Sharma',
    stageInfo: 'Pregnancy: 24 Weeks (Trimester 2)',
    stageInfoHi: 'गर्भावस्था: 24वां सप्ताह (दूसरी तिमाही)',
    city: 'Ahmedabad',
    reportDate: '2025-05-18',
    rawOcrText: `SHREE CLINICAL PATHOLOGY LABORATORY & DIAGNOSTICS
Patient Name: Ananya Sharma | Age: 28 Yrs / Female | Ref By: Dr. Meenakshi Iyer, MD (OB-GYN)
Gestation: 24 Weeks 2 Days (Second Trimester) | Sample Date: 18-May-2025

TEST REPORT: COMPLETE BLOOD COUNT & 75g ORAL GLUCOSE TOLERANCE TEST (OGTT)
- Hemoglobin (Hb): 10.8 g/dL (Method: Cyanmethemoglobin)
- Packed Cell Volume (PCV / Hematocrit): 33.2 %
- Platelet Count: 240,000 /µL (Normal: 150,000 - 450,000)
- Fasting Plasma Glucose: 94 mg/dL
- 2-Hour Post 75g Oral Glucose: 136 mg/dL
- Urine Ketones: Negative
- Urine Albumin: Nil
Pathologist Note: Fasting glucose slightly above normal prenatal threshold. Mild physiological hemodilution consistent with 24w gestation.`,
    suggestedParameters: [
      {
        testName: 'Hemoglobin (Hb)',
        measuredValue: '10.8',
        unit: 'g/dL',
        whoStandard: '≥ 10.5 g/dL (WHO ANC Guideline Trimester 2)',
        labReferenceRange: '11.0 - 14.0 g/dL',
        status: 'normal',
        relevance: 'Above WHO 2nd-trimester threshold (≥10.5 g/dL), physiological hemodilution present.',
        nextStep: 'Continue oral iron (take with citrus juice, 2h apart from calcium).',
        isVerified: true,
      },
      {
        testName: 'Fasting Plasma Glucose',
        measuredValue: '94',
        unit: 'mg/dL',
        whoStandard: '< 92 mg/dL (WHO 2013 / IADPSG Gestational Criteria)',
        labReferenceRange: '70 - 99 mg/dL',
        status: 'borderline',
        relevance: 'Fasting value 94 mg/dL exceeds WHO gestational diabetes threshold of 92 mg/dL.',
        nextStep: 'Consult OB-GYN for nutritional counseling and repeat fasting profile.',
        isVerified: true,
      },
      {
        testName: '2-Hour Post 75g Glucose',
        measuredValue: '136',
        unit: 'mg/dL',
        whoStandard: '< 153 mg/dL (WHO 75g OGTT Guideline)',
        labReferenceRange: '< 140 mg/dL',
        status: 'normal',
        relevance: 'Adequate post-load insulin response; well below the 153 mg/dL WHO diagnostic cutoff.',
        nextStep: 'Limit high-glycemic index foods and maintain gentle walking.',
        isVerified: true,
      },
      {
        testName: 'Platelet Count',
        measuredValue: '240,000',
        unit: '/µL',
        whoStandard: '150,000 - 450,000 /µL',
        labReferenceRange: '150,000 - 400,000 /µL',
        status: 'normal',
        relevance: 'Coagulation markers healthy; no gestational thrombocytopenia.',
        nextStep: 'Routine monitoring.',
        isVerified: true,
      },
    ],
    notes: 'Demonstrates application of WHO Trimester-2 anemia threshold (10.5 g/dL vs lab 11.0) and WHO/IADPSG OGTT fasting threshold (92 mg/dL) alongside Ahmedabad heatwave hydration advisories.',
  },
  {
    id: 't3-preeclampsia-alert',
    title: '3rd Trimester Preeclampsia Screening (Severe Warning Alert)',
    titleHi: 'तीसरी तिमाही प्री-एक्लेम्पसिया स्क्रीनिंग (चेतावनी संकेत)',
    category: 'blood_test',
    patientName: 'Priya Verma',
    stageInfo: 'Pregnancy: 34 Weeks (Trimester 3)',
    stageInfoHi: 'गर्भावस्था: 34वां सप्ताह (तीसरी तिमाही)',
    city: 'Delhi NCR',
    reportDate: '2025-06-04',
    rawOcrText: `METROPOLITAN MATERNAL DIAGNOSTIC CENTRE
Patient: Priya Verma | Age: 31 | Gravida 1 Para 0 | Gestation: 34 Weeks
Chief Complaint: Recurrent frontal headaches, blurred vision, bilateral leg edema.

CLINICAL INVESTIGATION REPORT:
- Sitting Blood Pressure: 152/98 mmHg (Confirmed on two readings 15 mins apart)
- Urine Albumin (Dipstick): 2+ (Positive, estimated 100 mg/dL)
- Serum Creatinine: 1.05 mg/dL (Elevated for 3rd trimester, normal < 0.8 mg/dL)
- Platelet Count: 122,000 /µL (Borderline low / Gestational thrombocytopenia)
- Serum Uric Acid: 6.8 mg/dL (Elevated, normal < 5.5 mg/dL)
- AST / SGOT: 58 U/L (Mildly elevated, normal < 35 U/L)
URGENT ATTENTION: Findings suggestive of preeclampsia with severe features.`,
    suggestedParameters: [
      {
        testName: 'Blood Pressure (Systolic/Diastolic)',
        measuredValue: '152/98',
        unit: 'mmHg',
        whoStandard: '< 140/90 mmHg (WHO ANC & Hypertensive Disorders Guidelines)',
        labReferenceRange: '< 120/80 mmHg',
        status: 'outside',
        relevance: 'Stage 2 gestational hypertension in third trimester.',
        nextStep: 'IMMEDIATE Obstetric Hospital Review: Risk of preeclampsia progression.',
        isVerified: true,
      },
      {
        testName: 'Urine Albumin / Proteinuria',
        measuredValue: '2+',
        unit: 'dipstick (~100 mg/dL)',
        whoStandard: 'Negative / Trace (WHO ANC Guidelines)',
        labReferenceRange: 'Negative',
        status: 'outside',
        relevance: 'Significant proteinuria in combination with BP > 140/90 confirms Preeclampsia.',
        nextStep: 'Urgent hospital admission for maternal and fetal surveillance.',
        isVerified: true,
      },
      {
        testName: 'Platelet Count',
        measuredValue: '122,000',
        unit: '/µL',
        whoStandard: '≥ 150,000 /µL',
        labReferenceRange: '150,000 - 450,000 /µL',
        status: 'outside',
        relevance: 'Thrombocytopenia, potential early HELLP syndrome indicator.',
        nextStep: 'Coagulation profile and urgent labor room evaluation.',
        isVerified: true,
      },
      {
        testName: 'Serum Creatinine',
        measuredValue: '1.05',
        unit: 'mg/dL',
        whoStandard: '< 0.8 mg/dL in Pregnancy (Normal pregnancy increased GFR lowers creatinine)',
        labReferenceRange: '0.6 - 1.1 mg/dL',
        status: 'outside',
        relevance: 'Elevated for pregnancy (normal GFR lowers creatinine to 0.4-0.7). Reflects renal involvement.',
        nextStep: 'Renal panel monitoring and urine protein-creatinine ratio (UPCR).',
        isVerified: true,
      },
    ],
    notes: 'Trigger for Obstetric Emergency Red-Flag triage. Demonstrates that climate/location can NEVER excuse abnormal preeclamptic parameters.',
  },
  {
    id: 'smudged-scan-unclear',
    title: 'Occluded / Blurred Clinic Scan (Missing Data Verification Test)',
    titleHi: 'धुंधली स्कैन रिपोर्ट (डेटा सत्यापन एवं पुष्टि जांच)',
    category: 'blood_test',
    patientName: 'Sunita Rao',
    stageInfo: 'Pregnancy: 16 Weeks (Trimester 2)',
    stageInfoHi: 'गर्भावस्था: 16वां सप्ताह (दूसरी तिमाही)',
    city: 'Bengaluru',
    reportDate: '2025-04-12',
    rawOcrText: `DISTRICT COMMUNITY HEALTH CENTER - LAB SLIP
Patient: Sunita Rao | Age: 26 | Reg No: 88421
Sample: Peripheral venous blood | Date: 12-Apr-2025

LAB RESULTS (PARTIAL SCAN):
- Hemoglobin: [BLURRED / SMUDGED] g/dL (Stain on paper: reads possibly 9.? or 10.?)
- Fasting Blood Sugar: 88 mg/dL (Normal)
- Serum TSH: 4.85 mIU/L (High for pregnancy trimester 2 standard)
- Blood Group: B Positive | Rh Factor: Positive
- Urine Routine: Pus cells 6-8/HPF, Bacteria: [UNREADABLE TEAR ON MARGIN]
ATTENTION: Lab slip folded and smudged in rain. Some values cannot be confirmed without original lab register.`,
    suggestedParameters: [
      {
        testName: 'Hemoglobin (Hb)',
        measuredValue: 'Unclear (9.? / 10.?)',
        unit: 'g/dL',
        whoStandard: '≥ 10.5 g/dL (WHO Trimester 2)',
        labReferenceRange: '11.0 - 14.0 g/dL',
        status: 'uninterpretable',
        relevance: 'Blurry or torn field. Clinical AI must NOT fabricate or guess this critical number.',
        nextStep: 'Please check original physical paper or verify exact value with lab.',
        isVerified: false,
        needsVerificationReason: 'Smudged ink on physical printout: reading is ambiguous between 9.2 and 10.8 g/dL.',
      },
      {
        testName: 'Serum TSH (Thyroid Stimulating Hormone)',
        measuredValue: '4.85',
        unit: 'mIU/L',
        whoStandard: '< 3.0 mIU/L (American Thyroid Association / FOGSI Trimester 2 Reference)',
        labReferenceRange: '0.4 - 4.5 mIU/L (Non-pregnant reference)',
        status: 'outside',
        relevance: 'Subclinical hypothyroidism. FOGSI & WHO guidelines recommend TSH < 3.0 in Trimester 2 for fetal neurodevelopment.',
        nextStep: 'Endocrinologist / OB-GYN consult for levothyroxine evaluation and Free T4.',
        isVerified: true,
      },
      {
        testName: 'Urine Routine (Pus Cells / Bacteria)',
        measuredValue: '6-8 pus cells / [Bacteria Unclear]',
        unit: '/HPF',
        whoStandard: '< 5 pus cells / HPF, No bacteriuria (WHO ANC Routine Urine Screening)',
        labReferenceRange: '0-5 pus cells / HPF',
        status: 'uninterpretable',
        relevance: 'Asymptomatic bacteriuria or mild urinary tract infection (UTI) cannot be ruled out.',
        nextStep: 'Send clean-catch midstream urine for microscopy and culture before antibiotics.',
        isVerified: false,
        needsVerificationReason: 'Torn margin on lab slip obscures bacterial morphology and colony count.',
      },
      {
        testName: 'Fasting Blood Sugar',
        measuredValue: '88',
        unit: 'mg/dL',
        whoStandard: '< 92 mg/dL (WHO / IADPSG Criteria)',
        labReferenceRange: '70 - 100 mg/dL',
        status: 'normal',
        relevance: 'Within normal limits; reassuring fasting glycemic control.',
        nextStep: 'Schedule 75g OGTT at 24-28 weeks.',
        isVerified: true,
      },
    ],
    notes: 'Demonstrates strict anti-hallucination compliance: missing or smudged parameters trigger the interactive verification modal so the user confirms true figures before clinical assessment.',
  },
  {
    id: 'monsoon-pediatric-platelets',
    title: 'Monsoon Pediatric Fever & Platelet Scan (Baby 8 Months)',
    titleHi: 'मानसून शिशु बुखार एवं प्लेटलेट जांच (8 महीने का बच्चा)',
    category: 'pediatric',
    patientName: 'Baby Aarav',
    stageInfo: 'Pediatric: 8 Months Old Infant',
    stageInfoHi: 'बाल चिकित्सा: 8 महीने का शिशु',
    city: 'Mumbai',
    reportDate: '2025-07-22',
    rawOcrText: `CHILDREN SPECIALTY CLINIC & PATHOLOGY
Patient: Baby Aarav (Male) | Age: 8 Months | Weight: 8.2 kg
Clinical History: High continuous fever (102.4°F) for 3 days, irritability, decreased feeding.
Local Context: Active Mumbai monsoon with high dengue/malaria outbreak alert.

INVESTIGATION REPORT:
- Platelet Count: 82,000 /µL (Marked Thrombocytopenia; baseline > 150,000)
- Hemoglobin: 11.2 g/dL (Adequate for 8 months per WHO standard > 10.5 g/dL)
- Hematocrit (PCV): 42.5 % (Elevated, suggestive of plasma leakage / hemoconcentration)
- Total Leukocyte Count (TLC): 3,600 /µL (Leukopenia, normal 6,000 - 17,000)
- Dengue NS1 Antigen: POSITIVE (Rapid Chromatographic Assay)
- Malarial Parasite (Smear): Negative
CRITICAL CLINICAL OBSERVATION: Acute dengue febrile illness with thrombocytopenia and hemoconcentration.`,
    suggestedParameters: [
      {
        testName: 'Platelet Count',
        measuredValue: '82,000',
        unit: '/µL',
        whoStandard: '150,000 - 450,000 /µL (WHO Dengue Guidelines & Pediatric Normal)',
        labReferenceRange: '150,000 - 450,000 /µL',
        status: 'outside',
        relevance: 'Significant thrombocytopenia (<100,000 /µL) in an infant with high fever.',
        nextStep: 'URGENT Pediatrician evaluation for close inpatient hydration monitoring.',
        isVerified: true,
      },
      {
        testName: 'Dengue NS1 Antigen',
        measuredValue: 'Positive',
        unit: 'serological',
        whoStandard: 'Negative (WHO Dengue Case Classification)',
        labReferenceRange: 'Negative',
        status: 'outside',
        relevance: 'Confirms acute dengue viral infection in acute viremic phase.',
        nextStep: 'Monitor for warning signs: persistent vomiting, lethargy, mucosal bleeding.',
        isVerified: true,
      },
      {
        testName: 'Hematocrit (PCV)',
        measuredValue: '42.5',
        unit: '%',
        whoStandard: '31% - 37% (WHO Infant Normal Range 6-12 Months)',
        labReferenceRange: '32 - 38 %',
        status: 'outside',
        relevance: 'Elevated PCV (>40%) indicates hemoconcentration due to vascular capillary leakage.',
        nextStep: 'Frequent oral fluids (breast milk / ORS) under direct pediatrician direction.',
        isVerified: true,
      },
    ],
    notes: 'Demonstrates location & seasonal awareness: active monsoon vector-borne disease in an 8-month infant evaluated under WHO Dengue and pediatric clinical guidelines.',
  },
];
