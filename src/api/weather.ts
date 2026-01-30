// API Service - Chama Open-Meteo diretamente do navegador (GRATUITO!)
import { WeatherData, WeatherIconType, LocationResult } from '../types/weather';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

/**
 * Busca dados do clima por coordenadas
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index'
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
      'precipitation_sum'
    ].join(','),
    timezone: 'America/Sao_Paulo',
    forecast_days: '10'
  });

  const response = await fetch(`${OPEN_METEO_URL}/forecast?${params}`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar dados do clima');
  }

  const data = await response.json();
  const location = await getLocationByCoords(lat, lon);
  
  return formatWeatherData(data, location, lat, lon);
}

/**
 * Busca localização por nome da cidade
 */
export async function searchCities(query: string): Promise<LocationResult[]> {
  if (query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'pt',
    format: 'json'
  });

  try {
    const response = await fetch(`${GEOCODING_URL}/search?${params}`);
    
    if (!response.ok) return [];

    const data = await response.json();
    
    return (data.results || []).map((item: any) => ({
      name: item.name,
      state: item.admin1,
      country: item.country,
      lat: item.latitude,
      lon: item.longitude
    }));
  } catch {
    return [];
  }
}

/**
 * Reverse geocoding - coordenadas para nome do local
 * Busca cidades conhecidas próximas às coordenadas
 */
async function getLocationByCoords(lat: number, lon: number): Promise<{ name: string; state: string } | null> {
  // Lista de cidades brasileiras conhecidas com coordenadas aproximadas
  const knownCities = [
    { name: 'Nova Iguaçu', state: 'RJ', lat: -22.7556, lon: -43.4603 },
    { name: 'Rio de Janeiro', state: 'RJ', lat: -22.9068, lon: -43.1729 },
    { name: 'São Paulo', state: 'SP', lat: -23.5505, lon: -46.6333 },
    { name: 'Belo Horizonte', state: 'MG', lat: -19.9167, lon: -43.9345 },
    { name: 'Brasília', state: 'DF', lat: -15.7975, lon: -47.8919 },
    { name: 'Salvador', state: 'BA', lat: -12.9714, lon: -38.5014 },
    { name: 'Curitiba', state: 'PR', lat: -25.4284, lon: -49.2733 },
    { name: 'Fortaleza', state: 'CE', lat: -3.7172, lon: -38.5433 },
    { name: 'Recife', state: 'PE', lat: -8.0476, lon: -34.8770 },
    { name: 'Porto Alegre', state: 'RS', lat: -30.0346, lon: -51.2177 },
    { name: 'Manaus', state: 'AM', lat: -3.1190, lon: -60.0217 },
    { name: 'Belém', state: 'PA', lat: -1.4558, lon: -48.4902 },
    { name: 'Goiânia', state: 'GO', lat: -16.6869, lon: -49.2648 },
    { name: 'Campinas', state: 'SP', lat: -22.9099, lon: -47.0626 },
    { name: 'Niterói', state: 'RJ', lat: -22.8833, lon: -43.1036 },
    { name: 'Duque de Caxias', state: 'RJ', lat: -22.7858, lon: -43.3116 },
    { name: 'São Gonçalo', state: 'RJ', lat: -22.8268, lon: -43.0634 },
  ];

  // Encontrar cidade mais próxima (distância euclidiana simples)
  let closest = null;
  let minDist = Infinity;

  for (const city of knownCities) {
    const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = city;
    }
  }

  // Se a cidade mais próxima estiver a menos de ~50km (0.5 graus), usar ela
  if (closest && minDist < 0.5) {
    return { name: closest.name, state: closest.state };
  }

  // Caso contrário, retornar localização genérica
  return { name: 'Sua localização', state: '' };
}

/**
 * Formata os dados da API para o formato do app
 */
function formatWeatherData(
  data: any,
  location: { name: string; state: string } | null,
  lat: number,
  lon: number
): WeatherData {
  const current = data.current || {};
  const hourly = data.hourly || {};
  const daily = data.daily || {};

  const now = new Date();
  const currentHour = now.getHours();

  // Previsão horária (próximas 8 horas)
  const hourlyForecast = [];
  for (let i = 0; i < 8; i++) {
    const index = currentHour + i;
    if (index >= (hourly.time?.length || 0)) break;

    hourlyForecast.push({
      time: i === 0 ? 'Agora' : formatTime(hourly.time[index]),
      temp: Math.round(hourly.temperature_2m?.[index] || 0),
      rain: hourly.precipitation_probability?.[index] || 0,
      icon: mapWeatherCode(hourly.weather_code?.[index] || 0)
    });
  }

  // Previsão de chuva por hora
  const rainHourly = [];
  for (let i = 0; i < 8; i++) {
    const index = currentHour + i;
    if (index >= (hourly.time?.length || 0)) break;

    rainHourly.push({
      time: i === 0 ? 'Agora' : formatTime(hourly.time[index]),
      amount: hourly.precipitation?.[index] || 0,
      chance: hourly.precipitation_probability?.[index] || 0
    });
  }

  // Previsão diária
  const dailyForecast = (daily.time || []).map((date: string, i: number) => ({
    date,
    day: formatDayName(date),
    dateFormatted: formatDate(date),
    high: Math.round(daily.temperature_2m_max?.[i] || 0),
    low: Math.round(daily.temperature_2m_min?.[i] || 0),
    rain: daily.precipitation_probability_max?.[i] || 0,
    icon: mapWeatherCode(daily.weather_code?.[i] || 0)
  }));

  // Calcular volume de chuva hoje
  const rainVolume = (hourly.precipitation || [])
    .slice(currentHour, currentHour + 24)
    .reduce((sum: number, val: number) => sum + (val || 0), 0);

  // Ponto de orvalho
  const temp = current.temperature_2m || 20;
  const humidity = current.relative_humidity_2m || 50;
  const dewPoint = calculateDewPoint(temp, humidity);

  return {
    location: location ? `${location.name}, ${location.state}` : `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    address: location?.name || 'Sua localização',
    coords: { lat, lon },
    current: {
      temp: Math.round(current.temperature_2m || 0),
      condition: getWeatherDescription(current.weather_code || 0),
      feelsLike: Math.round(current.apparent_temperature || temp),
      high: Math.round(daily.temperature_2m_max?.[0] || temp),
      low: Math.round(daily.temperature_2m_min?.[0] || temp),
      humidity: current.relative_humidity_2m || 0,
      wind: Math.round(current.wind_speed_10m || 0),
      windDirection: getWindDirection(current.wind_direction_10m || 0),
      pressure: Math.round(current.pressure_msl || 1013),
      uvIndex: Math.round(current.uv_index || 0),
      dewPoint,
      icon: mapWeatherCode(current.weather_code || 0)
    },
    rainForecast: {
      duration: estimateRainDuration(hourly, currentHour),
      description: getRainDescription(hourly, currentHour),
      volume: Math.round(rainVolume * 10) / 10
    },
    sun: {
      sunrise: formatTime(daily.sunrise?.[0] || '06:00'),
      sunset: formatTime(daily.sunset?.[0] || '18:00'),
      dawn: subtractMinutes(daily.sunrise?.[0] || '06:00', 24),
      dusk: addMinutes(daily.sunset?.[0] || '18:00', 24)
    },
    hourly: hourlyForecast,
    rainHourly,
    daily: dailyForecast,
    updatedAt: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
}

// Helpers
function mapWeatherCode(code: number): WeatherIconType {
  if (code === 0) return 'sunny';
  if (code === 1) return 'sunny';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'foggy';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'cloudy';
}

function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Céu limpo',
    1: 'Predominantemente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve forte',
    80: 'Pancadas de chuva',
    81: 'Pancadas moderadas',
    82: 'Pancadas fortes',
    95: 'Tempestade',
    96: 'Tempestade com granizo',
    99: 'Tempestade forte'
  };
  return descriptions[code] || 'Variável';
}

function getWindDirection(degrees: number): string {
  const directions = ['Norte', 'Nordeste', 'Leste', 'Sudeste', 'Sul', 'Sudoeste', 'Oeste', 'Noroeste'];
  return directions[Math.round(degrees / 45) % 8];
}

function calculateDewPoint(temp: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${date.getDate()} de ${months[date.getMonth()]}.`;
}

function subtractMinutes(dateStr: string, minutes: number): string {
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() - minutes);
  return formatTime(date.toISOString());
}

function addMinutes(dateStr: string, minutes: number): string {
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() + minutes);
  return formatTime(date.toISOString());
}

function estimateRainDuration(hourly: any, currentHour: number): string {
  let rainyHours = 0;
  const probabilities = hourly.precipitation_probability || [];
  
  for (let i = currentHour; i < probabilities.length; i++) {
    if (probabilities[i] > 30) {
      rainyHours++;
    } else {
      break;
    }
  }
  
  if (rainyHours === 0) return 'Sem chuva prevista';
  return `${rainyHours} hora${rainyHours > 1 ? 's' : ''}`;
}

function getRainDescription(hourly: any, currentHour: number): string {
  const probabilities = hourly.precipitation_probability || [];
  
  for (let i = currentHour; i < Math.min(currentHour + 12, probabilities.length); i++) {
    if (probabilities[i] > 30) {
      const intensity = probabilities[i] > 70 
        ? 'Chuva moderada a forte' 
        : probabilities[i] > 40 
          ? 'Chuva fraca a moderada' 
          : 'Possibilidade de chuva leve';
      
      // Encontrar quando para
      let endIndex = i;
      for (let j = i; j < probabilities.length; j++) {
        if (probabilities[j] < 30) {
          endIndex = j;
          break;
        }
      }
      
      const endTime = formatTime(hourly.time?.[endIndex] || '');
      return `${intensity} até às ${endTime}`;
    }
  }
  
  return 'Sem previsão de chuva';
}

// Salvar no localStorage para cache offline
export function saveToCache(data: WeatherData): void {
  try {
    localStorage.setItem('leleweather_cache', JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore storage errors
  }
}

export function loadFromCache(): WeatherData | null {
  try {
    const cached = localStorage.getItem('leleweather_cache');
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Cache válido por 30 minutos
    if (Date.now() - timestamp > 30 * 60 * 1000) {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

export function saveCoordsToCache(lat: number, lon: number): void {
  try {
    localStorage.setItem('leleweather_coords', JSON.stringify({ lat, lon }));
  } catch {
    // Ignore
  }
}

export function loadCoordsFromCache(): { lat: number; lon: number } | null {
  try {
    const cached = localStorage.getItem('leleweather_coords');
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}
