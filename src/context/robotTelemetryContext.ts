import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { RobotTelemetry } from 'three/Robot/hooks/useRobotTelemetry'

export interface RobotTelemetryContextValue {
  telemetry: RobotTelemetry
  setTelemetry: Dispatch<SetStateAction<RobotTelemetry>>
}

export const RobotTelemetryContext = createContext<RobotTelemetryContextValue | null>(null)

export const useRobotTelemetryContext = () => {
  const context = useContext(RobotTelemetryContext)

  if (!context) {
    throw new Error('useRobotTelemetryContext must be used inside RobotTelemetryProvider')
  }

  return context
}
