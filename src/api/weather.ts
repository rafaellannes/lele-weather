// API Service - Chama Open-Meteo diretamente do navegador (GRATUITO!)
import { WeatherData, WeatherIconType, LocationResult } from '../types/weather';

// Usando modelo ECMWF (Centro Europeu) - mais preciso
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/ecmwf';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

/**
 * Busca dados do clima por coordenadas
 * @param locationName - Nome opcional da localização (quando vem da busca)
 */
export async function fetchWeatherByCoords(
  lat: number, 
  lon: number, 
  locationName?: { name: string; state?: string }
): Promise<WeatherData> {
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
      'wind_direction_10m'
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

  const response = await fetch(`${OPEN_METEO_URL}?${params}`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar dados do clima');
  }

  const data = await response.json();
  
  // Se veio nome da busca, usar ele. Senão, fazer reverse geocoding
  const location = locationName 
    ? { name: locationName.name, state: locationName.state || '' }
    : await getLocationByCoords(lat, lon);
  
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
 * Quando usa GPS, mostra apenas "Sua localização"
 * (O nome correto vem da busca quando o usuário seleciona uma cidade)
 */
async function getLocationByCoords(_lat: number, _lon: number): Promise<{ name: string; state: string } | null> {
  // Quando usa GPS, não temos o nome da cidade
  // O usuário pode buscar manualmente se quiser ver o nome
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

  // Previsão horária (próximas 12 horas)
  const hourlyForecast = [];
  for (let i = 0; i < 12; i++) {
    const index = currentHour + i;
    if (index >= (hourly.time?.length || 0)) break;

    hourlyForecast.push({
      time: i === 0 ? 'Agora' : formatTime(hourly.time[index]),
      temp: Math.round(hourly.temperature_2m?.[index] || 0),
      rain: hourly.precipitation_probability?.[index] || 0,
      icon: mapWeatherCode(hourly.weather_code?.[index] || 0)
    });
  }

  // Previsão horária por dia (para o modal de detalhes) - 12 horas
  const hourlyByDay: Array<Array<{ time: string; temp: number; rain: number; icon: any }>> = [];
  const daysCount = (daily.time || []).length;
  
  for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
    const dayHourly = [];
    const startHour = dayIndex === 0 ? currentHour : 0; // Hoje começa da hora atual
    const hoursToShow = dayIndex === 0 ? 24 - currentHour : 24; // Quantas horas mostrar
    
    for (let h = 0; h < hoursToShow; h++) {
      const hourIndex = (dayIndex * 24) + startHour + h;
      if (hourIndex >= (hourly.time?.length || 0)) break;
      
      dayHourly.push({
        time: formatTime(hourly.time[hourIndex]),
        temp: Math.round(hourly.temperature_2m?.[hourIndex] || 0),
        rain: hourly.precipitation_probability?.[hourIndex] || 0,
        icon: mapWeatherCode(hourly.weather_code?.[hourIndex] || 0)
      });
    }
    
    // Mostrar até 12 horas
    hourlyByDay.push(dayHourly.slice(0, 12));
  }

  // Previsão de chuva por hora (12 horas)
  const rainHourly = [];
  for (let i = 0; i < 12; i++) {
    const index = currentHour + i;
    if (index >= (hourly.time?.length || 0)) break;

    rainHourly.push({
      time: i === 0 ? 'Agora' : formatTime(hourly.time[index]),
      amount: hourly.precipitation?.[index] || 0,
      chance: hourly.precipitation_probability?.[index] || 0
    });
  }

  // Chuva hora a hora por dia (para o modal de detalhes) - 12 horas
  const rainHourlyByDay: Array<Array<{ time: string; amount: number; chance: number }>> = [];
  
  for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
    const dayRainHourly = [];
    const startHour = dayIndex === 0 ? currentHour : 0;
    const hoursToShow = dayIndex === 0 ? 24 - currentHour : 24;
    
    for (let h = 0; h < hoursToShow; h++) {
      const hourIndex = (dayIndex * 24) + startHour + h;
      if (hourIndex >= (hourly.time?.length || 0)) break;
      
      dayRainHourly.push({
        time: formatTime(hourly.time[hourIndex]),
        amount: hourly.precipitation?.[hourIndex] || 0,
        chance: hourly.precipitation_probability?.[hourIndex] || 0
      });
    }
    
    rainHourlyByDay.push(dayRainHourly.slice(0, 12));
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

  // Formatar nome da localização (evitar vírgula solta se não tiver estado)
  const locationDisplay = location 
    ? (location.state ? `${location.name}, ${location.state}` : location.name)
    : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  return {
    location: locationDisplay,
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
    hourlyByDay,
    rainHourly,
    rainHourlyByDay,
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
  // Adiciona T12:00 para evitar problemas de timezone
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Amanhã';
  }
  
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
}

function formatDate(dateStr: string): string {
  // Adiciona T12:00 para evitar problemas de timezone
  const date = new Date(dateStr + 'T12:00:00');
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

export function saveCoordsToCache(
  lat: number, 
  lon: number, 
  locationName?: { name: string; state?: string }
): void {
  try {
    localStorage.setItem('leleweather_coords', JSON.stringify({ 
      lat, 
      lon,
      locationName: locationName || null
    }));
  } catch {
    // Ignore
  }
}

export function loadCoordsFromCache(): { 
  lat: number; 
  lon: number; 
  locationName?: { name: string; state?: string } | null 
} | null {
  try {
    const cached = localStorage.getItem('leleweather_coords');
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}
