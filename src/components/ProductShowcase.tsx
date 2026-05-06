import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronRight } from 'lucide-react';
import { useCart } from '../hooks/CartProvider';
import { useTheme } from '../hooks/useTheme';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  category_id?: string;
  mode?: string;
  tag?: string;
  description?: string;
  stock: number | null;
  material?: string;
  weight?: string;
  dimensions?: string;
  size_chart_url?: string;
}

const ProductShowcase: React.FC = () => {
  const { mode } = useTheme();
  const { addToCart, setIsCheckoutOpen, setDirectPurchaseItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setActiveCategory('all'); // Reset filter when switching modes
      try {
        // Fetch Title & Description
        const { data: settings } = await supabase
          .from('homepage_settings')
          .select('shop_title, shop_desc')
          .eq('id', mode)
          .single();
        
        if (settings) {
          setTitle(settings.shop_title);
          setDescription(settings.shop_desc);
        }

        // Fetch Categories
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('mode', mode);
        
        if (catData) {
          setCategories(catData.map(c => ({ id: c.id, name: c.name })));
        }

        // Fetch Products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('mode', mode)
          .eq('is_active', true);
        
        if (productsData) {
          setProducts(productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.special_price || p.price,
            originalPrice: p.special_price ? p.price : undefined,
            image: p.image_url,
            category: 'Gear',
            category_id: p.category_id,
            mode: p.mode,
            tag: p.tag,
            description: p.description,
            stock: p.stock,
            material: p.material,
            weight: p.weight,
            dimensions: p.dimensions,
            size_chart_url: p.size_chart_url
          })));
        }
      } catch (err) {
        console.error('Error fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [mode]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    
    // Create flying image
    const img = document.createElement('img');
    img.src = product.image;
    img.className = 'fixed z-[9999] rounded-[20px] object-cover shadow-2xl pointer-events-none transition-all';
    img.style.width = '120px';
    img.style.height = '150px';
    // Start from the button's position
    img.style.left = `${rect.left + rect.width / 2 - 60}px`;
    img.style.top = `${rect.top - 100}px`;
    img.style.transform = 'scale(1)';
    img.style.opacity = '1';
    img.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
    
    document.body.appendChild(img);
    
    // Force reflow
    void img.offsetWidth;
    
    // Find visible cart icon
    const cartIcons = document.querySelectorAll('#header-cart-icon');
    let targetX = window.innerWidth - 40;
    let targetY = 20;
    
    for (let i = 0; i < cartIcons.length; i++) {
      const el = cartIcons[i] as HTMLElement;
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        const iconRect = el.getBoundingClientRect();
        targetX = iconRect.left + iconRect.width / 2 - 30; // center of 60x60
        targetY = iconRect.top + iconRect.height / 2 - 30;
        break;
      }
    }
    
    img.style.left = `${targetX}px`;
    img.style.top = `${targetY}px`;
    img.style.transform = 'scale(0.1)';
    img.style.opacity = '0';
    
    // Clean up
    setTimeout(() => {
      if (document.body.contains(img)) {
        document.body.removeChild(img);
      }
    }, 800);

    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      type: 'product', 
      image: product.image,
      details: { mode: product.mode, category_id: product.category_id, tag: product.tag }
    });
    setSelectedProduct(null);
  };

  if (loading && products.length === 0) return null;

  return (
    <section id="shop" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-4 uppercase"
          >
            {title || (mode === 'skiing' ? '滑雪套裝' : '滑板套裝')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto font-medium"
          >
            {description || '為您精選最優質的極限運動裝備。'}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            onClick={() => setActiveCategory('all')}
            style={activeCategory === 'all' ? { backgroundColor: '#4b5563', color: '#ffffff' } : { backgroundColor: '#f9fafb', color: '#6b7280' }}
            className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm border border-gray-100"
          >
            全部 ALL
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={activeCategory === cat.id ? { backgroundColor: '#4b5563', color: '#ffffff' } : { backgroundColor: '#f9fafb', color: '#6b7280' }}
              className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm border border-gray-100"
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.filter(p => activeCategory === 'all' || p.category_id === activeCategory || (p.tag || "").split(',').includes(activeCategory)).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-50 mb-6 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock !== null && product.stock <= 0 ? 'grayscale opacity-60' : ''}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                {product.stock !== null && product.stock <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 bg-black text-white text-xs font-black italic uppercase tracking-tighter rounded-xl shadow-xl ring-1 ring-white/20">SOLD OUT / 完售</span>
                  </div>
                )}
              </div>

              <div className="px-2">
                <div className="flex justify-between items-start mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                     {(() => {
                       const catIds = [product.category_id, ...(product.tag || "").split(',')].filter(id => id && id.length === 36);
                       const uniqueCatIds = Array.from(new Set(catIds));
                       const firstName = uniqueCatIds.map(id => categories.find(c => c.id === id)?.name).filter(Boolean)[0];
                       if (firstName) return firstName;
                       const otherTag = (product.tag || "").split(',').filter(t => t && t.length !== 36)[0];
                       return otherTag || 'New Arrival';
                     })()}
                   </span>
                   <span className="text-[10px] font-bold text-gray-400 shrink-0">STOCK: {product.stock}</span>
                </div>
                <h3 className="text-lg font-black italic tracking-tighter text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">原價</span>
                        <span className="text-[10px] text-gray-400 line-through font-bold">NT${product.originalPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-gray-900">NT${product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap">會員價</span>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Header / Close Button Area */}
              <div className="flex justify-end p-4 absolute top-0 right-0 z-[110]">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-3 bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all shadow-sm"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              {/* Main Scrollable Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row min-h-full">
                  {/* Images Section */}
                  <div className="md:w-1/2 p-6 md:p-10 h-fit">
                    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 md:flex-col md:overflow-visible">
                      <div className="flex-shrink-0 w-full snap-center rounded-[32px] overflow-hidden bg-gray-50 border border-gray-100 aspect-[4/5] shadow-sm relative">
                        <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                      </div>
                      
                      {(selectedProduct.size_chart_url || "").split(',').filter(Boolean).map((url: string, idx: number) => (
                        <div key={idx} className="flex-shrink-0 w-full snap-center rounded-[32px] overflow-hidden bg-gray-50 border border-gray-100 aspect-[4/5] shadow-sm relative">
                          <img src={url} className="w-full h-full object-cover" alt={`Sub ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="md:w-1/2 p-8 md:p-12 pb-32">
                    <div className="mb-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{selectedProduct.tag || 'Premium Gear'}</span>
                      <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter text-gray-900 mb-4 leading-tight">{selectedProduct.name}</h3>
                      <div className="flex flex-col mb-8">
                        {selectedProduct.originalPrice && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">原價</span>
                            <span className="text-sm text-gray-400 line-through font-bold">NT${selectedProduct.originalPrice.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-black text-primary">NT${selectedProduct.price.toLocaleString()}</div>
                          {selectedProduct.originalPrice && (
                            <span className="bg-primary/10 text-primary text-xs font-black px-2 py-1 rounded-lg">會員獨享價</span>
                          )}
                        </div>
                      </div>
                      <div className="h-px bg-gray-100 w-full mb-8" />
                      <p className="text-gray-500 leading-relaxed font-medium whitespace-pre-wrap text-base">
                        {selectedProduct.description || '--'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-8 rounded-[32px] border border-gray-100">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">庫存狀態</p>
                        <p className="text-sm font-bold text-gray-900">
                          {selectedProduct.stock === null ? '無限庫存' : (selectedProduct.stock > 0 ? `現貨: ${selectedProduct.stock}件` : '--')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">主要材質</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProduct.material || '--'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">重量參考</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProduct.weight || '--'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">包裝尺寸</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProduct.dimensions || '--'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="sticky bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex gap-3 z-[120] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <button 
                  onClick={(e) => handleAddToCart(e, selectedProduct)}
                  disabled={selectedProduct.stock !== null && selectedProduct.stock <= 0}
                  style={{ 
                    backgroundColor: (selectedProduct.stock !== null && selectedProduct.stock <= 0) ? '#f3f4f6' : (mode === 'skiing' ? '#dbeafe' : '#fee2e2'), 
                    color: (selectedProduct.stock !== null && selectedProduct.stock <= 0) ? '#9ca3af' : (mode === 'skiing' ? '#1e40af' : '#991b1b'),
                    borderColor: (selectedProduct.stock !== null && selectedProduct.stock <= 0) ? '#e5e7eb' : (mode === 'skiing' ? '#bfdbfe' : '#fecaca')
                  }}
                  className="flex-1 py-4 rounded-2xl font-black italic uppercase transition-all hover:opacity-80 active:scale-95 flex items-center justify-center gap-2 border disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} />
                  <span className="hidden sm:inline text-xs">{(selectedProduct.stock !== null && selectedProduct.stock <= 0) ? '庫存不足' : '加入購物車'}</span>
                  <span className="sm:hidden text-[10px]">{(selectedProduct.stock !== null && selectedProduct.stock <= 0) ? '完售' : '購物車'}</span>
                </button>
                <button 
                  onClick={() => {
                    if (selectedProduct.stock !== null && selectedProduct.stock <= 0) return;
                    setDirectPurchaseItem({ 
                      id: selectedProduct.id, 
                      name: selectedProduct.name, 
                      price: selectedProduct.price, 
                      type: 'product', 
                      image: selectedProduct.image, 
                      quantity: 1,
                      details: { mode: selectedProduct.mode, category_id: selectedProduct.category_id, tag: selectedProduct.tag }
                    });
                    setIsCheckoutOpen(true);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock !== null && selectedProduct.stock <= 0}
                  style={{ backgroundColor: (selectedProduct.stock !== null && selectedProduct.stock <= 0) ? '#e5e7eb' : (mode === 'skiing' ? '#2563eb' : '#dc2626'), color: (selectedProduct.stock !== null && selectedProduct.stock <= 0) ? '#9ca3af' : '#ffffff' }}
                  className="flex-[2] py-4 rounded-2xl font-black italic shadow-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all uppercase disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {(selectedProduct.stock !== null && selectedProduct.stock <= 0) ? 'SOLD OUT / 已完售' : '立刻直接購買'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductShowcase;
