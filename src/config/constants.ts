/**
 * Configurações centralizadas do LeleWeather
 */

// URLs das APIs
export const API_CONFIG = {
  OPEN_METEO: 'https://api.open-meteo.com/v1/forecast',
  ECMWF: 'https://api.open-meteo.com/v1/ecmwf',
  GEOCODING: 'https://geocoding-api.open-meteo.com/v1',
} as const;

// Configurações de previsão
export const FORECAST_CONFIG = {
  DAYS: 10,
  HOURS: 12,
  HOURS_PER_DAY: 24,
} as const;

// Configurações de busca
export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 300,
  MIN_LENGTH: 2,
  MAX_RESULTS: 5,
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  KEYS: {
    WEATHER: 'leleweather_cache',
    COORDS: 'leleweather_coords',
  },
  DURATION_MS: 30 * 60 * 1000, // 30 minutos
} as const;

// Configurações de geolocalização
export const GEOLOCATION_CONFIG = {
  OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutos
  } as PositionOptions,
  FALLBACK: {
    LAT: -22.7556,
    LON: -43.4603,
    NAME: 'Nova Iguaçu',
  },
} as const;

// Configurações de atualização
export const UPDATE_CONFIG = {
  AUTO_REFRESH_MS: 10 * 60 * 1000, // 10 minutos
} as const;

// Detecta timezone automaticamente
export function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/Sao_Paulo'; // Fallback para Brasil
  }
}

// Erros customizados para melhor tratamento
export class WeatherApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly apiType?: 'current' | 'forecast' | 'geocoding'
  ) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

export class GeolocationError extends Error {
  constructor(
    message: string,
    public readonly code?: number
  ) {
    super(message);
    this.name = 'GeolocationError';
  }
}
