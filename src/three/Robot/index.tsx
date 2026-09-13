import { useGLTF } from '@react-three/drei'
import useIK from './hooks/useIK'
import useHandTracking from '../../hooks/useHandTracking'

const Robot = () => {
  const { scene } = useGLTF('/models/robot_arm.glb')
  const { wristRef, gripRef } = useHandTracking()
  useIK({scene, wristRef, gripRef })

  return (
    <mesh position={[0, -1.25, 0]}>
      <primitive object={scene} />
    </mesh>
  )
}

export default Robot
