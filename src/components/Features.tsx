import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { Check, Ticket } from 'lucide-react';
import { useCart } from '../hooks/CartProvider';
import type { Voucher } from '../hooks/CartProvider';
import { supabase } from '../lib/supabase';
import CourseBookingModal from './CourseBookingModal';

interface FeaturesProps {
  onLoginClick?: () => void;
}

const Features: React.FC<FeaturesProps> = ({ onLoginClick }) => {
  const { mode, setMode } = useTheme();
  const { claimVoucher, vouchers, addToCart, setIsCheckoutOpen } = useCart();
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);

  const [availableVouchers, setAvailableVouchers] = React.useState<Voucher[]>([]);
  const [dbCourses, setDbCourses] = React.useState<any[]>([]);
  const [coursePackages, setCoursePackages] = React.useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = React.useState(true);

  React.useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const { data, error } = await supabase
          .from('vouchers')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setAvailableVouchers(data || []);
      } catch (err) {
        console.error('Error fetching vouchers:', err);
      }
    };
    fetchVouchers();
  }, []);

  React.useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .eq('mode', mode)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setDbCourses(data || []);

        const { data: pkgData } = await supabase
          .from('products')
          .select('*')
          .eq('dimensions', 'course_package')
          .eq('is_active', true)
          .eq('mode', mode);
        setCoursePackages(pkgData || []);
      } catch (err) {
        console.error('Error fetching courses/packages:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [mode]);

  // Convert DB courses to UI plans
  const plans = dbCourses.map(c => {
    let priceDisplay = `NT$${(c.first_lesson_price || c.price || 0).toLocaleString()}`;
    
    if (c.mode === 'skiing') {
      const prices = [
        c.full_day_first_price,
        c.half_day_am_first_price,
        c.half_day_pm_first_price,
        c.first_lesson_price || c.price
      ].map(p => Number(p)).filter(p => p > 0);
      
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        if (minPrice !== maxPrice) {
          priceDisplay = `NT$${minPrice.toLocaleString()} ~ ${maxPrice.toLocaleString()}`;
        } else {
          priceDisplay = `NT$${minPrice.toLocaleString()}`;
        }
      }
    }

    return {
      ...c,
      id: c.id,
      name: c.name,
      mode: c.mode,
      price: Number(c.first_lesson_price || c.price || 0),
      priceDisplay,
      addPrice: Number(c.additional_lesson_price || 0),
      period: '每堂 120min', 
      description: c.description,
      image_url: c.image_url,
      features: c.description ? c.description.split('\n').filter((s: string) => s.trim()) : ['專業教練指導', '安全防護保證'],
      popular: false 
    };
  });

  const handleClaim = async (v: Voucher) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (onLoginClick) {
          onLoginClick();
        } else {
          alert('請先登入才能領取優惠券！');
        }
        return;
      }

      const grantCount = v.grant_quantity || 1;
      const inserts = Array.from({ length: grantCount }).map(() => ({
        user_id: session.user.id,
        voucher_id: v.id
      }));

      // Try to record the claim in user_vouchers
      const { error } = await supabase
        .from('user_vouchers')
        .insert(inserts);

      if (error) {
        if (error.code === '23505') {
          alert('您已經領取過這張優惠券囉！');
          // Still add to cart local state if they just forgot they had it
          claimVoucher(v, grantCount);
        } else {
          throw error;
        }
      } else {
        alert(`【${v.title}】領取成功，共 ${grantCount} 張！您可以在購物車中直接點選使用。`);
        claimVoucher(v, grantCount);
      }
    } catch (err) {
      console.error('Voucher Claim Failed:', err);
      alert('領取失敗，請稍後再試。');
    }
  };

  const [header, setHeader] = React.useState({
    title: '絕配您的滑行方案',
    desc: '無論您是初出茅廬的新手，還是追求極致的專家，我們都有為您量身打造的課程。'
  });

  React.useEffect(() => {
    const fetchHeader = async () => {
      try {
        const { data, error } = await supabase.from('homepage_settings').select('courses_title, courses_desc').eq('id', mode).single();
        if (error) throw error;
        if (data) {
          setHeader({
            title: data.courses_title || '絕配您的滑行方案',
            desc: data.courses_desc || '無論您是初出茅廬的新手，還是追求極致的專家，我們都有為您量身打造的課程。'
          });
        }
      } catch (err) {
        console.error('Error fetching courses header:', err);
      }
    };
    fetchHeader();
  }, [mode]);

  React.useEffect(() => {
    const handleOpenCourse = async (e: any) => {
      const courseId = e.detail?.courseId;
      if (courseId) {
        let course = dbCourses.find((p: any) => p.id === courseId);
        
        if (!course) {
          const { data } = await supabase.from('courses').select('*').eq('id', courseId).single();
          if (data) course = data;
        }

        if (course) {
          if (course.mode !== mode && setMode) {
             setMode(course.mode as any);
          }

          let priceDisplay = `NT$${(course.first_lesson_price || course.price || 0).toLocaleString()}`;
          if (course.mode === 'skiing') {
            const prices = [
              course.full_day_first_price,
              course.half_day_am_first_price,
              course.half_day_pm_first_price,
              course.first_lesson_price || course.price
            ].map(p => Number(p)).filter(p => p > 0);
            
            if (prices.length > 0) {
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              if (minPrice !== maxPrice) priceDisplay = `NT$${minPrice.toLocaleString()} ~ ${maxPrice.toLocaleString()}`;
              else priceDisplay = `NT$${minPrice.toLocaleString()}`;
            }
          }

          setSelectedCourse({
             ...course,
             priceDisplay,
             addPrice: Number(course.additional_lesson_price || 0),
             features: course.description ? course.description.split('\n').filter((s: string) => s.trim()) : ['專業教練指導', '安全防護保證'],
             isRedeemingPackage: e.detail?.isRedeemingPackage || false,
             redeemVoucherId: e.detail?.voucherId || null
          });

          setIsBookingOpen(true);
          setTimeout(() => {
            const element = document.getElementById('courses');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      }
    };
    window.addEventListener('openCourseModal', handleOpenCourse);
    return () => window.removeEventListener('openCourseModal', handleOpenCourse);
  }, [dbCourses, mode, setMode]);

  return (
    <section id="features-section" className="py-24 bg-secondary transition-colors duration-500 overflow-hidden">
      <div className="container px-4">
        {/* Horizontal Coupon Slider */}
        <div id="vouchers" className="relative mb-20 scroll-mt-24">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 px-4 py-8 -my-8">
            {availableVouchers.map((voucher, idx) => {
              const isClaimed = vouchers.some(v => v.id === voucher.id);
              
              return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`flex-shrink-0 w-[85%] md:w-[600px] snap-center shadow-lg transition-all duration-300 ${isClaimed ? 'grayscale opacity-60' : ''}`}
              >
                <div className={`relative group overflow-hidden rounded-[32px] p-1 ${
                  mode === 'skiing' ? 'bg-blue-500/20' : 'bg-red-500/20'
                }`}>
                  <div className={`absolute inset-0 opacity-20 blur-3xl transition-colors duration-500 ${
                    mode === 'skiing' ? 'bg-blue-400' : 'bg-red-500'
                  }`} />

                  <div className={`relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-[30px] border-2 border-dashed ${
                    mode === 'skiing' 
                    ? 'bg-white border-blue-200 shadow-[0_20px_50px_rgba(59,130,246,0.15)]' 
                    : 'bg-gray-900 border-red-900/50 shadow-[0_20px_50px_rgba(239,68,68,0.15)] text-white'
                  }`}>
                     
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Ticket size={32} className="text-primary animate-pulse" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {voucher.type === 'percent' ? '折扣' : '現金'}
                        </span>
                      </div>
                      <h3 className="text-xl font-black italic tracking-tighter mb-1 leading-tight">
                        {voucher.title}
                      </h3>
                      <p className="text-xs opacity-60 font-medium whitespace-pre-wrap">
                        {voucher.description ? voucher.description : (voucher.min_amount && voucher.min_amount > 0 ? `滿 NT$${voucher.min_amount.toLocaleString()} 可使用` : '無最低消費限制')}
                        {!voucher.description && <br/>}
                        {!voucher.description && (voucher.target_type === 'global' ? '全站通用' : voucher.target_type === 'all_courses' ? '適用於所有課程' : '適用於特定商品或課程')}
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[120px]">
                      <button 
                        onClick={() => !isClaimed && handleClaim(voucher)}
                        disabled={isClaimed}
                        className={`w-full py-3 px-6 rounded-xl font-black text-[10px] tracking-widest uppercase text-white shadow-xl transition-all ${isClaimed ? 'cursor-not-allowed opacity-80' : 'hover:scale-105 active:scale-95'}`}
                        style={isClaimed ? { backgroundColor: '#6b7280', color: '#ffffff' } : { background: 'var(--primary-gradient)' }}
                      >
                        {isClaimed ? '已領取' : '立即領取'}
                      </button>
                    </div>

                    <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-8 h-8 rounded-full ${mode === 'skiing' ? 'bg-secondary' : 'bg-secondary'}`} />
                    <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-8 h-8 rounded-full ${mode === 'skiing' ? 'bg-secondary' : 'bg-secondary'}`} />
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>

        <div id="courses" className="text-center mb-16 px-4 scroll-mt-24">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">熱門選擇</span>
          <h2 className={`text-4xl md:text-5xl font-black mb-6 ${mode === 'skiing' ? 'text-gray-900' : 'text-white'}`}>
            {header.title}
          </h2>
          <p className={`max-w-2xl mx-auto ${mode === 'skiing' ? 'text-gray-500' : 'text-gray-300'}`}>
            {header.desc}
          </p>
        </div>

        {loadingCourses ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold">目前無開放課程</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
            {plans.map((p, i) => (
              <motion.div
                key={p.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col group overflow-hidden transition-all duration-500 h-full bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] hover:-translate-y-1 ${
                  p.popular ? 'md:ring-2 md:ring-primary md:scale-110 z-10' : 'bg-opacity-95'
                }`}
              >
                {/* Course Image Background Shell */}
                <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="relative z-10 mb-8">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">{p.name}</h3>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">{p.priceDisplay}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded ml-1">初次體驗</span>
                    </div>
                    {p.addPrice > 0 && p.addPrice < p.price && (
                      <div className={`p-4 rounded-2xl flex flex-col gap-1 shadow-lg ring-1 ring-white/20 animate-in slide-in-from-left duration-500 ${
                        mode === 'skiing' ? 'bg-[#38bdf8] text-white' : 'bg-[#ef4444] text-white'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black animate-pulse">促銷活動</span>
                          <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">買越多越划算</span>
                        </div>
                        <div className="text-xl font-black italic">加購續報：NT${p.addPrice.toLocaleString()} / 堂</div>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {p.features.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-semibold leading-snug">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary" strokeWidth={3} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4">
                  <button 
                    onClick={() => {
                      setSelectedCourse(p);
                      setIsBookingOpen(true);
                    }}
                    className={`w-full py-5 rounded-2xl font-black italic uppercase tracking-tighter transition-all shadow-xl active:scale-95 text-white ${
                      p.popular 
                      ? 'shadow-primary/30 hover:brightness-110 scale-105 md:scale-100' 
                      : 'shadow-black/5 hover:brightness-110'
                    }`}
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    立即報名
                  </button>
                  {(() => {
                    const pkg = coursePackages.find(pkg => pkg.tag === p.id);
                    if (pkg) {
                      return (
                        <button 
                          onClick={() => {
                            addToCart({
                              id: pkg.id,
                              name: pkg.name,
                              price: pkg.price,
                              type: 'product',
                              image: pkg.image_url,
                              quantity: 1,
                              weight: pkg.weight,
                              dimensions: pkg.dimensions,
                              tag: pkg.tag
                            });
                            setIsCheckoutOpen(true);
                          }}
                          className="w-full mt-3 py-3 rounded-2xl font-black uppercase tracking-tighter transition-all active:scale-95 flex flex-col items-center justify-center leading-tight shadow-lg"
                          style={{ backgroundColor: '#111827', color: '#ffffff', border: '2px solid #111827' }}
                        >
                          <span className="text-sm opacity-90">專屬優惠方案：{pkg.weight} 堂</span>
                          <span className="text-xl mt-1" style={{ color: 'var(--primary-color, #f59e0b)' }}>NT${pkg.price.toLocaleString()}</span>
                        </button>
                      );
                    }
                    return null;
                  })()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <CourseBookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          course={selectedCourse} 
        />
      )}
    </section>
  );
};

export default Features;
