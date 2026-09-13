import {
  FilesetResolver,
  HandLandmarker
} from '@mediapipe/tasks-vision'

export class HandTracker {
  private handLandmarker: HandLandmarker | null = null

  async initialize() {
    const vision =
      await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      )

    this.handLandmarker =
      await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              '/tracking/hand_landmarker.task'
          },
          runningMode: 'VIDEO',
          numHands: 1,
        }
      )

    console.log('MediaPipe initialized')
  }

  detect(
    video: HTMLVideoElement,
    timestamp: number
  ) {
    if (!this.handLandmarker) return null

    return this.handLandmarker.detectForVideo(
      video,
      timestamp
    )
  }
}