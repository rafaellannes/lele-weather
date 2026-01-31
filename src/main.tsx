import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Limpa Service Workers e caches antigos (uma vez)
const CACHE_CLEARED = localStorage.getItem('cache_cleared_v4')
if (!CACHE_CLEARED) {
  // Desregistra todos os SWs
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister())
    })
  }
  // Limpa caches
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
  }
  localStorage.setItem('cache_cleared_v4', 'true')
  // Reload para aplicar
  setTimeout(() => window.location.reload(), 100)
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
