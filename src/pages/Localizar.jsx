import { useState } from 'react'
import { useStore } from '../store.jsx'
import { Card, Tag, PageHead } from '../ui.jsx'

const OPCOES = [
  { v: 'SI-302', t: 'SI-302 — Fisica' }, { v: 'SI-104', t: 'SI-104 — Algoritmos' },
  { v: 'SI-210', t: 'SI-210 — Banco de Dados' }, { v: 'SI-999', t: 'SI-999 — (sem realocacao)' },
]

export default function Localizar() {
  const { localizar } = useStore()
  const [cod, setCod] = useState('SI-302')
  const [r, setR] = useState(undefined)

  return (
    <>
      <PageHead title="Localizar sala por disciplina" sub="Informe a disciplina para descobrir a sala atual e a rota ate ela." />
      <Card title="Disciplina" className="max-w-lg">
        <label className="lbl">Curso</label>
        <select className="input"><option>Sistemas de Informacao</option><option>Engenharia</option><option>Licenciaturas</option></select>
        <label className="lbl mt-3">Codigo da disciplina</label>
        <select className="input" value={cod} onChange={(e) => setCod(e.target.value)}>
          {OPCOES.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
        </select>
        <div className="mt-4"><button onClick={() => setR(localizar(cod))} className="btn btn-primary">Localizar sala</button></div>
      </Card>

      {r === null && <Card><div className="py-4 text-center text-sm text-muted">Nenhuma realocacao encontrada para {cod}. A aula segue na sala habitual.</div></Card>}
      {r && (
        <Card title="Sala encontrada">
          <div className="rounded-md border border-line p-3">
            <b className="text-sm font-semibold">{cod} <Tag status={r.status} /></b>
            <small className="mt-0.5 block text-xs text-muted">Sala atual: Bloco {r.bloco} · {r.id} · cap. {r.cap}</small>
            <div className="mt-1 text-[11px] text-muted">{r.equip.join(' · ')}</div>
          </div>
          <p className="mt-3 text-sm text-muted">Rota recomendada ate a sala {r.id}:</p>
          <div className="my-3 h-56 overflow-hidden rounded-md border border-line bg-subtle">
            <svg viewBox="0 0 320 210" className="h-full w-full">
              <rect x="18" y="160" width="46" height="32" rx="5" fill="#cf222e" opacity=".85" />
              <text x="41" y="153" fontSize="10" textAnchor="middle" fill="#656d76">Voce</text>
              <path d="M41 160 L41 95 L165 95 L165 45 L270 45" stroke="#0969da" strokeWidth="6" fill="none" strokeDasharray="9 7" strokeLinecap="round" />
              <circle cx="270" cy="45" r="12" fill="#1f883d" />
              <text x="270" y="26" fontSize="10" textAnchor="middle" fill="#656d76">{r.id}</text>
            </svg>
          </div>
          <p className="text-center text-sm text-muted">Tempo estimado de caminhada: 6 min</p>
        </Card>
      )}
    </>
  )
}
