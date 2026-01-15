'use client';

import { useState, useEffect } from 'react';
import RetroCard from './RetroCard';

type WeatherLabels = {
  heading: string;
  auto: string;
  placeholder: string;
  loading: string;
  humidity: string;
  wind: string;
  errorLocation: string;
  errorFetch: string;
};

type WeatherWidgetProps = {
  labels?: WeatherLabels;
};

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility?: number;
  clouds?: {
    all: number;
  };
}

export default function WeatherWidget({ labels }: WeatherWidgetProps) {
  const ui: WeatherLabels = labels ?? {
    heading: '🌤️ WEATHER',
    auto: 'AUTO',
    placeholder: 'City...',
    loading: 'Loading weather...',
    humidity: 'Humidity',
    wind: 'Wind',
    errorLocation: 'Location access denied',
    errorFetch: 'Failed to fetch weather',
  };
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');

  // Get weather by geolocation
  const getWeatherByLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err)
        );
      });

      const response = await fetch(
        `/api/weather?lat=${position.latitude}&lon=${position.longitude}`
      );

      if (!response.ok) {
        throw new Error(ui.errorFetch);
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      const locationError = err instanceof Error ? err.message : null;
      setError(locationError || ui.errorLocation);
      console.error('Geolocation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get weather by city search
  const getWeatherByCity = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || ui.errorFetch);
      }

      const data = await response.json();
      setWeather(data);
      setSearchInput('');
    } catch (err) {
      const fetchError = err instanceof Error ? err.message : null;
      setError(fetchError || ui.errorFetch);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load default city on mount
  useEffect(() => {
    getWeatherByCity('Bandung');
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getWeatherByCity(searchInput);
  };

  return (
    <RetroCard className="flex flex-col gap-3 sm:gap-4">
      <h2 className="text-[10px] sm:text-xs font-bold text-pastel-purple">
        {ui.heading}
      </h2>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={getWeatherByLocation}
          disabled={loading}
          className="text-[8px] sm:text-[9px] px-2 py-1 sm:px-3 sm:py-1.5 bg-pastel-blue text-black border-2 border-black font-bold hover:bg-opacity-80 disabled:opacity-50 transition-all"
        >
          {loading ? '...' : ui.auto}
        </button>
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={ui.placeholder}
            className="text-[8px] sm:text-[9px] px-2 py-1 sm:px-3 sm:py-1.5 border-2 border-black flex-1 font-bold placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="text-[8px] sm:text-[9px] px-2 py-1 sm:px-3 sm:py-1.5 bg-pastel-yellow text-black border-2 border-black font-bold hover:bg-opacity-80 disabled:opacity-50 transition-all"
          >
            {loading ? '...' : '🔍'}
          </button>
        </form>
      </div>

      {/* Weather Display */}
      {error && (
        <div className="text-[8px] sm:text-[9px] text-red-500 font-bold">
          ✗ {error}
        </div>
      )}

      {weather && !error && (
        <div className="space-y-2 sm:space-y-3">
          <div className="text-[9px] sm:text-xs font-bold text-pastel-purple">
            {weather.name}
          </div>
          <div className="text-lg sm:text-2xl">
            {getWeatherEmoji(weather.weather[0].icon)}
          </div>
          <div className="text-[9px] sm:text-xs font-bold">
            <div className="text-lg sm:text-xl">{weather.main.temp.toFixed(1)}°C</div>
            <div className="text-pastel-blue capitalize">{weather.weather[0].description}</div>
            <div className="text-gray-500 text-[8px] sm:text-[9px]">Feels like {weather.main.feels_like.toFixed(1)}°C</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[8px] sm:text-[9px] text-gray-600 font-bold">
            <div>💧 {ui.humidity}: {weather.main.humidity}%</div>
            <div>💨 {ui.wind}: {weather.wind.speed.toFixed(1)} m/s</div>
            <div>🎈 Pressure: {weather.main.pressure} hPa</div>
            {weather.clouds && <div>☁️ Clouds: {weather.clouds.all}%</div>}
            {weather.visibility && <div className="col-span-2">👁️ Visibility: {(weather.visibility / 1000).toFixed(1)} km</div>}
          </div>
        </div>
      )}

      {loading && !weather && (
        <div className="text-[8px] sm:text-[9px] text-gray-600 font-bold">
          {ui.loading}
        </div>
      )}
    </RetroCard>
  );
}

// Helper to map OpenWeatherMap icon codes to emojis
function getWeatherEmoji(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[iconCode] || iconCode;
}
