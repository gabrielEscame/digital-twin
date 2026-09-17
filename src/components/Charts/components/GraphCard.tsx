import type { ReactNode } from 'react'

export default function GraphCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex h-[251px] min-w-0 flex-col rounded-lg border border-[#d9d9e7] bg-[#FAFAFD]/30 px-5 py-3">
      <h2 className="text-sm text-[#8181A5]">{title}</h2>
      <div className="min-h-0 flex-1 pt-2">{children}</div>
    </section>
  )
}
