import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Versão do app - mude para forçar atualização
const APP_VERSION = '2.0.0'
const STORED_VERSION = localStorage.getItem('app_version')

// Se versão mudou, limpa TUDO
if (STORED_VERSION !== APP_VERSION) {
  // Limpa todos os caches
  if ('caches' in window) {
    caches.keys().then(names => {
      Promise.all(names.map(name => caches.delete(name)))
    })
  }
  
  // Desregistra TODOS os Service Workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister()
      })
    })
  }
  
  // Salva nova versão
  localStorage.setItem('app_version', APP_VERSION)
  
  // Força reload limpo (apenas uma vez)
  if (STORED_VERSION) {
    window.location.reload()
  }
}

// Remove loading screen
const loading = document.getElementById('loading')
if (loading) {
  loading.style.opacity = '0'
  setTimeout(() => loading.remove(), 300)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
