import { useEffect } from 'react'
import Ink, { inkDuration } from '../Ink.jsx'

// Dessins au stylo bille : chaque trait se trace (pathLength = 1).
const P = ({ d, delay, dur = 0.7, w = 2.4 }) => (
  <path d={d} pathLength="1" className="pen" style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s`, strokeWidth: w }} />
)

const Corniche = ({ at }) => (
  <svg viewBox="0 0 150 110" className="doodle" aria-hidden="true">
    <P d="M100 34 a14 14 0 1 0 0.1 0" delay={at} dur={0.5} />
    <P d="M86 22 l-6 -6 M100 14 v-8 M114 22 l6 -6 M120 36 h8" delay={at + 0.5} dur={0.4} w={2} />
    <P d="M6 62 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" delay={at + 0.8} dur={0.7} />
    <P d="M14 76 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" delay={at + 1.2} dur={0.6} />
    <P d="M0 100 q20 -16 46 -10 q22 4 34 14" delay={at + 1.5} dur={0.5} />
    <P d="M24 34 q8 -14 22 -8 q8 4 6 12 z M50 38 q10 0 14 5 l-15 -1" delay={at + 1.8} dur={0.6} />
    <P d="M10 28 h10 M6 36 h12 M12 44 h8" delay={at + 2.3} dur={0.3} w={1.8} />
  </svg>
)
const Bol = ({ at }) => (
  <svg viewBox="0 0 150 110" className="doodle" aria-hidden="true">
    <P d="M20 52 q55 16 110 0" delay={at} dur={0.5} />
    <P d="M20 52 q4 44 55 46 q51 -2 55 -46" delay={at + 0.4} dur={0.7} />
    <P d="M20 52 q55 -16 110 0" delay={at + 1} dur={0.5} />
    <P d="M40 50 h2 M56 46 h2 M72 48 h2 M90 45 h2 M104 49 h2 M64 54 h2 M82 53 h2" delay={at + 1.4} dur={0.5} w={3} />
    <P d="M96 44 l22 -36 M114 4 q10 2 6 12 q-6 2 -8 -6" delay={at + 1.8} dur={0.5} />
    <P d="M52 30 q-6 -8 0 -16 q6 -8 0 -14 M72 28 q-6 -8 0 -16" delay={at + 2.2} dur={0.5} w={1.8} />
  </svg>
)
const Vocal = ({ at }) => (
  <svg viewBox="0 0 150 110" className="doodle" aria-hidden="true">
    <P d="M10 30 h112 q14 0 14 14 v6 q0 14 -14 14 h-112 q-6 0 -6 -6 v-22 q0 -6 6 -6 z" delay={at} dur={0.7} />
    <P d="M20 38 l14 9 l-14 9 z" delay={at + 0.6} dur={0.3} />
    <P d="M44 47 v-2 M50 47 v-10 M56 47 v-6 M62 47 v-14 M68 47 v-8 M74 47 v-12 M80 47 v-4 M86 47 v-10 M92 47 v-6 M98 47 v-2" delay={at + 0.9} dur={0.8} w={3} />
    <P d="M44 47 v2 M50 47 v10 M56 47 v6 M62 47 v14 M68 47 v8 M74 47 v12 M80 47 v4 M86 47 v10 M92 47 v6 M98 47 v2" delay={at + 0.9} dur={0.8} w={3} />
  </svg>
)

export default function Souvenirs({ onDone, done }) {
  const head = ['on a quand même des bons', 'moments nous.']
  const t0 = 0.3 + 0.7 + inkDuration(head)
  const items = [
    { Art: Corniche, cap: ['la Corniche.', 'le vent a gagné', 'contre ta casquette'] },
    { Art: Bol, cap: ['ton thiakry.', 'j’ai dit « pas mal ».', 'j’ai menti.'] },
    { Art: Vocal, cap: ['tes vocaux de 4 min.', 'je les écoute en x1.', 'en x1.'] },
  ]
  let t = t0
  const plan = items.map((it) => {
    const at = t
    const capAt = at + 2.4
    t = capAt + inkDuration(it.cap) + 0.4
    return { ...it, at, capAt }
  })

  useEffect(() => {
    if (done) return
    const id = setTimeout(onDone, (t + 0.3) * 1000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="page-content">
      <p className="red title-red"><span className="ink-line" style={{ animationDelay: '.3s', animationDuration: '.6s' }}>I. Les preuves</span></p>
      <Ink lines={head} delay={1} />
      <div className="memories">
        {plan.map(({ Art, cap, at, capAt }, k) => (
          <div key={k} className={`memory ${k % 2 ? 'flip' : ''}`}>
            <Art at={done ? 0 : at} />
            <Ink lines={cap} delay={done ? 0 : capAt} className="cap" />
          </div>
        ))}
      </div>
    </div>
  )
}
