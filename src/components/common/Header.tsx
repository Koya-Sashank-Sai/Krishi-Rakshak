import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Language, UserRole } from '../../types';
import {
  ShieldCheck,
  Globe,
  User,
  LogOut,
  Settings,
  MapPin,
  ChevronDown,
  Building2,
  Bell,
} from 'lucide-react';
import SettingsModal from './SettingsModal';
import FarmerNotificationDrawer from '../farmer/FarmerNotificationDrawer';
import FarmerRecommendationModal from '../farmer/FarmerRecommendationModal';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const {
    currentUser,
    logout,
    currentView,
    setCurrentView,
    setOfficerTab,
    unreadNotificationCount,
    activeRecommendationModalCase,
    setActiveRecommendationModalCase,
    reportedCases,
  } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <>
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-40 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo & Branding */}
            <div
              id="brand-logo-container"
              className="flex items-center space-x-3 cursor-pointer py-1"
              onClick={() => {
                if (currentUser?.role === 'farmer') setCurrentView('farmer_dashboard');
                if (currentUser?.role === 'officer') {
                  setCurrentView('officer_dashboard');
                  setOfficerTab('home');
                }
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center shadow-inner text-emerald-100">
                <ShieldCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tight text-white font-serif">
                    {t.appName}
                  </span>
                  <span className="hidden md:inline-flex items-center text-[10px] uppercase font-semibold tracking-wider bg-emerald-800/90 text-emerald-300 border border-emerald-600/40 px-2 py-0.5 rounded-full">
                    {t.sihBadge}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 font-medium hidden sm:block">
                  {t.appSubtitle} &bull; <span className="text-emerald-300 italic">{t.appTagline}</span>
                </p>
              </div>
            </div>

            {/* Right Side Navigation & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  id="header-language-toggle"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/50 text-emerald-100 text-xs font-medium transition-colors"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden xs:inline">
                    {languages.find((l) => l.code === language)?.native}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {langMenuOpen && (
                  <div
                    id="header-language-menu"
                    className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 text-gray-800 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                          language === l.code
                            ? 'text-emerald-800 font-bold bg-emerald-50/60'
                            : 'text-gray-700'
                        }`}
                      >
                        <span>{l.native}</span>
                        {language === l.code && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Identity & Actions */}
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-emerald-300 flex items-center justify-end space-x-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>
                        {currentUser.district}
                        {currentUser.role === 'farmer' ? `, ${currentUser.village}` : ''}
                      </span>
                    </span>
                  </div>

                  <span className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full border ${
                    currentUser.role === 'farmer'
                      ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
                      : 'bg-amber-950/70 text-amber-200 border-amber-500/40'
                  }`}>
                    {currentUser.role === 'farmer' ? t.roleFarmerTitle : t.roleOfficerTitle}
                  </span>

                  {/* Farmer Notification Bell */}
                  {currentUser.role === 'farmer' && (
                    <button
                      id="header-notification-bell-btn"
                      onClick={() => setShowNotifications(true)}
                      className="relative p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-600/30"
                      title="Farmer Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadNotificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </button>
                  )}

                  <button
                    id="header-settings-btn"
                    onClick={() => setShowSettings(true)}
                    className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-600/30"
                    title={t.navSettings}
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  <button
                    id="header-logout-btn"
                    onClick={logout}
                    className="p-1.5 rounded-lg bg-emerald-800/90 hover:bg-red-900/80 text-emerald-200 hover:text-red-200 transition-colors border border-emerald-600/30"
                    title={t.logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-emerald-200/90 hidden sm:block border-l border-emerald-800 pl-3">
                  SIH Problem SIH26131
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      <FarmerNotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onSelectRecommendation={(caseId) => {
          const found = reportedCases.find((c) => c.id === caseId);
          if (found) setActiveRecommendationModalCase(found);
        }}
      />

      {activeRecommendationModalCase && (
        <FarmerRecommendationModal
          reportedCase={activeRecommendationModalCase}
          onClose={() => setActiveRecommendationModalCase(null)}
        />
      )}
    </>
  );
}
