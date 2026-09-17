export default function Readout({ label, value, unit }: { label: string; value: string | number; unit: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#8181A5]">{label}</p>
      <p className="mt-1 text-xl font-bold text-[#1C1D21]">
        {value} <span className="text-[10px]">{unit}</span>
      </p>
    </div>
  )
}
