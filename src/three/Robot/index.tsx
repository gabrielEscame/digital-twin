import { useGLTF } from '@react-three/drei'
import useIK from './hooks/useIK'
import useHandTracking from '../../hooks/useHandTracking'
import useRobotTelemetry from './hooks/useRobotTelemetry'
import { useEffect } from 'react'

import { useRobotTelemetryContext } from '../../context/robotTelemetryContext'

const Robot = () => {
  const { scene } = useGLTF('/models/robot_arm.glb')

  const handTracking = useHandTracking()

  const ik = useIK({
    scene,
    wristRef: handTracking.wristRef,
    gripRef: handTracking.gripRef
  })

  const telemetry = useRobotTelemetry({
    handTracking,
    ik
  })

  const { setTelemetry } = useRobotTelemetryContext()

  useEffect(() => {
    setTelemetry(telemetry)
  }, [telemetry, setTelemetry])

  return (
    <mesh position={[0, -1.25, 0]}>
      <primitive object={scene} />
    </mesh>
  )
}

export default Robot
