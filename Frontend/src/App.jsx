// import { BrowserRouter } from 'react-router-dom'
// import Navbar from './components/Navbar/Navbar'
// import Hero from './components/Hero/Hero'
// import About from './components/About/About'
// import Projects from './components/Projects/Projects'
// import Skills from './components/Skills/Skills'
// import Stats from './components/Stats/Stats'
// import Contact from './components/Contact/Contact'
// import AIChat from './components/AI/AIChat'
// import Footer from './components/Footer/Footer'

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <main>
//         <Hero />
//         <About />
//         <Projects />
//         <Skills />
//         <Stats />
//         <Contact />
//       </main>
//       <Footer />
//       <AIChat />
//     </BrowserRouter>
//   )
// }

import { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Stats from "./components/Stats/Stats";
import Contact from "./components/Contact/Contact";
import AIChat from "./components/AI/AIChat";
import Footer from "./components/Footer/Footer";

function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + "px";
        ringRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Stats />
        <Contact />
      </main>
      <Footer />
      <AIChat />
    </BrowserRouter>
  );
}
