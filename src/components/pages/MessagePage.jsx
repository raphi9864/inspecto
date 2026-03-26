import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { showToast } from '../Toast'

const CONVERSATIONS = [
  { id: 1, name: 'R. Attal', lastMsg: 'Voir la NC-2026-0043', time: '14:32', unread: 2 },
  { id: 2, name: 'S. Dupont', lastMsg: 'Rapport Pilatus OK', time: '11:15', unread: 0 },
  { id: 3, name: 'Équipe QSE', lastMsg: 'Revue hebdo confirmée', time: 'Hier', unread: 0 },
]

const MESSAGES_MAP = {
  1: [
    { from: 'R. Attal', text: 'La NC-2026-0043 est toujours ouverte, tu peux jeter un œil ?', time: '14:28', sent: false },
    { from: 'Vous', text: 'Je regarde ça maintenant, merci.', time: '14:30', sent: true },
    { from: 'R. Attal', text: 'Le rework est planifié pour vendredi, on devrait pouvoir clôturer lundi.', time: '14:32', sent: false },
    { from: 'Vous', text: 'Parfait, je prépare la re-inspection pour lundi matin.', time: '14:35', sent: true },
  ],
  2: [
    { from: 'S. Dupont', text: 'Le rapport Pilatus est validé, on peut l\'envoyer au client.', time: '11:10', sent: false },
    { from: 'Vous', text: 'Rapport Pilatus OK', time: '11:15', sent: true },
  ],
  3: [
    { from: 'J. Martin', text: 'La revue hebdo est confirmée pour jeudi 10h.', time: 'Hier', sent: false },
    { from: 'Vous', text: 'Revue hebdo confirmée', time: 'Hier', sent: true },
  ],
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase()
}

export default function MessagePage() {
  const containerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [activeConv, setActiveConv] = useState(1)
  const [inputText, setInputText] = useState('')

  const messages = MESSAGES_MAP[activeConv] || []

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.msg-sidebar-item', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.2 })
      gsap.fromTo('.msg-bubble', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: 'power2.out', delay: 0.3 })
    }, containerRef)
    return () => ctx.revert()
  }, [activeConv])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeConv])

  const handleSend = () => {
    if (!inputText.trim()) return
    showToast('Message envoyé', 'success')
    setInputText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const activeConvData = CONVERSATIONS.find(c => c.id === activeConv)

  return (
    <div
      ref={containerRef}
      data-demo-target="message-page"
      style={{
        display: 'flex',
        height: '100%',
        minHeight: 0,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-primary)',
      }}
    >
      {/* ─── Left sidebar: conversation list ─── */}
      <div style={{
        width: '280px',
        minWidth: '280px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Sidebar header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Messages</span>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {CONVERSATIONS.map(conv => (
            <div
              key={conv.id}
              className="msg-sidebar-item"
              onClick={() => setActiveConv(conv.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                borderLeft: activeConv === conv.id ? '3px solid var(--blue)' : '3px solid transparent',
                background: activeConv === conv.id ? 'rgba(26,111,196,0.08)' : 'transparent',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { if (activeConv !== conv.id) e.currentTarget.style.background = 'var(--bg-hover)' }}
              onMouseLeave={e => { if (activeConv !== conv.id) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Avatar circle */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}>
                {getInitials(conv.name)}
              </div>

              {/* Name + last message */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{conv.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>{conv.time}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.lastMsg}
                </div>
              </div>

              {/* Unread badge */}
              {conv.unread > 0 && (
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#d7294a',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right panel: chat view ─── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        minWidth: 0,
      }}>
        {/* Chat header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#fff',
          }}>
            {activeConvData ? getInitials(activeConvData.name) : '?'}
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {activeConvData?.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>En ligne</div>
          </div>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className="msg-bubble"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sent ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                alignSelf: msg.sent ? 'flex-end' : 'flex-start',
              }}
            >
              {!msg.sent && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '4px', marginLeft: '4px' }}>
                  {msg.from}
                </span>
              )}
              <div style={{
                background: msg.sent ? 'var(--blue)' : 'var(--bg-tertiary)',
                color: msg.sent ? '#fff' : 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: msg.sent ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: '0.88rem',
                lineHeight: 1.45,
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px', padding: '0 4px' }}>
                {msg.time}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message..."
            style={{
              flex: 1,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.88rem',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <button
            className="btn-primary"
            onClick={handleSend}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
