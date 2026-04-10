import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import api from '../../utils/api'
import './Stats.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Stats() {
  const [stats, setStats]   = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/stats')
      .then((r) => setStats(r.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="stats section" id="stats">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="stats__header"
        >
          <span className="section-tag">Progress</span>
          <h2 className="section-title">Coding <span>Stats</span></h2>
          <p className="stats__sub">My progress across coding platforms</p>
        </motion.div>

        <motion.div
          className="stats__grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* LeetCode */}
          <motion.div variants={fadeUp} className="stat-card stat-card--lc">
            <div className="stat-card__head">
              <div className="stat-card__logo stat-card__logo--lc">LC</div>
              <div>
                <h3 className="stat-card__platform">LeetCode</h3>
                <span className="stat-card__handle">@{stats.leetcode?.username || 'Raj7753'}</span>
              </div>
              <a href={stats.leetcode?.profileUrl || 'https://leetcode.com/u/Raj7753/'} target="_blank" rel="noreferrer" className="stat-card__ext">
                <ExternalLink size={15} />
              </a>
            </div>

            <div className="stat-card__big">
              <span className="stat-card__num">{stats.leetcode?.totalSolved || 0}</span>
              <span className="stat-card__label">Problems Solved</span>
            </div>

            <div className="stat-card__breakdown">
              <DiffBadge label="Easy"   count={stats.leetcode?.easySolved   || 0} color="var(--green)" />
              <DiffBadge label="Medium" count={stats.leetcode?.mediumSolved || 0} color="var(--amber)" />
              <DiffBadge label="Hard"   count={stats.leetcode?.hardSolved   || 0} color="var(--coral)" />
            </div>

            {stats.leetcode?.ranking > 0 && (
              <div className="stat-card__row">
                <span className="stat-card__row-label">Global Rank</span>
                <span className="stat-card__row-val">#{stats.leetcode.ranking.toLocaleString()}</span>
              </div>
            )}
            {stats.leetcode?.streak > 0 && (
              <div className="stat-card__row">
                <span className="stat-card__row-label">Streak</span>
                <span className="stat-card__row-val">{stats.leetcode.streak} days 🔥</span>
              </div>
            )}
          </motion.div>

          {/* GitHub */}
          <motion.div variants={fadeUp} className="stat-card stat-card--gh">
            <div className="stat-card__head">
              <div className="stat-card__logo stat-card__logo--gh">GH</div>
              <div>
                <h3 className="stat-card__platform">GitHub</h3>
                <span className="stat-card__handle">@{stats.github?.username || 'byteRaj-commits'}</span>
              </div>
              <a href={stats.github?.profileUrl || 'https://github.com/byteRaj-commits'} target="_blank" rel="noreferrer" className="stat-card__ext">
                <ExternalLink size={15} />
              </a>
            </div>

            <div className="stat-card__mini-grid">
              <MiniStat label="Repos"     value={stats.github?.publicRepos        || 0} />
              <MiniStat label="Stars"     value={stats.github?.totalStars         || 0} />
              <MiniStat label="Followers" value={stats.github?.followers           || 0} />
              <MiniStat label="Commits"   value={stats.github?.totalCommits        || 0} />
            </div>

            {stats.github?.topLanguages?.length > 0 && (
              <div className="stat-card__langs">
                <span className="stat-card__row-label">Top Languages</span>
                <div className="stat-card__lang-list">
                  {stats.github.topLanguages.slice(0, 4).map((l) => (
                    <span key={l.name} className="stat-card__lang-tag"
                      style={{ background: `${l.color}22`, border: `1px solid ${l.color}44`, color: l.color }}>
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stats.github?.contributionStreak > 0 && (
              <div className="stat-card__row">
                <span className="stat-card__row-label">Streak</span>
                <span className="stat-card__row-val">{stats.github.contributionStreak} days 🔥</span>
              </div>
            )}
          </motion.div>

          {/* GeeksForGeeks */}
          <motion.div variants={fadeUp} className="stat-card stat-card--gfg">
            <div className="stat-card__head">
              <div className="stat-card__logo stat-card__logo--gfg">GfG</div>
              <div>
                <h3 className="stat-card__platform">GeeksForGeeks</h3>
                <span className="stat-card__handle">@{stats.geeksforgeeks?.username || 'rajp18zsll'}</span>
              </div>
              <a href={stats.geeksforgeeks?.profileUrl || 'https://www.geeksforgeeks.org/profile/rajp18zsll'} target="_blank" rel="noreferrer" className="stat-card__ext">
                <ExternalLink size={15} />
              </a>
            </div>

            <div className="stat-card__big">
              <span className="stat-card__num">{stats.geeksforgeeks?.totalProblemsSolved || 0}</span>
              <span className="stat-card__label">Problems Solved</span>
            </div>

            <div className="stat-card__breakdown">
              <DiffBadge label="School" count={stats.geeksforgeeks?.school || 0} color="#94a3b8" />
              <DiffBadge label="Basic"  count={stats.geeksforgeeks?.basic  || 0} color="#60a5fa" />
              <DiffBadge label="Easy"   count={stats.geeksforgeeks?.easy   || 0} color="var(--green)" />
              <DiffBadge label="Medium" count={stats.geeksforgeeks?.medium || 0} color="var(--amber)" />
              <DiffBadge label="Hard"   count={stats.geeksforgeeks?.hard   || 0} color="var(--coral)" />
            </div>

            {stats.geeksforgeeks?.codingScore > 0 && (
              <div className="stat-card__row">
                <span className="stat-card__row-label">Coding Score</span>
                <span className="stat-card__row-val">{stats.geeksforgeeks.codingScore}</span>
              </div>
            )}
            {stats.geeksforgeeks?.streak > 0 && (
              <div className="stat-card__row">
                <span className="stat-card__row-label">Streak</span>
                <span className="stat-card__row-val">{stats.geeksforgeeks.streak} days 🔥</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function DiffBadge({ label, count, color }) {
  return (
    <div className="diff-badge" style={{ '--c': color }}>
      <span className="diff-badge__count">{count}</span>
      <span className="diff-badge__label">{label}</span>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <span className="mini-stat__val">{value.toLocaleString()}</span>
      <span className="mini-stat__label">{label}</span>
    </div>
  )
}
