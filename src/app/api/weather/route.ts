import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  try {
    let latitude: number;
    let longitude: number;

    // If city provided, geocode it first
    if (city) {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404 }
        );
      }

      latitude = geoData.results[0].latitude;
      longitude = geoData.results[0].longitude;
    } else if (lat && lon) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);
    } else {
      return NextResponse.json(
        { error: 'Missing city or coordinates' },
        { status: 400 }
      );
    }

    // Fetch weather using coordinates
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );
    const weatherData = await weatherResponse.json();

    if (!weatherData.current) {
      throw new Error('Failed to fetch weather data');
    }

    // Get city name from reverse geocode if using coordinates
    let cityName = city || 'Unknown Location';
    if (!city) {
      const reverseGeoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const reverseGeoData = await reverseGeoResponse.json();
      cityName = reverseGeoData.address?.city || 
                reverseGeoData.address?.town || 
                reverseGeoData.address?.county ||
                'Unknown Location';
    }

    // Map weather codes to descriptions and icons
    const weatherCode = weatherData.current.weather_code;
    const weatherInfo = getWeatherInfo(weatherCode);

    return NextResponse.json({
      name: cityName,
      latitude,
      longitude,
      main: {
        temp: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
      },
      weather: [{
        main: weatherInfo.condition,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
      }],
      wind: {
        speed: weatherData.current.wind_speed_10m,
      }
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather' },
      { status: 500 }
    );
  }
}

// WMO Weather interpretation codes
// https://www.open-meteo.com/en/docs
function getWeatherInfo(code: number) {
  const weatherMap: Record<number, { condition: string; description: string; icon: string }> = {
    0: { condition: 'Clear', description: 'Clear sky', icon: '☀️' },
    1: { condition: 'Cloudy', description: 'Mainly clear', icon: '⛅' },
    2: { condition: 'Cloudy', description: 'Partly cloudy', icon: '⛅' },
    3: { condition: 'Cloudy', description: 'Overcast', icon: '☁️' },
    45: { condition: 'Foggy', description: 'Foggy', icon: '🌫️' },
    48: { condition: 'Foggy', description: 'Depositing rime fog', icon: '🌫️' },
    51: { condition: 'Drizzle', description: 'Light drizzle', icon: '🌧️' },
    53: { condition: 'Drizzle', description: 'Moderate drizzle', icon: '🌧️' },
    55: { condition: 'Drizzle', description: 'Dense drizzle', icon: '🌧️' },
    61: { condition: 'Rain', description: 'Slight rain', icon: '🌦️' },
    63: { condition: 'Rain', description: 'Moderate rain', icon: '🌧️' },
    65: { condition: 'Rain', description: 'Heavy rain', icon: '🌧️' },
    71: { condition: 'Snow', description: 'Slight snow', icon: '❄️' },
    73: { condition: 'Snow', description: 'Moderate snow', icon: '❄️' },
    75: { condition: 'Snow', description: 'Heavy snow', icon: '❄️' },
    77: { condition: 'Snow', description: 'Snow grains', icon: '❄️' },
    80: { condition: 'Rain', description: 'Slight rain showers', icon: '🌦️' },
    81: { condition: 'Rain', description: 'Moderate rain showers', icon: '🌧️' },
    82: { condition: 'Rain', description: 'Violent rain showers', icon: '⛈️' },
    85: { condition: 'Snow', description: 'Slight snow showers', icon: '❄️' },
    86: { condition: 'Snow', description: 'Heavy snow showers', icon: '❄️' },
    95: { condition: 'Thunderstorm', description: 'Thunderstorm', icon: '⛈️' },
    96: { condition: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { condition: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '⛈️' },
  };

  return weatherMap[code] || { condition: 'Unknown', description: 'Unknown', icon: '🌍' };
}

