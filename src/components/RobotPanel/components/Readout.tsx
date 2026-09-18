export default function Readout({ label, value, unit }: { label: string; value: string | number; unit: string }) {
  return (
    <div>
      <p className="text-micro text-muted-text">{label}</p>
      <p className="mt-1 text-xl font-bold text-primary-text">
        {value} <span className="text-micro">{unit}</span>
      </p>
    </div>
  )
}
