import { useRobotTelemetryContext } from '../../context/robotTelemetryContext'
import GraphCard from './components/GraphCard'
import HistoryChart from './components/HistoryChart'
import TimeDistribution from './components/TimeDistribution'

export default function Charts() {
  const { telemetry } = useRobotTelemetryContext()

  return (
    <div className="grid min-w-0 gap-dashboard-gap">
      <GraphCard title="Speed">
        <HistoryChart data={telemetry.speedHistory} dataKey="speed" color="var(--color-chart-speed)" />
      </GraphCard>
      <GraphCard title="Torque">
        <HistoryChart data={telemetry.torqueHistory} dataKey="torque" color="var(--color-chart-torque)" />
      </GraphCard>
      <GraphCard title="Time Distribution">
        <TimeDistribution distribution={telemetry.timeDistribution} />
      </GraphCard>
    </div>
  )
}
