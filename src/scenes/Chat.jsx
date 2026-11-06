import { useEffect, useRef, useState } from 'react'
import { pop } from '../audio.js'

// t = pause avant le message (ms). gap = petit espace avant (nouvelle "salve").
const MSGS = [
  { text: 'salut', t: 700 },
  { text: 'je sais t’as pas envie de me parler', t: 1300 },
  { text: 'lis juste. après tu fais ce que tu veux', t: 1500 },
  { text: 'j’ai réfléchi toute la nuit', t: 2200, gap: true },
  { text: 'bon. 2h', t: 1100 },
  { text: 'mais 2h c’est beaucoup pour moi tu sais', t: 1300 },
  { text: 't’avais raison', t: 2600, gap: true },
  { text: 'voilà je l’ai écrit. c’est sur internet maintenant, je peux plus nier', t: 1700 },
  { text: 'je t’ai écrit un truc. comme à l’école', t: 1600, gap: true },
]

export default function Chat({ onDone, done }) {
  const [shown, setShown] = useState(done ? MSGS.length : 0)
  const [typing, setTyping] = useState(false)
  const list = useRef(null)

  useEffect(() => {
    if (shown >= MSGS.length) { setTyping(false); onDone(); return }
    setTyping(true)
    const t = setTimeout(() => { setTyping(false); setShown((s) => s + 1); pop() }, MSGS[shown].t)
    return () => clearTimeout(t)
  }, [shown])

  useEffect(() => {
    const el = list.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown, typing])

  return (
    <div className="chat">
      <div className="chat-top">
        <span className="chat-av" aria-hidden="true">I</span>
        <span className="chat-name">Idy</span>
      </div>
      <div className="chat-list" ref={list}>
        <p className="chat-day">Aujourd&apos;hui</p>
        {MSGS.slice(0, shown).map((m, k) => (
          <p key={k} className={`bubble ${m.gap ? 'gap' : ''}`}>{m.text}</p>
        ))}
        {typing && <p className="bubble typing" aria-label="Idy est en train d'écrire"><i /><i /><i /></p>}
      </div>
      <div className="chat-input" aria-hidden="true"><span>Message</span></div>
    </div>
  )
}
