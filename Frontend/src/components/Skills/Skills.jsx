import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import './Skills.css'

const CATEGORY_ORDER = ['languages', 'frontend', 'backend', 'database', 'tools']

const CATEGORY_META = {
  languages: { label: 'Languages',  emoji: '💻' },
  frontend:  { label: 'Frontend',   emoji: '🎨' },
  backend:   { label: 'Backend',    emoji: '⚙️' },
  database:  { label: 'Database',   emoji: '🗄️' },
  tools:     { label: 'Tools',      emoji: '🛠️' },
  other:     { label: 'Other',      emoji: '📦' },
}

export default function Skills() {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/skills')
      .then((res) => {
        // API returns array of { _id: category, skills: [...] }
        const data = res.data || []
        const map = {}
        data.forEach((g) => { map[g._id] = g.skills })
        setGrouped(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ]

  return (
    <section className="skills section" id="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="skills__header"
        >
          <span className="section-tag">Expertise</span>
          <h2 className="section-title">My <span>Skills</span></h2>
          <p className="skills__sub">Technologies I work with daily to build great products</p>
        </motion.div>

        {loading ? (
          <div className="skills__loading">
            {[1,2,3].map((i) => <div key={i} className="skills__skeleton" />)}
          </div>
        ) : (
          <div className="skills__categories">
            {categories.map((cat, ci) => (
              <motion.div
                key={cat}
                className="skills__category"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
              >
                <div className="skills__cat-header">
                  <span className="skills__cat-emoji">{CATEGORY_META[cat]?.emoji || '📦'}</span>
                  <h3 className="skills__cat-title">{CATEGORY_META[cat]?.label || cat}</h3>
                </div>
                <div className="skills__list">
                  {(grouped[cat] || []).map((skill, si) => (
                    <SkillBar key={skill._id} skill={skill} delay={si * 0.05} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function SkillBar({ skill, delay }) {
  const [filled, setFilled] = useState(false)

  return (
    <motion.div
      className="skill-bar"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onViewportEnter={() => setTimeout(() => setFilled(true), 200)}
    >
      <div className="skill-bar__top">
        <span className="skill-bar__name">{skill.name}</span>
        <span className="skill-bar__pct">{skill.proficiency}%</span>
      </div>
      <div className="skill-bar__track">
        <motion.div
          className="skill-bar__fill"
          initial={{ width: 0 }}
          animate={{ width: filled ? `${skill.proficiency}%` : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </motion.div>
  )
}
