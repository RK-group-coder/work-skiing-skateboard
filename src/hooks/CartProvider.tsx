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
  target_type: 'global' | 'skiing' | 'skateboard' | 'category' | 'product' | 'course' | 'all_courses' | 'specific';
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
}

export interface CartContextType {
  cart: CartItem[];
  vouchers: Voucher[];
  selectedVoucher: Voucher | null;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
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

  useEffect(() => {
    const fetchUserVouchers = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_vouchers')
          .select('voucher_id, vouchers (*)')
          .eq('user_id', userId)
          .eq('is_used', false);
        
        if (data && !error) {
          const userVouchers = data.map((d: any) => d.vouchers).filter(Boolean);
          setVouchers(userVouchers);
        }
      } catch (err) {
        console.error('Error fetching user vouchers:', err);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          fetchUserVouchers(session.user.id);
        } else {
          setVouchers([]);
          setSelectedVoucher(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserVouchers(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const effectiveCart = directPurchaseItem ? [directPurchaseItem] : cart;

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
      return false;
    };

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
      
      const eligibleTotal = effectiveCart.filter(isItemEligible).reduce((sum, i) => sum + i.price * i.quantity, 0);
      
      if (selectedVoucher.type === 'percent') {
        discountedPrice = totalPrice - Math.round(eligibleTotal * (selectedVoucher.value / 100));
      } else {
        discountedPrice = totalPrice - Math.min(eligibleTotal, selectedVoucher.value);
      }
    } else {
      // If selected voucher becomes ineligible (e.g. item removed), auto-deselect
      setTimeout(() => setSelectedVoucher(null), 0);
    }
  }

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
      addToCart, removeFromCart, claimVoucher, selectVoucher, clearCart, 
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
