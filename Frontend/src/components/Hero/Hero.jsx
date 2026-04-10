import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Code2, ArrowDown, Download } from 'lucide-react'
import api from '../../utils/api'
import './Hero.css'

export default function Hero() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api.get('/profile').then((res) => setProfile(res.data)).catch(() => {})
  }, [])

  const socials = [
    { icon: <Github size={20} />, href: profile?.social?.github || 'https://github.com/byteRaj-commits', label: 'GitHub' },
    { icon: <Code2  size={20} />, href: profile?.social?.leetcode || 'https://leetcode.com/u/Raj7753/', label: 'LeetCode' },
    { icon: <Linkedin size={20} />, href: profile?.social?.linkedin || '#', label: 'LinkedIn' },
  ]

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="hero" id="home">
      {/* Background blobs */}
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />
      <div className="hero__grid" />

      <div className="container hero__inner">
        <motion.div
          className="hero__content"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="hero__badge">
            <span className="hero__badge-dot" />
            Available for work
          </motion.div>

          <motion.h1 variants={item} className="hero__title">
            Hi, I'm{' '}
            <span className="hero__name">
              {profile?.name || 'Raj'}
            </span>
            <br />
            <span className="hero__typewriter">
              <TypeAnimation
                sequence={[
                  'Full Stack Developer', 2000,
                  'React Developer',      2000,
                  'Node.js Developer',    2000,
                  'Problem Solver',       2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
          </motion.h1>

          <motion.p variants={item} className="hero__bio">
            {profile?.bio || 'Passionate full-stack developer building scalable web applications with React, Node.js & MongoDB.'}
          </motion.p>

          <motion.div variants={item} className="hero__actions">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            {profile?.resume?.url ? (
              <a href={profile.resume.url} target="_blank" rel="noreferrer" className="btn btn-outline">
                <Download size={16} /> Resume
              </a>
            ) : (
              <a href="#contact" className="btn btn-outline">
                Get in Touch
              </a>
            )}
          </motion.div>

          <motion.div variants={item} className="hero__socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hero__social" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Avatar / visual side */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__avatar-ring">
            <div className="hero__avatar">
              {profile?.avatar?.url ? (
                <img src={profile.avatar.url} alt={profile.name} />
              ) : (
                <div className="hero__avatar-placeholder">
                  {(profile?.name || 'R')[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          {/* Floating chips */}
          <div className="hero__chip hero__chip--1">React ⚛️</div>
          <div className="hero__chip hero__chip--2">Node.js 🟢</div>
          <div className="hero__chip hero__chip--3">MongoDB 🍃</div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown size={18} />
      </motion.div>
    </section>
  )
}
