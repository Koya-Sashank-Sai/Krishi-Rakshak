import React, { useEffect, useRef } from 'react';
import { HotspotPoint } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { VILLAGE_COORDINATES, DISTRICT_COORDINATES } from '../../data/mockData';
import {
  Layers,
  Info,
} from 'lucide-react';
import L from 'leaflet';

interface GisHotspotMapProps {
  hotspots: HotspotPoint[];
  selectedDistrict: string;
  selectedVillage: string;
  selectedCrop: string;
  onSelectHotspot: (hp: HotspotPoint) => void;
  selectedHotspot: HotspotPoint | null;
}

export default function GisHotspotMap({
  hotspots,
  selectedDistrict,
  selectedVillage,
  selectedCrop,
  onSelectHotspot,
}: GisHotspotMapProps) {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  // Filter hotspots according to current global context filters
  const filteredHotspots = hotspots.filter((hp) => {
    if (selectedDistrict && selectedDistrict !== 'All' && hp.district !== selectedDistrict) {
      return false;
    }
    if (selectedVillage && selectedVillage !== 'All' && hp.village !== selectedVillage) {
      return false;
    }
    if (selectedCrop && selectedCrop !== 'All' && hp.crop.toLowerCase() !== selectedCrop.toLowerCase()) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Determine initial center
      const initialCenter: [number, number] =
        (selectedVillage !== 'All' && VILLAGE_COORDINATES[selectedVillage]) ||
        DISTRICT_COORDINATES[selectedDistrict] ||
        [19.0952, 74.7496];

      const initialZoom = selectedVillage !== 'All' ? 14 : 11;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 9,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      layersRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersRef.current = null;
      }
    };
  }, []);

  // Update center, village boundary, and hotspot markers whenever filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersRef.current) return;

    layersRef.current.clearLayers();

    const isSpecificVillage = selectedVillage && selectedVillage !== 'All';
    const villageCoord = isSpecificVillage ? VILLAGE_COORDINATES[selectedVillage] : null;
    const districtCoord = DISTRICT_COORDINATES[selectedDistrict] || [19.0952, 74.7496];

    if (isSpecificVillage && villageCoord) {
      // Automatically center and zoom to that village (NOT world/state)
      map.setView(villageCoord, 14, { animate: true });

      // Draw the selected village boundary and immediate surroundings
      const villageBoundary = L.circle(villageCoord, {
        radius: 1400, // ~1.4km village agricultural boundary
        color: '#059669',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#10b981',
        fillOpacity: 0.08,
      });

      villageBoundary.bindTooltip(
        `<div style="font-weight: bold; color: #065f46; font-size: 11px;">📍 ${selectedVillage} Village Cadastral Boundary</div>`,
        { permanent: false, direction: 'center' }
      );
      villageBoundary.addTo(layersRef.current);

      // Village center anchor marker
      const centerMarker = L.circleMarker(villageCoord, {
        radius: 6,
        fillColor: '#047857',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      });
      centerMarker.bindTooltip(
        `<strong style="font-size: 11px;">${selectedVillage} Gram Panchayat Center</strong>`,
        { direction: 'top' }
      );
      centerMarker.addTo(layersRef.current);
    } else {
      // District-level view with aggregated hotspots
      map.setView(districtCoord, 11, { animate: true });
    }

    // Add hotspot markers with required severity indicators: 🟢 Low, 🟠 Medium, 🔴 High
    filteredHotspots.forEach((hp) => {
      const color =
        hp.riskLevel === 'HIGH'
          ? '#dc2626' // 🔴 High
          : hp.riskLevel === 'MEDIUM'
          ? '#ea580c' // 🟠 Medium
          : '#16a34a'; // 🟢 Low

      const radius = hp.riskLevel === 'HIGH' ? 18 : hp.riskLevel === 'MEDIUM' ? 14 : 10;

      // Halo ring for high-risk points
      if (hp.riskLevel === 'HIGH') {
        const pulseHalo = L.circleMarker([hp.lat, hp.lng], {
          radius: radius + 7,
          fillColor: '#ef4444',
          color: '#dc2626',
          weight: 1,
          opacity: 0.4,
          fillOpacity: 0.15,
        });
        pulseHalo.addTo(layersRef.current!);
      }

      const marker = L.circleMarker([hp.lat, hp.lng], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.85,
      });

      // Strict privacy popup: Village, Crop, Disease/Pest, Severity, Risk level, Number of cases
      // ZERO farmer phone numbers or personal data!
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 2px; min-width: 170px; font-size: 11px; line-height: 1.4;">
          <div style="font-weight: 800; font-size: 12px; color: #111827; margin-bottom: 3px; border-bottom: 1px solid #e5e7eb; padding-bottom: 2px;">
            ${hp.village} Cluster
          </div>
          <div style="margin: 2px 0;"><strong>Crop:</strong> ${hp.crop}</div>
          <div style="margin: 2px 0;"><strong>Disease / Pest:</strong> <span style="color: ${color}; font-weight: 700;">${hp.disease}</span></div>
          <div style="margin: 2px 0;"><strong>Severity:</strong> ${hp.severity}</div>
          <div style="margin: 2px 0;"><strong>Risk Level:</strong> <span style="font-weight: 700; color: ${color};">${hp.riskLevel}</span></div>
          <div style="margin: 2px 0;"><strong>Cases Reported:</strong> ${hp.casesCount} cases</div>
          <div style="margin-top: 5px; font-size: 9px; color: #6b7280; font-style: italic; border-top: 1px dashed #e5e7eb; padding-top: 2px;">
            🔒 Farmer privacy strictly protected
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false });

      marker.on('click', () => {
        onSelectHotspot(hp);
      });

      marker.addTo(layersRef.current!);
    });
  }, [filteredHotspots, selectedDistrict, selectedVillage, selectedCrop, onSelectHotspot]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-200 shadow-sm bg-gray-100">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl shadow-md border border-gray-200 text-xs flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Active Hotspots: {filteredHotspots.length}</span>
        </div>
        <span className="text-gray-300">|</span>
        <span className="text-gray-700 font-semibold">
          {selectedVillage !== 'All' ? `Village: ${selectedVillage}` : `District: ${selectedDistrict}`}
        </span>
      </div>

      {/* Map Legend at Top Right */}
      <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-md border border-gray-200 text-xs hidden sm:block">
        <div className="font-bold text-gray-900 mb-1.5">{t.mapLegendTitle}</div>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white shrink-0" />
            <span className="text-gray-700 font-medium">🔴 High Risk ({t.highCases})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shrink-0" />
            <span className="text-gray-700 font-medium">🟠 Medium Risk ({t.mediumCases})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shrink-0" />
            <span className="text-gray-700 font-medium">🟢 Low Risk ({t.lowCases})</span>
          </div>
        </div>
      </div>

      {/* Interactive Map DOM element */}
      <div
        ref={mapContainerRef}
        id="gis-leaflet-container"
        className="w-full h-[420px] z-0"
      />

      {/* Map Footer Privacy Rule Notice */}
      <div className="p-3 bg-emerald-900 text-white text-[11px] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>{t.privacyNotice}</span>
        </div>
        <span className="text-emerald-300 font-medium hidden md:inline">
          {t.clickHotspotPrompt}
        </span>
      </div>
    </div>
  );
}
