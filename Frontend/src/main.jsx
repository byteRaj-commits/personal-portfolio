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
          background: '#1c1c28',
          color: '#f0f0f8',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          fontFamily: "'DM Sans', sans-serif",
        },
        success: { iconTheme: { primary: '#34d399', secondary: '#0a0a0f' } },
        error:   { iconTheme: { primary: '#f87171', secondary: '#0a0a0f' } },
      }}
    />
  </StrictMode>
)
