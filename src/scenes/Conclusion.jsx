import { useEffect, useRef, useState } from 'react'
import Ink from '../Ink.jsx'
import { chime } from '../audio.js'

const CHOICES = [
  { id: 'oui', label: 'oui', yes: true },
  { id: 'thiakry', label: 'oui, mais tu me dois un thiakry', yes: true },
  { id: 'temps', label: 'laisse-moi réfléchir', yes: false },
]

// Petits cœurs dessinés au stylo rouge autour de la réponse
const HEARTS = [
  { x: 84, y: -34, s: 30, r: 14 }, { x: 94, y: 12, s: 22, r: -10 }, { x: -22, y: -6, s: 26, r: -16 },
  { x: 62, y: 84, s: 20, r: 10 },
]

function Signature() {
  const ref = useRef(null)
  const drawing = useRef(false)
  useEffect(() => {
    const c = ref.current
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    c.width = c.offsetWidth * dpr
    c.height = c.offsetHeight * dpr
    const g = c.getContext('2d')
    g.scale(dpr, dpr)
    g.strokeStyle = '#1f3a8a'; g.lineWidth = 2.4; g.lineCap = 'round'; g.lineJoin = 'round'
  }, [])
  const pos = (e) => { const r = ref.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
  const down = (e) => { e.stopPropagation(); drawing.current = true; ref.current.setPointerCapture?.(e.pointerId); const g = ref.current.getContext('2d'); g.beginPath(); g.moveTo(...pos(e)) }
  const move = (e) => { if (!drawing.current) return; const g = ref.current.getContext('2d'); g.lineTo(...pos(e)); g.stroke() }
  const up = () => { drawing.current = false }
  return (
    <div className="sign" data-interactive onClick={(e) => e.stopPropagation()}>
      <span>ta signature :</span>
      <canvas ref={ref} aria-label="Zone de signature" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
    </div>
  )
}

export default function Conclusion({ onDone, restart }) {
  const [pick, setPick] = useState(null)
  const choice = CHOICES.find((c) => c.id === pick)

  const choose = (c) => {
    if (pick) return
    setPick(c.id)
    onDone()
    if (c.yes) [659.25, 783.99, 987.77, 1318.5].forEach((f, j) => setTimeout(() => chime(f, 0.12), 900 + j * 110))
    else chime(440, 0.08)
  }

  const msg = choice?.yes
    ? (pick === 'thiakry' ? 'ok je te pardonne. mais tu me dois un thiakry' : 'ok c’est bon. je te pardonne')
    : 'j’ai lu ta rédaction. laisse moi un peu de temps'

  return (
    <div className="page-content">
      <p className="red title-red"><span className="ink-line" style={{ animationDelay: '.3s', animationDuration: '.6s' }}>III. Conclusion</span></p>
      <Ink lines={['on fait la paix ?']} delay={1.5} className="big-hand" speed={0.06} />
      <div className="choices" data-interactive>
        {CHOICES.map((c, k) => (
          <label key={c.id} className={`choice ${pick === c.id ? 'on' : ''}`} style={{ animationDelay: `${2.6 + k * 0.25}s` }}>
            <input type="radio" name="paix" id={`c-${c.id}`} checked={pick === c.id} onChange={() => choose(c)} disabled={!!pick && pick !== c.id} />
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M5 6 L27 5 L28 27 L4 28 Z" className="box" />
              {pick === c.id && <path d="M7 16 L14 24 L30 -2" pathLength="1" className="tick" />}
            </svg>
            <span>{c.label}</span>
          </label>
        ))}
      </div>

      <div className="answer">
        {choice?.yes && (
          <>
            <Ink lines={['mane iow la rek la beug,', 'iow rek la am.']} delay={0.6} className="wolof-hand" speed={0.045} />
            {HEARTS.map((h, k) => (
              <svg key={k} className="doodle-heart" viewBox="0 0 40 38" aria-hidden="true"
                style={{ left: `${h.x}%`, top: `${h.y}px`, width: `${h.s}px`, transform: `rotate(${h.r}deg)` }}>
                <path pathLength="1" className="pen red-pen"
                  d="M20 36 C 6 26 0 18 2 10 C 4 2 14 0 20 9 C 26 0 36 2 38 10 C 40 18 34 26 20 36 Z"
                  style={{ animationDelay: `${2.4 + k * 0.2}s`, animationDuration: '.6s' }} />
              </svg>
            ))}
            <div className="grade" aria-label="Note : 20 sur 20">20/20<small>très bien</small></div>
          </>
        )}
        {choice && !choice.yes && (
          <Ink lines={['d’accord. prends ton temps.', 'je bouge pas. le thiakry non plus.']} delay={0.4} />
        )}
      </div>

      {pick && (
        <div className="end-row" style={{ animationDelay: '3.4s' }}>
          <Signature />
          <div className="end-links" data-interactive>
            <a className="wa" href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">répondre sur WhatsApp</a>
            <button type="button" className="replay" onClick={(e) => { e.stopPropagation(); restart() }}>relire depuis le début</button>
          </div>
        </div>
      )}
    </div>
  )
}
