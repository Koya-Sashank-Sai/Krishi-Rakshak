import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { CropInfo } from '../../types';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Check,
  Sprout,
  ShieldCheck,
} from 'lucide-react';

export default function CropSelector() {
  const { t } = useLanguage();
  const { selectedCrop, setSelectedCrop, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrops = CROPS_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (crop: CropInfo) => {
    setSelectedCrop(crop);
  };

  const handleContinue = () => {
    if (!selectedCrop) return;
    setCurrentView('scan_upload');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="crop-selector-back-btn"
          onClick={() => setCurrentView('farmer_dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            Step 1 of 3
          </span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-serif">
            {t.cropSelectionTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t.cropSelectionSubtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            id="crop-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchCropPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* The 15 Exact Crops Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {filteredCrops.map((crop) => {
          const isSelected = selectedCrop?.id === crop.id;
          return (
            <button
              key={crop.id}
              id={`crop-card-${crop.id}`}
              onClick={() => handleSelect(crop)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50/80 shadow-md ring-2 ring-emerald-600/30'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3" />
                </span>
              )}

              <div>
                <div className="text-3xl sm:text-4xl mb-2">{crop.emoji}</div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-900">
                  {crop.name}
                </h3>
                <p className="text-[11px] text-gray-500 italic truncate mt-0.5">
                  {crop.scientificName}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  {crop.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Bottom Continue Bar */}
      <div className="sticky bottom-4 z-30 bg-white rounded-2xl p-4 border border-emerald-200 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {selectedCrop ? (
            <>
              <span className="text-2xl">{selectedCrop.emoji}</span>
              <div>
                <div className="text-xs text-gray-500">{t.selectedCrop}:</div>
                <div className="font-bold text-sm text-gray-900">
                  {selectedCrop.name} ({selectedCrop.scientificName})
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500 italic">
              Please click and select one crop from above to proceed to image diagnosis.
            </div>
          )}
        </div>

        <button
          id="crop-selection-continue-btn"
          disabled={!selectedCrop}
          onClick={handleContinue}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            selectedCrop
              ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
