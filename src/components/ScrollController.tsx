import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface ScrollControllerProps {
  onVirtualScroll: (progress: number) => void;
}

export interface ScrollControllerHandle {
  reset: () => void;
}

const ScrollController = forwardRef<ScrollControllerHandle, ScrollControllerProps>(
  ({ onVirtualScroll }, ref) => {
  const virtualScrollRef = useRef(0);
  const isVirtualScrollingRef = useRef(true);
  const isScrollLockedRef = useRef(false);
  const VIRTUAL_SCROLL_THRESHOLD = 1000;
  const TRANSITION_RANGE = 600; // Smooth transition zone (doubled for smoother blend)

  useImperativeHandle(ref, () => ({
    reset: () => {
      // Reset all scroll state
      virtualScrollRef.current = 0;
      isVirtualScrollingRef.current = true;
      isScrollLockedRef.current = false;
      onVirtualScroll(0);
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }));

  useEffect(() => {
    let accumulatedScroll = 0;

    const handleWheel = (e: WheelEvent) => {
      const currentScrollY = window.scrollY;
      
      // Check if we've reached the About section and lock scrolling
      // Lock before the arrow scrolls out of view (arrow is at bottom-8 of Hero section)
      // Lock when scrolled to about 60% to keep arrow visible at bottom of screen
      if (!isVirtualScrollingRef.current && currentScrollY > window.innerHeight * 0.6) {
        isScrollLockedRef.current = true;
      }

      // Virtual scroll phase with smooth transition
      if (isVirtualScrollingRef.current) {
        // Accumulate scroll
        accumulatedScroll += e.deltaY;
        virtualScrollRef.current = Math.max(0, Math.min(accumulatedScroll, VIRTUAL_SCROLL_THRESHOLD + TRANSITION_RANGE));
        
        // Calculate how much we're in the transition zone
        const transitionProgress = Math.max(0, Math.min(1, (virtualScrollRef.current - VIRTUAL_SCROLL_THRESHOLD) / TRANSITION_RANGE));
        
        // Gradually release control: 100% prevented -> 0% prevented
        if (transitionProgress < 1) {
          e.preventDefault();
          
          // In transition zone, start allowing some real scroll
          if (transitionProgress > 0) {
            const realScrollAmount = e.deltaY * transitionProgress;
            window.scrollBy(0, realScrollAmount);
          }
        }
        
        // Notify parent of virtual scroll progress (0 to 1)
        const progress = Math.min(virtualScrollRef.current / VIRTUAL_SCROLL_THRESHOLD, 1);
        onVirtualScroll(progress);
        
        // Once we've fully transitioned, allow normal scrolling
        if (virtualScrollRef.current >= VIRTUAL_SCROLL_THRESHOLD + TRANSITION_RANGE) {
          isVirtualScrollingRef.current = false;
        }
      }
      // Lock all scrolling when About section is reached
      else if (isScrollLockedRef.current) {
        e.preventDefault();
        // Completely prevent any scrolling - users must use arrow to reset
      }
    };

    // Use passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [onVirtualScroll]);

  return null; // This component doesn't render anything
});

ScrollController.displayName = 'ScrollController';

export default ScrollController;

