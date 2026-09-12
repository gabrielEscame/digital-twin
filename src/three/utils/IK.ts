import * as THREE from 'three'

export type JointConfig = {
  bone: THREE.Bone

  // Rotation axis in the joint's parent space.
  axis: THREE.Vector3

  // Joint limits in radians.
  min: number
  max: number

  // Current angle relative to the starting pose.
  angle: number
}

export class IK {
  constructor(
    joints: JointConfig[],
    target: THREE.Object3D
  ) {
    this.joints = joints
    this.target = target
  }

  private joints: JointConfig[]
  private target: THREE.Object3D

  private iterations = 5
  private tolerance = 0.01

  private jointPosition = new THREE.Vector3()
  private effectorPosition = new THREE.Vector3()
  private targetPosition = new THREE.Vector3()

  private toEffector = new THREE.Vector3()
  private toTarget = new THREE.Vector3()

  private projectedEffector = new THREE.Vector3()
  private projectedTarget = new THREE.Vector3()

  private worldAxis = new THREE.Vector3()
  private cross = new THREE.Vector3()

  private rotationDelta = new THREE.Quaternion()
  private currentWorldRotation = new THREE.Quaternion()
  private newWorldRotation = new THREE.Quaternion()

  private parentWorldRotation = new THREE.Quaternion()
  private inverseParentRotation = new THREE.Quaternion()

  solve() {
    this.target.getWorldPosition(
      this.targetPosition
    )

    const effector = this.getEffector()

    for (
      let iteration = 0;
      iteration < this.iterations;
      iteration++
    ) {
      if (this.isTargetReached(effector)) {
        break
      }

      this.solveIteration(effector)
    }
  }

  private solveIteration(
    effector: THREE.Bone
  ) {
    for (
      let i = this.joints.length - 2;
      i >= 0;
      i--
    ) {
      const jointConfig = this.joints[i]

      const deltaAngle =
        this.calculateDeltaAngle(
          jointConfig
        )

      if (deltaAngle === null) {
        continue
      }

      const actualDelta =
        this.applyJointLimits(
          jointConfig,
          deltaAngle
        )

      if (
        Math.abs(actualDelta) < 0.00001
      ) {
        continue
      }

      this.applyRotation(
        jointConfig.bone,
        actualDelta
      )

      if (this.isTargetReached(effector)) {
        break
      }
    }
  }

  private getEffector(): THREE.Bone {
    return this.joints[
      this.joints.length - 1
    ].bone
  }

  private isTargetReached(
    effector: THREE.Bone
  ): boolean {
    effector.getWorldPosition(
      this.effectorPosition
    )

    return (
      this.effectorPosition.distanceTo(
        this.targetPosition
      ) < this.tolerance
    )
  }

  private calculateDeltaAngle(
    jointConfig: JointConfig,
  ): number | null {
    const joint = jointConfig.bone

    /*
     * ------------------------------------------------
     * Get joint position and current world rotation.
     * ------------------------------------------------
     */

    joint.getWorldPosition(
      this.jointPosition
    )

    joint.getWorldQuaternion(
      this.currentWorldRotation
    )

    /*
     * ------------------------------------------------
     * Calculate the joint's allowed axis
     * in WORLD SPACE.
     * ------------------------------------------------
     */

    this.getWorldAxis(
      joint,
      jointConfig.axis
    )

    /*
     * ------------------------------------------------
     * Calculate:
     *
     * joint → effector
     * joint → target
     * ------------------------------------------------
     */

    this.toEffector
      .copy(this.effectorPosition)
      .sub(this.jointPosition)

    this.toTarget
      .copy(this.targetPosition)
      .sub(this.jointPosition)

    if (
      this.toEffector.lengthSq() <
        0.000001 ||
      this.toTarget.lengthSq() <
        0.000001
    ) {
      return null
    }

    this.toEffector.normalize()
    this.toTarget.normalize()

    /*
     * ------------------------------------------------
     * Project both vectors onto the plane
     * perpendicular to the joint axis.
     * ------------------------------------------------
     */

    this.projectOntoJointPlane(
      this.toEffector,
      this.projectedEffector
    )

    this.projectOntoJointPlane(
      this.toTarget,
      this.projectedTarget
    )

    if (
      this.projectedEffector.lengthSq() <
        0.000001 ||
      this.projectedTarget.lengthSq() <
        0.000001
    ) {
      return null
    }

    this.projectedEffector.normalize()
    this.projectedTarget.normalize()

    /*
     * ------------------------------------------------
     * Calculate signed rotation angle.
     * ------------------------------------------------
     */

    this.cross.crossVectors(
      this.projectedEffector,
      this.projectedTarget
    )

    return Math.atan2(
      this.worldAxis.dot(this.cross),
      this.projectedEffector.dot(
        this.projectedTarget
      )
    )
  }

  private getWorldAxis(
    joint: THREE.Bone,
    localAxis: THREE.Vector3
  ) {
    this.worldAxis.copy(localAxis)

    if (joint.parent) {
      joint.parent.getWorldQuaternion(
        this.parentWorldRotation
      )

      this.worldAxis
        .applyQuaternion(
          this.parentWorldRotation
        )
        .normalize()
    } else {
      this.worldAxis.normalize()
    }
  }

  private projectOntoJointPlane(
    vector: THREE.Vector3,
    result: THREE.Vector3
  ) {
    result
      .copy(vector)
      .addScaledVector(
        this.worldAxis,
        -vector.dot(this.worldAxis)
      )
  }

  private applyJointLimits(
    jointConfig: JointConfig,
    deltaAngle: number
  ): number {
    const requestedAngle =
      jointConfig.angle + deltaAngle

    const clampedAngle =
      THREE.MathUtils.clamp(
        requestedAngle,
        jointConfig.min,
        jointConfig.max
      )

    const actualDelta =
      clampedAngle - jointConfig.angle

    jointConfig.angle = clampedAngle

    return actualDelta
  }

  private applyRotation(
    joint: THREE.Bone,
    deltaAngle: number
  ) {
    /*
     * Create WORLD rotation delta.
     */
    this.rotationDelta.setFromAxisAngle(
      this.worldAxis,
      deltaAngle
    )

    /*
     * Apply delta to current WORLD rotation.
     */
    this.newWorldRotation
      .copy(this.rotationDelta)
      .multiply(this.currentWorldRotation)

    /*
     * Convert WORLD rotation back to LOCAL.
     */
    if (joint.parent) {
      joint.parent.getWorldQuaternion(
        this.parentWorldRotation
      )

      this.inverseParentRotation
        .copy(this.parentWorldRotation)
        .invert()

      joint.quaternion
        .copy(this.inverseParentRotation)
        .multiply(this.newWorldRotation)
        .normalize()
    } else {
      joint.quaternion
        .copy(this.newWorldRotation)
        .normalize()
    }

    /*
     * Update hierarchy so subsequent
     * CCD calculations use the new pose.
     */
    joint.updateMatrixWorld(true)
  }
}