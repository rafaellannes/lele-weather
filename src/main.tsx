import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Limpa todos os caches antigos do Service Worker
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name)
    })
  })
}

// Força atualização do Service Worker se existir
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.update()
    })
  })
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
