import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_LOCATIONS } from '../../data/mockData';
import { FarmerProfile } from '../../types';
import {
  Sprout,
  ArrowLeft,
  Lock,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function FarmerAuthModal() {
  const { t } = useLanguage();
  const { loginFarmer, setCurrentView } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Sign up fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('Ahmednagar');
  const [village, setVillage] = useState('Aabithkhind');
  const [password, setPassword] = useState('');

  // Login fields
  const [loginMobile, setLoginMobile] = useState('9822104512');
  const [loginPassword, setLoginPassword] = useState('farmer123');

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const districts = Object.keys(MAHARASHTRA_LOCATIONS);
  const villages = MAHARASHTRA_LOCATIONS[district] || [];

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    const availableVillages = MAHARASHTRA_LOCATIONS[d] || [];
    setVillage(availableVillages[0] || '');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !password) {
      setFeedback({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    // Save demo farmer in localStorage/context
    const newFarmer: FarmerProfile = {
      id: `farmer-${Date.now()}`,
      name,
      mobile,
      district,
      village,
      role: 'farmer',
    };

    setFeedback({
      type: 'success',
      message: t.signupSuccess,
    });

    // Requirement: "After successful account creation: Redirect the farmer to the Farmer Login page."
    setLoginMobile(mobile);
    setLoginPassword(password);
    setTimeout(() => {
      setMode('login');
      setFeedback(null);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginMobile || !loginPassword) {
      setFeedback({ type: 'error', message: 'Please enter mobile number and password.' });
      return;
    }

    const farmerProfile: FarmerProfile = {
      id: 'farmer-101',
      name: name || 'Dnyaneshwar Shinde',
      mobile: loginMobile,
      district: district || 'Ahmednagar',
      village: village || 'Aabithkhind',
      role: 'farmer',
    };

    loginFarmer(farmerProfile);
  };

  const handleFillDemo = () => {
    setName('Dnyaneshwar Shinde');
    setMobile('9822104512');
    setDistrict('Ahmednagar');
    setVillage('Aabithkhind');
    setPassword('farmer123');
    setLoginMobile('9822104512');
    setLoginPassword('farmer123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 relative">
          <button
            id="farmer-back-to-roles-btn"
            onClick={() => setCurrentView('role_language_selection')}
            className="absolute top-5 left-5 text-emerald-200 hover:text-white p-1 rounded-md hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center pt-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center mx-auto mb-2 text-emerald-100">
              <Sprout className="w-7 h-7 text-emerald-300" />
            </div>
            <h2 className="text-xl font-bold font-serif">
              {mode === 'login' ? t.farmerLogin : t.farmerSignUp}
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Krishi Rakshak &bull; {t.roleFarmerTitle} Portal
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            id="tab-farmer-login"
            onClick={() => {
              setMode('login');
              setFeedback(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'text-emerald-800 border-b-2 border-emerald-700 bg-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t.farmerLogin}
          </button>
          <button
            id="tab-farmer-signup"
            onClick={() => {
              setMode('signup');
              setFeedback(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'text-emerald-800 border-b-2 border-emerald-700 bg-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t.farmerSignUp}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {feedback && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs flex items-center space-x-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {mode === 'signup' ? (
            /* FARMER SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.name} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dnyaneshwar Shinde"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.mobileNumber} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9822104512"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t.district} *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t.village} *
                  </label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    {villages.map((v) => (
                      <option key={v} value={v}>
                        {v}
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
                id="farmer-create-account-btn"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer mt-2"
              >
                {t.createAccount}
              </button>
            </form>
          ) : (
            /* FARMER LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.mobileNumber}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value)}
                    placeholder="9822104512"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="farmer-login-btn"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {t.loginAsFarmer}
              </button>
            </form>
          )}

          {/* Quick Demo Fill Helper */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <button
              type="button"
              id="fill-demo-farmer-btn"
              onClick={handleFillDemo}
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-medium py-1 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.fillDemoFarmer}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
