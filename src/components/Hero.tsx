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
  const bgImages = rawBgImage.replace('&sound=1', '').split(',').filter(Boolean);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [mode, rawBgImage]);

  const currentBg = bgImages[currentIndex] || defaultBg;
  const isMp4 = currentBg.toLowerCase().includes('.mp4');
  const ytInfo = !isMp4 ? getYoutubeInfo(currentBg) : null;
  
  const [isMuted, setIsMuted] = useState(!isSettingSoundOn);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (isMp4) {
      if (videoRef.current) {
        videoRef.current.muted = nextMute;
        if (!nextMute) {
          videoRef.current.play().catch(console.error);
        }
      }
    } else if (playerRef.current && typeof playerRef.current.unMute === 'function') {
      if (nextMute) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.playVideo();
      }
    }
    setIsMuted(nextMute);
  };

  // Carousel Swipe Logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      // User swiped left -> go to previous (reversed per user request)
      setCurrentIndex(prev => (prev === 0 ? bgImages.length - 1 : prev - 1));
    } else if (distance < -minSwipeDistance) {
      // User swiped right -> go to next
      setCurrentIndex(prev => (prev === bgImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section 
      className={`relative min-h-[100dvh] w-full overflow-hidden flex flex-col transition-colors duration-700 ${mode === 'skiing' ? 'bg-[#0f172a]' : 'bg-[#050505]'}`}
      onTouchStart={onTouchStart} 
      onTouchMove={onTouchMove} 
      onTouchEnd={onTouchEnd}
    >
      
      {/* Top Half: Background Carousel Area (Constrained to 3:4 ratio on mobile) */}
      <div className="relative w-full aspect-[3/4] md:h-[75vh] md:aspect-auto shrink-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode + currentIndex + currentBg}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            {isMp4 ? (
              <div className="absolute inset-0 w-full h-full bg-black">
                <video 
                  ref={videoRef}
                  src={currentBg}
                  autoPlay 
                  loop 
                  muted={isMuted} 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : ytInfo ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
                <img 
                  src={`https://img.youtube.com/vi/${ytInfo.id}/maxresdefault.jpg`}
                  onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${ytInfo.id}/hqdefault.jpg`; }}
                  alt="Video Loading"
                  className={`absolute top-1/2 left-1/2 object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
                  style={{ 
                    width: '100vw', 
                    height: '56.25vw', 
                    minHeight: '100vh', 
                    minWidth: '177.78vh',
                    transform: 'translate(-50%, -50%) scale(1.15)'
                  }}
                />
                <iframe
                  id="youtube-bg-player"
                  src={`https://www.youtube.com/embed/${ytInfo.id}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytInfo.id}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                  className={`absolute top-1/2 left-1/2 transition-opacity duration-700 pointer-events-none ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
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
                src={currentBg} 
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators (Always visible per user request to confirm placement) */}
        {bgImages.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-50 px-4 py-2 rounded-full">
            {bgImages.map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${i === currentIndex ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 border-[1.5px] border-white bg-transparent hover:bg-white/50'}`} 
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Video Sound Toggle Button */}
        {(ytInfo || isMp4) && (
          <button 
            onClick={toggleSound}
            className="absolute bottom-16 right-4 md:right-8 z-50 w-10 h-10 bg-black/40 hover:bg-black/80 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/20 active:scale-95 shadow-2xl"
            title={isMuted ? "播放聲音" : "靜音"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      {/* Bottom Half: Content (Buttons) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 px-4 py-8 pb-20">
        <motion.div
          key={mode + "-btns"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl mx-auto px-6"
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-6 bg-white/30" />
      </motion.div>
    </section>
  );
};

export default Hero;
