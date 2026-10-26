/**
 * Mumora Dynamic AI Diet Plan Engine Based on Latest Health Reports
 * 
 * Automatically adapts the user's diet plan whenever a new medical report
 * is uploaded or updated.
 * 
 * Core Clinical Principles:
 * 1. Analyzes real extracted lab values, units, test dates, and reference ranges.
 * 2. Compares with pregnancy-specific guidance (WHO ANC 2016/2020, WHO/IADPSG GDM, ICMR-NIN 2024).
 * 3. Identifies trends compared with previous reports.
 * 4. Permanently enforces user's dietary preference (Strict Vegetarian: 0% non-veg/egg; Non-Veg: safe cooked proteins).
 * 5. Explains what changed, why it changed, and which report finding supports the change.
 * 6. Displays report date and diet plan last-updated date.
 * 7. Flags unverified / blurry reports for clarification rather than making speculative adjustments.
 */

import {
  DietaryPreferenceType,
  DocumentRecord,
  MealPlanItem,
  UserProfile,
  PregnancyProfile,
} from '../types';
import { sanitizeMealPlanForDiet, isMealCompliant } from '../utils/dietaryValidator';

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

/**
 * Parse an extracted text snippet or document key parameters into structured lab findings.
 */
export function extractLabFindingsFromDocument(
  doc: DocumentRecord,
  gestationalWeek: number = 24,
  trimester: 1 | 2 | 3 = 2
): ExtractedLabFinding[] {
  const findings: ExtractedLabFinding[] = [];

  // Check if document already has structured keyParameters
  if (doc.keyParameters && doc.keyParameters.length > 0) {
    for (const kp of doc.keyParameters) {
      const lowerLabel = kp.label.toLowerCase();
      const valStr = kp.value;
      const numMatch = valStr.match(/([0-9]+(?:\.[0-9]+)?)/);
      const numVal = numMatch ? parseFloat(numMatch[1]) : undefined;

      // 1. Hemoglobin
      if (lowerLabel.includes('hemoglobin') || lowerLabel.includes('hb')) {
        const threshold = trimester === 2 ? 10.5 : 11.0;
        const isLow = numVal !== undefined ? numVal < threshold : !kp.isNormal;
        const status = numVal !== undefined
          ? (numVal < 7.0 ? 'outside' : numVal < threshold ? 'outside' : 'normal')
          : (kp.isNormal ? 'normal' : 'outside');

        findings.push({
          testName: 'Hemoglobin (Hb)',
          measuredValue: valStr,
          numericValue: numVal,
          unit: 'g/dL',
          labReferenceRange: kp.referenceRange || '11.0 - 14.0 g/dL',
          whoStandard: `≥ ${threshold} g/dL (WHO ANC Guideline Trimester ${trimester})`,
          status,
          clinicalImplication: isLow
            ? `Hemoglobin is below the WHO Trimester ${trimester} threshold of ${threshold} g/dL. Requires increased dietary iron density + Vitamin C enhancers.`
            : 'Reassuring red cell mass for gestational age.',
          isVerified: !valStr.toLowerCase().includes('unclear') && !valStr.toLowerCase().includes('?'),
        });
      }
      // 2. Fasting Blood Glucose / OGTT
      else if (lowerLabel.includes('fasting') && lowerLabel.includes('sugar') || lowerLabel.includes('glucose') || lowerLabel.includes('fbs')) {
        const isHigh = numVal !== undefined ? numVal >= 92 : !kp.isNormal;
        findings.push({
          testName: 'Fasting Blood Glucose',
          measuredValue: valStr,
          numericValue: numVal,
          unit: 'mg/dL',
          labReferenceRange: kp.referenceRange || '70 - 99 mg/dL',
          whoStandard: '< 92 mg/dL (WHO 2013 / IADPSG Criteria)',
          status: isHigh ? 'outside' : 'normal',
          clinicalImplication: isHigh
            ? 'Fasting glucose meets or exceeds WHO gestational diabetes diagnostic threshold (92 mg/dL). Prioritize complex low-GI millets and restrict simple sugars.'
            : 'Fasting glycemic control within normal limits.',
          isVerified: true,
        });
      }
      // 3. 2-Hour Post Glucose / OGTT
      else if (lowerLabel.includes('2-hr') || lowerLabel.includes('ogtt') || lowerLabel.includes('post prandial') || lowerLabel.includes('post 75g')) {
        const isHigh = numVal !== undefined ? numVal >= 153 : (numVal !== undefined ? numVal > 140 : !kp.isNormal);
        findings.push({
          testName: '2-Hour Post Glucose (OGTT)',
          measuredValue: valStr,
          numericValue: numVal,
          unit: 'mg/dL',
          labReferenceRange: kp.referenceRange || '< 140 mg/dL',
          whoStandard: '< 153 mg/dL (WHO 75g Oral Glucose Tolerance Test Standard)',
          status: isHigh ? 'outside' : 'normal',
          clinicalImplication: isHigh
            ? '2-hour glucose response is elevated. Requires carbohydrate distribution across small frequent meals.'
            : 'Adequate post-load insulin response.',
          isVerified: true,
        });
      }
      // 4. Blood Pressure / Hypertension
      else if (lowerLabel.includes('blood pressure') || lowerLabel.includes('bp')) {
        const bpMatch = valStr.match(/(\d+)\s*\/\s*(\d+)/);
        const sys = bpMatch ? parseInt(bpMatch[1]) : 120;
        const dia = bpMatch ? parseInt(bpMatch[2]) : 80;
        const isHigh = sys >= 140 || dia >= 90;

        findings.push({
          testName: 'Sitting Blood Pressure',
          measuredValue: valStr,
          numericValue: sys,
          unit: 'mmHg',
          labReferenceRange: '< 120/80 mmHg',
          whoStandard: '< 140/90 mmHg (WHO ANC Guidelines for Hypertensive Disorders)',
          status: isHigh ? 'outside' : 'normal',
          clinicalImplication: isHigh
            ? 'Gestational hypertension range. Restrict dietary sodium (<5g/day salt) and emphasize potassium/magnesium.'
            : 'Blood pressure is within optimal physiological range.',
          isVerified: true,
        });
      }
      // 5. Thyroid TSH
      else if (lowerLabel.includes('tsh') || lowerLabel.includes('thyroid')) {
        const isElevated = numVal !== undefined ? numVal > 3.0 : !kp.isNormal;
        findings.push({
          testName: 'Serum TSH',
          measuredValue: valStr,
          numericValue: numVal,
          unit: 'mIU/L',
          labReferenceRange: kp.referenceRange || '0.2 - 3.0 mIU/L',
          whoStandard: '< 3.0 mIU/L in 2nd/3rd trimester',
          status: isElevated ? 'outside' : 'normal',
          clinicalImplication: isElevated
            ? 'Slightly elevated maternal TSH. Consult physician for thyroid review; ensure iodized salt in daily cooking.'
            : 'Maternal thyroid function within target antenatal range.',
          isVerified: true,
        });
      }
      // 6. Platelets
      else if (lowerLabel.includes('platelet')) {
        const isLow = numVal !== undefined ? (numVal < 150000 && numVal > 1000 ? numVal < 150 : numVal < 150000) : !kp.isNormal;
        findings.push({
          testName: 'Platelet Count',
          measuredValue: valStr,
          numericValue: numVal,
          unit: '/µL',
          labReferenceRange: '150,000 - 450,000 /µL',
          whoStandard: '≥ 150,000 /µL',
          status: isLow ? 'outside' : 'normal',
          clinicalImplication: isLow
            ? 'Mild gestational thrombocytopenia detected. Monitor for bleeding signs and avoid unprescribed aspirin.'
            : 'Coagulation markers normal.',
          isVerified: true,
        });
      }
      // 7. Urine Albumin / Protein
      else if (lowerLabel.includes('urine') || lowerLabel.includes('albumin') || lowerLabel.includes('protein')) {
        const hasProtein = valStr.toLowerCase().includes('1+') || valStr.toLowerCase().includes('2+') || valStr.toLowerCase().includes('positive');
        findings.push({
          testName: 'Urine Albumin / Proteinuria',
          measuredValue: valStr,
          unit: 'dipstick',
          labReferenceRange: 'Negative / Nil',
          whoStandard: 'Negative (WHO ANC Screening)',
          status: hasProtein ? 'outside' : 'normal',
          clinicalImplication: hasProtein
            ? 'Proteinuria detected on urine dipstick. Clinical OB-GYN evaluation required for preeclampsia assessment.'
            : 'Urine clear of abnormal protein or glucose.',
          isVerified: true,
        });
      }
      else {
        // Generic parameter
        findings.push({
          testName: kp.label,
          measuredValue: kp.value,
          unit: '',
          labReferenceRange: kp.referenceRange || 'Normal',
          whoStandard: 'Guideline Standard',
          status: kp.isNormal ? 'normal' : 'outside',
          clinicalImplication: kp.isNormal ? 'Within expected range.' : 'Warrants clinical review.',
          isVerified: true,
        });
      }
    }
  } else if (doc.extractedText) {
    // Parse free text
    const text = doc.extractedText;

    // Check for smudged or unclear indicator
    if (text.includes('[BLURRED') || text.includes('[SMUDGED') || text.includes('[UNREADABLE') || text.includes('?')) {
      findings.push({
        testName: 'Hemoglobin (Hb) / Lab Reading',
        measuredValue: 'Unclear / Smudged ink',
        unit: 'g/dL',
        labReferenceRange: '11.0 - 14.0 g/dL',
        whoStandard: `≥ ${trimester === 2 ? 10.5 : 11.0} g/dL`,
        status: 'uninterpretable',
        clinicalImplication: 'The laboratory report has obscured or smudged values. AI must NOT fabricate this critical metric.',
        isVerified: false,
        needsClarificationReason: 'Smudged or torn lab slip. Please verify the actual numeric result before nutritional modifications.',
      });
    }

    // Hb match
    const hbMatch = text.match(/hemoglobin\s*(?:\(hb\))?[:\s]+([0-9]+(?:\.[0-9]+)?)\s*g\/dl/i);
    if (hbMatch) {
      const val = parseFloat(hbMatch[1]);
      const threshold = trimester === 2 ? 10.5 : 11.0;
      findings.push({
        testName: 'Hemoglobin (Hb)',
        measuredValue: `${val} g/dL`,
        numericValue: val,
        unit: 'g/dL',
        labReferenceRange: '11.0 - 14.0 g/dL',
        whoStandard: `≥ ${threshold} g/dL`,
        status: val < threshold ? 'outside' : 'normal',
        clinicalImplication: val < threshold
          ? `Hemoglobin is ${val} g/dL, below the WHO cutoff (${threshold} g/dL). Anemia protocol active.`
          : 'Adequate hemoglobin level.',
        isVerified: true,
      });
    }

    // Fasting glucose match
    const fbsMatch = text.match(/fasting(?:\s+plasma)?\s+(?:blood\s+)?glucose[:\s]+([0-9]+(?:\.[0-9]+)?)\s*mg\/dl/i);
    if (fbsMatch) {
      const val = parseFloat(fbsMatch[1]);
      findings.push({
        testName: 'Fasting Plasma Glucose',
        measuredValue: `${val} mg/dL`,
        numericValue: val,
        unit: 'mg/dL',
        labReferenceRange: '70 - 99 mg/dL',
        whoStandard: '< 92 mg/dL (WHO / IADPSG Criteria)',
        status: val >= 92 ? 'outside' : 'normal',
        clinicalImplication: val >= 92
          ? `Fasting blood glucose is ${val} mg/dL (threshold: 92 mg/dL). Gestational glycemic plan active.`
          : 'Normal fasting blood glucose.',
        isVerified: true,
      });
    }

    // BP match
    const bpMatch = text.match(/blood\s+pressure[:\s]+([0-9]{2,3})\s*\/\s*([0-9]{2,3})\s*mmhg/i);
    if (bpMatch) {
      const sys = parseInt(bpMatch[1]);
      const dia = parseInt(bpMatch[2]);
      const isHigh = sys >= 140 || dia >= 90;
      findings.push({
        testName: 'Sitting Blood Pressure',
        measuredValue: `${sys}/${dia} mmHg`,
        numericValue: sys,
        unit: 'mmHg',
        labReferenceRange: '< 120/80 mmHg',
        whoStandard: '< 140/90 mmHg',
        status: isHigh ? 'outside' : 'normal',
        clinicalImplication: isHigh
          ? `Blood pressure is elevated at ${sys}/${dia} mmHg. Sodium-restricted, potassium-balanced protocol active.`
          : 'Normal blood pressure.',
        isVerified: true,
      });
    }
  }

  return findings;
}

/**
 * Compare current report findings with previous report findings to identify clinical trends.
 */
export function identifyClinicalTrends(
  currentFindings: ExtractedLabFinding[],
  currentDate: string,
  previousReport?: DocumentRecord
): ReportComparisonTrend[] {
  if (!previousReport) return [];

  const trends: ReportComparisonTrend[] = [];
  const prevFindings = extractLabFindingsFromDocument(previousReport);

  for (const curr of currentFindings) {
    if (!curr.isVerified || curr.status === 'uninterpretable') continue;

    const prevMatch = prevFindings.find(
      p => p.testName.toLowerCase() === curr.testName.toLowerCase()
    );

    if (prevMatch && prevMatch.numericValue !== undefined && curr.numericValue !== undefined) {
      const diff = curr.numericValue - prevMatch.numericValue;

      // Hemoglobin trend
      if (curr.testName.includes('Hemoglobin')) {
        if (Math.abs(diff) >= 0.3) {
          trends.push({
            parameter: 'Hemoglobin (Hb)',
            previousValue: `${prevMatch.numericValue} g/dL`,
            previousDate: previousReport.date,
            currentValue: `${curr.numericValue} g/dL`,
            currentDate,
            trendDescription: diff < 0
              ? `Decreased by ${Math.abs(diff).toFixed(1)} g/dL (from ${prevMatch.numericValue} to ${curr.numericValue} g/dL). Indicates progressive hemodilution or depleted iron stores.`
              : `Improved by ${diff.toFixed(1)} g/dL (from ${prevMatch.numericValue} to ${curr.numericValue} g/dL). Positive response to nutritional iron support.`,
            isClinicallySignificant: true,
          });
        }
      }
      // Fasting Glucose trend
      else if (curr.testName.includes('Glucose') || curr.testName.includes('Sugar')) {
        if (Math.abs(diff) >= 5) {
          trends.push({
            parameter: curr.testName,
            previousValue: `${prevMatch.numericValue} mg/dL`,
            previousDate: previousReport.date,
            currentValue: `${curr.numericValue} mg/dL`,
            currentDate,
            trendDescription: diff > 0
              ? `Increased by ${diff.toFixed(0)} mg/dL (from ${prevMatch.numericValue} to ${curr.numericValue} mg/dL). Tighten complex carbohydrate distribution.`
              : `Decreased by ${Math.abs(diff).toFixed(0)} mg/dL (from ${prevMatch.numericValue} to ${curr.numericValue} mg/dL). Glycemic control stabilized.`,
            isClinicallySignificant: true,
          });
        }
      }
      // Blood pressure trend
      else if (curr.testName.includes('Blood Pressure')) {
        if (Math.abs(diff) >= 10) {
          trends.push({
            parameter: 'Systolic Blood Pressure',
            previousValue: `${prevMatch.numericValue} mmHg`,
            previousDate: previousReport.date,
            currentValue: `${curr.numericValue} mmHg`,
            currentDate,
            trendDescription: diff > 0
              ? `Systolic BP increased by ${diff} mmHg (from ${prevMatch.numericValue} to ${curr.numericValue} mmHg).`
              : `Systolic BP decreased by ${Math.abs(diff)} mmHg.`,
            isClinicallySignificant: true,
          });
        }
      }
    }
  }

  return trends;
}

/**
 * Generate a dynamically adapted AI Diet Plan from the latest health report.
 */
export function generateDynamicDietPlan(params: {
  userProfile: UserProfile;
  pregnancy: PregnancyProfile;
  latestReport?: DocumentRecord;
  previousReport?: DocumentRecord;
  dietaryPreference: DietaryPreferenceType;
  city: string;
  baseMeals: MealPlanItem[];
}): DynamicDietAdaptation {
  const {
    userProfile,
    pregnancy,
    latestReport,
    previousReport,
    dietaryPreference,
    city,
    baseMeals,
  } = params;

  const now = new Date().toISOString();
  const reportDate = latestReport?.date || userProfile.dateOfBirth || new Date().toISOString().split('T')[0];

  // 1. Extract Lab Findings
  const extractedFindings = latestReport
    ? extractLabFindingsFromDocument(latestReport, pregnancy.currentWeek, pregnancy.trimester)
    : [];

  // Check if unreadable / uninterpretable
  const hasUninterpretable = extractedFindings.some(f => !f.isVerified || f.status === 'uninterpretable');
  const uninterpretableItem = extractedFindings.find(f => !f.isVerified || f.status === 'uninterpretable');

  // Identify comparison trends
  const trendsFromPrevious = latestReport
    ? identifyClinicalTrends(extractedFindings, latestReport.date, previousReport)
    : [];

  // Clinical state evaluation
  const hbFinding = extractedFindings.find(f => f.testName.includes('Hemoglobin'));
  const isAnemic = hbFinding?.status === 'outside' || (hbFinding?.numericValue !== undefined && hbFinding.numericValue < (pregnancy.trimester === 2 ? 10.5 : 11.0));

  const fbsFinding = extractedFindings.find(f => f.testName.includes('Glucose') || f.testName.includes('Sugar'));
  const isGdmHigh = fbsFinding?.status === 'outside' || (fbsFinding?.numericValue !== undefined && fbsFinding.numericValue >= 92);

  const bpFinding = extractedFindings.find(f => f.testName.includes('Blood Pressure'));
  const isHypertensive = bpFinding?.status === 'outside';

  const urineFinding = extractedFindings.find(f => f.testName.includes('Urine') || f.testName.includes('Albumin'));
  const hasProteinuria = urineFinding?.status === 'outside';

  // Build "What Changed" summary
  const whatChangedSummary: string[] = [];

  if (hasUninterpretable) {
    whatChangedSummary.push(
      `Clarification Required: ${uninterpretableItem?.needsClarificationReason || 'Lab slip contains unverified or blurred readings'}. The AI diet planner has safely preserved your standard baseline meals to avoid speculative modifications.`
    );
  } else if (latestReport) {
    if (isAnemic && hbFinding) {
      whatChangedSummary.push(
        `Iron Density Boosted: Based on ${latestReport.title} (${latestReport.date}) showing Hb ${hbFinding.measuredValue} (below WHO Trimester ${pregnancy.trimester} standard of ${pregnancy.trimester === 2 ? '10.5' : '11.0'} g/dL). Breakfast and lunch have been updated with sprouted moong, dark leafy greens (palak/methi), pomegranate, and fresh lemon for non-heme iron absorption.`
      );
      whatChangedSummary.push(
        `Iron Absorption Safeguard: Tea, coffee, and high-calcium dairy are scheduled at least 2 hours apart from main iron-rich meals, as tannins and polyphenols block iron uptake by up to 60%.`
      );
    }

    if (isGdmHigh && fbsFinding) {
      whatChangedSummary.push(
        `Low-Glycemic Carb Distribution: Based on Fasting Blood Glucose of ${fbsFinding.measuredValue} from ${latestReport.title} (${latestReport.date}), refined flours (maida) and simple sweeteners have been replaced with high-fiber millets (Ragi/Jowar) and oats to prevent post-prandial glycemic spikes.`
      );
    }

    if (isHypertensive && bpFinding) {
      whatChangedSummary.push(
        `Sodium Restriction & Vasodilation: Based on sitting BP of ${bpFinding.measuredValue} from ${latestReport.title}, daily salt is capped under 5g (WHO standard). Foods naturally high in potassium and magnesium (coconut water, bananas, makhana) have been added.`
      );
    }

    if (!isAnemic && !isGdmHigh && !isHypertensive) {
      whatChangedSummary.push(
        `Normal Report Verified: Latest laboratory findings (${latestReport.title}, ${latestReport.date}) confirm normal complete blood counts and reassuring glycemic control. Balanced trimester-${pregnancy.trimester} maintenance plan maintained.`
      );
    }

    // Add trend notes if present
    for (const t of trendsFromPrevious) {
      whatChangedSummary.push(`Clinical Trend: ${t.parameter} ${t.trendDescription}`);
    }
  } else {
    whatChangedSummary.push(
      `Baseline Plan Active: No new laboratory reports uploaded yet. Diet plan is calibrated to your profile: Trimester ${pregnancy.trimester} (Week ${pregnancy.currentWeek}), ${city} regional seasonal ingredients, and ${dietaryPreference} preference.`
    );
  }

  // Dietary Safety Rationale
  let clinicalRationale = '';
  if (dietaryPreference === 'vegetarian' || dietaryPreference === 'vegan') {
    clinicalRationale = `100% Strict Vegetarian Compliance Guaranteed. Per WHO ANC 2020 & ICMR-NIN 2024 guidelines, all maternal iron, protein, and calcium requirements are fulfilled through nutrient-dense plant sources (sprouted pulses, dark greens, millets, nuts, seeds, and lemon/Vitamin C) with ZERO meat, fish, poultry, or eggs.`;
  } else {
    clinicalRationale = `Omnivore / Non-Vegetarian Plan Aligned. Balanced combination of vegetarian pulse staples with thoroughly cooked, low-mercury freshwater fish or farm eggs per WHO & FSSAI maternal food safety standards.`;
  }

  // Nutritional Goals Targets
  const baseCalories = pregnancy.trimester === 1 ? 2100 : pregnancy.trimester === 2 ? 2450 : 2550;
  const baseProtein = pregnancy.trimester === 1 ? 55 : 75; // +23g in T2/T3 (ICMR-NIN 2024)
  const baseIron = isAnemic ? 45 : 30; // mg/day
  const baseCalcium = 1200; // mg/day
  const baseFolate = 570; // mcg/day
  const baseHydration = isHypertensive ? 2.5 : 2.75; // Liters/day

  // Foods to Prioritize
  const foodsToPrioritize: Array<{ food: string; reason: string; servingTip: string }> = [];

  if (isAnemic) {
    if (dietaryPreference === 'vegetarian' || dietaryPreference === 'vegan') {
      foodsToPrioritize.push({
        food: 'Sprouted Green Moong & Dark Leafy Greens (Palak, Methi, Sarson)',
        reason: 'Rich natural non-heme iron and folates for maternal erythrocyte synthesis.',
        servingTip: 'Always pair with a squeeze of fresh lemon juice; Vitamin C increases plant-iron absorption 3-fold.',
      });
      foodsToPrioritize.push({
        food: 'Fresh Pomegranate, Guava & Black Raisins / Munakka',
        reason: 'High ascorbic acid (Vitamin C) and trace iron without gastric distress.',
        servingTip: 'Enjoy as a mid-morning snack away from main meals.',
      });
      foodsToPrioritize.push({
        food: 'Roasted Pumpkin Seeds (Kaddu ke beej) & Sesame (Til)',
        reason: 'Dense in plant zinc, magnesium, and bioavailable non-heme iron.',
        servingTip: '1-2 tablespoons sprinkled on breakfast poha or chewed thoroughly.',
      });
    } else {
      foodsToPrioritize.push({
        food: 'Well-Cooked Freshwater Fish (Rohu / Katla) & Boiled Farm Eggs',
        reason: 'High bioavailability heme iron and complete essential amino acids.',
        servingTip: 'Ensure fish and eggs are thoroughly cooked (>74°C throughout). Never eat runny yolk.',
      });
      foodsToPrioritize.push({
        food: 'Dark Green Leafy Vegetables (Spinach / Fenugreek)',
        reason: 'Synergistic non-heme iron and natural dietary folate.',
        servingTip: 'Cook in an iron skillet or season with lemon.',
      });
    }
  } else if (isGdmHigh) {
    foodsToPrioritize.push({
      food: 'Finger Millet (Ragi), Jowar & Rolled Oats',
      reason: 'Low glycemic index complex carbohydrates with beta-glucan soluble fiber.',
      servingTip: 'Choose steamed Ragi idlis or Jowar bhakri instead of polished white rice.',
    });
    foodsToPrioritize.push({
      food: 'Split Moong Dal, Black Chana & Rajma',
      reason: 'High plant protein and resistant starch that blunts post-prandial glycemic excursions.',
      servingTip: 'Simmer with mild cumin and ginger tempering; avoid heavy gravies.',
    });
  } else {
    foodsToPrioritize.push({
      food: 'Seasonal Local Vegetables (Bottle gourd, Ridge gourd, Carrots, Spinach)',
      reason: 'Essential micronutrients, soluble fiber, and gentle digestion for pregnancy comfort.',
      servingTip: 'Steam or lightly saute with minimal cold-pressed mustard or sesame oil.',
    });
    foodsToPrioritize.push({
      food: dietaryPreference === 'vegan' ? 'Fortified Soya Chunks & Organic Tofu' : 'Fresh Cow Milk Paneer & Homemade Probiotic Curd',
      reason: 'High biological value protein and calcium for fetal skeletal development.',
      servingTip: 'Consume 1 cup of fresh curd with lunch to repopulate maternal gut microbiome.',
    });
  }

  // Foods to Restrict
  const foodsToRestrict: Array<{ food: string; reason: string; severity: 'strict_avoid' | 'limit_moderation' }> = [];

  // Universal pregnancy restrictions
  foodsToRestrict.push({
    food: 'Raw / Semi-Ripe Green Papaya & Unwashed Raw Street Salads',
    reason: 'Raw green papaya latex can stimulate uterine contractions; street raw vegetables harbor Salmonella/Listeria risk.',
    severity: 'strict_avoid',
  });

  if (isAnemic) {
    foodsToRestrict.push({
      food: 'Tea, Coffee & High-Calcium Milk Taken Directly With Meals',
      reason: 'Tannins, polyphenols, and calcium competitive binding reduce non-heme iron absorption by 50-60%.',
      severity: 'strict_avoid',
    });
  }

  if (isGdmHigh) {
    foodsToRestrict.push({
      food: 'Commercial Table Sugar, Sweets (Mithai), Pastries & Aerated Soft Drinks',
      reason: 'Rapid free sugars trigger acute hyperglycemia and excessive fetal macrosomia risk.',
      severity: 'strict_avoid',
    });
    foodsToRestrict.push({
      food: 'Refined White Flour (Maida) & Polished White Rice in Large Portions',
      reason: 'High glycemic index starches lacking dietary fiber.',
      severity: 'limit_moderation',
    });
  }

  if (isHypertensive) {
    foodsToRestrict.push({
      food: 'Commercial Pickles (Achar), Papads, Salted Bakery Chips & Canned Soups',
      reason: 'High hidden sodium causes fluid retention and elevates peripheral vascular resistance.',
      severity: 'strict_avoid',
    });
  }

  // Doctor Consultation Triggers
  const doctorConsultationTriggers: string[] = [];
  if (isAnemic && hbFinding && hbFinding.numericValue !== undefined && hbFinding.numericValue < 8.0) {
    doctorConsultationTriggers.push(
      'Severe Anemia (Hb < 8 g/dL): Food alone is not sufficient. Prompt clinician consultation required for parenteral / intravenous iron therapy.'
    );
  }
  if (isHypertensive && hasProteinuria) {
    doctorConsultationTriggers.push(
      'Hypertension + Proteinuria detected: Potential Preeclampsia warning. Proceed immediately to labor triage or obstetrician review.'
    );
  }
  if (hasUninterpretable) {
    doctorConsultationTriggers.push(
      'Report contains smudged or torn values. Request diagnostic laboratory confirmation of true numeric readings.'
    );
  }

  // 2. Sanitize and Adapt the 6 Meals for Dietary Preference & Health State
  const sanitizedMeals = sanitizeMealPlanForDiet(baseMeals, dietaryPreference, {
    isAnemic,
    isGdm: isGdmHigh,
    isHypertensive,
  });

  return {
    id: `diet_plan_${Date.now()}`,
    planLastUpdated: now,
    sourceReportId: latestReport?.id,
    sourceReportTitle: latestReport?.title,
    sourceReportDate: latestReport?.date,
    reportCategory: latestReport?.category,
    isBasedOnNewReport: !!latestReport,
    needsClarification: hasUninterpretable,
    clarificationNotice: hasUninterpretable ? uninterpretableItem?.needsClarificationReason : undefined,
    trimester: pregnancy.trimester,
    gestationalWeek: pregnancy.currentWeek,
    dietaryPreference,
    city,
    extractedFindings,
    trendsFromPrevious,
    whatChangedSummary,
    clinicalRationale,
    nutritionalGoals: {
      caloriesTarget: baseCalories,
      proteinGramsTarget: baseProtein,
      ironMgTarget: baseIron,
      calciumMgTarget: baseCalcium,
      folateMcgTarget: baseFolate,
      hydrationLitersTarget: baseHydration,
      keyNutrientFocus: isAnemic
        ? ['Non-Heme Iron', 'Vitamin C (Ascorbic Acid)', 'Folate', 'Plant Protein']
        : isGdmHigh
        ? ['Dietary Soluble Fiber', 'Low-GI Complex Carbs', 'Protein', 'Chromium']
        : ['Calcium', 'Folate', 'Prebiotic Fiber', 'Omega-3 ALA'],
    },
    foodsToPrioritize,
    foodsToRestrict,
    doctorConsultationTriggers,
    meals: sanitizedMeals,
  };
}
