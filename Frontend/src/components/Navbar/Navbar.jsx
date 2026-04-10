import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href) => {
    setActive(href);
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar__inner container">
        <button
          className="navbar__logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="navbar__logo-bracket">&lt;</span>
          Raj
          <span className="navbar__logo-bracket">/&gt;</span>
        </button>

        <nav className="navbar__links">
          {links.map((l) => (
            <button
              key={l.href}
              className={`navbar__link ${active === l.href ? "navbar__link--active" : ""}`}
              onClick={() => go(l.href)}
            >
              {l.label}
              {active === l.href && (
                <motion.span
                  layoutId="nav-indicator"
                  className="navbar__indicator"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="navbar__right">
          <button
            className="navbar__cta btn btn-primary"
            onClick={() => go("#contact")}
          >
            Hire Me
          </button>
          <button className="navbar__ham" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l.href}
                className="navbar__mob-link"
                onClick={() => go(l.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {l.label}
              </motion.button>
            ))}
            <button className="btn btn-primary" onClick={() => go("#contact")}>
              Hire Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
