import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/CartProvider';
import { motion } from 'framer-motion';
import skiProd from '../assets/ski_product_1.png';
import skateProd from '../assets/skate_product_1.png';
import { ShoppingBag, Heart, ShoppingCart } from 'lucide-react';

const ProductShowcase: React.FC = () => {
  const { mode } = useTheme();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = React.useState('全部');

  const categories = mode === 'skiing' 
    ? ['全部', '滑雪板', '護具', '服飾', '配件']
    : ['全部', '電動滑板', '護具', '配件'];

  const rawProducts = mode === 'skiing' ? [
    { id: 'ski-1', name: '專業雙板滑板', price: 24900, rating: 4.9, image: skiProd, tag: '雪板', desc: '適合中高級滑雪者' },
    { id: 'ski-2', name: '全地形單板', price: 18500, rating: 4.8, image: skiProd, tag: '雪板', desc: '全山地穩定性極佳' },
    { id: 'ski-3', name: '碳纖維雪杖', price: 3200, rating: 4.7, image: skiProd, tag: '配件', desc: '極輕量化設計' },
    { id: 'ski-4', name: '專業滑雪頭盔', price: 4500, rating: 4.9, image: skiProd, tag: '護具', desc: 'MIPS 安全系統' },
    { id: 'ski-5', name: '偏光滑雪鏡', price: 3800, rating: 4.6, image: skiProd, tag: '配件', desc: '防霧廣角視野' },
    { id: 'ski-6', name: '保暖滑雪手套', price: 2600, rating: 4.8, image: skiProd, tag: '服飾', desc: '防水透氣 GORE-TEX' },
    { id: 'ski-7', name: '滑雪防護背甲', price: 5200, rating: 4.5, image: skiProd, tag: '護具', desc: '吸震減壓材質' },
    { id: 'ski-8', name: '雪靴收納包', price: 1500, rating: 4.7, image: skiProd, tag: '配件', desc: '耐磨防水材質' }
  ] : [
    { id: 'skate-1', name: '高性能電滑板', price: 32800, rating: 4.9, image: skateProd, tag: '滑板', desc: '雙馬達驅動' },
    { id: 'skate-2', name: '城市通勤電滑板', price: 15800, rating: 4.8, image: skateProd, tag: '滑板', desc: '輕量化設計' },
    { id: 'skate-3', name: '越野全地形板', price: 45000, rating: 4.9, image: skateProd, tag: '滑板', desc: '超強馬力突破' },
    { id: 'skate-4', name: '智能燈光頭盔', price: 3500, rating: 4.7, image: skateProd, tag: '護具', desc: '內建轉向燈' },
    { id: 'skate-5', name: '防摔護膝組', price: 1200, rating: 4.6, image: skateProd, tag: '護具', desc: '硬殼防護襯墊' },
    { id: 'skate-6', name: '藍牙遙控手把', price: 2800, rating: 4.8, image: skateProd, tag: '配件', desc: 'LCD 螢幕顯示' },
    { id: 'skate-7', name: '滑板背包', price: 2400, rating: 4.7, image: skateProd, tag: '配件', desc: '可固定滑板設計' },
    { id: 'skate-8', name: '備用高效電池', price: 8900, rating: 4.9, image: skateProd, tag: '配件', desc: '快速充電技術' }
  ];

  const filteredProducts = activeCategory === '全部' 
    ? rawProducts 
    : rawProducts.filter(p => p.tag === activeCategory);

  return (
    <section id="shop" className="py-20 md:py-32 bg-white">
      <div className="container px-4">
        {/* Mobile Header */}
        <div className="md:hidden text-center mb-10 pt-4">
          <h2 className="text-4xl font-black mb-3 text-gray-900">
            {mode === 'skiing' ? '滑雪裝備商店' : '電動滑板商店'}
          </h2>
          <p className="text-gray-500 font-medium">
            {mode === 'skiing' ? '頂級滑雪裝備，讓你征服每一座雪山的極致首選' : '頂級電動滑板裝備，體驗極速快感'}
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">精選裝備</span>
            <h2 className="text-5xl font-black">{mode === 'skiing' ? '頂級雪具專區' : '越野電能板專區'}</h2>
          </div>
          <button className="text-primary font-bold hover:underline flex items-center gap-2">
            查看全部商品 <ShoppingBag size={20} />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="relative mb-8 overflow-hidden">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-4">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  HOT
                </div>
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, type: 'product', image: p.image })}
                    className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  <button className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-2xl hover:text-red-500 transition-all transform translate-y-4 group-hover:translate-y-0 delay-75">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              <div className="px-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{p.tag}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    <span>⭐ {p.rating}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-1 truncate text-gray-900 group-hover:text-primary transition-colors">{p.name}</h3>
                <div className="text-lg font-black text-gray-900">
                  NT${p.price.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
