import { useEffect, useRef, useState } from 'react'

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

// Écran verrouillé sobre : balayer vers le haut, ou toucher la notification.
export default function Lock({ unlock }) {
  const [now, setNow] = useState(new Date())
  const [dy, setDy] = useState(0)
  const start = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])

  const down = (e) => { start.current = e.clientY; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const move = (e) => { if (start.current != null) setDy(Math.min(0, e.clientY - start.current)) }
  const up = () => {
    if (start.current == null) return
    start.current = null
    if (dy < -90) { setDy(-window.innerHeight); setTimeout(unlock, 250) } else setDy(0)
  }

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')

  return (
    <div
      className="lock"
      data-interactive
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{ transform: `translateY(${dy}px)`, transition: start.current != null ? 'none' : 'transform .35s cubic-bezier(.2,.8,.2,1)' }}
    >
      <p className="lock-date">{DAYS[now.getDay()]} {now.getDate()} {MONTHS[now.getMonth()]}</p>
      <p className="lock-time">{hh}:{mm}</p>
      <div className="grow" />
      <button type="button" className="notif" onClick={(e) => { e.stopPropagation(); unlock() }}>
        <span className="notif-av" aria-hidden="true">I</span>
        <span className="notif-body">
          <span className="notif-head"><b>Idy</b><span>à l&apos;instant</span></span>
          <span className="notif-text">ouvre stp. 2 minutes. après tu me boudes si tu veux</span>
        </span>
      </button>
      <div className="grow" />
      <p className="lock-hint">Balaie vers le haut pour ouvrir</p>
      <span className="home-bar" aria-hidden="true" />
    </div>
  )
}
