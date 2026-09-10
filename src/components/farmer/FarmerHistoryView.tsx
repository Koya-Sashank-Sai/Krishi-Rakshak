import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import {
  History,
  ArrowLeft,
  Filter,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Sprout,
  ScanLine,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function FarmerHistoryView() {
  const { t } = useLanguage();
  const {
    farmerScans,
    setCurrentView,
    setActiveScanRecord,
    setActivePrediction,
    setCapturedImage,
    setSelectedCrop,
    reportedCases,
    setActiveRecommendationModalCase,
  } = useApp();

  const [selectedCropFilter, setSelectedCropFilter] = useState('all');

  const casesWithRecommendations = reportedCases.filter((c) => !!c.recommendation);

  const filteredScans = farmerScans.filter((scan) => {
    if (selectedCropFilter === 'all') return true;
    return scan.cropId === selectedCropFilter;
  });

  const handleInspect = (scan: any) => {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('farmer_dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </button>

        <button
          onClick={() => {
            setSelectedCrop(null);
            setCapturedImage(null);
            setActivePrediction(null);
            setCurrentView('crop_selection');
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <ScanLine className="w-4 h-4 text-emerald-300" />
          <span>{t.startScanBtn}</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 flex items-center space-x-2">
              <History className="w-6 h-6 text-emerald-700" />
              <span>{t.cropHistoryTitle}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.cropHistorySubtitle}
            </p>
          </div>

          {/* Crop Filter Dropdown */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">{t.allCrops}</option>
              {CROPS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Previous Expert Recommendations Card Section */}
        {casesWithRecommendations.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Previous Expert Recommendations & Officer Advisories
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {casesWithRecommendations.length} Available Offline
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Official recommendations provided by Agricultural Extension Officers remain stored locally on your device.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {casesWithRecommendations.map((recCase) => (
                <div
                  key={recCase.id}
                  className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold text-gray-500">
                        {recCase.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          recCase.farmerActionStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : recCase.farmerActionStatus === 'Action Started'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {recCase.farmerActionStatus || 'Pending'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 flex items-center space-x-1.5">
                      <span>{recCase.cropEmoji}</span>
                      <span>{recCase.cropName} &bull; {recCase.disease}</span>
                    </h4>

                    <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 italic">
                      "{recCase.recommendation || recCase.officerRemarks}"
                    </p>

                    <div className="text-[11px] text-gray-500 mt-2 flex items-center justify-between">
                      <span>By {recCase.verifiedBy || 'Agricultural Officer'}</span>
                      <span>{recCase.recommendationActionSteps?.length || 0} Action Steps</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveRecommendationModalCase(recCase)}
                    className="mt-3 w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Open Recommendation & Steps</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Table / Cards */}
        {filteredScans.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <Sprout className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold">{t.noScansYet}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Disease</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4">Advisory Status</th>
                  <th className="py-3 px-4">Expert Review</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredScans.map((scan) => {
                  const completedAdvCount =
                    scan.prediction.advisories?.filter((a) => a.completed).length || 0;
                  const totalAdvCount = scan.prediction.advisories?.length || 3;

                  return (
                    <tr
                      key={scan.id}
                      className="hover:bg-emerald-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center space-x-2">
                        <span className="text-xl">{scan.cropEmoji}</span>
                        <span>{scan.cropName}</span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{scan.timestamp.slice(0, 10)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {scan.prediction.disease}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-900">
                        {scan.prediction.confidence}%
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                            scan.prediction.severity === 'Severe'
                              ? 'bg-red-100 text-red-800'
                              : scan.prediction.severity === 'Moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {scan.prediction.severity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            scan.prediction.riskLevel === 'HIGH'
                              ? 'bg-red-600 text-white'
                              : scan.prediction.riskLevel === 'MEDIUM'
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {scan.prediction.riskLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>
                            {completedAdvCount}/{totalAdvCount} Done
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            scan.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : scan.status === 'escalated' || scan.status === 'under_review'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {scan.status === 'verified'
                            ? 'Verified'
                            : scan.status === 'escalated'
                            ? 'Under Review'
                            : 'Self Solved'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {(() => {
                            const rec = reportedCases.find(
                              (c) => (c.scanId === scan.id || c.id === scan.expertCaseId) && !!c.recommendation
                            );
                            if (rec) {
                              return (
                                <button
                                  onClick={() => setActiveRecommendationModalCase(rec)}
                                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-bold text-[11px] inline-flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                                  title="View Expert Recommendation"
                                >
                                  <UserCheck className="w-3 h-3" />
                                  <span>Advisory</span>
                                </button>
                              );
                            }
                            return null;
                          })()}
                          <button
                            onClick={() => handleInspect(scan)}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md font-semibold text-[11px] inline-flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{t.viewDetails}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
