import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { errorTracking } from './lib/error-tracking'

const root = document.getElementById('root');
if (!root) {
  errorTracking.captureError(new Error('Root element not found'), { silent: true });
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)