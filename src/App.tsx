import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './hooks/ThemeProvider';
import { CartProvider } from './hooks/CartProvider';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductShowcase from './components/ProductShowcase';
import Contact from './components/Contact';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import { Award, ShieldCheck, Users, Heart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { useCart } from './hooks/CartProvider';

const CheckoutModal = React.lazy(() => import('./components/CheckoutModal'));

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-2xl font-black italic tracking-tighter text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><X size={24} /></button>
        </div>
        <div className="p-8 pt-6 max-h-[70vh] overflow-y-auto">
          <div className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
            {children}
          </div>
        </div>
        <div className="p-8 pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
          >
            關閉
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CourseTrust: React.FC = () => {
  const { mode } = useTheme();
  const [trustItems, setTrustItems] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchTrust = async () => {
      try {
        const { data, error } = await supabase.from('homepage_settings')
          .select('trust_item_1, trust_item_2, trust_item_3, trust_item_4')
          .eq('id', mode)
          .single();
        if (error) throw error;
        if (data) {
          setTrustItems([data.trust_item_1, data.trust_item_2, data.trust_item_3, data.trust_item_4].filter(Boolean));
        }
      } catch (err) {
        console.error('Error fetching trust items:', err);
      }
    };
    fetchTrust();
  }, [mode]);

  const icons = [Award, ShieldCheck, Users, Heart];

  return (
    <section className="py-12 bg-[var(--bg)] transition-colors duration-500">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {trustItems.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-6 rounded-3xl bg-[var(--card-bg)] border border-white/5 shadow-xl"
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0" style={{ color: 'var(--primary)' }}>
                  <Icon size={20} />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text)]">{item}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  const { mode } = useTheme();
  const [desc, setDesc] = React.useState('我們致力於提供最頂尖的戶外極限運動體驗，無論是雪地還是街道，這裡都是您的運動首選。擁有超過十年的專業教練團隊，帶領您領略速度與自由的極致。');
  const [aboutContent, setAboutContent] = React.useState({ team: '', story: '', join: '', terms: '', privacy: '', refund: '' });
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFooter = async () => {
      try {
        const { data, error } = await supabase.from('homepage_settings')
          .select('footer_desc, about_team, about_story, about_join, terms_of_service, privacy_policy, refund_policy')
          .eq('id', mode)
          .single();
        if (error) throw error;
        if (data) {
          if (data.footer_desc) setDesc(data.footer_desc);
          setAboutContent({
            team: data.about_team || (mode === 'skiing' ? '我們的滑雪教練團隊均擁有國際證照，具備十年以上的教學經驗。' : '我們的滑板團隊由專業運動員組成。'),
            story: data.about_story || '品牌故事正在撰寫中...',
            join: data.about_join || '歡迎加入我們的專業團隊。',
            terms: data.terms_of_service || '',
            privacy: data.privacy_policy || '',
            refund: data.refund_policy || ''
          });
        }
      } catch (err) {
        console.error('Error fetching footer:', err);
      }
    };
    fetchFooter();
  }, [mode]);

  return (
    <>
      <footer className="bg-[#1a1a1a] text-white py-24 mt-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <h2 className="text-3xl font-black mb-6 text-white uppercase italic tracking-tighter">SK8 Extreme</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {desc}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-xl text-white">快速連結</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#top" className="hover:text-primary transition-colors">回到主頁</a></li>
                <li><a href="#courses" className="hover:text-primary transition-colors">專業課程</a></li>
                <li><a href="#shop" className="hover:text-primary transition-colors">裝備商城</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">聯絡我們</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-xl text-white">關於我們</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => setActiveModal('team')} className="hover:text-primary transition-colors text-left">團隊介紹</button></li>
                <li><button onClick={() => setActiveModal('story')} className="hover:text-primary transition-colors text-left">品牌故事</button></li>
                <li><button onClick={() => setActiveModal('join')} className="hover:text-primary transition-colors text-left">加入我們</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-xl text-white">政策條款</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-primary transition-colors text-left">隱私權政策</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="hover:text-primary transition-colors text-left">服務條款</button></li>
                <li><button onClick={() => setActiveModal('refund')} className="hover:text-primary transition-colors text-left">退換貨政策</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex justify-center text-sm text-gray-500">
            <p>© 2026 SK8 Extreme Center. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <Modal isOpen={activeModal === 'team'} onClose={() => setActiveModal(null)} title="團隊介紹">
        {aboutContent.team}
      </Modal>
      <Modal isOpen={activeModal === 'story'} onClose={() => setActiveModal(null)} title="品牌故事">
        {aboutContent.story}
      </Modal>
      <Modal isOpen={activeModal === 'join'} onClose={() => setActiveModal(null)} title="加入我們">
        {aboutContent.join}
      </Modal>
      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="服務條款">
        {aboutContent.terms}
      </Modal>
      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="隱私權政策">
        {aboutContent.privacy}
      </Modal>
      <Modal isOpen={activeModal === 'refund'} onClose={() => setActiveModal(null)} title="退換貨與取消預約政策">
        {aboutContent.refund}
      </Modal>
    </>
  );
};

function AuthModalWrapper({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mode } = useTheme();
  return <AuthModal isOpen={isOpen} onClose={onClose} mode={mode} />;
}

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleAdmin = (val: boolean) => {
    setShowAdmin(val);
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u?.email?.toLowerCase() === 'pokai2952@gmail.com') {
        setShowAdmin(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u?.email?.toLowerCase() === 'pokai2952@gmail.com') {
        setShowAdmin(true);
      } else {
        setShowAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (showAdmin) {
    return (
      <ThemeProvider>
        <AdminPortal onBack={() => toggleAdmin(false)} initialUser={user} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen">
          <Navbar
            user={user}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onAdminClick={() => toggleAdmin(true)}
            onLogout={handleLogout}
          />
          <main>
            <Hero />
            <CourseTrust />
            <Features onLoginClick={() => setIsAuthModalOpen(true)} />
            <ProductShowcase />
            <Contact />
          </main>
          <Footer />
        </div>

        <AuthModalWrapper
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />

        <CartConsumer />
      </CartProvider>
    </ThemeProvider>
  );
}

function CartConsumer() {
  const { isCheckoutOpen, setIsCheckoutOpen, discountedPrice } = useCart();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <React.Suspense fallback={null}>
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalPrice={discountedPrice}
        user={user}
      />
    </React.Suspense>
  );
}

export default App;
