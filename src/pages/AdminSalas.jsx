import { useState } from 'react'
import { useStore } from '../store.jsx'
import { EQUIP, CATEGORIAS } from '../data.js'
import { Card, Tag, PageHead } from '../ui.jsx'

const vazia = { id: '', bloco: '', cap: 30, cat: CATEGORIAS[0], equip: [], status: 'livre', sensor: 'vazio' }

export default function AdminSalas() {
  const { rooms, addRoom, updateRoom, removeRoom } = useStore()
  const [f, setF] = useState(vazia)
  const [editId, setEditId] = useState(null)
  const [erro, setErro] = useState('')
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const toggleEquip = (eq) => setF((s) => ({ ...s, equip: s.equip.includes(eq) ? s.equip.filter((x) => x !== eq) : [...s.equip, eq] }))

  const editar = (r) => { setEditId(r.id); setF({ ...r }); setErro('') }
  const limpar = () => { setEditId(null); setF(vazia); setErro('') }

  const salvar = async () => {
    setErro('')
    if (!f.id.trim() || !f.bloco.trim()) { setErro('Informe ao menos ID e bloco.'); return }
    const payload = { ...f, cap: Number(f.cap) || 0 }
    const r = editId ? await updateRoom(editId, { bloco: payload.bloco, cap: payload.cap, cat: payload.cat, equip: payload.equip, status: payload.status, sensor: payload.sensor }) : await addRoom(payload)
    if (r.ok) limpar(); else setErro(r.erro)
  }
  const excluir = (id) => { if (window.confirm(`Remover a sala ${id}?`)) removeRoom(id) }

  const th = 'border-b border-line px-3 py-2.5 text-left text-[11px] font-semibold uppercase text-muted'
  const td = 'border-b border-line px-3 py-2.5'
  return (
    <>
      <PageHead title="Salas (administracao)" sub="Cadastre, edite e remova as salas reais do campus. Somente coordenadores." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card title={editId ? `Editar sala — ${editId}` : 'Nova sala'}>
            <label className="lbl">ID da sala</label>
            <input className="input disabled:bg-subtle" value={f.id} onChange={set('id')} disabled={!!editId} placeholder="Ex: C-204" />
            <label className="lbl mt-3">Bloco</label>
            <input className="input" value={f.bloco} onChange={set('bloco')} placeholder="Ex: C" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="lbl">Capacidade</label><input type="number" min="0" className="input" value={f.cap} onChange={set('cap')} /></div>
              <div>
                <label className="lbl">Status</label>
                <select className="input" value={f.status} onChange={set('status')}>
                  <option value="livre">livre</option><option value="reservada">reservada</option><option value="ocupada">ocupada</option>
                </select>
              </div>
            </div>
            <label className="lbl mt-3">Categoria</label>
            <select className="input" value={f.cat} onChange={set('cat')}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select>
            <label className="lbl mt-3">Equipamentos</label>
            <div className="flex flex-wrap gap-2">
              {EQUIP.map((eq) => (
                <button key={eq} type="button" onClick={() => toggleEquip(eq)}
                  className={'rounded-full border px-3 py-1 text-xs font-semibold ' + (f.equip.includes(eq) ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-white text-fg hover:bg-subtle')}>{eq}</button>
              ))}
            </div>
            {erro && <div className="mt-3 rounded-lg border border-danger/30 bg-dangerbg p-2.5 text-sm text-danger">{erro}</div>}
            <div className="mt-4 flex gap-2.5">
              <button onClick={salvar} className="btn btn-primary">{editId ? 'Salvar alteracoes' : 'Cadastrar sala'}</button>
              {editId && <button onClick={limpar} className="btn">Cancelar</button>}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card title={`Salas cadastradas (${rooms.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr>{['Sala', 'Bloco', 'Cap.', 'Categoria', 'Status', 'Acoes'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {rooms.length === 0 && <tr><td className={td + ' text-center text-muted'} colSpan={6}>Nenhuma sala cadastrada.</td></tr>}
                  {rooms.map((r) => (
                    <tr key={r.id}>
                      <td className={td}><b>{r.id}</b></td>
                      <td className={td}>{r.bloco}</td>
                      <td className={td}>{r.cap}</td>
                      <td className={td}>{r.cat}</td>
                      <td className={td}><Tag status={r.status} /></td>
                      <td className={td}>
                        <div className="flex gap-2">
                          <button onClick={() => editar(r)} className="text-xs font-semibold text-accent hover:underline">Editar</button>
                          <button onClick={() => excluir(r.id)} className="text-xs font-semibold text-danger hover:underline">Remover</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
