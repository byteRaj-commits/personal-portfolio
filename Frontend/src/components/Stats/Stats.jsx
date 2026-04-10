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
      { key: 'totalSolved', label: 'Solved', format: formatSolvedWithTotal },
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
    let mounted = true

    const loadStats = (isInitial = false) => {
      fetch('/api/v1/stats')
        .then((res) => res.json())
        .then((res) => {
          if (mounted) setStats(res.data || {})
        })
        .catch(() => {})
        .finally(() => {
          if (mounted && isInitial) setLoading(false)
        })
    }

    loadStats(true)
    const timer = window.setInterval(() => loadStats(false), 60000)

    return () => {
      mounted = false
      window.clearInterval(timer)
    }
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
  const breakdown = getBreakdown(platform, data)

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
              {formatMetric(data, metric)}
            </span>
            <span className="stats__metric-label">{metric.label}</span>
          </div>
        ))}
      </div>

      {breakdown.length > 0 ? (
        <div className="stats__breakdown">
          {breakdown.map((item) => (
            <div key={item.label} className="stats__breakdown-row">
              <div className="stats__breakdown-copy">
                <span className="stats__breakdown-label">{item.label}</span>
                <span className="stats__breakdown-value">{item.value}</span>
              </div>
              {typeof item.percent === 'number' ? (
                <div className="stats__breakdown-bar">
                  <span style={{ width: `${Math.max(0, Math.min(100, item.percent))}%` }} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

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

function formatMetric(data, metric) {
  const value = data?.[metric.key]
  if (metric.format) return metric.format(value, data)
  if (value === undefined || value === null || value === '') return '0'
  return `${value}${metric.suffix || ''}`
}

function formatRank(value) {
  if (value === undefined || value === null || value === '') return 'N/A'
  return `#${Number(value).toLocaleString()}`
}

function formatSolvedWithTotal(value, data) {
  const solved = Number(value || 0)
  const total = Number(data?.totalQuestions || 0)
  if (!total) return `${solved}`
  return `${solved} / ${total}`
}

function formatFraction(value, total) {
  const current = Number(value || 0)
  const whole = Number(total || 0)
  return whole ? `${current} / ${whole}` : `${current}`
}

function getBreakdown(platform, data) {
  if (platform === 'leetcode') {
    return [
      {
        label: 'Overall',
        value: formatFraction(data.totalSolved, data.totalQuestions),
        percent: getPercent(data.totalSolved, data.totalQuestions),
      },
      {
        label: 'Easy',
        value: formatFraction(data.easySolved, data.easyTotal),
        percent: getPercent(data.easySolved, data.easyTotal),
      },
      {
        label: 'Medium',
        value: formatFraction(data.mediumSolved, data.mediumTotal),
        percent: getPercent(data.mediumSolved, data.mediumTotal),
      },
      {
        label: 'Hard',
        value: formatFraction(data.hardSolved, data.hardTotal),
        percent: getPercent(data.hardSolved, data.hardTotal),
      },
    ]
  }

  if (platform === 'github') {
    return [
      {
        label: 'Repos / Followers',
        value: `${data.publicRepos ?? 0} / ${data.followers ?? 0}`,
      },
      {
        label: 'Stars / Following',
        value: `${data.totalStars ?? 0} / ${data.following ?? 0}`,
      },
      {
        label: 'Commits / Streak',
        value: `${data.totalCommits ?? 0} / ${data.contributionStreak ?? 0}`,
      },
    ]
  }

  if (platform === 'geeksforgeeks') {
    const totalSolved =
      Number(data.school || 0) +
      Number(data.basic || 0) +
      Number(data.easy || 0) +
      Number(data.medium || 0) +
      Number(data.hard || 0)

    return [
      {
        label: 'Overall Solved',
        value: formatFraction(data.totalProblemsSolved || totalSolved, totalSolved || data.totalProblemsSolved),
        percent: getPercent(data.totalProblemsSolved || totalSolved, totalSolved || data.totalProblemsSolved),
      },
      {
        label: 'Basic',
        value: `${data.basic ?? 0}`,
      },
      {
        label: 'Easy',
        value: `${data.easy ?? 0}`,
      },
      {
        label: 'Medium',
        value: `${data.medium ?? 0}`,
      },
      {
        label: 'Hard',
        value: `${data.hard ?? 0}`,
      },
    ]
  }

  return []
}

function getPercent(value, total) {
  const current = Number(value || 0)
  const whole = Number(total || 0)
  if (!whole) return 0
  return (current / whole) * 100
}

function formatDate(value) {
  if (!value) return 'Not available'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return date.toLocaleDateString()
}
