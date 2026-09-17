import { useRobotTelemetryContext } from '../../context/robotTelemetryContext'
import GraphCard from './components/GraphCard'
import HistoryChart from './components/HistoryChart'
import TimeDistribution from './components/TimeDistribution'

export default function Charts() {
  const { telemetry } = useRobotTelemetryContext()

  return (
    <div className="grid min-w-0 gap-7">
      <GraphCard title="Speed">
        <HistoryChart data={telemetry.speedHistory} dataKey="speed" color="#a78bfa" />
      </GraphCard>
      <GraphCard title="Torque">
        <HistoryChart data={telemetry.torqueHistory} dataKey="torque" color="#6DA4E4" />
      </GraphCard>
      <GraphCard title="Time Distribution">
        <TimeDistribution distribution={telemetry.timeDistribution} />
      </GraphCard>
    </div>
  )
}
