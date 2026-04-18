import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

const Features: React.FC = () => {
  const { mode } = useTheme();

  const plans = mode === 'skiing' ? [
    {
      name: '初心者體驗班',
      price: '2,500',
      period: '單堂 (3小時)',
      features: ['裝備全額租借', '基礎平衡教學', '緩坡滑行練習', '專業教練指導'],
      popular: false
    },
    {
      name: '進階技巧營',
      price: '8,800',
      period: '三日密集',
      features: ['平行轉向技術', 'S型路徑優化', '煞車進階控制', '附贈午餐與證書'],
      popular: true
    },
    {
      name: '大師專業特訓',
      price: '15,000',
      period: '二日 1對1',
      features: ['全山地形攻略', '私人錄影分析', '不限次數裝借', 'VIP 專屬休息室'],
      popular: false
    }
  ] : [
    {
      name: '城市滑行入門',
      price: '1,200',
      period: '單堂 (2小時)',
      features: ['電板基礎操作', '煞車感應練習', '城市路況解說', '安全護具提供'],
      popular: false
    },
    {
      name: '電能技術工坊',
      price: '4,500',
      period: '二日特訓',
      features: ['高速過彎技巧', 'APP 參數調教', '長途續航规划', '保養維護課程'],
      popular: true
    },
    {
      name: '越野大師挑戰',
      price: '9,800',
      period: '全地形課程',
      features: ['砂石路段攻克', '陡坡攀爬訓練', '越野專用裝備單', '社群榮譽勳章'],
      popular: false
    }
  ];

  return (
    <section id="courses" className="py-24 bg-secondary transition-colors duration-500 overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-16 px-4">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">熱門選擇</span>
          <h2 className={`text-4xl md:text-5xl font-black mb-6 ${mode === 'skiing' ? 'text-gray-900' : 'text-white'}`}>
            絕配您的滑行方案
          </h2>
          <p className={`max-w-2xl mx-auto ${mode === 'skiing' ? 'text-gray-500' : 'text-gray-300'}`}>
            無論您是初出茅廬的新手，還是追求極致的專家，我們都有為您量身打造的課程。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white p-8 rounded-[40px] shadow-xl transition-all duration-300 flex flex-col ${
                p.popular ? 'md:ring-2 md:ring-primary scale-105 md:scale-110 z-10' : 'bg-opacity-80'
              }`}
            >
              {p.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> 最受歡迎
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">NT${p.price}</span>
                  <span className="text-sm text-gray-400">/ {p.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-primary" strokeWidth={3} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 text-white ${
                  p.popular 
                  ? 'shadow-primary/30 hover:brightness-110 scale-105 md:scale-100' 
                  : 'shadow-black/5 hover:brightness-110'
                }`}
                style={{ background: 'var(--primary-gradient)' }}
              >
                立即報名
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
