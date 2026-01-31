import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types/weather';
import { 
  fetchWeatherByCoords, 
  searchCities, 
  saveToCache, 
  loadFromCache,
  saveCoordsToCache,
  loadCoordsFromCache
} from '../api/weather';
import { 
  GEOLOCATION_CONFIG, 
  UPDATE_CONFIG,
  GeolocationError 
} from '../config/constants';

// Hook principal do clima
export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocationName, setCurrentLocationName] = useState<{ name: string; state?: string } | null>(null);

  const fetchByCoords = useCallback(async (
    lat: number, 
    lon: number, 
    locationName?: { name: string; state?: string }
  ) => {
    setIsLoading(true);
    setError(null);

    // Guardar o nome da localização se foi passado
    if (locationName) {
      setCurrentLocationName(locationName);
    }

    try {
      const data = await fetchWeatherByCoords(lat, lon, locationName);
      setWeather(data);
      saveToCache(data);
      saveCoordsToCache(lat, lon, locationName);
    } catch (err) {
      setError('Não foi possível obter os dados do clima');
      // Tentar carregar do cache
      const cached = loadFromCache();
      if (cached) {
        setWeather(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!weather?.coords) return;
    // Usar o nome da localização salvo no refresh
    await fetchByCoords(weather.coords.lat, weather.coords.lon, currentLocationName || undefined);
  }, [weather?.coords, fetchByCoords, currentLocationName]);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Limpar nome da localização quando usar GPS
    setCurrentLocationName(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        
        // Erro específico de geolocalização
        const geoError = new GeolocationError(err.message, err.code);
        setError(geoError.message);
        
        // Tentar carregar coords do cache
        const cachedCoords = loadCoordsFromCache();
        if (cachedCoords) {
          fetchByCoords(cachedCoords.lat, cachedCoords.lon, cachedCoords.locationName || undefined);
        } else {
          // Fallback: coordenadas padrão da config
          fetchByCoords(
            GEOLOCATION_CONFIG.FALLBACK.LAT, 
            GEOLOCATION_CONFIG.FALLBACK.LON
          );
        }
      },
      GEOLOCATION_CONFIG.OPTIONS
    );
  }, [fetchByCoords]);

  // Buscar localização inicial (apenas uma vez)
  useEffect(() => {
    // Primeiro, tentar carregar do cache
    const cached = loadFromCache();
    const cachedCoords = loadCoordsFromCache();
    
    if (cached) {
      setWeather(cached);
      setIsLoading(false);
      
      // Restaurar nome da localização do cache
      if (cachedCoords?.locationName) {
        setCurrentLocationName(cachedCoords.locationName);
        // Se já tem localização salva, não buscar GPS automaticamente
        // O usuário pode atualizar manualmente se quiser
        return;
      }
    }
    
    // Só busca GPS se não tem cache com localização definida
    getCurrentLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh conforme configuração
  useEffect(() => {
    if (!weather) return;
    
    const interval = setInterval(refresh, UPDATE_CONFIG.AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [weather, refresh]);

  return {
    weather,
    isLoading,
    error,
    fetchByCoords,
    refresh,
    getCurrentLocation,
    searchCities
  };
}

// Hook para PWA install
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setCanInstall(false);
    }

    setDeferredPrompt(null);
    return outcome === 'accepted';
  };

  const dismiss = () => setCanInstall(false);

  return { canInstall, isInstalled, install, dismiss };
}

// Hook para status online/offline
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Hook para debounce (usado na busca)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
