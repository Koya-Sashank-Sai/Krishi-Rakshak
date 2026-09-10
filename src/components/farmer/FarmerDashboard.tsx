import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { FarmerProfile } from '../../types';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  ScanLine,
  History,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sprout,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  Bell,
  X,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { language, t } = useLanguage();
  const {
    currentUser,
    activeWeather,
    farmerScans,
    setCurrentView,
    setSelectedCrop,
    setActiveScanRecord,
    setActivePrediction,
    setCapturedImage,
    reportedCases,
    setActiveRecommendationModalCase,
    dismissRecommendationNotification,
  } = useApp();

  const farmer = currentUser as FarmerProfile;

  const newRecCase = reportedCases.find(
    (c) => c.isNewRecommendationForFarmer && c.recommendation
  );

  const handleStartScan = () => {
    setSelectedCrop(null);
    setCapturedImage(null);
    setActivePrediction(null);
    setActiveScanRecord(null);
    setCurrentView('crop_selection');
  };

  const handleInspectHistoryItem = (scan: any) => {
    setActiveScanRecord(scan);
    setActivePrediction(scan.prediction);
    setCapturedImage(scan.imageUrl);
    setSelectedCrop({
      id: scan.cropId,
      name: scan.cropName,
      emoji: scan.cropEmoji,
      scientificName: '',
      category: 'Horticulture',
      commonDiseases: [],
    });
    if (scan.status === 'escalated' || scan.status === 'under_review' || scan.status === 'verified') {
      setCurrentView('expert_review');
    } else {
      setCurrentView('analysis_result');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm shrink-0">
            <Sprout className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                {t.farmerBadge}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Language: <strong className="text-emerald-800 uppercase">{language}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1 font-serif">
              {t.welcomeFarmer}, {farmer?.name || 'Kisan'}
            </h1>
            <div className="flex items-center text-xs text-gray-600 mt-1 space-x-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                Village: <strong className="text-gray-900">{farmer?.village || 'Aabithkhind'}</strong> &bull; District: <strong className="text-gray-900">{farmer?.district || 'Ahmednagar'}</strong>, Maharashtra
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          id="dashboard-start-scan-btn"
          onClick={handleStartScan}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer group shrink-0"
        >
          <ScanLine className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
          <span>{t.startScanBtn}</span>
          <ArrowRight className="w-4 h-4 text-emerald-300" />
        </button>
      </div>

      {/* New Expert Recommendation Notification Banner */}
      {newRecCase && (
        <div
          id="farmer-recommendation-alert-banner"
          className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-4 sm:p-5 shadow-md border-2 border-emerald-500/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-700/90 border border-emerald-400/50 flex items-center justify-center shrink-0 text-white shadow-inner">
              <Bell className="w-6 h-6 text-emerald-200 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/50">
                  🔔 1 New Expert Recommendation
                </span>
                <span className="text-xs text-emerald-200 font-mono">Case #{newRecCase.id}</span>
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                Officer {newRecCase.verifiedBy || 'Dr. Vivek S. Kulkarni'} sent verified action steps for {newRecCase.cropName} ({newRecCase.disease}).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="view-expert-recommendation-btn"
              onClick={() => setActiveRecommendationModalCase(newRecCase)}
              className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Open Recommendation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="dismiss-recommendation-banner-btn"
              onClick={() => dismissRecommendationNotification(newRecCase.id)}
              className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-700/60 rounded-xl transition-colors cursor-pointer"
              title="Dismiss notification badge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Local Agro-Weather & Microclimate Risk Card (Automatically derived from District + Village) */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                {t.localWeatherSummary}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{t.weatherDerivedNote}</p>
          </div>
          <span className="inline-flex items-center text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
            📍 {farmer?.district} &rarr; {farmer?.village}
          </span>
        </div>

        {activeWeather ? (
          <div className="mt-4 space-y-4">
            {/* 4 Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-emerald-800 font-semibold mb-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>{t.temperature}</span>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {activeWeather.temperature}°C
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">Canopy Thermal</div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-emerald-800 font-semibold mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{t.humidity}</span>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {activeWeather.humidity}%
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">Relative Humidity</div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-emerald-800 font-semibold mb-1">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>{t.rainfall}</span>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {activeWeather.rainfall} <span className="text-sm font-semibold">mm</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">24hr Precipitation</div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-emerald-800 font-semibold mb-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>{t.windSpeed}</span>
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {activeWeather.windSpeed} <span className="text-sm font-semibold">km/h</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">Surface Velocity</div>
              </div>
            </div>

            {/* Weather Risk Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5 text-amber-900">
                  {t.weatherRiskNote}: {activeWeather.condition}
                </strong>
                <p className="text-amber-900/90 leading-relaxed">
                  {activeWeather.riskFactorSummary}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-gray-500">
            Deriving microclimate variables for {farmer?.village}...
          </div>
        )}
      </div>

      {/* Main Scan Banner / Quick Action Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/80 border border-emerald-500/40 text-emerald-200 text-xs px-3 py-1 rounded-full font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Powered Detection Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            {t.newCropScan}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl leading-relaxed">
            {t.newCropScanDesc}
          </p>
        </div>

        <button
          id="hero-scan-crop-btn"
          onClick={handleStartScan}
          className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer shrink-0 flex items-center space-x-2"
        >
          <ScanLine className="w-4 h-4 text-emerald-700" />
          <span>{t.startScanBtn}</span>
        </button>
      </div>

      {/* Recent Crop Diagnostics & History */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {t.recentActivity}
            </h2>
          </div>
          <button
            id="view-all-history-btn"
            onClick={() => setCurrentView('farmer_history')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
          >
            <span>{t.viewAllHistory}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {farmerScans.length === 0 ? (
          <div className="py-12 text-center">
            <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600">{t.noScansYet}</p>
            <button
              onClick={handleStartScan}
              className="mt-3 text-xs font-bold text-emerald-800 hover:underline"
            >
              + {t.startScanBtn}
            </button>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-gray-100">
            {farmerScans.slice(0, 3).map((scan) => (
              <div
                key={scan.id}
                onClick={() => handleInspectHistoryItem(scan)}
                className="py-3.5 flex items-center justify-between hover:bg-emerald-50/40 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="text-3xl p-2 bg-emerald-50 rounded-xl border border-emerald-100 shrink-0">
                    {scan.cropEmoji}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-gray-900 group-hover:text-emerald-900">
                        {scan.cropName} &bull; {scan.prediction.disease}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          scan.prediction.riskLevel === 'HIGH'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : scan.prediction.riskLevel === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {scan.prediction.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{scan.timestamp}</span>
                      </span>
                      <span>Confidence: {scan.prediction.confidence}%</span>
                      <span>Severity: {scan.prediction.severity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      scan.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : scan.status === 'escalated' || scan.status === 'under_review'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {scan.status === 'verified'
                      ? 'Verified by Officer'
                      : scan.status === 'escalated'
                      ? 'Under Review'
                      : 'Self Diagnosed'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
