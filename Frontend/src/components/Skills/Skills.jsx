import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
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
  frontend: { label: "Frontend", icon: "</>" },
  backend: { label: "Backend", icon: "[ ]" },
  database: { label: "Database", icon: "DB" },
  tools: { label: "Tools", icon: "++" },
  other: { label: "Other", icon: "*" },
};

const SKILL_ASSETS = {
  c: "https://cdn.simpleicons.org/c/239120",
  "c++": "https://cdn.simpleicons.org/cplusplus/00599C",
  java: "https://cdn.simpleicons.org/openjdk/EA2D2E",
  javascript: "https://cdn.simpleicons.org/javascript/F7DF1E",
  html: "https://cdn.simpleicons.org/html5/E34F26",
  css: "https://cdn.simpleicons.org/css/1572B6",
  react: "https://cdn.simpleicons.org/react/61DAFB",
  "node.js": "https://cdn.simpleicons.org/nodedotjs/5FA04E",
  "express.js": "https://cdn.simpleicons.org/express/FFFFFF",
  mongodb: "https://cdn.simpleicons.org/mongodb/47A248",
  figma: "https://cdn.simpleicons.org/figma/F24E1E",
  "git / github": "https://cdn.simpleicons.org/github/FFFFFF",
  "ai prompting": "https://cdn.simpleicons.org/openai/FFFFFF",
};

export default function Skills() {
  const [grouped, setGrouped] = useState({});
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/skills").then((r) => r.json()),
      fetch("/api/v1/projects?limit=50").then((r) => r.json()),
    ])
      .then(([skillsRes, projectsRes]) => {
        const map = {};
        (skillsRes.data || []).forEach((g) => {
          map[g._id] = g.skills;
        });
        setGrouped(map);

        const projectData = projectsRes.data?.projects || projectsRes.data || [];
        setProjects(Array.isArray(projectData) ? projectData : []);
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

  const skillsById = useMemo(
    () => Object.fromEntries(marqueeSkills.map((skill) => [skill._id, skill])),
    [marqueeSkills]
  );

  const selectedSkill = activeSkill ? skillsById[activeSkill] || null : null;

  const relatedProjects = useMemo(() => {
    if (!selectedSkill) return [];
    return projects.filter((project) =>
      (project.techStack || []).some(
        (tech) => tech.toLowerCase() === selectedSkill.name.toLowerCase()
      )
    );
  }, [projects, selectedSkill]);

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
                <button
                  key={`${skill._id || skill.name}-${index}`}
                  className="skills__marquee-chip"
                  onClick={() => skill._id && setActiveSkill(skill._id)}
                  type="button"
                >
                  <SkillVisual skill={skill} category={skill.category} className="skills__marquee-icon" />
                  <span className="skills__marquee-name">{skill.name}</span>
                </button>
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
                    {CATEGORY_META[cat]?.icon || "*"}
                  </span>
                  <h3 className="skills__cat-name">
                    {CATEGORY_META[cat]?.label || cat}
                  </h3>
                </div>
                <div className="skills__list skills__list--cards">
                  {(grouped[cat] || []).map((s, si) => (
                    <SkillCard
                      key={s._id}
                      skill={{ ...s, category: cat }}
                      delay={si * 0.06}
                      onOpen={() => setActiveSkill(s._id)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedSkill ? (
          <SkillModal
            skill={selectedSkill}
            projects={relatedProjects}
            onClose={() => setActiveSkill(null)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function SkillCard({ skill, delay, onOpen }) {
  return (
    <motion.div
      className="skillcard"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="skillcard__head">
        <SkillVisual skill={skill} category={skill.category} className="skillcard__icon" />
        <div>
          <div className="skillcard__name">{skill.name}</div>
          <div className="skillcard__meta">{CATEGORY_META[skill.category]?.label || skill.category}</div>
        </div>
      </div>
      <div className="skillcard__foot">
        <span className="skillcard__pct">{skill.proficiency}%</span>
        <span className="skillcard__open">Tap to view</span>
      </div>
    </motion.div>
  );
}

function SkillVisual({ skill, category, className }) {
  const src = skill.icon || SKILL_ASSETS[skill.name.toLowerCase()];

  if (src && /^https?:\/\//.test(src)) {
    return <img src={src} alt={skill.name} className={className} loading="lazy" />;
  }

  return <span className={className}>{src || CATEGORY_META[category]?.icon || "*"}</span>;
}

function SkillModal({ skill, projects, onClose }) {
  return (
    <motion.div
      className="skills__modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="skills__modal"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.96 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="skills__modal-close" onClick={onClose} type="button" aria-label="Close skill details">
          <X size={18} />
        </button>
        <div className="skills__modal-head">
          <SkillVisual skill={skill} category={skill.category} className="skills__modal-icon" />
          <div>
            <div className="skills__modal-kicker">{CATEGORY_META[skill.category]?.label || skill.category}</div>
            <h3 className="skills__modal-title">{skill.name}</h3>
          </div>
        </div>

        <div className="skills__modal-section">
          <div className="skills__modal-row">
            <span>Proficiency</span>
            <strong>{skill.proficiency}%</strong>
          </div>
          <div className="skills__modal-track">
            <span style={{ width: `${skill.proficiency}%` }} />
          </div>
        </div>

        <div className="skills__modal-section">
          <div className="skills__modal-subtitle">Used In Projects</div>
          {projects.length ? (
            <div className="skills__project-list">
              {projects.map((project) => (
                <a
                  key={project._id}
                  href={project.liveUrl || project.githubUrl || "#projects"}
                  target={project.liveUrl || project.githubUrl ? "_blank" : undefined}
                  rel={project.liveUrl || project.githubUrl ? "noreferrer" : undefined}
                  className="skills__project-chip"
                >
                  <span>{project.title}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          ) : (
            <p className="skills__modal-empty">No linked projects found yet for this stack.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
