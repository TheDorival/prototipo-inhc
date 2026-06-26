import { useStore } from '../store.jsx'
import { Card, Legenda, MapaSalas, PageHead } from '../ui.jsx'

export default function Mapa() {
  const { rooms } = useStore()
  return (
    <>
      <PageHead title="Mapa do campus" sub="Status atual de todas as salas." />
      <Card><Legenda /><MapaSalas rooms={rooms} /></Card>
    </>
  )
}
