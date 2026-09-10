import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_LOCATIONS, CROPS_DATA } from '../../data/mockData';
import { HotspotPoint } from '../../types';
import GisHotspotMap from './GisHotspotMap';
import {
  MapPin,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Building2,
  Users,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function OfficerHome() {
  const { t } = useLanguage();
  const {
    officerDistrict,
    setOfficerDistrict,
    officerVillage,
    setOfficerVillage,
    officerCrop,
    setOfficerCrop,
    hotspots,
    reportedCases,
    setCurrentView,
  } = useApp();

  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPoint | null>(null);

  const districts = Object.keys(MAHARASHTRA_LOCATIONS);
  const villages = MAHARASHTRA_LOCATIONS[officerDistrict] || [];

  const handleDistrictChange = (d: string) => {
    setOfficerDistrict(d);
    const newVillages = MAHARASHTRA_LOCATIONS[d] || [];
    setOfficerVillage(newVillages[0] || 'All');
  };

  // Filtered cases matching the current global context
  const contextCases = reportedCases.filter((c) => {
    if (officerDistrict && officerDistrict !== 'All' && c.district !== officerDistrict) return false;
    if (officerVillage && officerVillage !== 'All' && c.village !== officerVillage) return false;
    if (officerCrop && officerCrop !== 'All' && c.cropName.toLowerCase() !== officerCrop.toLowerCase()) return false;
    return true;
  });

  const pendingCasesCount = contextCases.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      {/* Global Filter Bar: District, Village, Crop */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>Surveillance Jurisdiction & Filters</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Persistent across active session
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* District Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t.district} (Jurisdiction)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                id="officer-district-select"
                value={officerDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Village Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t.village}
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                id="officer-village-select"
                value={officerVillage}
                onChange={(e) => setOfficerVillage(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value="All">{t.allVillages}</option>
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v} Village
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Crop Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t.cropName}
            </label>
            <div className="relative">
              <Sprout className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                id="officer-crop-select"
                value={officerCrop}
                onChange={(e) => setOfficerCrop(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value="All">{t.allCrops}</option>
                {CROPS_DATA.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Context Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Active Context Cases</span>
          <div className="text-2xl font-extrabold text-emerald-950 mt-1">
            {contextCases.length}
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-semibold">
            In {officerDistrict} {officerVillage !== 'All' ? `• ${officerVillage}` : ''}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">{t.casesUnderReview}</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {pendingCasesCount}
          </div>
          <span className="text-[11px] text-amber-700 mt-0.5 block font-semibold">
            Action required
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">{t.activeHotspots}</span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">
            {hotspots.filter((h) => h.district === officerDistrict && h.riskLevel === 'HIGH').length} High
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            Aggregated clusters
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Surveillance Status</span>
          <div className="text-sm font-extrabold text-emerald-800 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Active &bull; Level 2</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            Govt. SIH26131 Grid
          </span>
        </div>
      </div>

      {/* Interactive GIS Hotspot Map Container */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2 font-serif">
              <Layers className="w-5 h-5 text-emerald-700" />
              <span>{t.gisHotspotMapTitle}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.gisHotspotMapSubtitle}
            </p>
          </div>

          <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
            Context: {officerDistrict} &bull; {officerVillage} &bull; {officerCrop}
          </div>
        </div>

        {/* The Leaflet Map Component */}
        <GisHotspotMap
          hotspots={hotspots}
          selectedDistrict={officerDistrict}
          selectedVillage={officerVillage}
          selectedCrop={officerCrop}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(hp) => setSelectedHotspot(hp)}
        />

        {/* Selected Hotspot Intelligence Drawer (when clicked on map) */}
        {selectedHotspot && (
          <div className="p-4 bg-emerald-50/80 border-2 border-emerald-500 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-800 text-white">
                  Hotspot Intelligence Dossier
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  {selectedHotspot.village}, {selectedHotspot.district}
                </span>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Exactly: Disease, Crop, Number of cases, Severity, Trend, Village */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                <span className="text-gray-500 block text-[10px]">{t.diseaseDetected}</span>
                <span className="font-bold text-gray-900">{selectedHotspot.disease}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                <span className="text-gray-500 block text-[10px]">{t.cropName}</span>
                <span className="font-bold text-gray-900">{selectedHotspot.crop}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                <span className="text-gray-500 block text-[10px]">{t.casesReported}</span>
                <span className="font-extrabold text-emerald-900 text-sm">
                  {selectedHotspot.casesCount} cases
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                <span className="text-gray-500 block text-[10px]">{t.severityLabel}</span>
                <span
                  className={`font-bold ${
                    selectedHotspot.severity === 'Severe'
                      ? 'text-red-700'
                      : selectedHotspot.severity === 'Moderate'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {selectedHotspot.severity}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                <span className="text-gray-500 block text-[10px]">{t.outbreakTrend}</span>
                <span className="font-bold text-gray-900 flex items-center space-x-1 mt-0.5">
                  {selectedHotspot.trend === 'increasing' ? (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-red-700">Increasing</span>
                    </>
                  ) : selectedHotspot.trend === 'decreasing' ? (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Decreasing</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-3.5 h-3.5 text-gray-500" />
                      <span>Stable</span>
                    </>
                  )}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                <span className="text-gray-500 block text-[10px]">{t.village}</span>
                <span className="font-bold text-gray-900">{selectedHotspot.village}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
