import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import skiHero from '../assets/ski_hero.png';
import skateHero from '../assets/skate_hero.png';

const Hero: React.FC = () => {
  const { mode } = useTheme();

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={mode === 'skiing' ? skiHero : skateHero} 
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${
            mode === 'skiing' 
              ? 'from-sky-900/40 via-transparent to-white' 
              : 'from-red-900/40 via-transparent to-black'
          }`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          key={mode + "-badge"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-6 py-2 rounded-full border border-white/30 backdrop-blur-md text-white font-bold mb-6 tracking-widest uppercase text-sm"
        >
          {mode === 'skiing' ? 'Let\'s Go Skiing' : 'Ride the Urban Wave'}
        </motion.div>

        <motion.h1 
          key={mode + "-title"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight"
        >
          {mode === 'skiing' ? '征服雪山，突破極限' : '極速前行，電動新世代'}
        </motion.h1>

        <motion.p
          key={mode + "-desc"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium"
        >
          {mode === 'skiing' 
            ? '專業滑雪課程，從初學到進階，帶你探索雪地的無限可能' 
            : '專業電動滑板課程與裝備，體驗最先進的電動滑行技術'}
        </motion.p>

        <motion.div
          key={mode + "-btns"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full px-6"
        >
          <button className="mobile-btn-primary md:w-auto md:px-12 md:py-4">
            查看課程 <span className="ml-2">→</span>
          </button>
          <button className="mobile-btn-glass md:w-auto md:px-12 md:py-4">
            <span className="mr-2">選購裝備</span>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-50 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-white" />
      </motion.div>
    </section>
  );
};

export default Hero;
