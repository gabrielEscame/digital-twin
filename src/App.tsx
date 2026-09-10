import { Canvas  } from '@react-three/fiber'
import { Grid, OrbitControls, Environment, useGLTF } from '@react-three/drei'

function App() {
  const { scene } =  useGLTF('/models/robot_arm.glb')
  
  return (
    <>
      <div className="w-screen h-screen fixed inset-0 z-20 bg-blue-900">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.05} />
        <directionalLight position={[3, 4, 5]} intensity={0.4} rotateY={Math.PI / 2} />

        <Grid infiniteGrid/>
        <OrbitControls makeDefault />
        <Environment preset="city" environmentIntensity={1.2} />
        <primitive object={scene} />

      </Canvas>
      </div>
    </>
  )
}

export default App
