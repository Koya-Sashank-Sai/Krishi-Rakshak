import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { OfficerProfile } from '../../types';
import OfficerHome from './OfficerHome';
import OfficerReports from './OfficerReports';
import OfficerFarmerInfo from './OfficerFarmerInfo';
import OfficerReportedCases from './OfficerReportedCases';
import SettingsModal from '../common/SettingsModal';
import {
  Home,
  FileSpreadsheet,
  Users,
  FileText,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
  Globe,
  Bell,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

type OfficerTab = 'home' | 'reports' | 'farmer_info' | 'reported_cases';

export default function OfficerLayout() {
  const { language, setLanguage, t } = useLanguage();
  const {
    currentUser,
    logout,
    officerDistrict,
    reportedCases,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<OfficerTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const officer = currentUser as OfficerProfile;

  // Count pending cases for badge
  const pendingCasesCount = reportedCases.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  ).length;

  const navItems: { id: OfficerTab; label: string; icon: any; badge?: number }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'reports', label: t.navReports, icon: FileSpreadsheet },
    { id: 'farmer_info', label: t.navFarmerInfo, icon: Users },
    {
      id: 'reported_cases',
      label: t.navReportedCases,
      icon: FileText,
      badge: pendingCasesCount,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-950 text-white border-r border-emerald-900 shrink-0">
        {/* Brand Banner */}
        <div className="p-5 border-b border-emerald-900/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-600/40 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight font-serif text-white">
              {t.appName}
            </h1>
            <p className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
              {t.roleOfficerTitle}
            </p>
          </div>
        </div>

        {/* Assigned Jurisdiction Box */}
        <div className="p-4 mx-3 mt-4 bg-emerald-900/60 rounded-xl border border-emerald-800/80 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-300 font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Assigned Jurisdiction</span>
          </div>
          <div className="font-extrabold text-white text-sm">
            {officer?.district || officerDistrict} District
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-0.5 truncate">
            {officer?.name || 'Dr. Vivek S. Kulkarni'}
          </div>
        </div>

        {/* Sidebar Nav Items: EXACTLY Home, Reports, Farmer Info, Reported Cases, Settings */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`officer-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-emerald-200/90 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          {/* Settings button in sidebar */}
          <button
            id="officer-nav-settings"
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-200/90 hover:bg-emerald-900/50 hover:text-white transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>{t.navSettings}</span>
          </button>
        </nav>

        {/* Bottom Officer Profile & Logout */}
        <div className="p-4 border-t border-emerald-900/80 bg-emerald-950/80">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <div className="font-bold text-white truncate max-w-[120px]">
                {officer?.name || 'Officer'}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                {officer?.officerId || 'MH-AGRI-4012'}
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-2xs">
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase">
                  {officer?.district || officerDistrict} Control Room
                </span>
                <span className="text-xs text-gray-400 hidden sm:inline">&bull;</span>
                <span className="text-xs text-gray-600 font-medium hidden sm:inline">
                  Plant Protection & Surveillance Cell
                </span>
              </div>
            </div>

            {/* Quick Actions: Language Switcher & Settings */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    language === 'en' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-gray-500'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    language === 'hi' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-gray-500'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLanguage('mr')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    language === 'mr' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-gray-500'
                  }`}
                >
                  मराठी
                </button>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold ${
                      isActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-emerald-700" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-2.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-emerald-700" />
                <span>{t.navSettings}</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 p-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </header>

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'home' && <OfficerHome />}
          {activeTab === 'reports' && <OfficerReports />}
          {activeTab === 'farmer_info' && <OfficerFarmerInfo />}
          {activeTab === 'reported_cases' && <OfficerReportedCases />}
        </main>
      </div>

      {/* Global Settings Modal */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}
