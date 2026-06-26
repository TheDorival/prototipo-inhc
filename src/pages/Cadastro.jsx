import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { firebaseConfigOk } from '../firebase.js'

const PAPEIS = [{ v: 'professor', t: 'Professor' }, { v: 'aluno', t: 'Aluno' }, { v: 'coordenador', t: 'Coordenador' }]

export default function Cadastro() {
  const { cadastrar } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ nome: '', email: '', senha: '', role: 'professor' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault(); setErro(''); setCarregando(true)
    const r = await cadastrar(f); setCarregando(false)
    if (r.ok) nav('/'); else setErro(r.erro)
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-subtle px-4 py-8">
      <div className="mb-5 flex flex-col items-center text-center">
        <span className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-base font-bold text-white">GE</span>
        <b className="text-xl font-bold text-fg">Criar conta</b>
        <p className="mt-1 text-xs text-muted">GEIE - Gestao de Espacos Escolar</p>
      </div>
      <div className="w-full max-w-xs">
        {!firebaseConfigOk && <div className="mb-3 rounded-md border border-warn/40 bg-warnbg p-3 text-xs text-warn">Configure o arquivo .env com as chaves do Firebase.</div>}
        <div className="card p-4">
          <form onSubmit={submit}>
            <label className="lbl">Nome</label>
            <input className="input" value={f.nome} onChange={set('nome')} required />
            <label className="lbl mt-3">E-mail</label>
            <input type="email" className="input" value={f.email} onChange={set('email')} required />
            <label className="lbl mt-3">Senha (min. 6 caracteres)</label>
            <input type="password" className="input" value={f.senha} onChange={set('senha')} required />
            <label className="lbl mt-3">Papel</label>
            <select className="input" value={f.role} onChange={set('role')}>
              {PAPEIS.map((p) => <option key={p.v} value={p.v}>{p.t}</option>)}
            </select>
            {erro && <div className="mt-3 rounded-md border border-danger/30 bg-dangerbg p-2.5 text-xs text-danger">{erro}</div>}
            <button disabled={carregando} className="btn btn-primary mt-4 w-full">{carregando ? 'Criando...' : 'Criar conta'}</button>
          </form>
        </div>
        <div className="mt-3 rounded-md border border-line bg-canvas p-3 text-center text-sm text-muted">
          Ja tem conta? <Link to="/login" className="font-semibold text-accent hover:underline">Entrar</Link>
        </div>
      </div>
    </div>
  )
}
