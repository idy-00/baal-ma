// Musique douce synthétisée (aucun fichier audio) + petits sons d'interface.
// Ne démarre qu'après un geste de l'utilisateur (règle des navigateurs).

let ctx = null
let master = null
let wet = null
let musicTimer = null
let muted = false

const N = (m) => 440 * Math.pow(2, (m - 69) / 12)

// Do – Sol – La mineur – Fa, arpégé, tempo lent
const CHORDS = [
  [60, 64, 67, 72],
  [55, 62, 67, 71],
  [57, 60, 64, 69],
  [53, 60, 65, 69],
]
const MELODY = [76, null, 74, 72, null, 74, 76, null, 79, null, 76, 74, null, 72, 74, null]

function init() {
  if (ctx) return
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  } catch (e) {
    ctx = null
    return
  }
  master = ctx.createGain()
  master.gain.value = 0.55
  master.connect(ctx.destination)
  // écho doux qui fait office de réverb
  const delay = ctx.createDelay()
  delay.delayTime.value = 0.32
  const fb = ctx.createGain()
  fb.gain.value = 0.38
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2200
  wet = ctx.createGain()
  wet.gain.value = 0.35
  wet.connect(delay)
  delay.connect(lp)
  lp.connect(fb)
  fb.connect(delay)
  lp.connect(master)
}

function voice(freq, t, dur, vol, type = 'triangle') {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  g.connect(master)
  g.connect(wet)
  o.start(t)
  o.stop(t + dur + 0.05)
}

export function startMusic() {
  init()
  if (!ctx || musicTimer) return
  ctx.resume?.()
  const step = 60 / 76 / 2 // croches à 76 bpm
  let next = ctx.currentTime + 0.1
  let i = 0
  const tick = () => {
    while (next < ctx.currentTime + 0.4) {
      const bar = Math.floor(i / 8) % 4
      const chord = CHORDS[bar]
      const pos = i % 8
      // arpège
      const arp = [0, 1, 2, 3, 2, 1, 2, 3][pos]
      voice(N(chord[arp]), next, 1.6, 0.05)
      if (pos === 0) voice(N(chord[0] - 12), next, 3.2, 0.06, 'sine')
      // mélodie qui entre après 4 mesures
      if (i >= 32) {
        const m = MELODY[i % 16]
        if (m && pos % 2 === 0) voice(N(m), next, 1.2, 0.035, 'sine')
      }
      next += step
      i++
    }
  }
  musicTimer = setInterval(tick, 100)
  tick()
}

export function chime(freq = 660, vol = 0.12) {
  if (!ctx || muted) return
  const t = ctx.currentTime
  voice(freq, t, 1.8, vol, 'sine')
  voice(freq * 2.76, t, 0.9, vol * 0.25, 'sine')
}

export function pop() {
  if (!ctx || muted) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(900, t)
  o.frequency.exponentialRampToValueAtTime(1400, t + 0.06)
  g.gain.setValueAtTime(0.06, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  o.connect(g)
  g.connect(master)
  o.start(t)
  o.stop(t + 0.15)
}

export function setMuted(m) {
  muted = m
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.55, ctx.currentTime, 0.1)
}
export const isMuted = () => muted
