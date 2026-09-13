import { Canvas } from '@react-three/fiber'
import { Grid, Environment } from '@react-three/drei'

import Robot from './Robot'

function Scene() {
  return (
    <div className="w-screen h-screen fixed inset-0 z-20 bg-blue-950">
      <Canvas
        camera={{
          position: [-5, 3, 0],
          fov: 60
        }}
      >
        <Grid infiniteGrid />

        <Environment preset="warehouse" environmentIntensity={0.7} />

        <Robot />
      </Canvas>
    </div>
  )
}

export default Scene
