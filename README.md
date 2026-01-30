# 🌤️ LeleWeather - Frontend Puro (100% Gratuito!)

App de clima PWA **100% frontend** com a mascote **Lele** 👧🏽

Hospede de **graça** no Vercel, Netlify, GitHub Pages ou Cloudflare Pages!

![LeleWeather](preview.png)

## ✨ Features

- 👧🏽 **Mascote Lele** - Reage ao clima (sol, chuva, tempestade, etc.)
- 🌡️ Temperatura atual e sensação térmica
- 📊 Previsão hora a hora
- 📅 Previsão para 10 dias
- 🌧️ Volume de chuva e probabilidade
- 🌅 Nascer e pôr do sol
- 📍 Geolocalização automática
- 🔍 Busca de cidades
- 📱 **PWA** - Instala no celular como app nativo
- 🔄 Funciona offline
- 🆓 **100% GRATUITO** - Sem backend, sem API key!

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Vite** (build super rápido)
- **Tailwind CSS** (estilização)
- **vite-plugin-pwa** (Service Worker automático)
- **Open-Meteo API** (dados de clima gratuitos)

## 🚀 Deploy Gratuito

### Opção 1: Vercel (Recomendado) ⭐

```bash
# 1. Instale a CLI do Vercel
npm i -g vercel

# 2. Na pasta do projeto, execute:
vercel

# 3. Siga as instruções e pronto!
```

Ou conecte seu repositório GitHub direto no [vercel.com](https://vercel.com)

### Opção 2: Netlify

```bash
# 1. Instale a CLI do Netlify
npm i -g netlify-cli

# 2. Build do projeto
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist
```

Ou arraste a pasta `dist` no [app.netlify.com](https://app.netlify.com)

### Opção 3: GitHub Pages

1. No `vite.config.ts`, adicione:
```ts
export default defineConfig({
  base: '/nome-do-repo/', // <-- adicione isso
  // ... resto da config
})
```

2. Faça build e deploy:
```bash
npm run build
# Use gh-pages ou faça push da pasta dist para branch gh-pages
```

### Opção 4: Cloudflare Pages

1. Conecte seu repositório no [pages.cloudflare.com](https://pages.cloudflare.com)
2. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy automático a cada push!

## 💻 Desenvolvimento Local

```bash
# 1. Instale as dependências
npm install

# 2. Rode o servidor de desenvolvimento
npm run dev

# 3. Acesse http://localhost:5173
```

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos ficam na pasta `dist/`

## 🌐 API Utilizada

**Open-Meteo** - Totalmente gratuita!
- ✅ Sem API key necessária
- ✅ Sem limite de requisições (uso justo)
- ✅ CORS liberado (funciona direto do navegador)
- ✅ Dados de alta qualidade
- ✅ Cobertura global

Documentação: https://open-meteo.com/

## 📱 Instalando como App

### Android (Chrome)
1. Acesse o site
2. Menu (⋮) → "Adicionar à tela inicial"

### iOS (Safari)
1. Acesse o site
2. Compartilhar → "Adicionar à Tela de Início"

### Desktop (Chrome/Edge)
1. Acesse o site
2. Clique no ícone de instalação na barra de endereço

## 🎨 Mascote Lele

A Lele aparece em 8 estados diferentes:

| Clima | Lele |
|-------|------|
| ☀️ Ensolarado | Com óculos de sol e sorvete |
| 🌤️ Parcialmente nublado | Sorridente e tranquila |
| ☁️ Nublado | Sonolenta com ZZZ |
| 🌧️ Chuvoso | Com guarda-chuva e galochas |
| 🌦️ Garoa | Com capuz, expressão "meh" |
| ⛈️ Tempestade | Assustada, mãos nos ouvidos |
| ❄️ Neve | Com gorro e cachecol |
| 🌫️ Neblina | Curiosa tentando enxergar |

## 📁 Estrutura do Projeto

```
leleweather-frontend/
├── public/
│   └── icons/          # Ícones PWA
├── src/
│   ├── api/
│   │   └── weather.ts  # Chamadas à API Open-Meteo
│   ├── components/
│   │   ├── LeleMascot.tsx      # Mascote Lele
│   │   └── WeatherComponents.tsx
│   ├── hooks/
│   │   └── useWeather.ts       # Hooks customizados
│   ├── types/
│   │   └── weather.ts          # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts      # Config Vite + PWA
├── tailwind.config.js
└── package.json
```

## 🔧 Customização

### Mudar localização padrão (fallback)
Em `src/hooks/useWeather.ts`:
```ts
// Fallback: Nova Iguaçu, RJ
fetchByCoords(-22.7556, -43.4603);
```

### Mudar cores do tema
Em `tailwind.config.js` e nos componentes, procure por:
- `pink-400`, `pink-500`, `pink-600` (cor de destaque)
- `slate-800`, `slate-900` (cores de fundo)

## 📄 Licença

MIT - Use como quiser!

## 🤝 Contribuições

Pull requests são bem-vindos!

---

Feito com 💖 por Rafael
