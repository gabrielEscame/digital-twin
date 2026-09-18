import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type useHandTracking from 'hooks/useHandTracking'
import type useIK from './useIK'

interface SpeedPoint {
  time: string
  speed: number
}

interface TorquePoint {
  time: string
  torque: number
}

export interface RobotTelemetry {
  jointRpm: number[]
  avgMotorSpeed: number
  tcpSpeed: number
  gripper: number
  state: 'IDLE' | 'RUNNING' | 'GRIPPING'
  timeDistribution: { idle: number; running: number; gripping: number }
  speedHistory: SpeedPoint[]
  temperatures: number[]
  fanSpeed: number
  cpuTemp: number
  mainboardTemp: number
  torque: number
  torqueHistory: TorquePoint[]
  ikError: number
  emergencies: number
  healthScore: number
}

const fixedDemoTelemetry = {
  ikError: 0,
  emergencies: 22,
  healthScore: 922
} as const

export const initialRobotTelemetry: RobotTelemetry = {
  jointRpm: [0, 0, 0],
  avgMotorSpeed: 0,
  tcpSpeed: 0,
  gripper: 0,
  state: 'IDLE',
  timeDistribution: { idle: 0, running: 0, gripping: 0 },
  speedHistory: [],
  temperatures: [42, 44, 41],
  fanSpeed: 1800,
  cpuTemp: 43,
  mainboardTemp: 39,
  torque: 0,
  torqueHistory: [],
  ...fixedDemoTelemetry
}

interface UseRobotTelemetryProps {
  handTracking: Pick<ReturnType<typeof useHandTracking>, 'gripRef' | 'handDetectedRef'>
  ik: Pick<ReturnType<typeof useIK>, 'jointsRef' | 'tcpPositionRef'>
}

const calculateJointRpm = (
  angles: number[],
  previousAngles: number[],
  deltaTime: number
) => angles.map((angle, index) => {
  const previous = previousAngles[index] ?? angle
  return (Math.abs(angle - previous) / deltaTime) * 60 / (2 * Math.PI)
})

const getRobotState = (
  handDetected: boolean,
  gripper: number,
  isMoving: boolean
): RobotTelemetry['state'] => {
  if (!handDetected) return 'IDLE'
  if (gripper > 0.6) return 'GRIPPING'
  return isMoving ? 'RUNNING' : 'IDLE'
}

const simulateHardware = (
  jointRpm: number[],
  avgMotorSpeed: number,
  handDetected: boolean,
  isMoving: boolean
): Pick<RobotTelemetry, 'temperatures' | 'fanSpeed' | 'cpuTemp' | 'mainboardTemp' | 'torque'> => ({
  temperatures: [
    40 + (jointRpm[0] ?? 0) * 0.02,
    42 + (jointRpm[1] ?? 0) * 0.02,
    41 + (jointRpm[2] ?? 0) * 0.02
  ],
  fanSpeed: 1500 + avgMotorSpeed * 5,
  cpuTemp: 40 + avgMotorSpeed * 0.015,
  mainboardTemp: 38 + avgMotorSpeed * 0.01,
  torque: handDetected && isMoving ? avgMotorSpeed * 0.4 : 0
})

const useRobotTelemetry = ({ handTracking, ik }: UseRobotTelemetryProps) => {
  const { gripRef, handDetectedRef } = handTracking
  const { jointsRef, tcpPositionRef } = ik

  const [telemetry, setTelemetry] = useState<RobotTelemetry>(initialRobotTelemetry)
  const previousTCP = useRef(new THREE.Vector3())
  const previousAngles = useRef<number[]>([])
  const distribution = useRef<RobotTelemetry['timeDistribution']>({
    idle: 0,
    running: 0,
    gripping: 0
  })
  const speedHistory = useRef<SpeedPoint[]>([])
  const torqueHistory = useRef<TorquePoint[]>([])

  useEffect(() => {
    let lastTime = performance.now()
    let hasPreviousTCP = false

    const interval = setInterval(() => {
      const now = performance.now()
      const deltaTime = Math.max((now - lastTime) / 1000, 0.001)
      lastTime = now

      const gripper = gripRef.current
      const handDetected = handDetectedRef.current

      const tcp = tcpPositionRef.current
      const virtualTcpSpeed = hasPreviousTCP
        ? previousTCP.current.distanceTo(tcp) / deltaTime
        : 0
      previousTCP.current.copy(tcp)
      hasPreviousTCP = true

      const angles = jointsRef.current.slice(0, 3).map((joint) => joint.angle)
      const jointRpm = calculateJointRpm(angles, previousAngles.current, deltaTime)
      previousAngles.current = angles

      const avgMotorSpeed = jointRpm.reduce((sum, rpm) => sum + rpm, 0) /
        Math.max(jointRpm.length, 1)

      const isMoving = virtualTcpSpeed > 0.03
      const state = getRobotState(handDetected, gripper, isMoving)

      if (state === 'IDLE') distribution.current.idle += deltaTime
      else if (state === 'RUNNING') distribution.current.running += deltaTime
      else distribution.current.gripping += deltaTime

      const simulatedHardware = simulateHardware(
        jointRpm,
        avgMotorSpeed,
        handDetected,
        isMoving
      )

      const time = new Date().toLocaleTimeString('en-GB', {
        minute: '2-digit',
        second: '2-digit'
      })
      speedHistory.current.push({ time, speed: virtualTcpSpeed })
      torqueHistory.current.push({ time, torque: simulatedHardware.torque })
      if (speedHistory.current.length > 30) speedHistory.current.shift()
      if (torqueHistory.current.length > 30) torqueHistory.current.shift()

      setTelemetry({
        jointRpm,
        avgMotorSpeed,
        tcpSpeed: virtualTcpSpeed,
        gripper,
        state,
        timeDistribution: { ...distribution.current },
        speedHistory: [...speedHistory.current],
        ...simulatedHardware,
        torqueHistory: [...torqueHistory.current],
        ...fixedDemoTelemetry
      })
    }, 100)

    return () => clearInterval(interval)
  }, [gripRef, handDetectedRef, jointsRef, tcpPositionRef])

  return telemetry
}

export default useRobotTelemetry
