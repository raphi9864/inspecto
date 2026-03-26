import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function FakeChatbot() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const responseIndex = useRef(0)

  const responses = t('chatbot.responses', { returnObjects: true })
  const responseList = Array.isArray(responses) ? responses : []

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')

    // Pick next response in rotation
    setTimeout(() => {
      const reply = responseList.length > 0
        ? responseList[responseIndex.current % responseList.length]
        : t('chatbot.defaultReply')
      responseIndex.current += 1
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    }, 600)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="chatbot-trigger"
        onClick={() => setOpen(o => !o)}
        aria-label={t('chatbot.title')}
        data-demo-target="chatbot-trigger"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-header-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <div className="chatbot-header-title">{t('chatbot.title')}</div>
              <div className="chatbot-header-sub">{t('chatbot.subtitle')}</div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-empty">{t('chatbot.placeholder')}</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${msg.role}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-row" onSubmit={e => { e.preventDefault(); handleSend() }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('chatbot.inputPlaceholder')}
              className="chatbot-input"
              autoFocus
            />
            <button type="submit" className="chatbot-send" aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
