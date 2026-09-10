import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  CloudLightning,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';

export default function AdvisoryView() {
  const { t } = useLanguage();
  const {
    activePrediction,
    selectedCrop,
    activeWeather,
    toggleAdvisoryTask,
    escalateCaseToExpert,
    setCurrentView,
  } = useApp();

  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [farmerNotes, setFarmerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activePrediction) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-gray-500">No active diagnosis available.</p>
        <button
          onClick={() => setCurrentView('farmer_dashboard')}
          className="mt-3 text-xs font-bold text-emerald-800 underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const advisories = activePrediction.advisories || [];
  const completedCount = advisories.filter((a) => a.completed).length;
  const totalCount = advisories.length || 3;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await escalateCaseToExpert(farmerNotes);
      setIsSubmitting(false);
      setShowEscalationModal(false);
      setCurrentView('expert_review');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('analysis_result')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Diagnostic Report</span>
        </button>

        <button
          onClick={() => setCurrentView('farmer_dashboard')}
          className="text-xs font-semibold text-gray-500 hover:text-emerald-800"
        >
          {t.backToDashboard}
        </button>
      </div>

      {/* Main Advisory Card */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-emerald-200 uppercase font-semibold tracking-wider">
                {selectedCrop?.emoji} {selectedCrop?.name} &bull; {activePrediction.disease}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                {t.advisoryTitle}
              </h1>
              <p className="text-xs text-emerald-100 mt-0.5">
                {t.advisorySubtitle}
              </p>
            </div>

            {/* Action Progress Pill: 0/3 Done, 1/3 Done, 2/3 Done, 3/3 Done */}
            <div className="bg-emerald-900/90 border border-emerald-600/50 rounded-xl p-3 text-center shrink-0">
              <span className="text-[10px] text-emerald-300 font-semibold uppercase block">
                {t.actionProgress}
              </span>
              <div className="text-xl font-extrabold text-white">
                {completedCount}/{totalCount} {t.taskDone}
              </div>
              <div className="w-24 bg-emerald-950 h-1.5 rounded-full mt-1.5 overflow-hidden mx-auto">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Primary Recommended Actions with CHECKBOXES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-emerald-700" />
                <span>{t.recommendedActions}</span>
              </h2>
              <span className="text-xs text-gray-500 hidden sm:inline">
                {t.markComplete}
              </span>
            </div>

            <div className="space-y-3">
              {advisories.map((action, idx) => (
                <div
                  key={action.id}
                  id={`advisory-item-${action.id}`}
                  onClick={() => toggleAdvisoryTask(action.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start space-x-3.5 group ${
                    action.completed
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-2xs'
                      : 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-emerald-700 shrink-0"
                    aria-label="Toggle action"
                  >
                    {action.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p
                      className={`text-sm leading-relaxed ${
                        action.completed
                          ? 'font-medium line-through text-emerald-900/80'
                          : 'font-semibold text-gray-900'
                      }`}
                    >
                      {action.text}
                    </p>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-gray-100 text-gray-600">
                        {action.category} practice
                      </span>
                      {action.completed && (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                          <span>Implemented in field</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Impact on Disease Spread */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center space-x-2">
              <CloudLightning className="w-4 h-4 text-emerald-800" />
              <span>{t.weatherImpactTitle}</span>
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              {activeWeather
                ? `${activeWeather.condition} with humidity at ${activeWeather.humidity}% and rainfall ${activeWeather.rainfall} mm. Sustained damp foliage accelerates spore multiplication. Refrain from late afternoon flood irrigation.`
                : 'High humidity and recent rainfall may increase disease-spread risk.'}
            </p>
          </div>

          {/* Important Safety Requirement: Agricultural Safety Notice */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t.safetyDisclaimerTitle}</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              {t.safetyDisclaimerBody}
            </p>
          </div>

          {/* Contact Expert Escalation Prompt */}
          <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Need Official Agricultural Department Assistance?
              </div>
              <h4 className="text-base font-bold">
                {t.contactExpertBtn}
              </h4>
              <p className="text-xs text-emerald-200">
                Submit this case for Taluka Agriculture Officer review, field inspection, or second opinion.
              </p>
            </div>

            <button
              id="open-expert-escalation-modal-btn"
              onClick={() => setShowEscalationModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer shrink-0 flex items-center space-x-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.contactExpertBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Escalation Submission Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-900 text-white p-5">
              <h3 className="text-lg font-bold font-serif">
                {t.expertEscalationTitle}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                {t.expertEscalationSubtitle}
              </p>
            </div>

            <form onSubmit={handleEscalateSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-1">
                <div className="font-semibold text-gray-900">
                  Case Summary: {selectedCrop?.name} &bull; {activePrediction.disease}
                </div>
                <div className="text-gray-500">
                  Severity: {activePrediction.severity} &bull; AI Confidence: {activePrediction.confidence}%
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Field Observations / Farmer Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  placeholder={t.farmerNotesPlaceholder}
                  className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-to-expert-btn"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting ? 'Submitting Case...' : t.submitToExpertBtn}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
