import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const axisTick = { fontSize: 12, fill: '#8181A5' }

export default function HistoryChart({ data, dataKey, color }: {
  data: { time: string; speed?: number; torque?: number }[]
  dataKey: 'speed' | 'torque'
  color: string
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <CartesianGrid strokeOpacity={0.4} />
        <XAxis dataKey="time" interval="preserveStartEnd" axisLine={false} tickLine={false} tick={axisTick} />
        <YAxis width={26} domain={[0, 'auto']} axisLine={false} tickLine={false} tick={axisTick} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}
