export interface WhoCurvePoint {
  month: number;
  sd2neg: number; // -2 SD (approx 3rd percentile)
  median: number; // 50th percentile
  sd2pos: number; // +2 SD (approx 97th percentile)
}

// WHO Child Growth Standards: Weight-for-age (kg) - Boys
export const WHO_WEIGHT_BOYS: WhoCurvePoint[] = [
  { month: 0, sd2neg: 2.5, median: 3.3, sd2pos: 4.4 },
  { month: 1, sd2neg: 3.4, median: 4.5, sd2pos: 5.8 },
  { month: 2, sd2neg: 4.3, median: 5.6, sd2pos: 7.1 },
  { month: 3, sd2neg: 5.0, median: 6.4, sd2pos: 8.0 },
  { month: 4, sd2neg: 5.6, median: 7.0, sd2pos: 8.7 },
  { month: 6, sd2neg: 6.4, median: 7.9, sd2pos: 9.8 },
  { month: 9, sd2neg: 7.1, median: 8.9, sd2pos: 11.0 },
  { month: 12, sd2neg: 7.7, median: 9.6, sd2pos: 12.0 },
  { month: 15, sd2neg: 8.3, median: 10.3, sd2pos: 12.8 },
  { month: 18, sd2neg: 8.8, median: 10.9, sd2pos: 13.7 },
  { month: 24, sd2neg: 9.7, median: 12.2, sd2pos: 15.3 },
  { month: 36, sd2neg: 11.3, median: 14.3, sd2pos: 18.3 },
  { month: 48, sd2neg: 12.7, median: 16.3, sd2pos: 21.2 },
  { month: 60, sd2neg: 14.1, median: 18.3, sd2pos: 24.2 },
];

// WHO Child Growth Standards: Weight-for-age (kg) - Girls
export const WHO_WEIGHT_GIRLS: WhoCurvePoint[] = [
  { month: 0, sd2neg: 2.4, median: 3.2, sd2pos: 4.2 },
  { month: 1, sd2neg: 3.2, median: 4.2, sd2pos: 5.5 },
  { month: 2, sd2neg: 3.9, median: 5.1, sd2pos: 6.6 },
  { month: 3, sd2neg: 4.5, median: 5.8, sd2pos: 7.5 },
  { month: 4, sd2neg: 5.0, median: 6.4, sd2pos: 8.2 },
  { month: 6, sd2neg: 5.7, median: 7.3, sd2pos: 9.3 },
  { month: 9, sd2neg: 6.5, median: 8.2, sd2pos: 10.5 },
  { month: 12, sd2neg: 7.0, median: 8.9, sd2pos: 11.5 },
  { month: 15, sd2neg: 7.6, median: 9.6, sd2pos: 12.4 },
  { month: 18, sd2neg: 8.1, median: 10.2, sd2pos: 13.2 },
  { month: 24, sd2neg: 9.0, median: 11.5, sd2pos: 14.8 },
  { month: 36, sd2neg: 10.8, median: 13.9, sd2pos: 18.1 },
  { month: 48, sd2neg: 12.3, median: 16.1, sd2pos: 21.5 },
  { month: 60, sd2neg: 13.7, median: 18.2, sd2pos: 24.9 },
];

// WHO Child Growth Standards: Length-for-age (cm) - Boys
export const WHO_LENGTH_BOYS: WhoCurvePoint[] = [
  { month: 0, sd2neg: 46.1, median: 49.9, sd2pos: 53.7 },
  { month: 1, sd2neg: 50.8, median: 54.7, sd2pos: 58.6 },
  { month: 2, sd2neg: 54.4, median: 58.4, sd2pos: 62.4 },
  { month: 3, sd2neg: 57.3, median: 61.4, sd2pos: 65.5 },
  { month: 4, sd2neg: 60.0, median: 63.9, sd2pos: 67.8 },
  { month: 6, sd2neg: 63.6, median: 67.6, sd2pos: 71.6 },
  { month: 9, sd2neg: 67.5, median: 72.0, sd2pos: 76.5 },
  { month: 12, sd2neg: 71.0, median: 75.7, sd2pos: 80.5 },
  { month: 15, sd2neg: 74.1, median: 79.1, sd2pos: 84.2 },
  { month: 18, sd2neg: 76.9, median: 82.3, sd2pos: 87.7 },
  { month: 24, sd2neg: 81.7, median: 87.8, sd2pos: 93.9 },
  { month: 36, sd2neg: 88.7, median: 96.1, sd2pos: 103.5 },
];

// WHO Child Growth Standards: Length-for-age (cm) - Girls
export const WHO_LENGTH_GIRLS: WhoCurvePoint[] = [
  { month: 0, sd2neg: 45.4, median: 49.1, sd2pos: 52.9 },
  { month: 1, sd2neg: 49.8, median: 53.7, sd2pos: 57.6 },
  { month: 2, sd2neg: 53.0, median: 57.1, sd2pos: 61.1 },
  { month: 3, sd2neg: 55.6, median: 59.8, sd2pos: 64.0 },
  { month: 4, sd2neg: 58.4, median: 62.1, sd2pos: 66.2 },
  { month: 6, sd2neg: 61.2, median: 65.7, sd2pos: 70.3 },
  { month: 9, sd2neg: 65.3, median: 70.1, sd2pos: 75.0 },
  { month: 12, sd2neg: 68.9, median: 74.0, sd2pos: 79.2 },
  { month: 15, sd2neg: 72.0, median: 77.5, sd2pos: 83.0 },
  { month: 18, sd2neg: 74.9, median: 80.7, sd2pos: 86.5 },
  { month: 24, sd2neg: 80.0, median: 86.4, sd2pos: 92.9 },
  { month: 36, sd2neg: 87.4, median: 95.1, sd2pos: 102.7 },
];

// WHO Child Growth Standards: Head Circumference-for-age (cm) - Boys
export const WHO_HEAD_CIRC_BOYS: WhoCurvePoint[] = [
  { month: 0, sd2neg: 32.1, median: 34.5, sd2pos: 36.9 },
  { month: 1, sd2neg: 35.1, median: 37.3, sd2pos: 39.5 },
  { month: 2, sd2neg: 37.0, median: 39.1, sd2pos: 41.2 },
  { month: 3, sd2neg: 38.3, median: 40.5, sd2pos: 42.6 },
  { month: 4, sd2neg: 39.4, median: 41.6, sd2pos: 43.7 },
  { month: 6, sd2neg: 41.0, median: 43.3, sd2pos: 45.4 },
  { month: 9, sd2neg: 42.6, median: 45.0, sd2pos: 47.1 },
  { month: 12, sd2neg: 43.8, median: 46.1, sd2pos: 48.3 },
  { month: 18, sd2neg: 45.2, median: 47.6, sd2pos: 49.8 },
  { month: 24, sd2neg: 46.1, median: 48.5, sd2pos: 50.8 },
];

// WHO Child Growth Standards: Head Circumference-for-age (cm) - Girls
export const WHO_HEAD_CIRC_GIRLS: WhoCurvePoint[] = [
  { month: 0, sd2neg: 31.7, median: 33.9, sd2pos: 36.1 },
  { month: 1, sd2neg: 34.3, median: 36.5, sd2pos: 38.6 },
  { month: 2, sd2neg: 36.0, median: 38.2, sd2pos: 40.2 },
  { month: 3, sd2neg: 37.2, median: 39.5, sd2pos: 41.5 },
  { month: 4, sd2neg: 38.3, median: 40.6, sd2pos: 42.6 },
  { month: 6, sd2neg: 39.9, median: 42.2, sd2pos: 44.3 },
  { month: 9, sd2neg: 41.5, median: 43.8, sd2pos: 45.9 },
  { month: 12, sd2neg: 42.6, median: 44.9, sd2pos: 47.1 },
  { month: 18, sd2neg: 44.0, median: 46.4, sd2pos: 48.7 },
  { month: 24, sd2neg: 45.0, median: 47.4, sd2pos: 49.7 },
];

/**
 * Calculates Chronological Age and Prematurity-Corrected Age.
 * Formula: Corrected Age = Chronological Age - (40 weeks - Gestational Age at birth).
 * AAP and WHO recommend using corrected age until 24-36 months of age for infants born < 37 weeks.
 */
export function calculateCorrectedAge(
  birthDateString: string,
  gestationalWeeksAtBirth: number = 40
): {
  chronologicalDays: number;
  chronologicalMonths: number;
  chronologicalDisplay: string;
  isPremature: boolean;
  weeksPremature: number;
  correctedMonths: number;
  correctedDisplay: string;
  explanation: string;
} {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  const diffTime = Math.max(0, today.getTime() - birthDate.getTime());
  const chronologicalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const chronologicalMonths = Number((chronologicalDays / 30.4375).toFixed(1));

  const isPremature = gestationalWeeksAtBirth < 37;
  const weeksPremature = Math.max(0, 40 - gestationalWeeksAtBirth);
  const daysAdjustment = weeksPremature * 7;
  const correctedDays = Math.max(0, chronologicalDays - daysAdjustment);
  const correctedMonths = Number((correctedDays / 30.4375).toFixed(1));

  const chronoYears = Math.floor(chronologicalMonths / 12);
  const chronoRemMonths = Math.floor(chronologicalMonths % 12);
  const chronoRemDays = Math.floor(chronologicalDays % 30.4375);

  let chronologicalDisplay = '';
  if (chronoYears > 0) {
    chronologicalDisplay = `${chronoYears}y ${chronoRemMonths}m`;
  } else if (chronologicalMonths >= 1) {
    chronologicalDisplay = `${Math.floor(chronologicalMonths)}m ${chronoRemDays}d`;
  } else {
    chronologicalDisplay = `${chronologicalDays} days`;
  }

  const corrYears = Math.floor(correctedMonths / 12);
  const corrRemMonths = Math.floor(correctedMonths % 12);
  let correctedDisplay = '';
  if (corrYears > 0) {
    correctedDisplay = `${corrYears}y ${corrRemMonths}m`;
  } else {
    correctedDisplay = `${correctedMonths} months`;
  }

  const explanation = isPremature
    ? `Born at ${gestationalWeeksAtBirth} weeks (${weeksPremature} weeks preterm). In accordance with WHO & AAP pediatric guidelines, growth percentiles and developmental expectations are assessed using corrected age (${correctedDisplay}) until 2 years of age to prevent false undergrowth classification.`
    : `Born at term (${gestationalWeeksAtBirth} weeks). Chronological age is used for standard WHO growth benchmarks.`;

  return {
    chronologicalDays,
    chronologicalMonths,
    chronologicalDisplay,
    isPremature,
    weeksPremature,
    correctedMonths,
    correctedDisplay,
    explanation,
  };
}

export function getGrowthAssessment(
  gender: 'boy' | 'girl',
  ageInMonths: number,
  weightKg: number
): { status: 'normal' | 'underweight' | 'high_weight'; interpretationEn: string; interpretationHi: string } {
  const table = gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
  let closest = table[0];
  let minDiff = 999;
  for (const point of table) {
    const diff = Math.abs(point.month - ageInMonths);
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }

  if (weightKg < closest.sd2neg) {
    return {
      status: 'underweight',
      interpretationEn: `Weight (${weightKg} kg) is below WHO standard -2 SD (${closest.sd2neg} kg; Median: ${closest.median} kg). A single reading is not diagnostic; consult your pediatrician to review growth trajectory and dietary intake.`,
      interpretationHi: `वजन (${weightKg} किग्रा) डब्ल्यूएचओ -2 एसडी सीमा (${closest.sd2neg} किग्रा, मध्यमान: ${closest.median} किग्रा) से कम है। बाल रोग विशेषज्ञ से विकास रुझान पर चर्चा करें।`,
    };
  } else if (weightKg > closest.sd2pos) {
    return {
      status: 'high_weight',
      interpretationEn: `Weight (${weightKg} kg) is above WHO +2 SD (97th percentile is ${closest.sd2pos} kg). In exclusively breastfed infants, this is often a healthy benign variation; monitor trajectory.`,
      interpretationHi: `वजन (${weightKg} किग्रा) डब्ल्यूएचओ +2 एसडी (अधिकतम ${closest.sd2pos} किग्रा) से ऊपर है। केवल स्तनपान करने वाले शिशुओं में यह प्रायः सामान्य होता है।`,
    };
  }

  return {
    status: 'normal',
    interpretationEn: `Optimal healthy growth! Weight (${weightKg} kg) aligns with WHO standards (-2 SD: ${closest.sd2neg} kg, Median: ${closest.median} kg, +2 SD: ${closest.sd2pos} kg).`,
    interpretationHi: `संतोषजनक विकास! वजन (${weightKg} किग्रा) डब्ल्यूएचओ मानकों (-2 एसडी: ${closest.sd2neg} किग्रा, मध्यमान: ${closest.median} किग्रा) के पूर्ण अनुकूल है।`,
  };
}
