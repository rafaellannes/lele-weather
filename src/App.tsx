import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWeather, usePwaInstall, useOnlineStatus, useDebounce } from './hooks/useWeather';
import { LeleMascotAnimated } from './components/LeleMascot';
import {
  Header,
  CurrentWeather,
  RainForecastCard,
  HourlyForecastCard,
  DailyForecastCard,
  CurrentConditions,
  SunTimesCard,
  RainDetails,
  WeatherSkeleton,
  InstallPrompt,
  DayDetailModal
} from './components/WeatherComponents';
import { LocationResult, WeatherIconType } from './types/weather';
import { searchCities } from './api/weather';

// Função para determinar a classe de fundo baseada no clima
function getWeatherBackground(icon: WeatherIconType | undefined, isNight: boolean): string {
  if (!icon) return 'weather-bg-default';
  
  const nightSuffix = isNight ? '-night' : '';
  
  switch (icon) {
    case 'sunny':
    case 'partlyCloudy':
      return `weather-bg-sunny${nightSuffix}`;
    case 'cloudy':
      return `weather-bg-cloudy${nightSuffix}`;
    case 'rainy':
    case 'drizzle':
      return `weather-bg-rainy${nightSuffix}`;
    case 'thunderstorm':
      return 'weather-bg-thunderstorm';
    case 'snowy':
      return `weather-bg-snowy${nightSuffix}`;
    case 'foggy':
      return `weather-bg-foggy${nightSuffix}`;
    default:
      return 'weather-bg-default';
  }
}

function App() {
  const { weather, isLoading, error, fetchByCoords, refresh, getCurrentLocation } = useWeather();
  const { canInstall, install, dismiss } = usePwaInstall();
  const isOnline = useOnlineStatus();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estado para modal de detalhes do dia
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Buscar cidades quando o query mudar
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchCities(debouncedQuery)
      .then(setSearchResults)
      .finally(() => setIsSearching(false));
  }, [debouncedQuery]);

  const handleSelectLocation = useCallback(async (location: LocationResult) => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    // Passa o nome da localização para preservar o nome escolhido pelo usuário
    await fetchByCoords(location.lat, location.lon, { 
      name: location.name, 
      state: location.state 
    });
  }, [fetchByCoords]);
  
  // Handler para abrir modal de detalhes do dia
  const handleDayClick = useCallback((index: number) => {
    setSelectedDayIndex(index);
    setShowDayDetail(true);
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    setShowSearch(false);
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Determinar se é noite baseado no horário de nascer/pôr do sol
  const isNight = useMemo(() => {
    if (!weather?.sun) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Parse sunrise/sunset (formato "HH:MM")
    const [sunriseH, sunriseM] = weather.sun.sunrise.split(':').map(Number);
    const [sunsetH, sunsetM] = weather.sun.sunset.split(':').map(Number);
    
    const sunriseMinutes = sunriseH * 60 + sunriseM;
    const sunsetMinutes = sunsetH * 60 + sunsetM;
    
    return currentTime < sunriseMinutes || currentTime > sunsetMinutes;
  }, [weather?.sun]);

  // Classe de fundo dinâmico
  const backgroundClass = useMemo(() => {
    return getWeatherBackground(weather?.current?.icon, isNight);
  }, [weather?.current?.icon, isNight]);

  return (
    <div className={`min-h-screen weather-bg-transition ${backgroundClass}`}>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-black text-center py-2 text-sm sticky top-0 z-50">
          Você está offline. Mostrando dados em cache.
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/90 text-white text-center py-2 text-sm sticky top-0 z-50">
          {error}
          <button onClick={refresh} className="ml-2 underline">Tentar novamente</button>
        </div>
      )}

      <div className="max-w-md mx-auto pb-20">
        <Header
          address={weather?.address || 'Buscando localização...'}
          onSearch={() => setShowSearch(true)}
        />

        {isLoading && !weather ? (
          <WeatherSkeleton />
        ) : weather ? (
          <>
            <CurrentWeather data={weather.current} />

            {/* Mascote Lele */}
            <div className="flex justify-center my-4">
              <LeleMascotAnimated weather={weather.current.icon} size="lg" />
            </div>

            <RainForecastCard forecast={weather.rainForecast} />
            <HourlyForecastCard hours={weather.hourly} />
            <DailyForecastCard days={weather.daily} onDayClick={handleDayClick} />
            <CurrentConditions data={weather.current} />
            <SunTimesCard sun={weather.sun} />
            <RainDetails rainHourly={weather.rainHourly} volume={weather.rainForecast.volume} />

            {/* Footer */}
            <div className="text-center py-6">
              <p className="text-white/40 text-xs">Atualizado às {weather.updatedAt}</p>
              <button
                onClick={refresh}
                disabled={isLoading}
                className="text-pink-400 text-sm mt-2 hover:underline disabled:opacity-50"
              >
                {isLoading ? 'Atualizando...' : 'Atualizar dados'}
              </button>
              <p className="text-white/30 text-xs mt-4">
                LeleWeather • Dados: Open-Meteo
              </p>
              <p className="text-pink-400/60 text-xs mt-2">
                Feito com ❤️ para Lele
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60">Não foi possível carregar os dados</p>
            <button
              onClick={getCurrentLocation}
              className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg"
            >
              Usar minha localização
            </button>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
          <div className="max-w-md mx-auto p-4 min-h-screen">
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="text-white/70 hover:text-white p-2 -ml-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cidade..."
                className="flex-1 bg-slate-800 text-white rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 border-none"
                autoFocus
              />
            </div>

            {/* Use Current Location */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-white">Usar minha localização</span>
            </button>

            {/* Loading */}
            {isSearching && (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="mt-4">
                <p className="text-white/40 text-sm px-4 mb-2">Resultados</p>
                {searchResults.map((result, i) => (
                  <button
                    type="button"
                    key={`${result.lat}-${result.lon}-${i}`}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white truncate">{result.name}</p>
                      <p className="text-white/50 text-sm truncate">
                        {result.state ? `${result.state}, ` : ''}{result.country}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {weather && (
        <DayDetailModal
          isOpen={showDayDetail}
          onClose={() => setShowDayDetail(false)}
          days={weather.daily}
          selectedDayIndex={selectedDayIndex}
          onSelectDay={setSelectedDayIndex}
          hourlyByDay={weather.hourlyByDay}
          rainHourlyByDay={weather.rainHourlyByDay}
          sun={weather.sun}
        />
      )}

      {/* PWA Install Prompt */}
      {canInstall && <InstallPrompt onInstall={install} onDismiss={dismiss} />}
    </div>
  );
}

export default App;