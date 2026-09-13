import { useEffect, useRef } from 'react'
import { HandTracker } from '../tracking/HandTracker'

const useHandTracking = () => {
  const wristRef = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    let stream: MediaStream | null = null
    let tracker: HandTracker
    let videoFrameCallbackId: number

    const video = document.createElement('video')
    console.log(video.currentTime)

    const detect = (
      _now: DOMHighResTimeStamp,
      metadata: VideoFrameCallbackMetadata
    ) => {
      const result = tracker.detect(video, metadata.mediaTime * 1000)

      const wrist = result?.landmarks?.[0]?.[0]

      if (wrist) {
        wristRef.current = wrist
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

      video.requestVideoFrameCallback(detect)
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
    wristRef
  }
}

export default useHandTracking
