# 📱 Roadmap - Capacitor + Alertas de Clima

## LeleWeather - App Nativo com Notificações
**Data:** 31/01/2026  
**Status Atual:** PWA funcional  
**Objetivo:** App Android nativo com alertas de clima em tempo real

---

## 📋 Índice

1. [Por que Capacitor?](#por-que-capacitor)
2. [Arquitetura de Alertas](#arquitetura-de-alertas)
3. [Roadmap de Implementação](#roadmap-de-implementação)
4. [Configuração do Capacitor](#configuração-do-capacitor)
5. [Sistema de Notificações](#sistema-de-notificações)
6. [Backend para Alertas](#backend-para-alertas)
7. [Checklist](#checklist)

---

## 🎯 Por que Capacitor?

### Vantagens sobre TWA
| Recurso | TWA | Capacitor |
|---------|-----|-----------|
| Notificações Push | ❌ Limitado | ✅ Completo |
| Background Tasks | ❌ Não | ✅ Sim |
| GPS em background | ❌ Não | ✅ Sim |
| Alertas nativos | ❌ Não | ✅ Sim |
| Widgets | ❌ Não | ✅ Sim |
| Funciona sem Chrome | ❌ Não | ✅ Sim |

### O que vamos ganhar
- ✅ **Notificações de chuva** - "Vai chover em 30 min na sua região!"
- ✅ **Alertas de temperatura extrema** - "Onda de calor: 40°C esperados"
- ✅ **Alertas de tempestade** - "Tempestade se aproximando"
- ✅ **Widget na home** - Temperatura atual sempre visível
- ✅ **Background sync** - Atualiza mesmo com app fechado

---

## 🏗️ Arquitetura de Alertas

```
┌─────────────────────────────────────────────────────────────┐
│                        USUÁRIO                               │
│                      (Android App)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPACITOR APP                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Geolocation │  │ Push Notif  │  │ Background Tasks    │  │
│  │   Plugin    │  │   Plugin    │  │      Plugin         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Weather API │  │  Database   │  │  Push Service       │  │
│  │  Monitor    │  │ (Postgres)  │  │  (Firebase FCM)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Alertas

```
1. App registra localização do usuário
2. Backend monitora clima da região a cada 15 min
3. Se detectar condição de alerta:
   - Chuva próxima (precipitation_probability > 70%)
   - Temperatura extrema (> 35°C ou < 5°C)
   - Tempestade (weather_code 95-99)
   - Vento forte (wind_speed > 50 km/h)
4. Backend envia push notification via Firebase
5. App exibe notificação nativa
```

---

## 🗺️ Roadmap de Implementação

### Fase 1: Setup Capacitor (1-2 dias)

#### 1.1 Instalar Capacitor
```bash
cd leleweather-frontend

# Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar
npx cap init LeleWeather com.lannesware.leleweather --web-dir dist

# Adicionar plataforma Android
npm install @capacitor/android
npx cap add android
```

#### 1.2 Configurar capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lannesware.leleweather',
  appName: 'LeleWeather',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#EC4899'
    }
  }
};

export default config;
```

#### 1.3 Build e Sync
```bash
# Build do projeto
npm run build

# Sincronizar com Android
npx cap sync android

# Abrir no Android Studio
npx cap open android
```

### Fase 2: Plugins Essenciais (2-3 dias)

#### 2.1 Geolocation (GPS)
```bash
npm install @capacitor/geolocation
```

```typescript
// src/services/location.ts
import { Geolocation } from '@capacitor/geolocation';

export async function getCurrentPosition() {
  const coordinates = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000
  });
  
  return {
    lat: coordinates.coords.latitude,
    lon: coordinates.coords.longitude
  };
}

// Monitorar posição em background
export async function watchPosition(callback: (coords: GeolocationPosition) => void) {
  const watchId = await Geolocation.watchPosition(
    { enableHighAccuracy: true },
    callback
  );
  return watchId;
}
```

#### 2.2 Push Notifications
```bash
npm install @capacitor/push-notifications
```

```typescript
// src/services/notifications.ts
import { PushNotifications } from '@capacitor/push-notifications';

export async function initPushNotifications() {
  // Solicitar permissão
  const permStatus = await PushNotifications.requestPermissions();
  
  if (permStatus.receive === 'granted') {
    // Registrar para receber notificações
    await PushNotifications.register();
  }
  
  // Listener para token
  PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token: ' + token.value);
    // Enviar token para o backend
    sendTokenToBackend(token.value);
  });
  
  // Listener para notificações recebidas
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ', notification);
  });
  
  // Listener para quando usuário clica na notificação
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action performed: ', notification);
  });
}

async function sendTokenToBackend(token: string) {
  // Enviar token + localização para o backend
  const position = await getCurrentPosition();
  
  await fetch('https://api.leleweather.com/register-device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      lat: position.lat,
      lon: position.lon
    })
  });
}
```

#### 2.3 Local Notifications (para alertas imediatos)
```bash
npm install @capacitor/local-notifications
```

```typescript
// src/services/localNotifications.ts
import { LocalNotifications } from '@capacitor/local-notifications';

export async function scheduleWeatherAlert(alert: WeatherAlert) {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: alert.title,
        body: alert.body,
        id: alert.id,
        schedule: { at: new Date(Date.now() + 1000) },
        sound: 'weather_alert.wav',
        smallIcon: 'ic_weather_alert',
        largeIcon: 'ic_weather_alert_large',
        extra: {
          type: alert.type,
          severity: alert.severity
        }
      }
    ]
  });
}

// Tipos de alertas
interface WeatherAlert {
  id: number;
  type: 'rain' | 'storm' | 'heat' | 'cold' | 'wind';
  title: string;
  body: string;
  severity: 'low' | 'medium' | 'high';
}

// Exemplos de alertas
const alertExamples = {
  rain: {
    title: '🌧️ Chuva chegando!',
    body: 'Previsão de chuva em 30 minutos na sua região. Leve um guarda-chuva!'
  },
  storm: {
    title: '⛈️ Alerta de Tempestade!',
    body: 'Tempestade se aproximando. Procure abrigo seguro.'
  },
  heat: {
    title: '🌡️ Onda de Calor',
    body: 'Temperatura de 38°C esperada. Mantenha-se hidratado!'
  },
  cold: {
    title: '❄️ Frio Intenso',
    body: 'Temperatura de 2°C esperada. Agasalhe-se bem!'
  },
  wind: {
    title: '💨 Ventos Fortes',
    body: 'Rajadas de até 80 km/h. Evite áreas com árvores.'
  }
};
```

#### 2.4 Background Tasks
```bash
npm install @capacitor-community/background-geolocation
```

```typescript
// src/services/backgroundTasks.ts
import { BackgroundGeolocation } from '@capacitor-community/background-geolocation';

export async function startBackgroundLocationTracking() {
  // Configurar tracking em background
  await BackgroundGeolocation.addWatcher(
    {
      backgroundMessage: 'LeleWeather está monitorando o clima',
      backgroundTitle: 'Monitoramento ativo',
      requestPermissions: true,
      stale: false,
      distanceFilter: 1000 // Atualiza a cada 1km
    },
    async (location, error) => {
      if (error) {
        console.error(error);
        return;
      }
      
      if (location) {
        // Verificar alertas de clima para nova localização
        await checkWeatherAlerts(location.latitude, location.longitude);
      }
    }
  );
}

async function checkWeatherAlerts(lat: number, lon: number) {
  // Buscar previsão
  const weather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability,temperature_2m,weather_code`
  ).then(r => r.json());
  
  // Verificar condições de alerta
  const nextHour = weather.hourly;
  
  // Chuva em 1 hora
  if (nextHour.precipitation_probability[0] > 70) {
    scheduleWeatherAlert({
      id: Date.now(),
      type: 'rain',
      title: '🌧️ Chuva chegando!',
      body: `${nextHour.precipitation_probability[0]}% de chance de chuva na próxima hora`,
      severity: 'medium'
    });
  }
  
  // Temperatura extrema
  const temp = nextHour.temperature_2m[0];
  if (temp > 35) {
    scheduleWeatherAlert({
      id: Date.now(),
      type: 'heat',
      title: '🌡️ Calor Intenso',
      body: `Temperatura de ${temp}°C. Mantenha-se hidratado!`,
      severity: temp > 40 ? 'high' : 'medium'
    });
  }
}
```

### Fase 3: Backend para Alertas (3-5 dias)

#### 3.1 Estrutura do Backend
```
leleweather-backend/
├── src/
│   ├── index.ts           # Entry point
│   ├── routes/
│   │   ├── devices.ts     # Registro de dispositivos
│   │   └── alerts.ts      # Configuração de alertas
│   ├── services/
│   │   ├── weather.ts     # Monitoramento de clima
│   │   ├── firebase.ts    # Push notifications
│   │   └── scheduler.ts   # Cron jobs
│   └── db/
│       └── postgres.ts    # Database
├── package.json
└── Dockerfile
```

#### 3.2 API do Backend
```typescript
// src/routes/devices.ts
import { Router } from 'express';
import { db } from '../db/postgres';

const router = Router();

// Registrar dispositivo
router.post('/register', async (req, res) => {
  const { token, lat, lon, userId } = req.body;
  
  await db.query(`
    INSERT INTO devices (token, lat, lon, user_id, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (token) DO UPDATE SET lat = $2, lon = $3
  `, [token, lat, lon, userId]);
  
  res.json({ success: true });
});

// Atualizar preferências de alerta
router.post('/preferences', async (req, res) => {
  const { token, alerts } = req.body;
  // alerts: { rain: true, storm: true, heat: true, cold: false }
  
  await db.query(`
    UPDATE devices SET alert_preferences = $2 WHERE token = $1
  `, [token, JSON.stringify(alerts)]);
  
  res.json({ success: true });
});

export default router;
```

#### 3.3 Serviço de Monitoramento
```typescript
// src/services/weatherMonitor.ts
import cron from 'node-cron';
import { db } from '../db/postgres';
import { sendPushNotification } from './firebase';

// Rodar a cada 15 minutos
cron.schedule('*/15 * * * *', async () => {
  console.log('Verificando alertas de clima...');
  
  // Buscar todos os dispositivos
  const devices = await db.query('SELECT * FROM devices WHERE active = true');
  
  for (const device of devices.rows) {
    await checkAlertsForDevice(device);
  }
});

async function checkAlertsForDevice(device: Device) {
  const { lat, lon, token, alert_preferences } = device;
  
  // Buscar previsão
  const weather = await fetchWeather(lat, lon);
  const prefs = JSON.parse(alert_preferences || '{}');
  
  // Verificar cada tipo de alerta
  if (prefs.rain && weather.precipitationProbability > 70) {
    await sendPushNotification(token, {
      title: '🌧️ Chuva chegando!',
      body: `${weather.precipitationProbability}% de chance de chuva em breve`,
      data: { type: 'rain' }
    });
  }
  
  if (prefs.storm && weather.weatherCode >= 95) {
    await sendPushNotification(token, {
      title: '⛈️ Alerta de Tempestade!',
      body: 'Tempestade detectada na sua região. Procure abrigo!',
      data: { type: 'storm' }
    });
  }
  
  // ... outros alertas
}
```

#### 3.4 Firebase Cloud Messaging
```typescript
// src/services/firebase.ts
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

export async function sendPushNotification(
  token: string, 
  notification: { title: string; body: string; data?: Record<string, string> }
) {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data,
      android: {
        priority: 'high',
        notification: {
          channelId: 'weather_alerts',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true
        }
      }
    });
    
    console.log(`Notificação enviada para ${token}`);
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    
    // Se token inválido, remover do banco
    if (error.code === 'messaging/invalid-registration-token') {
      await db.query('DELETE FROM devices WHERE token = $1', [token]);
    }
  }
}
```

### Fase 4: Configurações no App (2 dias)

#### 4.1 Tela de Preferências de Alertas
```typescript
// src/components/AlertSettings.tsx
import React, { useState } from 'react';

interface AlertPreferences {
  rain: boolean;
  storm: boolean;
  heat: boolean;
  cold: boolean;
  wind: boolean;
}

export const AlertSettings: React.FC = () => {
  const [prefs, setPrefs] = useState<AlertPreferences>({
    rain: true,
    storm: true,
    heat: true,
    cold: false,
    wind: false
  });
  
  const handleToggle = async (key: keyof AlertPreferences) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    
    // Salvar no backend
    await fetch('https://api.leleweather.com/devices/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: deviceToken, alerts: newPrefs })
    });
  };
  
  return (
    <div className="p-4">
      <h2 className="text-white text-xl mb-4">Alertas de Clima</h2>
      
      <AlertToggle 
        icon="🌧️" 
        label="Chuva" 
        description="Avisa quando vai chover na sua região"
        enabled={prefs.rain}
        onToggle={() => handleToggle('rain')}
      />
      
      <AlertToggle 
        icon="⛈️" 
        label="Tempestade" 
        description="Alerta de tempestades e raios"
        enabled={prefs.storm}
        onToggle={() => handleToggle('storm')}
      />
      
      <AlertToggle 
        icon="🌡️" 
        label="Calor Extremo" 
        description="Avisa quando passar de 35°C"
        enabled={prefs.heat}
        onToggle={() => handleToggle('heat')}
      />
      
      <AlertToggle 
        icon="❄️" 
        label="Frio Intenso" 
        description="Avisa quando abaixo de 5°C"
        enabled={prefs.cold}
        onToggle={() => handleToggle('cold')}
      />
      
      <AlertToggle 
        icon="💨" 
        label="Ventos Fortes" 
        description="Alerta de vendavais"
        enabled={prefs.wind}
        onToggle={() => handleToggle('wind')}
      />
    </div>
  );
};
```

### Fase 5: Android Nativo (1-2 dias)

#### 5.1 Notification Channels
```java
// android/app/src/main/java/com/lannesware/leleweather/MainActivity.java
package com.lannesware.leleweather;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        createNotificationChannels();
    }
    
    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel alertChannel = new NotificationChannel(
                "weather_alerts",
                "Alertas de Clima",
                NotificationManager.IMPORTANCE_HIGH
            );
            alertChannel.setDescription("Alertas de chuva, tempestade e temperaturas extremas");
            alertChannel.enableVibration(true);
            alertChannel.enableLights(true);
            
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(alertChannel);
        }
    }
}
```

#### 5.2 Permissões AndroidManifest.xml
```xml
<manifest>
    <!-- Permissões -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    
    <application>
        <!-- Firebase Messaging Service -->
        <service
            android:name=".MyFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
    </application>
</manifest>
```

---

## 💰 Custos (ESTRATÉGIA CUSTO MÍNIMO)

### Opção A: SEM Backend (Recomendado para início)

| Item | Custo | Recorrência |
|------|-------|-------------|
| Conta Google Play | $25 USD (~R$ 140) | Único |
| Firebase (FCM) | $0 | Gratuito até 1M msgs/mês |
| Supabase (banco) | $0 | Free tier (500MB) |
| Vercel (functions) | $0 | Free tier |
| **Total Inicial** | **~R$ 140** | |
| **Total Mensal** | **R$ 0** | |

### Como funciona SEM backend pago?

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITETURA CUSTO ZERO                    │
└─────────────────────────────────────────────────────────────┘

1. ALERTAS LOCAIS (sem backend)
   ├─ App verifica clima a cada 15 min (background)
   ├─ Se detectar condição de alerta → notificação local
   └─ Não precisa de servidor!

2. ALERTAS PUSH (Firebase gratuito)
   ├─ Firebase Cloud Messaging: grátis até 1M msgs/mês
   ├─ Vercel Edge Functions: grátis para triggers
   └─ Supabase: grátis para armazenar tokens

3. BANCO DE DADOS (Supabase free)
   ├─ 500MB grátis
   ├─ Armazena: tokens FCM, preferências, doadores
   └─ 50K requisições/mês grátis
```

### Implementação Local-First (Sem Servidor)

```typescript
// src/services/localAlerts.ts
// Alertas processados NO DISPOSITIVO - custo zero!

import { LocalNotifications } from '@capacitor/local-notifications';
import { BackgroundRunner } from '@nickreese/nickreese-capacitor-background-runner';

// Registrar task de background
export async function registerWeatherCheck() {
  await BackgroundRunner.registerBackgroundTask({
    taskId: 'weather-check',
    label: 'Verificar alertas de clima',
    interval: 15, // minutos
    callback: async () => {
      // Pegar localização atual
      const pos = await Geolocation.getCurrentPosition();
      
      // Buscar previsão (API gratuita)
      const weather = await fetchWeatherHybrid(pos.coords.latitude, pos.coords.longitude);
      
      // Verificar condições de alerta
      checkAndNotify(weather);
    }
  });
}

function checkAndNotify(weather: WeatherData) {
  const prefs = JSON.parse(localStorage.getItem('alert_prefs') || '{}');
  
  // Chuva
  if (prefs.rain && weather.precipitationProbability > 70) {
    LocalNotifications.schedule({
      notifications: [{
        id: Date.now(),
        title: '🌧️ Chuva chegando!',
        body: `${weather.precipitationProbability}% de chance de chuva`,
        schedule: { at: new Date(Date.now() + 1000) }
      }]
    });
  }
  
  // Calor
  if (prefs.heat && weather.temperature > 35) {
    LocalNotifications.schedule({
      notifications: [{
        id: Date.now(),
        title: '🌡️ Calor intenso!',
        body: `Temperatura de ${weather.temperature}°C. Hidrate-se!`,
        schedule: { at: new Date(Date.now() + 1000) }
      }]
    });
  }
  
  // etc...
}
```

### Opção B: Com Backend Mínimo (se precisar de push remoto)

| Item | Custo | Alternativa Gratuita |
|------|-------|----------------------|
| Servidor | $5-20/mês | Vercel Edge Functions (grátis) |
| Banco de Dados | $0-15/mês | Supabase Free (500MB) |
| Firebase FCM | $0 | Sempre grátis |
| **Total** | **$5-35/mês** | **$0/mês** |

### Serviços Gratuitos Recomendados

| Serviço | Free Tier | Uso |
|---------|-----------|-----|
| **Firebase** | 1M msgs/mês | Push notifications |
| **Supabase** | 500MB + 50K req | Banco de dados |
| **Vercel** | 100GB bandwidth | Edge functions |
| **Upstash** | 10K comandos/dia | Redis (cache) |
| **PlanetScale** | 5GB + 1B reads | MySQL (se precisar) |

---

## ✅ Checklist

### Setup
- [ ] Capacitor instalado e configurado
- [ ] Android Studio funcionando
- [ ] Firebase project criado
- [ ] Backend hospedado

### Plugins
- [ ] Geolocation plugin
- [ ] Push Notifications plugin
- [ ] Local Notifications plugin
- [ ] Background Geolocation plugin

### Backend
- [ ] API de registro de dispositivos
- [ ] Cron job de monitoramento
- [ ] Integração Firebase FCM
- [ ] Banco de dados configurado

### App
- [ ] Tela de configurações de alertas
- [ ] Permissões solicitadas
- [ ] Notification channels criados
- [ ] Testes em dispositivo real

### Play Store
- [ ] App bundle gerado
- [ ] Screenshots com notificações
- [ ] Descrição atualizada
- [ ] Política de privacidade atualizada

---

## 📅 Estimativa de Tempo Total

| Fase | Tempo |
|------|-------|
| Setup Capacitor | 1-2 dias |
| Plugins | 2-3 dias |
| Backend (opcional) | 0-3 dias |
| Alertas locais | 1-2 dias |
| Configurações App | 1 dia |
| Android Nativo | 1 dia |
| Testes | 2-3 dias |
| **Total** | **~1-2 semanas** |

---

## 🔄 Integração com Sistema de Doação

### Alertas = Feature Premium (Doadores)

```typescript
// src/hooks/usePremiumFeature.ts
import { useDonorStatus } from './useDonorStatus';

export function useAlerts() {
  const { isDonor } = useDonorStatus();
  
  // Alertas só para doadores
  if (!isDonor) {
    return {
      enabled: false,
      reason: 'Doe qualquer valor para desbloquear alertas! 💝'
    };
  }
  
  return { enabled: true };
}

// No componente de configuração
function AlertSettings() {
  const { enabled, reason } = useAlerts();
  
  if (!enabled) {
    return (
      <div className="p-4 bg-pink-500/20 rounded-xl">
        <LeleMascot mood="sad" size="sm" />
        <p className="text-white">{reason}</p>
        <DonationButton />
      </div>
    );
  }
  
  return <ActualAlertSettings />;
}
```

---

**Autor:** GitHub Copilot  
**Última Atualização:** 31/01/2026
