export const Card = ({ title, children, className = '' }) => (
  <div className={'card mb-5 ' + className}>
    {title && <div className="border-b border-line px-5 py-3.5 text-sm font-semibold text-fg">{title}</div>}
    <div className="p-5">{children}</div>
  </div>
)

export const Kpi = ({ value, label }) => (
  <div className="card p-4">
    <b className="block text-2xl font-bold text-fg">{value}</b>
    <small className="text-xs text-muted">{label}</small>
  </div>
)

const tagColors = {
  livre: 'bg-okbg text-okfg',
  ocupada: 'bg-dangerbg text-danger',
  reservada: 'bg-warnbg text-warn',
}
export const Tag = ({ status }) => (
  <span className={'rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ' + (tagColors[status] || '')}>{status}</span>
)

export const roomBg = { livre: 'bg-okbg text-okfg', reservada: 'bg-warnbg text-warn', ocupada: 'bg-dangerbg text-danger' }

export const Legenda = () => (
  <div className="mb-4 flex gap-5 text-xs text-muted">
    <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-green" />Livre</span>
    <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-warn" />Reservada</span>
    <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-danger" />Ocupada</span>
  </div>
)

export function MapaSalas({ rooms, onSelect, selected }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {rooms.map((r) => {
        const clickable = onSelect && r.status === 'livre'
        return (
          <div key={r.id}
            onClick={() => clickable && onSelect(r.id)}
            className={[
              'rounded-xl p-3.5 text-center transition',
              roomBg[r.status],
              clickable ? 'cursor-pointer hover:brightness-95' : 'cursor-default',
              selected === r.id ? 'ring-2 ring-accent ring-offset-2' : '',
              r.status === 'ocupada' ? 'opacity-90' : '',
            ].join(' ')}>
            <b className="text-sm font-bold">{r.id}</b>
            <small className="mt-0.5 block text-[11px] opacity-80">{r.cat}</small>
            <small className="block text-[11px] opacity-80">cap. {r.cap}</small>
          </div>
        )
      })}
    </div>
  )
}

export const PageHead = ({ title, sub }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-fg">{title}</h2>
    {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
  </div>
)
