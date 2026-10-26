export interface VaccineScheduleItem {
  key: string;
  name: string;
  nameHi: string;
  targetAge: string;
  targetAgeHi: string;
  targetWeeks: number;
  diseasesPrevented: string;
  diseasesPreventedHi: string;
  isMandatoryNationalUIP: boolean;
  notes: string;
}

export const NATIONAL_VACCINATION_SCHEDULE: VaccineScheduleItem[] = [
  {
    key: "birth_bcg",
    name: "BCG",
    nameHi: "बीसीजी (BCG)",
    targetAge: "At Birth (Within 24-48 hrs)",
    targetAgeHi: "जन्म के समय (24-48 घंटों के भीतर)",
    targetWeeks: 0,
    diseasesPrevented: "Tuberculosis (TB)",
    diseasesPreventedHi: "तपेदिक (टीबी) और ट्यूबरकुलर मेनिन्जाइटिस",
    isMandatoryNationalUIP: true,
    notes: "Given intradermally on left upper arm; leaves a small lifelong scar."
  },
  {
    key: "birth_hepb",
    name: "Hepatitis B (Birth Dose)",
    nameHi: "हेपेटाइटिस बी (जन्म खुराक)",
    targetAge: "At Birth (Within 24 hrs)",
    targetAgeHi: "जन्म के 24 घंटे के भीतर",
    targetWeeks: 0,
    diseasesPrevented: "Hepatitis B liver infection",
    diseasesPreventedHi: "हेपेटाइटिस बी (यकृत संक्रमण)",
    isMandatoryNationalUIP: true,
    notes: "Crucial within 24 hours of birth to prevent perinatal transmission."
  },
  {
    key: "birth_opv0",
    name: "OPV 0 (Oral Polio Vaccine)",
    nameHi: "ओपीवी 0 (पोलियो ड्रॉप्स)",
    targetAge: "At Birth",
    targetAgeHi: "जन्म के समय",
    targetWeeks: 0,
    diseasesPrevented: "Poliomyelitis",
    diseasesPreventedHi: "पोलियोमाइलाइटिस (लकवा)",
    isMandatoryNationalUIP: true,
    notes: "Two oral drops administered immediately after birth."
  },
  {
    key: "week6_penta1",
    name: "Pentavalent 1 (DTP + Hep B + Hib)",
    nameHi: "पेंटावेलेंट 1 (DTP + हेप बी + हिब)",
    targetAge: "6 Weeks",
    targetAgeHi: "6 सप्ताह (डेढ़ महीना)",
    targetWeeks: 6,
    diseasesPrevented: "Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae b",
    diseasesPreventedHi: "गलघोंटू, काली खांसी, टिटनेस, हेपेटाइटिस बी, निमोनिया/मेनिन्जाइटिस",
    isMandatoryNationalUIP: true,
    notes: "Single combination injection in the anterolateral thigh."
  },
  {
    key: "week6_rota1",
    name: "Rotavirus Vaccine (RVV 1)",
    nameHi: "रोटावायरस टीका 1",
    targetAge: "6 Weeks",
    targetAgeHi: "6 सप्ताह (डेढ़ महीना)",
    targetWeeks: 6,
    diseasesPrevented: "Severe Rotavirus Diarrhea",
    diseasesPreventedHi: "गंभीर दस्त और निर्जलीकरण (डायरिया)",
    isMandatoryNationalUIP: true,
    notes: "Oral liquid drops."
  },
  {
    key: "week6_pcv1",
    name: "Pneumococcal Conjugate (PCV 1)",
    nameHi: "पीसीवी 1 (न्यूमोकोकल)",
    targetAge: "6 Weeks",
    targetAgeHi: "6 सप्ताह (डेढ़ महीना)",
    targetWeeks: 6,
    diseasesPrevented: "Pneumococcal pneumonia, bacteremia & meningitis",
    diseasesPreventedHi: "न्यूमोकोकल निमोनिया और दिमागी बुखार",
    isMandatoryNationalUIP: true,
    notes: "Intramuscular injection."
  },
  {
    key: "week10_penta2",
    name: "Pentavalent 2 & Rota 2",
    nameHi: "पेंटावेलेंट 2 और रोटावायरस 2",
    targetAge: "10 Weeks",
    targetAgeHi: "10 सप्ताह (ढाई महीने)",
    targetWeeks: 10,
    diseasesPrevented: "DTP, Hepatitis B, Hib, Rotavirus",
    diseasesPreventedHi: "पांच जानलेवा बीमारियां और रोटावायरस दस्त",
    isMandatoryNationalUIP: true,
    notes: "Second primary dose."
  },
  {
    key: "week14_penta3",
    name: "Pentavalent 3, Rota 3, PCV 2 & fIPV 1",
    nameHi: "पेंटावेलेंट 3, रोटा 3, पीसीवी 2 और एफ-आईपीवी",
    targetAge: "14 Weeks",
    targetAgeHi: "14 सप्ताह (साढ़े तीन महीने)",
    targetWeeks: 14,
    diseasesPrevented: "Complete Primary Infantile Immunization",
    diseasesPreventedHi: "शिशु कालीन प्राथमिक सुरक्षा",
    isMandatoryNationalUIP: true,
    notes: "Completes the primary infant 3-dose series."
  },
  {
    key: "month6_flu1",
    name: "Influenza (Flu) Dose 1",
    nameHi: "इन्फ्लूएंजा (फ्लू) टीका",
    targetAge: "6 Months",
    targetAgeHi: "6 महीने",
    targetWeeks: 26,
    diseasesPrevented: "Seasonal Influenza virus",
    diseasesPreventedHi: "मौसमी स्वाइन फ्लू और गंभीर श्वसन संक्रमण",
    isMandatoryNationalUIP: false,
    notes: "Recommended by Indian Academy of Pediatrics (IAP)."
  },
  {
    key: "month9_mr1",
    name: "MR 1 (Measles & Rubella) + Vit A + PCV Booster",
    nameHi: "एमआर 1 (खसरा-रूबेला) + विटामिन ए + पीसीवी बूस्टर",
    targetAge: "9-12 Months",
    targetAgeHi: "9-12 महीने",
    targetWeeks: 39,
    diseasesPrevented: "Measles, Rubella congenital defects, Vitamin A deficiency",
    diseasesPreventedHi: "खसरा (मीजल्स), रूबेला और रतौंधी से बचाव",
    isMandatoryNationalUIP: true,
    notes: "Combined with 100,000 IU oral Vitamin A syrup."
  },
  {
    key: "month15_mmr1",
    name: "MMR / Varicella (Chickenpox)",
    nameHi: "एमएमआर और चिकनपॉक्स (माता) टीका",
    targetAge: "15 Months",
    targetAgeHi: "15 महीने (सवा साल)",
    targetWeeks: 65,
    diseasesPrevented: "Measles, Mumps, Rubella, Chickenpox",
    diseasesPreventedHi: "कण्ठमाला (गलसुआ), खसरा और छोटी माता",
    isMandatoryNationalUIP: false,
    notes: "Protects against childhood mumps and varicella."
  },
  {
    key: "month18_dtp_boost",
    name: "DTP Booster 1 & IPV Booster",
    nameHi: "डीटीपी बूस्टर 1 और पोलियो बूस्टर",
    targetAge: "16-24 Months",
    targetAgeHi: "16-24 महीने (डेढ़ से दो साल)",
    targetWeeks: 78,
    diseasesPrevented: "Diphtheria, Tetanus, Pertussis waning immunity",
    diseasesPreventedHi: "काली खांसी और टिटनेस की पुनः सुरक्षा",
    isMandatoryNationalUIP: true,
    notes: "First booster dose for toddlerhood protection."
  },
  {
    key: "year5_dtp_boost2",
    name: "DTP Booster 2",
    nameHi: "डीटीपी बूस्टर 2 (स्कूल प्रवेश टीका)",
    targetAge: "5-6 Years",
    targetAgeHi: "5-6 वर्ष",
    targetWeeks: 260,
    diseasesPrevented: "Tetanus, Diphtheria, Pertussis school age immunity",
    diseasesPreventedHi: "स्कूल जाने की उम्र में टिटनेस और डिप्थीरिया सुरक्षा",
    isMandatoryNationalUIP: true,
    notes: "Pre-school booster before entering primary school."
  }
];

export function calculateVaccineDueDates(birthDateStr: string) {
  const birth = new Date(birthDateStr);
  return NATIONAL_VACCINATION_SCHEDULE.map(vac => {
    const dueDate = new Date(birth);
    dueDate.setDate(dueDate.getDate() + vac.targetWeeks * 7);
    return {
      ...vac,
      dueDateFormatted: dueDate.toISOString().split('T')[0],
      isOverdue: new Date() > dueDate,
    };
  });
}
