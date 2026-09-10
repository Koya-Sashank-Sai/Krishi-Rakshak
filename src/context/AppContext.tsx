import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CropInfo,
  CropScanRecord,
  DiseasePrediction,
  FarmerProfile,
  HotspotPoint,
  OfficerFilters,
  OfficerProfile,
  ReportedCase,
  User,
  WeatherData,
  FarmerNotification,
} from '../types';
import {
  CROPS_DATA,
  INITIAL_HOTSPOTS,
  INITIAL_REPORTED_CASES,
} from '../data/mockData';
import { getWeatherByLocation } from '../services/weatherService';

export type AppView =
  | 'role_language_selection'
  | 'farmer_auth'
  | 'officer_auth'
  | 'farmer_dashboard'
  | 'crop_selection'
  | 'scan_upload'
  | 'analysis_result'
  | 'advisory'
  | 'expert_review'
  | 'farmer_history'
  | 'officer_dashboard';

export type OfficerTab =
  | 'home'
  | 'reports'
  | 'farmer_info'
  | 'reported_cases'
  | 'settings';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Farmer workflows
  selectedCrop: CropInfo | null;
  setSelectedCrop: (crop: CropInfo | null) => void;
  capturedImage: string | null;
  setCapturedImage: (img: string | null) => void;
  activePrediction: DiseasePrediction | null;
  setActivePrediction: (pred: DiseasePrediction | null) => void;
  activeScanRecord: CropScanRecord | null;
  setActiveScanRecord: (record: CropScanRecord | null) => void;
  activeWeather: WeatherData | null;
  farmerScans: CropScanRecord[];

  // Officer workflows
  officerTab: OfficerTab;
  setOfficerTab: (tab: OfficerTab) => void;
  officerFilters: OfficerFilters;
  setOfficerFilters: React.Dispatch<React.SetStateAction<OfficerFilters>>;
  officerDistrict: string;
  setOfficerDistrict: (d: string) => void;
  officerVillage: string;
  setOfficerVillage: (v: string) => void;
  officerCrop: string;
  setOfficerCrop: (c: string) => void;
  reportedCases: ReportedCase[];
  hotspots: HotspotPoint[];
  selectedHotspot: HotspotPoint | null;
  setSelectedHotspot: (hp: HotspotPoint | null) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  farmerDirectory: {
    id: string;
    name: string;
    cropName: string;
    diseaseInfected: string;
    scanCount: number;
    district: string;
    village: string;
  }[];

  farmerNotifications: FarmerNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activeRecommendationModalCase: ReportedCase | null;
  setActiveRecommendationModalCase: (c: ReportedCase | null) => void;

  // Actions
  loginFarmer: (farmer: FarmerProfile) => void;
  loginOfficer: (officer: OfficerProfile) => void;
  logout: () => void;
  toggleAdvisoryTask: (advisoryId: string) => void;
  escalateCaseToExpert: (farmerNotes: string) => Promise<string>;
  verifyOfficerCase: (
    caseId: string,
    remarks: string,
    status: 'Verified' | 'Rejected'
  ) => void;
  verifyReportedCase: (
    caseId: string,
    status: 'Under Review' | 'Verified' | 'Rejected',
    remarks: string
  ) => void;
  sendOfficerRecommendation: (
    caseId: string,
    recommendation: string,
    actionSteps: string[]
  ) => void;
  updateFarmerActionStatus: (
    caseId: string,
    actionStatus: 'Action Started' | 'Completed'
  ) => void;
  dismissRecommendationNotification: (caseId: string) => void;
  addNewScanRecord: (record: CropScanRecord) => void;
  refreshWeather: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check persisted user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('krishi_rakshak_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const saved = localStorage.getItem('krishi_rakshak_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'officer' ? 'officer_dashboard' : 'farmer_dashboard';
      }
    } catch {
      // Fall through
    }
    return 'role_language_selection';
  });

  // Farmer specific states
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activePrediction, setActivePrediction] = useState<DiseasePrediction | null>(null);
  const [activeScanRecord, setActiveScanRecord] = useState<CropScanRecord | null>(null);
  const [activeWeather, setActiveWeather] = useState<WeatherData | null>(null);

  // Scans history
  const [farmerScans, setFarmerScans] = useState<CropScanRecord[]>(() => {
    try {
      const saved = localStorage.getItem('krishi_rakshak_scans');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall through
    }
    return [
      {
        id: 'scan-init-hist-1',
        farmerId: 'farmer-101',
        farmerName: 'Dnyaneshwar Shinde',
        farmerMobile: '9822104512',
        cropId: 'cotton',
        cropName: 'Cotton',
        cropEmoji: '🧵',
        district: 'Ahmednagar',
        village: 'Aabithkhind',
        timestamp: '2026-09-08 14:30',
        imageUrl:
          'https://images.unsplash.com/photo-1599818816934-2e6734138e6e?w=600&auto=format&fit=crop&q=80',
        prediction: {
          disease: 'Pink Bollworm Infestation',
          scientificName: 'Pectinophora gossypiella',
          confidence: 94,
          severity: 'Severe',
          affectedArea: '22% fruiting squares',
          riskLevel: 'HIGH',
          whyHighRisk: [
            'Warm humid nights in Aabithkhind trigger peak moth oviposition.',
            'Surveillance threshold exceeded (>8 moths/trap/night).',
          ],
          weatherContext:
            'Humid & Overcast with Intermittent Drizzle. Relative humidity 78%.',
          cropHistoryContext: 'Initial escalation logged.',
          advisories: [
            {
              id: 'a1',
              text: 'Install Gossyplure pheromone traps at 5 units/acre.',
              category: 'biological',
              completed: true,
            },
            {
              id: 'a2',
              text: 'Collect and destroy rosette flowers manually.',
              category: 'cultural',
              completed: true,
            },
          ],
          safetyDisclaimer: 'Official KVK guidance recommended.',
        },
        status: 'escalated',
        expertCaseId: 'KR-CASE-2026-081',
      },
    ];
  });

  // Officer States
  const [officerTab, setOfficerTab] = useState<OfficerTab>('home');
  const [officerFilters, setOfficerFilters] = useState<OfficerFilters>({
    district: 'Ahmednagar',
    village: 'Aabithkhind',
    crop: 'All',
  });

  const [reportedCases, setReportedCases] = useState<ReportedCase[]>(() => {
    try {
      const saved = localStorage.getItem('krishi_rakshak_cases');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall through
    }
    return INITIAL_REPORTED_CASES;
  });

  const [hotspots] = useState<HotspotPoint[]>(INITIAL_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPoint | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Farmer Notifications (persistent even offline)
  const [farmerNotifications, setFarmerNotifications] = useState<FarmerNotification[]>(() => {
    try {
      const saved = localStorage.getItem('krishi_rakshak_notifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall through
    }
    return [
      {
        id: 'notif-1',
        type: 'expert_recommendation',
        title: 'Expert Recommendation Available',
        message: 'Officer verified case KR-CASE-2026-081 and sent advisory.',
        timestamp: '10 mins ago',
        read: false,
        relatedCaseId: 'KR-CASE-2026-081',
        targetView: 'expert_recommendation',
      },
      {
        id: 'notif-2',
        type: 'risk_change',
        title: 'Risk Level Changed',
        message: 'Risk increased from Moderate to High due to rain and high humidity (88%).',
        timestamp: '2 hours ago',
        read: false,
        targetView: 'advisory',
      },
      {
        id: 'notif-3',
        type: 'weather_alert',
        title: 'Weather Advisory Alert',
        message: 'Heavy rain forecast for Sangamner. High fungal disease risk.',
        timestamp: 'Yesterday',
        read: true,
        targetView: 'weather',
      },
    ];
  });

  const [activeRecommendationModalCase, setActiveRecommendationModalCase] = useState<ReportedCase | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('krishi_rakshak_notifications', JSON.stringify(farmerNotifications));
    } catch {
      // ignore
    }
  }, [farmerNotifications]);

  const unreadNotificationCount = farmerNotifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setFarmerNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setFarmerNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Helper getters/setters for officer global filters
  const officerDistrict = officerFilters.district;
  const setOfficerDistrict = (d: string) => {
    setOfficerFilters((prev) => ({ ...prev, district: d }));
  };

  const officerVillage = officerFilters.village;
  const setOfficerVillage = (v: string) => {
    setOfficerFilters((prev) => ({ ...prev, village: v }));
  };

  const officerCrop = officerFilters.crop;
  const setOfficerCrop = (c: string) => {
    setOfficerFilters((prev) => ({ ...prev, crop: c }));
  };

  // Farmer Directory derived from known farmers & scans
  const farmerDirectory = [
    {
      id: 'farmer-101',
      name: 'Dnyaneshwar Shinde',
      cropName: 'Cotton',
      diseaseInfected: 'Pink Bollworm',
      scanCount: 4,
      district: 'Ahmednagar',
      village: 'Aabithkhind',
    },
    {
      id: 'farmer-102',
      name: 'Rameshwar Patil',
      cropName: 'Soybean',
      diseaseInfected: 'Yellow Mosaic Virus',
      scanCount: 3,
      district: 'Ahmednagar',
      village: 'Aabithkhind',
    },
    {
      id: 'farmer-103',
      name: 'Sunita Tukaram Gaikwad',
      cropName: 'Tomato',
      diseaseInfected: 'Early Blight',
      scanCount: 6,
      district: 'Ahmednagar',
      village: 'Akole',
    },
    {
      id: 'farmer-104',
      name: 'Bhausaheb Thorat',
      cropName: 'Cotton',
      diseaseInfected: 'Bacterial Blight',
      scanCount: 2,
      district: 'Ahmednagar',
      village: 'Sangamner',
    },
    {
      id: 'farmer-105',
      name: 'Anandrao Deshmukh',
      cropName: 'Onion',
      diseaseInfected: 'Purple Blotch',
      scanCount: 5,
      district: 'Nashik',
      village: 'Pimpalgaon',
    },
    {
      id: 'farmer-106',
      name: 'Kashinath Jagtap',
      cropName: 'Pigeon Pea',
      diseaseInfected: 'Fusarium Wilt',
      scanCount: 1,
      district: 'Pune',
      village: 'Baramati',
    },
  ];

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('krishi_rakshak_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('krishi_rakshak_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('krishi_rakshak_scans', JSON.stringify(farmerScans));
  }, [farmerScans]);

  useEffect(() => {
    localStorage.setItem('krishi_rakshak_cases', JSON.stringify(reportedCases));
  }, [reportedCases]);

  // Load weather when farmer logs in or district/village changes
  const refreshWeather = async () => {
    if (currentUser && currentUser.role === 'farmer') {
      const w = await getWeatherByLocation(
        currentUser.district,
        currentUser.village
      );
      setActiveWeather(w);
    } else {
      const w = await getWeatherByLocation(
        officerFilters.district,
        officerFilters.village || 'Aabithkhind'
      );
      setActiveWeather(w);
    }
  };

  useEffect(() => {
    refreshWeather();
  }, [
    currentUser?.district,
    (currentUser as FarmerProfile)?.village,
    officerFilters.district,
    officerFilters.village,
  ]);

  const loginFarmer = (farmer: FarmerProfile) => {
    setCurrentUser(farmer);
    setCurrentView('farmer_dashboard');
    getWeatherByLocation(farmer.district, farmer.village).then((w) =>
      setActiveWeather(w)
    );
  };

  const loginOfficer = (officer: OfficerProfile) => {
    setCurrentUser(officer);
    setOfficerFilters((prev) => ({
      ...prev,
      district: officer.district,
      village: 'Aabithkhind',
    }));
    setCurrentView('officer_dashboard');
    setOfficerTab('home');
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedCrop(null);
    setCapturedImage(null);
    setActivePrediction(null);
    setActiveScanRecord(null);
    setCurrentView('role_language_selection');
  };

  const toggleAdvisoryTask = (advisoryId: string) => {
    if (!activePrediction) return;
    const updatedAdvisories = activePrediction.advisories.map((adv) =>
      adv.id === advisoryId ? { ...adv, completed: !adv.completed } : adv
    );
    const updatedPrediction = {
      ...activePrediction,
      advisories: updatedAdvisories,
    };
    setActivePrediction(updatedPrediction);

    // Also update current active scan record and history if exists
    if (activeScanRecord) {
      const updatedRecord = {
        ...activeScanRecord,
        prediction: updatedPrediction,
      };
      setActiveScanRecord(updatedRecord);
      setFarmerScans((prev) =>
        prev.map((s) => (s.id === updatedRecord.id ? updatedRecord : s))
      );
    }
  };

  const addNewScanRecord = (record: CropScanRecord) => {
    setActiveScanRecord(record);
    setFarmerScans((prev) => [record, ...prev]);
  };

  const escalateCaseToExpert = async (farmerNotes: string): Promise<string> => {
    const caseId = `KR-CASE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const farmer = currentUser as FarmerProfile;

    const newCase: ReportedCase = {
      id: caseId,
      scanId: activeScanRecord?.id || `scan-${Date.now()}`,
      farmerName: farmer?.name || 'Registered Farmer',
      farmerMobile: farmer?.mobile || '9822104512',
      cropName: selectedCrop?.name || 'Crop',
      cropEmoji: selectedCrop?.emoji || '🌾',
      disease: activePrediction?.disease || 'Identified Infestation',
      severity: activePrediction?.severity || 'Moderate',
      confidence: activePrediction?.confidence || 90,
      district: farmer?.district || 'Ahmednagar',
      village: farmer?.village || 'Aabithkhind',
      affectedArea: activePrediction?.affectedArea || '15-20% canopy',
      status: 'Submitted',
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      imageUrl:
        capturedImage ||
        'https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=600&auto=format&fit=crop&q=80',
      farmerNotes: farmerNotes || 'Requesting expert field guidance and verification.',
    };

    setReportedCases((prev) => [newCase, ...prev]);

    if (activeScanRecord) {
      const updatedRecord: CropScanRecord = {
        ...activeScanRecord,
        status: 'escalated',
        expertCaseId: caseId,
      };
      setActiveScanRecord(updatedRecord);
      setFarmerScans((prev) =>
        prev.map((s) => (s.id === updatedRecord.id ? updatedRecord : s))
      );
    }

    return caseId;
  };

  const verifyOfficerCase = (
    caseId: string,
    remarks: string,
    status: 'Verified' | 'Rejected'
  ) => {
    const officer = currentUser as OfficerProfile;
    setReportedCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status,
            officerRemarks: remarks,
            verifiedBy: officer?.name || 'Agricultural Officer',
            verifiedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return c;
      })
    );

    // Also update any matching farmer scan in history
    setFarmerScans((prev) =>
      prev.map((s) => {
        if (s.expertCaseId === caseId) {
          return {
            ...s,
            status: status === 'Verified' ? 'verified' : 'rejected',
          };
        }
        return s;
      })
    );

    // If the active scan matches this case, update it too
    if (activeScanRecord && activeScanRecord.expertCaseId === caseId) {
      setActiveScanRecord((prev) =>
        prev ? { ...prev, status: status === 'Verified' ? 'verified' : 'rejected' } : null
      );
    }
  };

  const verifyReportedCase = (
    caseId: string,
    status: 'Under Review' | 'Verified' | 'Rejected',
    remarks: string
  ) => {
    const officer = currentUser as OfficerProfile;
    setReportedCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status,
            officerRemarks: remarks,
            verifiedBy: officer?.name || 'Agricultural Officer',
            verifiedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return c;
      })
    );

    // Also update any matching farmer scan in history
    setFarmerScans((prev) =>
      prev.map((s) => {
        if (s.expertCaseId === caseId) {
          return {
            ...s,
            status: status === 'Verified' ? 'verified' : status === 'Under Review' ? 'under_review' : 'rejected',
          };
        }
        return s;
      })
    );

    if (activeScanRecord && activeScanRecord.expertCaseId === caseId) {
      setActiveScanRecord((prev) =>
        prev
          ? {
              ...prev,
              status: status === 'Verified' ? 'verified' : status === 'Under Review' ? 'under_review' : 'rejected',
            }
          : null
      );
    }
  };

  const sendOfficerRecommendation = (
    caseId: string,
    recommendation: string,
    actionSteps: string[]
  ) => {
    const officer = currentUser as OfficerProfile;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setReportedCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'Verified' as const,
            recommendation,
            recommendationActionSteps: actionSteps,
            recommendationDate: now,
            officerRemarks: recommendation,
            verifiedBy: officer?.name || 'Agricultural Officer',
            verifiedDate: now,
            isNewRecommendationForFarmer: true,
            farmerActionStatus: 'Pending' as const,
          };
        }
        return c;
      })
    );

    // Also update any matching scan in farmerScans
    setFarmerScans((prev) =>
      prev.map((s) => {
        if (s.expertCaseId === caseId) {
          return {
            ...s,
            status: 'verified' as const,
          };
        }
        return s;
      })
    );

    // Also add notification for the farmer
    setFarmerNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        type: 'expert_recommendation',
        title: 'Expert Recommendation Available',
        message: `Officer verified case ${caseId} and sent advisory.`,
        timestamp: 'Just now',
        read: false,
        relatedCaseId: caseId,
        targetView: 'expert_recommendation',
      },
      ...prev,
    ]);
  };

  const updateFarmerActionStatus = (
    caseId: string,
    actionStatus: 'Action Started' | 'Completed'
  ) => {
    setReportedCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: actionStatus,
            farmerActionStatus: actionStatus,
            isNewRecommendationForFarmer: false,
          };
        }
        return c;
      })
    );
  };

  const dismissRecommendationNotification = (caseId: string) => {
    setReportedCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, isNewRecommendationForFarmer: false } : c))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        selectedCrop,
        setSelectedCrop,
        capturedImage,
        setCapturedImage,
        activePrediction,
        setActivePrediction,
        activeScanRecord,
        setActiveScanRecord,
        activeWeather,
        farmerScans,
        officerTab,
        setOfficerTab,
        officerFilters,
        setOfficerFilters,
        officerDistrict,
        setOfficerDistrict,
        officerVillage,
        setOfficerVillage,
        officerCrop,
        setOfficerCrop,
        isSettingsOpen,
        setIsSettingsOpen,
        farmerDirectory,
        reportedCases,
        hotspots,
        selectedHotspot,
        setSelectedHotspot,
        loginFarmer,
        loginOfficer,
        logout,
        toggleAdvisoryTask,
        escalateCaseToExpert,
        verifyOfficerCase,
        verifyReportedCase,
        sendOfficerRecommendation,
        updateFarmerActionStatus,
        dismissRecommendationNotification,
        farmerNotifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeRecommendationModalCase,
        setActiveRecommendationModalCase,
        addNewScanRecord,
        refreshWeather,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
