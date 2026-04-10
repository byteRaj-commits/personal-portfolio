import { Github, Code2, Linkedin, Heart } from 'lucide-react'
import './Footer.css'

const NAV = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Stats',    href: '#stats' },
  { label: 'Contact',  href: '#contact' },
]

const LEGAL = [
  { label: 'Privacy Policy',    href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Help & Support',    href: '#contact' },
]

const SOCIALS = [
  { icon: <Github size={18} />,   href: 'https://github.com/byteRaj-commits',                    label: 'GitHub' },
  { icon: <Code2  size={18} />,   href: 'https://leetcode.com/u/Raj7753/',                        label: 'LeetCode' },
  { icon: <Linkedin size={18} />, href: '#',                                                       label: 'LinkedIn' },
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="container footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <button className="footer__logo" onClick={scrollTop}>
            Raj<span>.</span>
          </button>
          <p className="footer__tagline">
            Full Stack Developer building clean, scalable web applications.
          </p>
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="footer__social" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="footer__col">
          <h4 className="footer__col-title">Navigation</h4>
          <ul className="footer__links">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="footer__link">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Profiles */}
        <div className="footer__col">
          <h4 className="footer__col-title">Coding Profiles</h4>
          <ul className="footer__links">
            <li><a href="https://github.com/byteRaj-commits" target="_blank" rel="noreferrer" className="footer__link">GitHub</a></li>
            <li><a href="https://leetcode.com/u/Raj7753/" target="_blank" rel="noreferrer" className="footer__link">LeetCode</a></li>
            <li><a href="https://www.geeksforgeeks.org/profile/rajp18zsll" target="_blank" rel="noreferrer" className="footer__link">GeeksForGeeks</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer__col">
          <h4 className="footer__col-title">Legal</h4>
          <ul className="footer__links">
            {LEGAL.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="footer__link">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {new Date().getFullYear()} Raj. All rights reserved.
          </p>
          <p className="footer__made">
            Made with <Heart size={13} className="footer__heart" /> using React & Node.js
          </p>
        </div>
      </div>
    </footer>
  )
}
