import type { ReactNode } from 'react'

export default function GraphCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex h-[251px] min-w-0 flex-col rounded-lg border border-panel-border bg-surface/30 px-5 py-3">
      <h2 className="text-sm text-muted-text">{title}</h2>
      <div className="min-h-0 flex-1 pt-2">{children}</div>
    </section>
  )
}
