/**
 * Background dinâmico baseado no clima
 * Mantém a identidade escura com elementos visuais sutis
 */
import React, { useMemo } from 'react';
import { WeatherIconType } from '../types/weather';

interface WeatherBackgroundProps {
  weatherIcon: WeatherIconType;
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

// Componente de raios de sol
const SunRays: React.FC = () => {
  return (
    <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none opacity-30">
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-radial from-amber-400/30 via-amber-400/10 to-transparent rounded-full animate-pulse-slow" />
    </div>
  );
};

// Componente de lua
const MoonGlow: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 w-20 h-20 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-radial from-slate-300/20 via-slate-400/5 to-transparent rounded-full" />
      <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-slate-200/30 to-slate-400/10 rounded-full" />
    </div>
  );
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherIcon, children }) => {
  const gradient = gradientConfig[weatherIcon] || gradientConfig.cloudy;
  
  const isNight = weatherIcon === 'clearNight' || weatherIcon === 'partlyCloudyNight';
  const isRainy = weatherIcon === 'rainy' || weatherIcon === 'drizzle';
  const isThunderstorm = weatherIcon === 'thunderstorm';
  const isSnowy = weatherIcon === 'snowy';
  const isCloudy = weatherIcon === 'cloudy' || weatherIcon === 'partlyCloudy' || weatherIcon === 'partlyCloudyNight';
  const isSunny = weatherIcon === 'sunny';
  const isClearNight = weatherIcon === 'clearNight';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradient} transition-all duration-1000 relative`}>
      {/* Partículas e efeitos */}
      {isNight && <Stars />}
      {isClearNight && <MoonGlow />}
      {isSunny && <SunRays />}
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
