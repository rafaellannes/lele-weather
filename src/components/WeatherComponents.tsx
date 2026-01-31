import React from 'react';
import { WeatherIconType, WeatherCurrent, RainForecast, SunTimes, HourlyForecast, DailyForecast, RainHourly } from '../types/weather';

// Weather Icons
const WeatherIcons: Record<WeatherIconType, React.ReactNode> = {
  sunny: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="5" fill="#FFD93D"/>
      <g stroke="#FFD93D" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </g>
    </svg>
  ),
  cloudy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19.5 16.5a4.5 4.5 0 00-4.5-4.5 4.48 4.48 0 00-3.17 1.31A5 5 0 004 15a5 5 0 005 5h9.5a4.5 4.5 0 001-8.5z" fill="#94A3B8"/>
    </svg>
  ),
  rainy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 19.5h11a4 4 0 001-7.5z" fill="#64748B"/>
      <path d="M8 19v3M12 19v3M16 19v3" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  thunderstorm: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 18h11a4 4 0 001-7z" fill="#475569"/>
      <path d="M13 12l-3 5h4l-3 5" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  partlyCloudy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="8" cy="8" r="4" fill="#FFD93D"/>
      <path d="M20 15a4 4 0 00-4-4 4 4 0 00-2.5.88A3.5 3.5 0 007.5 14 3.5 3.5 0 008 21h10.5a4 4 0 001.5-6z" fill="#94A3B8"/>
    </svg>
  ),
  drizzle: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 19.5h11a4 4 0 001-7.5z" fill="#78909C"/>
      <circle cx="9" cy="20" r="1" fill="#60A5FA"/><circle cx="13" cy="21" r="1" fill="#60A5FA"/><circle cx="17" cy="19" r="1" fill="#60A5FA"/>
    </svg>
  ),
  snowy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 19.5h11a4 4 0 001-7.5z" fill="#94A3B8"/>
      <circle cx="8" cy="20" r="1.5" fill="#E2E8F0"/><circle cx="12" cy="21" r="1.5" fill="#E2E8F0"/><circle cx="16" cy="19" r="1.5" fill="#E2E8F0"/>
    </svg>
  ),
  foggy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M3 12h18M3 16h18M3 20h12" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 8a3 3 0 00-3-3 3 3 0 00-2.4 1.2A3 3 0 006 8a3 3 0 003 3h6a3 3 0 001-5z" fill="#CBD5E1"/>
    </svg>
  )
};

export const WeatherIcon: React.FC<{ type: WeatherIconType; className?: string }> = ({ type, className = 'w-full h-full' }) => (
  <div className={className}>{WeatherIcons[type] || WeatherIcons.cloudy}</div>
);

// Header
export const Header: React.FC<{ address: string; onSearch?: () => void }> = ({ address, onSearch }) => (
  <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-slate-900/80 backdrop-blur-lg z-10">
    <button 
      type="button"
      onClick={onSearch} 
      className="flex items-center gap-3 flex-1 min-w-0 hover:bg-white/5 rounded-full px-3 py-2 -ml-3 transition-colors cursor-pointer"
    >
      <svg className="w-5 h-5 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="text-white/90 text-sm truncate">{address}</span>
    </button>
    {/* Avatar da Lele */}
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-0.5 shadow-lg shadow-pink-500/20">
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fundo circular */}
        <circle cx="50" cy="50" r="50" fill="#1e293b"/>
        {/* Cabelo cacheado */}
        <ellipse cx="50" cy="42" rx="32" ry="28" fill="#3D2314"/>
        <ellipse cx="22" cy="45" rx="10" ry="14" fill="#3D2314"/>
        <ellipse cx="78" cy="45" rx="10" ry="14" fill="#3D2314"/>
        <ellipse cx="25" cy="58" rx="8" ry="10" fill="#5D3A24"/>
        <ellipse cx="75" cy="58" rx="8" ry="10" fill="#5D3A24"/>
        <ellipse cx="35" cy="28" rx="8" ry="7" fill="#3D2314"/>
        <ellipse cx="65" cy="28" rx="8" ry="7" fill="#3D2314"/>
        {/* Rosto */}
        <ellipse cx="50" cy="52" rx="22" ry="23" fill="#D4A574"/>
        {/* Bochechas */}
        <ellipse cx="36" cy="58" rx="5" ry="3" fill="#E8A0A0" opacity="0.6"/>
        <ellipse cx="64" cy="58" rx="5" ry="3" fill="#E8A0A0" opacity="0.6"/>
        {/* Olhos felizes */}
        <ellipse cx="40" cy="50" rx="4" ry="5" fill="white"/>
        <ellipse cx="60" cy="50" rx="4" ry="5" fill="white"/>
        <circle cx="41" cy="51" r="2.5" fill="#2D1810"/>
        <circle cx="61" cy="51" r="2.5" fill="#2D1810"/>
        <circle cx="40" cy="49" r="1" fill="white"/>
        <circle cx="60" cy="49" r="1" fill="white"/>
        {/* Sorriso */}
        <path d="M 42 62 Q 50 70 58 62" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Vestido (topo) */}
        <path d="M 35 73 Q 50 78 65 73 L 70 100 L 30 100 Z" fill="#FF6B9D"/>
      </svg>
    </div>
  </div>
);

// Current Weather
export const CurrentWeather: React.FC<{ data: WeatherCurrent }> = ({ data }) => (
  <div className="px-4 py-6">
    <span className="text-white/60 text-sm">Agora</span>
    <div className="flex items-start justify-between mt-1">
      <div className="flex items-start">
        <span className="text-8xl font-light text-white tracking-tight">{data.temp}</span>
        <span className="text-3xl text-white/70 mt-2">°</span>
        <div className="w-10 h-10 ml-2 mt-4">
          <WeatherIcon type={data.icon} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-white text-lg">{data.condition}</p>
        <p className="text-white/60 text-sm">Sensação térmica: {data.feelsLike}°</p>
      </div>
    </div>
    <p className="text-white/60 text-sm mt-2">Máxima: {data.high}° • Mínima: {data.low}°</p>
  </div>
);

// Rain Forecast Card
export const RainForecastCard: React.FC<{ forecast: RainForecast }> = ({ forecast }) => (
  <div className="mx-4 mb-4">
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
      <h3 className="text-white font-medium mb-1">Previsão de chuva: {forecast.duration}</h3>
      <p className="text-white/60 text-sm mb-4">{forecast.description}</p>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
        </svg>
        <span className="text-white/80">Volume: {forecast.volume} mm</span>
      </div>
    </div>
  </div>
);

// Hourly Forecast
export const HourlyForecastCard: React.FC<{ hours: HourlyForecast[] }> = ({ hours }) => (
  <div className="px-4 mb-4">
    <h3 className="text-white/80 text-lg mb-3">Previsão hora a hora</h3>
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {hours.map((hour, i) => (
          <div key={i} className="flex flex-col items-center min-w-[60px]">
            <span className="text-white text-lg font-light">{hour.temp}°</span>
            <span className="text-blue-400 text-sm">{hour.rain}%</span>
            <div className="w-8 h-8 my-2"><WeatherIcon type={hour.icon} /></div>
            <span className="text-white/60 text-xs">{hour.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Daily Forecast
export const DailyForecastCard: React.FC<{ days: DailyForecast[] }> = ({ days }) => (
  <div className="px-4 mb-4">
    <h3 className="text-white/80 text-lg mb-3">Próximos {days.length} dias</h3>
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl overflow-hidden border border-white/5">
      {days.map((day, i) => (
        <div key={i} className={`flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${i !== days.length - 1 ? 'border-b border-white/5' : ''}`}>
          <div className="flex-1">
            <span className="text-white">{day.day === "Hoje" ? "Hoje" : `${day.day}, ${day.dateFormatted}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-sm">{day.rain}%</span>
            <div className="w-6 h-6"><WeatherIcon type={day.icon} /></div>
          </div>
          <div className="w-24 text-right">
            <span className="text-white">{day.high}°</span>
            <span className="text-white/50">/{day.low}°</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Current Conditions
export const CurrentConditions: React.FC<{ data: WeatherCurrent }> = ({ data }) => (
  <div className="px-4 mb-4">
    <h3 className="text-white/80 text-lg mb-3">Condições atuais</h3>
    <div className="grid grid-cols-2 gap-3">
      {/* Wind */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
        <span className="text-white/60 text-sm">Vento</span>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-white text-3xl font-light">{data.wind}</span>
          <span className="text-white/60 text-sm mb-1">km/h</span>
        </div>
        <p className="text-white/50 text-sm mt-1">Do {data.windDirection.toLowerCase()}</p>
      </div>
      {/* Humidity */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
        <span className="text-white/60 text-sm">Umidade</span>
        <div className="flex items-end gap-1 mt-2">
          <span className="text-white text-3xl font-light">{data.humidity}</span>
          <span className="text-white/60 text-lg mb-0.5">%</span>
        </div>
        <p className="text-white/50 text-sm mt-1">Ponto de orvalho {data.dewPoint}°</p>
      </div>
      {/* UV Index */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
        <span className="text-white/60 text-sm">Índice UV</span>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-white text-3xl font-light">{data.uvIndex}</span>
        </div>
        <p className="text-white/50 text-sm mt-1">{data.uvIndex <= 2 ? 'Baixo' : data.uvIndex <= 5 ? 'Moderado' : 'Alto'}</p>
      </div>
      {/* Pressure */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
        <span className="text-white/60 text-sm">Pressão</span>
        <div className="flex items-end gap-1 mt-2">
          <span className="text-white text-3xl font-light">{data.pressure}</span>
        </div>
        <p className="text-white/50 text-sm mt-1">mBar</p>
      </div>
    </div>
  </div>
);

// Sun Times
export const SunTimesCard: React.FC<{ sun: SunTimes }> = ({ sun }) => (
  <div className="px-4 mb-4">
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
      <h3 className="text-white font-medium mb-4">Nascer e pôr do sol</h3>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/60 text-sm">Nascer do sol</p>
          <p className="text-white text-3xl font-light">{sun.sunrise}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm">Pôr do sol</p>
          <p className="text-white text-3xl font-light">{sun.sunset}</p>
        </div>
      </div>
      <div className="relative h-16 mb-2">
        <svg viewBox="0 0 200 50" className="w-full h-full">
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a5f" /><stop offset="50%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#1e3a5f" />
            </linearGradient>
          </defs>
          <path d="M 10 45 Q 100 -15 190 45" fill="none" stroke="url(#arcGrad)" strokeWidth="3" strokeLinecap="round"/>
          <line x1="10" y1="45" x2="190" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
          <circle cx="130" cy="18" r="8" fill="#FFD93D"/>
        </svg>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/40">Amanhecer {sun.dawn}</span>
        <span className="text-white/40">Anoitecer {sun.dusk}</span>
      </div>
    </div>
  </div>
);

// Rain Details
export const RainDetails: React.FC<{ rainHourly: RainHourly[]; volume: number }> = ({ rainHourly, volume }) => (
  <div className="px-4 mb-4">
    <h3 className="text-white/80 text-lg mb-3">Chuva por hora</h3>
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
      <div className="mb-4">
        <p className="text-white/60 text-sm">Volume total hoje</p>
        <p className="text-white text-4xl font-light">{volume} mm</p>
      </div>
      <div className="flex items-end gap-2 h-20">
        {rainHourly.map((hour, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group">
            <div className="w-full bg-blue-400/60 rounded-t transition-all group-hover:bg-blue-400" style={{ height: `${Math.max(hour.amount * 15, 4)}px` }}/>
            <span className="text-white/50 text-xs mt-2">{hour.chance}%</span>
            <span className="text-white/40 text-[10px]">{hour.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading Skeleton
export const WeatherSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="px-4 py-6"><div className="h-4 w-16 bg-slate-700 rounded mb-2"/><div className="h-24 w-32 bg-slate-700 rounded"/></div>
    <div className="mx-4 mb-4"><div className="h-24 bg-slate-700 rounded-2xl"/></div>
    <div className="mx-4 mb-4"><div className="h-32 bg-slate-700 rounded-2xl"/></div>
  </div>
);

// Install Prompt
export const InstallPrompt: React.FC<{ onInstall: () => void; onDismiss: () => void }> = ({ onInstall, onDismiss }) => (
  <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 z-40 animate-slide-up">
    <div className="max-w-md mx-auto flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-0.5 shadow-lg">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Fundo */}
          <rect width="100" height="100" rx="16" fill="#1e293b"/>
          {/* Cabelo cacheado */}
          <ellipse cx="50" cy="42" rx="32" ry="28" fill="#3D2314"/>
          <ellipse cx="22" cy="45" rx="10" ry="14" fill="#3D2314"/>
          <ellipse cx="78" cy="45" rx="10" ry="14" fill="#3D2314"/>
          <ellipse cx="25" cy="58" rx="8" ry="10" fill="#5D3A24"/>
          <ellipse cx="75" cy="58" rx="8" ry="10" fill="#5D3A24"/>
          <ellipse cx="35" cy="28" rx="8" ry="7" fill="#3D2314"/>
          <ellipse cx="65" cy="28" rx="8" ry="7" fill="#3D2314"/>
          {/* Rosto */}
          <ellipse cx="50" cy="52" rx="22" ry="23" fill="#D4A574"/>
          {/* Bochechas */}
          <ellipse cx="36" cy="58" rx="5" ry="3" fill="#E8A0A0" opacity="0.6"/>
          <ellipse cx="64" cy="58" rx="5" ry="3" fill="#E8A0A0" opacity="0.6"/>
          {/* Olhos */}
          <ellipse cx="40" cy="50" rx="4" ry="5" fill="white"/>
          <ellipse cx="60" cy="50" rx="4" ry="5" fill="white"/>
          <circle cx="41" cy="51" r="2.5" fill="#2D1810"/>
          <circle cx="61" cy="51" r="2.5" fill="#2D1810"/>
          <circle cx="40" cy="49" r="1" fill="white"/>
          <circle cx="60" cy="49" r="1" fill="white"/>
          {/* Sorriso */}
          <path d="M 42 62 Q 50 70 58 62" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Vestido */}
          <path d="M 35 73 Q 50 78 65 73 L 70 100 L 30 100 Z" fill="#FF6B9D"/>
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">Instalar LeleWeather</p>
        <p className="text-white/60 text-sm">Adicione à tela inicial</p>
      </div>
      <button onClick={onDismiss} className="text-white/50 hover:text-white/80 p-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <button onClick={onInstall} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all">
        Instalar
      </button>
    </div>
  </div>
);
