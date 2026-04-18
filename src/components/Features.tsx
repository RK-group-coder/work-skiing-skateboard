import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { Shield, Zap, Compass } from 'lucide-react';

const Features: React.FC = () => {
  const { mode } = useTheme();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: mode === 'skiing' ? '專業安全保障' : '極致穩定性能',
      desc: mode === 'skiing' ? '所有裝備均經過嚴格安全測試，課程由專業教練領軍。' : '採用最新平衡感應技術，即使高速行駛也能保持穩定。'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: mode === 'skiing' ? '頂級裝備租賃' : '強力電池續航',
      desc: mode === 'skiing' ? '提供國際知名品牌滑雪板與保暖衣物，輕量且高性能。' : '配備高密度鋰電池，充電一次可續航 40 公里以上。'
    },
    {
      icon: <Compass className="w-8 h-8 text-primary" />,
      title: mode === 'skiing' ? '秘境雪道導引' : '全地形適應力',
      desc: mode === 'skiing' ? '帶領你前往極少人知的天然雪場，享受未經開發的粉雪。' : '越野級輪胎配置，無論是砂石路還是斜坡都能輕鬆應對。'
    }
  ];

  return (
    <section className="py-24 bg-secondary transition-colors duration-500">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-bg p-10 rounded-3xl shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden"
            >
              <div className="relative z-10">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-text-muted leading-relaxed">{f.desc}</p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
