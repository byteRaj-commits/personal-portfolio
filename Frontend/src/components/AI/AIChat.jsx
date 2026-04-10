import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import './AIChat.css'

const WELCOME = {
  role: 'assistant',
  content: "Hi! 👋 I'm Raj's AI assistant. Ask me anything about his skills, projects, or experience!",
}

export default function AIChat() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg   = { role: 'user', content: text }
    const history   = [...messages, userMsg].filter((m) => m.role !== 'system')
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      // Only send user/assistant turns to API
      const payload = history.filter((m) => m.role === 'user' || m.role === 'assistant')
      const res = await api.post('/ai/chat', { messages: payload })
      setMessages((prev) => [...prev, res.data])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again!" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        className={`aichat__fab ${open ? 'aichat__fab--open' : ''}`}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="AI Chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="aichat__fab-badge" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="aichat__window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="aichat__header">
              <div className="aichat__header-avatar">
                <Bot size={18} />
              </div>
              <div>
                <div className="aichat__header-name">Raj's AI Assistant</div>
                <div className="aichat__header-status">
                  <span className="aichat__header-dot" /> Online
                </div>
              </div>
              <button className="aichat__close" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="aichat__messages">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`aichat__msg aichat__msg--${m.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="aichat__msg-avatar">
                    {m.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div className="aichat__msg-bubble">
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  className="aichat__msg aichat__msg--assistant"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="aichat__msg-avatar"><Bot size={14} /></div>
                  <div className="aichat__msg-bubble aichat__typing">
                    <span /><span /><span />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="aichat__input-row">
              <textarea
                ref={inputRef}
                className="aichat__input"
                placeholder="Ask about Raj's projects, skills..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
              />
              <button
                className="aichat__send"
                onClick={send}
                disabled={!input.trim() || loading}
              >
                {loading ? <Loader2 size={16} className="aichat__spin" /> : <Send size={16} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
