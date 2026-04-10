import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Github, Trophy, Star, GitCommitHorizontal, Flame } from 'lucide-react'
import './Stats.css'

const PLATFORM_META = {
  leetcode: {
    label: 'LeetCode',
    icon: Code2,
    accent: 'var(--amber)',
    metrics: [
      { key: 'totalSolved', label: 'Solved' },
      { key: 'ranking', label: 'Ranking', format: formatRank },
      { key: 'acceptanceRate', label: 'Acceptance', suffix: '%' },
      { key: 'streak', label: 'Streak' },
    ],
  },
  github: {
    label: 'GitHub',
    icon: Github,
    accent: 'var(--accent-3)',
    metrics: [
      { key: 'publicRepos', label: 'Repos' },
      { key: 'totalStars', label: 'Stars' },
      { key: 'followers', label: 'Followers' },
      { key: 'totalCommits', label: 'Commits' },
    ],
  },
  geeksforgeeks: {
    label: 'GeeksForGeeks',
    icon: Trophy,
    accent: 'var(--green)',
    metrics: [
      { key: 'totalProblemsSolved', label: 'Solved' },
      { key: 'codingScore', label: 'Coding Score' },
      { key: 'instituteRank', label: 'Rank', format: formatRank },
      { key: 'streak', label: 'Streak' },
    ],
  },
}

export default function Stats() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/stats')
      .then((res) => res.json())
      .then((res) => setStats(res.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const platforms = Object.keys(PLATFORM_META).filter((key) => stats[key])

  return (
    <section className="stats section" id="stats">
      <div className="stats__bg-text">STATS</div>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="stats__head"
        >
          <span className="section-tag">Numbers that matter</span>
          <h2 className="section-title">Coding <span>Footprint</span></h2>
          <p className="stats__sub">
            A quick snapshot of progress across practice platforms and open-source work.
          </p>
        </motion.div>

        {loading ? (
          <div className="stats__grid">
            {[1, 2, 3].map((i) => <div key={i} className="stats__skel" />)}
          </div>
        ) : platforms.length === 0 ? (
          <p className="stats__empty">No stats are available yet. Add them from the backend admin flow.</p>
        ) : (
          <div className="stats__grid">
            {platforms.map((platform, index) => (
              <PlatformCard
                key={platform}
                platform={platform}
                data={stats[platform]}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function PlatformCard({ platform, data, index }) {
  const meta = PLATFORM_META[platform]
  const Icon = meta.icon

  return (
    <motion.article
      className="stats__card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ '--stats-accent': meta.accent }}
    >
      <div className="stats__card-top">
        <div className="stats__platform">
          <span className="stats__icon"><Icon size={18} /></span>
          <div>
            <h3>{meta.label}</h3>
            <p>{data.username || 'Profile synced'}</p>
          </div>
        </div>
        {data.profileUrl ? (
          <a href={data.profileUrl} target="_blank" rel="noreferrer" className="stats__link">
            View
          </a>
        ) : null}
      </div>

      <div className="stats__metrics">
        {meta.metrics.map((metric) => (
          <div key={metric.key} className="stats__metric">
            <span className="stats__metric-value">
              {formatMetric(data[metric.key], metric)}
            </span>
            <span className="stats__metric-label">{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="stats__highlights">
        {platform === 'github' ? (
          <>
            <Highlight icon={<Star size={14} />} text={`Top languages: ${(data.topLanguages || []).slice(0, 3).join(', ') || 'Not added yet'}`} />
            <Highlight icon={<GitCommitHorizontal size={14} />} text={`Following ${data.following ?? 0} developers`} />
          </>
        ) : (
          <>
            <Highlight icon={<Flame size={14} />} text={`Current streak: ${data.streak ?? 0}`} />
            <Highlight icon={<Trophy size={14} />} text={`Last updated: ${formatDate(data.lastUpdated)}`} />
          </>
        )}
      </div>
    </motion.article>
  )
}

function Highlight({ icon, text }) {
  return (
    <div className="stats__highlight">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function formatMetric(value, metric) {
  if (metric.format) return metric.format(value)
  if (value === undefined || value === null || value === '') return '0'
  return `${value}${metric.suffix || ''}`
}

function formatRank(value) {
  if (value === undefined || value === null || value === '') return 'N/A'
  return `#${Number(value).toLocaleString()}`
}

function formatDate(value) {
  if (!value) return 'Not available'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return date.toLocaleDateString()
}
