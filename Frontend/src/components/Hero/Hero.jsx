import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Code2, ArrowDown, Download, ExternalLink } from 'lucide-react'
import api from '../../utils/api'
import './Hero.css'

export default function Hero() {
  const canvasRef = useRef(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api.get('/profile').then((r) => setProfile(r.data)).catch(() => {})
  }, [])

  /* ── 3D Particle Field ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    let mouse = { x: W / 2, y: H / 2 }

    const onResize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)

    const NUM = 120
    const particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 400 + 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.5,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2
      const mx = (mouse.x - cx) / cx
      const my = (mouse.y - cy) / cy

      particles.forEach((p) => {
        p.x += p.vx + mx * 0.3
        p.y += p.vy + my * 0.3
        p.z += p.vz

        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        if (p.z < 50) p.z = 500
        if (p.z > 500) p.z = 50

        const scale = 400 / p.z
        const sx = (p.x - cx) * scale + cx
        const sy = (p.y - cy) * scale + cy
        const alpha = Math.min(1, scale * 0.4)
        const radius = p.r * scale

        if (sx < 0 || sx > W || sy < 0 || sy > H) return

        ctx.beginPath()
        ctx.arc(sx, sy, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124,92,252,${alpha * 0.8})`
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        const s1 = 400 / p1.z
        const x1 = (p1.x - cx) * s1 + cx
        const y1 = (p1.y - cy) * s1 + cy

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const s2 = 400 / p2.z
          const x2 = (p2.x - cx) * s2 + cx
          const y2 = (p2.y - cy) * s2 + cy

          const dist = Math.hypot(x2 - x1, y2 - y1)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = `rgba(124,92,252,${(1 - dist / 100) * 0.15})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  const socials = [
    { icon: <Github size={18} />,   href: profile?.social?.github   || 'https://github.com/byteRaj-commits' },
    { icon: <Code2  size={18} />,   href: profile?.social?.leetcode || 'https://leetcode.com/u/Raj7753/' },
    { icon: <Linkedin size={18} />, href: profile?.social?.linkedin || '#' },
  ]

  return (
    <section className="hero" id="home">
      <canvas ref={canvasRef} className="hero__canvas" />

      {/* Gradient orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      <div className="container hero__inner">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="hero__badge-dot" />
            <span>Open to opportunities</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16,1,0.3,1] }}
          >
            <span className="hero__hi">Hey, I'm</span>
            <span className="hero__name">
              {profile?.name || 'Raj'}
              <span className="hero__name-line" />
            </span>
            <span className="hero__role">
              <TypeAnimation
                sequence={[
                  'Full Stack Dev', 2000,
                  'React Expert',   2000,
                  'Node.js Dev',    2000,
                  'Problem Solver', 2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
              <span className="hero__cursor">_</span>
            </span>
          </motion.h1>

          <motion.p
            className="hero__bio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {profile?.bio || 'Building scalable full-stack applications with React, Node.js & MongoDB. Passionate about clean code and great UX.'}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            <a href="#projects" className="btn btn-primary hero__cta">
              <span>View Work</span>
              <ExternalLink size={15} />
            </a>
            {profile?.resume?.url
              ? <a href={profile.resume.url} target="_blank" rel="noreferrer" className="btn btn-outline"><Download size={15} /> Resume</a>
              : <a href="#contact" className="btn btn-outline">Get in Touch</a>
            }
          </motion.div>

          <motion.div
            className="hero__socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.7 }}
          >
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" className="hero__social">
                {s.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Card */}
        <motion.div
          className="hero__card-wrap"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16,1,0.3,1] }}
        >
          <div className="hero__card" id="heroCard">
            <div className="hero__card-inner">
              <div className="hero__card-glow" />
              <div className="hero__avatar">
                {profile?.avatar?.url
                  ? <img src={profile.avatar.url} alt={profile.name} />
                  : <div className="hero__avatar-placeholder">{(profile?.name || 'R')[0]}</div>
                }
              </div>
              <div className="hero__card-info">
                <span className="hero__card-name">{profile?.name || 'Raj'}</span>
                <span className="hero__card-title">{profile?.title || 'Full Stack Developer'}</span>
                <span className="hero__card-loc">📍 {profile?.location || 'India'}</span>
              </div>
              <div className="hero__card-tags">
                {['React', 'Node.js', 'MongoDB', 'Express'].map((t) => (
                  <span key={t} className="hero__card-tag">{t}</span>
                ))}
              </div>
              <div className="hero__card-stats">
                <div className="hero__card-stat"><span>6+</span><small>Projects</small></div>
                <div className="hero__card-stat"><span>13+</span><small>Skills</small></div>
                <div className="hero__card-stat"><span>∞</span><small>Coffee</small></div>
              </div>
            </div>
          </div>

          {/* Floating orbit elements */}
          <div className="hero__orbit hero__orbit--1">
            <div className="hero__orbit-dot" />
          </div>
          <div className="hero__orbit hero__orbit--2">
            <div className="hero__orbit-dot hero__orbit-dot--2" />
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero__scroll"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown size={16} />
        <span>Scroll</span>
      </motion.a>
    </section>
  )
}
