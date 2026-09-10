import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { FarmerProfile, ReportedCase } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowLeft,
  FileText,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
} from 'lucide-react';

export default function ExpertReviewView() {
  const { t } = useLanguage();
  const {
    activeScanRecord,
    reportedCases,
    currentUser,
    setCurrentView,
  } = useApp();

  const [notificationActive, setNotificationActive] = useState(false);
  const [notificationToast, setNotificationToast] = useState(false);

  const farmer = currentUser as FarmerProfile;

  // Find the reported case matching activeScanRecord or take the latest
  const fallbackCase: ReportedCase = {
    id: 'KR-CASE-2026-081',
    scanId: 'scan-init-hist-1',
    farmerName: farmer?.name || 'Dnyaneshwar Shinde',
    farmerMobile: farmer?.mobile || '9822104512',
    cropName: activeScanRecord?.cropName || 'Cotton',
    cropEmoji: activeScanRecord?.cropEmoji || '🧵',
    disease: activeScanRecord?.prediction.disease || 'Pink Bollworm Infestation',
    severity: activeScanRecord?.prediction.severity || 'Severe',
    confidence: activeScanRecord?.prediction.confidence || 94,
    district: farmer?.district || 'Ahmednagar',
    village: farmer?.village || 'Aabithkhind',
    affectedArea: activeScanRecord?.prediction.affectedArea || '20-25% square canopy',
    status: 'Submitted',
    submissionDate: '2026-09-08 14:30',
    imageUrl:
      activeScanRecord?.imageUrl ||
      'https://images.unsplash.com/photo-1599818816934-2e6734138e6e?w=600&auto=format&fit=crop&q=80',
    officerRemarks: 'Gossyplure pheromone trap deployment verified. Recommended biological spray with Beauveria bassiana 5g/L.',
    verifiedBy: 'Dr. Vivek S. Kulkarni',
    verifiedDate: '2026-09-08 17:15',
  };

  const currentCase: ReportedCase =
    reportedCases.find((c) => c.scanId === activeScanRecord?.id) ||
    reportedCases[0] ||
    fallbackCase;

  const currentStatus = currentCase.status || 'Submitted';

  const handleToggleNotification = () => {
    setNotificationActive(!notificationActive);
    setNotificationToast(true);
    setTimeout(() => setNotificationToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('farmer_dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </button>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
          Case Status: {currentStatus}
        </span>
      </div>

      {/* Main Review Container */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-emerald-900 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-300 font-semibold mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{t.caseIdLabel}: {currentCase.id}</span>
              </div>
              <h1 className="text-2xl font-extrabold font-serif">
                {t.underReviewTitle}
              </h1>
              <p className="text-xs text-emerald-200 mt-0.5">
                {t.underReviewSubtitle}
              </p>
            </div>

            <div className="self-start sm:self-auto">
              <span className="px-3 py-1 bg-emerald-800 border border-emerald-600/50 rounded-full text-xs font-semibold text-emerald-200">
                Taluka: {currentCase.district}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Timeline: SUBMITTED -> UNDER REVIEW -> VERIFIED */}
          <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6 text-center">
              Official Escalation Timeline
            </h3>

            <div className="relative flex flex-col sm:flex-row items-center justify-between max-w-xl mx-auto">
              {/* Step 1: SUBMITTED */}
              <div className="flex sm:flex-col items-center text-center w-full sm:w-1/3 mb-4 sm:mb-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                    currentStatus === 'Submitted' ||
                    currentStatus === 'Under Review' ||
                    currentStatus === 'Verified'
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="ml-3 sm:ml-0 sm:mt-2 text-left sm:text-center">
                  <div className="text-xs font-extrabold text-gray-900">
                    {t.timelineSubmitted}
                  </div>
                  <div className="text-[10px] text-gray-500">Case registered</div>
                </div>
              </div>

              {/* Connecting Bar */}
              <div className="hidden sm:block flex-1 h-1 bg-emerald-300 mx-2" />

              {/* Step 2: UNDER REVIEW */}
              <div className="flex sm:flex-col items-center text-center w-full sm:w-1/3 mb-4 sm:mb-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                    currentStatus === 'Under Review' || currentStatus === 'Verified'
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                      : currentStatus === 'Submitted'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div className="ml-3 sm:ml-0 sm:mt-2 text-left sm:text-center">
                  <div className="text-xs font-extrabold text-gray-900">
                    {t.timelineUnderReview}
                  </div>
                  <div className="text-[10px] text-gray-500">Officer reviewing</div>
                </div>
              </div>

              {/* Connecting Bar */}
              <div
                className={`hidden sm:block flex-1 h-1 mx-2 ${
                  currentStatus === 'Verified' ? 'bg-emerald-400' : 'bg-gray-200'
                }`}
              />

              {/* Step 3: VERIFIED or REJECTED */}
              <div className="flex sm:flex-col items-center text-center w-full sm:w-1/3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                    currentStatus === 'Verified'
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                      : currentStatus === 'Rejected'
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="ml-3 sm:ml-0 sm:mt-2 text-left sm:text-center">
                  <div className="text-xs font-extrabold text-gray-900">
                    {currentStatus === 'Rejected' ? t.timelineRejected : t.timelineVerified}
                  </div>
                  <div className="text-[10px] text-gray-500">Official Advisory</div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Officer Remarks if Verified */}
          {currentCase.officerRemarks && (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-500/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Official Officer Advisory Verification</span>
                </span>
                {currentCase.verifiedBy && (
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {currentCase.verifiedBy} ({currentCase.verifiedDate})
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                "{currentCase.officerRemarks}"
              </p>
            </div>
          )}

          {/* Exact Required Fields Display Grid */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Case Dossier Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.caseIdLabel}</span>
                <span className="font-mono font-bold text-gray-900">{currentCase.id}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.farmerName}</span>
                <span className="font-bold text-gray-900">{currentCase.farmerName}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.cropName}</span>
                <span className="font-bold text-gray-900">
                  {currentCase.cropEmoji} {currentCase.cropName}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.diseaseDetected}</span>
                <span className="font-bold text-emerald-900">{currentCase.disease}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.confidenceScore}</span>
                <span className="font-bold text-gray-900">{currentCase.confidence}%</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.severityLabel}</span>
                <span className="font-bold text-gray-900">{currentCase.severity}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.district}</span>
                <span className="font-bold text-gray-900">{currentCase.district}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.village}</span>
                <span className="font-bold text-gray-900">{currentCase.village}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block mb-0.5">{t.approxAreaInfected}</span>
                <span className="font-bold text-gray-900">{currentCase.affectedArea}</span>
              </div>
            </div>
          </div>

          {/* Temporary Precautionary Guidance While Under Review */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-2">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{t.temporaryGuidanceTitle}</span>
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              {t.temporaryGuidanceText}
            </p>
          </div>

          {/* Action: Notify Me When Expert Responds */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <button
              id="notify-expert-response-btn"
              onClick={handleToggleNotification}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                notificationActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white border border-gray-300 hover:border-emerald-600 text-gray-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>
                {notificationActive
                  ? t.notificationEnabled
                  : t.notifyMeBtn}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('farmer_dashboard')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Return to Farmer Dashboard
            </button>
          </div>

          {notificationToast && (
            <div className="p-3 bg-emerald-100/90 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>SMS Alert Notification successfully registered for mobile {currentCase.farmerMobile}!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
