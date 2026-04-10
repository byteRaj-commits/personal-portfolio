import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Github, Linkedin, Code2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import './Contact.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const TYPES = [
  { value: 'project',       label: '🚀 Project Offer' },
  { value: 'job',           label: '💼 Job Opportunity' },
  { value: 'collaboration', label: '🤝 Collaboration' },
  { value: 'general',       label: '💬 General' },
]

const INITIAL = { name: '', email: '', subject: '', message: '', type: 'general' }

export default function Contact() {
  const [form, setForm]       = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSent(true)
      toast.success('Message sent! I\'ll get back to you soon 🎉')
      setForm(INITIAL)
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      toast.error(err.message || 'Failed to send. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="contact__header"
        >
          <span className="section-tag">Get in touch</span>
          <h2 className="section-title">Let's <span>Work Together</span></h2>
          <p className="contact__sub">
            Have a project in mind or want to collaborate? Drop me a message below.
          </p>
        </motion.div>

        <motion.div
          className="contact__grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* Left — info */}
          <motion.div variants={fadeUp} className="contact__info">
            <div className="contact__info-card">
              <h3 className="contact__info-title">Let's connect</h3>
              <p className="contact__info-text">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
              </p>
              <div className="contact__links">
                <a href="mailto:raj@email.com" className="contact__link">
                  <span className="contact__link-icon"><Mail size={18} /></span>
                  <span>Send an Email</span>
                </a>
                <a href="https://github.com/byteRaj-commits" target="_blank" rel="noreferrer" className="contact__link">
                  <span className="contact__link-icon"><Github size={18} /></span>
                  <span>GitHub</span>
                </a>
                <a href="https://leetcode.com/u/Raj7753/" target="_blank" rel="noreferrer" className="contact__link">
                  <span className="contact__link-icon"><Code2 size={18} /></span>
                  <span>LeetCode</span>
                </a>
                <a href="https://www.geeksforgeeks.org/profile/rajp18zsll" target="_blank" rel="noreferrer" className="contact__link">
                  <span className="contact__link-icon" style={{ color: 'var(--green)' }}>GfG</span>
                  <span>GeeksForGeeks</span>
                </a>
              </div>
            </div>

            <div className="contact__available">
              <span className="contact__avail-dot" />
              <span>Available for freelance & full-time opportunities</span>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div variants={fadeUp}>
            <form className="contact__form" onSubmit={handleSubmit}>
              {/* Type selector */}
              <div className="contact__types">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`contact__type-btn ${form.type === t.value ? 'contact__type-btn--active' : ''}`}
                    onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label">Name</label>
                  <input className="contact__input" placeholder="Your name" value={form.name} onChange={set('name')} />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Email</label>
                  <input className="contact__input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
                </div>
              </div>

              <div className="contact__field">
                <label className="contact__label">Subject</label>
                <input className="contact__input" placeholder="What's this about?" value={form.subject} onChange={set('subject')} />
              </div>

              <div className="contact__field">
                <label className="contact__label">Message</label>
                <textarea className="contact__textarea" rows={5} placeholder="Tell me about your project or idea..." value={form.message} onChange={set('message')} />
              </div>

              <button type="submit" className={`btn btn-primary contact__submit ${loading ? 'contact__submit--loading' : ''}`} disabled={loading}>
                {sent ? (
                  <><CheckCircle size={16} /> Message Sent!</>
                ) : loading ? (
                  <><span className="contact__spinner" /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
