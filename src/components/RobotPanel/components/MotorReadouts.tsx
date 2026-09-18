import { useRobotTelemetryContext } from 'context/robotTelemetryContext'
import Readout from './Readout'

const motorAxes = [
  { label: 'A', jointIndex: 2 },
  { label: 'B', jointIndex: 1 },
  { label: 'C', jointIndex: 0 }
] as const

export default function MotorReadouts() {
  const { telemetry } = useRobotTelemetryContext()

  return (
    <>
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 grid gap-4 md:bottom-auto md:left-8 md:top-1/2 md:-translate-y-1/2 md:gap-6">
        {motorAxes.map(({ label, jointIndex }) => (
          <div key={label}>
            <p className="text-micro text-muted-text">Axis {label} Motor</p>
            <p className="mt-1 text-xl font-bold text-primary-text">
              {telemetry.temperatures[jointIndex].toFixed(1)} <span className="text-micro">°C</span>
              <br />
              {Math.round(telemetry.jointRpm[jointIndex])} <span className="text-micro">rpm</span>
            </p>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 grid gap-4 text-right md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:gap-6 md:text-left">
        <Readout label="Fan speed" value={Math.round(telemetry.fanSpeed)} unit="rpm" />
        <Readout label="CPU temp" value={telemetry.cpuTemp.toFixed(1)} unit="°C" />
        <Readout label="Mainboard temp" value={telemetry.mainboardTemp.toFixed(1)} unit="°C" />
      </div>
    </>
  )
}
