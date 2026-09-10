import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import {
  ShieldCheck,
  Sprout,
  Building2,
  ArrowRight,
  Check,
  Award,
  Sparkles,
  MapPin,
  Leaf,
} from 'lucide-react';

export default function LanguageAndRoleScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { setCurrentView } = useApp();

  const languages: {
    code: Language;
    label: string;
    native: string;
    sub: string;
  }[] = [
    { code: 'en', label: 'English', native: 'English', sub: 'Standard' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', sub: 'राजभाषा' },
    { code: 'mr', label: 'Marathi', native: 'मराठी', sub: 'महाराष्ट्र' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Gov / SIH Banner */}
      <div className="max-w-4xl mx-auto w-full text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 mb-6 shadow-sm">
          <Award className="w-4 h-4 text-emerald-300" />
          <span>{t.sihBadge} &bull; SIH26131</span>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400/60 shadow-lg flex items-center justify-center text-white">
            <ShieldCheck className="w-10 h-10 text-emerald-200" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
          {t.appName}
        </h1>
        <p className="text-sm sm:text-base text-emerald-200 font-medium mt-1">
          {t.appSubtitle}
        </p>
        <p className="text-xs sm:text-sm text-emerald-300/80 italic mt-0.5">
          {t.appTagline}
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto w-full my-6">
        <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 p-6 sm:p-8 space-y-8">
          {/* Section 1: Language Selection */}
          <div>
            <div className="text-center mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Step 1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-2">
                {t.selectLanguageTitle}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t.selectLanguageSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {languages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    id={`lang-choice-${l.code}`}
                    onClick={() => setLanguage(l.code)}
                    className={`relative p-3.5 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-emerald-700 text-white rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <span className="text-base sm:text-lg font-bold">
                      {l.native}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {l.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Section 2: Role Selection */}
          <div>
            <div className="text-center mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Step 2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-2">
                {t.selectRoleTitle}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t.selectRoleSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Farmer Portal Option */}
              <button
                id="role-select-farmer-btn"
                onClick={() => setCurrentView('farmer_auth')}
                className="group p-5 rounded-2xl border-2 border-emerald-600/40 hover:border-emerald-700 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      Kisan / शेतकरी
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-900">
                    {t.roleFarmerTitle}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {t.roleFarmerDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Enter Farmer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Officer Portal Option */}
              <button
                id="role-select-officer-btn"
                onClick={() => setCurrentView('officer_auth')}
                className="group p-5 rounded-2xl border-2 border-gray-200 hover:border-emerald-700 bg-white hover:bg-emerald-50/20 text-left transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                      Adhikari / अधिकारी
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-900">
                    {t.roleOfficerTitle}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {t.roleOfficerDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Enter Officer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Disclaimer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-emerald-300/70">
        <p>{t.govInitiative}</p>
        <p className="text-[11px] text-emerald-400/60 mt-0.5">
          Smart India Hackathon Problem Statement SIH26131: Early detection & management of crop diseases
        </p>
      </div>
    </div>
  );
}
