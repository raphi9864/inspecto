import { useState, useRef, useEffect, useCallback } from 'react'

const TOOLS = [
  { id: 'circle', label: 'Circle', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> },
  { id: 'rect', label: 'Rectangle', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> },
  { id: 'arrow', label: 'Arrow', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/></svg> },
  { id: 'text', label: 'Text', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9.5" y1="20" x2="14.5" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> },
  { id: 'eraser', label: 'Eraser', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 20H7L3 16l8-8 9 9-3 3z"/><line x1="6" y1="11" x2="13" y2="18"/></svg> },
]

const COLORS = [
  { id: 'red', hex: '#CC0000', label: 'Critical' },
  { id: 'yellow', hex: '#dd6b20', label: 'Minor' },
  { id: 'green', hex: '#38a169', label: 'Conforming' },
]

export default function ImageEditor({ imageSrc, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const [tool, setTool] = useState('circle')
  const [color, setColor] = useState('#CC0000')
  const [annotations, setAnnotations] = useState([])
  const [drawing, setDrawing] = useState(false)
  const [startPos, setStartPos] = useState(null)
  const [currentPos, setCurrentPos] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imgRef = useRef(new Image())

  // Load image
  useEffect(() => {
    const img = imgRef.current
    img.crossOrigin = 'anonymous'
    img.onload = () => setImageLoaded(true)
    img.src = imageSrc
  }, [imageSrc])

  // Render annotations
  const renderCanvas = useCallback(() => {
    const canvas = overlayRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    annotations.forEach(a => {
      ctx.strokeStyle = a.color
      ctx.fillStyle = a.color
      ctx.lineWidth = 3

      if (a.type === 'circle') {
        const rx = Math.abs(a.x2 - a.x1) / 2
        const ry = Math.abs(a.y2 - a.y1) / 2
        const cx = (a.x1 + a.x2) / 2
        const cy = (a.y1 + a.y2) / 2
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.stroke()
      } else if (a.type === 'rect') {
        ctx.strokeRect(a.x1, a.y1, a.x2 - a.x1, a.y2 - a.y1)
      } else if (a.type === 'arrow') {
        const dx = a.x2 - a.x1
        const dy = a.y2 - a.y1
        const angle = Math.atan2(dy, dx)
        ctx.beginPath()
        ctx.moveTo(a.x1, a.y1)
        ctx.lineTo(a.x2, a.y2)
        ctx.stroke()
        // Arrowhead
        const headLen = 15
        ctx.beginPath()
        ctx.moveTo(a.x2, a.y2)
        ctx.lineTo(a.x2 - headLen * Math.cos(angle - 0.4), a.y2 - headLen * Math.sin(angle - 0.4))
        ctx.moveTo(a.x2, a.y2)
        ctx.lineTo(a.x2 - headLen * Math.cos(angle + 0.4), a.y2 - headLen * Math.sin(angle + 0.4))
        ctx.stroke()
      } else if (a.type === 'text') {
        ctx.font = 'bold 16px Inter, sans-serif'
        ctx.fillText(a.text || 'Defect', a.x1, a.y1)
      }
    })

    // Draw current shape being created
    if (drawing && startPos && currentPos && tool !== 'eraser' && tool !== 'text') {
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      if (tool === 'circle') {
        const rx = Math.abs(currentPos.x - startPos.x) / 2
        const ry = Math.abs(currentPos.y - startPos.y) / 2
        const cx = (startPos.x + currentPos.x) / 2
        const cy = (startPos.y + currentPos.y) / 2
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.stroke()
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, currentPos.x - startPos.x, currentPos.y - startPos.y)
      } else if (tool === 'arrow') {
        ctx.beginPath()
        ctx.moveTo(startPos.x, startPos.y)
        ctx.lineTo(currentPos.x, currentPos.y)
        ctx.stroke()
        const dx = currentPos.x - startPos.x
        const dy = currentPos.y - startPos.y
        const angle = Math.atan2(dy, dx)
        const headLen = 15
        ctx.beginPath()
        ctx.moveTo(currentPos.x, currentPos.y)
        ctx.lineTo(currentPos.x - headLen * Math.cos(angle - 0.4), currentPos.y - headLen * Math.sin(angle - 0.4))
        ctx.moveTo(currentPos.x, currentPos.y)
        ctx.lineTo(currentPos.x - headLen * Math.cos(angle + 0.4), currentPos.y - headLen * Math.sin(angle + 0.4))
        ctx.stroke()
      }
    }
  }, [annotations, drawing, startPos, currentPos, tool, color])

  useEffect(() => { renderCanvas() }, [renderCanvas])

  const getPos = (e) => {
    const rect = overlayRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onMouseDown = (e) => {
    const pos = getPos(e)
    if (tool === 'eraser') {
      // Remove last annotation near click
      setAnnotations(prev => {
        const newArr = [...prev]
        for (let i = newArr.length - 1; i >= 0; i--) {
          const a = newArr[i]
          const cx = (a.x1 + (a.x2 || a.x1)) / 2
          const cy = (a.y1 + (a.y2 || a.y1)) / 2
          if (Math.abs(pos.x - cx) < 40 && Math.abs(pos.y - cy) < 40) {
            newArr.splice(i, 1)
            break
          }
        }
        return newArr
      })
      return
    }
    if (tool === 'text') {
      const text = prompt('Enter annotation text:', 'Defect')
      if (text) {
        setAnnotations(prev => [...prev, { type: 'text', x1: pos.x, y1: pos.y, color, text }])
      }
      return
    }
    setDrawing(true)
    setStartPos(pos)
    setCurrentPos(pos)
  }

  const onMouseMove = (e) => {
    if (!drawing) return
    setCurrentPos(getPos(e))
  }

  const onMouseUp = () => {
    if (!drawing || !startPos || !currentPos) { setDrawing(false); return }
    setAnnotations(prev => [...prev, {
      type: tool,
      x1: startPos.x, y1: startPos.y,
      x2: currentPos.x, y2: currentPos.y,
      color,
    }])
    setDrawing(false)
    setStartPos(null)
    setCurrentPos(null)
  }

  const handleSave = () => {
    // Merge image + annotations into a single canvas
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imgRef.current
    canvas.width = overlayRef.current.width
    canvas.height = overlayRef.current.height
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(overlayRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/png')
    onSave(dataUrl)
  }

  return (
    <div className="image-editor-overlay">
      <div className="image-editor-container">
        {/* Toolbar */}
        <div className="image-editor-toolbar">
          <div className="image-editor-tools">
            {TOOLS.map(t => (
              <button
                key={t.id}
                className={`image-editor-tool-btn${tool === t.id ? ' active' : ''}`}
                onClick={() => setTool(t.id)}
                title={t.label}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
          <div className="image-editor-colors">
            {COLORS.map(c => (
              <button
                key={c.id}
                className={`image-editor-color-btn${color === c.hex ? ' active' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setColor(c.hex)}
                title={c.label}
              />
            ))}
          </div>
          <div className="image-editor-actions">
            <button className="btn-outline" onClick={onCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="image-editor-canvas-area">
          {imageLoaded && (
            <>
              <img src={imageSrc} alt="Editing" className="image-editor-bg" crossOrigin="anonymous" />
              <canvas
                ref={overlayRef}
                width={640}
                height={480}
                className="image-editor-draw-layer"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={() => { if (drawing) onMouseUp() }}
              />
            </>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  )
}
