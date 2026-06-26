import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { firebaseConfigOk } from '../firebase.js'

const PAPEIS = [
  { v: 'professor', t: 'Professor' },
  { v: 'aluno', t: 'Aluno' },
  { v: 'coordenador', t: 'Coordenador' },
]

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
  const inp = 'w-full rounded-lg border border-borda px-3 py-2.5 text-sm'
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef1f6] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-borda bg-white p-7">
        <div className="mb-5 text-center">
          <b className="text-2xl text-azul">Criar conta</b>
          <p className="mt-1 text-xs text-muted">GEIE - Gestao de Espacos Escolar</p>
        </div>
        {!firebaseConfigOk && <div className="mb-4 rounded-lg border border-amarelo bg-amarelobg p-3 text-xs text-[#a87c00]">Configure o arquivo .env com as chaves do Firebase para habilitar o cadastro.</div>}
        <form onSubmit={submit}>
          <label className="mb-1 block text-xs text-muted">Nome</label>
          <input className={inp} value={f.nome} onChange={set('nome')} required />
          <label className="mb-1 mt-3 block text-xs text-muted">E-mail</label>
          <input type="email" className={inp} value={f.email} onChange={set('email')} required />
          <label className="mb-1 mt-3 block text-xs text-muted">Senha (min. 6 caracteres)</label>
          <input type="password" className={inp} value={f.senha} onChange={set('senha')} required />
          <label className="mb-1 mt-3 block text-xs text-muted">Papel</label>
          <select className={inp} value={f.role} onChange={set('role')}>
            {PAPEIS.map((p) => <option key={p.v} value={p.v}>{p.t}</option>)}
          </select>
          {erro && <div className="mt-3 rounded-lg bg-vermelhobg p-2.5 text-xs text-vermelho">{erro}</div>}
          <button disabled={carregando} className="mt-5 w-full rounded-lg bg-verde py-2.5 text-sm font-semibold text-white disabled:opacity-50">{carregando ? 'Criando...' : 'Criar conta'}</button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">Ja tem conta? <Link to="/login" className="font-semibold text-azul2">Entrar</Link></p>
      </div>
    </div>
  )
}
