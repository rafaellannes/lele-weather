/**
 * Ícones de clima SVG
 */
import React from 'react';
import { WeatherIconType } from '../types/weather';

// Weather Icons
const WeatherIcons: Record<WeatherIconType, React.ReactNode> = {
  sunny: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="#FFD93D"/>
      <g stroke="#FFD93D" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </g>
    </svg>
  ),
  clearNight: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#E2E8F0"/>
    </svg>
  ),
  cloudy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M19.5 16.5a4.5 4.5 0 00-4.5-4.5 4.48 4.48 0 00-3.17 1.31A5 5 0 004 15a5 5 0 005 5h9.5a4.5 4.5 0 001-8.5z" fill="#94A3B8"/>
    </svg>
  ),
  rainy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 19.5h11a4 4 0 001-7.5z" fill="#64748B"/>
      <path d="M8 19v3M12 19v3M16 19v3" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  thunderstorm: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 18h11a4 4 0 001-7z" fill="#475569"/>
      <path d="M13 12l-3 5h4l-3 5" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  partlyCloudy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <circle cx="8" cy="8" r="4" fill="#FFD93D"/>
      <path d="M20 15a4 4 0 00-4-4 4 4 0 00-2.5.88A3.5 3.5 0 007.5 14 3.5 3.5 0 008 21h10.5a4 4 0 001.5-6z" fill="#94A3B8"/>
    </svg>
  ),
  partlyCloudyNight: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M12 3a5 5 0 00-1.09 9.88A4 4 0 008 9a4 4 0 00.68 2.23A3.5 3.5 0 007.5 14 3.5 3.5 0 008 21h10.5a4 4 0 001.5-6 4 4 0 00-4-4 4 4 0 00-2.07.58A5 5 0 0012 3z" fill="#94A3B8"/>
      <path d="M14 6.5A4.5 4.5 0 119.5 2 3.5 3.5 0 0014 6.5z" fill="#E2E8F0"/>
    </svg>
  ),
  drizzle: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 19.5h11a4 4 0 001-7.5z" fill="#78909C"/>
      <circle cx="9" cy="20" r="1" fill="#60A5FA"/><circle cx="13" cy="21" r="1" fill="#60A5FA"/><circle cx="17" cy="19" r="1" fill="#60A5FA"/>
    </svg>
  ),
  snowy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M18 10a4 4 0 00-4-4 4 4 0 00-3.17 1.55A4.5 4.5 0 004.5 11 4.5 4.5 0 006 19.5h11a4 4 0 001-7.5z" fill="#94A3B8"/>
      <circle cx="8" cy="20" r="1.5" fill="#E2E8F0"/><circle cx="12" cy="21" r="1.5" fill="#E2E8F0"/><circle cx="16" cy="19" r="1.5" fill="#E2E8F0"/>
    </svg>
  ),
  foggy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
      <path d="M3 12h18M3 16h18M3 20h12" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 8a3 3 0 00-3-3 3 3 0 00-2.4 1.2A3 3 0 006 8a3 3 0 003 3h6a3 3 0 001-5z" fill="#CBD5E1"/>
    </svg>
  )
};

interface WeatherIconProps {
  type: WeatherIconType;
  className?: string;
  label?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  type, 
  className = 'w-full h-full',
  label 
}) => (
  <div 
    className={className} 
    role="img" 
    aria-label={label || getIconLabel(type)}
  >
    {WeatherIcons[type] || WeatherIcons.cloudy}
  </div>
);

// Labels acessíveis para os ícones
function getIconLabel(type: WeatherIconType): string {
  const labels: Record<WeatherIconType, string> = {
    sunny: 'Ensolarado',
    clearNight: 'Noite limpa',
    partlyCloudy: 'Parcialmente nublado',
    partlyCloudyNight: 'Parcialmente nublado à noite',
    cloudy: 'Nublado',
    rainy: 'Chuva',
    drizzle: 'Garoa',
    thunderstorm: 'Tempestade',
    snowy: 'Neve',
    foggy: 'Neblina'
  };
  return labels[type] || 'Tempo variável';
}

// Avatar da Lele para o header
export const LeleAvatar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-0.5 shadow-lg shadow-pink-500/20 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#1e293b"/>
      <ellipse cx="50" cy="42" rx="32" ry="28" fill="#3D2314"/>
      <ellipse cx="22" cy="45" rx="10" ry="14" fill="#3D2314"/>
      <ellipse cx="78" cy="45" rx="10" ry="14" fill="#3D2314"/>
      <ellipse cx="25" cy="58" rx="8" ry="10" fill="#5D3A24"/>
      <ellipse cx="75" cy="58" rx="8" ry="10" fill="#5D3A24"/>
      <ellipse cx="35" cy="28" rx="8" ry="7" fill="#3D2314"/>
      <ellipse cx="65" cy="28" rx="8" ry="7" fill="#3D2314"/>
      <ellipse cx="50" cy="52" rx="22" ry="23" fill="#D4A574"/>
      <ellipse cx="36" cy="58" rx="5" ry="3" fill="#E8A0A0" opacity="0.6"/>
      <ellipse cx="64" cy="58" rx="5" ry="3" fill="#E8A0A0" opacity="0.6"/>
      <ellipse cx="40" cy="50" rx="4" ry="5" fill="white"/>
      <ellipse cx="60" cy="50" rx="4" ry="5" fill="white"/>
      <circle cx="41" cy="51" r="2.5" fill="#2D1810"/>
      <circle cx="61" cy="51" r="2.5" fill="#2D1810"/>
      <circle cx="40" cy="49" r="1" fill="white"/>
      <circle cx="60" cy="49" r="1" fill="white"/>
      <path d="M 42 62 Q 50 70 58 62" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 35 73 Q 50 78 65 73 L 70 100 L 30 100 Z" fill="#FF6B9D"/>
    </svg>
  </div>
);
