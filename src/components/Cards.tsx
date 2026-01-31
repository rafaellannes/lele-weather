/**
 * Componentes de Card para exibição de previsão
 */
import React from 'react';
import { HourlyForecast, DailyForecast } from '../types/weather';
import { WeatherIcon } from './Icons';

interface HourlyForecastCardProps {
  hour: HourlyForecast;
}

export const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({ hour }) => (
  <div 
    className="flex flex-col items-center min-w-[60px] px-2 py-3 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-colors"
    role="listitem"
    aria-label={`${hour.time}: ${hour.temp}°C`}
  >
    <span className="text-xs opacity-70 mb-1">{hour.time}</span>
    <WeatherIcon type={hour.icon} className="w-8 h-8 my-1" />
    <span className="text-sm font-semibold">{hour.temp}°</span>
    {hour.rain > 0 && (
      <span className="text-xs text-blue-400 mt-1" aria-label={`${hour.rain}% chance de chuva`}>
        💧 {hour.rain}%
      </span>
    )}
  </div>
);

interface DailyForecastCardProps {
  day: DailyForecast;
  onClick?: () => void;
  isSelected?: boolean;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ 
  day, 
  onClick,
  isSelected = false 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div 
      className={`flex items-center justify-between py-3 border-b border-white/10 last:border-0 
        ${onClick ? 'cursor-pointer hover:bg-white/5 rounded-lg px-2 -mx-2 transition-all active:scale-[0.98]' : ''}
        ${isSelected ? 'bg-white/10 ring-1 ring-white/20' : ''}
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Ver detalhes de ${day.day}` : undefined}
      aria-pressed={onClick ? isSelected : undefined}
    >
      <div className="flex items-center gap-3 flex-1">
        <WeatherIcon type={day.icon} className="w-10 h-10" />
        <div>
          <p className="font-medium">{day.day}</p>
          <p className="text-xs opacity-60">{day.dateFormatted}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {day.rain > 0 && (
          <span className="text-xs text-blue-400" aria-label={`${day.rain}% chance de chuva`}>
            💧 {day.rain}%
          </span>
        )}
        <div className="text-right min-w-[70px]">
          <span className="font-semibold">{day.high}°</span>
          <span className="opacity-60 ml-2">{day.low}°</span>
        </div>
      </div>
    </div>
  );
};

// Skeleton loading states
export const SkeletonCurrent: React.FC = () => (
  <div className="animate-pulse" role="status" aria-label="Carregando clima atual">
    <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
    <div className="flex items-center gap-4 mb-6">
      <div className="w-24 h-24 bg-white/20 rounded-full"></div>
      <div>
        <div className="h-16 bg-white/20 rounded w-24 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export const SkeletonHourly: React.FC = () => (
  <div className="animate-pulse" role="status" aria-label="Carregando previsão horária">
    <div className="h-5 bg-white/20 rounded w-40 mb-3"></div>
    <div className="flex gap-3 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="min-w-[60px] px-2 py-3 bg-white/10 rounded-lg">
          <div className="h-3 bg-white/20 rounded w-8 mx-auto mb-2"></div>
          <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-6 mx-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDaily: React.FC = () => (
  <div className="animate-pulse" role="status" aria-label="Carregando previsão diária">
    <div className="h-5 bg-white/20 rounded w-40 mb-3"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          <div>
            <div className="h-4 bg-white/20 rounded w-20 mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-24"></div>
          </div>
        </div>
        <div className="h-4 bg-white/20 rounded w-16"></div>
      </div>
    ))}
  </div>
);

// Card de informações atuais
interface WeatherDetailProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export const WeatherDetail: React.FC<WeatherDetailProps> = ({ label, value, icon }) => (
  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
    {icon && <span className="text-lg" aria-hidden="true">{icon}</span>}
    <div>
      <span className="text-xs opacity-60 block">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  </div>
);
