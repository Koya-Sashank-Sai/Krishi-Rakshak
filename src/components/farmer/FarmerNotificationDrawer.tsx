import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FarmerNotification } from '../../types';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';

interface FarmerNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendation: (caseId: string) => void;
}

export default function FarmerNotificationDrawer({
  isOpen,
  onClose,
  onSelectRecommendation,
}: FarmerNotificationDrawerProps) {
  const { t } = useLanguage();
  const {
    farmerNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView,
    reportedCases,
    setActiveRecommendationModalCase,
  } = useApp();

  if (!isOpen) return null;

  const handleNotificationClick = (notif: FarmerNotification) => {
    markNotificationAsRead(notif.id);

    if (notif.type === 'expert_recommendation') {
      if (notif.relatedCaseId) {
        const found = reportedCases.find((c) => c.id === notif.relatedCaseId);
        if (found) {
          setActiveRecommendationModalCase(found);
        } else {
          onSelectRecommendation(notif.relatedCaseId);
        }
      } else {
        const firstWithRec = reportedCases.find((c) => !!c.recommendation);
        if (firstWithRec) setActiveRecommendationModalCase(firstWithRec);
      }
      onClose();
    } else if (notif.type === 'risk_change') {
      setCurrentView('advisory');
      onClose();
    } else if (notif.type === 'weather_alert') {
      setCurrentView('farmer_dashboard');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-emerald-100 flex flex-col">
          {/* Header */}
          <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-800 text-emerald-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base font-serif">Farmer Notifications</h2>
                <p className="text-[11px] text-emerald-200">Alerts, weather risks & expert advisories</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-semibold text-emerald-300 hover:text-white flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-emerald-800 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {farmerNotifications.length === 0 ? (
              <div className="py-16 text-center text-gray-400 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-xs font-semibold">No notifications right now.</p>
              </div>
            ) : (
              farmerNotifications.map((notif) => {
                const isRecommendation = notif.type === 'expert_recommendation';
                const isRisk = notif.type === 'risk_change';
                const isWeather = notif.type === 'weather_alert';

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      notif.read
                        ? 'bg-gray-50/70 border-gray-200 hover:bg-emerald-50/40'
                        : 'bg-emerald-50/90 border-emerald-300 shadow-xs hover:border-emerald-500'
                    }`}
                  >
                    {!notif.read && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                    )}

                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isRecommendation
                            ? 'bg-emerald-700 text-white'
                            : isRisk
                            ? 'bg-red-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isRecommendation && <CheckCircle2 className="w-5 h-5" />}
                        {isRisk && <AlertTriangle className="w-5 h-5" />}
                        {isWeather && <CloudRain className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-gray-900 leading-tight">
                            {notif.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {notif.timestamp}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-800 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                            <span>
                              {isRecommendation
                                ? 'View Recommendation'
                                : isRisk
                                ? 'View Advisory'
                                : 'View Weather'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
            <span className="text-[11px] text-gray-500 font-medium">
              💡 Notifications persist locally and work offline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
