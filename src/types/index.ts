export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'farmer' | 'officer';

export interface FarmerProfile {
  id: string;
  name: string;
  mobile: string;
  district: string;
  village: string;
  role: 'farmer';
}

export interface OfficerProfile {
  id: string;
  officerId: string;
  name: string;
  district: string;
  department: string;
  role: 'officer';
}

export type User = FarmerProfile | OfficerProfile;

export interface CropInfo {
  id: string;
  name: string;
  emoji: string;
  scientificName: string;
  category: 'Cereal' | 'Pulse' | 'Oilseed' | 'Cash' | 'Horticulture' | 'Vegetable';
  commonDiseases: string[];
}

export interface WeatherData {
  district: string;
  village: string;
  temperature: number; // °C
  humidity: number; // %
  rainfall: number; // mm
  condition: string;
  windSpeed: number; // km/h
  riskFactorSummary: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type SeverityLevel = 'Mild' | 'Moderate' | 'Severe';

export interface AdvisoryItem {
  id: string;
  text: string;
  category: 'cultural' | 'biological' | 'monitoring' | 'chemical_demo';
  completed: boolean;
}

export interface DifferentialDiagnosisItem {
  disease: string;
  probability: number;
  distinguishingNote: string;
}

export interface ExplainabilityDetails {
  detectedSymptoms: string[];
  keyDistinguishingFeatures: string[];
  confidenceBreakdown: {
    visualSymptomMatch: number;
    weatherSuitabilityMatch: number;
    regionPrevalenceMatch: number;
  };
  differentialDiagnosis: DifferentialDiagnosisItem[];
}

export interface DiseasePrediction {
  disease: string;
  scientificName?: string;
  confidence: number; // e.g. 92%
  severity: SeverityLevel;
  affectedArea: string; // e.g. "15-20% leaf canopy"
  riskLevel: RiskLevel;
  whyHighRisk: string[];
  weatherContext: string;
  cropHistoryContext: string;
  advisories: AdvisoryItem[];
  safetyDisclaimer: string;
  explainability?: ExplainabilityDetails;
}

export interface CropScanRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  cropId: string;
  cropName: string;
  cropEmoji: string;
  district: string;
  village: string;
  timestamp: string;
  imageUrl: string;
  prediction: DiseasePrediction;
  status: 'scanned' | 'escalated' | 'under_review' | 'verified' | 'rejected';
  expertCaseId?: string;
}

export type CaseStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Action Started'
  | 'Completed';

export interface ReportedCase {
  id: string;
  scanId: string;
  farmerName: string;
  farmerMobile: string;
  cropName: string;
  cropEmoji: string;
  disease: string;
  severity: SeverityLevel;
  confidence: number;
  district: string;
  village: string;
  affectedArea: string;
  status: CaseStatus;
  submissionDate: string;
  imageUrl: string;
  farmerNotes?: string;
  officerRemarks?: string;
  recommendation?: string;
  recommendationActionSteps?: string[];
  recommendationDate?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  farmerActionStatus?: 'Pending' | 'Action Started' | 'Completed';
  isNewRecommendationForFarmer?: boolean;
}

export interface HotspotPoint {
  id: string;
  district: string;
  village: string;
  lat: number;
  lng: number;
  crop: string;
  disease: string;
  casesCount: number;
  severity: SeverityLevel;
  riskLevel: RiskLevel;
  trend: 'Increasing' | 'Stable' | 'Declining';
}

export interface OfficerFilters {
  district: string;
  village: string;
  crop: string;
}

export type NotificationType = 'risk_change' | 'expert_recommendation' | 'weather_alert';

export interface FarmerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedCaseId?: string;
  targetView?: 'advisory' | 'expert_recommendation' | 'weather';
}
