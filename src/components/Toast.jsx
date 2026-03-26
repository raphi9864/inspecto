import { useState, useEffect, useCallback } from 'react'

let toastListener = null

export function showToast(message, type = 'success') {
  if (toastListener) toastListener({ message, type, id: Date.now() })
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastListener = (toast) => {
      setToasts(prev => [...prev, toast])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 3000)
    }
    return () => { toastListener = null }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' && '✓'}
            {t.type === 'error' && '✕'}
            {t.type === 'info' && 'ℹ'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
