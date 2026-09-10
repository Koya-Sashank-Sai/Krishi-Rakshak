import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ReportedCase } from '../../types';
import {
  FileText,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  MapPin,
  Send,
  X,
  ShieldCheck,
  UserCheck,
  Plus,
  Trash2,
  BellRing,
} from 'lucide-react';

export default function OfficerReportedCases() {
  const { t } = useLanguage();
  const {
    reportedCases,
    officerDistrict,
    officerVillage,
    officerCrop,
    verifyReportedCase,
    sendOfficerRecommendation,
  } = useApp();

  const [selectedCase, setSelectedCase] = useState<ReportedCase | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [recommendationText, setRecommendationText] = useState('');
  const [actionSteps, setActionSteps] = useState<string[]>([]);
  const [newStepText, setNewStepText] = useState('');
  const [newStatus, setNewStatus] = useState<'Under Review' | 'Verified' | 'Rejected'>('Verified');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Context filtering
  const filteredCases = reportedCases.filter((c) => {
    if (officerDistrict && officerDistrict !== 'All' && c.district !== officerDistrict) return false;
    if (officerVillage && officerVillage !== 'All' && c.village !== officerVillage) return false;
    if (officerCrop && officerCrop !== 'All' && c.cropName.toLowerCase() !== officerCrop.toLowerCase()) return false;
    return true;
  });

  const handleOpenInspect = (c: ReportedCase) => {
    setSelectedCase(c);
    setOfficerRemarks(c.officerRemarks || '');
    setRecommendationText(c.recommendation || c.officerRemarks || `Confirmed diagnosis for ${c.cropName} (${c.disease}). Immediate biological treatment and canopy management prescribed.`);
    setActionSteps(
      c.recommendationActionSteps && c.recommendationActionSteps.length > 0
        ? [...c.recommendationActionSteps]
        : [
            `Apply organic/biological spray formulation at recommended concentration in late afternoon.`,
            `Isolate and remove infected foliage within 15 cm of soil base to halt secondary spread.`,
            `Monitor surrounding plots in ${c.village} twice weekly and log progression.`,
          ]
    );
    setNewStatus(c.status === 'Submitted' ? 'Under Review' : (c.status as any));
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    setActionSteps([...actionSteps, newStepText.trim()]);
    setNewStepText('');
  };

  const handleRemoveStep = (index: number) => {
    setActionSteps(actionSteps.filter((_, idx) => idx !== index));
  };

  const handleSendRecommendation = () => {
    if (!selectedCase) return;
    setIsSubmitting(true);
    sendOfficerRecommendation(
      selectedCase.id,
      recommendationText.trim() || officerRemarks.trim() || 'Officer advisory issued.',
      actionSteps.filter((s) => s.trim().length > 0)
    );
    setIsSubmitting(false);
    setNotificationToast('Recommendation sent successfully.');
    setSelectedCase(null);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setIsSubmitting(true);
    verifyReportedCase(
      selectedCase.id,
      newStatus,
      officerRemarks || 'Official advisory issued. Recommended foliar sanitation and containment barrier.'
    );
    setIsSubmitting(false);
    setNotificationToast('Case record updated successfully.');
    setSelectedCase(null);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <span>{t.reportedCasesTitle}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t.reportedCasesSubtitle} &bull; Jurisdiction: <strong>{officerDistrict}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            {filteredCases.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length} Pending Review
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
            {filteredCases.filter((c) => c.status === 'Verified').length} Verified
          </span>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Exactly: Farmer Name, Farmer Phone Number, Crop, Disease, Approximate Area Infected, Severity, AI Confidence, District, Village, Case Status */}
              <tr className="bg-gray-100/70 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-4">{t.farmerName}</th>
                <th className="py-3.5 px-4">{t.farmerPhone}</th>
                <th className="py-3.5 px-4">{t.cropName}</th>
                <th className="py-3.5 px-4">{t.diseaseDetected}</th>
                <th className="py-3.5 px-4">{t.approxAreaInfected}</th>
                <th className="py-3.5 px-4">{t.severityLabel}</th>
                <th className="py-3.5 px-4 text-center">{t.confidenceScore}</th>
                <th className="py-3.5 px-4">{t.district} / {t.village}</th>
                <th className="py-3.5 px-4">{t.caseStatus}</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    No farmer cases reported for the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div>{c.farmerName}</div>
                      <div className="text-[10px] font-mono text-gray-400">{c.id}</div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-mono">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{c.farmerMobile}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <span>{c.cropEmoji} {c.cropName}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-emerald-900">
                      {c.disease}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {c.affectedArea}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          c.severity === 'Severe'
                            ? 'bg-red-100 text-red-800'
                            : c.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-center text-gray-900">
                      {c.confidence}%
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                      <div>{c.district}</div>
                      <div className="text-[10px] text-gray-400">{c.village}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                          c.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : c.status === 'Under Review'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.status === 'Verified' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{c.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenInspect(c)}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs shadow-2xs transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Inspection & Officer Verification Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                  Case ID: {selectedCase.id}
                </span>
                <h3 className="text-lg font-bold font-serif mt-1">
                  Case Review: {selectedCase.cropName} &bull; {selectedCase.disease}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveDecision} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Leaf Image */}
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-black border border-gray-200">
                  <img
                    src={selectedCase.imageUrl}
                    alt="Symptomatic crop"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Farmer & Agronomic Info */}
                <div className="space-y-2 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-gray-500 block">Farmer Name:</span>
                    <strong className="text-gray-900 text-sm">{selectedCase.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Mobile:</span>
                    <strong className="text-gray-900 font-mono">{selectedCase.farmerMobile}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Location:</span>
                    <span className="text-gray-800">
                      {selectedCase.village}, Taluka {selectedCase.district}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Submission Date:</span>
                    <span className="text-gray-800">{selectedCase.submissionDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Infected Area:</span>
                    <strong className="text-emerald-900">{selectedCase.affectedArea}</strong>
                  </div>
                </div>
              </div>

              {/* Status Update Radio */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Official Case Review Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('Under Review')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      newStatus === 'Under Review'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    Under Review
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewStatus('Verified')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      newStatus === 'Verified'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    Verify & Recommend
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewStatus('Rejected')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      newStatus === 'Rejected'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 ring-1 ring-amber-500'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    Needs Info / Reject
                  </button>
                </div>
              </div>

              {/* Expert/Officer Recommendation Input */}
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Expert / Officer Official Recommendation:</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Transmitted directly to Farmer App
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={recommendationText}
                    onChange={(e) => setRecommendationText(e.target.value)}
                    placeholder="Enter official agronomic diagnosis, scientific advisory and chemical/organic protocol..."
                    className="w-full p-2.5 text-xs border border-emerald-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* Farmer Action Steps */}
                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1.5">
                    Farmer Action Steps:
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {actionSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-emerald-200 text-gray-800"
                      >
                        <span className="font-medium">
                          <strong className="text-emerald-800 font-bold mr-1.5">{idx + 1}.</strong>
                          {step}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove Step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Step Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newStepText}
                      onChange={(e) => setNewStepText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddStep();
                        }
                      }}
                      placeholder="Add an actionable step for the farmer..."
                      className="flex-1 p-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Internal Officer Remarks / Field Inspection Notes */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Internal Administrative Remarks:
                </label>
                <input
                  type="text"
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="Internal notes, KVK referral or field inspection remarks..."
                  className="w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 self-center sm:self-auto"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-2 self-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-300 transition-all cursor-pointer"
                  >
                    Save Status Only
                  </button>
                  <button
                    type="button"
                    onClick={handleSendRecommendation}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-200" />
                    <span>Send Recommendation to Farmer</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Success Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-500 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{notificationToast}</span>
        </div>
      )}
    </div>
  );
}
