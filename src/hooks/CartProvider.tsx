import React, { createContext, useContext, useState } from 'react';

export interface Voucher {
  id: string;
  title: string;
  discount: number; // 0.9 for 10% off, or a fixed amount like 500
  type: 'percentage' | 'fixed';
  code: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'product';
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  vouchers: Voucher[];
  selectedVoucher: Voucher | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  claimVoucher: (voucher: Voucher) => void;
  selectVoucher: (voucherId: string | null) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discountedPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const claimVoucher = (voucher: Voucher) => {
    setVouchers(prev => {
      if (prev.find(v => v.id === voucher.id)) return prev;
      return [...prev, voucher];
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
    setCart([]);
    setSelectedVoucher(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate discount
  let discountedPrice = totalPrice;
  if (selectedVoucher) {
    if (selectedVoucher.type === 'percentage') {
      discountedPrice = Math.round(totalPrice * selectedVoucher.discount);
    } else {
      discountedPrice = Math.max(0, totalPrice - selectedVoucher.discount);
    }
  }

  return (
    <CartContext.Provider value={{ 
      cart, vouchers, selectedVoucher, 
      addToCart, removeFromCart, claimVoucher, selectVoucher, clearCart, 
      totalItems, totalPrice, discountedPrice 
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
