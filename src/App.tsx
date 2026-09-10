import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import SettingsModal from './components/common/SettingsModal';

import LanguageAndRoleScreen from './components/auth/LanguageAndRoleScreen';
import FarmerAuthModal from './components/auth/FarmerAuthModal';
import OfficerLoginModal from './components/auth/OfficerLoginModal';

import FarmerDashboard from './components/farmer/FarmerDashboard';
import CropSelector from './components/farmer/CropSelector';
import ScanUploadView from './components/farmer/ScanUploadView';
import AnalysisResultView from './components/farmer/AnalysisResultView';
import AdvisoryView from './components/farmer/AdvisoryView';
import ExpertReviewView from './components/farmer/ExpertReviewView';
import FarmerHistoryView from './components/farmer/FarmerHistoryView';

import OfficerLayout from './components/officer/OfficerLayout';

function AppContent() {
  const { currentView, isSettingsOpen, setIsSettingsOpen } = useApp();

  // Role / Language Selection Screen
  if (currentView === 'role_language_selection') {
    return <LanguageAndRoleScreen />;
  }

  // Farmer Authentication (Login / Signup)
  if (currentView === 'farmer_auth') {
    return <FarmerAuthModal />;
  }

  // Officer Authentication (Login)
  if (currentView === 'officer_auth') {
    return <OfficerLoginModal />;
  }

  // Officer Dashboard (Independent Layout with Sidebar, Filters, GIS Map, Reports, Farmer Info, Cases)
  if (currentView === 'officer_dashboard') {
    return <OfficerLayout />;
  }

  // Farmer Portal Views (with consistent Krishi Rakshak green header & settings)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Header />
        <main className="pb-12">
          {currentView === 'farmer_dashboard' && <FarmerDashboard />}
          {currentView === 'crop_selection' && <CropSelector />}
          {currentView === 'scan_upload' && <ScanUploadView />}
          {currentView === 'analysis_result' && <AnalysisResultView />}
          {currentView === 'advisory' && <AdvisoryView />}
          {currentView === 'expert_review' && <ExpertReviewView />}
          {currentView === 'farmer_history' && <FarmerHistoryView />}
        </main>
      </div>

      {/* Farmer Footer */}
      <footer className="bg-emerald-950 text-white/70 text-[11px] py-4 px-4 sm:px-6 border-t border-emerald-900 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>कृषि रक्षक &bull; Krishi Rakshak</strong> &bull; AI-Powered Crop Protection System
          </div>
          <div>
            Smart India Hackathon Problem Statement SIH26131 &bull; Dept of Agriculture
          </div>
        </div>
      </footer>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
