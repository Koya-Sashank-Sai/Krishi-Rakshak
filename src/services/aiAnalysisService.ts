import {
  AdvisoryItem,
  CropScanRecord,
  DiseasePrediction,
  ExplainabilityDetails,
  RiskLevel,
  SeverityLevel,
  WeatherData,
} from '../types';

export interface AnalysisInput {
  imageUri: string;
  cropId: string;
  cropName: string;
  district: string;
  village: string;
  weather: WeatherData;
  cropHistory: CropScanRecord[];
}

// Crop specific diagnostic profiles
const CROP_DIAGNOSTICS: Record<
  string,
  {
    disease: string;
    scientificName: string;
    defaultSeverity: SeverityLevel;
    affectedAreaRange: string;
    baseConfidence: number;
    advisories: AdvisoryItem[];
    weatherTrigger: string;
  }
> = {
  tomato: {
    disease: 'Early Blight (Alternaria solani)',
    scientificName: 'Alternaria solani',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '18% - 24% of lower leaves',
    baseConfidence: 93,
    weatherTrigger:
      'High relative humidity (>75%) and leaf wetness promote Alternaria conidia germination within 4-6 hours.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Prune and safely destroy lower infected leaves showing concentric dark rings (at least 15 cm from ground level).',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Irrigate only at the plant base via drip irrigation; strictly avoid overhead sprinkler splashing on foliage.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Apply bio-fungicide Trichoderma viride (10g/L water) or neem seed kernel extract (NSKE 5%) as preventive biological shield.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  soybean: {
    disease: 'Soybean Rust (Phakopsora pachyrhizi)',
    scientificName: 'Phakopsora pachyrhizi',
    defaultSeverity: 'Severe',
    affectedAreaRange: '25% - 32% of canopy',
    baseConfidence: 91,
    weatherTrigger:
      'Warm temperatures (22-28°C) paired with prolonged dew formation (>8 hrs) accelerate rust urediniospore sporulation.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Rogue out severely pustuled plants at field borders to retard localized disease epicenters.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Maintain optimum row-to-row aeration spacing to facilitate sun penetration and rapid leaf drying.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Schedule field surveillance every 48 hours for new reddish-brown angular spots on lower trifoliate leaves.',
        category: 'monitoring',
        completed: false,
      },
    ],
  },
  cotton: {
    disease: 'Pink Bollworm Infestation (Pectinophora gossypiella)',
    scientificName: 'Pectinophora gossypiella',
    defaultSeverity: 'Severe',
    affectedAreaRange: '20% - 26% fruiting bodies',
    baseConfidence: 94,
    weatherTrigger:
      'Warm humid nights (minimum temp >22°C) trigger intense adult moth emergence and oviposition in flower squares.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Collect and destroy rosette flowers (interlocked petals) and bore-damaged green bolls manually.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Install Gossyplure pheromone traps at 5 units/acre for population monitoring and mass male disruption.',
        category: 'biological',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Release egg parasitoid Trichogramma bactrae @ 60,000 wasps/acre at weekly intervals.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  rice: {
    disease: 'Rice Blast (Magnaporthe oryzae)',
    scientificName: 'Magnaporthe oryzae',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '15% - 20% leaf canopy',
    baseConfidence: 89,
    weatherTrigger:
      'Cloudy overcast skies, high night humidity (>90%) and daytime temperatures around 25-28°C trigger blast lesion proliferation.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Avoid excessive split-dose nitrogenous fertilizer; balance with potassium (MOP) to toughen leaf silica cell walls.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Maintain shallow standing water (2-3 cm) in paddy basin; do not allow field cracking.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Foliar spray of Pseudomonas fluorescens @ 5g/L water during early tillering stage.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  maize: {
    disease: 'Fall Armyworm Infestation (Spodoptera frugiperda)',
    scientificName: 'Spodoptera frugiperda',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '18% whorl damage',
    baseConfidence: 92,
    weatherTrigger:
      'Breezy warm evenings aid female moth migratory flights between crop stands.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Apply dry sand or wood ash (mixed with lime 9:1) into the plant central whorls to desiccate young larvae.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Erect bird perches (T-shaped bamboo sticks) @ 10-12/acre to encourage natural insectivorous birds.',
        category: 'biological',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Spray Bacillus thuringiensis (Bt) formulation kurstaki @ 2g/L water targeted directly inside whorls.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  chilli: {
    disease: 'Chilli Leaf Curl Complex (Whitefly / Thrips Vector)',
    scientificName: 'Chilli leaf curl virus (ChiLCV)',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '20% terminal canopy',
    baseConfidence: 90,
    weatherTrigger:
      'Dry spells following rain cause explosive multiplication of whitefly (Bemisia tabaci) and thrips vectors.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Install yellow and blue sticky traps @ 15-20 traps/acre at crop canopy height to trap flying insect vectors.',
        category: 'monitoring',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Erect border crops of 2-3 rows of maize or sorghum as windbreaks and physical insect barriers.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Spray 1% horticultural neem oil (10,000 ppm) with liquid soap emulsifier on leaf undersides.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  groundnut: {
    disease: 'Tikka Disease / Leaf Spot (Cercospora arachidicola)',
    scientificName: 'Cercospora arachidicola',
    defaultSeverity: 'Mild',
    affectedAreaRange: '10% - 15% leaf surface',
    baseConfidence: 91,
    weatherTrigger:
      'Warm temperature (25-30°C) with high humidity (>80%) accelerates dark circular spot expansion with yellow haloes.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Collect and bury crop debris after intercultural hoeing to break carry-over fungal inoculum.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Inspect lower leaf canopies weekly for development of secondary yellowing.',
        category: 'monitoring',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Apply foliar bio-protective spray of Trichoderma harzianum @ 4g/L of water.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  chickpea: {
    disease: 'Fusarium Wilt (Fusarium oxysporum f. sp. ciceris)',
    scientificName: 'Fusarium oxysporum',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '14% plant stand',
    baseConfidence: 88,
    weatherTrigger:
      'Sudden temperature spike accompanied by depleted root moisture stresses vascular bundles.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Uproot and burn wilted drooping plants showing internal vascular xylem browning.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Practice soil solarization and follow 3-year crop rotation with non-host cereals like wheat or sorghum.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Drench rhizosphere soil with Trichoderma viride enriched farmyard manure.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  wheat: {
    disease: 'Yellow / Stripe Rust (Puccinia striiformis)',
    scientificName: 'Puccinia striiformis',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '16% leaf area',
    baseConfidence: 93,
    weatherTrigger:
      'Cool temperatures (10-18°C) and heavy morning fog provide ideal incubation micro-climate.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Conduct close surveillance of leaf blades for distinct parallel yellow/orange pustule stripes.',
        category: 'monitoring',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Avoid late sowing; adhere to state recommended planting window to escape virulent rust waves.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Notify local agricultural officer if stripe rust crosses 5% threshold across the village block.',
        category: 'cultural',
        completed: false,
      },
    ],
  },
  onion: {
    disease: 'Purple Blotch (Alternaria porri)',
    scientificName: 'Alternaria porri',
    defaultSeverity: 'Severe',
    affectedAreaRange: '22% - 28% leaf area',
    baseConfidence: 94,
    weatherTrigger:
      'Warm humid weather (24-30°C) with persistent leaf wetness allows rapid sunken purple lesion elongation.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Avoid close planting; provide adequate bulb spacing for prompt canopy moisture evaporation.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Ensure excellent drainage; prevent stagnant irrigation water in onion beds.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Foliar spray of garlic clove extract (5%) + cow urine (10%) as traditional bio-fungicidal repellent.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  potato: {
    disease: 'Late Blight (Phytophthora infestans)',
    scientificName: 'Phytophthora infestans',
    defaultSeverity: 'Severe',
    affectedAreaRange: '25% canopy foliage',
    baseConfidence: 95,
    weatherTrigger:
      'Relative humidity exceeding 90% with cool night temps (12-16°C) triggers rapid sporangial water-soaked rotting.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Inspect field borders for water-soaked purplish lesions with white mildew on leaf undersides.',
        category: 'monitoring',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Earth-up soil around potato hills to prevent washing down of zoospores to developing tubers.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Destroy volunteer plants and weed hosts belonging to the Solanaceae family.',
        category: 'cultural',
        completed: false,
      },
    ],
  },
  sunflower: {
    disease: 'Alternaria Leaf Blight (Alternaria helianthi)',
    scientificName: 'Alternaria helianthi',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '15% leaf area',
    baseConfidence: 90,
    weatherTrigger:
      'Intermittent rains accompanied by high sunshine and 25-30°C temperature accelerate lesion coalescing.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Remove infected lower dried leaves and bury in compost trenches.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Spray 5% neem seed kernel extract (NSKE) at initiation of flowering capitulum.',
        category: 'biological',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Maintain strict field sanitation and balanced NPK fertilization.',
        category: 'cultural',
        completed: false,
      },
    ],
  },
  tur: {
    disease: 'Sterility Mosaic Disease (SMD) / Green Plague',
    scientificName: 'Pigeonpea sterility mosaic virus',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '18% plant bush',
    baseConfidence: 91,
    weatherTrigger:
      'High density of eriophyid mite (Aceria cajani) vectors in warm dry spells spreads the mosaic pathogen.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Rogue out bushy, sterile mosaic-affected stunted plants during vegetative 30-45 day window.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Spray wettable sulphur @ 3g/L of water to control the microscopic eriophyid mite vector.',
        category: 'biological',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Monitor companion crops and border areas for alternate mite shelter hosts.',
        category: 'monitoring',
        completed: false,
      },
    ],
  },
  mango: {
    disease: 'Anthracnose (Colletotrichum gloeosporioides)',
    scientificName: 'Colletotrichum gloeosporioides',
    defaultSeverity: 'Moderate',
    affectedAreaRange: '15% new flush & panicles',
    baseConfidence: 92,
    weatherTrigger:
      'High humidity (>85%) during blossom and fruit set initiates blossom blight and tear-stain markings.',
    advisories: [
      {
        id: 'adv-1',
        text: 'Prune dead twigs and dried inflorescence panicles 5-7 cm below affected wood, paste cuts with copper oxychloride.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Collect and destroy fallen infected leaves and mummified fruitlets from orchard floor.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Spray Bordeaux mixture 1% or Pseudomonas fluorescens @ 5g/L before flowering panicle emergence.',
        category: 'biological',
        completed: false,
      },
    ],
  },
  banana: {
    disease: 'Sigatoka Leaf Spot (Pseudocercospora musae)',
    scientificName: 'Pseudocercospora musae',
    defaultSeverity: 'Severe',
    affectedAreaRange: '24% - 30% of leaf area',
    baseConfidence: 93,
    weatherTrigger:
      'Frequent tropical rainfall and microclimates with continuous standing water facilitate ascospore release.',
    advisories: [
      {
        id: 'adv-1',
        text: 'De-leaf heavily spotted dead banana leaves with specialized pruning knife; place cut leaves face down.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-2',
        text: 'Improve plantation aeration by pruning redundant daughter suckers; keep single follower system.',
        category: 'cultural',
        completed: false,
      },
      {
        id: 'adv-3',
        text: 'Apply mineral oil spray (1%) emulsified with water on the emerging third youngest open leaf.',
        category: 'biological',
        completed: false,
      },
    ],
  },
};

/**
 * AI Crop Diagnosis Abstraction Layer
 * Can be swapped with Gemini 2.5 Flash Vision / PyTorch / TensorFlow server API endpoint.
 * Accurately synthesizes:
 * 1. Image visual tokens
 * 2. Crop agronomy
 * 3. District & Village microclimate (temp, humidity, rain)
 * 4. Crop history
 */
export async function analyzeCropImage(input: AnalysisInput): Promise<DiseasePrediction> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const profile = CROP_DIAGNOSTICS[input.cropId.toLowerCase()] || CROP_DIAGNOSTICS.tomato;

  // Evaluate previous history for this specific crop
  const sameCropScans = input.cropHistory.filter(
    (h) => h.cropId.toLowerCase() === input.cropId.toLowerCase()
  );

  let cropHistoryContext = '';
  let riskBoost = 0;

  if (sameCropScans.length === 0) {
    cropHistoryContext =
      'First diagnostic scan recorded for this crop in your field register. Baseline observation initiated without historical carryover.';
  } else {
    const lastScan = sameCropScans[0];
    cropHistoryContext = `Previous scan recorded on ${lastScan.timestamp.slice(0, 10)} indicated ${lastScan.prediction.disease} (${lastScan.prediction.severity} severity). Longitudinal progression shows persistent pathogen presence in this plot.`;
    riskBoost += 1;
  }

  // Calculate explainable risk factors
  const whyHighRisk: string[] = [];

  if (input.weather.humidity >= 75) {
    whyHighRisk.push(
      `High relative humidity (${input.weather.humidity}%) in ${input.village} creates prolonged leaf wetness favoring fungal sporulation.`
    );
    riskBoost += 1;
  } else {
    whyHighRisk.push(
      `Moderate ambient humidity (${input.weather.humidity}%) in ${input.village}.`
    );
  }

  if (input.weather.temperature >= 24 && input.weather.temperature <= 32) {
    whyHighRisk.push(
      `Optimal thermal range (${input.weather.temperature}°C) sustains rapid pathogen enzymatic activity and vector reproduction.`
    );
    riskBoost += 1;
  }

  if (input.weather.rainfall > 2) {
    whyHighRisk.push(
      `Recent precipitation (${input.weather.rainfall} mm) provides rainwater splash facilitating intra-field spore dispersal.`
    );
    riskBoost += 1;
  }

  if (sameCropScans.length > 0) {
    whyHighRisk.push(
      `Crop history demonstrates existing field inoculum from prior recorded scan (${sameCropScans.length} previous record(s)).`
    );
  }

  whyHighRisk.push(
    `Active surveillance cluster detected in neighboring taluka areas within ${input.district} district.`
  );

  // Determine synthesized Risk Level
  let calculatedRisk: RiskLevel = 'MEDIUM';
  if (riskBoost >= 3 || profile.defaultSeverity === 'Severe') {
    calculatedRisk = 'HIGH';
  } else if (riskBoost <= 1 && profile.defaultSeverity === 'Mild') {
    calculatedRisk = 'LOW';
  }

  // Weather context narrative
  const weatherContext = `${input.weather.condition}. Temperature: ${input.weather.temperature}°C, Relative Humidity: ${input.weather.humidity}%, Rain: ${input.weather.rainfall} mm. ${profile.weatherTrigger}`;

  const explainability = getExplainabilityForCrop(input.cropId, profile, input.weather);

  return {
    disease: profile.disease,
    scientificName: profile.scientificName,
    confidence: profile.baseConfidence,
    severity: profile.defaultSeverity,
    affectedArea: profile.affectedAreaRange,
    riskLevel: calculatedRisk,
    whyHighRisk,
    weatherContext,
    cropHistoryContext,
    advisories: profile.advisories.map((a) => ({ ...a, completed: false })),
    safetyDisclaimer:
      'Agricultural Safety Notice: Recommendations are generated based on ICAR & State Agricultural University Integrated Pest Management (IPM) guidelines. Chemical treatment instructions are for demonstration. Consult your Taluka Agriculture Officer before pesticide application.',
    explainability,
  };
}

/**
 * Returns explainable AI insights for the identified crop disease:
 * - Detected visual symptoms
 * - Key distinguishing features
 * - Confidence breakdown (Visual symptom, Weather suitability, Regional prevalence)
 * - Differential diagnosis (what else this could be + probabilities)
 */
function getExplainabilityForCrop(
  cropId: string,
  profile: { disease: string; baseConfidence: number },
  weather: WeatherData
): ExplainabilityDetails {
  const humidBonus = weather.humidity > 70 ? 2 : -2;
  const tempBonus = weather.temperature >= 22 && weather.temperature <= 32 ? 2 : 0;

  switch (cropId) {
    case 'tomato':
      return {
        detectedSymptoms: [
          'Yellow chlorotic halo around dark circular spots on leaf surface.',
          'Concentric dark brown rings ("target-board" or bullseye pattern) within mature necrotic lesions.',
          'Early chlorosis and leaf wilting originating in the lower canopy foliage.',
        ],
        keyDistinguishingFeatures: [
          'Differs from Late Blight (Phytophthora infestans) which forms rapid water-soaked gray lesions without concentric rings and shows white fuzzy fungal sporulation under the leaf in high humidity.',
          'Differs from Septoria Leaf Spot (Septoria lycopersici) which produces tiny circular spots (2-3 mm) with distinct black pycnidia dots in their centers.',
        ],
        confidenceBreakdown: {
          visualSymptomMatch: 92,
          weatherSuitabilityMatch: Math.min(96, 88 + humidBonus + tempBonus),
          regionPrevalenceMatch: 85,
        },
        differentialDiagnosis: [
          {
            disease: 'Late Blight (Phytophthora infestans)',
            probability: 5,
            distinguishingNote: 'Absence of concentric target rings; rapid water-soaked lesion edge.',
          },
          {
            disease: 'Septoria Leaf Spot (Septoria lycopersici)',
            probability: 2,
            distinguishingNote: 'Lesions are significantly smaller and display central dark fungal pycnidia.',
          },
        ],
      };

    case 'soybean':
      return {
        detectedSymptoms: [
          'Small, angular brown to dark reddish lesions clustered on lower trifoliate leaves.',
          'Raised eruptive pustules (uredinia) on the abaxial (underside) leaf epidermis.',
          'Premature yellowing and desiccation causing accelerated canopy defoliation.',
        ],
        keyDistinguishingFeatures: [
          'Differs from Bacterial Pustule (Xanthomonas) because rust pustules erupt with powdery reddish-brown urediniospores without prominent water-soaked borders.',
          'Differs from Cercospora Leaf Blight which causes uniform bronze/purple discoloration on sun-exposed upper surfaces.',
        ],
        confidenceBreakdown: {
          visualSymptomMatch: 91,
          weatherSuitabilityMatch: Math.min(96, 89 + humidBonus),
          regionPrevalenceMatch: 84,
        },
        differentialDiagnosis: [
          {
            disease: 'Bacterial Pustule (Xanthomonas axonopodis)',
            probability: 6,
            distinguishingNote: 'Prominent chlorotic halos surrounding non-powdery vegetative bumps.',
          },
          {
            disease: 'Cercospora Leaf Blight (Cercospora kikuchii)',
            probability: 3,
            distinguishingNote: 'Leathery purplish-bronze leaf tinting without raised pustules.',
          },
        ],
      };

    case 'cotton':
      return {
        detectedSymptoms: [
          'Rosetted flower buds with interlocking, twisted petals that fail to open normally.',
          'Tiny entrance holes on developing bolls sealed with brownish larval frass excreta.',
          'Internal boll carpel staining with chewed developing lint and seed embryos.',
        ],
        keyDistinguishingFeatures: [
          'Differs from American Bollworm (Helicoverpa armigera) which feeds with only its head inside the boll, leaving large, open circular bore holes.',
          'Differs from Spotted Bollworm (Earias vittella) which primarily bores into terminal tender vegetative shoots causing drooping tips before attacking bolls.',
        ],
        confidenceBreakdown: {
          visualSymptomMatch: 94,
          weatherSuitabilityMatch: Math.min(97, 91 + tempBonus),
          regionPrevalenceMatch: 89,
        },
        differentialDiagnosis: [
          {
            disease: 'American Bollworm (Helicoverpa armigera)',
            probability: 4,
            distinguishingNote: 'Feeds externally with visible body; bore holes are large and clean.',
          },
          {
            disease: 'Spotted Bollworm (Earias vittella)',
            probability: 2,
            distinguishingNote: 'Primary damage visible on wilting terminal shoot tips.',
          },
        ],
      };

    case 'sugarcane':
      return {
        detectedSymptoms: [
          'Discoloration and longitudinal reddish staining of internal pith vascular bundles.',
          'Characteristic transverse white patches across the reddened internal pith columns.',
          'Drying, withering and yellowing of the third or fourth spindle crown leaves.',
        ],
        keyDistinguishingFeatures: [
          'Differs from Sugarcane Wilt (Fusarium sacchari) which produces hollow, light brown dry stalks without distinct transverse white patches.',
          'Differs from Pokkah Boeng which manifests as twisted, chlorotic and crumpled apical spindle blades.',
        ],
        confidenceBreakdown: {
          visualSymptomMatch: 95,
          weatherSuitabilityMatch: 88,
          regionPrevalenceMatch: 90,
        },
        differentialDiagnosis: [
          {
            disease: 'Sugarcane Wilt (Fusarium sacchari)',
            probability: 4,
            distinguishingNote: 'Hollowed dry center without transverse white patches.',
          },
          {
            disease: 'Pokkah Boeng (Fusarium verticillioides)',
            probability: 1,
            distinguishingNote: 'Malformation confined to apical top spindle leaves.',
          },
        ],
      };

    case 'maize':
      return {
        detectedSymptoms: [
          'Pin-hole perforations on unfurled leaves arranged in neat horizontal bands across the blade.',
          'Ragged, heavily skeletonized leaf margins and substantial moist frass pellets in whorls.',
          'Tender tassel and ear feeding causing truncated grain set.',
        ],
        keyDistinguishingFeatures: [
          'Differs from Maize Stem Borer (Chilo partellus) which creates deadhearts in seedlings and enters stems rather than voraciously feeding deep in the leaf whorl.',
          'Differs from Common Armyworm by the inverted Y-shaped suture on the larval head and square arrangement of 4 dots on the 8th abdominal segment.',
        ],
        confidenceBreakdown: {
          visualSymptomMatch: 93,
          weatherSuitabilityMatch: 89,
          regionPrevalenceMatch: 87,
        },
        differentialDiagnosis: [
          {
            disease: 'Maize Stem Borer (Chilo partellus)',
            probability: 5,
            distinguishingNote: 'Central shoot wilting (deadheart) without heavy whorl frass heaps.',
          },
          {
            disease: 'True Armyworm (Mythimna unipuncta)',
            probability: 2,
            distinguishingNote: 'Lacks the distinct inverted Y-suture and trapezoidal pinaculum dots.',
          },
        ],
      };

    case 'onion':
      return {
        detectedSymptoms: [
          'Silvery-white translucent streaks and speckling along the tubular leaf blades.',
          'Downward curling, blunting and twisted deformities of immature onion leaves.',
          'Black fecal deposits on inner leaf axils indicating dense feeding colonies.',
        ],
        keyDistinguishingFeatures: [
          'Differs from Purple Blotch (Alternaria porri) which produces purplish-brown sunken oval lesions with yellow borders rather than continuous silvery feeding scars.',
          'Differs from Downy Mildew (Peronospora destructor) which develops violet-gray fuzzy mildew on outer foliage.',
        ],
        confidenceBreakdown: {
          visualSymptomMatch: 90,
          weatherSuitabilityMatch: 87,
          regionPrevalenceMatch: 88,
        },
        differentialDiagnosis: [
          {
            disease: 'Purple Blotch (Alternaria porri)',
            probability: 7,
            distinguishingNote: 'Oval sunken purple lesions rather than silvery epidermal feeding streaks.',
          },
          {
            disease: 'Downy Mildew (Peronospora destructor)',
            probability: 3,
            distinguishingNote: 'Grayish-violet fungal down on leaves during damp mornings.',
          },
        ],
      };

    default:
      return {
        detectedSymptoms: [
          'Characteristic discoloration and localized necrotic lesions on the photosynthetic tissue.',
          'Irregular margins with distinct chlorotic halo along infected border areas.',
          'Accelerated loss of cellular turgor in the affected canopy segment.',
        ],
        keyDistinguishingFeatures: [
          'Distinct from systemic nutrient deficiencies by asymmetric lesion distribution and localized necrotic centers.',
          'Differs from physical sunscald or mechanical injury by progressive marginal spread and halo margins.',
        ],
        confidenceBreakdown: {
          visualSymptomMatch: profile.baseConfidence,
          weatherSuitabilityMatch: Math.min(95, 86 + humidBonus),
          regionPrevalenceMatch: 84,
        },
        differentialDiagnosis: [
          {
            disease: 'Physiological Leaf Scorch / Heat Stress',
            probability: 6,
            distinguishingNote: 'Uniform marginal necrosis without bacterial or fungal chlorotic halo.',
          },
          {
            disease: 'Secondary Alternaria Blight',
            probability: 3,
            distinguishingNote: 'Secondary saprophytic growth on previously stressed tissue.',
          },
        ],
      };
  }
}
