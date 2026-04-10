import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Layers } from 'lucide-react'
import api from '../../utils/api'
import './Projects.css'

const CATS = ['all', 'fullstack', 'frontend', 'backend']

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Projects() {
  const [projects, setProjects]   = useState([])
  const [filter, setFilter]       = useState('all')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    api.get('/projects?limit=20&sort=-order')
      .then((r) => setProjects(r.data?.docs || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">My work</span>
          <div className="projects__head">
            <h2 className="section-title">Featured <span>Projects</span></h2>
            <div className="projects__filters">
              {CATS.map((c) => (
                <button
                  key={c}
                  className={`projects__filter ${filter === c ? 'projects__filter--active' : ''}`}
                  onClick={() => setFilter(c)}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="projects__loading">
            {[1,2,3].map((i) => <div key={i} className="projects__skeleton" />)}
          </div>
        ) : (
          <motion.div
            className="projects__grid"
            layout
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <AnimatePresence>
              {filtered.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project: p }) {
  const statusColor = {
    completed:   'var(--green)',
    'in-progress': 'var(--amber)',
    archived:    'var(--text-3)',
  }

  return (
    <motion.article
      className="pcard"
      variants={fadeUp}
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className="pcard__thumb">
        {p.thumbnail?.url ? (
          <img src={p.thumbnail.url} alt={p.title} />
        ) : (
          <div className="pcard__thumb-placeholder">
            <Layers size={40} />
          </div>
        )}
        <div className="pcard__overlay" />
        <span
          className="pcard__status"
          style={{ background: `${statusColor[p.status]}22`, color: statusColor[p.status], borderColor: `${statusColor[p.status]}44` }}
        >
          {p.status}
        </span>
      </div>

      {/* Body */}
      <div className="pcard__body">
        <h3 className="pcard__title">{p.title}</h3>
        <p className="pcard__desc">{p.shortDescription}</p>

        <div className="pcard__stack">
          {p.techStack?.slice(0, 5).map((t) => (
            <span key={t} className="pcard__tag">{t}</span>
          ))}
          {p.techStack?.length > 5 && <span className="pcard__tag">+{p.techStack.length - 5}</span>}
        </div>

        <div className="pcard__links">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="pcard__link">
              <Github size={15} /> Code
            </a>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="pcard__link pcard__link--primary">
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
