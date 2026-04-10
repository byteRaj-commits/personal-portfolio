import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Skills.css";

const CATEGORY_ORDER = [
  "languages",
  "frontend",
  "backend",
  "database",
  "tools",
];
const CATEGORY_META = {
  languages: { label: "Languages", icon: "{ }" },
  frontend: { label: "Frontend", icon: "◈" },
  backend: { label: "Backend", icon: "⚙" },
  database: { label: "Database", icon: "▣" },
  tools: { label: "Tools", icon: "⬡" },
  other: { label: "Other", icon: "◉" },
};

export default function Skills() {
  const [grouped, setGrouped] = useState({});
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/skills")
      .then((r) => r.json())
      .then((res) => {
        const map = {};
        (res.data || []).forEach((g) => {
          map[g._id] = g.skills;
        });
        setGrouped(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cats = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];
  const shown = active === "all" ? cats : cats.filter((c) => c === active);
  const marqueeSkills = shown.flatMap((cat) =>
    (grouped[cat] || []).map((skill) => ({
      ...skill,
      category: cat,
    }))
  );

  return (
    <section className="skills section" id="skills">
      <div className="skills__bg-text">SKILLS</div>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Expertise</span>
          <h2 className="section-title">
            Tech <span>Stack</span>
          </h2>
        </motion.div>

        {!loading && marqueeSkills.length > 0 ? (
          <div className="skills__marquee-wrap">
            <div className="skills__marquee-fade skills__marquee-fade--left" />
            <div className="skills__marquee-fade skills__marquee-fade--right" />
            <div className="skills__marquee-track">
              {[...marqueeSkills, ...marqueeSkills].map((skill, index) => (
                <div key={`${skill._id || skill.name}-${index}`} className="skills__marquee-chip">
                  <span className="skills__marquee-icon">
                    {skill.icon || CATEGORY_META[skill.category]?.icon || "◉"}
                  </span>
                  <span className="skills__marquee-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="skills__tabs">
          <button
            className={`skills__tab ${active === "all" ? "skills__tab--active" : ""}`}
            onClick={() => setActive("all")}
          >
            All
          </button>
          {cats.map((c) => (
            <button
              key={c}
              className={`skills__tab ${active === c ? "skills__tab--active" : ""}`}
              onClick={() => setActive(c)}
            >
              {CATEGORY_META[c]?.label || c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="skills__loading">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skills__skel" />
            ))}
          </div>
        ) : (
          <div className="skills__grid">
            {shown.map((cat, ci) => (
              <motion.div
                key={cat}
                className="skills__cat"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.08 }}
              >
                <div className="skills__cat-head">
                  <span className="skills__cat-icon">
                    {CATEGORY_META[cat]?.icon || "◉"}
                  </span>
                  <h3 className="skills__cat-name">
                    {CATEGORY_META[cat]?.label || cat}
                  </h3>
                </div>
                <div className="skills__list">
                  {(grouped[cat] || []).map((s, si) => (
                    <SkillBar key={s._id} skill={s} delay={si * 0.06} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SkillBar({ skill, delay }) {
  const [filled, setFilled] = useState(false);
  return (
    <motion.div
      className="sbar"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onViewportEnter={() => setTimeout(() => setFilled(true), 200)}
    >
      <div className="sbar__top">
        <span className="sbar__name">{skill.name}</span>
        <span className="sbar__pct">{skill.proficiency}%</span>
      </div>
      <div className="sbar__track">
        <motion.div
          className="sbar__fill"
          initial={{ width: 0 }}
          animate={{ width: filled ? `${skill.proficiency}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
        <motion.div
          className="sbar__glow"
          initial={{ left: 0 }}
          animate={{ left: filled ? `${skill.proficiency}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
