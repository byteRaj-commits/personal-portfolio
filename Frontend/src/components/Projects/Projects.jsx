import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Layers, ArrowUpRight } from "lucide-react";
import "./Projects.css";

const CATS = ["all", "fullstack", "frontend", "backend"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/projects?limit=20&sort=-order")
      .then((r) => r.json())
      .then((res) => {
        const raw = res.data ?? res;
        const list = Array.isArray(raw)
          ? raw
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

  return (
    <section className="projects section" id="projects">
      <div className="projects__bg-text">PROJECTS</div>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">My work</span>
          <div className="projects__head">
            <h2 className="section-title">
              Featured <span>Projects</span>
            </h2>
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
  );
}

function ProjectCard({ project: p }) {
  const cardRef = useRef(null);
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
  };
  const onLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform =
        "perspective(800px) rotateX(0) rotateY(0)";
  };

  return (
    <motion.article
      className="pcard"
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
    >
      <div className="pcard__thumb">
        {p.thumbnail?.url ? (
          <img src={p.thumbnail.url} alt={p.title} />
        ) : (
          <div className="pcard__thumb-ph">
            <Layers size={36} />
          </div>
        )}
        <div className="pcard__overlay" />
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
