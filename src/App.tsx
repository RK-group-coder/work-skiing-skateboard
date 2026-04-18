import React from 'react';
import { ThemeProvider } from './hooks/ThemeProvider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductShowcase from './components/ProductShowcase';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-text text-bg py-24 mt-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-black mb-6">F-DRIVE</h2>
            <p className="text-text-muted mb-8 pr-8">
              我們致力於提供最頂尖的戶外極限運動體驗，無論是雪地還是街道，這裡都是你的運動首選。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">關於我們</h4>
            <ul className="space-y-4 text-text-muted">
              <li><a href="#" className="hover:text-primary">品牌故事</a></li>
              <li><a href="#" className="hover:text-primary">最新消息</a></li>
              <li><a href="#" className="hover:text-primary">加入我們</a></li>
              <li><a href="#" className="hover:text-primary">永續經營</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">客戶服務</h4>
            <ul className="space-y-4 text-text-muted">
              <li><a href="#" className="hover:text-primary">購物指南</a></li>
              <li><a href="#" className="hover:text-primary">退換貨須知</a></li>
              <li><a href="#" className="hover:text-primary">門市據點</a></li>
              <li><a href="#" className="hover:text-primary">聯絡資訊</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">訂閱電子報</h4>
            <div className="flex bg-white/5 rounded-full p-2">
              <input type="email" placeholder="你的信箱" className="bg-transparent border-none outline-none px-4 flex-1 text-white" />
              <button className="bg-primary px-6 py-2 rounded-full font-bold">送出</button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>© 2026 F-DRIVE Extreme Center. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#">隱私權政策</a>
            <a href="#">服務條款</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Guarantees: React.FC = () => {
  const items = [
    { icon: <Truck />, text: '快速配送' },
    { icon: <ShieldCheck />, text: '一兩年保固' },
    { icon: <RotateCcw />, text: '七天鑑賞期' },
    { icon: <CreditCard />, text: '多元支付' },
  ];

  return (
    <div className="bg-secondary/50 py-12">
      <div className="container flex flex-wrap justify-between items-center gap-8">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 text-xl font-bold">
            <div className="text-primary">{item.icon}</div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <Guarantees />
          <Features />
          <ProductShowcase />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
