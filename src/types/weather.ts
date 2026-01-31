export type WeatherIconType = 
  | 'sunny'
  | 'clearNight'
  | 'cloudy'
  | 'rainy'
  | 'thunderstorm'
  | 'partlyCloudy'
  | 'partlyCloudyNight'
  | 'drizzle'
  | 'snowy'
  | 'foggy';

export interface WeatherCurrent {
  temp: number;
  condition: string;
  feelsLike: number;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  windDirection: string;
  pressure: number;
  uvIndex: number;
  dewPoint: number;
  icon: WeatherIconType;
  isNight: boolean; // Flag independente para determinar dia/noite
}

export interface RainForecast {
  duration: string;
  description: string;
  volume: number;
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
  dawn: string;
  dusk: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  rain: number;
  icon: WeatherIconType;
}

export interface RainHourly {
  time: string;
  amount: number;
  chance: number;
}

export interface DailyForecast {
  date: string;
  day: string;
  dateFormatted: string;
  high: number;
  low: number;
  rain: number;
  icon: WeatherIconType;
}

export interface WeatherData {
  location: string;
  address: string;
  coords: {
    lat: number;
    lon: number;
  };
  current: WeatherCurrent;
  rainForecast: RainForecast;
  sun: SunTimes;
  hourly: HourlyForecast[];
  hourlyByDay: HourlyForecast[][]; // Previsão horária por dia (para o modal de detalhes)
  rainHourly: RainHourly[];
  rainHourlyByDay: RainHourly[][]; // Chuva hora a hora por dia (para o modal de detalhes)
  daily: DailyForecast[];
  updatedAt: string;
}

export interface LocationResult {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}
