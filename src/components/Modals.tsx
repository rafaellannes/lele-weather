/**
 * Componentes de Modal e Overlay
 */
import React from 'react';
import { DailyForecast, HourlyForecast, RainHourly, SunTimes, WeatherIconType } from '../types/weather';
import { WeatherIcon } from './Icons';

// Helper para obter descrição do tempo pelo ícone
function getConditionFromIcon(icon: WeatherIconType): string {
  const conditions: Record<WeatherIconType, string> = {
    sunny: 'Ensolarado',
    partlyCloudy: 'Parcialmente nublado',
    cloudy: 'Nublado',
    rainy: 'Chuva',
    drizzle: 'Garoa',
    thunderstorm: 'Tempestade',
    snowy: 'Neve',
    foggy: 'Neblina'
  };
  return conditions[icon] || 'Variável';
}

// Prompt de instalação do PWA
interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall, onDismiss }) => (
  <div 
    className="fixed bottom-4 left-4 right-4 bg-slate-800 rounded-2xl p-4 shadow-xl border border-white/10 z-50"
    role="dialog"
    aria-labelledby="install-prompt-title"
    aria-describedby="install-prompt-desc"
  >
    <div className="flex items-start gap-3">
      <div className="text-3xl" aria-hidden="true">📱</div>
      <div className="flex-1">
        <p id="install-prompt-title" className="font-medium text-white">Instalar LeleWeather</p>
        <p id="install-prompt-desc" className="text-sm text-white/70 mt-1">Adicione o app à sua tela inicial para acesso rápido</p>
      </div>
    </div>
    <div className="flex justify-end gap-2 mt-4">
      <button 
        onClick={onDismiss} 
        className="text-white/70 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Dispensar instalação"
      >
        Depois
      </button>
      <button 
        onClick={onInstall} 
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-slate-800"
      >
        Instalar
      </button>
    </div>
  </div>
);

// Day Detail Modal - Similar ao Google Weather
interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: DailyForecast[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  hourlyByDay: HourlyForecast[][];
  rainHourlyByDay: RainHourly[][];
  sun: SunTimes;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  days,
  selectedDayIndex,
  onSelectDay,
  hourlyByDay,
  rainHourlyByDay,
  sun
}) => {
  // Ref para gerenciar focus trap
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  
  // Focus no botão fechar quando abre
  React.useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      // Previne scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fecha com ESC
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  const selectedDay = days[selectedDayIndex];
  const selectedHourly = hourlyByDay[selectedDayIndex] || [];
  const selectedRainHourly = rainHourlyByDay[selectedDayIndex] || [];
  
  // Calcular volume de chuva do dia
  const dayRainVolume = selectedRainHourly.reduce((sum, h) => sum + h.amount, 0);
  
  return (
    <div 
      className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="max-w-md mx-auto min-h-screen">
        {/* Header com seta voltar e título */}
        <div className="flex items-center px-4 py-3 sticky top-0 bg-slate-900/95 backdrop-blur-lg z-10 border-b border-white/10">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 -ml-2 focus:ring-2 focus:ring-white/30 rounded-lg"
            aria-label="Voltar para a tela principal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 id="modal-title" className="text-white text-lg ml-2">Previsão do tempo para {days.length} dia(s)</h1>
        </div>

        {/* Seletor de dias horizontal */}
        <div className="px-2 py-3 border-b border-white/10">
          <div 
            className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide"
            role="tablist"
            aria-label="Selecionar dia"
          >
            {days.map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectDay(i)}
                role="tab"
                aria-selected={selectedDayIndex === i}
                aria-controls={`day-panel-${i}`}
                className={`flex flex-col items-center min-w-[70px] px-3 py-2 rounded-xl transition-all ${
                  selectedDayIndex === i 
                    ? 'bg-blue-500/20 border border-blue-400/50' 
                    : 'hover:bg-white/5'
                }`}
              >
                <span className={`text-sm font-medium ${selectedDayIndex === i ? 'text-blue-400' : 'text-white/70'}`}>
                  {day.day === 'Hoje' ? 'Hoje' : day.day.substring(0, 3) + '.'}
                </span>
                <div className="w-8 h-8 my-1">
                  <WeatherIcon type={day.icon} />
                </div>
                <span className={`text-xs ${selectedDayIndex === i ? 'text-white' : 'text-white/60'}`}>
                  {day.high}°/{day.low}°
                </span>
              </button>
            ))}
          </div>
          {/* Indicador de seleção */}
          <div className="flex justify-start px-1 mt-1" aria-hidden="true">
            <div 
              className="h-1 bg-blue-400 rounded-full transition-all duration-300"
              style={{ 
                width: `${100 / days.length}%`,
                marginLeft: `${(selectedDayIndex * 100) / days.length}%`
              }}
            />
          </div>
        </div>

        {/* Conteúdo do dia selecionado */}
        <div 
          className="p-4"
          role="tabpanel"
          id={`day-panel-${selectedDayIndex}`}
          aria-labelledby={`day-tab-${selectedDayIndex}`}
        >
          {/* Temperatura e condição */}
          <div className="mb-6">
            <span className="text-white/60 text-sm">{selectedDay.day === 'Hoje' ? 'Hoje' : selectedDay.day + ', ' + selectedDay.dateFormatted}</span>
            <div className="flex items-start mt-2">
              <span className="text-6xl font-light text-white">{selectedDay.high}°</span>
              <span className="text-4xl text-white/50 font-light">/{selectedDay.low}°</span>
              <div className="w-12 h-12 ml-3 mt-1">
                <WeatherIcon type={selectedDay.icon} />
              </div>
            </div>
            <p className="text-pink-400 mt-2">{getConditionFromIcon(selectedDay.icon)}</p>
          </div>

          {/* Previsão hora a hora do dia selecionado */}
          {selectedHourly.length > 0 && (
            <section className="mb-6" aria-labelledby="hourly-title">
              <h3 id="hourly-title" className="text-white/80 text-base mb-3">Previsão do tempo de hora em hora</h3>
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
                <div 
                  className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                  role="list"
                  aria-label="Previsão horária"
                >
                  {selectedHourly.map((hour, i) => (
                    <div 
                      key={i} 
                      className="flex flex-col items-center min-w-[55px]"
                      role="listitem"
                      aria-label={`${hour.time}: ${hour.temp}°`}
                    >
                      <span className="text-white text-lg font-light">{hour.temp}°</span>
                      <div className="w-7 h-7 my-2"><WeatherIcon type={hour.icon} /></div>
                      <span className="text-white/60 text-xs">{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Condições climáticas diárias */}
          <section className="mb-6" aria-labelledby="conditions-title">
            <h3 id="conditions-title" className="text-white/80 text-base mb-3">Condições climáticas diárias</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Chance de chuva */}
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
                <span className="text-white/60 text-sm">Chance de chuva</span>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-white text-3xl font-light">{selectedDay.rain}</span>
                  <span className="text-white/60 text-lg mb-0.5">%</span>
                </div>
                <div 
                  className="w-full bg-slate-700 rounded-full h-2 mt-3"
                  role="progressbar"
                  aria-valuenow={selectedDay.rain}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Chance de chuva"
                >
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all"
                    style={{ width: `${selectedDay.rain}%` }}
                  />
                </div>
              </div>

              {/* Temperatura */}
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
                <span className="text-white/60 text-sm">Amplitude térmica</span>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-white text-3xl font-light">{selectedDay.high - selectedDay.low}</span>
                  <span className="text-white/60 text-lg mb-0.5">°</span>
                </div>
                <p className="text-white/50 text-sm mt-1">Máx {selectedDay.high}° / Mín {selectedDay.low}°</p>
              </div>
            </div>
          </section>

          {/* Nascer e pôr do sol - só mostra para hoje */}
          {selectedDayIndex === 0 && (
            <section className="mb-6" aria-labelledby="sun-title">
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
                <h3 id="sun-title" className="text-white font-medium mb-4">Nascer e pôr do sol</h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 15a3 3 0 110-6 3 3 0 010 6z"/>
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                      </svg>
                      <span className="text-white text-2xl font-light">{sun.sunrise}</span>
                    </div>
                    <span className="text-white/50 text-sm">Nascer do sol</span>
                  </div>
                  <div className="flex-1 flex justify-center" aria-hidden="true">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 7a5 5 0 100 10 5 5 0 000-10z"/>
                        <path d="M12 21v2M12 1v2"/>
                      </svg>
                      <span className="text-white text-2xl font-light">{sun.sunset}</span>
                    </div>
                    <span className="text-white/50 text-sm">Pôr do sol</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Detalhes de chuva hora em hora */}
          {selectedRainHourly.length > 0 && (
            <section className="mb-6" aria-labelledby="rain-title">
              <h3 id="rain-title" className="text-white/80 text-base mb-3">Detalhes de hora em hora</h3>
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-white/5">
                <div className="mb-4">
                  <p className="text-white/60 text-sm">Volume no dia</p>
                  <p className="text-white text-3xl font-light">{Math.round(dayRainVolume * 10) / 10} mm</p>
                </div>
                <div 
                  className="flex items-end gap-2 h-20 overflow-x-auto pb-2 scrollbar-hide"
                  role="list"
                  aria-label="Detalhes de chuva por hora"
                >
                  {selectedRainHourly.map((hour, i) => (
                    <div 
                      key={i} 
                      className="flex-shrink-0 flex flex-col items-center min-w-[50px] group"
                      role="listitem"
                      aria-label={`${hour.time}: ${hour.amount.toFixed(1)}mm, ${hour.chance}% chance`}
                    >
                      <span className="text-white/50 text-xs mb-1">
                        {hour.amount > 0 ? `${hour.amount.toFixed(1)}` : '< 0,25'}
                      </span>
                      <div 
                        className="w-8 bg-blue-400/60 rounded-t transition-all group-hover:bg-blue-400" 
                        style={{ height: `${Math.max(hour.amount * 20, 4)}px` }}
                        aria-hidden="true"
                      />
                      <span className="text-blue-400 text-xs mt-2">{hour.chance}%</span>
                      <span className="text-white/40 text-[10px]">{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
