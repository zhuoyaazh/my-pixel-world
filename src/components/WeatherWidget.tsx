'use client';

import { useState, useEffect, useCallback } from 'react';

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
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
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
  const getWeatherByCity = useCallback(async (city: string) => {
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
  }, [ui.errorFetch]);

  // Load default city on mount
  useEffect(() => {
    getWeatherByCity('Bandung');
  }, [getWeatherByCity]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getWeatherByCity(searchInput);
  };

  return (
    <div className="text-center">
      <div className="w-full px-6 py-6 sm:px-8 sm:py-8 bg-pastel-yellow rounded-lg space-y-3 min-h-55 flex flex-col items-center justify-center">
        {/* Weather Icon/Emoji - Large Display */}
        {weather && !error && (
          <div className="text-4xl sm:text-5xl animate-bounce">
            {getWeatherEmoji(weather.weather[0].main)}
          </div>
        )}
        
        {loading && !weather && (
          <div className="text-4xl sm:text-5xl animate-pulse">⏳</div>
        )}
        
        {error && (
          <div className="text-4xl sm:text-5xl">❌</div>
        )}

        {/* Temperature Display */}
        {weather && !error && (
          <>
            <p className="text-[10px] sm:text-xs font-bold text-retro-border uppercase tracking-wide">
              {weather.name}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-retro-border">
              {weather.main.temp.toFixed(1)}°C
            </p>
            <p className="text-[8px] sm:text-[9px] text-retro-border font-bold capitalize">
              {weather.weather[0].description}
            </p>
            <div className="flex gap-3 justify-center text-[8px] sm:text-[9px] font-bold text-retro-border">
              <span>💧 {weather.main.humidity}%</span>
              <span>💨 {weather.wind.speed.toFixed(1)} km/h</span>
            </div>
          </>
        )}

        {error && (
          <p className="text-[9px] sm:text-[10px] text-red-600 font-bold">
            {error}
          </p>
        )}

        {loading && !weather && (
          <p className="text-[9px] sm:text-[10px] text-retro-border font-bold">
            {ui.loading}
          </p>
        )}

        {/* Search Controls - Compact */}
        <div className="flex gap-2 flex-wrap justify-center pt-2">
          <button
            onClick={getWeatherByLocation}
            disabled={loading}
            className="text-[8px] px-2 py-1 bg-pastel-blue text-black border-2 border-black font-bold hover:bg-opacity-80 disabled:opacity-50 transition-all"
          >
            📍 {ui.auto}
          </button>
          <form onSubmit={handleSearch} className="flex gap-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={ui.placeholder}
              className="text-[8px] px-2 py-1 border-2 border-black w-20 font-bold placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="text-[8px] px-2 py-1 bg-white text-black border-2 border-black font-bold hover:bg-opacity-80 disabled:opacity-50 transition-all"
            >
              🔍
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function to get weather emoji based on condition
function getWeatherEmoji(condition: string): string {
  const emojis: { [key: string]: string } = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Dust: '🌫️',
    Fog: '🌫️',
    Sand: '🌫️',
    Ash: '🌫️',
    Squall: '💨',
    Tornado: '🌪️',
  };
  return emojis[condition] || '🌤️';
}
