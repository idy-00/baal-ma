import { useState, useCallback, useEffect } from 'react'
import { startMusic, setMuted, chime } from './audio.js'
import Lock from './scenes/Lock.jsx'
import Chat from './scenes/Chat.jsx'
import Cover from './scenes/Cover.jsx'
import Souvenirs from './scenes/Souvenirs.jsx'
import Kintsugi from './scenes/Kintsugi.jsx'
import Conclusion from './scenes/Conclusion.jsx'

const SCENES = [Lock, Chat, Cover, Souvenirs, Kintsugi, Conclusion]
const FIRST_PAGE = 2 // à partir d'ici : le cahier

export default function App() {
  const [i, setI] = useState(0)
  const [done, setDone] = useState(() => SCENES.map(() => false))
  const [dir, setDir] = useState(1)
  const [muted, setMute] = useState(false)

  const markDone = useCallback((k) => {
    setDone((d) => (d[k] ? d : d.map((v, j) => (j === k ? true : v))))
  }, [])

  const go = (target) => {
    target = Math.max(1, Math.min(SCENES.length - 1, target))
    if (target === i) return
    setDir(target > i ? 1 : -1)
    chime(target > i ? 784 : 523, 0.04)
    setI(target)
  }

  // Appuyer à droite = page suivante, à gauche = retour
  const onTap = (e) => {
    if (i === 0 || e.target.closest('[data-interactive]')) return
    const x = e.clientX / window.innerWidth
    if (x < 0.3) go(i - 1)
    else if (done[i]) go(i + 1)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (i === 0) return
      if (e.key === 'ArrowRight' && done[i]) go(i + 1)
      if (e.key === 'ArrowLeft') go(i - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const unlock = () => {
    startMusic()
    markDone(0)
    setDir(1)
    setI(1)
  }

  const Scene = SCENES[i]
  const paper = i >= FIRST_PAGE
  const anim = i === FIRST_PAGE && dir > 0 ? 'in-paper' : paper ? (dir > 0 ? 'turn-next' : 'turn-prev') : 'in-fade'

  return (
    <div className={`phone ${paper ? 'is-paper' : 'is-dark'}`} onClick={onTap}>
      <div key={i} className={`scene ${paper ? 'seyes' : ''} ${anim}`}>
        <Scene
          onDone={() => markDone(i)}
          done={done[i]}
          unlock={unlock}
          restart={() => { setDone(SCENES.map(() => false)); setDir(1); setI(0) }}
        />
        {paper && <p className="page-num">p. {i - FIRST_PAGE + 1}</p>}
      </div>

      {i > 0 && (
        <button type="button" data-interactive className="mute" aria-pressed={muted}
          onClick={() => { setMuted(!muted); setMute(!muted) }}>
          {muted ? 'son coupé' : 'son'}
        </button>
      )}

      {i > 0 && i < SCENES.length - 1 && done[i] && (
        <p className={`next-hint ${paper ? 'hand' : ''}`} aria-hidden="true">
          {i === 1 ? 'appuie à droite' : 'tourne la page'} <span>→</span>
        </p>
      )}
    </div>
  )
}
