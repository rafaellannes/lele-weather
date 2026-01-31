# 🌤️ LeleWeather

<p align="center">
  <img src="preview.png" alt="LeleWeather Preview" width="300">
</p>

<p align="center">
  <strong>App de previsão do tempo com a mascote Lele 👧🏽</strong>
</p>

<p align="center">
  <a href="https://lele-weather.vercel.app">🌐 Acessar o App</a>
</p>

---

## ✨ Funcionalidades

- 👧🏽 **Mascote Lele** - Reage ao clima atual (sol, chuva, tempestade, dormindo à noite...)
- 🎨 **Background dinâmico** - Muda conforme o clima e horário do dia
- 🌡️ **Temperatura atual** com sensação térmica
- 📊 **Previsão hora a hora** (12 horas)
- 📅 **Previsão para 10 dias** com modal detalhado estilo Google Weather
- 🌧️ **Volume de chuva** e probabilidade por hora
- 🌅 **Nascer e pôr do sol** com visualização animada
- 📍 **Geolocalização automática**
- 🔍 **Busca de cidades** brasileiras e do mundo
- 📱 **PWA** - Instala no celular como app nativo
- ⬇️ **Pull to refresh** - Puxa para atualizar

## 📸 Screenshots

| Dia Ensolarado | Noite | Chuva |
|:--------------:|:-----:|:-----:|
| ☀️ | 🌙 | 🌧️ |

## 🛠️ Tecnologias

- **React 18** + TypeScript
- **Vite** 
- **Tailwind CSS**
- **PWA** (vite-plugin-pwa)
- **Open-Meteo API** - Dados de clima gratuitos

## 💻 Rodando Localmente

```bash
# Clone o repositório
git clone https://github.com/rafaellannes/lele-weather.git

# Entre na pasta
cd lele-weather

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

## 📦 Build

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`

## 🌐 API

Este projeto usa a [Open-Meteo API](https://open-meteo.com/) que é **100% gratuita** e não requer API key.

## 👧🏽 Sobre a Lele

A Lele é a mascote do app! Ela tem cabelo cacheado e reage ao clima:

- ☀️ **Sol** - Lele feliz com óculos de sol
- ☁️ **Nublado** - Lele normal
- 🌧️ **Chuva** - Lele com guarda-chuva
- ⛈️ **Tempestade** - Lele assustada
- 🌙 **Noite** - Lele dormindo

## 📄 Licença

MIT © [Rafael Lannes](https://github.com/rafaellannes)
