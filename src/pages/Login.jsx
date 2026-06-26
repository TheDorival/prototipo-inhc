import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { firebaseConfigOk } from '../firebase.js'

export default function Login() {
  const { entrar } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setErro(''); setCarregando(true)
    const r = await entrar(f); setCarregando(false)
    if (r.ok) nav('/'); else setErro(r.erro)
  }
  const inp = 'w-full rounded-lg border border-borda px-3 py-2.5 text-sm'
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef1f6] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-borda bg-white p-7">
        <div className="mb-5 text-center">
          <b className="text-2xl text-azul">GEIE</b>
          <p className="mt-1 text-xs text-muted">Gestao de Espacos e Infraestrutura Escolar</p>
        </div>
        {!firebaseConfigOk && <div className="mb-4 rounded-lg border border-amarelo bg-amarelobg p-3 text-xs text-[#a87c00]">Configure o arquivo .env com as chaves do Firebase para habilitar o login.</div>}
        <form onSubmit={submit}>
          <label className="mb-1 block text-xs text-muted">E-mail</label>
          <input type="email" className={inp} value={f.email} onChange={set('email')} required />
          <label className="mb-1 mt-3 block text-xs text-muted">Senha</label>
          <input type="password" className={inp} value={f.senha} onChange={set('senha')} required />
          {erro && <div className="mt-3 rounded-lg bg-vermelhobg p-2.5 text-xs text-vermelho">{erro}</div>}
          <button disabled={carregando} className="mt-5 w-full rounded-lg bg-azul2 py-2.5 text-sm font-semibold text-white hover:bg-azul disabled:opacity-50">{carregando ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">Nao tem conta? <Link to="/cadastro" className="font-semibold text-azul2">Cadastre-se</Link></p>
      </div>
    </div>
  )
}
