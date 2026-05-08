import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, MapPin, Users, 
  ChevronRight, ChevronLeft, CreditCard, 
  CheckCircle2, Camera 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../hooks/CartProvider';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    name: string;
    price: number;
    first_lesson_price?: number;
    additional_lesson_price?: number;
    addPrice?: number;
    mode?: string;
  };
}

const CourseBookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, course }) => {
  const { mode } = useTheme();
  const { addToCart, setIsCheckoutOpen } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [schedules, setSchedules] = useState<any[]>([]);
  const [timeSettings, setTimeSettings] = useState<any>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);

  // Form State
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, Record<string, number>>>({});
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isFirstLesson, setIsFirstLesson] = useState(true);
  const [skillLevel, setSkillLevel] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  // Local state for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Skiing Specific Flow State
  const [skiingSessionIdx, setSkiingSessionIdx] = useState<number | null>(null);
  const [skiingPersonCount, setSkiingPersonCount] = useState(1);
  const [busyCoachIds, setBusyCoachIds] = useState<string[]>([]);

  // Constants
  const JPY_RATE = 4.75; 

  useEffect(() => {
    if (isOpen) {
      fetchBookingData();
      setStep(1);
      setSelectedDates([]);
      setSelectedTimes({});
      setSelectedLocation('');
      setSelectedCoach('');
      setSkiingSessionIdx(null);
      setSkiingPersonCount(1);
      setBusyCoachIds([]);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (selectedDates.length > 0 && Object.keys(selectedTimes).length > 0) {
      checkCoachAvailability();
    }
  }, [selectedDates, selectedTimes]);

  const checkCoachAvailability = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('items')
        .eq('status', 'confirmed');
        
      if (error) throw error;
      
      const busyIds = new Set<string>();
      
      orders?.forEach(order => {
        order.items?.forEach((item: any) => {
          if (item.type === 'course_booking') {
            const details = item.details;
            const orderDates = details.dates || [];
            const orderTimes = details.times || {};
            const coachId = details.coachId;
            
            if (!coachId) return;
            
            // Check overlaps
            selectedDates.forEach(date => {
              if (orderDates.includes(date)) {
                const mySlots = Object.keys(selectedTimes[date] || {});
                const theirSlots = Object.keys(orderTimes[date] || {});
                
                // Helper to expand slot into hours
                const expand = (s: string) => {
                  if (s.includes('-') || s.includes('~')) {
                    const parts = s.split(/[~-]/);
                    const start = parseInt(parts[0]);
                    const end = parseInt(parts[1]);
                    let res = [];
                    for(let i=start; i<end; i++) res.push(i);
                    return res;
                  }
                  return [parseInt(s)];
                };

                const myHours = mySlots.flatMap(expand);
                const theirHours = theirSlots.flatMap(expand);
                
                const hasOverlap = myHours.some(h => theirHours.includes(h));
                if (hasOverlap) {
                  busyIds.add(coachId);
                }
              }
            });
          }
        });
      });
      
      setBusyCoachIds(Array.from(busyIds));
    } catch (err) {
      console.error('Check coach availability failed:', err);
    }
  };

  const fetchBookingData = async () => {
    const targetMode = course.mode || mode;
    try {
      const [sch, tSet, coa, loc, vouc] = await Promise.all([
        supabase.from('course_schedules').select('*').eq('mode', targetMode),
        supabase.from('course_time_settings').select('*').eq('mode', targetMode).maybeSingle(),
        supabase.from('coaches').select('*').eq('mode', targetMode),
        supabase.from('locations').select('*').eq('mode', targetMode),
        supabase.from('vouchers').select('*').eq('is_active', true)
      ]);
      if (sch.data) setSchedules(sch.data);
      if (tSet.data) setTimeSettings(tSet.data);
      if (coa.data) setCoaches(coa.data);
      if (loc.data) setLocations(loc.data);
      if (vouc.data) setVouchers(vouc.data);
    } catch (err) {
      console.error('Fetch data failed:', err);
    }
  };

  const parseSlots = (rawSlots: any) => {
    if (!rawSlots) return [];
    const slotsArr = Array.isArray(rawSlots) ? rawSlots : (typeof rawSlots === 'string' ? rawSlots.split(',').map(s => s.trim()) : []);
    
    let expanded: string[] = [];
    slotsArr.forEach(s => {
      if (typeof s !== 'string') return;
      if (s.includes('~') || s.includes('-')) {
        const parts = s.split(/[~-]/).map(t => t.trim());
        if (parts.length < 2) return;
        const [start, end] = parts;
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        if (isNaN(startHour) || isNaN(endHour)) return;
        for (let h = startHour; h < endHour; h++) {
          expanded.push(`${String(h).padStart(2, '0')}:00`);
        }
      } else {
        expanded.push(s);
      }
    });
    return Array.from(new Set(expanded)).sort();
  };

  const getAvailableTimes = (dateStr: string) => {
    if (!timeSettings) return [];
    const date = new Date(dateStr);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const raw = isWeekend ? timeSettings.weekend_slots : timeSettings.weekday_slots;
    
    // Special handling for Skiing: return raw slots (keeping indices for AM/PM/Full)
    if (mode === 'skiing') {
      return Array.isArray(raw) ? raw : (typeof raw === 'string' ? raw.split(',').map(s => s.trim()) : []);
    }
    
    return parseSlots(raw);
  };

  const calculateTotal = () => {
    // 總人次 = 所有日期中所有時段的人數總和
    const totalPersonSlots = Object.values(selectedTimes).reduce((acc, dateSlots) => {
      return acc + Object.values(dateSlots).reduce((sum, qty) => sum + qty, 0);
    }, 0);
    
    const isSkiingPreview = mode === 'skiing' && skiingSessionIdx !== null;
    if (totalPersonSlots === 0 && !isSkiingPreview) return 0;

    let total = 0;

    if (mode === 'skiing') {
      if (Object.keys(selectedTimes).length === 0 && skiingSessionIdx !== null) {
        // Preview calculation before date/times are synced
        const baseFirst = course.first_lesson_price || course.price || 0;
        const baseAdd = course.additional_lesson_price || (course as any).addPrice || 0;
        
        let unitFirst = 0;
        let unitAdd = 0;
        
        if (skiingSessionIdx === 0) {
          unitFirst = (course as any).half_day_am_first_price ?? baseFirst;
          unitAdd = (course as any).half_day_am_add_price ?? baseAdd;
        } else if (skiingSessionIdx === 1) {
          unitFirst = (course as any).half_day_pm_first_price ?? baseFirst;
          unitAdd = (course as any).half_day_pm_add_price ?? baseAdd;
        } else {
          unitFirst = (course as any).full_day_first_price ?? baseFirst;
          unitAdd = (course as any).full_day_add_price ?? baseAdd;
        }
        
        if (!unitFirst && baseFirst) unitFirst = baseFirst;
        if (!unitAdd && baseAdd) unitAdd = baseAdd;
        
        if (isFirstLesson) {
          total = unitFirst + (skiingPersonCount - 1) * unitAdd;
        } else {
          total = skiingPersonCount * unitAdd;
        }
      } else {
        let isFirstUnitGlobal = true;
        const sortedDates = Object.keys(selectedTimes).sort();
        
        sortedDates.forEach(dateStr => {
          const dateSlots = selectedTimes[dateStr];
          Object.entries(dateSlots).forEach(([slotName, qty]) => {
            if (qty <= 0) return;
            
            const baseFirst = course.first_lesson_price || course.price || 0;
            const baseAdd = course.additional_lesson_price || (course as any).addPrice || 0;

            let unitFirst = 0;
            let unitAdd = 0;

            const available = getAvailableTimes(dateStr);
            const idx = available.indexOf(slotName);

            if (idx === 0) { // Half Day AM
              unitFirst = (course as any).half_day_am_first_price ?? baseFirst;
              unitAdd = (course as any).half_day_am_add_price ?? baseAdd;
            } else if (idx === 1) { // Half Day PM
              unitFirst = (course as any).half_day_pm_first_price ?? baseFirst;
              unitAdd = (course as any).half_day_pm_add_price ?? baseAdd;
            } else { // Full Day or other
              unitFirst = (course as any).full_day_first_price ?? baseFirst;
              unitAdd = (course as any).full_day_add_price ?? baseAdd;
            }

            // If specialized prices are 0 but base prices exist, fallback to base
            if (!unitFirst && baseFirst) unitFirst = baseFirst;
            if (!unitAdd && baseAdd) unitAdd = baseAdd;

            for (let i = 0; i < qty; i++) {
              if (isFirstUnitGlobal && isFirstLesson) {
                total += unitFirst;
                isFirstUnitGlobal = false;
              } else {
                total += unitAdd;
              }
            }
          });
        });
      }
    } else {
      const firstPrice = course.first_lesson_price || course.price || 0;
      const additionalPrice = course.additional_lesson_price || course.addPrice || firstPrice; 

      if (isFirstLesson) {
        total = firstPrice + (totalPersonSlots - 1) * additionalPrice;
      } else {
        total = totalPersonSlots * additionalPrice;
      }
    }

    let subtotal = total;
    if (selectedVoucher) {
      if (selectedVoucher.type === 'percent') {
        subtotal = total * (1 - (selectedVoucher.value || 0) / 100);
      } else {
        subtotal = Math.max(0, total - (selectedVoucher.value || 0));
      }
    }

    return subtotal;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `booking_refs/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setMediaUrl(data.publicUrl);
    } catch (err: any) {
      alert('上傳失敗: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSlotQty = (dateStr: string, t: string, delta: number) => {
    setSelectedTimes(prev => {
      const dateSlots = { ...(prev[dateStr] || {}) };
      const currentQty = dateSlots[t] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        delete dateSlots[t];
      } else {
        dateSlots[t] = newQty;
      }
      
      return { ...prev, [dateStr]: dateSlots };
    });
  };

  const toggleDateSelection = (dateStr: string) => {
    if (schedules.some(s => s.blocked_date === dateStr)) {
       alert('抱歉，該日期是公休日，無法預約。');
       return;
    }

    if (mode === 'skiing') {
      // In skiing mode, only one date can be selected
      setSelectedDates([dateStr]);
      // Sync selectedTimes immediately
      const available = getAvailableTimes(dateStr);
      const slotTime = available[skiingSessionIdx!] || "";
      if (slotTime) {
        setSelectedTimes({ [dateStr]: { [slotTime]: skiingPersonCount } });
      }
    } else {
      setSelectedDates(prev => 
        prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr].sort()
      );
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const totalPersonSlots = Object.values(selectedTimes).reduce((acc, dateSlots) => {
        return acc + Object.values(dateSlots).reduce((sum, qty) => sum + qty, 0);
      }, 0);

      // Prepare booking item for cart
      const bookingItem = {
        id: `booking-${Date.now()}`,
        name: `${course.name} - 課程預約`,
        price: totalTWD,
        type: 'course_booking' as const,
        details: {
          courseId: course.id,
          dates: selectedDates,
          times: selectedTimes,
          locationId: selectedLocation,
          coachId: selectedCoach,
          skillLevel,
          mediaUrl,
          isFirstLesson,
          totalPersonSlots
        }
      };

      addToCart(bookingItem);
      setIsCheckoutOpen(true);
      onClose(); // Close the booking modal
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalTWD = calculateTotal();
  const totalJPY = Math.round(totalTWD * JPY_RATE);
  const activeColor = mode === 'skiing' ? '#3b82f6' : '#ef4444';
  const totalSteps = mode === 'skiing' ? 4 : 4; // Both are 4 steps now, but different logic

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] md:rounded-[48px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="p-6 md:p-10 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${mode === 'skiing' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                STEP {step} / {totalSteps}
              </span>
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-950">
              {course.name} <span className="text-gray-500 not-italic ml-2 font-semibold tracking-normal text-lg">RESERVATION</span>
            </h3>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all text-gray-400 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <AnimatePresence mode="wait">
            {/* SKIING FLOW */}
            {mode === 'skiing' && (
              <>
                {step === 1 && (
                  <motion.div key="ski-s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Clock size={24} /></div>
                      <h4 className="text-xl font-bold text-gray-900">選擇課程類型</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {[0, 1, 2].map(idx => {
                        const available = getAvailableTimes(new Date().toISOString()); // Just to get slots
                        const slotTime = available[idx] || (idx === 0 ? "09:00-12:00" : idx === 1 ? "13:00-16:00" : "09:00-15:00");
                        const label = idx === 0 ? "半天 (上午)" : idx === 1 ? "半天 (下午)" : "全天課程";
                        const isSelected = skiingSessionIdx === idx;
                        
                        const baseFirst = course.first_lesson_price || course.price || 0;
                        const baseAdd = course.additional_lesson_price || (course as any).addPrice || 0;
                        
                        let fPrice = idx === 0 ? (course as any).half_day_am_first_price : idx === 1 ? (course as any).half_day_pm_first_price : (course as any).full_day_first_price;
                        let aPrice = idx === 0 ? (course as any).half_day_am_add_price : idx === 1 ? (course as any).half_day_pm_add_price : (course as any).full_day_add_price;
                        
                        if (!fPrice) fPrice = baseFirst;
                        if (!aPrice) aPrice = baseAdd;

                        return (
                          <button 
                            key={idx}
                            onClick={() => {
                              setSkiingSessionIdx(idx);
                              // Sync to existing logic state
                              const date = selectedDates[0];
                              if (date) {
                                setSelectedTimes({ [date]: { [slotTime]: skiingPersonCount } });
                              }
                            }}
                            className={`p-6 rounded-[32px] border-2 text-left transition-all flex items-center justify-between group ${
                              isSelected ? 'bg-white shadow-xl ring-4 ring-primary/5 border-primary' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
                            }`}
                            style={{ borderColor: isSelected ? activeColor : undefined }}
                          >
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white' : 'bg-white text-gray-500'}`} style={{ backgroundColor: isSelected ? activeColor : undefined }}>
                                {idx === 0 ? "上午" : idx === 1 ? "下午" : "全天"}
                              </div>
                              <div>
                                <div className={`font-black text-lg ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{label}</div>
                                <div className={`text-xs font-bold ${isSelected ? 'text-gray-500' : 'text-gray-500'}`}>{slotTime}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-gray-500' : 'text-gray-600'}`}>Price Start From</div>
                              <div className={`text-xl font-black italic ${isSelected ? 'text-primary' : 'text-gray-700'}`} style={{ color: isSelected ? activeColor : undefined }}>
                                NT${fPrice.toLocaleString()}
                              </div>
                              <div className={`text-[9px] font-bold ${isSelected ? 'text-gray-500' : 'text-gray-600'}`}>續報價 NT${aPrice.toLocaleString()}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="ski-s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-2"><Users size={32} /></div>
                      <h4 className="text-2xl font-black italic uppercase text-gray-900">選擇上課人數</h4>
                    </div>
                    
                    <div className="flex items-center justify-center gap-8 bg-gray-50 p-10 rounded-[48px] border border-gray-100 max-w-sm mx-auto shadow-sm mb-10">
                      <button 
                        onClick={() => {
                          const newVal = Math.max(1, skiingPersonCount - 1);
                          setSkiingPersonCount(newVal);
                          // Sync
                          const date = selectedDates[0];
                          const available = getAvailableTimes(date || new Date().toISOString());
                          const slotTime = available[skiingSessionIdx!] || "";
                          if (date && slotTime) setSelectedTimes({ [date]: { [slotTime]: newVal } });
                        }}
                        className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center font-black text-2xl hover:bg-gray-100 transition-all text-gray-900 border border-gray-100"
                      >-</button>
                      <span className="text-5xl font-black italic text-primary" style={{ color: activeColor }}>{skiingPersonCount}</span>
                      <button 
                        onClick={() => {
                          const newVal = skiingPersonCount + 1;
                          setSkiingPersonCount(newVal);
                          // Sync
                          const date = selectedDates[0];
                          const available = getAvailableTimes(date || new Date().toISOString());
                          const slotTime = available[skiingSessionIdx!] || "";
                          if (date && slotTime) setSelectedTimes({ [date]: { [slotTime]: newVal } });
                        }}
                        className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center font-black text-2xl hover:bg-gray-100 transition-all text-gray-900 border border-gray-100"
                      >+</button>
                    </div>

                    {/* Dynamic Price Summary for Step 2 */}
                    <div className="max-w-md mx-auto">
                      <div className="bg-neutral-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                        <div className="relative">
                          <div className="flex items-center justify-center gap-2 mb-4 cursor-pointer" onClick={() => setIsFirstLesson(!isFirstLesson)}>
                            <div className={`w-10 h-6 rounded-full transition-colors relative ${isFirstLesson ? 'bg-primary' : 'bg-gray-700'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isFirstLesson ? 'left-5' : 'left-1'}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest ml-2">這是我的第一堂課</span>
                          </div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">預估總價 ESTIMATED</div>
                          <div className="text-5xl font-black italic tracking-tighter text-primary" style={{ color: activeColor }}>NT${totalTWD.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500 font-bold mt-3">
                            目前已選擇 {skiingPersonCount} 人同行
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="ski-s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Calendar size={24} /></div>
                      <h4 className="text-xl font-bold text-gray-900">選擇上課日期 <span className="text-gray-400 font-normal text-base">(滑雪課程限選一天)</span></h4>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                      <div className="flex items-center justify-between mb-6 px-2">
                        <h5 className="font-black text-lg italic uppercase tracking-tight text-gray-900">
                          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
                        </h5>
                        <div className="flex gap-2">
                          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"><ChevronLeft size={20} /></button>
                          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"><ChevronRight size={20} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} className="text-[10px] font-black text-gray-400 uppercase py-2">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const days: React.ReactElement[] = [];
                          const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                          const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                          const today = new Date(); today.setHours(0,0,0,0);
                          for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
                          for (let d = 1; d <= daysInMonth; d++) {
                            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                            const isPast = date < today;
                            const isSelected = selectedDates.includes(dateStr);
                            const isBlocked = schedules.some(s => s.blocked_date === dateStr);
                            days.push(
                              <button key={d} disabled={isPast || isBlocked} onClick={() => {
                                toggleDateSelection(dateStr);
                                // Sync times
                                const available = getAvailableTimes(dateStr);
                                const slotTime = available[skiingSessionIdx!] || "";
                                if (slotTime) setSelectedTimes({ [dateStr]: { [slotTime]: skiingPersonCount } });
                              }}
                              className={`aspect-square rounded-xl flex items-center justify-center transition-all ${isSelected ? 'text-white shadow-lg scale-105 z-10' : 'bg-white text-gray-700 shadow-sm'} ${isPast || isBlocked ? 'opacity-20' : ''}`}
                              style={{ backgroundColor: isSelected ? activeColor : undefined }}>
                                <span className="text-sm font-bold">{d}</span>
                              </button>
                            );
                          }
                          return days;
                        })()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="ski-s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    {/* Reuse existing Step 4 content for coach/location */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Users size={24} /></div>
                      <h4 className="text-xl font-bold text-gray-900">教練與地點確認</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-black text-gray-400 tracking-widest mb-3 block uppercase">SELECT LOCATION</label>
                          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900">
                            <option value="">選擇上課地點</option>
                            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-black text-gray-400 tracking-widest mb-3 block uppercase">SELECT COACH</label>
                          <div className="grid grid-cols-2 gap-3">
                            {coaches.map(c => {
                              const isBusy = busyCoachIds.includes(c.id);
                              return (
                                <button 
                                  key={c.id} 
                                  disabled={isBusy}
                                  onClick={() => setSelectedCoach(c.id)} 
                                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all ${
                                    selectedCoach === c.id 
                                      ? 'bg-white shadow-md border-primary' 
                                      : isBusy 
                                        ? 'bg-gray-50 border-gray-100 opacity-80 cursor-not-allowed'
                                        : 'bg-gray-50 border-transparent hover:border-gray-200'
                                  }`} 
                                  style={{ borderColor: selectedCoach === c.id ? activeColor : undefined }}
                                >
                                  <span className={`font-bold text-sm ${isBusy ? 'text-red-500' : 'text-gray-900'}`}>{c.name}</span>
                                  {isBusy && <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">該時段已有課</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-black text-gray-400 tracking-widest mb-3 block uppercase">ADDITIONAL INFO</label>
                          <textarea placeholder="技能程度或特殊備註..." value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl h-24 outline-none font-medium text-gray-900" />
                        </div>
                      </div>
                      
                      <div className="bg-neutral-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Booking Summary</div>
                          <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">時段類型</span>
                              <span className="font-bold">{skiingSessionIdx === 0 ? "半天 (上午)" : skiingSessionIdx === 1 ? "半天 (下午)" : "全天課程"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">日期</span>
                              <span className="font-bold text-primary" style={{ color: activeColor }}>{selectedDates[0]}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">人數</span>
                              <span className="font-bold">{skiingPersonCount} 人</span>
                            </div>
                          </div>
                          <div className="h-[1px] bg-white/10 mb-6" />
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">TOTAL ESTIMATED</div>
                          <div className="text-4xl font-black italic tracking-tighter text-primary" style={{ color: activeColor }}>NT${totalTWD.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* SKATEBOARD FLOW (Original) */}
            {mode === 'skateboard' && (
              <>
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Calendar size={24} /></div>
                      <h4 className="text-xl font-bold text-gray-900">選擇上課日期 <span className="text-gray-400 font-normal text-base">(可複選多個日期)</span></h4>
                    </div>

                    {/* Interactive Calendar */}
                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                      <div className="flex items-center justify-between mb-6 px-2">
                        <h5 className="font-black text-lg italic uppercase tracking-tight text-gray-900">
                          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
                        </h5>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-all text-gray-900"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-all text-gray-900"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                          <div key={d} className="text-[10px] font-black text-gray-400 uppercase tracking-widest py-2">{d}</div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const days: React.ReactElement[] = [];
                          const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                          const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                          const today = new Date();
                          today.setHours(0,0,0,0);

                          // Padding for first week
                          for (let i = 0; i < firstDay; i++) {
                            days.push(<div key={`empty-${i}`} />);
                          }

                          for (let d = 1; d <= daysInMonth; d++) {
                            const year = currentMonth.getFullYear();
                            const month = currentMonth.getMonth() + 1;
                            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const date = new Date(year, currentMonth.getMonth(), d);
                            const isPast = date < today;
                            const isSelected = selectedDates.includes(dateStr);
                            const isBlocked = schedules.some(s => s.blocked_date === dateStr);

                            days.push(
                              <button
                                key={d}
                                disabled={isPast || isBlocked}
                                onClick={() => toggleDateSelection(dateStr)}
                                style={{ 
                                  backgroundColor: isSelected ? activeColor : undefined,
                                }}
                                className={`
                                  aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative
                                  ${isSelected ? 'text-white shadow-lg scale-105 z-10' : 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm'}
                                  ${(isPast || isBlocked) ? 'opacity-20 cursor-not-allowed bg-transparent shadow-none' : ''}
                                `}
                              >
                                <span className="text-sm font-bold">{d}</span>
                                {isBlocked && !isPast && <div className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full" />}
                              </button>
                            );
                          }
                          return days;
                        })()}
                      </div>
                    </div>

                    {/* Selected Summary */}
                    {selectedDates.length > 0 ? (
                      <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                        {selectedDates.map(d => (
                          <div 
                            key={d} 
                            style={{ 
                              backgroundColor: `${activeColor}15`,
                              color: activeColor 
                            }}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2"
                          >
                            {d}
                            <button onClick={() => toggleDateSelection(d)} className="hover:text-red-500"><X size={12}/></button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic text-center py-4">請在日曆上點擊選擇上課日期。</p>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Clock size={24} /></div>
                        <h4 className="text-xl font-bold text-gray-900">選擇上課時段 <span className="text-sm text-gray-400 font-normal">(請分別為每天選擇時段)</span></h4>
                      </div>
                      
                      {/* Real-time Price Summary for Step 2 */}
                      <div className="bg-neutral-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden min-w-[280px]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl opacity-50" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setIsFirstLesson(!isFirstLesson)}>
                            <div className={`w-8 h-4 rounded-full transition-colors relative ${isFirstLesson ? 'bg-primary' : 'bg-gray-700'}`}>
                              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isFirstLesson ? 'left-4.5' : 'left-0.5'}`} />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest ml-1">第一堂課</span>
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">預估總價 ESTIMATED</div>
                          <div className="text-3xl font-black italic tracking-tighter text-primary">NT${totalTWD.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-12">
                      {selectedDates.map(dateStr => {
                        const available = getAvailableTimes(dateStr);
                        const dateSlots = selectedTimes[dateStr] || {};
                        
                        return (
                          <div key={dateStr} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-3">
                              <div className="px-4 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-black italic">
                                {dateStr}
                              </div>
                              <div className="h-[1px] flex-1 bg-gray-100" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {available.map((t: string, idx: number) => {
                                if (!t || t.trim() === '') return null;
                                const qty = dateSlots[t] || 0;
                                const isSelected = qty > 0;
                                
                                return (
                                  <div 
                                    key={t}
                                    className={`p-4 rounded-3xl transition-all border-2 flex items-center justify-between gap-4 ${
                                      isSelected ? 'bg-white shadow-lg ring-4 ring-primary/5' : 'bg-gray-50 border-transparent opacity-60'
                                    }`}
                                    style={{ borderColor: isSelected ? activeColor : 'transparent' }}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div 
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] transition-colors flex-col leading-tight ${
                                          isSelected ? 'bg-primary text-white' : 'bg-white text-gray-400'
                                        }`}
                                        style={{ backgroundColor: isSelected ? activeColor : undefined }}
                                      >
                                        {t.split('-')[0]}
                                        <div className="text-[8px] opacity-60">{t.split('-')[1]}</div>
                                      </div>
                                      <div>
                                        <div className="font-black text-sm text-gray-900">時段報名</div>
                                        <div className="text-[10px] font-bold text-gray-400">{t}</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-100/50 p-1 rounded-2xl">
                                      <button 
                                        onClick={() => updateSlotQty(dateStr, t, -1)}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-lg hover:bg-gray-50 active:scale-90 transition-all text-gray-900"
                                      >-</button>
                                      <span className={`w-8 text-center font-black italic text-xl ${isSelected ? 'text-primary' : 'text-gray-400'}`} style={{ color: isSelected ? activeColor : undefined }}>
                                        {qty}
                                      </span>
                                      <button 
                                        onClick={() => updateSlotQty(dateStr, t, 1)}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-lg hover:bg-gray-50 active:scale-90 transition-all text-gray-900"
                                      >+</button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-2"><MapPin size={32} /></div>
                      <h4 className="text-2xl font-black italic uppercase text-gray-900">確認上課地點</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {locations.length > 0 ? locations.map(l => (
                        <button key={l.id} onClick={() => setSelectedLocation(l.id)}
                          style={{
                            borderColor: selectedLocation === l.id ? activeColor : '#000000',
                            borderStyle: 'solid'
                          }}
                          className={`p-6 rounded-3xl border-2 text-left transition-all ${
                            selectedLocation === l.id 
                              ? 'bg-white shadow-xl ring-4 ring-primary/5 scale-[1.02]' 
                              : 'bg-white hover:border-primary/50'
                          }`}>
                          <div className="font-black text-lg mb-1 text-gray-900">{l.name}</div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{l.address || '地點詳細資訊'}</div>
                        </button>
                      )) : (
                        <div className="col-span-2 py-20 px-8 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                          <div className="text-gray-400 font-bold italic mb-2">目前該模式尚無預設地點</div>
                          <div className="text-[10px] text-gray-400 font-medium italic">您可以直接點擊「下一步」繼續預約</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Users size={24} /></div>
                      <h4 className="text-xl font-bold text-gray-900">參與人員與教練</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-black text-gray-400 tracking-widest mb-3 block uppercase">SELECT COACH</label>
                          <div className="grid grid-cols-2 gap-3">
                            {coaches.map(c => {
                              const isBusy = busyCoachIds.includes(c.id);
                              return (
                                <button 
                                  key={c.id} 
                                  disabled={isBusy}
                                  onClick={() => setSelectedCoach(c.id)} 
                                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all ${
                                    selectedCoach === c.id 
                                      ? 'bg-white shadow-md border-primary' 
                                      : isBusy 
                                        ? 'bg-gray-50 border-gray-100 opacity-80 cursor-not-allowed'
                                        : 'bg-gray-50 border-transparent hover:border-gray-200'
                                  }`} 
                                  style={{ borderColor: selectedCoach === c.id ? activeColor : undefined }}
                                >
                                  <span className={`font-bold text-sm ${isBusy ? 'text-red-500' : 'text-gray-900'}`}>{c.name}</span>
                                  {isBusy && <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">該時段已有課</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-black text-gray-400 tracking-widest mb-3 block uppercase">SKILL LEVEL / NOTES</label>
                          <textarea placeholder="請描述您的運動程度..." value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-gray-200 h-32 outline-none" />
                        </div>
                      </div>
                      <div className="bg-neutral-900 rounded-[32px] p-8 text-white">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ESTIMATED TOTAL</div>
                        <div className="text-4xl font-black italic tracking-tighter text-primary">NT${totalTWD.toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}


          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {step <= totalSteps && step !== 6 && (
          <div className="p-8 md:p-10 border-t border-gray-100 flex justify-between items-center bg-white">
            <button 
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="px-8 py-4 rounded-2xl font-black italic uppercase tracking-tighter text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all flex items-center gap-2"
            >
              <ChevronLeft size={20} /> 上一步
            </button>
            <button 
              onClick={() => {
                if (mode === 'skiing') {
                  if (step === 1 && skiingSessionIdx === null) return;
                  if (step === 2 && skiingPersonCount === 0) return;
                  if (step === 3 && selectedDates.length === 0) return;
                  if (step === 4 && locations.length > 0 && !selectedLocation) return;
                  if (step === 4 && coaches.length > 0 && !selectedCoach) return;
                } else {
                  if (step === 1 && selectedDates.length === 0) return;
                  if (step === 2 && Object.values(selectedTimes).every(slots => Object.keys(slots).length === 0)) return;
                  if (step === 3 && locations.length > 0 && !selectedLocation) return;
                  if (step === 4 && coaches.length > 0 && !selectedCoach) return;
                }

                if (step === totalSteps) handleBooking();
                else setStep(step + 1);
              }}
              disabled={loading}
              className={`flex items-center gap-3 py-4 px-10 rounded-2xl font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all ${
                loading ? 'opacity-50 grayscale' : ''
              }`}
              style={{ background: mode === 'skiing' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'var(--primary-gradient)' }}
            >
              {loading ? '處理中...' : step === totalSteps ? '確認預約' : '下一步'} {step < totalSteps && <ChevronRight size={20} />}
            </button>
          </div>
        )}
      </motion.div>

      {/* Voucher Selection Modal */}
      <AnimatePresence>
        {isVoucherModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h4 className="text-xl font-black italic uppercase tracking-tighter">Available Vouchers</h4>
                <button onClick={() => setIsVoucherModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {vouchers.filter(v => {
                  if (v.target_type === 'global' || v.target_type === 'all_courses') return true;
                  if (v.target_type === 'course' && v.target_id === course.id) return true;
                  if (v.target_type === 'skiing' && mode === 'skiing') return true;
                  if (v.target_type === 'skateboard' && mode === 'skateboard') return true;
                  return false;
                }).length > 0 ? vouchers.filter(v => {
                  if (v.target_type === 'global' || v.target_type === 'all_courses') return true;
                  if (v.target_type === 'course' && v.target_id === course.id) return true;
                  if (v.target_type === 'skiing' && mode === 'skiing') return true;
                  if (v.target_type === 'skateboard' && mode === 'skateboard') return true;
                  return false;
                }).map(v => {
                  const isMinMet = !v.min_amount || totalTWD >= v.min_amount;
                  const isSelected = selectedVoucher?.id === v.id;
                  
                  return (
                    <button 
                      key={v.id}
                      disabled={!isMinMet}
                      onClick={() => {
                        setSelectedVoucher(isSelected ? null : v);
                        setIsVoucherModalOpen(false);
                      }}
                      className={`w-full p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${
                        isSelected ? 'bg-green-50 border-green-500 shadow-lg' : isMinMet ? 'bg-white border-gray-100 hover:border-primary/30' : 'bg-gray-50 border-transparent opacity-40 grayscale'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className={`text-xs font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                            {v.type === 'percent' ? `${v.value}% OFF` : `固定折扣 NT$${v.value}`}
                          </div>
                          <div className="text-xl font-black italic tracking-tight">{v.code}</div>
                        </div>
                        {isSelected && <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={14}/></div>}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{v.description || '套用此優惠券以獲得折扣'}</p>
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-100/50 rounded-full group-hover:scale-150 transition-transform" />
                    </button>
                  );
                }) : (
                  <div className="py-20 text-center text-gray-300 font-bold italic border-2 border-dashed border-gray-100 rounded-[32px]">目前暫無可用優惠券</div>
                )}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button onClick={() => setIsVoucherModalOpen(false)} className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest">Done</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseBookingModal;
