import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#0f0f1e',
          color: '#f0eeff',
          border: '1px solid rgba(120,100,255,0.25)',
          borderRadius: '14px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#00ff88', secondary: '#050508' } },
        error:   { iconTheme: { primary: '#ff6b6b', secondary: '#050508' } },
      }}
    />
  </StrictMode>
)
