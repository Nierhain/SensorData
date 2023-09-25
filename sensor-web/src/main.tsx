import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createSignalRContext } from 'react-signalr'

export const SignalRContext = createSignalRContext();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SignalRContext.Provider
      url="https://localhost:5000"
      >
      <App />
    </SignalRContext.Provider>
  </React.StrictMode>,
)
