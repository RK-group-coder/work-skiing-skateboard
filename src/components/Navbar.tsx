import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Deep & Soft Neon Colors
  const softBlue = '#00f2ff';
  const softRed = '#ff3131';

  // Professional Metallic Gradient
  const silverGradient = 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #cbd5e1 50%, #e2e8f0 100%)';

  return (
    <>
      {/* Mobile Header (Solid) */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 transition-colors duration-300 ${
        mode === 'skiing' ? 'mobile-header-skiing' : 'mobile-header-skateboard'
      }`}>
        <div className="flex items-center text-white font-black text-xl tracking-tighter">
          <span>SK8</span>
          <span className="ml-1 text-lg">{mode === 'skiing' ? '極限滑雪' : '極速電動滑板'}</span>
          <span className="text-[10px] font-medium opacity-80 mt-1 ml-1 lowercase tracking-normal">no cap</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
          <Menu size={24} />
        </button>
      </header>

      {/* Desktop Navbar (Pill) */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-40 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-pill px-8 py-3 bg-opacity-70">
          <div className="flex items-center font-black text-2xl tracking-tighter">
            <span className="text-primary italic">SK8</span>
            <span className="ml-1.5 text-text text-xl">{mode === 'skiing' ? '極限滑雪' : '極速電動滑板'}</span>
            <span className="text-[11px] font-medium text-text-muted mt-1 ml-1.5 lowercase tracking-normal">no cap</span>
          </div>

          <div className="flex items-center gap-8 font-medium">
            <a href="#" className="hover:text-primary transition-colors">首頁</a>
            <a href="#courses" className="hover:text-primary transition-colors">專業課程</a>
            <a href="#shop" className="hover:text-primary transition-colors">購物商城</a>
            <a href="#contact" className="hover:text-primary transition-colors">聯絡我們</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><Search size={20} /></button>
            <div onClick={toggleMode} className="w-16 h-8 bg-black/10 rounded-full relative cursor-pointer flex items-center px-1">
              <motion.div 
                animate={{ x: mode === 'skiing' ? 0 : 32 }} 
                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center overflow-hidden"
              >
                {mode === 'skiing' ? (
                  <img src="/icons/skating-icon.png" alt="skating" className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
                ) : (
                  <img src="/icons/skiing-icon.png" alt="skiing" className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
                )}
              </motion.div>
            </div>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><ShoppingCart size={20} /></button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><User size={20} /></button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown (Compact Horizontal) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 left-0 right-0 z-[60] flex flex-col p-6 text-white shadow-2xl rounded-b-[40px] ${
              mode === 'skiing' ? 'mobile-header-skiing' : 'mobile-header-skateboard'
            }`}
          >
            <div className="flex justify-between items-center mb-10 h-8">
              <div className="flex items-center font-black text-xl tracking-tighter">
                <span>SK8</span>
                <span className="ml-1 text-lg">{mode === 'skiing' ? '極限滑雪' : '極速電動滑板'}</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-white"><X size={28} /></button>
            </div>
            
            <div className="flex flex-col w-full">
              <a href="#" onClick={() => setIsMenuOpen(false)} className="w-full py-6 text-xl font-bold border-b border-white/20 hover:bg-white/5 transition-all text-center">
                首頁
              </a>
              <a href="#courses" onClick={() => setIsMenuOpen(false)} className="w-full py-6 text-xl font-bold border-b border-white/20 hover:bg-white/5 transition-all text-center">
                專業課程
              </a>
              <a href="#shop" onClick={() => setIsMenuOpen(false)} className="w-full py-6 text-xl font-bold border-b border-white/20 hover:bg-white/5 transition-all text-center">
                購物商城
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="w-full py-6 text-xl font-bold border-b border-white/20 hover:bg-white/5 transition-all text-center">
                聯絡我們
              </a>
              
              <div className="p-8 flex justify-center mt-4">
                <button 
                  onClick={() => {
                    toggleMode();
                    setTimeout(() => setIsMenuOpen(false), 300);
                  }}
                  className="w-full max-w-xs py-4 rounded-2xl text-gray-900 text-sm font-black tracking-widest uppercase flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl border border-white/50"
                  style={{ 
                    background: silverGradient,
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,1), 0 10px 30px rgba(0,0,0,0.2)'
                  }}
                >
                  {mode === 'skiing' ? (
                    <img src="/icons/skating-icon.png" alt="skating" className="w-6 h-6 object-contain mix-blend-multiply" />
                  ) : (
                    <img src="/icons/skiing-icon.png" alt="skiing" className="w-6 h-6 object-contain mix-blend-multiply" />
                  )}
                  切換到{mode === 'skiing' ? '電動滑板' : '極限滑雪'}模式
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation (Balanced Style) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm px-2">
        <div className={`glass-pill backdrop-blur-2xl border px-2 py-2 flex items-center justify-between shadow-2xl rounded-full transition-all duration-300 ${
          mode === 'skiing' ? 'bg-white/60 border-white/40 text-slate-900' : 'bg-black/60 border-white/10 text-white'
        }`}>
          {/* Home */}
          <a href="#" className="flex flex-col items-center justify-center w-12 py-1 active:scale-90 transition-all">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-[10px] font-black mt-0.5">首頁</span>
          </a>
          
          {/* Courses */}
          <a href="#courses" className="flex flex-col items-center justify-center w-12 py-1 active:scale-90 transition-all">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span className="text-[10px] font-black mt-0.5">課程</span>
          </a>

          {/* CENTRAL FLOATING THEME TOGGLE (Aura Glow Restoration) */}
          <div className="relative -translate-y-1.5 flex items-center justify-center w-16 h-16">
            {/* SOFT AURA LIGHTS (Reverting to fuzzy spots) */}
            <div 
              className="absolute inset-[-4px] rounded-full"
              style={{ 
                background: `radial-gradient(circle at 20% 50%, ${softRed} 0%, transparent 60%), radial-gradient(circle at 80% 50%, ${softBlue} 0%, transparent 60%)`,
                filter: 'blur(12px)',
                opacity: 0.8,
                animation: 'button-pulse 2.5s infinite'
              }}
            />
            
            <button 
              onClick={toggleMode}
              className="w-[52px] h-[52px] rounded-full flex flex-col items-center justify-center active:scale-95 transition-all border-[2px] border-white/80 relative z-10 overflow-hidden shadow-lg"
              style={{ 
                background: silverGradient,
                boxShadow: 'inset 0 1.5px 3px rgba(255,255,255,1), 0 3px 10px rgba(0,0,0,0.15)'
              }}
            >
              {/* athlete icon */}
              <div 
                className="w-full h-full absolute inset-0 transition-transform"
                style={{ 
                  animation: 'icon-jiggle 3s infinite',
                  backgroundImage: `${mode === 'skiing' ? "url('/icons/skating-icon.png')" : "url('/icons/skiing-icon.png')"}, ${silverGradient}`,
                  backgroundSize: '55%',
                  backgroundPosition: 'center 20%', 
                  backgroundRepeat: 'no-repeat',
                  backgroundBlendMode: 'multiply',
                  borderRadius: '50%',
                  clipPath: 'circle(48.5%)'
                }}
              />
              {/* Internal Label - Kept! */}
              <div className="absolute bottom-1 w-full text-center z-20 pointer-events-none px-1">
                <span className="text-[9px] font-black tracking-tighter text-slate-900 uppercase leading-none drop-shadow-sm scale-90">
                  {mode === 'skiing' ? '電動滑板' : '去滑雪'}
                </span>
              </div>
            </button>
          </div>

          {/* Shop */}
          <a href="#shop" className="flex flex-col items-center justify-center w-12 py-1 active:scale-90 transition-all">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="text-[10px] font-black mt-0.5">商城</span>
          </a>

          {/* Contact */}
          <a href="#contact" className="flex flex-col items-center justify-center w-12 py-1 active:scale-90 transition-all">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span className="text-[10px] font-black mt-0.5">聯絡</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
