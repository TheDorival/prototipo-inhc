import { useState } from 'react'
import { useStore } from '../store.jsx'
import { Card, Tag } from '../ui.jsx'

const OPCOES = [
  { v: 'SI-302', t: 'SI-302 — Fisica' }, { v: 'SI-104', t: 'SI-104 — Algoritmos' },
  { v: 'SI-210', t: 'SI-210 — Banco de Dados' }, { v: 'SI-999', t: 'SI-999 — (sem realocacao)' },
]

export default function Localizar() {
  const { localizar } = useStore()
  const [cod, setCod] = useState('SI-302')
  const [r, setR] = useState(undefined)
  const inp = 'w-full rounded-lg border border-borda px-3 py-2 text-sm'

  return (
    <>
      <h2 className="mb-1.5 text-base font-semibold text-azul">Onde esta a minha aula?</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted">A sala habitual esta vazia e trancada para manutencao. Informe a disciplina para descobrir a sala atual e a rota ate ela.</p>
      <Card className="max-w-lg">
        <label className="mb-1 block text-xs text-muted">Curso</label>
        <select className={inp}><option>Sistemas de Informacao</option><option>Engenharia</option><option>Licenciaturas</option></select>
        <label className="mb-1 mt-3 block text-xs text-muted">Codigo da disciplina</label>
        <select className={inp} value={cod} onChange={(e) => setCod(e.target.value)}>
          {OPCOES.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
        </select>
        <div className="mt-4"><button onClick={() => setR(localizar(cod))} className="rounded-lg bg-azul2 px-4 py-2.5 text-sm font-semibold text-white hover:bg-azul">Localizar sala</button></div>
      </Card>

      {r === null && <Card><div className="p-4 text-center text-sm text-muted">Nenhuma realocacao encontrada para {cod}. A aula segue na sala habitual.</div></Card>}
      {r && (
        <Card title="Aula localizada">
          <div className="mb-2 rounded-lg border border-borda p-3.5">
            <b className="text-sm">{cod} <Tag status={r.status} /></b>
            <small className="mt-0.5 block text-xs text-muted">Realocada para: Bloco {r.bloco} · sala {r.id} · cap. {r.cap}</small>
            <div className="mt-1 text-[11px] text-muted">{r.equip.join(' · ')}</div>
          </div>
          <p className="mt-2.5 text-sm text-muted">Rota recomendada ate a sala {r.id}:</p>
          <div className="my-3 h-56 overflow-hidden rounded-lg bg-[#f0f2f5]">
            <svg viewBox="0 0 320 210" className="h-full w-full">
              <rect x="18" y="160" width="46" height="32" rx="5" fill="#cc3b3b" opacity=".85" />
              <text x="41" y="153" fontSize="10" textAnchor="middle" fill="#444">Voce</text>
              <path d="M41 160 L41 95 L165 95 L165 45 L270 45" stroke="#2f6fbf" strokeWidth="6" fill="none" strokeDasharray="9 7" strokeLinecap="round" />
              <circle cx="270" cy="45" r="12" fill="#2e9e5b" />
              <text x="270" y="26" fontSize="10" textAnchor="middle" fill="#444">{r.id}</text>
            </svg>
          </div>
          <p className="text-center text-sm text-muted">Tempo estimado: 6 min · chegada prevista 18:56</p>
        </Card>
      )}
    </>
  )
}
