import { useRef } from 'react'

export default function ModuleCard({ module, onHover, onLeave, onClick }) {
  const cardRef = useRef(null)

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(cardRef.current)
    }
  }

  return (
    <div
      ref={cardRef}
      className="workflow-card"
      data-module={module.key}
      role="button"
      tabIndex={0}
      aria-label={`Module ${module.title} — ${module.desc}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => onClick(cardRef.current)}
      onKeyDown={handleKeyDown}
    >
      <div className="card-number">{module.number}</div>
      {module.icon}
      <div className="card-title">{module.title}</div>
      <div className="card-desc">{module.desc}</div>
      <div className="card-features">
        {module.features.map((f) => <span key={f}>{f}</span>)}
      </div>
      <div className="card-cta">Entrer dans le module <span>→</span></div>
    </div>
  )
}
