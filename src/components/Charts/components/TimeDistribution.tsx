import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { RobotTelemetry } from '../../../three/Robot/hooks/useRobotTelemetry'

const axisTick = { fontSize: 12, fill: '#8181A5' }

const states = [
  { name: 'Idle', key: 'idle', color: '#eab308' },
  { name: 'Running', key: 'running', color: '#4ade80' },
  { name: 'Gripping', key: 'gripping', color: '#60a5fa' }
] as const

export default function TimeDistribution({ distribution }: { distribution: RobotTelemetry['timeDistribution'] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {states.map(({ name, color }) => (
          <div key={name} className="flex items-center gap-1.5 text-[11px] text-[#8181A5]">
            <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} />
            {name}
          </div>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[{ name: 'Robot', ...distribution }]} layout="vertical" margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid vertical horizontal={false} strokeOpacity={0.4} />
            <XAxis type="number" domain={[0, 'auto']} axisLine={false} tickLine={false} tick={axisTick} />
            <YAxis type="category" dataKey="name" hide />
            {states.map(({ key, color }) => (
              <Bar key={key} dataKey={key} stackId="status" fill={color} barSize={32} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
