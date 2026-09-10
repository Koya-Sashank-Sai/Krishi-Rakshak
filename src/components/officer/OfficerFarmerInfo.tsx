import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  Sprout,
  CheckCircle2,
} from 'lucide-react';

export default function OfficerFarmerInfo() {
  const { t } = useLanguage();
  const {
    farmerDirectory,
    officerDistrict,
    officerVillage,
    officerCrop,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Filter based on context and search term
  const filteredFarmers = farmerDirectory.filter((f) => {
    // Context filter
    if (officerDistrict && officerDistrict !== 'All' && f.district !== officerDistrict) return false;
    if (officerVillage && officerVillage !== 'All' && f.village !== officerVillage) return false;
    if (officerCrop && officerCrop !== 'All' && f.cropName.toLowerCase() !== officerCrop.toLowerCase()) return false;

    // Search query
    if (
      searchTerm &&
      !f.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !f.cropName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !f.diseaseInfected.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <span>{t.farmerInfoTitle}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t.farmerInfoSubtitle} &bull; Jurisdiction: <strong>{officerDistrict}</strong>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="farmer-info-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchFarmerPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-gray-50/50"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-700">
            Total Enrolled Farmers in Active Context: <strong>{filteredFarmers.length}</strong>
          </span>
          <span className="text-gray-500 text-[11px]">
            Privacy Shielded: Only anonymized telemetry and authorized contact protocols enabled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Exactly: S.No., Farmer Name, Crop Name, Disease Infected, Number of Scans / Uploads */}
              <tr className="bg-gray-100/70 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-4 w-16">{t.sNo}</th>
                <th className="py-3.5 px-4">{t.farmerName}</th>
                <th className="py-3.5 px-4">Village</th>
                <th className="py-3.5 px-4">{t.cropName}</th>
                <th className="py-3.5 px-4">{t.diseaseInfected}</th>
                <th className="py-3.5 px-4 text-center">{t.scansCount}</th>
                <th className="py-3.5 px-4 text-right">Surveillance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No farmer records found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer, idx) => (
                  <tr key={farmer.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-500">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4 font-bold text-gray-900">
                      {farmer.name}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {farmer.village}
                    </td>

                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {farmer.cropName}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          farmer.diseaseInfected === 'Pink Bollworm' ||
                          farmer.diseaseInfected === 'Late Blight'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {farmer.diseaseInfected}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-mono font-bold bg-gray-100 text-gray-800">
                        {farmer.scanCount} scans
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Monitored
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
