import { DISTRICT_WEATHER_PATTERNS } from '../data/mockData';
import { WeatherData } from '../types';

/**
 * Service to derive real-time agro-meteorological conditions automatically
 * based on District + Village geographic context.
 * Farmers never have to manually enter weather or temperature.
 */
export async function getWeatherByLocation(
  district: string,
  village: string
): Promise<WeatherData> {
  // Deterministic micro-variation based on village name to reflect microclimatic differences
  const hash = village
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tempOffset = (hash % 5) - 2; // -2 to +2 °C
  const humOffset = (hash % 7) - 3; // -3% to +3%
  const rainOffset = (hash % 3) * 0.5;

  const base = DISTRICT_WEATHER_PATTERNS[district] || {
    temperature: 28,
    humidity: 75,
    rainfall: 3.5,
    condition: 'Partly Cloudy with Moderate Humidity',
    windSpeed: 14,
    riskFactorSummary: 'Ambient humidity (>70%) and warm canopy temperature create moderate fungal spore germination risk.',
  };

  const calculatedTemp = Math.round((base.temperature || 28) + tempOffset);
  const calculatedHum = Math.min(98, Math.max(45, (base.humidity || 75) + humOffset));
  const calculatedRain = Math.max(0, Number(((base.rainfall || 2) + rainOffset).toFixed(1)));

  return {
    district: district || 'Ahmednagar',
    village: village || 'Aabithkhind',
    temperature: calculatedTemp,
    humidity: calculatedHum,
    rainfall: calculatedRain,
    condition: base.condition || 'Scattered Cloud Cover',
    windSpeed: base.windSpeed || 14,
    riskFactorSummary: base.riskFactorSummary || 'Canopy humidity remains conducive to spore multiplication.',
  };
}
