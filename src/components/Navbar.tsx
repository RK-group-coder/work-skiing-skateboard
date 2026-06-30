import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/CartProvider';
import { ShoppingCart, Search, Menu, X, Ticket, Trash2, Tag, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  user: SupabaseUser | null;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onLogout: () => void;
  onSupportClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onAdminClick, onLogout, onSupportClick }) => {
  const { mode, toggleMode, setMode } = useTheme();
  const { 
    cart, removeFromCart, totalPrice, totalItems, 
    vouchers, selectedVoucher, selectVoucher, discountedPrice,
    setIsCheckoutOpen, getVoucherEligibility, addToCart
  } = useCart();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMyVouchersOpen, setIsMyVouchersOpen] = useState(false);
  const [targetNames, setTargetNames] = useState<Record<string, string>>({});
  const [isPinging, setIsPinging] = useState(false);
  
  const ADMIN_EMAILS = ['pokai2952@gmail.com', 'managersk8@gmail.com'];
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());


  useEffect(() => {
    if (totalItems > 0) {
      const delay = setTimeout(() => {
        setIsPinging(true);
        const end = setTimeout(() => setIsPinging(false), 800);
        return () => clearTimeout(end);
      }, 700);
      return () => clearTimeout(delay);
    }
  }, [totalItems]);

  React.useEffect(() => {
    const fetchTargetNames = async () => {
      const newNames: Record<string, string> = {};
      let hasNew = false;
      
      for (const v of vouchers) {
        if (!v.target_id || targetNames[v.target_id]) continue;
        
        hasNew = true;
        try {
          if (v.target_type === 'product') {
            const { data } = await supabase.from('products').select('name').eq('id', v.target_id).single();
            if (data) newNames[v.target_id] = data.name;
          } else if (v.target_type === 'course') {
            const { data } = await supabase.from('courses').select('name').eq('id', v.target_id).single();
            if (data) newNames[v.target_id] = data.name;
          } else if (v.target_type === 'category') {
            const { data } = await supabase.from('categories').select('name').eq('id', v.target_id).single();
            if (data) newNames[v.target_id] = data.name;
          }
        } catch (e) {
          console.error('Error fetching target name:', e);
        }
      }
      
      if (hasNew) {
        setTargetNames(prev => ({ ...prev, ...newNames }));
      }
    };
    fetchTargetNames();
  }, [vouchers]);


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
        <div className="flex flex-col">
          <div className="flex items-center text-white font-black text-xl tracking-tighter leading-none">
            <span>SK8</span>
            <span className="ml-1 text-lg">{mode === 'skiing' ? '極限滑雪' : '極速電動滑板'}</span>
          </div>
          {user && (
            <div className="text-[8px] font-bold text-white/60 tracking-widest mt-1 uppercase">
              ID: {isAdmin ? 'SK8管理者' : (user.user_metadata?.full_name || '使用者')}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button onClick={onAdminClick} className="text-white p-2">
              <Settings2 size={24} />
            </button>
          )}
          <button id="header-cart-icon" onClick={() => setIsCartOpen(true)} className="text-white p-2 relative">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5">
                {isPinging && <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>}
                <span className="relative flex items-center justify-center bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full border-2 border-white/20">
                  {totalItems}
                </span>
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
          <div className="flex flex-col">
            <div className="flex items-center font-black text-2xl tracking-tighter leading-none">
              <span className="text-primary italic">SK8</span>
              <span className="ml-1.5 text-text text-xl">{mode === 'skiing' ? '極限滑雪' : '極速電動滑板'}</span>
            </div>
            {user && (
              <div className="text-[9px] font-bold text-gray-400 tracking-[0.2em] mt-1 uppercase">
                ID: {isAdmin ? 'SK8管理者' : (user.user_metadata?.full_name || '使用者')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-8 font-medium">
            <a href="#" className="hover:text-primary transition-colors">首頁</a>
            <a href="#courses" className="hover:text-primary transition-colors">專業課程</a>
            <a href="#shop" className="hover:text-primary transition-colors">購物商城</a>
            <a href="#contact" className="hover:text-primary transition-colors">聯絡我們</a>
            <button onClick={onSupportClick} className="hover:text-primary transition-colors text-left font-medium">客服專區</button>
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
            <button id="header-cart-icon" onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4">
                  {isPinging && <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>}
                  <span className="relative flex items-center justify-center bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full">
                    {totalItems}
                  </span>
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-2 ml-4">
                {isAdmin && (
                  <button 
                    onClick={onAdminClick} 
                    className="p-2 hover:bg-black/5 rounded-full text-gray-400 hover:text-black transition-colors"
                    title="進入管理後台"
                  >
                    <Settings2 size={18} />
                  </button>
                )}
                <button 
                  onClick={onLogout}
                  className="px-6 py-2 rounded-full bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                style={{ backgroundColor: '#111827', color: '#ffffff', padding: '8px 20px', borderRadius: 9999, fontSize: 14, fontWeight: 700, marginLeft: 16, border: 'none', cursor: 'pointer' }}
              >
                登入 / 註冊
              </button>
            )}
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">我的購物車</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items List & Vouchers */}
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                <div className="space-y-6">
                  {cart.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center opacity-40 text-center">
                      <ShoppingCart size={48} className="mb-4" />
                      <p className="font-bold">您的購物車目前是空的</p>
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

                {/* My Vouchers Section (Always Visible) */}
                <div className="mt-8 pt-6 border-t border-current/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                      <Tag size={16} className="text-primary" /> 我的優惠券 ({vouchers.length})
                    </h3>
                    {selectedVoucher && (
                      <button onClick={() => selectVoucher(null)} className="text-[10px] font-bold text-red-500 underline">取消使用</button>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 pb-4">
                    {vouchers.length === 0 ? (
                      <p className="text-xs opacity-40 py-4 text-center border-2 border-dashed border-current/10 rounded-xl">尚未領取任何優惠券</p>
                    ) : (
                      vouchers.map((v, index) => {
                        const isSelected = selectedVoucher?.id === v.id;
                        // 如果被選中且希望"使用後消失"的感覺，我們可以將其隱藏或顯示為使用中
                        if (isSelected) return null; // 點擊後從列表中隱藏，因為上方有「取消使用」按鈕

                        let targetLabel = v.target_type === 'global' ? '全站通用' : 
                                          v.target_type === 'skiing' ? '滑雪商品專用' : 
                                          v.target_type === 'skateboard' ? '滑板商品專用' : 
                                          v.target_type === 'all_courses' ? '所有課程適用' : 
                                          v.target_type === 'category' ? '指定分類' : '指定商品/課程適用';
                                          
                        if (v.target_id && targetNames[v.target_id]) {
                          targetLabel = `僅適用於: ${targetNames[v.target_id]}`;
                        }
                        
                        if (v.target_type === 'special_bogo') {
                          try {
                            const config = JSON.parse(v.target_id || '{}');
                            targetLabel = config.mode ? `特殊優惠: ${config.mode}` : '特殊組合優惠';
                          } catch (e) {}
                        }

                        const eligibility = getVoucherEligibility(v);

                        return (
                          <button 
                            key={`${v.id}-${index}`}
                            onClick={() => {
                              if (eligibility.isEligible) {
                                selectVoucher(v.id);
                              }
                            }}
                            disabled={!eligibility.isEligible}
                            className={`w-full flex flex-col p-4 rounded-xl text-left transition-all border-2 relative overflow-hidden ${
                              eligibility.isEligible 
                                ? 'bg-current/5 border-transparent opacity-80 hover:opacity-100 cursor-pointer' 
                                : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-start w-full mb-2">
                              <p className={`text-sm font-black tracking-wider uppercase ${eligibility.isEligible ? '' : 'text-gray-500 line-through'}`}>{v.title}</p>
                              {eligibility.isEligible ? (
                                <div className="text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ml-2 z-10"
                                     style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                                  點擊使用
                                </div>
                              ) : (
                                <div className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-gray-200 text-gray-500 whitespace-nowrap ml-2 z-10">
                                  {eligibility.reason}
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] font-bold text-gray-500 bg-black/5 px-2 py-1 rounded-md mb-2 inline-block w-fit">
                              {targetLabel}
                            </div>
                            <p className="text-xs opacity-60 font-medium">
                              {v.target_type === 'special_bogo' ? '達標即自動加入免費贈品' : (v.type === 'percent' ? `折扣 ${v.value}%` : `折抵 NT$${v.value}`)}
                              {(v.min_amount ?? 0) > 0 && ` · 滿 NT$${v.min_amount} 可用`}
                            </p>
                          </button>
                        );
                      })
                    )}
                    {selectedVoucher && (() => {
                      let selectedTargetLabel = selectedVoucher.target_type === 'global' ? '全站通用' : 
                                                selectedVoucher.target_type === 'skiing' ? '滑雪商品專用' : 
                                                selectedVoucher.target_type === 'skateboard' ? '滑板商品專用' : 
                                                selectedVoucher.target_type === 'all_courses' ? '所有課程適用' : 
                                                selectedVoucher.target_type === 'category' ? '指定分類' : '指定商品/課程適用';
                                                
                      if (selectedVoucher.target_id && targetNames[selectedVoucher.target_id]) {
                        selectedTargetLabel = `僅適用於: ${targetNames[selectedVoucher.target_id]}`;
                      }

                      if (selectedVoucher.target_type === 'special_bogo') {
                        try {
                          const config = JSON.parse(selectedVoucher.target_id || '{}');
                          selectedTargetLabel = config.mode ? `特殊優惠: ${config.mode}` : '特殊組合優惠';
                        } catch (e) {}
                      }

                      return (
                        <div className="w-full flex flex-col p-4 rounded-xl text-left transition-all border-2 mt-3 shadow-sm"
                             style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--secondary)' }}>
                           <div className="flex justify-between items-start w-full mb-2">
                              <p className="text-sm font-black tracking-wider uppercase" style={{ color: 'var(--primary)' }}>{selectedVoucher.title}</p>
                              <div className="text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ml-2 z-10 shadow-sm"
                                   style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}>
                                購物車套用中
                              </div>
                           </div>
                           <div className="text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block w-fit"
                                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)' }}>
                             {selectedTargetLabel}
                           </div>
                           <p className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                             {selectedVoucher.target_type === 'special_bogo' ? '達標即自動加入免費贈品' : (selectedVoucher.type === 'percent' ? `折扣 ${selectedVoucher.value}%` : `折抵 NT$${selectedVoucher.value}`)}
                             {(selectedVoucher.min_amount ?? 0) > 0 && ` · 滿 NT$${selectedVoucher.min_amount} 可用`}
                           </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Cart Footer - Summary & Checkout */}
              {cart.length > 0 && (
                <div className="mt-auto pt-6 border-t border-current/10">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-xs opacity-60 font-medium">
                      <span>小計</span>
                      <span>NT${totalPrice.toLocaleString()}</span>
                    </div>
                    {selectedVoucher && (
                      <div className="flex justify-between items-center text-xs text-green-500 font-bold">
                        <span>已套用折扣</span>
                        <span>- NT${(totalPrice - discountedPrice).toLocaleString()}</span>
                      </div>
                    )}
                    <Divider />
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-widest">總計金額</span>
                      <span className="text-4xl font-black italic tracking-tighter text-primary">
                        NT${discountedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (!user) {
                        onLoginClick();
                        return;
                      }
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-gray-900 shadow-xl active:scale-95 transition-all text-center"
                    style={{ background: silverGradient }}
                  >
                    結帳
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* My Vouchers Sidebar */}
      <AnimatePresence>
        {isMyVouchersOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMyVouchersOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
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
                  <Tag size={24} className="text-primary" />
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">我的優惠券</h2>
                </div>
                <button onClick={() => setIsMyVouchersOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
                {vouchers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
                    <Tag size={64} className="mb-4" />
                    <p className="font-bold">目前沒有可用的優惠券</p>
                  </div>
                ) : (
                  vouchers.map((v, index) => {
                    const isSelected = selectedVoucher?.id === v.id;
                    let targetLabel = v.target_type === 'global' ? '全站通用' : 
                                        v.target_type === 'skiing' ? '滑雪商品專用' : 
                                        v.target_type === 'skateboard' ? '滑板商品專用' : 
                                        v.target_type === 'all_courses' ? '所有課程適用' : 
                                        v.target_type === 'category' ? '指定分類適用' : '指定商品/課程適用';
                                        
                    if (v.target_id && targetNames[v.target_id]) {
                      targetLabel = `僅適用於: ${targetNames[v.target_id]}`;
                    }
                    
                    if (v.target_type === 'special_bogo') {
                      try {
                        const config = JSON.parse(v.target_id || '{}');
                        targetLabel = config.mode ? `特殊優惠: ${config.mode}` : '特殊組合優惠';
                      } catch (e) {}
                    }

                    const eligibility = getVoucherEligibility(v);

                    return (
                      <div 
                        key={`${v.id}-${index}`} 
                        className={`w-full flex flex-col p-5 rounded-2xl border-2 transition-all shadow-lg ${isSelected ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                        style={isSelected 
                          ? { borderColor: 'var(--primary)', backgroundColor: 'var(--bg)', boxShadow: '0 0 20px rgba(0,0,0,0.1)' } 
                          : { borderColor: mode === 'skiing' ? '#3b82f6' : '#ef4444', backgroundColor: 'rgba(0,0,0,0.03)' }
                        }
                      >
                        <div className="flex justify-between items-start w-full mb-3">
                          <div>
                            <p className="text-lg font-black tracking-wider uppercase mb-1 leading-tight" style={isSelected ? { color: 'var(--primary)' } : {}}>
                              {v.title}
                            </p>
                            <span 
                              className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                              style={isSelected 
                                ? { backgroundColor: 'var(--primary)', color: '#ffffff' } 
                                : { backgroundColor: 'rgba(0,0,0,0.1)' }
                              }
                            >
                              {isSelected ? '購物車套用中' : targetLabel}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black italic" style={isSelected ? { color: 'var(--primary)' } : { color: 'var(--primary)' }}>
                              {v.target_type === 'special_bogo' ? '自動帶入贈品' : (v.type === 'percent' ? `折扣 ${v.value}%` : `減免 NT$${v.value}`)}
                            </p>
                            {(v.min_amount ?? 0) > 0 && <p className="text-[10px] opacity-60 font-bold mt-1">滿 NT$${v.min_amount}</p>}
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (isSelected) {
                              selectVoucher(null);
                            } else if (eligibility.isEligible) {
                              selectVoucher(v.id);
                              setIsMyVouchersOpen(false);
                              setIsCartOpen(true);
                            } else {
                              // Not eligible, let them shop. Apply voucher and scroll to correct section
                              selectVoucher(v.id);
                              setIsMyVouchersOpen(false);
                              
                              if (v.target_type === 'course' && v.target_id) {
                                // Direct to specific course modal
                                setTimeout(() => {
                                  window.dispatchEvent(new CustomEvent('openCourseModal', { detail: { courseId: v.target_id } }));
                                }, 300);
                                return;
                              }
                              
                              if (v.target_type === 'specific' && v.target_id) {
                                const firstId = v.target_id.split(',')[0];
                                supabase.from('products').select('*').eq('id', firstId).single().then(({ data }) => {
                                  if (data) {
                                    addToCart({
                                      id: data.id,
                                      name: data.name,
                                      price: data.price,
                                      type: 'product',
                                      image: data.image_url,
                                      quantity: 1
                                    });
                                    setIsCartOpen(true);
                                  } else {
                                    setTimeout(() => {
                                      window.dispatchEvent(new CustomEvent('openCourseModal', { detail: { courseId: firstId } }));
                                    }, 300);
                                  }
                                });
                                return;
                              }

                              if (v.target_type === 'special_bogo' && v.target_id) {
                                try {
                                  const config = JSON.parse(v.target_id);
                                  const buyItems = Object.keys(config.buy || {});
                                  if (buyItems.length > 0) {
                                    const firstBuyId = buyItems[0];
                                    if (config.mode && config.mode.includes('買課程')) {
                                      setTimeout(() => {
                                        window.dispatchEvent(new CustomEvent('openCourseModal', { detail: { courseId: firstBuyId } }));
                                      }, 300);
                                    } else {
                                      supabase.from('products').select('*').eq('id', firstBuyId).single().then(({ data }) => {
                                        if (data) {
                                          addToCart({ id: data.id, name: data.name, price: data.price, type: 'product', image: data.image_url, quantity: 1 });
                                          setIsCartOpen(true);
                                        }
                                      });
                                    }
                                    return;
                                  }
                                } catch (e) {}
                              }

                              if (v.target_type === 'skiing' || v.target_type === 'skateboard') {
                                const targetMode = v.target_type;
                                if (setMode && mode !== targetMode) setMode(targetMode as any);
                                
                                // Fetch first course of that mode and open booking modal
                                supabase.from('courses').select('id').eq('mode', targetMode).eq('is_active', true).limit(1).single().then(({ data }) => {
                                  if (data?.id) {
                                    setTimeout(() => {
                                      document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                                      window.dispatchEvent(new CustomEvent('openCourseModal', { detail: { courseId: data.id } }));
                                    }, 600);
                                  } else {
                                    setTimeout(() => {
                                      document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 600);
                                  }
                                });
                                return;
                              }

                              setTimeout(() => {
                                let targetId = 'shop';
                                if (v.target_type === 'all_courses') targetId = 'courses';
                                else if (v.title && v.title.includes('課')) {
                                  targetId = 'courses';
                                }
                                
                                const element = document.getElementById(targetId);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 600);
                            }
                          }}
                          className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 ${(!isSelected && !eligibility.isEligible) ? 'opacity-90' : ''}`}
                          style={
                            isSelected 
                              ? { backgroundColor: '#ef4444', color: '#ffffff' } 
                              : (!eligibility.isEligible 
                                  ? { backgroundColor: mode === 'skateboard' ? '#ffffff' : '#111827', color: mode === 'skateboard' ? '#000000' : '#ffffff' } 
                                  : { background: 'var(--primary-gradient)', color: '#ffffff' })
                          }
                        >
                          {isSelected ? '取消使用' : (eligibility.isEligible ? '立即套用至購物車' : '前往選購，自動帶入')}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
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
            <div className="flex justify-between items-center mb-8 h-10 px-2">
              <div 
                className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }}
              >
                <div className="flex items-center font-black text-xl tracking-tighter leading-none">
                  <span>SK8</span>
                  <span className="ml-1 text-lg uppercase tracking-widest">{mode === 'skiing' ? 'SKI' : 'SKATE'}</span>
                </div>
                {user && (
                  <div className="text-[10px] font-bold text-white/60 tracking-[0.2em] mt-1 uppercase">
                    ID: {isAdmin ? 'SK8管理者' : (user.user_metadata?.full_name || '使用者')}
                  </div>
                )}
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
              <div className="h-[1px] w-full bg-white/20" />
              <button onClick={() => { setIsMenuOpen(false); onSupportClick(); }} className="py-5 text-xl font-bold w-full text-center hover:bg-white/5 transition-all">客服專區</button>
              <div className="h-[1px] w-full bg-white/20" />
              
              {user ? (
                <div className="flex flex-col w-full">
                  <div className="h-[1px] w-full bg-white/20" />
                  <button 
                    onClick={() => { setIsMenuOpen(false); setIsMyVouchersOpen(true); }}
                    className="py-4 w-full text-center hover:bg-white/5 transition-all flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest block mb-1">我的優惠券</span>
                    <span className="text-lg font-bold">
                      現有 課程/優惠卷: {vouchers.length} 張
                    </span>
                  </button>
                  <div className="h-[1px] w-full bg-white/20" />
                  
                  {isAdmin && (
                    <>
                      <div className="p-4 w-full">
                        <button 
                          onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                          className="py-4 text-xl font-bold w-full text-center rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 transition-all hover:scale-105 active:scale-95"
                          style={{ backgroundColor: '#000000', color: '#ffffff' }}
                        >
                          管理後台
                        </button>
                      </div>
                      <div className="h-[1px] w-full bg-white/20" />
                    </>
                  )}
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="py-5 text-xl font-bold w-full text-center hover:bg-white/5 transition-all text-red-400"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                  className="py-5 text-xl font-bold w-full text-center hover:bg-white/5 transition-all"
                >
                  登入 / 註冊
                </button>
              )}
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
          <a href="#vouchers" className="flex flex-col items-center justify-center w-10 py-1">
            <Ticket size={18} strokeWidth={3} />
            <span className="text-[9px] font-black mt-0.5">兌換券</span>
          </a>

          {/* Shop */}
          <a href="#shop" className="flex flex-col items-center justify-center w-10 py-1">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="text-[9px] font-black mt-0.5">商城</span>
          </a>

          {/* Admin Dashboard */}
          {isAdmin && (
            <button onClick={onAdminClick} className="flex flex-col items-center justify-center w-10 py-1" style={{ color: 'var(--primary)' }}>
              <Settings2 size={18} strokeWidth={3} />
              <span className="text-[9px] font-black mt-0.5">後台</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
