// Texte qui s'écrit au stylo, ligne par ligne, de gauche à droite.
// lines : tableau de chaînes ; delay : départ (s) ; speed : secondes par caractère.
export function inkDuration(lines, speed = 0.038) {
  return lines.reduce((t, l) => t + Math.max(0.35, l.length * speed) + 0.12, 0)
}

export default function Ink({ lines, delay = 0, speed = 0.038, className = '', style }) {
  let t = delay
  return (
    <div className={`ink ${className}`} style={style}>
      {lines.map((l, i) => {
        const d = Math.max(0.35, l.length * speed)
        const s = { animationDelay: `${t}s`, animationDuration: `${d}s` }
        t += d + 0.12
        return <span key={i} className="ink-line" style={s}>{l}</span>
      })}
    </div>
  )
}
