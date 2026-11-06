import { useEffect } from 'react'
import Ink, { inkDuration } from '../Ink.jsx'

const DATE = () => {
  const d = new Date()
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

export default function Cover({ onDone, done }) {
  const date = [DATE()]
  const sujet = ['Sujet : pourquoi j’avais tort,', 'et pourquoi tu devrais quand', 'même me pardonner.']
  const eleve = ['Élève : Idy', 'Pour : toi']
  const t1 = 0.4 + inkDuration(date)
  const t2 = t1 + 0.9
  const t3 = t2 + inkDuration(sujet) + 0.3
  const t4 = t3 + inkDuration(eleve) + 0.3

  useEffect(() => {
    if (done) return
    const id = setTimeout(onDone, (t4 + 0.8) * 1000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="page-content">
      <Ink lines={date} delay={0.4} className="right" />
      <div className="row-gap" />
      <p className="red title-red draw-under" style={{ animationDelay: `${t1}s` }}>
        <span className="ink-line" style={{ animationDelay: `${t1}s`, animationDuration: '.6s' }}>Rédaction</span>
      </p>
      <Ink lines={sujet} delay={t2} />
      <div className="row-gap" />
      <Ink lines={eleve} delay={t3} />
      <div className="grow" />
      <p className="stamp-note" style={{ animationDelay: `${t4}s` }}>à lire jusqu&apos;au bout stp</p>
    </div>
  )
}
