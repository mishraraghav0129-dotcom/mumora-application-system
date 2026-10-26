export interface WeekDetail {
  week: number;
  trimester: 1 | 2 | 3;
  fruitEn: string;
  fruitHi: string;
  lengthCm: number;
  weightGrams: number;
  babyDevelopmentEn: string;
  babyDevelopmentHi: string;
  momChangesEn: string;
  momChangesHi: string;
  careTipEn: string;
  careTipHi: string;
  scanMilestoneEn?: string;
  scanMilestoneHi?: string;
}

export const PREGNANCY_WEEKS: WeekDetail[] = [
  {
    week: 4,
    trimester: 1,
    fruitEn: "Poppy Seed",
    fruitHi: "खसखस का दाना",
    lengthCm: 0.1,
    weightGrams: 0.04,
    babyDevelopmentEn: "Blastocyst implants into the uterine lining. The amniotic sac and placenta begin developing to nourish the embryo.",
    babyDevelopmentHi: "भ्रूण गर्भाशय की दीवार से जुड़ता है। एमनियोटिक थैली और प्लेसेंटा का निर्माण शुरू होता है।",
    momChangesEn: "Missed period, mild cramping, light implantation spotting may occur. Home pregnancy test turns positive.",
    momChangesHi: "मासिक धर्म रुकना, हल्की ऐंठन। प्रेग्नेंसी टेस्ट किट में पॉजिटिव परिणाम।",
    careTipEn: "Start taking 5mg or 400mcg Folic Acid daily as prescribed by your doctor to prevent neural tube defects.",
    careTipHi: "न्यूरल ट्यूब दोष से बचाव के लिए डॉक्टर की सलाह से फोलिक एसिड लेना तुरंत शुरू करें।"
  },
  {
    week: 8,
    trimester: 1,
    fruitEn: "Raspberry",
    fruitHi: "रसभरी",
    lengthCm: 1.6,
    weightGrams: 1.1,
    babyDevelopmentEn: "Tiny fingers, toes, eyelids, and nose tip are forming. Heart is beating at 150-170 beats per minute.",
    babyDevelopmentHi: "नन्हीं उंगलियां, पलकें और नाक का सिरा बन रहा है। हृदय 150-170 धड़कन प्रति मिनट से धड़क रहा है।",
    momChangesEn: "Morning sickness, nausea, tender breasts, fatigue, and heightened sense of smell.",
    momChangesHi: "सुबह की मितली (Morning Sickness), स्तनों में संवेदनशीलता, अत्यधिक थकान।",
    careTipEn: "Eat small, frequent meals. Ginger tea and roasted gram (chana) can help ease morning nausea.",
    careTipHi: "थोड़े-थोड़े अंतराल पर हल्का भोजन करें। अदरक और भुना चना मितली को शांत करने में मददगार है।",
    scanMilestoneEn: "Viability / Dating Scan to confirm heartbeat and exact gestational age.",
    scanMilestoneHi: "हार्टबीट और सटीक उम्र जानने के लिए डेटिंग सोनोग्राफी।"
  },
  {
    week: 12,
    trimester: 1,
    fruitEn: "Lime / Plum",
    fruitHi: "नींबू / आलूबुखारा",
    lengthCm: 5.4,
    weightGrams: 14,
    babyDevelopmentEn: "All vital organs, bones, and reflexes are formed. Baby can curl toes and open mouth.",
    babyDevelopmentHi: "सभी मुख्य अंग बन चुके हैं। बच्चा उंगलियां मोड़ सकता है और मुंह खोल सकता है।",
    momChangesEn: "Placenta is now producing hormones; morning sickness usually starts subsiding. Uterus moves up from the pelvis.",
    momChangesHi: "उल्टी व मितली कम होने लगती है। ऊर्जा का स्तर धीरे-धीरे सुधरता है।",
    careTipEn: "Time for your first trimester screening: NT (Nuchal Translucency) scan and Double Marker blood test.",
    careTipHi: "एंटी स्कैन (NT Scan) और डबल मार्कर रक्त परीक्षण कराने का उपयुक्त समय।",
    scanMilestoneEn: "NT / Nuchal Translucency Scan (11-13 weeks).",
    scanMilestoneHi: "11-13 सप्ताह की एंटी सोनोग्राफी (डाउन सिंड्रोम स्क्रीनिंग)।"
  },
  {
    week: 16,
    trimester: 2,
    fruitEn: "Avocado",
    fruitHi: "एवोकाडो",
    lengthCm: 11.6,
    weightGrams: 100,
    babyDevelopmentEn: "Baby's eyes can sense light. Tiny facial expressions and sucking reflexes are developing.",
    babyDevelopmentHi: "आंखें प्रकाश के प्रति संवेदनशील हो रही हैं। चेहरे के भाव और चूसने की क्रिया विकसित होती है।",
    momChangesEn: "Baby bump starts showing. The 'pregnancy glow' appears due to increased blood flow. Mild backache may begin.",
    momChangesHi: "पेट का उभार (Baby Bump) दिखने लगता है। चेहरे पर प्रेगनेंसी का निखार और हल्की पीठ दर्द।",
    careTipEn: "Begin Iron and Calcium supplementation as prescribed (never take iron and calcium together; keep a 2-hour gap).",
    careTipHi: "डॉक्टर द्वारा दी गई आयरन और कैल्शियम की दवाएं लें (दोनों को एक साथ न लें, 2 घंटे का अंतर रखें)।"
  },
  {
    week: 20,
    trimester: 2,
    fruitEn: "Banana",
    fruitHi: "केला",
    lengthCm: 25.6,
    weightGrams: 300,
    babyDevelopmentEn: "Vernix caseosa (protective creamy coating) covers the skin. Baby can hear your heartbeat and muffled voice.",
    babyDevelopmentHi: "त्वचा पर वर्निक्स की परत बनती है। बच्चा आपकी आवाज और दिल की धड़कन सुन सकता है।",
    momChangesEn: "You reach the halfway mark! You may feel the first flutter of baby movement (Quickening).",
    momChangesHi: "गर्भावस्था का आधा सफर पूरा! आप बच्चे की पहली हल्की हलचल (Quickening) महसूस कर सकती हैं।",
    careTipEn: "Crucial TIFFA / Anomaly Scan is performed between weeks 18-20 to examine all organ systems.",
    careTipHi: "अंगों की विस्तृत जांच के लिए 18-20 सप्ताह के बीच टिफा (TIFFA / Anomaly) सोनोग्राफी करवाएं।",
    scanMilestoneEn: "Level-II / TIFFA (Targeted Imaging for Fetal Anomalies) Scan.",
    scanMilestoneHi: "लेवल-2 टिफा सोनोग्राफी (संपूर्ण शारीरिक संरचना जांच)।"
  },
  {
    week: 24,
    trimester: 2,
    fruitEn: "Papaya / Corn",
    fruitHi: "पपीता / भुट्टा",
    lengthCm: 30.0,
    weightGrams: 600,
    babyDevelopmentEn: "Lungs begin producing surfactant, a substance that helps the air sacs inflate. Taste buds and eyebrows are distinct.",
    babyDevelopmentHi: "फेफड़ों में सर्फेक्टेंट का निर्माण शुरू। स्वाद कलिकाएं और भौंहें स्पष्ट हो रही हैं।",
    momChangesEn: "Mild swelling (edema) in ankles, Braxton Hicks 'practice contractions', possible heartburn/acidity.",
    momChangesHi: "पैरों में हल्की सूजन, पेट में कभी-कभार खिंचाव (ब्रैक्सटन हिक्स), सीने में जलन।",
    careTipEn: "Oral Glucose Tolerance Test (OGTT) is recommended between 24-28 weeks to screen for Gestational Diabetes.",
    careTipHi: "जेस्टेशनल डायबिटीज (गर्भावस्था में शुगर) की जांच के लिए OGTT टेस्ट जरूर करवाएं।",
    scanMilestoneEn: "Gestational Diabetes (OGTT 75g) screening.",
    scanMilestoneHi: "ओजीटीटी ब्लड शुगर स्क्रीनिंग।"
  },
  {
    week: 28,
    trimester: 3,
    fruitEn: "Eggplant",
    fruitHi: "बैंगन",
    lengthCm: 37.6,
    weightGrams: 1000,
    babyDevelopmentEn: "Welcome to the 3rd Trimester! Baby opens eyes and blinks. Rapid brain tissue development is underway.",
    babyDevelopmentHi: "तीसरी तिमाही शुरू! बच्चा आंखें खोल और झपका सकता है। मस्तिष्क का तेजी से विकास।",
    momChangesEn: "Shortness of breath as the growing uterus presses against the diaphragm. Sleep disruption is common.",
    momChangesHi: "गर्भाशय बड़ा होने से सांस फूलना। रात में करवट बदलने में असहजता।",
    careTipEn: "Start counting fetal kicks daily! Count 10 movements within a 2-hour window when resting on your left side.",
    careTipHi: "रोजाना किक काउंट (किक काउंटर) शुरू करें: बाईं करवट लेटकर 2 घंटे में 10 हलचलें सामान्य हैं।"
  },
  {
    week: 32,
    trimester: 3,
    fruitEn: "Japaense Melon / Squash",
    fruitHi: "खरबूजा",
    lengthCm: 42.4,
    weightGrams: 1700,
    babyDevelopmentEn: "Baby practices breathing motions. Fingernails and toenails are completely formed. Body fat accumulates.",
    babyDevelopmentHi: "बच्चा सांस लेने का अभ्यास कर रहा है। नाखूनों का पूर्ण विकास और चर्बी जमा होना।",
    momChangesEn: "Pelvic pressure increases. Frequent urination returns as the baby's head presses on the bladder.",
    momChangesHi: "पेल्विक हिस्से में भारीपन और बार-बार पेशाब आने की इच्छा।",
    careTipEn: "Growth scan and Doppler study to check fetal growth trajectory, amniotic fluid (AFI), and placental blood flow.",
    careTipHi: "ग्रोथ स्कैन और डॉपलर से एमनियोटिक पानी (AFI) और बच्चे का वजन जांचें।",
    scanMilestoneEn: "Third Trimester Growth & Fetal Doppler Scan.",
    scanMilestoneHi: "तीसरी तिमाही ग्रोथ एवं डॉपलर सोनोग्राफी।"
  },
  {
    week: 36,
    trimester: 3,
    fruitEn: "Papaya / Winter Melon",
    fruitHi: "बड़ा पपीता / पेठा",
    lengthCm: 47.4,
    weightGrams: 2600,
    babyDevelopmentEn: "Baby sheds lanugo (fine body hair) and vernix. The baby settles head-down into the pelvis (cephalic presentation).",
    babyDevelopmentHi: "बच्चा सिर नीचे की स्थिति (Cephalic) में आने लगता है। फेफड़े लगभग परिपक्व हो चुके हैं।",
    momChangesEn: "Lightening (baby drops), making breathing easier but increasing pelvic pressure and walking difficulty.",
    momChangesHi: "बच्चा पेल्विस में नीचे उतरता है जिससे सांस लेना आसान लेकिन चलने में भारीपन होता है।",
    careTipEn: "Pack your hospital bag! Keep government IDs, hospital registration, baby clothes, maternity pads ready.",
    careTipHi: "हॉस्पिटल बैग तैयार रखें! आधार कार्ड, मेडिकल फाइल, बच्चे और मां के कपड़े व्यवस्थित करें।"
  },
  {
    week: 40,
    trimester: 3,
    fruitEn: "Watermelon",
    fruitHi: "तरबूज",
    lengthCm: 51.2,
    weightGrams: 3400,
    babyDevelopmentEn: "Full-term and ready to meet the world! Strong grasp reflex, firm bones, and fully matured lungs.",
    babyDevelopmentHi: "पूर्ण विकसित! दुनिया में आने के लिए तैयार। पकड़ने की मजबूत क्षमता और परिपक्व फेफड़े।",
    momChangesEn: "Cervix effaces and dilates. Mucus plug (bloody show) may release. True labor contractions begin.",
    momChangesHi: "गर्भाशय का मुंह खुलना, म्यूकस प्लग निकलना और प्रसव पीड़ा (Labor Contractions) शुरू होना।",
    careTipEn: "Watch for the 5-1-1 rule: Contractions 5 minutes apart, lasting 1 minute each, for at least 1 hour. Time to go to the hospital!",
    careTipHi: "5-1-1 नियम का ध्यान रखें: यदि संकुचन हर 5 मिनट में आए, 1 मिनट तक रहे और 1 घंटे से चल रहा हो, तो तुरंत अस्पताल जाएं।"
  }
];

export function getWeekData(week: number): WeekDetail {
  const match = PREGNANCY_WEEKS.find(w => w.week === week);
  if (match) return match;

  // Find nearest
  const sorted = [...PREGNANCY_WEEKS].sort((a, b) => Math.abs(a.week - week) - Math.abs(b.week - week));
  return sorted[0];
}

export function calculatePregnancyProgress(lmpDateStr: string) {
  const lmp = new Date(lmpDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lmp.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const currentWeek = Math.min(42, Math.max(1, Math.floor(diffDays / 7)));
  const currentDay = diffDays % 7;
  
  // Naegele's rule for EDD: LMP + 280 days (40 weeks)
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280);

  const daysRemaining = Math.max(0, Math.floor((edd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const percentComplete = Math.min(100, Math.round((diffDays / 280) * 100));

  let trimester: 1 | 2 | 3 = 1;
  if (currentWeek >= 28) trimester = 3;
  else if (currentWeek >= 13) trimester = 2;

  return {
    currentWeek,
    currentDay,
    trimester,
    daysRemaining,
    percentComplete,
    eddFormatted: edd.toISOString().split('T')[0],
  };
}
