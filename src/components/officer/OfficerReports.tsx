import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_LOCATIONS, CROPS_DATA } from '../../data/mockData';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  ShieldCheck,
  CloudRain,
  Droplets,
  Sun,
  Flame,
  Sparkles,
  Send,
  CheckCircle2,
  Sliders,
  ArrowUpRight,
  Info,
} from 'lucide-react';

type WeatherTrendType = 'Continuous Rain' | 'High Humidity' | 'Dry Spell' | 'Temperature Rise';

export default function OfficerReports() {
  const { t } = useLanguage();
  const {
    officerDistrict,
    setOfficerDistrict,
    officerVillage,
    setOfficerVillage,
    officerCrop,
    setOfficerCrop,
    reportedCases,
  } = useApp();

  const [dateRange, setDateRange] = useState('Last 30 Days');

  const districts = Object.keys(MAHARASHTRA_LOCATIONS);
  const villages = MAHARASHTRA_LOCATIONS[officerDistrict] || [];

  // Outbreak Risk Simulation Inputs
  const [simVillage, setSimVillage] = useState<string>(
    officerVillage !== 'All' ? officerVillage : villages[0] || 'Aabithkhind'
  );
  const [simCrop, setSimCrop] = useState<string>(
    officerCrop !== 'All' ? officerCrop : 'Tomato'
  );
  const [projectedWeatherTrend, setProjectedWeatherTrend] = useState<WeatherTrendType>('Continuous Rain');
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);

  // Outbreak Risk Simulation projection computation
  const getSimulationResults = (village: string, crop: string, trend: WeatherTrendType) => {
    switch (trend) {
      case 'Continuous Rain':
        return {
          riskLevel: 'High' as const,
          riskPill: 'bg-red-100 text-red-800 border-red-300',
          riskGradient: 'from-red-500 to-red-600',
          affectedAreaIncrease: 58,
          trendDescription:
            'Water-film leaf wetness exceeding 18 hours per day enables explosive fungal spore germination and raindrop splash dissemination.',
          recommendation: `Issue preemptive spray advisory for all ${crop} fields across ${village}. Recommend preventive application of Copper Oxychloride 50% WP (2.5g/L) or Trichoderma harzianum (5g/L) prior to the rain front. Enforce clearance of farm drainage channels to avert waterlogging and Phytophthora root rot.`,
          chartData: [
            { day: 'Day 1', riskScore: 28, projectedAffectedArea: 14 },
            { day: 'Day 2', riskScore: 42, projectedAffectedArea: 21 },
            { day: 'Day 3', riskScore: 59, projectedAffectedArea: 32 },
            { day: 'Day 4', riskScore: 74, projectedAffectedArea: 44 },
            { day: 'Day 5', riskScore: 86, projectedAffectedArea: 56 },
            { day: 'Day 6', riskScore: 92, projectedAffectedArea: 65 },
            { day: 'Day 7', riskScore: 96, projectedAffectedArea: 72 },
          ],
        };
      case 'High Humidity':
        return {
          riskLevel: 'High' as const,
          riskPill: 'bg-red-100 text-red-800 border-red-300',
          riskGradient: 'from-amber-500 to-red-500',
          affectedAreaIncrease: 44,
          trendDescription:
            'Continuous atmospheric RH >85% with prolonged morning dew encourages rapid downy/powdery mildew mycelial growth and conidial sporulation.',
          recommendation: `Advise ${village} farmers cultivating ${crop} to improve intra-canopy air circulation through selective lower leaf pruning. Cease overhead sprinkler irrigation immediately. Schedule preventive bio-protectant spray (Pseudomonas fluorescens @ 5ml/L) during early dawn hours.`,
          chartData: [
            { day: 'Day 1', riskScore: 24, projectedAffectedArea: 12 },
            { day: 'Day 2', riskScore: 36, projectedAffectedArea: 18 },
            { day: 'Day 3', riskScore: 52, projectedAffectedArea: 26 },
            { day: 'Day 4', riskScore: 68, projectedAffectedArea: 36 },
            { day: 'Day 5', riskScore: 78, projectedAffectedArea: 45 },
            { day: 'Day 6', riskScore: 85, projectedAffectedArea: 51 },
            { day: 'Day 7', riskScore: 89, projectedAffectedArea: 56 },
          ],
        };
      case 'Dry Spell':
        return {
          riskLevel: 'Low' as const,
          riskPill: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          riskGradient: 'from-emerald-500 to-teal-600',
          affectedAreaIncrease: 12,
          trendDescription:
            'Dry atmospheric envelope halts fungal spore germination; however, high vapor pressure deficits trigger sucking pest (thrips/mites) buildup.',
          recommendation: `Fungal foliar blights will remain latent under this dry spell in ${village}. Withhold chemical fungicides. Advise ${crop} growers to conduct deficit drip irrigation in early morning to prevent plant stress and monitor for two-spotted spider mites and onion/chilli thrips.`,
          chartData: [
            { day: 'Day 1', riskScore: 18, projectedAffectedArea: 10 },
            { day: 'Day 2', riskScore: 19, projectedAffectedArea: 11 },
            { day: 'Day 3', riskScore: 20, projectedAffectedArea: 11 },
            { day: 'Day 4', riskScore: 21, projectedAffectedArea: 12 },
            { day: 'Day 5', riskScore: 23, projectedAffectedArea: 13 },
            { day: 'Day 6', riskScore: 24, projectedAffectedArea: 14 },
            { day: 'Day 7', riskScore: 25, projectedAffectedArea: 15 },
          ],
        };
      case 'Temperature Rise':
        return {
          riskLevel: 'Medium' as const,
          riskPill: 'bg-amber-100 text-amber-800 border-amber-300',
          riskGradient: 'from-amber-400 to-amber-600',
          affectedAreaIncrease: 28,
          trendDescription:
            'Ambient temperatures rising above 33°C shorten insect pest life cycles by 40%, accelerating larval hatching and leaf scorching.',
          recommendation: `Alert ${crop} farmers in ${village} to inspect for thermal leaf scorch and surging lepidopteran larvae (bollworms / armyworms). Advise mulching to preserve rhizosphere moisture and deploy yellow/blue sticky traps + pheromone lures at 5 traps/acre.`,
          chartData: [
            { day: 'Day 1', riskScore: 20, projectedAffectedArea: 11 },
            { day: 'Day 2', riskScore: 28, projectedAffectedArea: 15 },
            { day: 'Day 3', riskScore: 38, projectedAffectedArea: 20 },
            { day: 'Day 4', riskScore: 49, projectedAffectedArea: 26 },
            { day: 'Day 5', riskScore: 57, projectedAffectedArea: 32 },
            { day: 'Day 6', riskScore: 62, projectedAffectedArea: 36 },
            { day: 'Day 7', riskScore: 65, projectedAffectedArea: 39 },
          ],
        };
    }
  };

  const simulation = getSimulationResults(simVillage, simCrop, projectedWeatherTrend);

  // Distribution data based on current context
  const distributionData = [
    { name: t.healthyCrops, value: 48, color: '#16a34a' },
    { name: t.lowRiskCrops, value: 24, color: '#22c55e' },
    { name: t.moderateRiskCrops, value: 18, color: '#f59e0b' },
    { name: t.highRiskCrops, value: 10, color: '#dc2626' },
  ];

  // Crop-wise incident distribution
  const cropIncidentData = [
    { crop: 'Cotton', healthy: 120, affected: 35 },
    { crop: 'Soybean', healthy: 180, affected: 22 },
    { crop: 'Tomato', healthy: 95, affected: 28 },
    { crop: 'Onion', healthy: 140, affected: 15 },
    { crop: 'Pigeon Pea', healthy: 85, affected: 12 },
  ];

  // 4-week epidemiological trend
  const trendData = [
    { week: 'Week 1', cases: 14, resolved: 8 },
    { week: 'Week 2', cases: 22, resolved: 15 },
    { week: 'Week 3', cases: 31, resolved: 24 },
    { week: 'Week 4', cases: 19, resolved: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Filters: District, Village, Crop, Date range */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm pb-2 border-b border-gray-100">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Report Analytic Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t.district}
            </label>
            <select
              value={officerDistrict}
              onChange={(e) => setOfficerDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
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
              {t.village}
            </label>
            <select
              value={officerVillage}
              onChange={(e) => setOfficerVillage(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="All">{t.allVillages}</option>
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t.cropName}
            </label>
            <select
              value={officerCrop}
              onChange={(e) => setOfficerCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="All">{t.allCrops}</option>
              {CROPS_DATA.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Current Kharif Season">Current Kharif Season</option>
              <option value="Full Year 2026">Full Year 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart: Crop Health Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <PieIcon className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-gray-900 font-serif">
                {t.cropHealthDistribution}
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              Canopy health breakdown for {officerVillage === 'All' ? officerDistrict : officerVillage}
            </p>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs pt-4 border-t border-gray-100">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-900 font-semibold text-center">
              Healthy / Low: <strong>72%</strong>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-900 font-semibold text-center">
              Vulnerable / High: <strong>28%</strong>
            </div>
          </div>
        </div>

        {/* Bar Chart: Crop-Wise Infection Incidence */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-gray-900 font-serif">
                Crop Health & Infection Severity By Commodity
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              Surveyed agricultural acres (Healthy vs Symptomatic)
            </p>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropIncidentData}>
                  <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={32} />
                  <Bar dataKey="healthy" fill="#16a34a" name="Healthy Acres" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="affected" fill="#ea580c" name="Infected / Symptomatic" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 mt-4 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Cotton and Tomato exhibit 35% higher foliar infection risk during the current damp cycle.
            </span>
          </div>
        </div>
      </div>

      {/* 4-Week Epidemiological Trend Line */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-gray-900 font-serif">
              Epidemiological Surveillance & Resolution Trajectory
            </h2>
          </div>
          <span className="text-xs text-gray-500">{dateRange}</span>
        </div>

        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend verticalAlign="top" height={32} />
              <Line
                type="monotone"
                dataKey="cases"
                stroke="#dc2626"
                strokeWidth={2.5}
                name="New Infections Detected"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#16a34a"
                strokeWidth={2.5}
                name="Officer Verified / Managed"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OUTBREAK RISK SIMULATION (Interactive Predictive Early Warning) */}
      <div
        id="outbreak-risk-simulation-card"
        className="bg-white rounded-2xl p-6 border-2 border-emerald-300 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-800 text-white shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 font-serif">
                Predictive Outbreak Risk Simulator & Early Warning
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Simulate localized epidemiological spread and spore dispersion based on 7-day microclimate projections.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>ICAR Epidemic Modeling v2.4</span>
            </span>
          </div>
        </div>

        {/* Interactive Controls: Village, Crop, Weather Trend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4.5 rounded-xl border border-gray-200">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Select Target Village
            </label>
            <select
              id="sim-village-select"
              value={simVillage}
              onChange={(e) => {
                setSimVillage(e.target.value);
                setBroadcastNotice(null);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white shadow-2xs"
            >
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Target Crop Commodity
            </label>
            <select
              id="sim-crop-select"
              value={simCrop}
              onChange={(e) => {
                setSimCrop(e.target.value);
                setBroadcastNotice(null);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white shadow-2xs"
            >
              {CROPS_DATA.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Projected Weather Trend
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'Continuous Rain', label: 'Heavy Rain', icon: CloudRain },
                  { id: 'High Humidity', label: 'High Humidity', icon: Droplets },
                  { id: 'Dry Spell', label: 'Dry Spell', icon: Sun },
                  { id: 'Temperature Rise', label: 'Temp Spike', icon: Flame },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  id={`sim-trend-${id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setProjectedWeatherTrend(id);
                    setBroadcastNotice(null);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                    projectedWeatherTrend === id
                      ? 'bg-emerald-800 text-white shadow-xs border border-emerald-900'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simulation Output Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 7-Day Risk & Area Trajectory Chart */}
          <div className="lg:col-span-7 bg-white rounded-xl p-4.5 border border-gray-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>7-Day Simulated Outbreak Trajectory</span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  Estimated disease index (%) & projected acreage affected in {simVillage}
                </p>
              </div>

              <span
                className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${simulation.riskPill}`}
              >
                Risk: {simulation.riskLevel}
              </span>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulation.chartData}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={30} />
                  <Area
                    type="monotone"
                    dataKey="riskScore"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#riskGrad)"
                    name="Risk Index (%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="projectedAffectedArea"
                    stroke="#d97706"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaGrad)"
                    name="Affected Acreage (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-center justify-between">
              <span>Projection baseline: <strong>{simCrop}</strong> in <strong>{simVillage}</strong></span>
              <span className="font-bold text-red-700">
                +{simulation.affectedAreaIncrease}% Potential Spread
              </span>
            </div>
          </div>

          {/* Epidemiological Mechanism & Officer Action */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Mechanism card */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-950">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Microclimate Mechanism ({projectedWeatherTrend})</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {simulation.trendDescription}
              </p>
            </div>

            {/* Officer Recommendation Card */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Actionable Extension Advisory</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                  Officer Action
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {simulation.recommendation}
              </p>
            </div>

            {/* Broadcast Advisory Notice Button */}
            <div className="space-y-2">
              <button
                id="btn-broadcast-advisory"
                onClick={() => {
                  setBroadcastNotice(
                    `Broadcast advisory successfully queued for ${simVillage}! Push SMS and applet notifications dispatched to 42 registered ${simCrop} farmers.`
                  );
                }}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-300" />
                <span>Broadcast Advisory to {simVillage} Farmers</span>
              </button>

              {broadcastNotice && (
                <div
                  id="broadcast-notice-success"
                  className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{broadcastNotice}</span>
                  </div>
                  <button
                    onClick={() => setBroadcastNotice(null)}
                    className="text-emerald-800 hover:text-emerald-950 font-bold ml-2 text-xs"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
