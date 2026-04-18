import React from 'react';
import { ThemeProvider } from './hooks/ThemeProvider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductShowcase from './components/ProductShowcase';
import { Award, ShieldCheck, Users, Heart } from 'lucide-react';

const CourseTrust: React.FC = () => {
  const items = [
    { icon: <Award />, text: '教練十年資歷' },
    { icon: <ShieldCheck />, text: '國際專業證照' },
    { icon: <Users />, text: '專屬小班教學' },
    { icon: <Heart />, text: '保險全程承保' },
  ];

  return (
    <div className="bg-secondary/50 py-16">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-4">
              <div className="text-primary bg-primary/10 p-4 rounded-2xl">
                {item.icon}
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Footer: React.FC = () => {
  return (
    <footer className="bg-text text-bg py-24 mt-20">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-black mb-6 text-white uppercase italic tracking-tighter">SK8 Extreme</h2>
            <p className="text-gray-400 mb-8 pr-12 leading-relaxed">
              我們致力於提供最頂尖的戶外極限運動體驗，無論是雪地還是街道，這裡都是您的運動首選。擁有超過十年的專業教練團隊，帶領您領略速度與自由的極致。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl text-white">快速連結</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">最新消息</a></li>
              <li><a href="#courses" className="hover:text-primary transition-colors">專業課程</a></li>
              <li><a href="#shop" className="hover:text-primary transition-colors">裝備商城</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">聯絡我們</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl text-white">關於我們</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">團隊介紹</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">品牌故事</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">加入我們</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 SK8 Extreme Center. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">隱私權政策</a>
            <a href="#" className="hover:text-white transition-colors">服務條款</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <CourseTrust />
          <Features />
          <ProductShowcase />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
