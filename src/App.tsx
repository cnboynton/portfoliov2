import { useRef, useEffect } from 'react'
import ParticlesBackground, { type ParticlesBackgroundHandle } from './components/ParticlesBackground'
import ScrollController, { type ScrollControllerHandle } from './components/ScrollController'
import Hero from './components/Hero'
import About from './components/About'

function App() {
  const particlesRef = useRef<ParticlesBackgroundHandle>(null);
  const scrollControllerRef = useRef<ScrollControllerHandle>(null);

  // Force scroll to top on mount/refresh
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const handleVirtualScroll = (progress: number) => {
    particlesRef.current?.setVirtualScroll(progress);
  };

  const handleReset = () => {
    scrollControllerRef.current?.reset();
  };

  return (
    <div className="relative">
      <ScrollController ref={scrollControllerRef} onVirtualScroll={handleVirtualScroll} />
      <ParticlesBackground ref={particlesRef} />
      
      {/* Hero Section */}
      <Hero onArrowClick={handleReset} />
      
      {/* About Section - Overlays Hero with contact buttons */}
      <About />
      
      {/* Spacer to enable scrolling */}
      <div className="h-screen"></div>
    </div>
  )
}

export default App
