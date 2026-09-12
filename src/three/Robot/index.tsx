import { useGLTF } from '@react-three/drei'
import useIK from './hooks/useIK'

const Robot = () => {
  const { scene } = useGLTF('/models/robot_arm.glb')

  useIK(scene)
  return <primitive object={scene} />
}

export default Robot
