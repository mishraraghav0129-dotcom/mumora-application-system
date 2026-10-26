import { HealthReminder, ReminderSettings, ClinicalReferenceCitation } from '../types';

export const OFFICIAL_VACCINATION_SOURCES: ClinicalReferenceCitation[] = [
  {
    id: 'ref-mohfw-uip-2024',
    title: 'MoHFW India Universal Immunization Programme (UIP) National Guidelines',
    issuingOrganization: 'MoHFW India',
    publicationYear: '2023 (Verified 2024)',
    relevantSection: 'Tetanus & adult Diphtheria (Td) in Pregnancy & National Childhood Immunization Schedule',
    url: 'https://nhm.gov.in',
    isOfficialGuideline: true,
    clinicalSummary: 'Td vaccine completely replaces TT for pregnant women: Td-1 early in pregnancy, Td-2 at 4 weeks after Td-1, or Td-Booster if 2 doses were documented in a pregnancy within the preceding 3 years. Universal birth doses: BCG, OPV-0, and Hepatitis B within 24-48 hours.',
  },
  {
    id: 'ref-who-tetanus-2022',
    title: 'WHO Position Paper on Tetanus Vaccines & Maternal and Neonatal Tetanus Elimination (MNTE)',
    issuingOrganization: 'World Health Organization (WHO)',
    publicationYear: '2017 (Reaffirmed 2022)',
    relevantSection: 'Protection of Newborns through Maternal Immunization',
    url: 'https://www.who.int/teams/immunization-vaccines-and-biologicals/policies/position-papers/tetanus',
    isOfficialGuideline: true,
    clinicalSummary: 'Neonatal tetanus is completely preventable through clean delivery practices and maternal immunization with Td, transferring protective maternal IgG antibodies across the placenta to the fetus.',
  },
  {
    id: 'ref-cdc-tdap-pregnancy',
    title: 'CDC & ACOG Clinical Guidance for Tdap Vaccination During Pregnancy',
    issuingOrganization: 'ACOG',
    publicationYear: '2022',
    relevantSection: 'Maternal Pertussis Immunization between 27 and 36 Weeks Gestation',
    url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/09/update-on-immunization-and-pregnancy-tetanus-diphtheria-and-pertussis-vaccination',
    isOfficialGuideline: true,
    clinicalSummary: 'Recommends Tdap during the 27th through 36th week of every pregnancy to maximize passive antibody transfer against Bordetella pertussis (whooping cough) to the newborn before infant vaccinations begin.',
  },
];

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  defaultAdvanceDays: [3, 0], // Strict default rule: exactly 3 days before and on the due date
  preferredTime: '09:00',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  enableBrowserPush: false,
  enableInAppToasts: true,
  separateCategoryConfigs: false,
  useGlobalPreferences: true,
  privacySafeLockScreen: true,
  categories: {
    vaccination: { enabled: true, advanceDays: [3, 0], preferredTime: '09:00' },
    antenatal_checkup: { enabled: true, advanceDays: [3, 0], preferredTime: '09:00' },
    medical_test: { enabled: true, advanceDays: [3, 0], preferredTime: '09:00' },
    medication: { enabled: true, advanceDays: [0], preferredTime: '08:30' },
    nutrition: { enabled: true, advanceDays: [0], preferredTime: '08:00' },
    child_health: { enabled: true, advanceDays: [3, 0], preferredTime: '09:00' },
  },
  lastUpdated: '2026-10-23',
};

// Calculate exact days remaining and human-readable status badge
export function calculateReminderStatus(dueDateStr: string): {
  diffDays: number;
  statusLabel: string;
  statusLabelHi: string;
  statusLabelTe: string;
  badgeClass: string;
  isDueIn3Days: boolean;
  isDueToday: boolean;
  isOverdue: boolean;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = dueDateStr.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return {
      diffDays,
      statusLabel: 'Due today',
      statusLabelHi: 'आज देय है',
      statusLabelTe: 'ఈరోజే గడువు ఉంది',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-bold animate-pulse',
      isDueIn3Days: false,
      isDueToday: true,
      isOverdue: false,
    };
  } else if (diffDays === 3) {
    return {
      diffDays,
      statusLabel: 'Due in 3 days',
      statusLabelHi: '3 दिन में देय',
      statusLabelTe: '3 రోజుల్లో గడువు ఉంది',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
      isDueIn3Days: true,
      isDueToday: false,
      isOverdue: false,
    };
  } else if (diffDays === 1) {
    return {
      diffDays,
      statusLabel: 'Due tomorrow',
      statusLabelHi: 'कल देय है',
      statusLabelTe: 'రేపే గడువు ఉంది',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200 font-semibold',
      isDueIn3Days: false,
      isDueToday: false,
      isOverdue: false,
    };
  } else if (diffDays === 2) {
    return {
      diffDays,
      statusLabel: 'Due in 2 days',
      statusLabelHi: '2 दिन में देय',
      statusLabelTe: '2 రోజుల్లో గడువు ఉంది',
      badgeClass: 'bg-purple-50 text-purple-900 border-purple-200 font-semibold',
      isDueIn3Days: false,
      isDueToday: false,
      isOverdue: false,
    };
  } else if (diffDays > 3) {
    return {
      diffDays,
      statusLabel: `Due in ${diffDays} days`,
      statusLabelHi: `${diffDays} दिनों में देय`,
      statusLabelTe: `${diffDays} రోజుల్లో గడువు ఉంది`,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
      isDueIn3Days: false,
      isDueToday: false,
      isOverdue: false,
    };
  } else {
    const overdueDays = Math.abs(diffDays);
    return {
      diffDays,
      statusLabel: 'Overdue — please verify with your healthcare provider',
      statusLabelHi: 'अतिदेय — कृपया अपने डॉक्टर से पुष्टि करें',
      statusLabelTe: 'గడువు ముగిసింది — దయచేసి మీ వైద్యుడితో ధృవీకరించండి',
      badgeClass: 'bg-red-100 text-red-800 border-red-300 font-bold',
      isDueIn3Days: false,
      isDueToday: false,
      isOverdue: true,
    };
  }
}

export function getReminderStatusLabel(status: ReturnType<typeof calculateReminderStatus>, lang: string): string {
  if (lang === 'hi') return status.statusLabelHi;
  if (lang === 'te') return status.statusLabelTe;
  return status.statusLabel;
}

export function getReminderTitle(rem: HealthReminder, lang: string): string {
  if (lang === 'hi') return rem.titleHi || rem.title;
  if (lang === 'te') return rem.titleTe || rem.title;
  return rem.title;
}

export function getReminderWhyShown(rem: HealthReminder, lang: string): string {
  if (lang === 'hi') return rem.whyShownHi || rem.whyShown;
  if (lang === 'te') return rem.whyShownTe || rem.whyShown;
  return rem.whyShown;
}

// Evaluate Maternal Td / Tdap vaccination schedule based on clinical rules
export function evaluateMaternalTdSchedule(params: {
  currentWeek: number;
  edd: string;
  hadPregnancyWithin3Years: boolean;
  received2TdInPriorPregnancy: boolean;
  td1Received: boolean;
  td1Date?: string;
  td2Received: boolean;
  td2Date?: string;
  tdBoosterReceived: boolean;
  tdBoosterDate?: string;
}): {
  recommendedDose: 'Td-1' | 'Td-2' | 'Td-Booster' | 'Tdap' | 'All Doses Documented' | 'Consult Doctor';
  estimatedDueDate: string;
  clinicalReason: string;
  clinicalReasonHi: string;
  officialGuideline: string;
  sourceUrl: string;
  isDoctorConfirmedRequired: boolean;
} {
  const today = new Date();

  // Rule 1: Prior pregnancy within 3 years with 2 documented Td/TT doses -> Only Td-Booster required
  if (params.hadPregnancyWithin3Years && params.received2TdInPriorPregnancy) {
    if (params.tdBoosterReceived) {
      return {
        recommendedDose: 'All Doses Documented',
        estimatedDueDate: params.tdBoosterDate || today.toISOString().split('T')[0],
        clinicalReason:
          'Td-Booster is already documented for this pregnancy. You are fully protected against maternal and neonatal tetanus according to MoHFW UIP guidelines.',
        clinicalReasonHi:
          'इस गर्भावस्था के लिए टीडी-बूस्टर दर्ज हो चुका है। आप और शिशु राष्ट्रीय टीकाकरण कार्यक्रम के अनुसार पूरी तरह सुरक्षित हैं।',
        officialGuideline: 'MoHFW India UIP National Schedule (Td-Booster protocol)',
        sourceUrl: 'https://nhm.gov.in',
        isDoctorConfirmedRequired: false,
      };
    } else {
      // Due early in pregnancy
      const boosterDue = new Date();
      boosterDue.setDate(boosterDue.getDate() + 3); // Simulated 3 days from now
      return {
        recommendedDose: 'Td-Booster',
        estimatedDueDate: boosterDue.toISOString().split('T')[0],
        clinicalReason:
          'Because you had a pregnancy within the last 3 years with 2 documented Td doses, you only require a single Td-Booster dose early in this pregnancy.',
        clinicalReasonHi:
          'पिछले 3 वर्षों में 2 टीडी खुराक प्राप्त होने के कारण इस गर्भावस्था में केवल 1 टीडी-बूस्टर खुराक आवश्यक है।',
        officialGuideline: 'MoHFW National UIP Guideline (Table 2: Maternal Td Prophylaxis)',
        sourceUrl: 'https://nhm.gov.in',
        isDoctorConfirmedRequired: true,
      };
    }
  }

  // Rule 2: Primigravida or no pregnancy within 3 years
  if (!params.td1Received) {
    // Td-1 is due as early as possible in pregnancy
    const td1Due = new Date();
    td1Due.setDate(td1Due.getDate() + 3); // 3 days lead
    return {
      recommendedDose: 'Td-1',
      estimatedDueDate: td1Due.toISOString().split('T')[0],
      clinicalReason:
        'Td-1 is recommended as soon as pregnancy is registered. It initiates maternal immunity against Clostridium tetani and adult diphtheria.',
      clinicalReasonHi:
        'टीडी-1 गर्भावस्था का पंजीकरण होते ही जितनी जल्दी हो सके लगवाना चाहिए। यह टिटनेस और डिप्थीरिया से रक्षा करता है।',
      officialGuideline: 'MoHFW India Universal Immunization Programme (UIP)',
      sourceUrl: 'https://nhm.gov.in',
      isDoctorConfirmedRequired: true,
    };
  }

  if (params.td1Received && !params.td2Received) {
    // Td-2 is strictly 4 weeks (28 days) after Td-1
    let td2DueDateStr = '';
    if (params.td1Date) {
      const [y, m, d] = params.td1Date.split('-').map(Number);
      const td2Date = new Date(y, m - 1, d);
      td2Date.setDate(td2Date.getDate() + 28);
      td2DueDateStr = td2Date.toISOString().split('T')[0];
    } else {
      const td2Date = new Date();
      td2Date.setDate(td2Date.getDate() + 14);
      td2DueDateStr = td2Date.toISOString().split('T')[0];
    }

    return {
      recommendedDose: 'Td-2',
      estimatedDueDate: td2DueDateStr,
      clinicalReason:
        'Td-2 must be administered at least 4 weeks after Td-1 and preferably at least 4 weeks before the expected delivery date to ensure sufficient IgG transplacental transfer.',
      clinicalReasonHi:
        'टीडी-2 पहली खुराक के ठीक 4 सप्ताह बाद लगवाना अनिवार्य है ताकि प्रसव से पूर्व शिशु में पर्याप्त सुरक्षात्मक एंटीबॉडीज पहुंच सकें।',
      officialGuideline: 'MoHFW India UIP & WHO MNTE Policy',
      sourceUrl: 'https://nhm.gov.in',
      isDoctorConfirmedRequired: true,
    };
  }

  // Rule 3: Third Trimester Tdap Option
  if (params.currentWeek >= 26 && params.currentWeek <= 36) {
    const tdapDue = new Date();
    tdapDue.setDate(tdapDue.getDate() + 7);
    return {
      recommendedDose: 'Tdap',
      estimatedDueDate: tdapDue.toISOString().split('T')[0],
      clinicalReason:
        'Between weeks 27 and 36, discuss Tdap (Tetanus, Diphtheria, Acellular Pertussis) with your OB-GYN. It transfers passive antibodies protecting your newborn against whooping cough (pertussis) during the first 2 months of life.',
      clinicalReasonHi:
        '27वें से 36वें सप्ताह के बीच Tdap टीके पर डॉक्टर से चर्चा करें। यह नवजात शिशु को काली खांसी (Whooping Cough) से बचाता है।',
      officialGuideline: 'ACOG Committee Opinion No. 718 & CDC ACIP Guidelines',
      sourceUrl: 'https://www.acog.org',
      isDoctorConfirmedRequired: true,
    };
  }

  return {
    recommendedDose: 'All Doses Documented',
    estimatedDueDate: today.toISOString().split('T')[0],
    clinicalReason: 'All scheduled maternal Td vaccination doses are marked as documented.',
    clinicalReasonHi: 'सभी अनुशंसित मातृ टीडी टीके विधिवत दर्ज हैं।',
    officialGuideline: 'MoHFW UIP National Schedule',
    sourceUrl: 'https://nhm.gov.in',
    isDoctorConfirmedRequired: false,
  };
}

// Initial smart reminders with realistic clinical dates matching the 3-day rule
export const INITIAL_SMART_REMINDERS: HealthReminder[] = [
  {
    id: 'rem_1',
    title: 'Maternal Td-2 Vaccination (4 Weeks Post Td-1)',
    titleHi: 'मातृ टीडी-2 टीकाकरण (टीडी-1 के 4 सप्ताह बाद)',
    titleTe: 'తల్లి Td-2 టీకా (Td-1 తీసుకున్న 4 వారాల తర్వాత)',
    category: 'vaccination',
    targetPerson: 'mother',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Exactly 3 days from now!
    dueTime: '10:00',
    isCompleted: false,
    whyShown:
      'Scheduled exactly 4 weeks after your verified Td-1 dose. Provides critical transplacental IgG antibody protection to safeguard baby against neonatal tetanus.',
    whyShownHi:
      'टीडी-1 के 4 सप्ताह बाद निर्धारित। यह नवजात शिशु को टिटनेस संक्रमण से बचाने के लिए प्लेसेंटा के माध्यम से सुरक्षात्मक एंटीबॉडीज पहुंचाता है।',
    whyShownTe:
      'మీ Td-1 తీసుకున్న 4 వారాల తర్వాత నిర్ణయించబడింది. ఇది పుట్టబోయే బిడ్డకు ధనుర్వాతం (టెటానస్) రాకుండా ప్లాసెంటా ద్వారా రక్షణను అందిస్తుంది.',
    clinicalSource: 'MoHFW India Universal Immunization Programme (UIP)',
    clinicalSourceUrl: 'https://nhm.gov.in',
    sourceVerifiedDate: '2024-06-15',
    isDoctorConfirmed: true,
    vaccineDoseCode: 'Td-2',
    notes: 'Carry Maternal and Child Protection (MCP) card to clinic.',
  },
  {
    id: 'rem_2',
    title: 'Routine Antenatal Care (ANC-3) & Blood Pressure Review',
    titleHi: 'नियमित प्रसवपूर्व जांच (ANC-3) एवं बीपी जांच',
    titleTe: 'సాధారణ ప్రసవపూర్వ తనిఖీ (ANC-3) & రక్తపోటు సమీక్ష',
    category: 'antenatal_checkup',
    targetPerson: 'mother',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Exactly 3 days from now!
    dueTime: '11:30',
    isCompleted: false,
    whyShown:
      'WHO and PMSMA standard 24-28 week contact. Evaluates symphysis-fundal height, maternal blood pressure for preeclampsia screening, and fetal heart auscultation.',
    whyShownHi:
      '24-28 सप्ताह पर डब्ल्यूएचओ मानक जांच। रक्तचाप, भ्रूण की धड़कन और गर्भस्थ शिशु की वृद्धि की जांच की जाती है।',
    whyShownTe:
      '24-28 వారాల వద్ద WHO మరియు PMSMA ప్రామాణిక తనిఖీ. ప్రీఎక్లాంప్సియా స్క్రీనింగ్ కొరకు రక్తపోటు మరియు శిశువు గుండె చప్పుడు పరిశీలిస్తారు.',
    clinicalSource: 'WHO Recommendations on Antenatal Care (2016/2020) & PMSMA India',
    clinicalSourceUrl: 'https://www.who.int/publications/i/item/9789241549912',
    sourceVerifiedDate: '2024-01-10',
    isDoctorConfirmed: true,
    notes: 'Dr. Priya Venkatesh at Cloudnine Maternity Hospital.',
  },
  {
    id: 'rem_3',
    title: 'Standardized 75g Oral Glucose Tolerance Test (OGTT) Lab Draw',
    titleHi: '75 ग्राम ओरल ग्लूकोज टॉलरेंस टेस्ट (OGTT) रक्त जांच',
    titleTe: '75 గ్రాముల ఓరల్ గ్లూకోజ్ టాలరెన్స్ టెస్ట్ (OGTT) రక్త పరీక్ష',
    category: 'medical_test',
    targetPerson: 'mother',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    dueTime: '08:00',
    isCompleted: false,
    whyShown:
      'Universal screening window (Weeks 24-28) to rule out Gestational Diabetes Mellitus (GDM) using WHO 75g criteria before symptoms emerge.',
    whyShownHi:
      'गर्भावस्था में शुगर (GDM) की जांच हेतु 24-28 सप्ताह में 75 ग्राम ग्लूकोज टेस्ट अनिवार्य है।',
    whyShownTe:
      'గర్భధారణ మధుమేహాన్ని (GDM) ప్రారంభంలోనే గుర్తించడానికి 24-28 వారాల మధ్య ఈ 75 గ్రాముల గ్లూకోజ్ పరీక్ష తప్పనిసరి.',
    clinicalSource: 'WHO 2018 Hyperglycaemia in Pregnancy Criteria & ICMR GDM Guidelines',
    clinicalSourceUrl: 'https://www.who.int/publications/i/item/9789241548687',
    sourceVerifiedDate: '2024-03-20',
    isDoctorConfirmed: true,
    notes: 'Requires 8-12 hours overnight fasting before morning blood draw.',
  },
  {
    id: 'rem_4',
    title: 'Newborn Birth Dose Immunization Reservation (BCG + OPV-0 + HepB-0)',
    titleHi: 'नवजात शिशु जन्म खुराक आरक्षण (बीसीजी + ओपीवी-0 + हेपेटाइटिस बी)',
    titleTe: 'నవజాత శిశువు జనన టీకా రిజర్వేషన్ (BCG + OPV-0 + HepB-0)',
    category: 'vaccination',
    targetPerson: 'baby',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Future EDD window
    dueTime: '09:00',
    isCompleted: false,
    whyShown:
      'Universal birth doses administered within 24-48 hours of delivery. BCG protects against severe disseminated tuberculosis and tubercular meningitis.',
    whyShownHi:
      'जन्म के 24-48 घंटों के भीतर अनिवार्य टीके। बीसीजी टीबी की गंभीर जटिलताओं से 80% तक सुरक्षा देता है।',
    whyShownTe:
      'డెలివరీ జరిగిన 24-48 గంటల్లో ఇచ్చే ప్రాథమిక టీకాలు. BCG టీకా శిశువును ప్రాణాంతక క్షయ (టీబీ) నుండి రక్షిస్తుంది.',
    clinicalSource: 'National Health Mission UIP Birth Dose Schedule',
    clinicalSourceUrl: 'https://nhm.gov.in',
    sourceVerifiedDate: '2024-05-12',
    isDoctorConfirmed: false,
    vaccineDoseCode: 'BCG',
    notes: 'Verify with hospital labor room staff during admission.',
  },
  {
    id: 'rem_5',
    title: 'Separated Daily Iron & Calcium Intake Reminder',
    titleHi: 'आयरन और कैल्शियम की खुराक में 2 घंटे का अंतर',
    titleTe: 'రోజువారీ ఐరన్ & కాల్షియం మాత్రల మధ్య 2 గంటల వ్యవధి',
    category: 'medication',
    targetPerson: 'mother',
    dueDate: new Date().toISOString().split('T')[0], // Today!
    dueTime: '09:00',
    isCompleted: true,
    completedDate: new Date().toISOString().split('T')[0],
    whyShown:
      'Taking Calcium with Iron drops intestinal iron absorption by up to 60%. Always maintain a strict 2-hour gap between doses.',
    whyShownHi:
      'कैल्शियम और आयरन को कभी एक साथ न लें। दोनों के बीच 2 घंटे का अंतर रखने से एनीमिया से बचाव होता है।',
    whyShownTe:
      'కాల్షియం మరియు ఐరన్ మాత్రలను ఒకేసారి తీసుకోవద్దు. రెండింటి మధ్య కనీసం 2 గంటల విరామం ఉండటం వల్ల ఐరన్ శోషణ 60% మెరుగవుతుంది.',
    clinicalSource: 'WHO Guidelines on Daily Iron and Folic Acid Supplementation in Pregnancy',
    clinicalSourceUrl: 'https://www.who.int',
    sourceVerifiedDate: '2024-02-01',
    isDoctorConfirmed: true,
    notes: 'Iron in morning with lemon water; Calcium at dinner.',
  },
];
