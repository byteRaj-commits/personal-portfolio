import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Github, ExternalLink } from 'lucide-react'
import api from '../../utils/api'
import './About.css'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api.get('/profile').then((r) => setProfile(r.data)).catch(() => {})
  }, [])

  const facts = [
    { label: 'Location',  value: profile?.location || 'India',                icon: <MapPin size={15} /> },
    { label: 'Email',     value: profile?.email || '—',                        icon: <Mail   size={15} /> },
    { label: 'GitHub',    value: '@byteRaj-commits',                           icon: <Github size={15} /> },
  ]

  return (
    <section className="about section" id="about">
      <div className="container">
        <motion.div
          className="about__grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* Text side */}
          <div className="about__text">
            <motion.span variants={fadeUp} className="section-tag">About me</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Who I <span>am</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="about__para">
              {profile?.about ||
                "I'm a full-stack developer with hands-on experience building production-level web applications using React, Node.js, Express, and MongoDB. I enjoy solving DSA problems on LeetCode and GeeksForGeeks, contributing to open-source, and exploring AI integrations."}
            </motion.p>
            <motion.div variants={fadeUp} className="about__facts">
              {facts.map((f) => (
                <div key={f.label} className="about__fact">
                  <span className="about__fact-icon">{f.icon}</span>
                  <span className="about__fact-label">{f.label}</span>
                  <span className="about__fact-value">{f.value}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="about__actions">
              {profile?.resume?.url && (
                <a href={profile.resume.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <ExternalLink size={15} /> Download Resume
                </a>
              )}
              <a
                href={profile?.social?.github || 'https://github.com/byteRaj-commits'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <Github size={15} /> GitHub Profile
              </a>
            </motion.div>
          </div>

          {/* Stats cards */}
          <motion.div variants={fadeUp} className="about__cards">
            {[
              { num: '6+',    label: 'Projects Built' },
              { num: '13+',   label: 'Skills Mastered' },
              { num: '100+',  label: 'Problems Solved' },
              { num: '1k+',   label: 'Lines of Code' },
            ].map((c) => (
              <div key={c.label} className="about__card">
                <span className="about__card-num">{c.num}</span>
                <span className="about__card-label">{c.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
