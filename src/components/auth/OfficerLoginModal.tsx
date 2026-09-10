import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_LOCATIONS } from '../../data/mockData';
import { OfficerProfile } from '../../types';
import {
  Building2,
  ArrowLeft,
  Lock,
  BadgeCheck,
  MapPin,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function OfficerLoginModal() {
  const { t } = useLanguage();
  const { loginOfficer, setCurrentView } = useApp();

  const [officerId, setOfficerId] = useState('MH-AGRI-4012');
  const [password, setPassword] = useState('officer123');
  const [district, setDistrict] = useState('Ahmednagar');
  const [error, setError] = useState<string | null>(null);

  const districts = Object.keys(MAHARASHTRA_LOCATIONS);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId || !password || !district) {
      setError('Please fill in all officer credentials.');
      return;
    }

    const officerProfile: OfficerProfile = {
      id: 'officer-901',
      officerId,
      name: 'Dr. Vivek S. Kulkarni',
      district,
      department: 'Sub-Divisional Agriculture Office, Plant Health Surveillance',
      role: 'officer',
    };

    loginOfficer(officerProfile);
  };

  const handleFillDemo = () => {
    setOfficerId('MH-AGRI-4012');
    setPassword('officer123');
    setDistrict('Ahmednagar');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 relative border-b border-emerald-800">
          <button
            id="officer-back-to-roles-btn"
            onClick={() => setCurrentView('role_language_selection')}
            className="absolute top-5 left-5 text-emerald-200 hover:text-white p-1 rounded-md hover:bg-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center pt-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-800/90 border border-emerald-600/50 flex items-center justify-center mx-auto mb-2 text-emerald-100 shadow-inner">
              <Building2 className="w-7 h-7 text-emerald-300" />
            </div>
            <h2 className="text-xl font-bold font-serif">{t.officerLogin}</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Government Plant Protection & Epidemiological Surveillance
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-xs bg-red-50 text-red-800 border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                {t.officerId} *
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. MH-AGRI-4012"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Departmental officer credential issued by State Agriculture Dept.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                {t.district} * (Assigned Jurisdiction)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                {t.password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              id="officer-login-btn"
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer mt-2"
            >
              {t.loginAsOfficer}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <button
              type="button"
              id="fill-demo-officer-btn"
              onClick={handleFillDemo}
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-medium py-1 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.fillDemoOfficer}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
