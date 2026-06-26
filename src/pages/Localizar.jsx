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
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card title="Disciplina">
            <label className="lbl">Curso</label>
            <select className="input"><option>Sistemas de Informacao</option><option>Engenharia</option><option>Licenciaturas</option></select>
            <label className="lbl mt-3">Codigo da disciplina</label>
            <select className="input" value={cod} onChange={(e) => setCod(e.target.value)}>
              {OPCOES.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
            </select>
            <div className="mt-4"><button onClick={() => setR(localizar(cod))} className="btn btn-primary w-full">Localizar sala</button></div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {r === undefined && (
            <div className="card flex h-full min-h-[260px] flex-col items-center justify-center p-8 text-center">
              <span className="mb-2 text-3xl">📍</span>
              <p className="text-sm text-muted">Selecione uma disciplina e clique em <b className="text-fg">Localizar sala</b> para ver a sala atual e a rota.</p>
            </div>
          )}
          {r === null && (
            <div className="card flex h-full min-h-[260px] items-center justify-center p-8 text-center text-sm text-muted">
              Nenhuma realocacao encontrada para {cod}. A aula segue na sala habitual.
            </div>
          )}
          {r && (
            <Card title="Sala encontrada">
              <div className="rounded-lg border border-line p-3.5">
                <b className="text-sm font-semibold">{cod} <Tag status={r.status} /></b>
                <small className="mt-0.5 block text-xs text-muted">Sala atual: Bloco {r.bloco} · {r.id} · cap. {r.cap}</small>
                <div className="mt-1 text-[11px] text-muted">{r.equip.join(' · ')}</div>
              </div>
              <p className="mt-4 mb-1 text-sm font-medium text-fg">Rota recomendada ate a sala {r.id}</p>
              <div className="mx-auto h-44 max-w-md overflow-hidden rounded-lg border border-line bg-subtle">
                <svg viewBox="0 0 320 200" className="h-full w-full">
                  <rect x="18" y="150" width="46" height="32" rx="6" fill="#dc2626" opacity=".9" />
                  <text x="41" y="143" fontSize="11" textAnchor="middle" fill="#64748b">Voce</text>
                  <path d="M41 150 L41 90 L165 90 L165 45 L270 45" stroke="#4f46e5" strokeWidth="6" fill="none" strokeDasharray="9 7" strokeLinecap="round" />
                  <circle cx="270" cy="45" r="13" fill="#16a34a" />
                  <text x="270" y="24" fontSize="11" textAnchor="middle" fill="#64748b">{r.id}</text>
                </svg>
              </div>
              <p className="mt-2 text-center text-sm text-muted">Tempo estimado de caminhada: 6 min</p>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
