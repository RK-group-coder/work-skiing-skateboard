import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ShoppingCart, User, Search, Menu, X, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  // Neon Colors
  const neonBlue = '#00f2ff';
  const neonRed = '#ff3131';

  // Professional Metallic Gradient
  const silverGradient = 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #cbd5e1 50%, #e2e8f0 100%)';

  const handleRedeem = () => {
    if (voucherCode.trim()) {
      alert(`兌換代碼 [${voucherCode}] 成功！已為您套用優惠。`);
      setVoucherCode('');
      setIsVoucherModalOpen(false);
    } else {
      alert('請輸入有效的兌換碼');
    }
  };

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
        <div className="flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Desktop Navbar (Pill) */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-40 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-pill px-8 py-3 bg-opacity-70">
          <div className="flex items-center font-black text-2xl tracking-tighter">
            <span className="text-primary italic">SK8</span>
            <span className="ml-1.5 text-text text-xl">{mode === 'skiing' ? '極限滑雪' : '極速電動滑板'}</span>
          </div>

          <div className="flex items-center gap-8 font-medium">
            <a href="#" className="hover:text-primary transition-colors">首頁</a>
            <a href="#courses" className="hover:text-primary transition-colors">專業課程</a>
            <a href="#shop" className="hover:text-primary transition-colors">購物商城</a>
            <button onClick={() => setIsVoucherModalOpen(true)} className="hover:text-primary transition-colors font-bold flex items-center gap-1.5">
              <Ticket size={18} /> 兌換碼
            </button>
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

      {/* Mobile Menu Dropdown (Clean layout with additional divider) */}
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
            <div className="flex justify-between items-center mb-8 h-8">
              <div className="flex items-center font-black text-xl tracking-tighter">
                <span>SK8</span>
                <span className="ml-1 text-lg uppercase tracking-widest">{mode === 'skiing' ? 'SKI' : 'SKATE'}</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-white"><X size={28} /></button>
            </div>
            
            <div className="flex flex-col w-full text-center">
              <a href="#" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold border-b border-white/20 hover:bg-white/5 transition-all">首頁</a>
              <a href="#courses" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold border-b border-white/20 hover:bg-white/5 transition-all">專業課程</a>
              <a href="#shop" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold border-b border-white/20 hover:bg-white/5 transition-all">購物商城</a>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsVoucherModalOpen(true);
                }} 
                className="py-5 text-xl font-bold border-b border-white/20 transition-all flex items-center justify-center gap-2"
              >
                兌換優惠券
              </button>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold hover:bg-white/5 transition-all">聯絡我們</a>
            </div>

            <div className="p-8 flex justify-center mt-2">
              <button 
                onClick={() => {
                  toggleMode();
                  setTimeout(() => setIsMenuOpen(false), 300);
                }}
                className="w-full max-w-xs py-4 rounded-2xl text-gray-900 text-sm font-black tracking-widest uppercase flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
                style={{ background: silverGradient }}
              >
                {mode === 'skiing' ? (
                  <img src="/icons/skating-icon.png" alt="skating" className="w-6 h-6 object-contain mix-blend-multiply" />
                ) : (
                  <img src="/icons/skiing-icon.png" alt="skiing" className="w-6 h-6 object-contain mix-blend-multiply" />
                )}
                切換模式
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voucher Modal */}
      <AnimatePresence>
        {isVoucherModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVoucherModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center ${mode === 'skiing' ? 'bg-white' : 'bg-slate-900 border border-white/20 text-white'}`}
            >
              <Ticket size={48} className={`mx-auto mb-6 ${mode === 'skiing' ? 'text-blue-500' : 'text-cyan-400'}`} />
              <h2 className="text-2xl font-black italic tracking-tighter mb-2 uppercase">Voucher Redemption</h2>
              <p className="text-sm opacity-60 mb-8">請輸入您的折扣代碼</p>
              
              <input 
                type="text" 
                placeholder="輸入代碼..."
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className={`w-full h-14 rounded-2xl px-6 font-bold text-center mb-6 outline-none border-2 ${
                  mode === 'skiing' ? 'bg-slate-100 border-transparent focus:border-blue-500 text-slate-900' : 'bg-white/5 border-white/10 focus:border-cyan-400 text-white'
                }`}
              />
              <button onClick={handleRedeem} className="w-full h-14 rounded-2xl text-gray-900 font-black uppercase tracking-widest shadow-xl transition-all" style={{ background: silverGradient }}>
                立即兌換
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation (Tick/Icon maintained as per previous instruction) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-sm px-2">
        <div className={`backdrop-blur-3xl border px-3 py-2 flex items-center justify-between shadow-2xl rounded-full transition-all duration-300 ${
          mode === 'skiing' ? 'bg-white/80 border-white/40 text-slate-900' : 'bg-black/80 border-white/10 text-white'
        }`}>
          {/* Home */}
          <a href="#" className="flex flex-col items-center justify-center w-10 py-1">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-[9px] font-black mt-0.5">首頁</span>
          </a>
          
          {/* Courses */}
          <a href="#courses" className="flex flex-col items-center justify-center w-10 py-1">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span className="text-[9px] font-black mt-0.5">課程</span>
          </a>

          {/* Theme Toggle Button */}
          <div className="relative flex items-center justify-center w-14 h-14">
            <div className="absolute inset-[-4px] rounded-full animate-spin" style={{ background: `conic-gradient(from 0deg, ${neonRed} 0deg 180deg, ${neonBlue} 180deg 360deg)`, filter: 'blur(5px)', opacity: 0.7 }} />
            <div className="absolute inset-[-2.5px] rounded-full animate-spin" style={{ background: `conic-gradient(from 0deg, ${neonRed} 0deg 180deg, ${neonBlue} 180deg 360deg)`, filter: 'blur(1.5px)', opacity: 1 }} />
            <button onClick={toggleMode} className="w-12 h-12 rounded-full flex flex-col items-center justify-center relative z-10 overflow-hidden shadow-lg border-2 border-white/60" style={{ background: silverGradient }}>
              <div className="w-full h-full absolute inset-0 transition-transform" style={{ backgroundImage: `${mode === 'skiing' ? "url('/icons/skating-icon.png')" : "url('/icons/skiing-icon.png')"}, ${silverGradient}`, backgroundSize: '55%', backgroundPosition: 'center 20%', backgroundRepeat: 'no-repeat', backgroundBlendMode: 'multiply', borderRadius: '50%', clipPath: 'circle(48.5%)' }} />
              <div className="absolute bottom-1 w-full text-center z-20 pointer-events-none px-1">
                <span className="text-[8px] font-black tracking-tighter text-slate-900 uppercase leading-none drop-shadow-sm scale-90 inline-block">{mode === 'skiing' ? '電動滑板' : '去滑雪'}</span>
              </div>
            </button>
          </div>

          {/* Voucher */}
          <button onClick={() => setIsVoucherModalOpen(true)} className="flex flex-col items-center justify-center w-10 py-1">
            <Ticket size={18} strokeWidth={3} />
            <span className="text-[9px] font-black mt-0.5">兌換券</span>
          </button>

          {/* Shop */}
          <a href="#shop" className="flex flex-col items-center justify-center w-10 py-1">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="text-[9px] font-black mt-0.5">商城</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
