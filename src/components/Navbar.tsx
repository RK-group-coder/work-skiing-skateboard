import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/CartProvider';
import type { Voucher } from '../hooks/CartProvider';
import { ShoppingCart, User, Search, Menu, X, Ticket, Trash2, Tag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const { 
    cart, removeFromCart, totalPrice, totalItems, clearCart, 
    vouchers, selectedVoucher, selectVoucher, discountedPrice 
  } = useCart();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showVoucherList, setShowVoucherList] = useState(false);

  // Neon Colors
  const neonBlue = '#00f2ff';
  const neonRed = '#ff3131';

  // Professional Metallic Gradient
  const silverGradient = 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #cbd5e1 50%, #e2e8f0 100%)';

  const Divider = () => <div className="h-[1px] w-full bg-current opacity-10" />;

  return (
    <>
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 transition-colors duration-300 ${
        mode === 'skiing' ? 'mobile-header-skiing' : 'mobile-header-skateboard'
      }`}>
        <div className="flex items-center text-white font-black text-xl tracking-tighter">
          <span>SK8</span>
          <span className="ml-1 text-lg">{mode === 'skiing' ? '極限滑雪' : '極速電動滑板'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsCartOpen(true)} className="text-white p-2 relative">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white/20">
                {totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Desktop Navbar */}
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
            <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><User size={20} /></button>
          </div>
        </div>
      </nav>

      {/* Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-sm h-full shadow-2xl flex flex-col p-6 md:p-8 ${
                mode === 'skiing' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={24} className="text-primary" />
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">My Cart</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
                    <ShoppingCart size={64} className="mb-4" />
                    <p className="font-bold">您的購物車目前是空的</p>
                    <p className="text-xs mt-2">快去挑選一些酷裝備吧！</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 ${mode === 'skiing' ? 'bg-gray-100' : 'bg-white/5'}`}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="font-black text-primary italic text-xs">SK8</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm truncate pr-2">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1 hover:bg-red-500/10 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-black text-primary italic">NT${item.price.toLocaleString()}</span>
                          <span className="text-xs opacity-60 font-bold">× {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer - Vouchers & Checkout */}
              {cart.length > 0 && (
                <div className="mt-6 pt-6 border-t border-current/10">
                  
                  {/* Voucher Selection Section */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <button 
                        onClick={() => setShowVoucherList(!showVoucherList)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <Tag size={12} /> 可用優惠券 ({vouchers.length})
                        <ChevronRight size={12} className={`transition-transform ${showVoucherList ? 'rotate-90' : ''}`} />
                      </button>
                      {selectedVoucher && (
                        <button onClick={() => selectVoucher(null)} className="text-[10px] font-bold text-red-500 underline">取消使用</button>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {showVoucherList && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="flex overflow-x-auto no-scrollbar gap-3 pb-2"
                        >
                          {vouchers.length === 0 ? (
                            <p className="text-[10px] opacity-40 py-2">尚未領取任何優惠券</p>
                          ) : (
                            vouchers.map(v => (
                              <button 
                                key={v.id}
                                onClick={() => selectVoucher(v.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-left transition-all border-2 ${
                                  selectedVoucher?.id === v.id 
                                  ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]' 
                                  : 'bg-current/5 border-transparent opacity-60'
                                }`}
                              >
                                <p className="text-[10px] font-black tracking-tighter truncate w-24 uppercase">{v.title}</p>
                                <p className="text-xs font-bold text-primary">USE NOW</p>
                              </button>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-xs opacity-60 font-medium">
                      <span>Subtotal</span>
                      <span>NT${totalPrice.toLocaleString()}</span>
                    </div>
                    {selectedVoucher && (
                      <div className="flex justify-between items-center text-xs text-green-500 font-bold">
                        <span>Discount Applied</span>
                        <span>- NT${(totalPrice - discountedPrice).toLocaleString()}</span>
                      </div>
                    )}
                    <Divider />
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-widest">Total cost</span>
                      <span className="text-4xl font-black italic tracking-tighter text-primary">
                        NT${discountedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert('進入結帳功能')}
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-gray-900 shadow-xl active:scale-95 transition-all text-center"
                    style={{ background: silverGradient }}
                  >
                    結帳 Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Dropdown Menu */}
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
            <div className="flex justify-between items-center mb-8 h-8 px-2">
              <div className="flex items-center font-black text-xl tracking-tighter">
                <span>SK8</span>
                <span className="ml-1 text-lg uppercase tracking-widest">{mode === 'skiing' ? 'SKI' : 'SKATE'}</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-white"><X size={28} /></button>
            </div>
            
            <div className="flex flex-col w-full">
              <a href="#" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold w-full text-center hover:bg-white/5 transition-all">首頁</a>
              <div className="h-[1px] w-full bg-white/20" />
              <a href="#courses" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold w-full text-center hover:bg-white/5 transition-all">專業課程</a>
              <div className="h-[1px] w-full bg-white/20" />
              <a href="#shop" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold w-full text-center hover:bg-white/5 transition-all">購物商城</a>
              <div className="h-[1px] w-full bg-white/20" />
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="py-5 text-xl font-bold w-full text-center hover:bg-white/5 transition-all">聯絡我們</a>
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

      {/* Mobile Bottom Navigation (Tick/Icon maintained) */}
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

          {/* Voucher Entry - Leads to Features section where they can claim */}
          <a href="#courses" className="flex flex-col items-center justify-center w-10 py-1">
            <Ticket size={18} strokeWidth={3} />
            <span className="text-[9px] font-black mt-0.5">兌換券</span>
          </a>

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
