/**
 * API Service - Open-Meteo (GRATUITO!)
 * Usa API padrão para dados atuais e ECMWF para previsão diária (mais preciso)
 */
import { WeatherData, WeatherIconType, LocationResult } from '../types/weather';
import { 
  API_CONFIG, 
  FORECAST_CONFIG, 
  SEARCH_CONFIG, 
  CACHE_CONFIG,
  WeatherApiError 
} from '../config/constants';

/**
 * Busca dados do clima por coordenadas
 * Usa API padrão para current + ECMWF para previsão (mais preciso)
 * @param locationName - Nome opcional da localização (quando vem da busca)
 */
export async function fetchWeatherByCoords(
  lat: number, 
  lon: number, 
  locationName?: { name: string; state?: string }
): Promise<WeatherData> {
  // Usar timezone=auto para que a API retorne no timezone LOCAL da cidade pesquisada
  const timezone = 'auto';
  
  // Busca dados atuais da API padrão
  const currentParams = new URLSearchParams({
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
    timezone
  });

  // Busca previsão do ECMWF (mais preciso para dias futuros)
  const forecastParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
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
    timezone,
    forecast_days: FORECAST_CONFIG.DAYS.toString()
  });

  try {
    // Busca em paralelo
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${API_CONFIG.OPEN_METEO}?${currentParams}`),
      fetch(`${API_CONFIG.ECMWF}?${forecastParams}`)
    ]);
    
    if (!currentResponse.ok) {
      throw new WeatherApiError(
        `Erro ao buscar dados atuais: ${currentResponse.status}`,
        currentResponse.status
      );
    }
    
    if (!forecastResponse.ok) {
      throw new WeatherApiError(
        `Erro ao buscar previsão: ${forecastResponse.status}`,
        forecastResponse.status
      );
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    
    // Combina os dados
    const data = {
      ...forecastData,
      current: currentData.current,
      current_units: currentData.current_units
    };
    
    // Se veio nome da busca, usar ele. Senão, fazer reverse geocoding
    const location = locationName 
      ? { name: locationName.name, state: locationName.state || '' }
      : await getLocationByCoords(lat, lon);
    
    return formatWeatherData(data, location, lat, lon);
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError(
      error instanceof Error ? error.message : 'Erro desconhecido ao buscar clima'
    );
  }
}

/**
 * Busca localização por nome da cidade
 */
export async function searchCities(query: string): Promise<LocationResult[]> {
  if (query.length < SEARCH_CONFIG.MIN_LENGTH) return [];

  const params = new URLSearchParams({
    name: query,
    count: SEARCH_CONFIG.MAX_RESULTS.toString(),
    language: 'pt',
    format: 'json'
  });

  try {
    const response = await fetch(`${API_CONFIG.GEOCODING}/search?${params}`);
    
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

  // Usar o horário da API (já está no timezone da cidade pesquisada)
  // current.time vem como "2026-01-31T12:45" no timezone local da cidade
  const currentTimeFromApi = current.time || '';
  const currentHourLocal = extractHour(currentTimeFromApi);
  
  // Extrair a data do current.time para encontrar o índice correto
  const currentDateFromApi = currentTimeFromApi.split('T')[0]; // "2026-01-31"
  
  // Encontrar o índice correto na array hourly baseado no horário atual da cidade
  let currentHourIndex = 0;
  if (hourly.time && hourly.time.length > 0) {
    // Procurar o horário exato ou o mais próximo
    for (let i = 0; i < hourly.time.length; i++) {
      const hourTime = hourly.time[i];
      if (hourTime && hourTime.startsWith(currentDateFromApi)) {
        const hourValue = extractHour(hourTime);
        if (hourValue === currentHourLocal) {
          currentHourIndex = i;
          break;
        }
        // Guardar o primeiro índice do dia atual como fallback
        if (hourValue === 0 && currentHourIndex === 0) {
          currentHourIndex = i;
        }
      }
    }
    
    // Se encontrou o dia mas não a hora exata, ajustar o índice
    if (currentHourIndex > 0 || currentHourLocal === 0) {
      currentHourIndex = currentHourIndex + currentHourLocal;
    }
  }
  
  const currentHour = currentHourIndex;
  
  // Pegar sunrise/sunset do primeiro dia para referência
  const todaySunrise = daily.sunrise?.[0] || '06:00';
  const todaySunset = daily.sunset?.[0] || '18:00';

  // Helper para extrair hora de um timestamp
  const getHourFromTime = (timeStr: string): number => {
    const date = new Date(timeStr);
    return date.getHours();
  };

  // Previsão horária (próximas horas conforme config)
  const hourlyForecast = [];
  for (let i = 0; i < FORECAST_CONFIG.HOURS; i++) {
    const index = currentHour + i;
    if (index >= (hourly.time?.length || 0)) break;
    
    const hour = getHourFromTime(hourly.time[index]);
    const isNight = isNightHour(hour, todaySunrise, todaySunset);

    hourlyForecast.push({
      time: i === 0 ? 'Agora' : formatTime(hourly.time[index]),
      temp: Math.round(hourly.temperature_2m?.[index] || 0),
      rain: hourly.precipitation_probability?.[index] || 0,
      icon: mapWeatherCode(hourly.weather_code?.[index] || 0, isNight)
    });
  }

  // Previsão horária por dia (para o modal de detalhes)
  const hourlyByDay: Array<Array<{ time: string; temp: number; rain: number; icon: any }>> = [];
  const daysCount = (daily.time || []).length;
  
  for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
    const dayHourly = [];
    const startHour = dayIndex === 0 ? currentHour : 0; // Hoje começa da hora atual
    const hoursToShow = dayIndex === 0 ? 24 - currentHour : 24; // Quantas horas mostrar
    
    // Usar sunrise/sunset do dia específico
    const daySunrise = daily.sunrise?.[dayIndex] || todaySunrise;
    const daySunset = daily.sunset?.[dayIndex] || todaySunset;
    
    for (let h = 0; h < hoursToShow; h++) {
      const hourIndex = (dayIndex * 24) + startHour + h;
      if (hourIndex >= (hourly.time?.length || 0)) break;
      
      const hour = getHourFromTime(hourly.time[hourIndex]);
      const isNight = isNightHour(hour, daySunrise, daySunset);
      
      dayHourly.push({
        time: formatTime(hourly.time[hourIndex]),
        temp: Math.round(hourly.temperature_2m?.[hourIndex] || 0),
        rain: hourly.precipitation_probability?.[hourIndex] || 0,
        icon: mapWeatherCode(hourly.weather_code?.[hourIndex] || 0, isNight)
      });
    }
    
    // Mostrar conforme FORECAST_CONFIG.HOURS
    hourlyByDay.push(dayHourly.slice(0, FORECAST_CONFIG.HOURS));
  }

  // Previsão de chuva por hora
  const rainHourly = [];
  for (let i = 0; i < FORECAST_CONFIG.HOURS; i++) {
    const index = currentHour + i;
    if (index >= (hourly.time?.length || 0)) break;

    rainHourly.push({
      time: i === 0 ? 'Agora' : formatTime(hourly.time[index]),
      amount: hourly.precipitation?.[index] || 0,
      chance: hourly.precipitation_probability?.[index] || 0
    });
  }

  // Chuva hora a hora por dia (para o modal de detalhes)
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
    
    rainHourlyByDay.push(dayRainHourly.slice(0, FORECAST_CONFIG.HOURS));
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

  // Verificar se agora é noite usando a função com precisão de minutos
  // Usa o horário completo da API para maior precisão
  const currentIsNight = isNightTime(currentTimeFromApi, todaySunrise, todaySunset);

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
      icon: mapWeatherCode(current.weather_code || 0, currentIsNight),
      isNight: currentIsNight // Flag independente do ícone
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
    updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
}

// Helpers

/**
 * Extrai a hora de uma string de tempo (ISO ou HH:MM)
 */
function extractHour(timeStr: string): number {
  if (!timeStr) return 0;
  
  // Se contém 'T', é formato ISO (2026-01-31T06:30)
  if (timeStr.includes('T')) {
    const timePart = timeStr.split('T')[1];
    return parseInt(timePart.split(':')[0], 10);
  }
  
  // Senão é formato HH:MM
  return parseInt(timeStr.split(':')[0], 10);
}

/**
 * Converte uma string de tempo para minutos desde meia-noite
 */
function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  
  // Se contém 'T', é formato ISO (2026-01-31T06:30)
  const timePart = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr;
  const [hours, minutes] = timePart.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Verifica se uma hora específica é noite
 * CORRIGIDO: Agora usa minutos para precisão maior
 * Considera noite: antes do nascer do sol ou depois do pôr do sol
 */
function isNightHour(hour: number, sunrise?: string, sunset?: string): boolean {
  // Se não temos dados precisos, usar aproximação por hora
  const sunriseMinutes = sunrise ? timeToMinutes(sunrise) : 6 * 60; // 06:00
  const sunsetMinutes = sunset ? timeToMinutes(sunset) : 18 * 60;   // 18:00
  
  // Converter hora atual para minutos (assumindo :00 se só temos a hora)
  const currentMinutes = hour * 60;
  
  // Noite é antes do nascer ou depois do pôr do sol
  return currentMinutes < sunriseMinutes || currentMinutes >= sunsetMinutes;
}

/**
 * Verifica se é noite usando tempo completo (com minutos)
 * Usada quando temos o horário completo disponível
 */
function isNightTime(currentTime: string, sunrise: string, sunset: string): boolean {
  const currentMinutes = timeToMinutes(currentTime);
  const sunriseMinutes = timeToMinutes(sunrise);
  const sunsetMinutes = timeToMinutes(sunset);
  
  return currentMinutes < sunriseMinutes || currentMinutes >= sunsetMinutes;
}

/**
 * Mapeia código de clima para ícone, considerando dia/noite
 */
function mapWeatherCode(code: number, isNight: boolean = false): WeatherIconType {
  // Para céu limpo ou predominantemente limpo, diferenciar dia/noite
  if (code === 0 || code === 1) {
    return isNight ? 'clearNight' : 'sunny';
  }
  if (code === 2) return isNight ? 'partlyCloudyNight' : 'partlyCloudy';
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
    localStorage.setItem(CACHE_CONFIG.KEYS.WEATHER, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore storage errors
  }
}

export function loadFromCache(): WeatherData | null {
  try {
    const cached = localStorage.getItem(CACHE_CONFIG.KEYS.WEATHER);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Cache válido conforme configuração
    if (Date.now() - timestamp > CACHE_CONFIG.DURATION_MS) {
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
    localStorage.setItem(CACHE_CONFIG.KEYS.COORDS, JSON.stringify({ 
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
    const cached = localStorage.getItem(CACHE_CONFIG.KEYS.COORDS);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}
