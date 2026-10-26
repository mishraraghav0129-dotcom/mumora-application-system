import {
  DietaryPreferenceType,
  MealPlanItem,
  LocalDishEvaluation,
  FoodAlternativeItem,
  GroceryItem,
  ClinicalReferenceCitation,
} from '../types';
import { sanitizeMealPlanForDiet } from '../utils/dietaryValidator';


export const WHO_NUTRITION_REFERENCES: ClinicalReferenceCitation[] = [
  {
    id: 'ref-who-healthy-diet-2020',
    title: 'WHO Healthy Diet Fact Sheet No. 394 & Global Strategy on Diet',
    issuingOrganization: 'World Health Organization (WHO)',
    publicationYear: '2020 (Continuous)',
    relevantSection: 'Dietary Diversity, Micronutrients, Free Sugars < 5-10% of Total Energy, and Salt < 5g/day',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    isOfficialGuideline: true,
    clinicalSummary: 'Mandates at least 400g (5 portions) of fruits and vegetables daily, whole grains, pulses, healthy unsaturated fats, less than 5g iodized salt per day, and eliminating industrially produced trans-fats.',
  },
  {
    id: 'ref-who-anc-nutrition-2016',
    title: 'WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience: Nutritional Interventions',
    issuingOrganization: 'World Health Organization (WHO)',
    publicationYear: '2016 (Reaffirmed 2020)',
    relevantSection: 'Maternal Dietary Counselling, Daily Iron (30-60mg) + Folic Acid (400mcg), and Energy/Protein Balance',
    url: 'https://www.who.int/publications/i/item/9789241549912',
    isOfficialGuideline: true,
    clinicalSummary: 'Recommends balanced energy and protein supplementation in undernourished populations. Cautions against high-protein supplementation. Daily iron and folic acid is universal.',
  },
  {
    id: 'ref-who-iycf-2023',
    title: 'WHO Guidelines on Infant and Young Child Feeding (IYCF) & Complementary Feeding',
    issuingOrganization: 'World Health Organization (WHO)',
    publicationYear: '2023',
    relevantSection: 'Exclusive Breastfeeding 0-6 Months & Safe Nutrient-Dense Complementary Foods',
    url: 'https://www.who.int/publications/i/item/9789240081864',
    isOfficialGuideline: true,
    clinicalSummary: 'Strictly mandates exclusive breastfeeding for the first 6 months. Introduction of safe, hygienic, nutrient-rich complementary feeding at 6 months while continuing breastfeeding up to 2 years or beyond. Honey is contraindicated under 12 months (Infant Botulism).',
  },
  {
    id: 'ref-icmr-nin-2024',
    title: 'ICMR-National Institute of Nutrition (NIN) Dietary Guidelines for Indians',
    issuingOrganization: 'ICMR',
    publicationYear: '2024 (Revised)',
    relevantSection: 'Guideline 4 & 5: Nutrient Requirements for Pregnant and Lactating Women & Regional Foods',
    url: 'https://www.nin.res.in',
    isOfficialGuideline: true,
    clinicalSummary: 'Recommends additional 350 kcal/day in 2nd and 3rd trimesters, additional 23g protein/day, diversity through traditional millets (Ragi, Jowar, Bajra), pulses, green leafy vegetables, and limiting ultra-processed packaged snacks.',
  },
  {
    id: 'ref-fssai-pink-book',
    title: 'FSSAI Pink Book: Your Guide for Safe & Nutritious Food at Home (Maternal & Infant Chapter)',
    issuingOrganization: 'MoHFW India',
    publicationYear: '2021',
    relevantSection: 'Pregnancy Food Hygiene, Avoiding Raw Sprouts, Unpasteurized Dairy, and Listeria Prevention',
    url: 'https://fssai.gov.in',
    isOfficialGuideline: true,
    clinicalSummary: 'Strict precautions for pregnant mothers: wash raw vegetables thoroughly; avoid street pani-puri/ice; boil milk to 100°C; avoid unpasteurized cheeses; cook eggs/meat until steaming hot throughout (>74°C).',
  },
];

export const REGIONAL_FOOD_DATABASE: LocalDishEvaluation[] = [
  // LUCKNOW & AWADH
  {
    id: 'dish-lko-dal-tadka',
    dishName: 'Awadhi Arhar / Moong Dal Tadka with Jeera',
    dishNameHi: 'अवधी अरहर / मूँग दाल तड़का जीरा के साथ',
    cityRegion: 'Lucknow',
    cuisine: 'Awadhi / North Indian',
    famousFor: 'Comforting Lucknow homestyle staple with hing, cumin, and mild cow ghee.',
    status: 'suitable',
    statusLabel: 'Suitable in a reasonable portion',
    statusLabelHi: 'उचित मात्रा में पूरी तरह उपयुक्त',
    clinicalReason:
      'Lentils provide high dietary protein, folate, and prebiotic fiber. Jeera and hing aid digestive comfort, helping alleviate pregnancy bloating.',
    clinicalReasonHi:
      'दाल प्रोटीन, फोलिक एसिड और फाइबर से भरपूर है। जीरा और हींग पाचन क्रिया को सुगम बनाते हैं और गैस से राहत देते हैं।',
    portionTip: '1 medium bowl (150-180g) with 1-2 multigrain or phulka rotis.',
    healthyModification: 'Use 1 teaspoon of pure cow ghee for tempering; avoid burnt garlic or heavy chili oil.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: [],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'],
    whoGuidelineAlignment: 'WHO Healthy Diet: High plant protein and dietary pulse intake.',
  },
  {
    id: 'dish-lko-galouti-kebab',
    dishName: 'Lucknow Galouti / Shami Kebab (Soya or Minced Meat)',
    dishNameHi: 'लखनऊ गलौटी / शामी कबाब (सोया या मटन)',
    cityRegion: 'Lucknow',
    cuisine: 'Awadhi',
    famousFor: 'Famous melt-in-the-mouth Awadhi delicacy made with raw papaya tenderizer and fragrant spices.',
    status: 'suitable_with_modifications',
    statusLabel: 'Suitable with modifications',
    statusLabelHi: 'सावधानी व संशोधन के साथ उपयुक्त',
    clinicalReason:
      'Commercial street versions may use raw green papaya (which contains concentrated latex/papain contraindicated in pregnancy) or excessive hydrogenated fat. Homestyle version made without raw papaya and pan-seared with minimal oil is rich in protein and bioavailable iron.',
    clinicalReasonHi:
      'बाजार के कबाब में कच्चा पपीता (कच्चे पपीते का लेटेक्स गर्भाशय संकुचन प्रेरित कर सकता है) या अत्यधिक डालडा हो सकता है। घर पर बना, कम तेल में सिका हुआ कबाब सुरक्षित और प्रोटीन युक्त है।',
    portionTip: '1 to 2 medium pan-roasted patties accompanied by mint yogurt dip.',
    healthyModification:
      'Ensure meat is cooked thoroughly to 74°C (never rare or pink inside). For vegetarians/vegans, use spiced rajma, black chana, or roasted soya mash with no raw papaya paste.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: true,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: ['Soy'],
    },
    dietSuitability: ['non_vegetarian', 'vegetarian', 'eggetarian'],
    whoGuidelineAlignment: 'FSSAI Food Safety: Thorough thermal processing of all animal proteins to eliminate Toxoplasma and Salmonella.',
  },
  {
    id: 'dish-lko-sheermal',
    dishName: 'Lucknow Sheermal (Saffron Sweet Flatbread)',
    dishNameHi: 'लखनऊ शीरमाल (केसर युक्त मीठी रोटी)',
    cityRegion: 'Lucknow',
    cuisine: 'Awadhi',
    famousFor: 'Traditional saffron-flavored baked sweet flatbread made with refined flour (maida), milk, and sugar.',
    status: 'limit_or_alternative',
    statusLabel: 'Limit or choose an alternative',
    statusLabelHi: 'सीमित मात्रा में लें या स्वस्थ विकल्प चुनें',
    clinicalReason:
      'Made primarily of refined flour (maida), refined sugar, and saturated fat. This can trigger acute glycemic spikes, particularly concerning for gestational diabetes or excessive gestational weight gain.',
    clinicalReasonHi:
      'मैदा, चीनी और वसा की अधिकता के कारण यह ब्लड शुगर तेजी से बढ़ा सकता है। जेस्टेशनल डायबिटीज में इससे बचना बेहतर है।',
    portionTip: 'A quarter slice for cultural taste, or swap with whole wheat tandoori roti.',
    healthyModification: 'Substitute with whole wheat roti brushed with a drop of saffron milk.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: true,
      deepFriedRisk: false,
      potentialAllergens: ['Dairy', 'Gluten'],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian'],
    whoGuidelineAlignment: 'WHO Diet Standard: Restrict free sugars and ultra-refined starches.',
  },

  // PUNJAB & DELHI NCR
  {
    id: 'dish-pun-sarson-saag',
    dishName: 'Punjab Sarson ka Saag with Makki Di Roti',
    dishNameHi: 'सरसों का साग एवं मक्के की रोटी',
    cityRegion: 'Punjab',
    cuisine: 'Punjabi',
    famousFor: 'Iconic winter staple cooked with mustard leaves, spinach, bathua, and cornmeal flatbread.',
    status: 'suitable',
    statusLabel: 'Suitable in a reasonable portion',
    statusLabelHi: 'उचित मात्रा में पूरी तरह उपयुक्त',
    clinicalReason:
      'Exceptional source of non-heme iron, natural folates, dietary fiber, calcium, and Vitamin A. Makki (maize flour) provides complex carbohydrates with low glycemic index.',
    clinicalReasonHi:
      'आयरन, फोलिक एसिड, कैल्शियम और विटामिन ए का उत्तम स्रोत। मक्के की रोटी जटिल कार्बोहाइड्रेट प्रदान करती है जो पाचन को सुगम बनाती है।',
    portionTip: '1 bowl saag (150g) with 1 medium makki roti. Keep white butter (makhan) to 1 teaspoon.',
    healthyModification: 'Pair with a squeeze of fresh lemon (Vitamin C) to quadruple non-heme iron absorption.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: ['Mustard'],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'],
    whoGuidelineAlignment: 'WHO ANC 2020 & ICMR: Rich natural dietary folate and iron for maternal red blood cell synthesis.',
  },
  {
    id: 'dish-delhi-pani-puri',
    dishName: 'Street Chaat & Pani Puri / Golgappa',
    dishNameHi: 'सड़क किनारे की पानी पूरी / गोलगप्पे',
    cityRegion: 'Delhi NCR',
    cuisine: 'North Indian Street Food',
    famousFor: 'Crisp semolina or wheat spheres filled with potato, chickpeas, and flavored mint water.',
    status: 'avoid_safety_reason',
    statusLabel: 'Avoid for a specific safety or medical reason',
    statusLabelHi: 'विशिष्ट सुरक्षा कारण से पूरी तरह बचें',
    clinicalReason:
      'High risk of waterborne bacterial and parasitic pathogens (E. coli, Salmonella, Entamoeba histolytica, Hepatitis A/E). Street ice and non-potable water can cause severe gastroenteritis, dehydration, and obstetric complications.',
    clinicalReasonHi:
      'सड़क किनारे के पानी और बर्फ से टाइफाइड, पीलिया (हेपेटाइटिस ई) और दस्त का गंभीर खतरा रहता है। गर्भावस्था में निर्जलीकरण (Dehydration) अत्यधिक जोखिमपूर्ण है।',
    portionTip: 'Strictly avoid street carts during pregnancy.',
    healthyModification:
      'Prepare safely at home using 100% boiled/filtered water, roasted boiled chickpeas, and baked whole wheat puris.',
    safetyCheck: {
      pregnancySafe: false,
      isRawOrUndercookedRisk: true,
      highSodiumOrSugarRisk: true,
      deepFriedRisk: true,
      potentialAllergens: ['Gluten'],
    },
    dietSuitability: ['vegetarian', 'vegan', 'eggetarian', 'non_vegetarian'],
    whoGuidelineAlignment: 'WHO Five Keys to Safer Food & FSSAI: Avoid unverified street water sources during antenatal care.',
  },
  {
    id: 'dish-pun-dal-makhani',
    dishName: 'Punjabi Dal Makhani (Heavy Cream & Butter)',
    dishNameHi: 'पंजाबी दाल मखनी (अत्यधिक मक्खन व मलाई)',
    cityRegion: 'Punjab',
    cuisine: 'Punjabi',
    famousFor: 'Slow-cooked whole black urad lentils and kidney beans finished with copious cream and butter.',
    status: 'suitable_with_modifications',
    statusLabel: 'Suitable with modifications',
    statusLabelHi: 'संशोधन के साथ उपयुक्त',
    clinicalReason:
      'Black urad and rajma provide excellent protein and iron, but restaurant preparations often load 30-40% saturated dairy fat, worsening pregnancy heartburn (acid reflux) and slowing gastric emptying.',
    clinicalReasonHi:
      'उड़द और राजमा प्रोटीन के अच्छे स्रोत हैं, परंतु अत्यधिक मक्खन व क्रीम से सीने में जलन (Heartburn) और अपच हो सकती है।',
    portionTip: 'Half a cup prepared at home with low-fat curd or milk instead of heavy commercial cream.',
    healthyModification: 'Replace heavy cream with whisked low-fat curd or skimmed milk; temper with cumin and tomato puree.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: ['Dairy'],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian'],
    whoGuidelineAlignment: 'WHO Dietary Standard: Replace saturated fats with whole food nutrient density.',
  },

  // SOUTH INDIA (Bengaluru, Chennai, Hyderabad)
  {
    id: 'dish-south-idli-sambar',
    dishName: 'Steamed Ragi / Rice Idli with Vegetable Sambar',
    dishNameHi: 'भाप में पकी रागी / चावल इडली एवं सब्जी सांभर',
    cityRegion: 'Bengaluru',
    cuisine: 'South Indian',
    famousFor: 'Fermented, steamed wholesome staple with lentil-vegetable stew.',
    status: 'suitable',
    statusLabel: 'Suitable in a reasonable portion',
    statusLabelHi: 'उचित मात्रा में पूरी तरह उपयुक्त',
    clinicalReason:
      'Natural fermentation synthesizes Vitamin B12 and increases bioavailability of iron and zinc. Zero oil steamed cooking is extremely gentle on digestion and prevents nausea or heartburn.',
    clinicalReasonHi:
      'किण्वन (Fermentation) से विटामिन बी और पाचन शक्ति बढ़ती है। बिना तेल की भाप में बनी इडली उल्टी व मितली में अत्यंत सुपाच्य है।',
    portionTip: '2-3 medium idlis with 1 large bowl of drumstick, pumpkin, and carrot sambar.',
    healthyModification: 'Choose Ragi (Finger Millet) Idli for 3x higher calcium and lower glycemic index.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: [],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'],
    whoGuidelineAlignment: 'WHO Healthy Diet: Steamed, fermented whole food with high micronutrient bioavailability.',
  },
  {
    id: 'dish-south-ragi-mudde',
    dishName: 'Karnataka Ragi Mudde with Soppina Saaru (Greens Curry)',
    dishNameHi: 'कर्नाटक रागी मुड्डे एवं सोप्पीना सारु (साग करी)',
    cityRegion: 'Bengaluru',
    cuisine: 'South Indian / Karnataka',
    famousFor: 'Traditional steamed finger millet ball served with wild green leafy vegetable broth.',
    status: 'suitable',
    statusLabel: 'Suitable in a reasonable portion',
    statusLabelHi: 'उचित मात्रा में पूरी तरह उपयुक्त',
    clinicalReason:
      'Ragi is India’s richest dietary cereal source of calcium (344 mg per 100g), essential for fetal skeletal ossification and maternal bone preservation. Extremely low glycemic index.',
    clinicalReasonHi:
      'रागी कैल्शियम का सबसे समृद्ध स्रोत है (शिशु की हड्डियों और दांतों के निर्माण हेतु अनिवार्य)। यह ब्लड शुगर को स्थिर रखता है।',
    portionTip: '1 small mudde ball (100g) swallowed in small morsels with greens broth.',
    healthyModification: 'Traditional preparation is already optimal; keep chili and tamarind moderate in the saaru.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: [],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'],
    whoGuidelineAlignment: 'ICMR-NIN & WHO: Optimal indigenous calcium and dietary fiber powerhouse.',
  },
  {
    id: 'dish-south-filter-coffee',
    dishName: 'Traditional South Indian Filter Coffee',
    dishNameHi: 'पारंपरिक साउथ इंडियन फिल्टर कॉफी',
    cityRegion: 'Bengaluru',
    cuisine: 'South Indian',
    famousFor: 'Strong brewed chicory-coffee decoction frothed with boiled whole milk.',
    status: 'suitable_with_modifications',
    statusLabel: 'Suitable with modifications',
    statusLabelHi: 'मात्रा सीमा के साथ उपयुक्त',
    clinicalReason:
      'WHO and ACOG guidelines recommend restricting total maternal caffeine intake to under 200 mg per day. One standard cup of filter coffee contains ~80-120 mg caffeine. Excessive intake crosses the placenta and is linked to fetal growth restriction.',
    clinicalReasonHi:
      'कैफीन की दैनिक मात्रा 200 मिलीग्राम से कम रहनी चाहिए। दिन में केवल 1 छोटा कप (100-120ml) सुरक्षित है, भोजन के तुरंत बाद न लें क्योंकि यह आयरन अवशोषण रोकता है।',
    portionTip: 'Maximum 1 small traditional dabara cup (100 ml) daily, preferably between meals.',
    healthyModification: 'Drink at least 2 hours apart from iron-rich meals and prenatal vitamins.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: ['Dairy'],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian'],
    whoGuidelineAlignment: 'WHO Antenatal Guidelines: Caffeine intake should not exceed 200 mg/day.',
  },

  // MAHARASHTRA & MUMBAI
  {
    id: 'dish-maha-poha',
    dishName: 'Maharashtra Kanda Batata Poha with Roasted Peanuts',
    dishNameHi: 'महाराष्ट्र कांदा बटाटा पोहा भुनी मूंगफली के साथ',
    cityRegion: 'Mumbai',
    cuisine: 'Maharashtrian',
    famousFor: 'Flattened rice tossed with onions, curry leaves, turmeric, mustard seeds, and crunchy peanuts.',
    status: 'suitable',
    statusLabel: 'Suitable in a reasonable portion',
    statusLabelHi: 'उचित मात्रा में पूरी तरह उपयुक्त',
    clinicalReason:
      'Poha (flattened rice) naturally absorbs iron from iron rollers during traditional processing. Peanuts supply plant protein and healthy fats. Curry leaves and lemon juice provide antioxidants and Vitamin C.',
    clinicalReasonHi:
      'पोहा आयरन और सुपाच्य कार्बोहाइड्रेट का बेहतरीन स्रोत है। नींबू का रस इसमें मौजूद आयरन को शरीर में सोखने में मदद करता है।',
    portionTip: '1 medium plate (150g) with half a lemon squeezed on top.',
    healthyModification: 'Add grated carrots, boiled green peas, or sprouted moong to boost dietary fiber.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: ['Peanuts'],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'],
    whoGuidelineAlignment: 'WHO Micronutrient Standard: Iron-rich breakfast coupled with natural ascorbic acid.',
  },
  {
    id: 'dish-maha-vada-pav',
    dishName: 'Mumbai Street Vada Pav (Deep Fried Potato Dumpling in Bread)',
    dishNameHi: 'मुंबई वड़ा पाव (डीप फ्राइड आलू वड़ा)',
    cityRegion: 'Mumbai',
    cuisine: 'Maharashtrian Street Food',
    famousFor: 'Deep fried spiced potato patty in a gram-flour batter, sandwiched in a white bread pav with spicy dry garlic chutney.',
    status: 'limit_or_alternative',
    statusLabel: 'Limit or choose an alternative',
    statusLabelHi: 'सीमित मात्रा में लें या स्वस्थ विकल्प चुनें',
    clinicalReason:
      'Deep frying at high temperatures generates reheated oil oxidation products. High sodium dry chutney and white flour pav can aggravate gestational hypertension, bloating, and heartburn.',
    clinicalReasonHi:
      'तले हुए वड़े और बार-बार गर्म किए गए तेल से एसिडिटी और बीपी बढ़ने का खतरा रहता है। मैदा पाव पोषण रहित कैलोरी देता है।',
    portionTip: 'Occasional treat only; consider air-fried / baked potato patties or homemade whole wheat Frankie.',
    healthyModification: 'Air-fry the spiced potato ball; pair with whole wheat bread and fresh coriander chutney.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: true,
      deepFriedRisk: true,
      potentialAllergens: ['Gluten'],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'],
    whoGuidelineAlignment: 'WHO Guidelines: Minimize trans fats, reused cooking oil, and refined carbohydrates.',
  },

  // BENGAL & EAST INDIA
  {
    id: 'dish-bengal-machher-jhol',
    dishName: 'Bengali Machher Jhol (Freshwater Rohu / Katla Light Stew)',
    dishNameHi: 'बंगाली माछेर झोल (रोहू / कतला मछली का हल्का झोल)',
    cityRegion: 'Kolkata',
    cuisine: 'Bengali',
    famousFor: 'Light, comforting freshwater carp stew made with ridge gourd (jhinge), potato, cumin, and ginger.',
    status: 'suitable',
    statusLabel: 'Suitable in a reasonable portion',
    statusLabelHi: 'उचित मात्रा में पूरी तरह उपयुक्त',
    clinicalReason:
      'Freshwater fish like Rohu and Katla are low in environmental mercury (unlike predatory marine fish such as shark, swordfish, king mackerel) and provide lean protein, Omega-3 DHA for fetal brain and retinal development.',
    clinicalReasonHi:
      'रोहू और कतला में हानिकारक मर्करी (पारा) नहीं होता। यह ओमेगा-3 डीएचए और उच्च कोटि के प्रोटीन से भरपूर है जो शिशु के मस्तिष्क विकास के लिए सर्वोत्तम है।',
    portionTip: '1 piece of fish (80-100g) with light vegetable broth and 1 cup steamed rice.',
    healthyModification: 'Ensure fish is thoroughly cooked until flaky; avoid deep frying fish before simmering.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: true,
      highSodiumOrSugarRisk: false,
      deepFriedRisk: false,
      potentialAllergens: ['Fish'],
    },
    dietSuitability: ['non_vegetarian'],
    whoGuidelineAlignment: 'WHO & US FDA Maternal Seafood Guidance: 2-3 servings of low-mercury fish weekly for fetal neurological development.',
  },
  {
    id: 'dish-bengal-sandesh',
    dishName: 'Kolkata Nolen Gur Sandesh (Fresh Chhena Sweet)',
    dishNameHi: 'कोलकाता नोलेन गुड़ संदेश (ताजा छेना मिठाई)',
    cityRegion: 'Kolkata',
    cuisine: 'Bengali',
    famousFor: 'Delicate artisanal sweet prepared from freshly curdled cow milk chhena and date palm jaggery (nolen gur).',
    status: 'suitable_with_modifications',
    statusLabel: 'Suitable with modifications',
    statusLabelHi: 'मात्रा सीमा के साथ उपयुक्त',
    clinicalReason:
      'Cow milk chhena offers high quality casein protein and calcium. Nolen gur contains trace minerals (potassium, iron). However, portion size must remain strictly moderated for glycemic balance.',
    clinicalReasonHi:
      'ताजा छेना प्रोटीन और कैल्शियम देता है। खजूर का गुड़ प्राकृतिक मिठास देता है, फिर भी ब्लड शुगर नियंत्रित रखने के लिए 1 छोटा पीस ही लें।',
    portionTip: '1 small piece (25-30g) as an occasional sweet treat after a balanced meal.',
    healthyModification: 'Verify that the chhena was made with pasteurized milk to eliminate Listeria risk.',
    safetyCheck: {
      pregnancySafe: true,
      isRawOrUndercookedRisk: false,
      highSodiumOrSugarRisk: true,
      deepFriedRisk: false,
      potentialAllergens: ['Dairy'],
    },
    dietSuitability: ['vegetarian', 'eggetarian', 'non_vegetarian'],
    whoGuidelineAlignment: 'WHO Healthy Diet: Keep free sugar consumption under 5% of daily total energy.',
  },
];

// Generation engine for personalized daily meal plan
export function generateDailyMealPlan(params: {
  dietaryPreference: DietaryPreferenceType;
  city: string;
  gestationalWeek?: number;
  trimester?: 1 | 2 | 3;
  allergies?: string[];
  medicalConditions?: string[];
  recentLabs?: {
    isAnemic?: boolean;
    isGdmHigh?: boolean;
    isBpHigher?: boolean;
  };
}): MealPlanItem[] {
  const isVeg = params.dietaryPreference === 'vegetarian';
  const isEgg = params.dietaryPreference === 'eggetarian';
  const isNonVeg = params.dietaryPreference === 'non_vegetarian';
  const isVegan = params.dietaryPreference === 'vegan';
  const isAnemic = params.recentLabs?.isAnemic || false;
  const isGdm = params.recentLabs?.isGdmHigh || false;
  const isBpHigher = params.recentLabs?.isBpHigher || false;
  const city = params.city || 'Bengaluru';
  const isSouthCity = ['Bengaluru', 'Chennai', 'Hyderabad'].includes(city);
  const isNorthCity = ['Lucknow', 'Delhi NCR', 'Jaipur'].includes(city);
  const isWestCity = ['Mumbai', 'Pune', 'Ahmedabad'].includes(city);

  const meals: MealPlanItem[] = [
    // 1. EARLY MORNING
    {
      id: 'meal_em_1',
      slot: 'early_morning',
      slotLabel: 'Early Morning (06:30 - 07:00 AM)',
      slotLabelHi: 'सुबह सवेरे (6:30 - 7:00 बजे)',
      foodName: isVegan
        ? 'Soaked Almonds (5 pcs) & Dried Figs with Warm Cumin-Fennel Water'
        : 'Warm Turmeric Spiced Milk with 5 Soaked Almonds & 1 Walnut',
      foodNameHi: isVegan
        ? 'भीगे बादाम, अंजीर और गुनगुना जीरा-सौंफ का पानी'
        : 'गुनगुना हल्दी वाला दूध, भीगे बादाम और अखरोट',
      description:
        'Gentle morning ignition rich in brain-protective Omega-3 ALA, Vitamin E, and calcium without triggering morning nausea.',
      portionGuide: '1 small glass (150ml) + 5 peeled soaked almonds + 1 walnut half.',
      mainIngredients: isVegan
        ? ['Peeled Almonds', 'Dried Fig', 'Jeera Water', 'Fennel']
        : ['Pasteurized Low-fat Cow Milk', 'Turmeric', 'Peeled Almonds', 'Walnuts'],
      estimatedNutrients: {
        calories: 140,
        proteinGrams: 5.5,
        carbsGrams: 12,
        fatGrams: 8,
        fiberGrams: 2.2,
        calciumMg: isVegan ? 75 : 180,
        ironMg: 1.2,
        folateMcg: 18,
        isReliableEstimate: true,
      },
      clinicalWhy:
        'Almonds provide bioavailable Vitamin E and magnesium. Peeling soaked almonds reduces phytic acid, enhancing mineral absorption. Fennel/jeera water calms early morning nausea (hyperemesis gravidarum).',
      clinicalWhyHi:
        'भीगे बादाम का छिलका हटाने से फाइटिक एसिड कम होता है और मैग्नीशियम-कैल्शियम आसानी से पचते हैं। यह सुबह की मितली को रोकता है।',
      preferenceSubstitution: isVegan
        ? 'Soy milk or almond milk fortified with calcium.'
        : 'Low-fat lactose-free milk if lactose intolerant.',
      affordableAlternative: 'Roasted chana (Bengal gram) handful with warm lemon-infused water.',
      simplePreparation: [
        'Soak 5 almonds and 1 walnut in filtered water overnight.',
        'Peel almond skins in the morning.',
        'Warm milk or water with a tiny pinch of pure turmeric and ground cardamom.',
      ],
    },

    // 2. BREAKFAST
    {
      id: 'meal_bf_1',
      slot: 'breakfast',
      slotLabel: 'Nutrient-Dense Breakfast (08:30 - 09:00 AM)',
      slotLabelHi: 'संतुलित पौष्टिक नाश्ता (8:30 - 9:00 बजे)',
      foodName: isSouthCity
        ? isGdm
          ? 'Steamed Ragi & Oats Idli with Mixed Vegetable Sambar & Mint Chutney'
          : 'Steamed Rice-Urad Idli (3 pcs) with Drumstick Sambar'
        : isWestCity
        ? 'Vegetable & Sprouted Moong Poha with Squeezed Lemon'
        : isEgg || isNonVeg
        ? 'Spinach & Tomato Egg Bhurji (2 Eggs) with 2 Multigrain Rotis'
        : 'Sprouted Moong & Paneer Cheela (2 pcs) with Fresh Coriander Chutney',
      foodNameHi: isSouthCity
        ? 'भाप में पकी रागी-ओट्स इडली एवं सब्जी सांभर'
        : isWestCity
        ? 'सब्जी और अंकुरित मूँग पोहा नींबू के साथ'
        : isEgg || isNonVeg
        ? 'पालक-टमाटर अंडा भुर्जी (2 अंडे) और 2 मल्टीग्रेन रोटी'
        : 'अंकुरित मूँग और पनीर चीला हरी चटनी के साथ',
      description:
        'High-fiber, high-protein breakfast providing steady complex carbohydrate release to prevent morning fatigue and glycemic spikes.',
      portionGuide: isEgg || isNonVeg
        ? '2 eggs scrambled with veggies + 2 medium 6-inch phulkas.'
        : '2 medium cheelas / 3 steamed idlis with 1 medium bowl of sambar.',
      mainIngredients: isEgg || isNonVeg
        ? ['Farm Eggs', 'Chopped Spinach', 'Tomatoes', 'Multigrain Flour']
        : isSouthCity
        ? ['Ragi Flour', 'Rolled Oats', 'Toor Dal', 'Drumsticks', 'Carrots']
        : ['Moong Dal Batter', 'Low-fat Paneer / Tofu', 'Ginger', 'Coriander'],
      estimatedNutrients: {
        calories: 340,
        proteinGrams: isEgg || isNonVeg ? 18 : 15,
        carbsGrams: 44,
        fatGrams: 9,
        fiberGrams: 6.5,
        calciumMg: 140,
        ironMg: isAnemic ? 4.5 : 3.2,
        folateMcg: 75,
        isReliableEstimate: true,
      },
      clinicalWhy:
        isAnemic
          ? 'Sprouted pulses and spinach combined with fresh lemon (Vitamin C) enhance iron uptake, directly helping maternal hemoglobin levels.'
          : isGdm
          ? 'Ragi and sprouted moong provide complex low-GI carbs, dampening post-prandial blood sugar spikes.'
          : 'Balanced protein and dietary fiber stabilize blood sugar and prevent mid-morning hunger cravings.',
      clinicalWhyHi:
        'अंकुरित दालें और पालक शरीर में हीमोग्लोबिन स्तर बनाए रखने में सहायक हैं। कम ग्लाइसेमिक इंडेक्स होने से ब्लड शुगर नियंत्रित रहता है।',
      preferenceSubstitution: isVegan
        ? 'Substitute paneer with crumbled organic tofu or roasted soya chunks.'
        : 'Can swap eggs for 50g fresh cow milk paneer.',
      affordableAlternative: 'Besan (Bengal gram flour) cheela with grated carrots and onions.',
      simplePreparation: [
        'Whisk batter or prepare eggs with chopped spinach and a drop of cold-pressed oil.',
        'Cook on medium heat until steaming hot throughout.',
        'Serve with a squeeze of fresh lemon juice.',
      ],
    },

    // 3. MID-MORNING SNACK
    {
      id: 'meal_mm_1',
      slot: 'mid_morning',
      slotLabel: 'Mid-Morning Refreshment (11:00 - 11:30 AM)',
      slotLabelHi: 'दोपहर पूर्व अल्पाहार (11:00 - 11:30 बजे)',
      foodName: isAnemic
        ? 'Fresh Pomegranate (1 cup) with Roasted Pumpkin Seeds (1 tbsp)'
        : 'Guava Slices with Roasted Flaxseeds & Fresh Coconut Water',
      foodNameHi: isAnemic
        ? 'ताजा अनार (1 कप) और भुने कद्दू के बीज'
        : 'ताजा अमरूद, अलसी के बीज और ताजा नारियल पानी',
      description:
        'Hydrating, high-antioxidant mid-morning booster loaded with Vitamin C, magnesium, and natural electrolytes.',
      portionGuide: '1 medium fruit (120-150g) + 1 tablespoon roasted seeds + 1 glass coconut water.',
      mainIngredients: ['Fresh Fruit', 'Pumpkin Seeds', 'Tender Coconut Water'],
      estimatedNutrients: {
        calories: 130,
        proteinGrams: 3.5,
        carbsGrams: 24,
        fatGrams: 3,
        fiberGrams: 5.2,
        calciumMg: 45,
        ironMg: 2.1,
        folateMcg: 35,
        isReliableEstimate: true,
      },
      clinicalWhy:
        'Guava contains 4 times more Vitamin C than oranges, drastically optimizing plant-iron uptake. Coconut water restores potassium and cellular hydration without adding processed sugars.',
      clinicalWhyHi:
        'अमरूद में संतरे से 4 गुना अधिक विटामिन सी होता है, जो आयरन सोखने में सर्वोत्तम है। नारियल पानी पोटेशियम की कमी पूरी करता है।',
      preferenceSubstitution: 'Can substitute pomegranate with seasonal papaya (ripe sweet yellow papaya only, never raw green).',
      affordableAlternative: 'Seasonal Indian gooseberry (Amla) with sliced cucumber and rock salt.',
      simplePreparation: [
        'Wash fruit under running potable water.',
        'Slice fresh and sprinkle with lightly toasted pumpkin/flax seeds.',
        'Drink fresh coconut water immediately upon opening.',
      ],
    },

    // 4. LUNCH
    {
      id: 'meal_lu_1',
      slot: 'lunch',
      slotLabel: 'Balanced Main Lunch (01:00 - 01:45 PM)',
      slotLabelHi: 'संतुलित मुख्य दोपहर का भोजन (1:00 - 1:45 बजे)',
      foodName: isNonVeg
        ? 'Bengali / Awadhi Mild Fish Curry (Rohu) with Steamed Brown Rice, Lauki Sabzi & Curd'
        : isSouthCity
        ? 'Panchmel Dal, Green Leafy Saaru (Spinach/Methi), Jowar Bhakri & Probiotic Buttermilk'
        : 'Homestyle Moong-Rajma Dal, Seasonal Tori/Bhindi Sabzi, 2 Multigrain Rotis & Cucumber Salad',
      foodNameHi: isNonVeg
        ? 'हल्की रोहू मछली करी, ब्राउन राइस, लौकी की सब्जी और दही'
        : isSouthCity
        ? 'पंचमेल दाल, पालक-मेथी सांभर, ज्वार भाकरी और ताजा छाछ'
        : 'मूँग-राजमा दाल, तोरी/भिंडी की सब्जी, 2 मल्टीग्रेन रोटी व सलाद',
      description:
        'The centerpiece meal following WHO Plate Method: 50% colorful vegetables & greens, 25% plant/animal lean protein, 25% whole grains.',
      portionGuide: '1 cup dal/fish + 1 large cup green vegetables + 2 rotis or 1 cup cooked brown rice + 1 cup curd.',
      mainIngredients: isNonVeg
        ? ['Freshwater Rohu Fish', 'Bottle Gourd (Lauki)', 'Brown Rice', 'Homemade Curd']
        : ['Yellow Moong & Toor Dal', 'Spinach / Seasonal Tori', 'Multigrain Flour', 'Curd'],
      estimatedNutrients: {
        calories: 460,
        proteinGrams: isNonVeg ? 24 : 18,
        carbsGrams: 62,
        fatGrams: 11,
        fiberGrams: 8.5,
        calciumMg: isVegan ? 110 : 260,
        ironMg: 5.2,
        folateMcg: 110,
        isReliableEstimate: true,
      },
      clinicalWhy:
        'Provides essential amino acids for fetal cellular hypertrophy and maternal tissue expansion. Probiotic curd repopulates lactobacilli in the maternal gut, safeguarding against vaginal dysbiosis.',
      clinicalWhyHi:
        'दाल और मछली शिशु के अंगों और मांसपेशियों के विकास हेतु प्रोटीन देती हैं। ताजा दही आंतों में अच्छे बैक्टीरिया बढ़ाता है।',
      preferenceSubstitution: isVegan
        ? 'Substitute curd with fortified soy yogurt or coconut buttermilk with roasted cumin.'
        : 'Vegetarians can enjoy double portion of dal with sprouted paneer.',
      affordableAlternative: 'Yellow moong dal with seasonal local pumpkin (kaddu) sabzi and whole wheat phulkas.',
      simplePreparation: [
        'Cook dal with turmeric, pinch of asafoetida, and cumin tempering.',
        'Steam vegetables with minimal cold-pressed mustard or groundnut oil.',
        'Serve hot with freshly kneaded multigrain phulkas.',
      ],
    },

    // 5. EVENING SNACK
    {
      id: 'meal_es_1',
      slot: 'evening_snack',
      slotLabel: 'Evening Energy Boost (04:30 - 05:00 PM)',
      slotLabelHi: 'शाम का हल्का नाश्ता (4:30 - 5:00 बजे)',
      foodName: 'Roasted Foxnuts (Makhana) with Roasted Peanuts & Tender Ginger Mint Tea',
      foodNameHi: 'भुने मखाने, मूंगफली और हल्की अदरक-पुदीना चाय',
      description:
        'Crunchy, guilt-free snack rich in plant calcium, magnesium, and resistant starch that cures late afternoon slumps.',
      portionGuide: '1 large bowl (30-40g) roasted makhana + 1 cup caffeine-free herbal infusion.',
      mainIngredients: ['Phool Makhana', 'Roasted Peanuts', 'Drop of Ghee', 'Coriander/Mint'],
      estimatedNutrients: {
        calories: 160,
        proteinGrams: 5.8,
        carbsGrams: 22,
        fatGrams: 4.5,
        fiberGrams: 3.5,
        calciumMg: 60,
        ironMg: 1.8,
        folateMcg: 22,
        isReliableEstimate: true,
      },
      clinicalWhy:
        'Foxnuts (Makhana) are low sodium, low glycemic, and naturally rich in calcium and kaempferol (flavonoid). Ideal replacement for deep-fried bakery biscuits or fried samosas.',
      clinicalWhyHi:
        'मखाने में सोडियम कम और कैल्शियम अधिक होता है। यह ब्लड प्रेशर को नियंत्रित रखता है और तले हुए स्नैक्स का उत्तम स्वस्थ विकल्प है।',
      preferenceSubstitution: 'Can swap with boiled sweet corn with lime and pepper.',
      affordableAlternative: 'Puffed rice (Murmura) roasted with peanuts and curry leaves.',
      simplePreparation: [
        'Dry roast makhana in a pan with 1/2 teaspoon ghee or cold-pressed oil.',
        'Toss with roasted cumin powder and a pinch of black salt.',
      ],
    },

    // 6. DINNER
    {
      id: 'meal_di_1',
      slot: 'dinner',
      slotLabel: 'Light & Restorative Dinner (07:30 - 08:15 PM)',
      slotLabelHi: 'हल्का व सुपाच्य रात्रि भोजन (7:30 - 8:15 बजे)',
      foodName: isSouthCity
        ? 'Mixed Vegetable Foxtail Millet Khichdi with Steamed Moong Sprouts'
        : 'Vegetable Dalia Khichdi (Broken Wheat & Yellow Moong) with Lauki Soup',
      foodNameHi: isSouthCity
        ? 'कंगनी (फॉक्सटेल मिलेट) एवं सब्जी खिचड़ी अंकुरित मूँग के साथ'
        : 'वेजिटेबल दलिया खिचड़ी (गेहूं व मूँग दाल) और लौकी का सूप',
      description:
        'Light, high-fiber, easily digestible dinner consumed at least 2.5 hours before sleeping to prevent gastroesophageal reflux (GERD) and insomnia.',
      portionGuide: '1.5 medium bowls (250g) of warm vegetable khichdi + warm cumin water.',
      mainIngredients: ['Broken Wheat or Foxtail Millet', 'Yellow Split Moong Dal', 'Carrots', 'Beans', 'Jeera'],
      estimatedNutrients: {
        calories: 320,
        proteinGrams: 14,
        carbsGrams: 52,
        fatGrams: 6,
        fiberGrams: 7.8,
        calciumMg: 85,
        ironMg: 3.4,
        folateMcg: 80,
        isReliableEstimate: true,
      },
      clinicalWhy:
        'Eating early (before 8:15 PM) and choosing a broken grain khichdi minimizes nocturnal gastric pressure on the elevating gravid uterus, easing diaphragmatic breathing.',
      clinicalWhyHi:
        'सोने से 2.5 घंटे पहले हल्का भोजन करने से सीने में जलन और एसिडिटी नहीं होती, जिससे रात को गहरी नींद आती है।',
      preferenceSubstitution: 'Can substitute with grilled paneer/tofu salad with warm vegetable soup.',
      affordableAlternative: 'Simple yellow moong dal khichdi with bottle gourd.',
      simplePreparation: [
        'Rinse dalia or millet with split yellow moong.',
        'Pressure cook with diced carrots, french beans, turmeric, and pinch of asafoetida for 3 whistles.',
        'Garnish with fresh coriander leaves.',
      ],
    },
  ];

  return sanitizeMealPlanForDiet(meals, params.dietaryPreference, {
    isAnemic,
    isGdm,
    isHypertensive: isBpHigher,
  });
}

export const SAMPLE_GROCERY_LIST: GroceryItem[] = [
  { id: 'g_1', name: 'Fresh Spinach / Palak & Methi', quantity: '2 bunches', category: 'Fresh Produce', checked: true },
  { id: 'g_2', name: 'Bottle Gourd (Lauki) & Ridge Gourd (Tori)', quantity: '1 kg', category: 'Fresh Produce', checked: false },
  { id: 'g_3', name: 'Pomegranate & Fresh Guavas', quantity: '1 kg each', category: 'Fresh Produce', checked: false },
  { id: 'g_4', name: 'Fresh Lemons (for Vitamin C)', quantity: '6 pieces', category: 'Fresh Produce', checked: true },
  { id: 'g_5', name: 'Yellow Split Moong Dal', quantity: '1 kg', category: 'Pulses & Legumes', checked: true },
  { id: 'g_6', name: 'Whole Brown Chana & Toor Dal', quantity: '1 kg each', category: 'Pulses & Legumes', checked: false },
  { id: 'g_7', name: 'Finger Millet (Ragi) Flour / Grains', quantity: '1 kg', category: 'Whole Grains', checked: true },
  { id: 'g_8', name: 'Rolled Oats & Broken Wheat (Dalia)', quantity: '500g each', category: 'Whole Grains', checked: false },
  { id: 'g_9', name: 'Low-fat Pasteurized Cow Milk & Fresh Curd', quantity: '1 liter daily', category: 'Dairy & Alternatives', checked: true },
  { id: 'g_10', name: 'Fresh Cow Milk Paneer (or Tofu for vegans)', quantity: '250g', category: 'Dairy & Alternatives', checked: false },
  { id: 'g_11', name: 'Raw California Almonds & Walnuts', quantity: '250g each', category: 'Nuts & Seeds', checked: true },
  { id: 'g_12', name: 'Raw Pumpkin Seeds & Flaxseeds', quantity: '100g each', category: 'Nuts & Seeds', checked: false },
  { id: 'g_13', name: 'Phool Makhana (Foxnuts)', quantity: '200g', category: 'Pantry & Spices', checked: true },
  { id: 'g_14', name: 'Cold Pressed Mustard / Sesame Oil & Pure Ghee', quantity: '500ml', category: 'Pantry & Spices', checked: false },
];

export const SAMPLE_FOOD_ALTERNATIVES: FoodAlternativeItem[] = [
  {
    id: 'alt_1',
    originalFood: 'Refined White Flour (Maida) in Bakery Breads, Naan, Biscuits',
    recommendedAlternative: 'Whole Ragi (Finger Millet), Jowar, or Multigrain Stone-Ground Flour',
    category: 'grain',
    clinicalAdvantage:
      'Replaces empty refined starch with 3x higher calcium, slow-release complex carbs, and 4x more dietary fiber, stabilizing blood glucose.',
    clinicalAdvantageHi: 'मैदा की तुलना में 3 गुना अधिक कैल्शियम और 4 गुना अधिक फाइबर, जो जेस्टेशनल डायबिटीज से बचाता है।',
    affordableFactor: 'Locally grown millets (Ragi/Jowar) are economical and widely available across India.',
  },
  {
    id: 'alt_2',
    originalFood: 'Commercial White Table Sugar & Sweetened Aerated Drinks',
    recommendedAlternative: 'Pure Date Puree, Mashed Ripe Bananas, or Moderate Natural Jaggery',
    category: 'sweetener',
    clinicalAdvantage:
      'Avoids rapid glycemic spikes; supplies natural potassium, magnesium, and trace iron instead of zero-nutrient calories.',
    clinicalAdvantageHi: 'रिफाइंड चीनी से होने वाले शुगर स्पाइक से बचाता है और प्राकृतिक पोटेशियम व मैग्नीशियम देता है।',
    affordableFactor: 'Ripe seasonal bananas and jaggery are universally accessible.',
  },
  {
    id: 'alt_3',
    originalFood: 'Deep Fried Potato Samosa / Pakoras in Reheated Street Oil',
    recommendedAlternative: 'Air-Fried or Dry-Roasted Phool Makhana (Foxnuts) with Peanuts & Jeera',
    category: 'snack',
    clinicalAdvantage:
      'Eliminates dangerous trans fats, acrylamides, and excess sodium. Supplies plant calcium and stops late-afternoon heartburn.',
    clinicalAdvantageHi: 'हानिकारक ट्रांस फैट और एसिडिटी से मुक्ति, प्राकृतिक कैल्शियम और हल्का नाश्ता।',
    affordableFactor: 'Makhana and roasted chana have long shelf lives and low cost per serving.',
  },
  {
    id: 'alt_4',
    originalFood: 'High-Mercury Marine Fishes (Shark, Swordfish, King Mackerel, Bigeye Tuna)',
    recommendedAlternative: 'Freshwater Rohu, Katla, Pomfret, or Wild Salmon (Thoroughly Cooked)',
    category: 'protein',
    clinicalAdvantage:
      'Safely provides DHA Omega-3 fatty acids without bioaccumulating toxic methylmercury that harms fetal neurodevelopment.',
    clinicalAdvantageHi: 'शिशु के मस्तिष्क विकास के लिए सुरक्षित ओमेगा-3 डीएचए, बिना जहरीले पारे (Mercury) के जोखिम के।',
    affordableFactor: 'Freshwater Rohu and Katla are staple affordable fresh catches in local fish markets.',
  },
];
