import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    let url: string;

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      return NextResponse.json(
        { error: 'Missing city or coordinates' },
        { status: 400 }
      );
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch weather' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather' },
      { status: 500 }
    );
  }
}

// Helper function for weather icon mapping (not needed for OpenWeatherMap)
function getWeatherInfo(code: number, isDay: boolean) {
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

