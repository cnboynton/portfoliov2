import { useEffect, useRef } from 'react';

export default function About() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Start About animation after Hero has faded more (later trigger)
      const scrollProgress = Math.max(0, Math.min((scrollY - windowHeight * 0.5) / (windowHeight * 0.3), 1));

      // Fade in and slide up
      contentRef.current.style.opacity = `${scrollProgress}`;
      contentRef.current.style.transform = `translateY(${(1 - scrollProgress) * 50}px)`;
    };

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-20">
      <div 
        ref={contentRef}
        className="max-w-3xl px-8 opacity-0 pointer-events-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-medium mb-6">About Me</h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
        I'm Chester — a varsity student-athlete passionate about the intersection of technology and creativity.
        I've gained experience at Shopify building full-stack systems that power real-world logistics, 
        and am now looking for my next team to learn, build, and grow with.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <a
            href="mailto:chester.boynton@gmail.com"
            className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            Email
          </a>
          <a
            href="https://github.com/cnboynton"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/chesterboynton"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            LinkedIn
          </a>
          <a
            href="https://docs.google.com/document/d/15Ic85vuDtW7OfdiqtPtez8UkdUKLTLeRDOfihe_dsjs/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            Resume
          </a>
        </div>
      </div>
    </section>
  );
}

