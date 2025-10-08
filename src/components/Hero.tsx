import { useEffect, useRef, useState } from 'react';

interface HeroProps {
  onArrowClick?: () => void;
}

export default function Hero({ onArrowClick }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !arrowRef.current) return;

      const scrollY = window.scrollY;
      const scrollProgress = Math.min(scrollY / (window.innerHeight * 0.7), 1);

      // Fade out and move up faster
      contentRef.current.style.opacity = `${1 - scrollProgress * 1.2}`;
      contentRef.current.style.transform = `translateY(${scrollY * 0.5}px) scale(${1 - scrollProgress * 0.1})`;

      // Check if About section is visible (when scrollY > 30% of viewport height)
      const aboutVisible = scrollY > window.innerHeight * 0.3;
      setIsAboutVisible(aboutVisible);

      // Check if we're at the lock point (60% scrolled)
      const isAtLockPoint = scrollY > window.innerHeight * 0.6;

      if (isAtLockPoint) {
        // Calculate the current absolute position of the arrow
        const rect = arrowRef.current.getBoundingClientRect();
        const currentTop = rect.top;
        
        // Switch to fixed positioning while maintaining the same visual position
        arrowRef.current.style.position = 'fixed';
        arrowRef.current.style.top = `${currentTop}px`;
        arrowRef.current.style.bottom = 'auto';
        arrowRef.current.style.transition = 'top 0.6s ease-out';
        
        // After a brief moment, animate to the final position
        requestAnimationFrame(() => {
          if (arrowRef.current) {
            arrowRef.current.style.top = '2rem';
          }
        });
      } else {
        // Keep absolute positioning at bottom of Hero
        arrowRef.current.style.position = 'absolute';
        arrowRef.current.style.top = 'auto';
        arrowRef.current.style.bottom = '2rem'; // bottom-8
        arrowRef.current.style.transition = '';
      }

      // Rotate arrow 180 degrees when About is visible
      if (aboutVisible) {
        arrowRef.current.style.transform = 'translateX(-50%) rotate(180deg)';
      } else {
        arrowRef.current.style.transform = 'translateX(-50%) rotate(0deg)';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleArrowClick = () => {
    if (isAboutVisible) {
      // Reset to top
      onArrowClick?.();
    } else {
      // Scroll to About section
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center relative"
    >
      <div 
        ref={contentRef}
        className="text-center z-10 px-8 py-4 transition-all duration-100"
      >
        <h1 className="text-6xl md:text-8xl font-medium mb-4 leading-normal tracking-tight gradient-outline">
          Chester Boynton
        </h1>
      </div>

      {/* Scroll Indicator - Dynamic arrow - Switches from absolute to fixed */}
      <button 
        ref={arrowRef}
        onClick={handleArrowClick}
        className="absolute bottom-8 left-1/2 z-50 cursor-pointer hover:scale-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded-full p-2"
        aria-label={isAboutVisible ? "Reset to top" : "Scroll to About"}
        style={{ transform: 'translateX(-50%) rotate(0deg)' }}
      >
        <svg className="w-6 h-10 stroke-gray-400 hover:stroke-orange-400 transition-colors" viewBox="0 0 24 40" fill="none">
          <path d="M12 2L12 38M12 38L22 28M12 38L2 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </section>
  );
}

