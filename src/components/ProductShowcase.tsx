import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import skiProd from '../assets/ski_product_1.png';
import skateProd from '../assets/skate_product_1.png';
import { ShoppingBag, Heart } from 'lucide-react';

const ProductShowcase: React.FC = () => {
  const { mode } = useTheme();
  const [activeCategory, setActiveCategory] = React.useState('全部');

  const categories = mode === 'skiing' 
    ? ['全部', '滑雪板', '護具', '服飾', '配件']
    : ['全部', '電動滑板', '護具', '配件'];

  const products = mode === 'skiing' ? [
    { id: 1, name: '專業雙板滑板', price: '24,900', rating: 4.9, image: skiProd, tag: '雪板', desc: '適合中高級滑雪者' },
    { id: 2, name: '全地形單板', price: '18,500', rating: 4.8, image: skiProd, tag: '雪板', desc: '全山地穩定性極佳' },
    { id: 3, name: '碳纖維雪杖', price: '3,200', rating: 4.7, image: skiProd, tag: '配件', desc: '極輕量化設計' },
    { id: 4, name: '專業滑雪頭盔', price: '4,500', rating: 4.9, image: skiProd, tag: '護具', desc: 'MIPS 安全系統' },
    { id: 5, name: '偏光滑雪鏡', price: '3,800', rating: 4.6, image: skiProd, tag: '配件', desc: '防霧廣角視野' },
    { id: 6, name: '保暖滑雪手套', price: '2,600', rating: 4.8, image: skiProd, tag: '服飾', desc: '防水透氣 GORE-TEX' },
    { id: 7, name: '滑雪防護背甲', price: '5,200', rating: 4.5, image: skiProd, tag: '護具', desc: '吸震減壓材質' },
    { id: 8, name: '雪靴收納包', price: '1,500', rating: 4.7, image: skiProd, tag: '配件', desc: '耐磨防水材質' }
  ] : [
    { id: 1, name: '高性能電滑板', price: '32,800', rating: 4.9, image: skateProd, tag: '滑板', desc: '雙馬達驅動' },
    { id: 2, name: '城市通勤電滑板', price: '15,800', rating: 4.8, image: skateProd, tag: '滑板', desc: '輕量化設計' },
    { id: 3, name: '越野全地形板', price: '45,000', rating: 4.9, image: skateProd, tag: '滑板', desc: '超強馬力突破' },
    { id: 4, name: '智能燈光頭盔', price: '3,500', rating: 4.7, image: skateProd, tag: '護具', desc: '內建轉向燈' },
    { id: 5, name: '防摔護膝組', price: '1,200', rating: 4.6, image: skateProd, tag: '護具', desc: '硬殼防護襯墊' },
    { id: 6, name: '藍牙遙控手把', price: '2,800', rating: 4.8, image: skateProd, tag: '配件', desc: 'LCD 螢幕顯示' },
    { id: 7, name: '滑板背包', price: '2,400', rating: 4.7, image: skateProd, tag: '配件', desc: '可固定滑板設計' },
    { id: 8, name: '備用高效電池', price: '8,900', rating: 4.9, image: skateProd, tag: '配件', desc: '快速充電技術' }
  ];

  return (
    <section id="shop" className="py-20 md:py-32 bg-white">
      <div className="container px-4">
        {/* Mobile Header */}
        <div className="md:hidden text-center mb-10 pt-4">
          <h2 className="text-4xl font-black mb-3 text-gray-900">
            {mode === 'skiing' ? '滑雪裝備商店' : '電動滑板商店'}
          </h2>
          <p className="text-gray-500 font-medium">
            {mode === 'skiing' ? '頂級滑雪裝備，讓你征服每一座雪山' : '頂級電動滑板裝備，體驗極速快感'}
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

        {/* Product Grid - 2 in a row on Mobile / 2-3 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#e50012] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  熱銷
                </div>
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>

              <div>
                <div className="inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold mb-2 text-gray-500">
                  {p.tag}
                </div>
                <h3 className="text-sm md:text-2xl font-black mb-1 line-clamp-1 text-gray-900">{p.name}</h3>
                <div className="text-lg md:text-2xl font-black text-[#e50012]">
                  NT$ {p.price}
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
