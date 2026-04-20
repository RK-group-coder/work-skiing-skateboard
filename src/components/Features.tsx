import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { Check, Ticket } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative group overflow-hidden rounded-[32px] p-1 ${
              mode === 'skiing' ? 'bg-blue-500/20' : 'bg-red-500/20'
            }`}
          >
            {/* Glossy Aura */}
            <div className={`absolute inset-0 opacity-20 blur-3xl transition-colors duration-500 ${
              mode === 'skiing' ? 'bg-blue-400' : 'bg-red-500'
            }`} />

            <div className={`relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-[30px] border-2 border-dashed ${
              mode === 'skiing' 
              ? 'bg-white border-blue-200 shadow-[0_20px_50px_rgba(59,130,246,0.15)]' 
              : 'bg-gray-900 border-red-900/50 shadow-[0_20px_50px_rgba(239,68,68,0.15)] text-white'
            }`}>
              
              {/* Left Side: Voucher Info */}
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Ticket size={40} className="text-primary animate-pulse" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    Limited Time
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                    VIP 專屬
                  </span>
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter mb-1">
                  領取首次課程 9 折優惠
                </h3>
                <p className="text-sm opacity-60 font-medium">
                  適用於所有初學者體驗班與進階技巧營
                </p>
              </div>

              {/* Right Side: Action */}
              <div className="flex flex-col items-center md:items-end gap-3 min-w-[160px]">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Coupon Code</p>
                  <p className="text-3xl font-black italic tracking-tighter text-primary">SK8-HOT</p>
                </div>
                <button 
                  onClick={() => alert('優惠券已存入帳號！兌換碼：SK8-HOT')}
                  className="w-full py-3 px-6 rounded-xl font-black text-xs tracking-widest uppercase text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  立即領取
                </button>
              </div>

              {/* Decorative Perforated Circles */}
              <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-8 h-8 rounded-full ${mode === 'skiing' ? 'bg-secondary' : 'bg-secondary'}`} />
              <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-8 h-8 rounded-full ${mode === 'skiing' ? 'bg-secondary' : 'bg-secondary'}`} />
            </div>
          </motion.div>
        </div>

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
                p.popular ? 'md:ring-2 md:ring-primary md:scale-110 z-10' : 'bg-opacity-80'
              }`}
            >

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
