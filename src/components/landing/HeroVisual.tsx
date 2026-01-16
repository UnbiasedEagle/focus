'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function HeroVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Video autoplay failed:', error);
      }
    };

    handlePlay();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className='lg:flex-1 w-full relative hidden lg:block group'
    >
      {/* Background Glow - More subtle */}
      <div className='absolute -inset-4 bg-indigo-500/5 blur-2xl rounded-[2rem] transition-opacity duration-500 group-hover:bg-indigo-500/10' />

      <motion.div
        whileHover={{
          perspective: 1000,
          rotateY: -1,
          rotateX: 1,
          scale: 1.01,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className='relative rounded-xl border bg-background/80 backdrop-blur-xl shadow-xl overflow-hidden aspect-video'
      >
        {/* Decorative Header - Slimmer */}
        <div className='h-8 border-b bg-muted/20 flex items-center px-3 gap-1.5 z-20 relative'>
          <div className='w-2 h-2 rounded-full bg-red-400/40' />
          <div className='w-2 h-2 rounded-full bg-yellow-400/40' />
          <div className='w-2 h-2 rounded-full bg-green-400/40' />
          <div className='flex-1 mx-2 h-3 rounded-md bg-muted/20' />
        </div>

        {/* Content - Actual Video Walkthrough */}
        <div className='relative h-full w-full bg-zinc-950'>
          <video
            ref={videoRef}
            src='/landing/videos/demo-walkthrough.webm'
            autoPlay
            loop
            muted
            playsInline
            preload='auto'
            className='w-full h-full object-cover'
            style={{ display: 'block' }}
          />
          {/* Glossy Overlay - More subtle */}
          <div className='absolute inset-0 bg-linear-to-tr from-white/2 via-transparent to-transparent pointer-events-none' />
        </div>
      </motion.div>
    </motion.div>
  );
}
