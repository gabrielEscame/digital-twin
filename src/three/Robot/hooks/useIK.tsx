import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { IK, type JointConfig } from '../../utils/IK'

const useIK = ({ scene } : { scene: THREE.Group<THREE.Object3DEventMap>}) => {
  const ikSolver = useRef<IK | null>(null)

  const target = useRef<THREE.Object3D | null>(null)

  useEffect(() => {
    const shoulder = scene.getObjectByName('Shoulder') as THREE.Bone

    const upperArm = scene.getObjectByName('Upper_arm') as THREE.Bone

    const elbow = scene.getObjectByName('Elbow') as THREE.Bone

    const wrist = scene.getObjectByName('Wrist') as THREE.Bone

    const ikTarget = scene.getObjectByName('IK') as THREE.Object3D

    if (!shoulder || !upperArm || !elbow || !wrist || !ikTarget) {
      console.error('Could not find robot IK objects')

      return
    }

    /*
     * IMPORTANT:
     *
     * These axes are LOCAL bone axes.
     *
     * Based on our Blender tests, Upper_arm
     * and Elbow rotate correctly around X.
     *
     * We can adjust these individually later.
     */
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

    target.current = ikTarget

    ikSolver.current = new IK(joints, ikTarget)

    console.log('Constrained CCD IK initialized')

    console.log({
      shoulder,
      upperArm,
      elbow,
      wrist,
      ikTarget
    })
  }, [scene])

  const mouse = useRef({
    x: 0,
    y: 0
  })

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