import { Github, Code2, Linkedin, ArrowUp } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">&lt;Raj/&gt;</div>
          <p className="footer__tag">Building the web, one commit at a time.</p>
          <div className="footer__socials">
            {[
              {
                icon: <Github size={16} />,
                h: "https://github.com/byteRaj-commits",
              },
              {
                icon: <Code2 size={16} />,
                h: "https://leetcode.com/u/Raj7753/",
              },
              { icon: <Linkedin size={16} />, h: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.h}
                target="_blank"
                rel="noreferrer"
                className="footer__social"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Navigate</h4>
          {["About", "Projects", "Skills", "Stats", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="footer__link">
              {l}
            </a>
          ))}
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Profiles</h4>
          <a
            href="https://github.com/byteRaj-commits"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <a
            href="https://leetcode.com/u/Raj7753/"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            LeetCode
          </a>
          <a
            href="https://www.geeksforgeeks.org/profile/rajp18zsll"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            GeeksForGeeks
          </a>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Legal</h4>
          <a href="#" className="footer__link">
            Privacy Policy
          </a>
          <a href="#" className="footer__link">
            Terms of Use
          </a>
          <a href="#contact" className="footer__link">
            Support
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bot-inner">
          <p>© {new Date().getFullYear()} Raj. All rights reserved.</p>
          <button
            className="footer__top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp size={14} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
