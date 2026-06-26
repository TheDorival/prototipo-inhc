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
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-subtle px-4">
      <div className="mb-4 text-center">
        <b className="text-2xl font-semibold text-fg">GEIE</b>
        <p className="mt-1 text-xs text-muted">Gestao de Espacos e Infraestrutura Escolar</p>
      </div>
      <div className="w-full max-w-xs">
        {!firebaseConfigOk && <div className="mb-3 rounded-md border border-warn/40 bg-warnbg p-3 text-xs text-warn">Configure o arquivo .env com as chaves do Firebase.</div>}
        <div className="card p-4">
          <form onSubmit={submit}>
            <label className="lbl">E-mail</label>
            <input type="email" className="input" value={f.email} onChange={set('email')} required />
            <label className="lbl mt-3">Senha</label>
            <input type="password" className="input" value={f.senha} onChange={set('senha')} required />
            {erro && <div className="mt-3 rounded-md border border-danger/30 bg-dangerbg p-2.5 text-xs text-danger">{erro}</div>}
            <button disabled={carregando} className="btn btn-primary mt-4 w-full">{carregando ? 'Entrando...' : 'Entrar'}</button>
          </form>
        </div>
        <div className="mt-3 rounded-md border border-line bg-canvas p-3 text-center text-sm text-muted">
          Nao tem conta? <Link to="/cadastro" className="font-semibold text-accent hover:underline">Cadastre-se</Link>
        </div>
      </div>
    </div>
  )
}
