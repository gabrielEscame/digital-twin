import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { RobotTelemetryProvider } from 'context/robotTelemetryProvider'

import './index.css'

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <RobotTelemetryProvider>
      <App />
    </RobotTelemetryProvider>
  </React.StrictMode>
)
