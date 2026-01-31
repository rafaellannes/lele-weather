/**
 * Background dinâmico baseado no clima
 * Mantém a identidade escura com elementos visuais sutis
 */
import React, { useMemo } from 'react';
import { WeatherIconType } from '../types/weather';

interface WeatherBackgroundProps {
  weatherIcon: WeatherIconType;
  isNight?: boolean; // Flag independente para determinar dia/noite
  children: React.ReactNode;
}

// Configuração de gradientes por tipo de clima
const gradientConfig: Record<WeatherIconType, string> = {
  sunny: 'from-amber-900/20 via-slate-900 to-slate-900',
  clearNight: 'from-indigo-950/40 via-slate-900 to-slate-900',
  partlyCloudy: 'from-slate-800/50 via-slate-900 to-slate-900',
  partlyCloudyNight: 'from-indigo-950/30 via-slate-900 to-slate-900',
  cloudy: 'from-slate-700/30 via-slate-900 to-slate-900',
  rainy: 'from-blue-950/40 via-slate-900 to-slate-900',
  drizzle: 'from-blue-900/30 via-slate-900 to-slate-900',
  thunderstorm: 'from-purple-950/40 via-slate-900 to-slate-900',
  snowy: 'from-blue-200/10 via-slate-900 to-slate-900',
  foggy: 'from-gray-600/20 via-slate-900 to-slate-900',
};

// Componente de estrelas para noite
const Stars: React.FC = () => {
  const stars = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Componente de gotas de chuva
const RainDrops: React.FC<{ intensity?: 'light' | 'heavy' }> = ({ intensity = 'light' }) => {
  const drops = useMemo(() => 
    Array.from({ length: intensity === 'heavy' ? 100 : 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.2,
    })), [intensity]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-0.5 h-4 bg-gradient-to-b from-transparent to-blue-400/50 animate-rain"
          style={{
            left: drop.left,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
};

// Componente de flocos de neve
const SnowFlakes: React.FC = () => {
  const flakes = useMemo(() => 
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4,
      drift: Math.random() * 20 - 10,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/70 animate-snow"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            '--drift': `${flake.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

// Componente de nuvens flutuantes
const FloatingClouds: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const clouds = useMemo(() => [
    { id: 1, top: '5%', size: 'w-32 h-12', duration: 60, delay: 0 },
    { id: 2, top: '15%', size: 'w-24 h-8', duration: 45, delay: 10 },
    { id: 3, top: '10%', size: 'w-40 h-14', duration: 70, delay: 25 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`absolute ${cloud.size} animate-cloud-float ${dark ? 'opacity-10' : 'opacity-20'}`}
          style={{
            top: cloud.top,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <svg viewBox="0 0 100 40" className="w-full h-full fill-white/50">
            <ellipse cx="30" cy="25" rx="25" ry="15" />
            <ellipse cx="55" cy="20" rx="20" ry="12" />
            <ellipse cx="75" cy="25" rx="18" ry="13" />
            <ellipse cx="50" cy="28" rx="30" ry="12" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Componente de relâmpagos
const Lightning: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none animate-lightning">
      <div className="absolute inset-0 bg-white/5" />
    </div>
  );
};

// Componente de raios de sol animados
const SunRays: React.FC = () => {
  return (
    <div className="absolute top-16 right-4 md:right-1/4 w-48 h-48 overflow-visible pointer-events-none">
      {/* Halo de luz grande */}
      <div className="absolute -inset-8">
        <div className="absolute inset-0 bg-gradient-radial from-amber-300/30 via-orange-300/10 to-transparent rounded-full animate-pulse-slow" />
      </div>
      
      {/* Raios girando */}
      <div className="absolute inset-0 animate-spin-slow">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1.5 h-20 bg-gradient-to-t from-amber-400/50 via-yellow-300/30 to-transparent origin-bottom rounded-full"
            style={{
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              opacity: i % 2 === 0 ? 0.5 : 0.25
            }}
          />
        ))}
      </div>
      
      {/* Sol central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
        <div className="absolute inset-0 bg-gradient-radial from-yellow-200 via-amber-300 to-orange-400 rounded-full shadow-lg shadow-amber-400/50 animate-pulse-slow" />
        <div className="absolute inset-2 bg-gradient-radial from-yellow-100 via-yellow-200 to-amber-300 rounded-full" />
      </div>
      
      {/* Brilhos flutuantes */}
      <div className="absolute -top-4 left-8 w-2 h-2 bg-yellow-200 rounded-full animate-float-1 opacity-60" />
      <div className="absolute top-8 -left-4 w-1.5 h-1.5 bg-amber-200 rounded-full animate-float-2 opacity-50" />
      <div className="absolute -bottom-4 right-8 w-1 h-1 bg-yellow-100 rounded-full animate-float-3 opacity-70" />
    </div>
  );
};

// Componente de lua com brilho
const MoonGlow: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 w-20 h-20 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-radial from-slate-300/20 via-slate-400/5 to-transparent rounded-full" />
      <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-slate-200/30 to-slate-400/10 rounded-full" />
    </div>
  );
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherIcon, isNight: isNightProp, children }) => {
  // Usa a prop isNight se fornecida, senão infere do ícone (fallback)
  const isNightFromIcon = weatherIcon === 'clearNight' || weatherIcon === 'partlyCloudyNight';
  const isNight = isNightProp !== undefined ? isNightProp : isNightFromIcon;
  
  // Ajusta o gradiente baseado na flag isNight
  let gradient = gradientConfig[weatherIcon] || gradientConfig.cloudy;
  
  // Se é noite mas o ícone não indica (ex: cloudy à noite), usar gradiente mais escuro
  if (isNight && !isNightFromIcon) {
    gradient = 'from-indigo-950/30 via-slate-900 to-slate-900';
  }
  
  const isRainy = weatherIcon === 'rainy' || weatherIcon === 'drizzle';
  const isThunderstorm = weatherIcon === 'thunderstorm';
  const isSnowy = weatherIcon === 'snowy';
  const isCloudy = weatherIcon === 'cloudy' || weatherIcon === 'partlyCloudy' || weatherIcon === 'partlyCloudyNight';
  const isSunny = weatherIcon === 'sunny';
  const isClearNight = weatherIcon === 'clearNight' || (isNight && weatherIcon === 'sunny');

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradient} transition-all duration-1000 relative`}>
      {/* Partículas e efeitos */}
      {isNight && <Stars />}
      {(isClearNight || (isNight && !isRainy && !isThunderstorm && !isSnowy)) && <MoonGlow />}
      {isSunny && !isNight && <SunRays />}
      {isRainy && <RainDrops intensity="light" />}
      {isThunderstorm && (
        <>
          <RainDrops intensity="heavy" />
          <Lightning />
        </>
      )}
      {isSnowy && <SnowFlakes />}
      {isCloudy && <FloatingClouds dark={isNight} />}
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default WeatherBackground;
