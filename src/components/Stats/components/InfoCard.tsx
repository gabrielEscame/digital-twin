export default function InfoCard({ title, value, description }: {
  title: string
  value: number
  description: string
}) {
  return (
    <div className="flex min-h-[116px] min-w-0 flex-col justify-between rounded-lg border border-panel-border bg-surface/30 px-5 py-3">
      <h2 className="text-sm text-muted-text">{title}</h2>
      <p className="text-xl font-bold text-primary-text">{value}</p>
      <p className="text-sm text-muted-text">{description}</p>
    </div>
  )
}
