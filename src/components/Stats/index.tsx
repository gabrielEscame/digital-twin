import { useRobotTelemetryContext } from '../../context/robotTelemetryContext'
import InfoCard from './components/InfoCard'

export default function Stats() {
  const { telemetry } = useRobotTelemetryContext()

  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:gap-dashboard-gap">
      <InfoCard title="Emergencies" value={telemetry.emergencies} description="0.3% up from last session" />
      <InfoCard title="Health score" value={telemetry.healthScore} description="72.09% up from last session" />
      <InfoCard title="Avg. Motor Speed" value={Math.round(telemetry.avgMotorSpeed)} description="Current session" />
    </div>
  )
}
