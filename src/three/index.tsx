import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

import Robot from './Robot'

function Scene() {
  return (
    <div className="w-screen h-screen fixed inset-0 z-20 bg-gray-300">
      <Canvas
        camera={{
          position: [-6, 1, 0],
          fov: 45
        }}
      >
        <Environment preset="warehouse" environmentIntensity={0.7} />

        <Robot />
      </Canvas>
    </div>
  )
}

export default Scene
