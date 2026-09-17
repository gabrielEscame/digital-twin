export default function InfoCard({ title, value, description }: {
  title: string
  value: number
  description: string
}) {
  return (
    <div className="flex min-h-[116px] min-w-0 flex-col justify-between rounded-lg border border-[#d9d9e7] bg-[#FAFAFD]/30 px-5 py-3">
      <h2 className="text-sm text-[#8181A5]">{title}</h2>
      <p className="text-xl font-bold text-[#1C1D21]">{value}</p>
      <p className="text-sm text-[#8181A5]">{description}</p>
    </div>
  )
}
