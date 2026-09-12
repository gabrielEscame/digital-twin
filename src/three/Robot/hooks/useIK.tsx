import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { IK, type JointConfig } from '../../utils/IK'

type GLTFScene = THREE.Group<THREE.Object3DEventMap>

interface RigBones {
  shoulder: THREE.Bone
  upperArm: THREE.Bone
  elbow: THREE.Bone
  wrist: THREE.Bone
  ikTarget: THREE.Object3D
}

const useIK = (scene: GLTFScene) => {
  const ikSolver = useRef<IK | null>(null)

  const target = useRef<THREE.Object3D | null>(null)
  const mouse = useRef({
    x: 0,
    y: 0
  })

  const getRigBones = (scene: GLTFScene): RigBones | null => {
    const shoulder = scene.getObjectByName('Shoulder') as THREE.Bone
    const upperArm = scene.getObjectByName('Upper_arm') as THREE.Bone
    const elbow = scene.getObjectByName('Elbow') as THREE.Bone
    const wrist = scene.getObjectByName('Wrist') as THREE.Bone
    const ikTarget = scene.getObjectByName('IK') as THREE.Object3D

    if (!shoulder || !upperArm || !elbow || !wrist || !ikTarget) {
      console.error('Could not find robot IK objects')

      return null
    }

    return {
      shoulder,
      upperArm,
      elbow,
      wrist,
      ikTarget
    }
  }

  const getJointsConfig = (rigBones: RigBones) => {
    const { shoulder, upperArm, elbow, wrist } = rigBones

    const joints: JointConfig[] = [
      {
        bone: shoulder,

        axis: new THREE.Vector3(0, 1, 0),

        min: THREE.MathUtils.degToRad(-180),
        max: THREE.MathUtils.degToRad(180),

        angle: 0
      },

      {
        bone: upperArm,

        axis: new THREE.Vector3(1, 0, 0),

        min: THREE.MathUtils.degToRad(-100),
        max: THREE.MathUtils.degToRad(90),

        angle: 0
      },

      {
        bone: elbow,

        axis: new THREE.Vector3(1, 0, 0),

        min: THREE.MathUtils.degToRad(-90),
        max: THREE.MathUtils.degToRad(90),

        angle: 0
      },

      {
        bone: wrist,

        axis: new THREE.Vector3(0, 0, 1),

        min: THREE.MathUtils.degToRad(-90),
        max: THREE.MathUtils.degToRad(90),

        angle: 0
      }
    ]

    return joints
  }

  useEffect(() => {
    if (!scene) return

    const rigBones = getRigBones(scene)

    if (!rigBones) return

    const joints = getJointsConfig(rigBones)

    const { ikTarget } = rigBones
    target.current = ikTarget

    ikSolver.current = new IK(joints, ikTarget)

    console.log('Constrained CCD IK initialized')
  }, [scene])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX / window.innerWidth
      mouse.current.y = event.clientY / window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame(() => {
    if (!target.current) return

    const x = THREE.MathUtils.lerp(-4, 4, mouse.current.x)

    const y = THREE.MathUtils.lerp(6, -6, mouse.current.y)

    target.current.position.set(-3, y, x)

    ikSolver.current?.solve()
  })
}

export default useIK
