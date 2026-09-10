import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Thermometer,
  Droplets,
  Calendar,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Activity,
} from 'lucide-react';

export default function AnalysisResultView() {
  const { t } = useLanguage();
  const {
    activePrediction,
    selectedCrop,
    capturedImage,
    currentUser,
    setCurrentView,
  } = useApp();

  const [isExplainabilityOpen, setIsExplainabilityOpen] = useState(true);

  if (!activePrediction) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <p className="text-gray-500">No diagnostic prediction available.</p>
        <button
          onClick={() => setCurrentView('farmer_dashboard')}
          className="mt-3 text-xs font-bold text-emerald-800 underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return {
          bg: 'bg-red-600 text-white',
          border: 'border-red-600',
          pill: 'bg-red-100 text-red-800 border-red-200',
          label: t.highRisk,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-600 text-white',
          border: 'border-amber-600',
          pill: 'bg-amber-100 text-amber-800 border-amber-200',
          label: t.mediumRisk,
        };
      default:
        return {
          bg: 'bg-emerald-600 text-white',
          border: 'border-emerald-600',
          pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: t.lowRisk,
        };
    }
  };

  const riskMeta = getRiskBadge(activePrediction.riskLevel);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / SIH Notice */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t.analysisResultTitle}</span>
        </div>

        <button
          onClick={() => setCurrentView('scan_upload')}
          className="text-xs font-semibold text-gray-500 hover:text-emerald-800 flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.retakeBtn}</span>
        </button>
      </div>

      {/* Main Diagnostic Card */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        {/* Header Strip with Risk Indicator */}
        <div className="bg-emerald-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl bg-emerald-800 p-2 rounded-xl shrink-0">
              {selectedCrop?.emoji}
            </div>
            <div>
              <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                {selectedCrop?.name} &bull; {selectedCrop?.scientificName}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-0.5">
                {activePrediction.disease}
              </h1>
              {activePrediction.scientificName && (
                <p className="text-xs text-emerald-200 italic">
                  Pathogen: {activePrediction.scientificName}
                </p>
              )}
            </div>
          </div>

          <div className="self-start sm:self-auto text-right">
            <span
              className={`inline-block px-4 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-sm ${riskMeta.bg}`}
            >
              {riskMeta.label}
            </span>
          </div>
        </div>

        {/* Content Body: Image + 4 Primary Key Indicators */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Analyzed Image */}
            <div className="md:col-span-5">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-black">
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Analyzed crop"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-md">
                  Field Image Tokenized
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="md:col-span-7 grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-500 font-medium block">
                  {t.confidenceScore}
                </span>
                <div className="text-2xl font-extrabold text-emerald-900 mt-0.5">
                  {activePrediction.confidence}%
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: `${activePrediction.confidence}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-500 font-medium block">
                  {t.severityLabel}
                </span>
                <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
                  {activePrediction.severity}
                </div>
                <span className="text-[11px] text-gray-500 block mt-1">
                  Canopy infection tier
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-500 font-medium block">
                  {t.affectedAreaLabel}
                </span>
                <div className="text-base font-bold text-gray-900 mt-1">
                  {activePrediction.affectedArea}
                </div>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  Visual foliar symptoms
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-500 font-medium block">
                  {t.riskLevelLabel}
                </span>
                <div className="text-base font-bold text-gray-900 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${riskMeta.pill}`}>
                    {activePrediction.riskLevel}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  Spore & vector velocity
                </span>
              </div>
            </div>
          </div>

          {/* AI EXPLAINABILITY — "WHY DID AI SAY THIS?" (Collapsible Section) */}
          {(() => {
            const explainability = activePrediction.explainability || {
              detectedSymptoms: [
                'Yellow chlorotic halo around dark circular spots on leaf surface.',
                'Concentric dark brown rings ("target-board" or bullseye pattern) within mature necrotic lesions.',
                'Early chlorosis and leaf wilting originating in the lower canopy foliage.',
              ],
              keyDistinguishingFeatures: [
                'Differs from Late Blight (Phytophthora infestans) due to distinct concentric target rings rather than water-soaked lesions.',
                'Differs from Septoria Leaf Spot by larger lesion diameter (>5mm) without central black pycnidia specks.',
              ],
              confidenceBreakdown: {
                visualSymptomMatch: activePrediction.confidence || 92,
                weatherSuitabilityMatch: 88,
                regionPrevalenceMatch: 85,
              },
              differentialDiagnosis: [
                {
                  disease: 'Late Blight (Phytophthora infestans)',
                  probability: 5,
                  distinguishingNote: 'Lacks concentric rings; rapid water-soaked lesion edge.',
                },
                {
                  disease: 'Septoria Leaf Spot (Septoria lycopersici)',
                  probability: 2,
                  distinguishingNote: 'Much smaller lesions with tiny black pycnidia dots.',
                },
              ],
            };

            return (
              <div
                id="ai-explainability-card"
                className="border-2 border-emerald-200 rounded-2xl overflow-hidden bg-white shadow-xs"
              >
                {/* Collapsible Trigger Header */}
                <button
                  id="toggle-ai-explainability-btn"
                  onClick={() => setIsExplainabilityOpen(!isExplainabilityOpen)}
                  className="w-full p-4.5 bg-gradient-to-r from-emerald-50 via-emerald-50/80 to-emerald-100/60 hover:bg-emerald-100 transition-colors flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
                        Why did AI identify this disease?
                      </h3>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        Visual symptoms, key distinguishing features, confidence breakdown & differential diagnosis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-emerald-900 text-xs font-bold shrink-0">
                    <span className="hidden sm:inline">
                      {isExplainabilityOpen ? 'Hide Section' : 'Show Section'}
                    </span>
                    {isExplainabilityOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Collapsible Content */}
                {isExplainabilityOpen && (
                  <div className="p-5 sm:p-6 space-y-5 border-t border-emerald-100 bg-white animate-in fade-in">
                    {/* 1. Detected Visual Symptoms & Key Distinguishing Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Detected Visual Symptoms */}
                      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 space-y-2.5">
                        <div className="flex items-center space-x-2 text-emerald-950 font-bold text-xs">
                          <Search className="w-4 h-4 text-emerald-700" />
                          <span>Detected Visual Symptoms</span>
                        </div>
                        <ul className="space-y-2 text-xs text-gray-700">
                          {explainability.detectedSymptoms.map((symptom, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Distinguishing Features */}
                      <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-4 space-y-2.5">
                        <div className="flex items-center space-x-2 text-blue-950 font-bold text-xs">
                          <HelpCircle className="w-4 h-4 text-blue-700" />
                          <span>Key Distinguishing Features</span>
                        </div>
                        <ul className="space-y-2 text-xs text-gray-700">
                          {explainability.keyDistinguishingFeatures.map((feat, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 2. Confidence Breakdown */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4.5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                          <Activity className="w-4 h-4 text-emerald-700" />
                          <span>Confidence Breakdown</span>
                        </span>
                        <span className="text-[11px] text-gray-500 font-semibold">
                          ICAR & Microclimate Diagnostic Model
                        </span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {/* Visual Symptom Match */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span>Visual Symptom Match</span>
                            <span className="text-emerald-900 font-mono font-bold">
                              {explainability.confidenceBreakdown.visualSymptomMatch}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-700 h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${explainability.confidenceBreakdown.visualSymptomMatch}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Weather Suitability Match */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span>Weather Suitability Match</span>
                            <span className="text-blue-900 font-mono font-bold">
                              {explainability.confidenceBreakdown.weatherSuitabilityMatch}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${explainability.confidenceBreakdown.weatherSuitabilityMatch}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Region Prevalence Match */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span>Region Prevalence Match</span>
                            <span className="text-amber-900 font-mono font-bold">
                              {explainability.confidenceBreakdown.regionPrevalenceMatch}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-600 h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${explainability.confidenceBreakdown.regionPrevalenceMatch}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. What else this could be (differential diagnosis) */}
                    <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                          <Layers className="w-4 h-4 text-amber-800" />
                          <span>What else this could be (Differential Diagnosis)</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                          Differential Analysis
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {explainability.differentialDiagnosis.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900">
                                {item.disease}
                              </span>
                              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                                {item.probability}%
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-relaxed italic">
                              "{item.distinguishingNote}"
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-gray-600 flex items-center space-x-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>
                          Scientific note: Primary diagnosis confidence ({activePrediction.confidence}%) significantly surpasses secondary differentials.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Explainable AI Factors Section */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center space-x-2">
              <Info className="w-4 h-4 text-emerald-800" />
              <span>{t.whyRiskFactors}</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              {activePrediction.whyHighRisk.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weather & History Context Double Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5">
              <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-emerald-700" />
                <span>{t.weatherContextTitle}</span>
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                {activePrediction.weatherContext}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5">
              <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>{t.cropHistoryContextTitle}</span>
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                {activePrediction.cropHistoryContext}
              </p>
            </div>
          </div>

          {/* Prototype disclaimer */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              Simulated demonstration architecture: In production deployment, real Gemini vision/TensorFlow edge models integrate into <code className="bg-amber-100 px-1 rounded">analyzeCropImage()</code>.
            </p>
          </div>
        </div>

        {/* Bottom Forward Action to Advisory */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setCurrentView('farmer_dashboard')}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            &larr; {t.backToDashboard}
          </button>

          <button
            id="view-advisory-btn"
            onClick={() => setCurrentView('advisory')}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Open Integrated Advisory</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
