import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Voucher {
  id: string;
  title: string;
  description?: string;
  value: number; // e.g. 10 for 10% off, or 500 for fixed 500 off
  type: 'percent' | 'fixed';
  code: string;
  min_amount?: number; // Minimum spend requirement
  valid_until?: string;
  target_type: 'global' | 'skiing' | 'skateboard' | 'category' | 'product' | 'course' | 'all_courses' | 'specific' | 'special_bogo' | 'course_package';
  target_id?: string;
  grant_quantity?: number | null;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'product' | 'course_booking';
  image?: string;
  quantity: number;
  details?: any; // For booking dates, times, etc.
  weight?: string | number;
  dimensions?: string;
  tag?: string;
}

export interface CartContextType {
  cart: CartItem[];
  vouchers: Voucher[];
  selectedVoucher: Voucher | null;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  claimVoucher: (voucher: Voucher, count?: number) => void;
  selectVoucher: (voucherId: string | null) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discountedPrice: number;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  setDirectPurchaseItem: (item: CartItem | null) => void;
  getVoucherEligibility: (voucher: Voucher) => { isEligible: boolean; reason?: string };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directPurchaseItem, setDirectPurchaseItem] = useState<CartItem | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAutoSelectEnabled, setIsAutoSelectEnabled] = useState(true);

  useEffect(() => {
    const fetchUserVouchers = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_vouchers')
          .select('voucher_id, vouchers (*)')
          .eq('user_id', userId)
          .eq('is_used', false);
        
        if (data && !error) {
          const now = new Date();
          const userVouchers = data.map((d: any) => d.vouchers).filter((v: any) => {
            if (!v) return false;
            if (v.valid_until) {
              const validUntil = new Date(v.valid_until);
              validUntil.setHours(23, 59, 59, 999);
              if (validUntil < now) {
                const diffTime = Math.abs(now.getTime() - validUntil.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if (diffDays > 7) {
                  return false;
                }
              }
            }
            return true;
          });
          setVouchers(userVouchers);
        }
      } catch (err) {
        console.error('Error fetching user vouchers:', err);
      }
    };

    const loadCart = async (uid: string | null, user: any) => {
      let finalCart: CartItem[] = [];
      if (uid && user) {
        let anonCart: CartItem[] = [];
        try {
          const anonStored = localStorage.getItem('cart_anonymous');
          if (anonStored) anonCart = JSON.parse(anonStored);
        } catch(e){}

        let localCart: CartItem[] = [];
        try {
          const stored = localStorage.getItem(`cart_${uid}`);
          if (stored) localCart = JSON.parse(stored);
        } catch(e){}

        let cloudCart: CartItem[] = user.user_metadata?.cart || [];
        
        // Merge anon into cloud
        let merged = [...(cloudCart.length > 0 ? cloudCart : localCart)];
        if (anonCart.length > 0) {
           anonCart.forEach(item => {
             if (item.type === 'course_booking') {
               merged.push(item);
             } else {
               const existing = merged.find(i => i.id === item.id && i.type === item.type);
               if (existing) {
                 existing.quantity += item.quantity;
               } else {
                 merged.push(item);
               }
             }
           });
           localStorage.removeItem('cart_anonymous');
           // Update cloud immediately
           supabase.auth.updateUser({ data: { cart: merged } });
        }
        finalCart = merged;
      } else {
        try {
          const stored = localStorage.getItem('cart_anonymous');
          if (stored) finalCart = JSON.parse(stored);
        } catch(e){}
      }
      setCart(finalCart);
      setIsInitialized(true);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const uid = session?.user?.id || null;
        setUserId(uid);
        if (session?.user) {
          fetchUserVouchers(session.user.id);
          loadCart(uid, session.user);
        } else {
          setVouchers([]);
          setSelectedVoucher(null);
          loadCart(null, null);
        }
      }
    );

    const refresh = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const uid = session?.user?.id || null;
        setUserId(uid);
        if (session?.user) {
          fetchUserVouchers(session.user.id);
        }
        loadCart(uid, session?.user);
      });
    };

    window.addEventListener('vouchersUpdated', refresh);
    refresh();

    return () => {
      window.removeEventListener('vouchersUpdated', refresh);
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(`cart_${userId || 'anonymous'}`, JSON.stringify(cart));
      if (userId) {
         const timer = setTimeout(() => {
           supabase.auth.updateUser({ data: { cart: cart } });
         }, 2000);
         return () => clearTimeout(timer);
      }
    }
  }, [cart, userId, isInitialized]);

  let effectiveCart = directPurchaseItem ? [directPurchaseItem] : [...cart];

  if (selectedVoucher && selectedVoucher.target_type === 'special_bogo') {
    try {
      const config = JSON.parse(selectedVoucher.target_id || '{}');
      const buyReq = config.buy || {};
      
      let eligible = true;
      for (const [id, reqQty] of Object.entries(buyReq)) {
        const cartQty = effectiveCart.filter(i => (i.type === 'course_booking' ? i.details?.courseId : i.id) === id).reduce((sum, i) => sum + i.quantity, 0);
        if (cartQty < (reqQty as number)) { eligible = false; break; }
      }
      
      if (eligible) {
        const getDetails = config.get_details || {};
        for (const [id, details] of Object.entries(getDetails)) {
          const qty = config.get[id] || 1;
          const inCartQty = effectiveCart.filter(i => (i.type === 'course_booking' ? i.details?.courseId : i.id) === id || i.id === id + '_free').reduce((sum, i) => sum + i.quantity, 0);
          if (inCartQty < qty) {
            effectiveCart.push({
              id: id + '_free',
              name: `[贈品] ${(details as any).name}`,
              price: (details as any).price || 0,
              quantity: qty - inCartQty,
              type: (details as any).type || 'product',
              image: (details as any).image || '',
              details: { isFreeGift: true, mode: 'skiing', courseId: (details as any).type === 'course_booking' ? id : undefined }
            } as any);
          }
        }
      }
    } catch (e) {}
  }

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart(prev => {
      // For course bookings, we usually want them as unique items even if the course ID is the same
      if (item.type === 'course_booking') {
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }
      
      const existing = prev.find(i => i.id === item.id && i.type === item.type);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i);
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setCart(prev => {
      if (newQuantity <= 0) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: newQuantity } : i);
    });
  };

  const claimVoucher = (voucher: Voucher, count: number = 1) => {
    setVouchers(prev => {
      const newVouchers = [...prev];
      for (let i = 0; i < count; i++) {
        newVouchers.push(voucher);
      }
      return newVouchers;
    });
  };

  const selectVoucher = (voucherId: string | null) => {
    setIsAutoSelectEnabled(false);
    if (!voucherId) {
      setSelectedVoucher(null);
      return;
    }
    const voucher = vouchers.find(v => v.id === voucherId);
    setSelectedVoucher(voucher || null);
  };

  const clearCart = () => {
    if (directPurchaseItem) {
      setDirectPurchaseItem(null);
    } else {
      setCart([]);
    }
    setSelectedVoucher(null);
  };

  const totalItems = effectiveCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = effectiveCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getVoucherEligibility = (voucher: Voucher) => {
    if (voucher.valid_until) {
      const now = new Date();
      const validUntil = new Date(voucher.valid_until);
      validUntil.setHours(23, 59, 59, 999);
      if (validUntil < now) {
        return { isEligible: false, reason: '已過期' };
      }
    }

    if (effectiveCart.length === 0) {
      return { isEligible: false, reason: '購物車目前是空的' };
    }

    const isItemEligible = (i: CartItem) => {
      if (voucher.target_type === 'global') return true;
      if (voucher.target_type === 'specific') {
        const ids = (voucher.target_id || '').split(',');
        if (i.type === 'course_booking') return ids.includes(i.details?.courseId);
        return ids.includes(i.id);
      }
      if (voucher.target_type === 'all_courses') return i.type === 'course_booking';
      if (voucher.target_type === 'course') return i.type === 'course_booking' && i.details?.courseId === voucher.target_id;
      if (i.type !== 'product') return false; 
      if (voucher.target_type === 'product') return i.id === voucher.target_id;
      if (voucher.target_type === 'category') {
        // Support multi-category: check primary category_id AND all IDs in tag field
        const allCatIds = [i.details?.category_id, ...((i.details?.tag || '').split(','))].filter((id: string) => id && id.length === 36);
        return allCatIds.includes(voucher.target_id);
      }
      if (voucher.target_type === 'skiing') return i.details?.mode === 'skiing';
      if (voucher.target_type === 'skateboard') return i.details?.mode === 'skateboard';
      if (voucher.target_type === 'special_bogo') {
        try {
          const config = JSON.parse(voucher.target_id || '{}');
          const buyReq = config.buy || {};
          for (const [id, reqQty] of Object.entries(buyReq)) {
            const cartQty = effectiveCart.filter(i => (i.type === 'course_booking' ? i.details?.courseId : i.id) === id).reduce((sum, i) => sum + i.quantity, 0);
            if (cartQty < (reqQty as number)) return false;
          }
          return true;
        } catch (e) { return false; }
      }
      return false;
    };

    if (voucher.target_type === 'special_bogo') {
      const eligible = isItemEligible(effectiveCart[0]); // trick to reuse logic, actually just evaluating the whole cart
      if (!eligible) return { isEligible: false, reason: '未滿足此特殊優惠的購買條件' };
      return { isEligible: true };
    }

    const eligibleTotal = effectiveCart.filter(isItemEligible).reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (eligibleTotal === 0) {
      return { isEligible: false, reason: '購物車內沒有符合此優惠的商品' };
    }

    if (voucher.min_amount && eligibleTotal < voucher.min_amount) {
      return { isEligible: false, reason: `需滿 NT$${voucher.min_amount} 才能使用` };
    }

    return { isEligible: true };
  };

  // Calculate discount
  let discountedPrice = totalPrice;
  
  if (selectedVoucher) {
    const { isEligible } = getVoucherEligibility(selectedVoucher);
    
    if (isEligible) {
      const isItemEligible = (i: CartItem) => {
        if (selectedVoucher.target_type === 'global') return true;
        if (selectedVoucher.target_type === 'specific') {
          const ids = (selectedVoucher.target_id || '').split(',');
          if (i.type === 'course_booking') return ids.includes(i.details?.courseId);
          return ids.includes(i.id);
        }
        if (selectedVoucher.target_type === 'all_courses') return i.type === 'course_booking';
        if (selectedVoucher.target_type === 'course') return i.type === 'course_booking' && i.details?.courseId === selectedVoucher.target_id;
        if (i.type !== 'product') return false; 
        if (selectedVoucher.target_type === 'product') return i.id === selectedVoucher.target_id;
        if (selectedVoucher.target_type === 'category') {
          const allCatIds = [i.details?.category_id, ...((i.details?.tag || '').split(','))].filter((id: string) => id && id.length === 36);
          return allCatIds.includes(selectedVoucher.target_id);
        }
        if (selectedVoucher.target_type === 'skiing') return i.details?.mode === 'skiing';
        if (selectedVoucher.target_type === 'skateboard') return i.details?.mode === 'skateboard';
        return false;
      };
      
      if (selectedVoucher.target_type === 'special_bogo') {
        try {
          const config = JSON.parse(selectedVoucher.target_id || '{}');
          const getReq = config.get || {};
          let totalDiscount = 0;
          for (const [id, reqQty] of Object.entries(getReq)) {
             const matchingItems = effectiveCart.filter(i => (i.type === 'course_booking' ? i.details?.courseId : i.id) === id || i.id === id + '_free');
             let remainingQtyToDiscount = reqQty as number;
             for (const item of matchingItems) {
                if (remainingQtyToDiscount <= 0) break;
                const discountQty = Math.min(remainingQtyToDiscount, item.quantity);
                totalDiscount += item.price * discountQty;
                remainingQtyToDiscount -= discountQty;
             }
          }
          discountedPrice = Math.max(0, totalPrice - totalDiscount);
        } catch (e) {}
      } else {
        const eligibleTotal = effectiveCart.filter(isItemEligible).reduce((sum, i) => sum + i.price * i.quantity, 0);
        
        if (selectedVoucher.type === 'percent') {
          discountedPrice = totalPrice - Math.round(eligibleTotal * (selectedVoucher.value / 100));
        } else {
          discountedPrice = totalPrice - Math.min(eligibleTotal, selectedVoucher.value);
        }
      }
    } else {
      // If selected voucher becomes ineligible (e.g. item removed), auto-deselect
      setTimeout(() => setSelectedVoucher(null), 0);
    }
  }

  // Auto-select eligible voucher if none is selected
  useEffect(() => {
    if (isAutoSelectEnabled && !selectedVoucher && effectiveCart.length > 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const eligibleVouchers = vouchers.filter(v => getVoucherEligibility(v).isEligible && v.target_type !== 'course_package');
      if (eligibleVouchers.length > 0) {
        setSelectedVoucher(eligibleVouchers[0]);
      }
    }
  }, [cart, directPurchaseItem, vouchers, selectedVoucher, isAutoSelectEnabled]);

  // Custom handler for closing checkout to clear direct purchase item
  const handleSetIsCheckoutOpen = (open: boolean) => {
    setIsCheckoutOpen(open);
    if (!open) {
      setDirectPurchaseItem(null);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart: effectiveCart, vouchers, selectedVoucher, 
      addToCart, removeFromCart, updateQuantity, claimVoucher, selectVoucher, clearCart, 
      totalItems, totalPrice, discountedPrice,
      isCheckoutOpen, setIsCheckoutOpen: handleSetIsCheckoutOpen,
      setDirectPurchaseItem, getVoucherEligibility
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
