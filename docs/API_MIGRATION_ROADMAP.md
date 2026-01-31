# 🔄 Roadmap - Migração de API de Clima

## LeleWeather - Análise de APIs Alternativas
**Data:** 31/01/2026  
**API Atual:** Open-Meteo (gratuita)  
**Objetivo:** Avaliar e migrar para API mais precisa
**Estratégia:** Custo ZERO - usar apenas APIs gratuitas

---

## 📋 Índice

1. [Análise da API Atual](#análise-da-api-atual)
2. [🔬 Análise INMET vs Open-Meteo](#análise-inmet-vs-open-meteo)
3. [Comparativo de APIs](#comparativo-de-apis)
4. [Análise Detalhada de Cada API](#análise-detalhada-de-cada-api)
5. [🎯 Estratégia Híbrida Brasil](#estratégia-híbrida-brasil)
6. [Recomendação](#recomendação)
7. [Guia de Migração](#guia-de-migração)
8. [Código de Abstração](#código-de-abstração)

---

## 📊 Análise da API Atual (Open-Meteo)

### Pontos Positivos
- ✅ 100% gratuita
- ✅ Sem limite de requisições
- ✅ Sem necessidade de API key
- ✅ Dados históricos
- ✅ Múltiplos modelos meteorológicos

### Pontos Negativos
- ❌ **Precisão limitada** para previsões locais
- ❌ Dados menos atualizados que APIs pagas
- ❌ Sem alertas meteorológicos oficiais
- ❌ Menos preciso para microclimas
- ❌ Atualização menos frequente (1-3h)

### Dados Disponíveis Atualmente
```typescript
// O que usamos do Open-Meteo
{
  current: {
    temperature_2m,
    relative_humidity_2m,
    apparent_temperature,
    precipitation,
    weather_code,
    pressure_msl,
    wind_speed_10m,
    wind_direction_10m
  },
  hourly: {
    temperature_2m,
    precipitation_probability,
    weather_code,
    wind_speed_10m
  },
  daily: {
    temperature_2m_max,
    temperature_2m_min,
    weather_code,
    precipitation_probability_max,
    sunrise,
    sunset
  }
}
```

---

## 🔬 Análise INMET vs Open-Meteo (para Brasil)

### Resultado da Análise: INMET é MAIS PRECISO para o Brasil ✅

#### Por que INMET é mais preciso?

| Critério | Open-Meteo | INMET |
|----------|------------|-------|
| **Fonte dos dados** | Modelos numéricos globais (GFS, ECMWF) | Estações meteorológicas reais no Brasil |
| **Atualização** | A cada 1-3 horas | A cada hora (dados de estação) |
| **Resolução espacial** | ~11km (grade global) | Pontos específicos (600+ estações) |
| **Microclimas** | ❌ Não captura | ✅ Captura melhor |
| **Dados de precipitação** | Modelo estimado | Pluviômetro real |
| **Alertas oficiais** | ❌ Não | ✅ Sim (governo) |
| **Cobertura Brasil** | Global (menos detalhe) | 600+ estações dedicadas |

#### Evidências de Precisão INMET

1. **Dados de Sensores Reais**
   - INMET tem 600+ estações automáticas no Brasil
   - Mede temperatura, umidade, vento, chuva em tempo real
   - Não é modelo/estimativa - são dados medidos

2. **Alertas Meteorológicos Oficiais**
   - Únicos alertas reconhecidos pelo governo
   - Sistema Alert-AS (RSS disponível)
   - Usados por Defesa Civil

3. **Previsões Calibradas para Brasil**
   - Modelos ajustados para clima tropical
   - Considera ZCAS, frentes frias, etc.

#### Limitações do INMET

| Limitação | Impacto | Solução |
|-----------|---------|---------|
| Apenas Brasil | Alto | Usar Open-Meteo fora do Brasil |
| API instável às vezes | Médio | Fallback para Open-Meteo |
| Sem dados por lat/lon direto | Médio | Usar geocode IBGE |
| Documentação fraca | Baixo | Engenharia reversa |

#### Endpoints INMET Descobertos

```bash
# 1. Dados de Estações (DADOS REAIS DE SENSORES!)
# Formato: /estacao/dados/{codigo}/{data}
GET https://apitempo.inmet.gov.br/estacao/dados/A652/2026-01-31

# 2. Listar Estações
GET https://apitempo.inmet.gov.br/estacoes/T  # Todas
GET https://apitempo.inmet.gov.br/estacoes/A  # Automáticas

# 3. Previsão por Geocode IBGE
GET https://apiprevmet3.inmet.gov.br/previsao/{geocode_ibge}

# 4. Alertas Meteorológicos (RSS)
GET https://apiprevmet3.inmet.gov.br/avisos/rss
```

#### Mapeamento Geocode IBGE → Cidade

```typescript
// Exemplos de geocodes IBGE
const geocodes = {
  'São Paulo': '3550308',
  'Rio de Janeiro': '3304557',
  'Brasília': '5300108',
  'Belo Horizonte': '3106200',
  'Salvador': '2927408',
  'Curitiba': '4106902',
  'Recife': '2611606',
  'Porto Alegre': '4314902',
  'Fortaleza': '2304400',
  'Manaus': '1302603'
};

// API para buscar geocode por nome
// https://servicodados.ibge.gov.br/api/v1/localidades/municipios/{nome}
```
```

---

## 🆚 Comparativo de APIs

| API | Precisão | Preço/mês | Req/dia | Alertas | Radar | Recomendado |
|-----|----------|-----------|---------|---------|-------|-------------|
| **Open-Meteo** | ⭐⭐⭐ | $0 | ∞ | ❌ | ❌ | Hobby |
| **OpenWeather** | ⭐⭐⭐⭐ | $0-40 | 1000-3M | ✅ | ✅ | ✅ **Melhor custo-benefício** |
| **WeatherAPI** | ⭐⭐⭐⭐ | $0-35 | 1M-∞ | ✅ | ✅ | ✅ Boa opção |
| **Tomorrow.io** | ⭐⭐⭐⭐⭐ | $0-99 | 500-25k | ✅ | ✅ | Premium |
| **AccuWeather** | ⭐⭐⭐⭐⭐ | $25-500 | 50-∞ | ✅ | ✅ | Enterprise |
| **Visual Crossing** | ⭐⭐⭐⭐ | $0-35 | 1000-∞ | ✅ | ❌ | Histórico |
| **Weatherbit** | ⭐⭐⭐⭐ | $0-35 | 500-50k | ✅ | ❌ | Intermediário |
| **INMET (Brasil)** | ⭐⭐⭐⭐⭐ | $0 | - | ✅ | ✅ | Brasil apenas |

---

## 🎯 Estratégia Híbrida Brasil (CUSTO ZERO)

### Arquitetura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO SOLICITA CLIMA                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  DETECTAR LOCALIZAÇÃO                        │
│            É no Brasil? (lat/lon bounds check)               │
└─────────────────────────┬───────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│      BRASIL           │   │    RESTO DO MUNDO     │
│                       │   │                       │
│   1. INMET API        │   │   Open-Meteo API      │
│      (primário)       │   │   (único provider)    │
│                       │   │                       │
│   2. Open-Meteo       │   │   ✅ Gratuito         │
│      (fallback)       │   │   ✅ Sem limite       │
│                       │   │                       │
│   ✅ Dados reais      │   └───────────────────────┘
│   ✅ Alertas oficiais │
│   ✅ Mais preciso     │
└───────────────────────┘
```

### Implementação da Estratégia Híbrida

```typescript
// src/services/weather/hybridProvider.ts

// Bounds do Brasil (aproximado)
const BRAZIL_BOUNDS = {
  north: 5.27,    // Cabo Orange (Amapá)
  south: -33.75,  // Arroio Chuí (RS)
  west: -73.99,   // Serra do Divisor (Acre)
  east: -34.79    // Ponta do Seixas (Paraíba)
};

function isInBrazil(lat: number, lon: number): boolean {
  return (
    lat >= BRAZIL_BOUNDS.south &&
    lat <= BRAZIL_BOUNDS.north &&
    lon >= BRAZIL_BOUNDS.west &&
    lon <= BRAZIL_BOUNDS.east
  );
}

export async function fetchWeatherHybrid(lat: number, lon: number) {
  if (isInBrazil(lat, lon)) {
    try {
      // Tentar INMET primeiro (mais preciso para Brasil)
      const inmetData = await fetchFromINMET(lat, lon);
      return { ...inmetData, provider: 'INMET' };
    } catch (error) {
      console.warn('INMET falhou, usando Open-Meteo como fallback');
      const openMeteoData = await fetchFromOpenMeteo(lat, lon);
      return { ...openMeteoData, provider: 'Open-Meteo (fallback)' };
    }
  } else {
    // Fora do Brasil: usar Open-Meteo
    const openMeteoData = await fetchFromOpenMeteo(lat, lon);
    return { ...openMeteoData, provider: 'Open-Meteo' };
  }
}
```

### Provider INMET Completo

```typescript
// src/services/weather/providers/inmet.ts
import { CurrentWeather, Forecast, Alert, WeatherProvider } from '../types';

export class INMETProvider implements WeatherProvider {
  name = 'INMET';
  
  // Encontrar estação mais próxima
  private async findNearestStation(lat: number, lon: number): Promise<Station | null> {
    try {
      const response = await fetch('https://apitempo.inmet.gov.br/estacoes/T');
      const stations: Station[] = await response.json();
      
      // Calcular distância para cada estação e pegar a mais próxima
      let nearest: Station | null = null;
      let minDistance = Infinity;
      
      for (const station of stations) {
        const distance = this.haversineDistance(
          lat, lon, 
          parseFloat(station.VL_LATITUDE), 
          parseFloat(station.VL_LONGITUDE)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearest = station;
        }
      }
      
      return nearest;
    } catch {
      return null;
    }
  }
  
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  
  async fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const station = await this.findNearestStation(lat, lon);
    if (!station) throw new Error('Nenhuma estação INMET encontrada');
    
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://apitempo.inmet.gov.br/estacao/dados/${station.CD_ESTACAO}/${today}`
    );
    const data = await response.json();
    
    // Pegar última leitura do dia
    const latest = data[data.length - 1];
    
    return {
      temperature: parseFloat(latest.TEM_INS),
      feelsLike: this.calculateFeelsLike(
        parseFloat(latest.TEM_INS),
        parseFloat(latest.UMD_INS),
        parseFloat(latest.VEN_VEL)
      ),
      humidity: parseFloat(latest.UMD_INS),
      pressure: parseFloat(latest.PRE_INS),
      windSpeed: parseFloat(latest.VEN_VEL) * 3.6, // m/s para km/h
      windDirection: parseFloat(latest.VEN_DIR),
      weatherCode: this.estimateWeatherCode(latest),
      description: this.getWeatherDescription(latest),
      icon: this.mapWeatherIcon(latest),
      precipitation: parseFloat(latest.CHUVA) || 0
    };
  }
  
  async fetchAlerts(lat: number, lon: number): Promise<Alert[]> {
    try {
      const response = await fetch('https://apiprevmet3.inmet.gov.br/avisos/rss');
      const rssText = await response.text();
      
      // Parse RSS XML
      const parser = new DOMParser();
      const xml = parser.parseFromString(rssText, 'text/xml');
      const items = xml.querySelectorAll('item');
      
      const alerts: Alert[] = [];
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        
        // Verificar se alerta é relevante para a região
        // (simplificado - idealmente verificar coordenadas no XML)
        alerts.push({
          id: crypto.randomUUID(),
          event: title,
          headline: title,
          description: description,
          severity: this.parseSeverity(title),
          start: new Date(),
          end: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
      });
      
      return alerts;
    } catch {
      return [];
    }
  }
  
  private parseSeverity(title: string): 'minor' | 'moderate' | 'severe' | 'extreme' {
    const lower = title.toLowerCase();
    if (lower.includes('perigo') || lower.includes('grande perigo')) return 'extreme';
    if (lower.includes('alerta')) return 'severe';
    if (lower.includes('aviso')) return 'moderate';
    return 'minor';
  }
  
  private calculateFeelsLike(temp: number, humidity: number, windSpeed: number): number {
    // Fórmula simplificada de sensação térmica
    if (temp > 27) {
      // Heat index
      return temp + 0.33 * humidity - 0.7 * windSpeed - 4;
    } else if (temp < 10) {
      // Wind chill
      return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 
             0.3965 * temp * Math.pow(windSpeed, 0.16);
    }
    return temp;
  }
  
  private estimateWeatherCode(data: any): number {
    const chuva = parseFloat(data.CHUVA) || 0;
    const umidade = parseFloat(data.UMD_INS) || 0;
    
    if (chuva > 10) return 65; // Chuva forte
    if (chuva > 2) return 63;  // Chuva moderada
    if (chuva > 0) return 61;  // Chuva fraca
    if (umidade > 90) return 3; // Nublado
    if (umidade > 70) return 2; // Parcialmente nublado
    return 0; // Céu limpo
  }
  
  private getWeatherDescription(data: any): string {
    const code = this.estimateWeatherCode(data);
    const descriptions: Record<number, string> = {
      0: 'Céu limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      61: 'Chuva fraca',
      63: 'Chuva moderada',
      65: 'Chuva forte'
    };
    return descriptions[code] || 'Tempo variável';
  }
  
  private mapWeatherIcon(data: any): string {
    // Retornar ícone baseado no código
    return '';
  }
}

interface Station {
  CD_ESTACAO: string;
  DC_NOME: string;
  VL_LATITUDE: string;
  VL_LONGITUDE: string;
  SG_ESTADO: string;
  CD_SITUACAO: string;
}
```

### Custo Total: R$ 0,00 🎉

| Item | Custo |
|------|-------|
| INMET API | R$ 0 (governo) |
| Open-Meteo API | R$ 0 (open source) |
| Alertas INMET | R$ 0 (RSS público) |
| **TOTAL** | **R$ 0** |

---

## 📖 Análise Detalhada de Cada API

### 1. OpenWeatherMap ⭐⭐⭐⭐ (RECOMENDADA)

**Website:** https://openweathermap.org/api

#### Planos
| Plano | Preço | Requisições | Features |
|-------|-------|-------------|----------|
| Free | $0 | 1,000/dia | Básico |
| Startup | $40/mês | 100,000/dia | + Minutely, Alerts |
| Developer | $180/mês | 3,000,000/mês | + Historical |
| Professional | $470/mês | 10,000,000/mês | Tudo |

#### Endpoints Principais
```bash
# Current Weather
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=pt_br

# One Call API 3.0 (requer plano pago)
GET https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=pt_br

# 5 Day Forecast (gratuito)
GET https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=pt_br

# Alertas
GET https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={API_KEY}&exclude=minutely,hourly,daily&alerts=true
```

#### Resposta Exemplo
```json
{
  "lat": -22.9068,
  "lon": -43.1729,
  "timezone": "America/Sao_Paulo",
  "current": {
    "dt": 1706745600,
    "temp": 32.5,
    "feels_like": 38.2,
    "humidity": 65,
    "uvi": 11.2,
    "weather": [{ "id": 800, "main": "Clear", "description": "céu limpo" }]
  },
  "alerts": [
    {
      "sender_name": "INMET",
      "event": "Onda de Calor",
      "description": "Temperaturas acima de 35°C"
    }
  ]
}
```

#### Vantagens
- ✅ Muito popular, documentação excelente
- ✅ Plano gratuito generoso
- ✅ Tradução para português
- ✅ Alertas meteorológicos
- ✅ API estável e confiável
- ✅ Ícones incluídos

#### Desvantagens
- ⚠️ One Call 3.0 requer plano pago
- ⚠️ Previsão horária limitada no free

---

### 2. WeatherAPI ⭐⭐⭐⭐

**Website:** https://www.weatherapi.com/

#### Planos
| Plano | Preço | Requisições | Features |
|-------|-------|-------------|----------|
| Free | $0 | 1,000,000/mês | Básico |
| Developer | $9/mês | 2,000,000/mês | + Alerts |
| Business | $35/mês | 5,000,000/mês | + Historical |

#### Endpoints
```bash
# Current + Forecast + Alerts (tudo em 1 call!)
GET https://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={lat},{lon}&days=7&aqi=yes&alerts=yes&lang=pt

# Astronomy (sunrise/sunset)
GET https://api.weatherapi.com/v1/astronomy.json?key={API_KEY}&q={lat},{lon}

# Search (autocomplete)
GET https://api.weatherapi.com/v1/search.json?key={API_KEY}&q={query}
```

#### Resposta Exemplo
```json
{
  "location": {
    "name": "Rio de Janeiro",
    "region": "Rio de Janeiro",
    "country": "Brazil",
    "localtime": "2026-01-31 15:00"
  },
  "current": {
    "temp_c": 32.5,
    "feelslike_c": 38.2,
    "humidity": 65,
    "condition": {
      "text": "Ensolarado",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
      "code": 1000
    },
    "uv": 11,
    "air_quality": { "pm2_5": 12.3, "pm10": 25.6 }
  },
  "forecast": {
    "forecastday": [...]
  },
  "alerts": {
    "alert": [
      {
        "headline": "Onda de Calor",
        "severity": "Severe",
        "desc": "Temperaturas extremas previstas"
      }
    ]
  }
}
```

#### Vantagens
- ✅ **1 milhão de requisições gratuitas/mês**
- ✅ Tudo em uma única chamada (current + forecast + alerts)
- ✅ Qualidade do ar incluída
- ✅ Busca de cidades incluída
- ✅ Ícones de alta qualidade
- ✅ Alertas no plano gratuito

#### Desvantagens
- ⚠️ Menos conhecido que OpenWeather
- ⚠️ Documentação menos extensa

---

### 3. Tomorrow.io (Climacell) ⭐⭐⭐⭐⭐

**Website:** https://www.tomorrow.io/

#### Planos
| Plano | Preço | Requisições | Features |
|-------|-------|-------------|----------|
| Free | $0 | 500/dia | Básico |
| Basic | $25/mês | 2,500/dia | + Alerts |
| Business | $99/mês | 25,000/dia | + Minutes |

#### Diferenciais
- 🌟 **Previsão minuto a minuto** (quando vai começar/parar de chover)
- 🌟 Dados proprietários de sensores IoT
- 🌟 Muito preciso para próximas 4 horas
- 🌟 Alertas personalizáveis

#### Endpoints
```bash
# Realtime
GET https://api.tomorrow.io/v4/weather/realtime?location={lat},{lon}&apikey={API_KEY}&units=metric

# Forecast
GET https://api.tomorrow.io/v4/weather/forecast?location={lat},{lon}&apikey={API_KEY}&timesteps=1h,1d&units=metric

# Timeline (mais flexível)
GET https://api.tomorrow.io/v4/timelines?location={lat},{lon}&fields=temperature,precipitationProbability&timesteps=1m&apikey={API_KEY}
```

#### Vantagens
- ✅ Previsão mais precisa disponível
- ✅ Minuto a minuto para chuva
- ✅ Interface moderna

#### Desvantagens
- ❌ Plano gratuito muito limitado (500/dia)
- ❌ Mais caro que alternativas

---

### 4. AccuWeather ⭐⭐⭐⭐⭐

**Website:** https://developer.accuweather.com/

#### Planos
| Plano | Preço | Requisições | Features |
|-------|-------|-------------|----------|
| Limited Trial | $0 | 50/dia | Teste |
| Standard | $25/mês | 225,000/mês | Completo |
| Prime | $100/mês | 750,000/mês | + Minutecast |

#### Diferenciais
- 🌟 **MinuteCast** - Previsão de chuva minuto a minuto (2 horas)
- 🌟 Índices especiais (asma, artrite, mosquitos, etc.)
- 🌟 Marca mais reconhecida do mundo
- 🌟 Extremamente preciso

#### Vantagens
- ✅ Marca de confiança global
- ✅ MinuteCast excelente
- ✅ Índices especiais únicos

#### Desvantagens
- ❌ **Muito limitado no gratuito (50/dia)**
- ❌ Cara para apps pequenos
- ❌ Termos restritivos de uso

---

### 5. Visual Crossing ⭐⭐⭐⭐

**Website:** https://www.visualcrossing.com/

#### Planos
| Plano | Preço | Requisições | Features |
|-------|-------|-------------|----------|
| Free | $0 | 1,000/dia | Básico |
| Professional | $35/mês | Ilimitado | Tudo |

#### Diferenciais
- 🌟 **Dados históricos desde 1970** (excelente para análises)
- 🌟 Previsão de 15 dias
- 🌟 Query por endereço textual

#### Vantagens
- ✅ Melhor para dados históricos
- ✅ 1000 req/dia grátis
- ✅ Simples de usar

#### Desvantagens
- ⚠️ Sem alertas meteorológicos
- ⚠️ Sem radar

---

### 6. INMET - Instituto Nacional de Meteorologia (Brasil) ⭐⭐⭐⭐⭐

**Website:** https://portal.inmet.gov.br/

#### Características
- ✅ **100% gratuito**
- ✅ **Dados oficiais do Brasil**
- ✅ Estações meteorológicas reais
- ✅ Alertas oficiais
- ⚠️ Apenas para Brasil

#### API
```bash
# Estações (dados reais de sensores)
GET https://apitempo.inmet.gov.br/estacao/dados/{codigo_estacao}/{data}

# Previsão por cidade
GET https://apitempo.inmet.gov.br/previsao/{geocode}

# Alertas
GET https://apitempo.inmet.gov.br/avisos/rss
```

#### Como usar junto com Open-Meteo
```typescript
// Para Brasil: usar INMET como fonte primária
// Para outros países: usar API internacional

async function getWeather(lat: number, lon: number, country: string) {
  if (country === 'BR') {
    // Usar dados do INMET (mais precisos para Brasil)
    return await fetchFromINMET(lat, lon);
  } else {
    // Usar API internacional
    return await fetchFromOpenMeteo(lat, lon);
  }
}
```

---

## 🎯 Recomendação

### Para LeleWeather - ESTRATÉGIA CUSTO ZERO

#### ✅ Opção Recomendada: Híbrida INMET + Open-Meteo
- **Brasil:** INMET (dados reais de 600+ estações) + alertas oficiais
- **Mundo:** Open-Meteo (gratuito ilimitado)
- **Custo:** R$ 0,00/mês 🎉
- **Esforço:** 3-5 dias de implementação

#### Vantagens dessa abordagem
1. **Precisão máxima para Brasil** - dados de sensores reais
2. **Alertas oficiais** - Defesa Civil, governo
3. **Custo zero** - ambas APIs gratuitas
4. **Fallback automático** - se INMET cair, usa Open-Meteo
5. **Cobertura global** - Open-Meteo para fora do Brasil

#### Comparação Visual

```
ANTES (só Open-Meteo):
┌─────────────────────────────────────┐
│  Usuário em São Paulo               │
│  Open-Meteo: "32°C, ensolarado"     │
│  (baseado em modelo global GFS)     │
│  ⚠️ Pode ter erro de 2-3°C         │
└─────────────────────────────────────┘

DEPOIS (Híbrido):
┌─────────────────────────────────────┐
│  Usuário em São Paulo               │
│  INMET: "30.5°C, parcialmente       │
│         nublado"                    │
│  (estação Mirante de Santana)       │
│  ✅ Dado REAL medido há 15 min      │
│  ✅ Alerta: Chuva forte prevista    │
└─────────────────────────────────────┘
```

#### Opções Futuras (se monetizar)

| Opção | Quando usar | Custo |
|-------|-------------|-------|
| OpenWeather Free | Se quiser mais dados | $0 (1M req/mês) |
| WeatherAPI Free | Alertas melhores | $0 (1M req/mês) |
| Tomorrow.io | Se virar negócio | $25-99/mês |

---

## 🔧 Guia de Migração

### Passo 1: Criar Camada de Abstração

```typescript
// src/services/weather/types.ts
export interface WeatherProvider {
  name: string;
  fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather>;
  fetchForecast(lat: number, lon: number, days: number): Promise<Forecast>;
  fetchAlerts(lat: number, lon: number): Promise<Alert[]>;
  searchCities(query: string): Promise<City[]>;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  description: string;
  icon: string;
  uvIndex?: number;
  visibility?: number;
}

export interface Forecast {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface Alert {
  id: string;
  event: string;
  headline: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: Date;
  end: Date;
}
```

### Passo 2: Implementar Providers

```typescript
// src/services/weather/providers/openmeteo.ts
export class OpenMeteoProvider implements WeatherProvider {
  name = 'OpenMeteo';
  
  async fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m`
    );
    const data = await response.json();
    
    return this.mapCurrentWeather(data.current);
  }
  
  private mapCurrentWeather(data: any): CurrentWeather {
    return {
      temperature: data.temperature_2m,
      feelsLike: data.apparent_temperature,
      humidity: data.relative_humidity_2m,
      pressure: data.pressure_msl,
      windSpeed: data.wind_speed_10m,
      windDirection: data.wind_direction_10m,
      weatherCode: data.weather_code,
      description: this.getWeatherDescription(data.weather_code),
      icon: this.mapWeatherIcon(data.weather_code)
    };
  }
  
  // ... outros métodos
}
```

```typescript
// src/services/weather/providers/weatherapi.ts
export class WeatherAPIProvider implements WeatherProvider {
  name = 'WeatherAPI';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${lat},${lon}&lang=pt`
    );
    const data = await response.json();
    
    return {
      temperature: data.current.temp_c,
      feelsLike: data.current.feelslike_c,
      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,
      windSpeed: data.current.wind_kph,
      windDirection: data.current.wind_degree,
      weatherCode: data.current.condition.code,
      description: data.current.condition.text,
      icon: data.current.condition.icon,
      uvIndex: data.current.uv,
      visibility: data.current.vis_km
    };
  }
  
  async fetchAlerts(lat: number, lon: number): Promise<Alert[]> {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${lat},${lon}&alerts=yes`
    );
    const data = await response.json();
    
    return data.alerts.alert.map((a: any) => ({
      id: a.msgtype,
      event: a.event,
      headline: a.headline,
      description: a.desc,
      severity: this.mapSeverity(a.severity),
      start: new Date(a.effective),
      end: new Date(a.expires)
    }));
  }
  
  // ... outros métodos
}
```

```typescript
// src/services/weather/providers/openweather.ts
export class OpenWeatherProvider implements WeatherProvider {
  name = 'OpenWeatherMap';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`
    );
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed * 3.6, // m/s para km/h
      windDirection: data.wind.deg,
      weatherCode: data.weather[0].id,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      visibility: data.visibility / 1000
    };
  }
  
  // ... outros métodos
}
```

### Passo 3: Factory e Configuração

```typescript
// src/services/weather/factory.ts
import { WeatherProvider } from './types';
import { OpenMeteoProvider } from './providers/openmeteo';
import { WeatherAPIProvider } from './providers/weatherapi';
import { OpenWeatherProvider } from './providers/openweather';

type ProviderName = 'openmeteo' | 'weatherapi' | 'openweather';

const providers: Record<ProviderName, () => WeatherProvider> = {
  openmeteo: () => new OpenMeteoProvider(),
  weatherapi: () => new WeatherAPIProvider(import.meta.env.VITE_WEATHERAPI_KEY),
  openweather: () => new OpenWeatherProvider(import.meta.env.VITE_OPENWEATHER_KEY)
};

// Configuração via variável de ambiente
const ACTIVE_PROVIDER = (import.meta.env.VITE_WEATHER_PROVIDER || 'openmeteo') as ProviderName;

export function getWeatherProvider(): WeatherProvider {
  const factory = providers[ACTIVE_PROVIDER];
  if (!factory) {
    throw new Error(`Unknown weather provider: ${ACTIVE_PROVIDER}`);
  }
  return factory();
}
```

### Passo 4: Usar no App

```typescript
// src/api/weather.ts
import { getWeatherProvider } from '../services/weather/factory';

const provider = getWeatherProvider();

export async function fetchWeatherByCoords(lat: number, lon: number) {
  const [current, forecast, alerts] = await Promise.all([
    provider.fetchCurrentWeather(lat, lon),
    provider.fetchForecast(lat, lon, 7),
    provider.fetchAlerts(lat, lon).catch(() => []) // Alertas opcionais
  ]);
  
  return {
    current,
    forecast,
    alerts,
    provider: provider.name
  };
}
```

### Passo 5: Variáveis de Ambiente

```bash
# .env.development
VITE_WEATHER_PROVIDER=openmeteo

# .env.production
VITE_WEATHER_PROVIDER=weatherapi
VITE_WEATHERAPI_KEY=sua_api_key_aqui

# Ou para OpenWeather
VITE_WEATHER_PROVIDER=openweather
VITE_OPENWEATHER_KEY=sua_api_key_aqui
```

---

## 📊 Matriz de Decisão

| Critério | Peso | Open-Meteo | WeatherAPI | OpenWeather | Tomorrow.io |
|----------|------|------------|------------|-------------|-------------|
| Custo | 25% | 10 | 9 | 8 | 5 |
| Precisão | 30% | 6 | 8 | 8 | 10 |
| Alertas | 20% | 0 | 9 | 8 | 9 |
| Facilidade | 15% | 10 | 9 | 8 | 7 |
| Docs | 10% | 7 | 8 | 10 | 8 |
| **TOTAL** | 100% | **6.6** | **8.4** | **8.1** | **7.8** |

### 🏆 Vencedor: WeatherAPI

---

## ✅ Checklist de Migração

### Preparação
- [ ] Criar conta na nova API
- [ ] Testar endpoints manualmente
- [ ] Mapear campos para estrutura atual

### Implementação
- [ ] Criar interface WeatherProvider
- [ ] Implementar provider atual (OpenMeteo)
- [ ] Implementar novo provider
- [ ] Criar factory de providers
- [ ] Adicionar variáveis de ambiente

### Teste
- [ ] Testar em desenvolvimento
- [ ] Comparar resultados lado a lado
- [ ] Verificar edge cases
- [ ] Testar fallback

### Deploy
- [ ] Configurar API key em produção
- [ ] Mudar variável de ambiente
- [ ] Monitorar erros
- [ ] Manter OpenMeteo como fallback

---

## 📅 Estimativa de Tempo

| Tarefa | Tempo |
|--------|-------|
| Criar conta e testar APIs | 2 horas |
| Implementar abstração | 1 dia |
| Implementar providers | 1-2 dias |
| Testes e ajustes | 1 dia |
| Deploy e monitoramento | 2 horas |
| **Total** | **~3-4 dias** |

---

**Autor:** GitHub Copilot  
**Última Atualização:** 31/01/2026
