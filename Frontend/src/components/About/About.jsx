// import { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
// import { MapPin, Mail, Github, ExternalLink } from 'lucide-react'
// import api from '../../utils/api'
// import './About.css'

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
// }

// export default function About() {
//   const [profile, setProfile] = useState(null)

//   useEffect(() => {
//     api.get('/profile').then((r) => setProfile(r.data)).catch(() => {})
//   }, [])

//   const facts = [
//     { label: 'Location',  value: profile?.location || 'India',                icon: <MapPin size={15} /> },
//     { label: 'Email',     value: profile?.email || '—',                        icon: <Mail   size={15} /> },
//     { label: 'GitHub',    value: '@byteRaj-commits',                           icon: <Github size={15} /> },
//   ]

//   return (
//     <section className="about section" id="about">
//       <div className="container">
//         <motion.div
//           className="about__grid"
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.2 }}
//           variants={{ show: { transition: { staggerChildren: 0.12 } } }}
//         >
//           {/* Text side */}
//           <div className="about__text">
//             <motion.span variants={fadeUp} className="section-tag">About me</motion.span>
//             <motion.h2 variants={fadeUp} className="section-title">
//               Who I <span>am</span>
//             </motion.h2>
//             <motion.p variants={fadeUp} className="about__para">
//               {profile?.about ||
//                 "I'm a full-stack developer with hands-on experience building production-level web applications using React, Node.js, Express, and MongoDB. I enjoy solving DSA problems on LeetCode and GeeksForGeeks, contributing to open-source, and exploring AI integrations."}
//             </motion.p>
//             <motion.div variants={fadeUp} className="about__facts">
//               {facts.map((f) => (
//                 <div key={f.label} className="about__fact">
//                   <span className="about__fact-icon">{f.icon}</span>
//                   <span className="about__fact-label">{f.label}</span>
//                   <span className="about__fact-value">{f.value}</span>
//                 </div>
//               ))}
//             </motion.div>
//             <motion.div variants={fadeUp} className="about__actions">
//               {profile?.resume?.url && (
//                 <a href={profile.resume.url} target="_blank" rel="noreferrer" className="btn btn-primary">
//                   <ExternalLink size={15} /> Download Resume
//                 </a>
//               )}
//               <a
//                 href={profile?.social?.github || 'https://github.com/byteRaj-commits'}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="btn btn-outline"
//               >
//                 <Github size={15} /> GitHub Profile
//               </a>
//             </motion.div>
//           </div>

//           {/* Stats cards */}
//           <motion.div variants={fadeUp} className="about__cards">
//             {[
//               { num: '6+',    label: 'Projects Built' },
//               { num: '13+',   label: 'Skills Mastered' },
//               { num: '100+',  label: 'Problems Solved' },
//               { num: '1k+',   label: 'Lines of Code' },
//             ].map((c) => (
//               <div key={c.label} className="about__card">
//                 <span className="about__card-num">{c.num}</span>
//                 <span className="about__card-label">{c.label}</span>
//               </div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Github, ExternalLink, Terminal } from "lucide-react";
import api from "../../utils/api";
import "./About.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function About() {
  const [profile, setProfile] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    api
      .get("/profile")
      .then((r) => setProfile(r.data))
      .catch(() => {});
  }, []);

  // 3D tilt effect on card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
      card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
    };
    const onLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="about section" id="about">
      <div className="about__bg-text">ABOUT</div>
      <div className="container">
        <motion.div
          className="about__grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <div className="about__left">
            <motion.span variants={fadeUp} className="section-tag">
              About me
            </motion.span>
            <motion.h2 variants={fadeUp} className="section-title">
              Who am <span>I?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="about__para">
              {profile?.about ||
                "I'm a full-stack developer with hands-on experience building production-level web applications using React, Node.js, Express, and MongoDB. I enjoy solving DSA problems and exploring AI integrations."}
            </motion.p>
            <motion.div variants={fadeUp} className="about__terminal">
              <div className="about__term-bar">
                <span />
                <span />
                <span />
                <span className="about__term-title">raj@portfolio ~</span>
              </div>
              <div className="about__term-body">
                <div>
                  <span className="about__term-prompt">$</span> whoami
                </div>
                <div className="about__term-out">
                  {profile?.name || "Raj"} —{" "}
                  {profile?.title || "Full Stack Developer"}
                </div>
                <div>
                  <span className="about__term-prompt">$</span> location
                </div>
                <div className="about__term-out">
                  📍 {profile?.location || "India"}
                </div>
                <div>
                  <span className="about__term-prompt">$</span> status
                </div>
                <div className="about__term-out about__term-green">
                  ✓ Available for work
                </div>
                <div className="about__term-cursor">▊</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="about__actions">
              {profile?.resume?.url && (
                <a
                  href={profile.resume.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <ExternalLink size={14} /> Resume
                </a>
              )}
              <a
                href={
                  profile?.social?.github ||
                  "https://github.com/byteRaj-commits"
                }
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <Github size={14} /> GitHub
              </a>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="about__right">
            <div className="about__cards-3d" ref={cardRef}>
              {[
                { num: "6+", label: "Projects Built", color: "var(--accent)" },
                { num: "13+", label: "Skills", color: "var(--accent-3)" },
                {
                  num: "100+",
                  label: "Problems Solved",
                  color: "var(--green)",
                },
                { num: "1yr+", label: "Experience", color: "var(--amber)" },
              ].map((c) => (
                <div key={c.label} className="about__card">
                  <span className="about__card-num" style={{ color: c.color }}>
                    {c.num}
                  </span>
                  <span className="about__card-label">{c.label}</span>
                  <div
                    className="about__card-glow"
                    style={{ background: c.color }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
