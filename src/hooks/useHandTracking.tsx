import { useEffect, useRef } from 'react'
import { HandTracker } from '../tracking/HandTracker'
import { type NormalizedLandmark } from '@mediapipe/tasks-vision'

const useHandTracking = () => {
  const wristRef = useRef({ x: 0, y: 0, z: 0 })
  const gripRef = useRef(0)

  useEffect(() => {
    let stream: MediaStream | null = null
    let tracker: HandTracker
    let videoFrameCallbackId: number

    const video = document.createElement('video')

    const detect = (
      _now: DOMHighResTimeStamp,
      metadata: VideoFrameCallbackMetadata
    ) => {
      const result = tracker.detect(video, metadata.mediaTime * 1000)

      const hand = result?.landmarks?.[0]

      if (hand) {
        wristRef.current = hand[0]
        gripRef.current = calculateGrip(hand)
      }

      videoFrameCallbackId = video.requestVideoFrameCallback(detect)
    }

    const start = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        }
      })

      video.srcObject = stream

      await video.play()

      tracker = new HandTracker()

      await tracker.initialize()

      videoFrameCallbackId = video.requestVideoFrameCallback(detect)
    }

    start()

    return () => {
      video.cancelVideoFrameCallback(videoFrameCallbackId)

      stream?.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }, [])

  return {
    wristRef,
    gripRef
  }
}

const calculateDistance = (
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number }
) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

const calculateGrip = (hand: NormalizedLandmark[]) => {
  const wrist = hand[0]
  const thumb = hand[4]
  const index = hand[8]
  const middleMcp = hand[9]

  const thumbIndexDistance = calculateDistance(thumb, index)

  const handSize = calculateDistance(wrist, middleMcp)

  const normalizedDistance = thumbIndexDistance / handSize

  const closedDistance = 0.3
  const openDistance = 1.0

  return Math.min(
    Math.max(
      (normalizedDistance - closedDistance) / (openDistance - closedDistance),
      0
    ),
    1
  )
}

export default useHandTracking
