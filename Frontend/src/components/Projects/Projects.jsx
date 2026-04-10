import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  Layers,
  ArrowUpRight,
  Sparkles,
  X,
} from "lucide-react";
import "./Projects.css";

const CATS = ["all", "fullstack", "frontend", "backend"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    fetch("/api/v1/projects?limit=20&sort=-order")
      .then((r) => r.json())
      .then((res) => {
        const raw = res.data ?? res;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.projects)
            ? raw.projects
          : Array.isArray(raw?.docs)
            ? raw.docs
            : [];
        setProjects(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const spotlight = filtered.find((p) => p._id === selectedId) || filtered[0] || null;

  useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null);
      return;
    }
    if (!filtered.some((p) => p._id === selectedId)) {
      setSelectedId(filtered[0]._id);
    }
  }, [filtered, selectedId]);

  return (
    <section className="projects section" id="projects">
      <div className="projects__bg-text">PROJECTS</div>
      <div className="projects__scene">
        <div className="projects__orb projects__orb--violet" />
        <div className="projects__orb projects__orb--cyan" />
        <div className="projects__gridlines" />
        <div className="projects__beam projects__beam--left" />
        <div className="projects__beam projects__beam--right" />
      </div>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">My work</span>
          <div className="projects__head">
            <div className="projects__title-wrap">
              <h2 className="section-title">
                Featured <span>Projects</span>
              </h2>
              <p className="projects__lede">
                Interactive builds with layered interfaces, motion, and full-stack depth.
              </p>
            </div>
            <div className="projects__filters">
              {CATS.map((c) => (
                <button
                  key={c}
                  className={`projects__pill ${filter === c ? "projects__pill--on" : ""}`}
                  onClick={() => setFilter(c)}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="projects__grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="projects__skel" />
            ))}
          </div>
        ) : (
          <>
            {spotlight && <ProjectSpotlight project={spotlight} onOpen={() => setActiveProject(spotlight)} />}
            <motion.div
              className="projects__grid"
              layout
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <ProjectCard
                    key={p._id}
                    project={p}
                    selected={p._id === spotlight?._id}
                    onSelect={() => setSelectedId(p._id)}
                    onOpen={() => setActiveProject(p)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectSpotlight({ project: p, onOpen }) {
  return (
    <motion.article
      className="projects__spotlight"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      layout
    >
      <div className="projects__spotlight-media">
        {p.thumbnail?.url ? (
          <img src={p.thumbnail.url} alt={p.title} />
        ) : (
          <div className="projects__spotlight-ph">
            <Layers size={42} />
          </div>
        )}
        <div className="projects__spotlight-sheen" />
      </div>
      <div className="projects__spotlight-body">
        <span className="projects__spotlight-kicker">
          <Sparkles size={14} /> Project Spotlight
        </span>
        <h3 className="projects__spotlight-title">{p.title}</h3>
        <p className="projects__spotlight-desc">{p.description || p.shortDescription}</p>
        <div className="projects__spotlight-stack">
          {p.techStack?.slice(0, 6).map((t) => (
            <span key={t} className="pcard__tag">
              {t}
            </span>
          ))}
        </div>
        <div className="projects__spotlight-actions">
          <button className="btn btn-primary" onClick={onOpen}>
            <Sparkles size={15} /> Open Preview
          </button>
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCard({ project: p, selected, onSelect, onOpen }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const statusColor = {
    completed: "var(--green)",
    "in-progress": "var(--amber)",
    archived: "var(--text-3)",
  };

  const onMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(8px)`;
    card.style.setProperty("--pointer-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--pointer-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
    }
  };
  const onLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(800px) rotateX(0) rotateY(0)";
      cardRef.current.style.setProperty("--pointer-x", "50%");
      cardRef.current.style.setProperty("--pointer-y", "50%");
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  };

  return (
    <motion.article
      className={`pcard ${selected ? "pcard--selected" : ""}`}
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      layout
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onOpen}
    >
      <div ref={glowRef} className="pcard__glow" />
      <div className="pcard__thumb">
        {p.thumbnail?.url ? (
          <img src={p.thumbnail.url} alt={p.title} />
        ) : (
          <div className="pcard__thumb-ph">
            <Layers size={36} />
          </div>
        )}
        <div className="pcard__overlay" />
        <div className="pcard__scan" />
        <span
          className="pcard__status"
          style={{
            color: statusColor[p.status],
            borderColor: `${statusColor[p.status]}44`,
            background: `${statusColor[p.status]}11`,
          }}
        >
          {p.status}
        </span>
        {p.featured && (
          <span className="pcard__featured">
            <Sparkles size={12} /> Featured
          </span>
        )}
        {p.liveUrl && (
          <a
            href={p.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="pcard__live-btn"
          >
            <ArrowUpRight size={14} /> Live
          </a>
        )}
      </div>
      <div className="pcard__body">
        <div className="pcard__meta">
          <span className="pcard__cat">{p.category}</span>
          <span className="pcard__index">{String((p.order ?? 0) + 1).padStart(2, "0")}</span>
        </div>
        <h3 className="pcard__title">{p.title}</h3>
        <p className="pcard__desc">{p.shortDescription}</p>
        <div className="pcard__stack">
          {p.techStack?.slice(0, 5).map((t) => (
            <span key={t} className="pcard__tag">
              {t}
            </span>
          ))}
        </div>
        <div className="pcard__links">
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="pcard__link"
            >
              <Github size={14} /> Code
            </a>
          )}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="pcard__link pcard__link--hi"
            >
              <ExternalLink size={14} /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project: p, onClose }) {
  return (
    <motion.div
      className="projects__modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="projects__modal"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="projects__modal-close" onClick={onClose} aria-label="Close preview">
          <X size={18} />
        </button>
        <div className="projects__modal-media">
          {p.thumbnail?.url ? (
            <img src={p.thumbnail.url} alt={p.title} />
          ) : (
            <div className="projects__spotlight-ph">
              <Layers size={42} />
            </div>
          )}
        </div>
        <div className="projects__modal-body">
          <div className="pcard__meta">
            <span className="pcard__cat">{p.category}</span>
            <span className="pcard__index">{p.status}</span>
          </div>
          <h3 className="projects__modal-title">{p.title}</h3>
          <p className="projects__modal-desc">{p.description || p.shortDescription}</p>
          <div className="projects__spotlight-stack">
            {p.techStack?.map((t) => (
              <span key={t} className="pcard__tag">
                {t}
              </span>
            ))}
          </div>
          <div className="projects__spotlight-actions">
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                <Github size={15} /> Source
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <ExternalLink size={15} /> Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
