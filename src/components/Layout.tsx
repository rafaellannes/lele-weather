/**
 * Componentes de layout: Header e seções principais
 */
import React from 'react';
import { LeleAvatar } from './Icons';

interface HeaderProps {
  city: string;
  searchQuery: string;
  showSearch: boolean;
  searchResults: Array<{ display_name: string; name: string; state?: string; country: string }>;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onToggleSearch: () => void;
  onSelectCity: (city: { display_name: string; lat: string; lon: string; name: string; state?: string; country: string }) => void;
  onGetCurrentLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  city,
  searchQuery,
  showSearch,
  searchResults,
  isSearching,
  onSearchChange,
  onToggleSearch,
  onSelectCity,
  onGetCurrentLocation
}) => {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-lg px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo e nome */}
        <div className="flex items-center gap-2">
          <LeleAvatar className="w-10 h-10" />
          <div>
            <h1 className="font-bold text-lg leading-tight">LeleWeather</h1>
            <button 
              onClick={onToggleSearch}
              className="text-sm opacity-70 hover:opacity-100 flex items-center gap-1 transition-opacity focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
              aria-label={showSearch ? 'Fechar busca' : 'Abrir busca de cidade'}
              aria-expanded={showSearch}
            >
              📍 {city}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Botões */}
        <div className="flex gap-2">
          <button 
            onClick={onGetCurrentLocation} 
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Usar localização atual"
            title="Usar localização atual"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      {showSearch && (
        <div 
          className="mt-3 bg-slate-800/95 rounded-2xl border border-white/10 overflow-hidden shadow-xl"
          role="search"
        >
          <div className="flex items-center gap-2 p-3 border-b border-white/10">
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar cidade..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50"
              aria-label="Buscar cidade"
              aria-describedby={searchResults.length > 0 ? 'search-results-count' : undefined}
            />
            {isSearching && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Buscando..." />
            )}
          </div>
          
          {/* Resultados */}
          {searchResults.length > 0 && (
            <>
              <span id="search-results-count" className="sr-only">
                {searchResults.length} resultados encontrados
              </span>
              <ul 
                className="max-h-64 overflow-y-auto"
                role="listbox"
                aria-label="Resultados da busca"
              >
                {searchResults.map((result, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => onSelectCity(result as any)}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 focus:bg-white/10 focus:outline-none"
                      role="option"
                    >
                      <span className="text-xl" aria-hidden="true">📍</span>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-white/60">{result.state ? `${result.state}, ` : ''}{result.country}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </header>
  );
};

// Seção de clima atual
interface CurrentWeatherProps {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: React.ReactNode;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  temperature,
  feelsLike,
  description,
  humidity,
  windSpeed,
  icon
}) => (
  <section 
    className="text-center py-6"
    aria-labelledby="current-weather-heading"
  >
    <h2 id="current-weather-heading" className="sr-only">Clima atual</h2>
    <div className="w-32 h-32 mx-auto mb-4">{icon}</div>
    <p 
      className="text-7xl font-light mb-2"
      aria-label={`Temperatura: ${temperature} graus celsius`}
    >
      {temperature}°
    </p>
    <p className="text-xl text-white/80 mb-2">{description}</p>
    <p className="text-sm text-white/60">Sensação térmica: {feelsLike}°</p>
    
    <div className="flex justify-center gap-6 mt-6" role="list" aria-label="Detalhes do clima">
      <div role="listitem" className="flex items-center gap-2">
        <span aria-hidden="true">💧</span>
        <span>Umidade: {humidity}%</span>
      </div>
      <div role="listitem" className="flex items-center gap-2">
        <span aria-hidden="true">💨</span>
        <span>Vento: {windSpeed} km/h</span>
      </div>
    </div>
  </section>
);

// Seção de previsão horária
interface HourlyForecastSectionProps {
  children: React.ReactNode;
}

export const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({ children }) => (
  <section className="mb-6" aria-labelledby="hourly-forecast-heading">
    <h2 id="hourly-forecast-heading" className="text-lg font-semibold mb-3 flex items-center gap-2">
      <span aria-hidden="true">⏰</span> Próximas 12 horas
    </h2>
    <div 
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      role="list"
      aria-label="Previsão das próximas 12 horas"
    >
      {children}
    </div>
  </section>
);

// Seção de previsão diária
interface DailyForecastSectionProps {
  children: React.ReactNode;
}

export const DailyForecastSection: React.FC<DailyForecastSectionProps> = ({ children }) => (
  <section className="mb-6" aria-labelledby="daily-forecast-heading">
    <h2 id="daily-forecast-heading" className="text-lg font-semibold mb-3 flex items-center gap-2">
      <span aria-hidden="true">📅</span> Próximos 7 dias
    </h2>
    <div 
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-4"
      role="list"
      aria-label="Previsão dos próximos 7 dias"
    >
      {children}
    </div>
  </section>
);
