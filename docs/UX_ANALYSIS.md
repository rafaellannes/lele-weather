# 📊 Análise UX - LeleWeather

## Data: 31/01/2026
## Versão: v20
## Plataformas: Web Desktop, Web Mobile, PWA (iOS/Android)

---

## 📋 Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Teste de Fusos Horários](#teste-de-fusos-horários)
3. [Análise de SVGs de Clima](#análise-de-svgs-de-clima)
4. [Análise de Animações](#análise-de-animações)
5. [Bugs Identificados](#bugs-identificados)
6. [Considerações Multi-plataforma](#considerações-multi-plataforma)
7. [Oportunidades de Melhoria](#oportunidades-de-melhoria)
8. [Roteiro de Correções](#roteiro-de-correções)

---

## 🎯 Resumo Executivo

### Estado Atual
O LeleWeather é uma PWA de clima que funciona em Web Desktop, Web Mobile e como app instalado (PWA). Possui sistema de backgrounds dinâmicos e ícones SVG para representar condições climáticas.

### Pontos Fortes
- ✅ Sistema de gradientes dinâmicos por clima
- ✅ Efeitos de partículas (estrelas, chuva, neve)
- ✅ Animações CSS bem definidas
- ✅ Diferenciação dia/noite
- ✅ Sol com raios animados
- ✅ Funciona offline (Service Worker)
- ✅ Responsivo (mobile-first)

### Pontos de Atenção
- ⚠️ Potencial bug de timezone em casos de borda
- ⚠️ SVGs dos ícones muito simplificados
- ⚠️ Alguns climas sem representação visual no background
- ⚠️ Performance de animações em dispositivos low-end

---

## 🌍 Teste de Fusos Horários

### Horário de Referência: 31/01/2026 04:15 UTC

| Cidade | Fuso | Hora Local | Sunrise | Sunset | É Noite? | Weather Code | Ícone Esperado |
|--------|------|------------|---------|--------|----------|--------------|----------------|
| **Tokyo** | UTC+9 | 13:15 | 06:42 | 17:07 | ❌ Dia | 0 (limpo) | sunny ✅ |
| **Sydney** | UTC+11 | 15:15 | 06:15 | 20:01 | ❌ Dia | 0 (limpo) | sunny ✅ |
| **Moscou** | UTC+3 | 07:15 | 08:24 | 17:00 | ✅ Noite* | 2 (parcial) | partlyCloudyNight ⚠️ |
| **Londres** | UTC+0 | 04:15 | 07:39 | 16:47 | ✅ Noite | 1 (limpo) | clearNight ✅ |
| **São Paulo** | UTC-3 | 01:15 | 05:44 | 18:54 | ✅ Noite | 2 (parcial) | partlyCloudyNight ✅ |
| **New York** | UTC-5 | 23:15 | 07:07 | 17:10 | ✅ Noite | 0 (limpo) | clearNight ✅ |

### 🧪 Testes Visuais Realizados (Screenshots)

| Cidade | Temp | Condição | Mascote | Ícone | Status |
|--------|------|----------|---------|-------|--------|
| **Japão** | 7°C | Céu limpo | ☀️ Sorvete (dia) | sunny | ✅ OK |
| **Austrália** | 45°C | Nublado | 😴 Dormindo (noite) | cloudy | ❌ **BUG** |
| **Kansas** | -9°C | Nublado | 😴 Dormindo (noite) | cloudy | ✅ OK |
| **Rússia** | -34°C | Nublado | 😴 Dormindo (noite) | cloudy | ✅ OK |

### ❌ BUG CONFIRMADO: Austrália

**Evidência Visual:**
- Temperatura: **45°C** (impossível à noite)
- Máxima/Mínima: 44°/31° (estamos na máxima = dia)
- Mascote: **Lele dormindo** (indica noite)
- Hora local Sydney: ~15:15 (tarde)

**Causa Provável:**
1. O ícone `cloudy` não diferencia dia/noite
2. A mascote usa o mesmo ícone para decidir se é dia/noite
3. `cloudy` sempre retorna a mesma mascote (dormindo)

**Código problemático em `mapWeatherCode()`:**
```typescript
if (code === 3) return 'cloudy'; // NÃO considera isNight!
```

**Ícones que NÃO diferenciam dia/noite:**
- `cloudy` (código 3) ❌
- `rainy` (códigos 61-67, 80-82) ❌
- `drizzle` (códigos 51-57) ❌
- `snowy` (códigos 71-77, 85-86) ❌
- `thunderstorm` (códigos 95-99) ❌
- `foggy` (códigos 45-48) ❌

**Apenas estes diferenciam:**
- `sunny` / `clearNight` (códigos 0-1) ✅
- `partlyCloudy` / `partlyCloudyNight` (código 2) ✅

### ⚠️ Caso de Borda: Precisão de Minutos

**Problema**: A função `isNightHour()` compara apenas horas inteiras, ignorando minutos

**Exemplo problemático:**
- Horário: 08:15, Sunrise: 08:24
- `isNightHour(8, "08:24", "17:00")` → `8 < 8` = **false** (considera dia)
- **Mas** ainda faltam 9 minutos para o sol nascer!

---

## 🎨 Análise de SVGs de Clima

### Ícones Atuais (WeatherComponents.tsx)

| Ícone | Status | Qualidade Visual | Problemas |
|-------|--------|-----------------|-----------|
| `sunny` | ✅ | 7/10 | Muito básico, sem gradiente |
| `clearNight` | ✅ | 6/10 | Lua muito simples, sem crateras |
| `cloudy` | ✅ | 6/10 | Nuvem única, sem profundidade |
| `rainy` | ✅ | 7/10 | OK, gotas básicas |
| `thunderstorm` | ✅ | 8/10 | Bom, raio bem representado |
| `partlyCloudy` | ✅ | 7/10 | OK, sol + nuvem |
| `partlyCloudyNight` | ✅ | 6/10 | Lua muito pequena |
| `drizzle` | ✅ | 7/10 | OK, gotinhas circulares |
| `snowy` | ✅ | 6/10 | Flocos muito simples |
| `foggy` | ✅ | 7/10 | Linhas + nuvem, funciona |

### Ícones Faltantes (Não mapeados)

| Condição | Código WMO | Status |
|----------|------------|--------|
| Chuva congelante | 56-57, 66-67 | ❌ Usa `drizzle`/`rainy` |
| Granizo | 77, 96, 99 | ❌ Usa `snowy`/`thunderstorm` |
| Névoa densa | 48 | ❌ Usa `foggy` |
| Chuva forte | 65, 82 | ❌ Mesmo ícone de chuva leve |
| Vento forte | - | ❌ Não existe |

---

## 🎬 Análise de Animações

### Animações de Background (index.css)

| Animação | Duração | Uso | Status |
|----------|---------|-----|--------|
| `twinkle` | 2-4s | Estrelas | ✅ OK |
| `rain` | 0.5-1s | Gotas | ✅ OK |
| `snow` | 4-7s | Flocos | ✅ OK |
| `cloud-float` | 45-70s | Nuvens | ✅ OK |
| `lightning` | 8s | Relâmpago | ✅ OK |
| `pulse-slow` | 4s | Sol/halo | ✅ OK |
| `spin-slow` | 30s | Raios sol | ✅ OK |
| `float-1/2/3` | 2.5-4s | Brilhos sol | ✅ OK |

### Animações de UX

| Animação | Duração | Uso | Status |
|----------|---------|-----|--------|
| `fade-in` | 0.5s | Carregamento | ✅ OK |
| `slide-up` | 0.4s | Cards | ✅ OK |
| `scale-in` | 0.3s | Modais | ⚠️ Não usado |
| `bounce-soft` | 2s | Ícone temp | ✅ OK |
| `breathe` | 3s | Mascote | ✅ OK |
| `glow-pulse` | 2s | Ícones | ⚠️ Não usado |
| `shimmer` | 1.5s | Loading | ⚠️ Não usado |

### Animações Faltantes

| Necessidade | Prioridade | Descrição |
|-------------|------------|-----------|
| Transição ícone mudança | Alta | Ao trocar cidade, ícone deveria animar |
| Número contando | Média | Temperatura animando de X para Y |
| Entrada modal | Alta | Modal deveria ter scale-in |
| Refresh feedback | Média | Indicador visual ao atualizar |

---

## 🐛 Bugs Identificados

### BUG-000: Ícones Nublado/Chuva/Neve Não Diferenciam Dia/Noite (CRÍTICO)
- **Severidade**: CRÍTICA
- **Descrição**: Ícones de clima coberto (cloudy, rainy, snowy, etc.) sempre retornam versão única, sem considerar se é dia ou noite
- **Evidência**: Austrália com 45°C (claramente dia) mostra Lele dormindo
- **Arquivo**: `api/weather.ts` função `mapWeatherCode()`
- **Impacto**: Mascote errada, possível background errado
- **Ícones afetados**:
  - `cloudy` (código 3)
  - `rainy` (códigos 61-67, 80-82)
  - `drizzle` (códigos 51-57)
  - `snowy` (códigos 71-77, 85-86)
  - `thunderstorm` (códigos 95-99)
  - `foggy` (códigos 45-48)
- **Fix Proposto**:
```typescript
// Criar versões noturnas dos ícones
if (code === 3) return isNight ? 'cloudyNight' : 'cloudy';
if (code >= 61 && code <= 67) return isNight ? 'rainyNight' : 'rainy';
// etc...
```
- **Alternativa Simples**: Passar flag `isNight` para a mascote separadamente, não depender do ícone

### BUG-001: Precisão do Cálculo Dia/Noite (CRÍTICO)
- **Severidade**: Alta
- **Descrição**: A função `isNightHour()` compara apenas horas inteiras, ignorando minutos
- **Arquivo**: `api/weather.ts` linha ~388
- **Exemplo**: 
  - Horário: 08:15, Sunrise: 08:24
  - `isNightHour(8, "08:24", "17:00")` → `8 < 8` = **false** (considera dia)
  - **Mas** ainda faltam 9 minutos para o sol nascer!
- **Impacto**: Ícone de sol aparece quando ainda é noite (janela de ~59 minutos de erro)
- **Fix Proposto**:
```typescript
function isNightTime(currentTime: string, sunrise: string, sunset: string): boolean {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const current = toMinutes(currentTime.split('T')[1] || currentTime);
  const rise = toMinutes(sunrise.split('T')[1] || sunrise);
  const set = toMinutes(sunset.split('T')[1] || sunset);
  return current < rise || current >= set;
}
```

### BUG-002: Posição do Sol em Desktop Wide
- **Severidade**: Baixa
- **Descrição**: Em telas muito largas (>1920px), o sol pode ficar muito afastado do conteúdo
- **Arquivo**: `WeatherBackground.tsx`
- **Linha**: ~165
- **Status**: Parcialmente corrigido com `md:right-1/4`
- **Fix**: Usar `max-w-screen-xl` no container ou posição relativa ao content

### BUG-003: Lua Muito Discreta
- **Severidade**: Média
- **Descrição**: MoonGlow é muito transparente, quase invisível
- **Arquivo**: `WeatherBackground.tsx`
- **Linha**: ~198-204
- **Valores**: `from-slate-300/20`, `to-slate-400/10` muito baixos
- **Fix**: Aumentar opacidades para `/40` e `/20`

### BUG-004: Névoa Sem Efeito de Background
- **Severidade**: Média
- **Descrição**: `foggy` não tem partículas ou efeito visual no background
- **Arquivo**: `WeatherBackground.tsx`
- **Condição**: Não existe componente para névoa
- **Fix**: Criar componente `FogEffect`

### BUG-005: Stagger Classes Não Funcionando
- **Severidade**: Baixa
- **Descrição**: Classes `stagger-1` a `stagger-5` definem `opacity: 0` mas os cards aparecem sem animação em alguns casos
- **Arquivo**: `index.css`
- **Causa**: Pode conflitar se o elemento não tiver `animate-slide-up`
- **Fix**: Garantir que stagger só seja usado junto com animate-slide-up

### BUG-006: Chuva Noturna Sem Estrelas
- **Severidade**: Baixa
- **Descrição**: Quando chove à noite, não há estrelas (realista, mas menos atrativo)
- **Arquivo**: `WeatherBackground.tsx`
- **Fix Opcional**: Adicionar poucas estrelas com opacidade reduzida

### BUG-007: Animações Não Aplicadas em Cards
- **Severidade**: Baixa
- **Descrição**: SunTimesCard e RainDetails não tem animação de entrada
- **Arquivo**: `WeatherComponents.tsx`
- **Fix**: Adicionar `animate-slide-up stagger-5`

### BUG-008: Horário Mostra Timezone do Browser (Corrigido v19)
- **Severidade**: Crítica (RESOLVIDO)
- **Descrição**: Todas as cidades mostravam horário do browser, não da cidade
- **Causa**: Usava `getTimezone()` que retornava timezone do browser
- **Fix Aplicado**: Mudou para `timezone = 'auto'` na API
- **Status**: ✅ Corrigido na versão v19

---

## 📱 Considerações Multi-plataforma

### Web Desktop
| Aspecto | Status | Notas |
|---------|--------|-------|
| Layout responsivo | ✅ | `max-w-md mx-auto` centraliza |
| Mouse hover states | ✅ | Cards com `hover:scale-[1.02]` |
| Drag scroll | ✅ | `useDragScroll` com threshold 5px |
| Teclado navegação | ⚠️ | Falta focus visible em alguns elementos |
| Telas ultrawide | ⚠️ | Sol pode ficar muito afastado |

### Web Mobile
| Aspecto | Status | Notas |
|---------|--------|-------|
| Touch scroll | ✅ | Nativo do browser |
| Touch targets | ✅ | Botões >= 44px |
| Viewport meta | ✅ | `user-scalable=no` |
| Safe areas | ⚠️ | Não usa `env(safe-area-inset-*)` |
| Pull to refresh | ⚠️ | CSS definido mas não implementado |

### PWA (iOS/Android)
| Aspecto | Status | Notas |
|---------|--------|-------|
| Manifest | ✅ | Configurado |
| Service Worker | ✅ | Cache de assets |
| Offline mode | ✅ | Banner + dados em cache |
| Install prompt | ✅ | `InstallPrompt` component |
| Splash screen | ✅ | Definido no manifest |
| Status bar | ✅ | `theme-color: #0f172a` |
| iOS standalone | ⚠️ | Pode ter issues com notch |
| Cache busting | ✅ | Sistema de versão (v20) |

### Performance por Plataforma

| Animação | Desktop | Mobile | Low-end Mobile |
|----------|---------|--------|----------------|
| Estrelas (50) | ✅ Fluido | ✅ Fluido | ⚠️ Pode laggear |
| Chuva (50-100) | ✅ Fluido | ⚠️ Aceitável | ❌ Lento |
| Neve (60) | ✅ Fluido | ⚠️ Aceitável | ⚠️ Pode laggear |
| Sol girando | ✅ Fluido | ✅ Fluido | ✅ Fluido |
| Nuvens (3) | ✅ Fluido | ✅ Fluido | ✅ Fluido |

**Recomendação**: Detectar `navigator.hardwareConcurrency` ou usar `prefers-reduced-motion` para reduzir partículas em dispositivos lentos.

---

## 💡 Oportunidades de Melhoria

### Novos SVGs Sugeridos

#### 1. Ícones de Intensidade de Chuva
```
rainyLight   - 2 gotas pequenas
rainyHeavy   - 5+ gotas grossas
```

#### 2. Ícones de Neve Detalhados
```
snowyLight   - 2 flocos simples
snowyHeavy   - Flocos + acúmulo
snowyBlizzard - Flocos diagonais (vento)
```

#### 3. Ícones Especiais
```
windy        - Linhas curvas de vento
hail         - Nuvem + bolinhas de gelo
frost        - Cristais de gelo
hot          - Sol + ondas de calor
cold         - Termômetro baixo
```

#### 4. Ícones Compostos (Raros)
```
sunShower    - Sol + chuva simultânea
rainbowEnd   - Após tempestade
```

### Melhorias de Background

#### 1. Componente de Névoa
```tsx
const FogEffect: React.FC = () => {
  // Camadas de névoa com movimento horizontal sutil
  // Opacidade variável para simular densidade
};
```

#### 2. Componente de Vento
```tsx
const WindLines: React.FC<{ intensity: 'light' | 'strong' }> = () => {
  // Linhas curvas movendo horizontalmente
  // Mais linhas = mais vento
};
```

#### 3. Arco-íris (Easter Egg)
```tsx
const Rainbow: React.FC = () => {
  // Mostrar após chuva quando sol aparecer
  // Condição: wasRaining && isSunny
};
```

### Melhorias de Animação

#### 1. Transição de Temperatura
```css
@keyframes temp-change {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

#### 2. Ícone Pulsando ao Carregar
```css
@keyframes icon-loading {
  0%, 100% { opacity: 0.5; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}
```

#### 3. Refresh Spinner Personalizado
```css
@keyframes lele-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 📝 Roteiro de Correções

### Fase 0: Bugs Críticos de Dia/Noite (URGENTE)

| # | Task | Arquivo | Esforço |
|---|------|---------|---------|
| 0.1 | **Separar `isNight` do ícone** - passar flag independente | api/weather.ts | 30 min |
| 0.2 | Atualizar `LeleMascot` para receber `isNight` prop | LeleMascot.tsx | 20 min |
| 0.3 | Atualizar `WeatherBackground` para receber `isNight` | WeatherBackground.tsx | 15 min |
| 0.4 | Refatorar `isNightHour` para usar minutos | api/weather.ts | 30 min |
| 0.5 | Criar testes com cidades de fusos extremos | tests/weather.test.ts | 1 hora |

**Lógica proposta:**
```typescript
// Em WeatherData, adicionar:
current: {
  ...
  isNight: boolean; // Flag independente do ícone
}

// A mascote e background usam isNight diretamente
// O ícone continua sendo para exibição visual apenas
```

### Fase 1: Bugs Visuais (Imediato)

| # | Task | Arquivo | Esforço |
|---|------|---------|---------|
| 1.1 | Aumentar visibilidade MoonGlow | WeatherBackground.tsx | 5 min |
| 1.2 | Adicionar animação SunTimesCard | WeatherComponents.tsx | 2 min |
| 1.3 | Adicionar animação RainDetails | WeatherComponents.tsx | 2 min |
| 1.4 | Limitar posição do sol em telas wide | WeatherBackground.tsx | 10 min |

### Fase 2: Efeitos de Background (1-2 dias)

| # | Task | Arquivo | Esforço |
|---|------|---------|---------|
| 2.1 | Criar componente FogEffect | WeatherBackground.tsx | 30 min |
| 2.2 | Criar componente WindLines | WeatherBackground.tsx | 30 min |
| 2.3 | Integrar foggy no background | WeatherBackground.tsx | 15 min |
| 2.4 | Adicionar vento em thunderstorm | WeatherBackground.tsx | 15 min |
| 2.5 | Reduzir partículas via prefers-reduced-motion | WeatherBackground.tsx | 20 min |

### Fase 3: Novos SVGs (2-3 dias)

| # | Task | Arquivo | Esforço |
|---|------|---------|---------|
| 3.1 | Redesenhar sunny com gradiente | WeatherComponents.tsx | 20 min |
| 3.2 | Redesenhar clearNight com crateras | WeatherComponents.tsx | 20 min |
| 3.3 | Criar rainyLight e rainyHeavy | WeatherComponents.tsx | 30 min |
| 3.4 | Criar snowyLight e snowyHeavy | WeatherComponents.tsx | 30 min |
| 3.5 | Criar ícone windy | WeatherComponents.tsx | 20 min |
| 3.6 | Criar ícone hail | WeatherComponents.tsx | 20 min |
| 3.7 | Atualizar mapWeatherCode | api/weather.ts | 20 min |

### Fase 4: Animações UX (1 dia)

| # | Task | Arquivo | Esforço |
|---|------|---------|---------|
| 4.1 | Aplicar scale-in no DayDetailModal | WeatherComponents.tsx | 15 min |
| 4.2 | Criar animação de refresh | App.tsx | 20 min |
| 4.3 | Animar transição de temperatura | WeatherComponents.tsx | 30 min |
| 4.4 | Usar shimmer no WeatherSkeleton | WeatherComponents.tsx | 15 min |
| 4.5 | Usar glow-pulse em ícones noturnos | WeatherComponents.tsx | 15 min |

### Fase 5: Melhorias PWA (1-2 dias)

| # | Task | Arquivo | Esforço |
|---|------|---------|---------|
| 5.1 | Adicionar safe-area-inset para iOS | index.css | 30 min |
| 5.2 | Implementar pull-to-refresh real | App.tsx | 2 horas |
| 5.3 | Melhorar focus states para teclado | index.css | 30 min |
| 5.4 | Detectar low-end devices | hooks/useDeviceCapability.ts | 1 hora |
| 5.5 | Reduzir partículas em low-end | WeatherBackground.tsx | 30 min |

### Fase 6: Easter Eggs (Opcional)

| # | Task | Arquivo | Esforço |
|---|------|---------|---------|
| 6.1 | Componente Rainbow | WeatherBackground.tsx | 1 hora |
| 6.2 | Animação especial Lele em aniversário | LeleMascot.tsx | 2 horas |
| 6.3 | Flocos personalizados no Natal | WeatherBackground.tsx | 1 hora |

---

## 📊 Métricas de Sucesso

### Antes das Melhorias
- Tipos de ícones: 10
- Animações ativas: 12
- Efeitos de background: 6
- Cobertura de códigos WMO: ~70%
- Precisão dia/noite: ~98% (falha em janelas de 1 hora)

### Depois das Melhorias (Projetado)
- Tipos de ícones: 16+
- Animações ativas: 18+
- Efeitos de background: 8+
- Cobertura de códigos WMO: ~95%
- Precisão dia/noite: ~99.9%

---

## 🔗 Arquivos Relacionados

```
src/
├── components/
│   ├── WeatherBackground.tsx  # Backgrounds dinâmicos
│   ├── WeatherComponents.tsx  # SVGs dos ícones
│   └── LeleMascot.tsx        # Mascote animada
├── api/
│   └── weather.ts            # mapWeatherCode(), isNightHour()
├── types/
│   └── weather.ts            # WeatherIconType
├── hooks/
│   └── useDragScroll.ts      # Hook de drag scroll
└── index.css                 # Animações CSS
```

---

## ✅ Checklist de Implementação

### Bugs Críticos
- [x] ~~BUG-000: Ícones não diferenciam dia/noite~~ ✅ **CORRIGIDO v21** - Flag `isNight` independente
- [x] ~~BUG-001: Precisão do cálculo dia/noite~~ ✅ **CORRIGIDO v21** - Função `isNightTime()` com minutos
- [ ] BUG-002: Posição do sol em desktop wide
- [ ] BUG-003: MoonGlow muito transparente
- [ ] BUG-004: Névoa sem efeito de background
- [ ] BUG-005: Stagger classes
- [ ] BUG-006: Chuva noturna sem estrelas
- [ ] BUG-007: Animações em SunTimes/RainDetails

### Multi-plataforma
- [ ] Safe areas para iOS notch
- [ ] Pull to refresh real
- [ ] Focus states para teclado
- [ ] Performance em low-end devices
- [ ] prefers-reduced-motion

### Novos Componentes
- [ ] FogEffect
- [ ] WindLines
- [ ] Rainbow (opcional)

### Novos Ícones
- [ ] Redesign sunny
- [ ] Redesign clearNight
- [ ] rainyLight / rainyHeavy
- [ ] snowyLight / snowyHeavy
- [ ] windy
- [ ] hail

### Animações
- [ ] scale-in em modais
- [ ] Refresh feedback
- [ ] shimmer em skeleton
- [ ] glow-pulse em ícones noturnos

---

**Autor**: GitHub Copilot  
**Última Atualização**: 31/01/2026  
**Plataformas Testadas**: Web Desktop, Web Mobile, PWA Android

---

## 📜 Changelog

### v21 (31/01/2026) - Correção Crítica Dia/Noite
- ✅ **BUG-000 CORRIGIDO**: Adicionada flag `isNight` independente no `WeatherCurrent`
- ✅ **BUG-001 CORRIGIDO**: Nova função `isNightTime()` com precisão de minutos
- ✅ **LeleMascot**: Agora usa mapas separados para dia/noite
- ✅ **WeatherBackground**: Recebe prop `isNight` para ajustar efeitos
- ✅ **API**: Retorna `current.isNight` baseado no horário preciso da cidade

**Arquivos modificados:**
- `src/types/weather.ts` - Adicionado `isNight: boolean` em `WeatherCurrent`
- `src/api/weather.ts` - Nova função `timeToMinutes()`, `isNightTime()`, retorna `isNight`
- `src/components/LeleMascot.tsx` - Prop `isNight`, mapas separados dia/noite
- `src/components/WeatherBackground.tsx` - Prop `isNight`, lógica de efeitos ajustada
- `src/App.tsx` - Passa `isNight` para componentes
- `index.html` - Cache bump v21
