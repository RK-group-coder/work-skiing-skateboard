import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import skiHero from '../assets/ski_hero.png';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
import skateHero from '../assets/skate_hero.png';

interface HomepageSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  hero_badge: string;
}

const getYoutubeInfo = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return { id: match[2], isShort: url.includes('shorts/') };
  }
  return null;
};

const Hero: React.FC = () => {
  const { mode } = useTheme();
  const [settings, setSettings] = useState<Record<string, HomepageSettings>>({
    skiing: { 
      id: 'skiing', 
      hero_title: '征服雪山，突破極限', 
      hero_subtitle: '專業滑雪課程，從初學到進階，帶你探索雪地的無限可能', 
      hero_bg_image: '', 
      hero_badge: "Let's Go Skiing" 
    },
    skateboard: { 
      id: 'skateboard', 
      hero_title: '極速前行，電動新世代', 
      hero_subtitle: '專業電動滑板課程與裝備，體驗最先進的電動滑行技術', 
      hero_bg_image: '', 
      hero_badge: 'Ride the Urban Wave' 
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('homepage_settings').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const settingsMap = { ...settings };
        data.forEach((item: HomepageSettings) => {
          settingsMap[item.id] = item;
        });
        setSettings(settingsMap);
      }
    } catch (err) {
      console.error('Error fetching hero settings:', err);
    }
  };

  const currentSettings = settings[mode];
  const defaultBg = mode === 'skiing' ? skiHero : skateHero;
  
  const rawBgImage = currentSettings.hero_bg_image || '';
  const isSettingSoundOn = rawBgImage.includes('&sound=1');
  const bgImage = rawBgImage.replace('&sound=1', '') || defaultBg;
  
  const ytInfo = getYoutubeInfo(bgImage);
  const [isMuted, setIsMuted] = useState(!isSettingSoundOn);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsMuted(!isSettingSoundOn);
  }, [isSettingSoundOn, mode]);

  useEffect(() => {
    if (!ytInfo) return;

    setIsVideoLoaded(false);

    const loadPlayer = () => {
      playerRef.current = new window.YT.Player('youtube-bg-player', {
        events: {
          onStateChange: (event: any) => {
            // PlayerState.PLAYING is 1
            if (event.data === 1) {
              setIsVideoLoaded(true);
            }
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        loadPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      // Small delay to ensure iframe is rendered before attaching API
      setTimeout(loadPlayer, 100);
    }

    // Fallback: if autoplay is completely blocked by OS, show it anyway after 3.5s
    const fallbackTimer = setTimeout(() => setIsVideoLoaded(true), 3500);

    return () => {
      clearTimeout(fallbackTimer);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (e) {}
      }
    };
  }, [ytInfo?.id, mode]);

  const toggleSound = () => {
    const nextMute = !isMuted;
    if (playerRef.current && typeof playerRef.current.unMute === 'function') {
      if (nextMute) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.playVideo(); // Force play in case OS blocked initial autoplay
      }
    }
    setIsMuted(nextMute);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode + bgImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {ytInfo ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
              <iframe
                id="youtube-bg-player"
                src={`https://www.youtube.com/embed/${ytInfo.id}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytInfo.id}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                className={`absolute top-1/2 left-1/2 transition-opacity duration-[1500ms] pointer-events-none ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  border: 'none',
                  width: '100vw', 
                  height: '56.25vw', 
                  minHeight: '100vh', 
                  minWidth: '177.78vh',
                  transform: 'translate(-50%, -50%) scale(1.15)'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img 
              src={bgImage} 
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-b ${
            mode === 'skiing' 
              ? 'from-sky-900/40 via-transparent to-white' 
              : 'from-red-900/40 via-transparent to-black'
          }`} />
        </motion.div>
      </AnimatePresence>

      {/* Video Sound Toggle Button */}
      {ytInfo && (
        <button 
          onClick={toggleSound}
          className="absolute bottom-8 right-8 z-50 w-12 h-12 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/20 active:scale-95"
          title={isMuted ? "播放聲音" : "靜音"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          key={mode + "-badge"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-6 py-2 rounded-full border border-white/30 backdrop-blur-md text-white font-bold mb-6 tracking-widest uppercase text-sm"
        >
          {currentSettings.hero_badge}
        </motion.div>

        <motion.h1 
          key={mode + "-title"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight"
        >
          {currentSettings.hero_title}
        </motion.h1>

        <motion.p
          key={mode + "-desc"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium"
        >
          {currentSettings.hero_subtitle}
        </motion.p>

        <motion.div
          key={mode + "-btns"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full px-6"
        >
          <a href="#courses" className="mobile-btn-primary md:w-auto md:px-12 md:py-4 flex items-center justify-center">
            查看課程 <span className="ml-2">→</span>
          </a>
          <a href="#shop" className="mobile-btn-glass md:w-auto md:px-12 md:py-4 flex items-center justify-center">
            <span className="mr-2">選購裝備</span>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </a>
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
