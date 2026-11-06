import { useEffect, useState } from 'react'
import Ink, { inkDuration } from '../Ink.jsx'
import { chime } from '../audio.js'

const HEART = 'M200 350 C 80 270, 20 200, 20 122 C 20 62, 68 22, 124 22 C 160 22, 185 42, 200 66 C 215 42, 240 22, 276 22 C 332 22, 380 62, 380 122 C 380 200, 320 270, 200 350 Z'
const CRACKS = [
  { d: 'M200 66 L192 98 L208 124 L188 156 L202 186 L196 214', say: 'pardon d’avoir haussé le ton.' },
  { d: 'M24 118 L66 128 L88 110 L122 144 L156 136 L188 156', say: 'pardon d’avoir fait celui qui a toujours raison.' },
  { d: 'M376 108 L334 124 L312 106 L280 144 L246 134 L208 124', say: 'pardon pour le « ok » sec.' },
  { d: 'M196 214 L166 242 L182 270 L170 300 L200 348', say: 'la prochaine fois je t’écoute jusqu’au bout.' },
]

export default function Kintsugi({ onDone, done }) {
  const intro = ['au japon quand un bol se casse,', 'ils le jettent pas.', 'ils le recollent avec de l’or.']
  const tHeart = 1 + inkDuration(intro) + 0.2
  const tReady = tHeart + 2.2
  const [ready, setReady] = useState(!!done)
  const [fixed, setFixed] = useState(() => CRACKS.map(() => !!done))
  const [order, setOrder] = useState(done ? [0, 1, 2, 3] : [])
  const all = fixed.every(Boolean)

  useEffect(() => {
    if (done) return
    const id = setTimeout(() => setReady(true), tReady * 1000)
    return () => clearTimeout(id)
  }, [])

  const repair = (k) => {
    if (!ready || fixed[k]) return
    const nf = fixed.map((v, j) => (j === k ? true : v))
    setFixed(nf)
    setOrder((o) => [...o, k])
    const n = nf.filter(Boolean).length
    chime([523.25, 659.25, 783.99, 1046.5][n - 1], 0.12)
    if (n === CRACKS.length) setTimeout(onDone, 2600)
  }
  const next = fixed.indexOf(false)

  return (
    <div className="page-content">
      <p className="red title-red"><span className="ink-line" style={{ animationDelay: '.3s', animationDuration: '.6s' }}>II. Le kintsugi</span></p>
      <Ink lines={intro} delay={done ? 0 : 1} />
      <div className="kheart">
        <svg viewBox="0 0 400 380" role="group" aria-label="Cœur dessiné au stylo, fissuré">
          <path d={HEART} pathLength="1" className="pen heart-line" style={{ animationDelay: `${done ? 0 : tHeart}s`, animationDuration: '1.4s' }} />
          {CRACKS.map((c, k) => (
            <g key={k}>
              <path d={c.d} pathLength="1" className="pen crack" style={{ animationDelay: `${done ? 0 : tHeart + 1.3 + k * 0.15}s`, animationDuration: '.5s' }} />
              <path d={c.d} pathLength="1" className={`gold ${fixed[k] ? 'on' : ''}`} />
              {ready && !fixed[k] && k === next && <path d={c.d} className="crack-hint" />}
              <path
                d={c.d}
                className={`hit ${fixed[k] ? 'off' : ''}`}
                data-interactive
                role="button"
                tabIndex={ready && !fixed[k] ? 0 : -1}
                aria-label={`Repasser la fissure ${k + 1} à l'or`}
                onClick={(e) => { e.stopPropagation(); repair(k) }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); repair(k) } }}
              />
            </g>
          ))}
        </svg>
        {all && <p className="margin-note">kin = l&apos;or · tsugi = la jointure</p>}
      </div>
      <div className="apologies">
        {ready && order.length === 0 && <p className="hint-hand">repasse les fissures au feutre doré</p>}
        {order.map((k) => <Ink key={k} lines={[CRACKS[k].say]} speed={0.03} />)}
      </div>
    </div>
  )
}
