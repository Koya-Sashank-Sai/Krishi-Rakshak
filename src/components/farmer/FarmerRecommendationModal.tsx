import React from 'react';
import { ReportedCase } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Calendar,
  FileText,
  UserCheck,
  ArrowRight,
  PlayCircle,
  Check,
} from 'lucide-react';

interface FarmerRecommendationModalProps {
  reportedCase: ReportedCase;
  onClose: () => void;
}

export default function FarmerRecommendationModal({
  reportedCase,
  onClose,
}: FarmerRecommendationModalProps) {
  const { t } = useLanguage();
  const { updateFarmerActionStatus } = useApp();

  const actionStatus = reportedCase.farmerActionStatus || 'Pending';

  const handleSetActionStarted = () => {
    updateFarmerActionStatus(reportedCase.id, 'Action Started');
  };

  const handleSetCompleted = () => {
    updateFarmerActionStatus(reportedCase.id, 'Completed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-200">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Expert Agronomist Advisory</span>
            <span>&bull;</span>
            <span className="font-mono">{reportedCase.id}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center space-x-2">
            <span>{reportedCase.cropEmoji}</span>
            <span>{reportedCase.cropName} &bull; {reportedCase.disease}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase ${
                reportedCase.severity === 'Severe'
                  ? 'bg-red-600 text-white'
                  : reportedCase.severity === 'Moderate'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              Severity: {reportedCase.severity}
            </span>

            <span
              className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase ${
                actionStatus === 'Completed'
                  ? 'bg-emerald-500 text-white'
                  : actionStatus === 'Action Started'
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-400 text-gray-950'
              }`}
            >
              Action Status: {actionStatus}
            </span>

            <span className="text-xs text-emerald-200 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{reportedCase.recommendationDate || reportedCase.verifiedDate || reportedCase.submissionDate}</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Official Recommendation Quote Box */}
          <div className="bg-emerald-50/90 border-2 border-emerald-500/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-950 font-bold text-xs uppercase tracking-wide">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Expert / Agricultural Officer Recommendation</span>
              </div>
              {reportedCase.verifiedBy && (
                <span className="text-[11px] text-emerald-800 font-semibold">
                  By {reportedCase.verifiedBy}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-emerald-950 leading-relaxed italic">
              "{reportedCase.recommendation || reportedCase.officerRemarks || 'Official field advisory verified and dispatched.'}"
            </p>
          </div>

          {/* Action Steps */}
          {reportedCase.recommendationActionSteps && reportedCase.recommendationActionSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Prescribed Action Steps for Farmer:</span>
              </h3>

              <div className="space-y-2">
                {reportedCase.recommendationActionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-emerald-50/50 rounded-xl border border-gray-200 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Identification Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-500 block text-[10px]">Case ID:</span>
              <span className="font-mono font-bold text-gray-900">{reportedCase.id}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">Location:</span>
              <span className="font-semibold text-gray-900">{reportedCase.village}, {reportedCase.district}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">Affected Canopy:</span>
              <span className="font-semibold text-gray-900">{reportedCase.affectedArea}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">Verified Date:</span>
              <span className="font-semibold text-gray-900">{reportedCase.verifiedDate || reportedCase.submissionDate}</span>
            </div>
          </div>

          {/* Action Status Controls: Action Started & Mark as Completed */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              Update status so the Agricultural Officer can monitor containment.
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="btn-action-started"
                type="button"
                onClick={handleSetActionStarted}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  actionStatus === 'Action Started'
                    ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                <span>Action Started</span>
              </button>

              <button
                id="btn-mark-completed"
                type="button"
                onClick={handleSetCompleted}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  actionStatus === 'Completed'
                    ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-300'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
                }`}
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Mark as Completed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
