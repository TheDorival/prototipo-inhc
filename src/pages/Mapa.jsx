import { useStore } from '../store.jsx'
import { Card, Legenda, MapaSalas } from '../ui.jsx'

export default function Mapa() {
  const { rooms } = useStore()
  return (
    <>
      <h2 className="mb-1.5 text-base font-semibold text-azul">Mapa do campus</h2>
      <p className="mb-4 text-sm text-muted">Status atual de todas as salas. Verde = livre, amarelo = reservada, vermelho = ocupada.</p>
      <Card><Legenda /><MapaSalas rooms={rooms} /></Card>
    </>
  )
}
