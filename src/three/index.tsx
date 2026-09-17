import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

import Robot from './Robot'

function Scene() {
  return (
    <Canvas
      camera={{
        position: [-6, 1, 0],
        fov: 45
      }}
    >
      <Environment preset="warehouse" environmentIntensity={0.7} />
      <Robot />
    </Canvas>
  )
}

export default Scene
