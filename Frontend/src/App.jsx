import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Skills from './components/Skills/Skills'
import Stats from './components/Stats/Stats'
import Contact from './components/Contact/Contact'
import AIChat from './components/AI/AIChat'
import Footer from './components/Footer/Footer'

export default function App() {
  return (
    <BrowserRouter>
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
  )
}
