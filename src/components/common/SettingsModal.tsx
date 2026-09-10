import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { X, Globe, User, KeyRound, LogOut, CheckCircle2, Shield } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout } = useApp();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setToastMsg(t.passwordUpdatedToast);
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg">{t.settingsTitle}</h3>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User Profile Card */}
          {currentUser && (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>{t.profileSection}</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 text-xs block">{t.name}</span>
                  <span className="font-semibold text-gray-900">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Role</span>
                  <span className="font-semibold text-emerald-800 capitalize">
                    {currentUser.role === 'farmer' ? t.roleFarmerTitle : t.roleOfficerTitle}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">{t.district}</span>
                  <span className="font-medium text-gray-900">{currentUser.district}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">
                    {currentUser.role === 'farmer' ? t.village : t.officerId}
                  </span>
                  <span className="font-medium text-gray-900">
                    {currentUser.role === 'farmer'
                      ? (currentUser as any).village
                      : (currentUser as any).officerId}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Language Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>{t.languageSection}</span>
              </h4>
              <span className="text-xs text-gray-500">Persistent across session</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">{t.languageSectionDesc}</p>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  id={`settings-lang-btn-${l.code}`}
                  onClick={() => setLanguage(l.code)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    language === l.code
                      ? 'bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="text-sm font-semibold">{l.native}</div>
                  <div className={`text-[11px] ${language === l.code ? 'text-emerald-200' : 'text-gray-500'}`}>
                    {l.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 flex items-center space-x-1.5 mb-2">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <span>{t.changePasswordSection}</span>
            </h4>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  {t.currentPassword}
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  {t.newPassword}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                {t.updatePasswordBtn}
              </button>
            </form>

            {toastMsg && (
              <div className="mt-2 text-xs text-emerald-800 bg-emerald-100/80 px-3 py-2 rounded-lg flex items-center space-x-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{toastMsg}</span>
              </div>
            )}
          </div>

          {/* Logout Action */}
          {currentUser && (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Ready to end your session?</span>
              <button
                id="modal-logout-btn"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors border border-red-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
