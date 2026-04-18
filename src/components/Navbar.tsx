import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 px-8 py-4">
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
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><Search size={20} /></button>
            <div onClick={toggleMode} className="w-16 h-8 bg-black/10 rounded-full relative cursor-pointer flex items-center px-1">
              <motion.div animate={{ x: mode === 'skiing' ? 0 : 32 }} className="w-6 h-6 bg-primary rounded-full" />
            </div>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><ShoppingCart size={20} /></button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><User size={20} /></button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-black">選單</h2>
              <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-8 text-2xl font-bold text-gray-900">
              <a href="#" onClick={() => setIsMenuOpen(false)}>首頁</a>
              <a href="#courses" onClick={() => setIsMenuOpen(false)}>專業課程</a>
              <a href="#shop" onClick={() => setIsMenuOpen(false)}>購物商城</a>
              <div className="pt-8 border-t border-gray-100 flex justify-between items-center" onClick={() => {
                toggleMode();
                setIsMenuOpen(false);
              }}>
                <span>切換主題</span>
                <div className="w-16 h-8 bg-black/10 rounded-full relative flex items-center px-1">
                  <motion.div animate={{ x: mode === 'skiing' ? 0 : 32 }} className="w-6 h-6 bg-primary rounded-full transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
