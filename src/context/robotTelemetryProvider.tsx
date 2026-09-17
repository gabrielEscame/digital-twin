import { useState, type ReactNode } from 'react'
import { RobotTelemetryContext } from './robotTelemetryContext'
import { initialRobotTelemetry, type RobotTelemetry } from '../three/Robot/hooks/useRobotTelemetry'

export const RobotTelemetryProvider = ({ children }: { children: ReactNode }) => {
  const [telemetry, setTelemetry] = useState<RobotTelemetry>(initialRobotTelemetry)

  return (
    <RobotTelemetryContext.Provider value={{ telemetry, setTelemetry }}>
      {children}
    </RobotTelemetryContext.Provider>
  )
}
