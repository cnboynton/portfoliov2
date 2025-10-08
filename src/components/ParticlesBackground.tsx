import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

export interface ParticlesBackgroundHandle {
  setVirtualScroll: (progress: number) => void;
}

const ParticlesBackground = forwardRef<ParticlesBackgroundHandle>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const virtualScrollProgressRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setVirtualScroll: (progress: number) => {
      virtualScrollProgressRef.current = progress;
    }
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    //Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop with scroll
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    const startTime = Date.now();
    
    const animate = () => {
      const realScrollProgress = Math.min(scrollY / (window.innerHeight * 0.5), 1);
      const virtualScroll = virtualScrollProgressRef.current;
      const timeElapsed = (Date.now() - startTime) / 1000; // time in seconds

      // Combine virtual scroll and real scroll
      const totalScrollProgress = Math.min(virtualScroll + realScrollProgress, 1);

      // Particle rotation - slow down when fully scrolled (About section)
      const rotationSpeed = totalScrollProgress >= 0.9 ? 0.0002 : 0.001 + (totalScrollProgress * 0.005);
      particles.rotation.x = mouseY * 0.05;
      particles.rotation.y = mouseX * 0.05;
      particles.rotation.z += rotationSpeed;

      // Initial slow drift forward (before scrolling)
      const initialDrift = Math.min(timeElapsed * 0.3, 1.5); // Drift up to 1.5 units over 5 seconds
      
      // Space travel effect - particles move away from camera faster (increased multipliers)
      particles.position.z = initialDrift + (virtualScroll * 8) + (realScrollProgress * 5);

      // Dynamic size - particles grow as they get closer (moving away)
      particlesMaterial.size = 0.03 + (totalScrollProgress * 0.03);
      particlesMaterial.opacity = 0.8 - (totalScrollProgress * 0.4);

      // Camera stays still, particles move away
      camera.position.z = 5;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
});

ParticlesBackground.displayName = 'ParticlesBackground';

export default ParticlesBackground;

