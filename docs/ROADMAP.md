# 🗺️ LeleWeather - Roadmap de Melhorias

Este documento contém as melhorias planejadas para o LeleWeather.

---

## ⭐⭐⭐ Alta Prioridade

### 1. Falas da Lele
**Status:** 🔲 Pendente

Adicionar balão de fala com comentários sobre o clima baseados nas condições atuais.

**Exemplos de falas:**
- ☀️ Ensolarado: "Tá calor demais! Não esquece o protetor! 🧴"
- 🌧️ Chuva: "Leva o guarda-chuva! ☔"
- ⛈️ Tempestade: "Melhor ficar em casa hoje... 😰"
- 🌡️ Frio: "Coloca um casaquinho! 🧥"
- 🌡️ Calor extremo: "Hidrate-se! Tá muito quente! 🥵"

**Arquivos a modificar:**
- `src/components/LeleMascot.tsx` - Adicionar balão de fala
- Criar hook `useLelePhrase.ts` para gerar frases baseadas no clima

---

### 2. Cidades Favoritas
**Status:** 🔲 Pendente

Permitir salvar múltiplas cidades e alternar rapidamente entre elas.

**Funcionalidades:**
- Botão de favoritar cidade atual (⭐)
- Lista de cidades favoritas no modal de busca
- Limite de 5-10 cidades
- Salvar no localStorage

**Arquivos a modificar:**
- `src/hooks/useFavoriteCities.ts` (novo)
- `src/App.tsx` - Integrar favoritos na busca

---

## ⭐⭐ Média Prioridade

### 3. Alertas e Notificações
**Status:** 🔲 Pendente

Sistema de alertas para condições climáticas importantes.

**Tipos de alerta:**
- Chuva forte nas próximas horas
- Tempestade com raios
- Mudança brusca de temperatura (>10°C)
- Índice UV extremo

**Implementação:**
- Push notifications (Service Worker)
- Banner no topo do app
- Badge no ícone do PWA

---

### 4. Índice UV Detalhado
**Status:** 🔲 Pendente

Card expandido com informações sobre radiação UV.

**Informações:**
- Nível UV atual (0-11+)
- Classificação (Baixo/Moderado/Alto/Muito Alto/Extremo)
- Recomendação de protetor solar (FPS)
- Horário de pico UV do dia
- Tempo seguro de exposição

**API:** Open-Meteo já fornece `uv_index` e `uv_index_clear_sky`

---

### 5. Qualidade do Ar (AQI)
**Status:** 🔲 Pendente

Adicionar dados de qualidade do ar usando Open-Meteo Air Quality API.

**Dados disponíveis:**
- PM2.5, PM10
- Ozônio (O3)
- Dióxido de nitrogênio (NO2)
- Índice AQI geral
- Recomendações de saúde

**API:** `https://air-quality-api.open-meteo.com/v1/air-quality`

---

## ⭐ Baixa Prioridade

### 6. Tema Claro/Escuro
**Status:** 🔲 Pendente

Toggle para alternar entre tema light e dark.

**Considerações:**
- Salvar preferência no localStorage
- Respeitar `prefers-color-scheme` do sistema
- Ajustar backgrounds dinâmicos para tema claro

---

### 7. Histórico de Clima
**Status:** 🔲 Pendente

Comparar clima atual com dias anteriores.

**Funcionalidades:**
- "Ontem estava X°C, hoje está Y°C"
- Gráfico de temperatura da última semana
- Comparação de chuva acumulada

**API:** Open-Meteo Historical Weather API

---

### 8. Compartilhar Clima
**Status:** 🔲 Pendente

Botão para compartilhar imagem do clima atual.

**Implementação:**
- Usar `html2canvas` para gerar imagem
- Web Share API para compartilhar
- Incluir: temperatura, condição, Lele, cidade

---

## ✅ Implementado

### Previsão Horária Expandida
**Status:** ✅ Concluído

- Aumentado de 12 para 24 horas na tela principal
- Modal de detalhes com todas as horas do dia
- Detalhes de chuva hora a hora expandidos

---

## 📝 Notas Técnicas

### APIs Disponíveis (Open-Meteo - Gratuitas)
- Weather Forecast: `api.open-meteo.com/v1/forecast`
- ECMWF (mais preciso): `api.open-meteo.com/v1/ecmwf`
- Air Quality: `air-quality-api.open-meteo.com/v1/air-quality`
- Historical: `archive-api.open-meteo.com/v1/archive`
- Geocoding: `geocoding-api.open-meteo.com/v1/search`

### Estrutura de Arquivos
```
src/
├── api/
│   └── weather.ts       # API calls
├── components/
│   ├── Cards.tsx        # Cards de previsão
│   ├── Icons.tsx        # Ícones SVG
│   ├── Layout.tsx       # Header, seções
│   ├── LeleMascot.tsx   # Mascote animada
│   ├── Modals.tsx       # Modais
│   └── WeatherComponents.tsx
├── config/
│   └── constants.ts     # Configurações centralizadas
├── hooks/
│   └── useWeather.ts    # Hooks customizados
└── types/
    └── weather.ts       # TypeScript interfaces
```

---

*Última atualização: Janeiro 2026*
