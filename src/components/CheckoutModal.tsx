import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Send, Landmark, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../hooks/CartProvider';
import { useTheme } from '../hooks/useTheme';
import type { User } from '@supabase/supabase-js';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  user: User | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, totalPrice, user }) => {
  const { mode } = useTheme();
  const { cart, clearCart, selectedVoucher } = useCart();

  const [isUploading, setIsUploading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [paymentMethod] = useState<'bank' | 'other'>('bank');
  const [emailJsSettings, setEmailJsSettings] = useState<any>(null);


  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [lastFiveDigits, setLastFiveDigits] = useState('');
  
  const hasPhysicalProducts = cart.some(item => item.type === 'product');
  const [deliveryMethod, setDeliveryMethod] = useState<'convenience_store' | 'pickup_location'>('convenience_store');
  const [convenienceStoreInfo, setConvenienceStoreInfo] = useState('');
  const [pickupLocationId, setPickupLocationId] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase.from('pickup_locations').select('*').eq('mode', mode);
      if (data) setPickupLocations(data);
    };
    const fetchSystemSettings = async () => {
      const { data } = await supabase.from('system_settings').select('*');
      if (data) {
        const settings: any = {};
        data.forEach(item => {
          settings[item.key] = item.value;
        });
        setEmailJsSettings({
          service_id: settings.emailjs_service_id || '',
          template_id: settings.emailjs_template_id || '',
          template_id_course: settings.emailjs_template_id_course || '',
          template_id_product: settings.emailjs_template_id_product || '',
          public_key: settings.emailjs_public_key || '',
          admin_email: settings.admin_email || ''
        });
      }
    };
    if (isOpen) {
      fetchLocations();
      fetchSystemSettings();
    }
  }, [mode, isOpen]);

  const bankInfo = {
    bankName: '國泰世華銀行 (013)',
    branch: '板東分行',
    accountNumber: '205-50-607028-8',
    accountName: '曹博凱',
    type: '活期儲蓄存款'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };



  const handleSubmit = async () => {


    if (paymentMethod === 'bank' && (!lastFiveDigits || lastFiveDigits.length !== 5)) {
      alert('請填寫正確的付款帳號末五碼（共 5 碼數字）以供對帳');
      return;
    }

    if (!customerName || !customerPhone || !customerEmail) {
      alert('請填寫完整的聯絡資訊（姓名、電話、Email）');
      return;
    }
    
    if (hasPhysicalProducts) {
      if (deliveryMethod === 'convenience_store' && !convenienceStoreInfo) {
        alert('請填寫超商門市資訊');
        return;
      }
      if (deliveryMethod === 'pickup_location' && !pickupLocationId) {
        alert('請選擇據點');
        return;
      }
    }

    setIsUploading(true);
    try {
      // Create Order
      const { data: _orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          items: cart,
          total_price: totalPrice,
          bank_info: {
            bankName: bankInfo.bankName,
            accountName: bankInfo.accountName,
            accountNumber: bankInfo.accountNumber,
            lastFiveDigits: lastFiveDigits
          },
          screenshot_data: 'none',
          last_five_digits: lastFiveDigits,
          status: 'pending_verification',
          mode: mode,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          delivery_method: hasPhysicalProducts ? deliveryMethod : null,
          delivery_info: hasPhysicalProducts ? (
            deliveryMethod === 'convenience_store' 
              ? { store: convenienceStoreInfo } 
              : { location_id: pickupLocationId }
          ) : null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 🛒 自動扣除庫存 (Stock Reduction)
      try {
        const productItems = cart.filter(item => item.type === 'product');
        for (const item of productItems) {
          const { data: pData } = await supabase.from('products').select('stock').eq('id', item.id).single();
          if (pData && typeof pData.stock === 'number') {
            const currentStock = pData.stock;
            if (currentStock > 0) {
              const newStock = Math.max(0, currentStock - (item.quantity || 1));
              await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
            }
          }
        }
      } catch (stockErr) {
        console.error('Failed to update stock:', stockErr);
      }

      // 🎟️ 消耗優惠券 (Consume Voucher)
      if (selectedVoucher && user) {
        try {
          // 找到該會員該張優惠券中其中一張「未被使用」的紀錄
          const { data: claims } = await supabase
            .from('user_vouchers')
            .select('id')
            .eq('user_id', user.id)
            .eq('voucher_id', selectedVoucher.id)
            .eq('is_used', false)
            .limit(1);
          
          if (claims && claims.length > 0) {
            await supabase
              .from('user_vouchers')
              .update({ is_used: true, used_at: new Date().toISOString() })
              .eq('id', claims[0].id);
          }
        } catch (voucherErr) {
          console.error('Failed to consume voucher:', voucherErr);
        }
      }

      // 取得 EmailJS 系統設定
      const isEmailConfigured = emailJsSettings?.service_id && emailJsSettings?.public_key && emailJsSettings.service_id !== 'YOUR_SERVICE_ID';
      console.log('Is Email Configured:', isEmailConfigured);

      // 1. 處理 課程預約 通知
      const courseItems = cart.filter(item => item.type === 'course_booking');
      for (const item of courseItems) {
        const coachId = item.details?.coachId || item.details?.coach_id;
        console.log('Processing course item, coachId:', coachId);
        
        if (coachId) {
          const { data: coachData, error: coachError } = await supabase.from('coaches').select('name, email').eq('id', coachId).single();
          console.log('Coach Data result:', { coachData, coachError });
          
          if (coachData && coachData.email) {
            const courseTemplateId = emailJsSettings?.template_id_course || emailJsSettings?.template_id;
            console.log('Using Course Template ID:', courseTemplateId);
            
            // 處理多個日期與時段 (配合 CourseBookingModal 的資料結構)
            const currentTime = new Date().toLocaleString('zh-TW', { hour12: false });

            if (isEmailConfigured && courseTemplateId) {
              console.log('Attempting to send email via EmailJS (Official SDK Mode)...');
              
              // 強力清洗字串
              const hardClean = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '');
              const cleanedUid = hardClean(emailJsSettings!.public_key || '');

              const sendWithSDK = async (params: any) => {
                const cleanedTid = hardClean(params.template_id || '');
                const cleanedSid = hardClean(params.service_id || emailJsSettings!.service_id || 'default_service');

                return new Promise((resolve, reject) => {
                  // 檢查 SDK 是否已載入
                  const invokeSDK = () => {
                    const emailjs = (window as any).emailjs;
                    // 使用最嚴格的調用方式：直接在 send 傳入公鑰
                    emailjs.send(cleanedSid, cleanedTid, params.template_params, cleanedUid)
                      .then((res: any) => {
                        console.log('EmailJS SDK Success:', res.status, res.text);
                        resolve(res);
                      })
                      .catch((err: any) => {
                        console.error('EmailJS SDK Error:', err);
                        reject(err);
                      });
                  };

                  if ((window as any).emailjs) {
                    invokeSDK();
                  } else {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                    script.onload = invokeSDK;
                    script.onerror = reject;
                    document.head.appendChild(script);
                  }
                });
              };

              // 1. 核心修復：精確對接 CourseBookingModal 的資料結構 (details.times)
              let bookingListHtml = '';
              let totalParticipants = 0;
              const details = (item as any).details || {};
              const timesObj = details.times || {}; // 結構為 Record<string, Record<string, number>>
              
              const dateKeys = Object.keys(timesObj).sort();
              
              if (dateKeys.length > 0) {
                dateKeys.forEach((dateStr) => {
                  const slotsForDate = timesObj[dateStr];
                  const timeKeys = Object.keys(slotsForDate).sort();
                  
                  timeKeys.forEach((timeStr) => {
                    const pCount = slotsForDate[timeStr] || 1;
                    totalParticipants += pCount;

                    // 自動計算結束時間 (如果還不是範圍的話)
                    let displayTime = timeStr;
                    if (!timeStr.includes('-') && !timeStr.includes('~')) {
                      try {
                        const [hour, min] = timeStr.split(':').map(Number);
                        const endHour = hour + 1;
                        const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(min || 0).padStart(2, '0')}`;
                        displayTime = `${timeStr}~${endTimeStr}`;
                      } catch (e) {
                        displayTime = timeStr;
                      }
                    }

                    bookingListHtml += `
                      <div style="margin-bottom: 12px; padding: 12px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #eee; font-size: 13px; line-height: 1.5;">
                        <div style="margin-bottom: 4px; white-space: nowrap;"><span style="color: #888; font-weight: bold;">日期：</span> <span style="color: #333; font-weight: 800; white-space: nowrap;">${dateStr}</span></div>
                        <div style="margin-bottom: 4px; white-space: nowrap;"><span style="color: #888; font-weight: bold;">時段：</span> <span style="color: #333; font-weight: 800; white-space: nowrap;">${displayTime}</span></div>
                        <div style="white-space: nowrap;"><span style="color: #888; font-weight: bold;">人數：</span> <span style="color: #333; font-weight: 800; white-space: nowrap;">${pCount} 人</span></div>
                      </div>`;
                  });
                });
              } else {
                // 極端備案
                const fallbackDates = Array.isArray(details.dates) ? details.dates : [];
                const fallbackPCount = details.totalPersonSlots || 1;
                fallbackDates.forEach((d: string) => {
                  bookingListHtml += `
                    <div style="margin-bottom: 12px; padding: 12px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #eee; font-size: 13px; line-height: 1.5;">
                      <div style="margin-bottom: 4px; white-space: nowrap;"><span style="color: #888; font-weight: bold;">日期：</span> <span style="color: #333; font-weight: 800; white-space: nowrap;">${d}</span></div>
                      <div style="margin-bottom: 4px; white-space: nowrap;"><span style="color: #888; font-weight: bold;">時段：</span> <span style="color: #ff0000; font-weight: 800; white-space: nowrap;">資料處理中...</span></div>
                      <div style="white-space: nowrap;"><span style="color: #888; font-weight: bold;">人數：</span> <span style="color: #333; font-weight: 800; white-space: nowrap;">${fallbackPCount} 人</span></div>
                    </div>`;
                });
              }

              const statusRedHtml = '<span style="color: #ff0000; font-weight: bold; font-size: 1.2em;">成功預約</span>';
              const finalPrice = item.price || 0; // 直接使用計算好的總價
              const paymentMethodName = paymentMethod === 'bank' ? '銀行轉帳' : 'LINE Pay';
              const lastFiveHtml = paymentMethod === 'bank' 
                ? `<br/><br/><div style="margin-top: 10px; padding: 12px; background-color: #fff5f5; border-radius: 8px; border: 1px solid #feb2b2; color: #c53030; font-size: 13px; font-weight: bold; line-height: 1.6;">付款方式：銀行轉帳<br/>匯款末五碼對帳：<span style="font-family: monospace; font-size: 15px; font-weight: 900; letter-spacing: 1px; color: #e53e3e;">${lastFiveDigits || '未填寫'}</span></div>`
                : `<br/><br/><div style="margin-top: 10px; padding: 12px; background-color: #f7fafc; border-radius: 8px; border: 1px solid #e2e8f0; color: #4a5568; font-size: 13px; font-weight: bold; line-height: 1.6;">付款方式：LINE Pay (無需填寫末五碼)</div>`;

              // (A) 寄給 教練
              try {
                await sendWithSDK({
                  template_id: courseTemplateId,
                  template_params: {
                    to_email: coachData.email,
                    subject: `【新預約通知】學員：${customerName}`,
                    status_html: statusRedHtml,
                    customer_name: customerName,
                    course_name: item.name,
                    course_table: bookingListHtml,
                    total_amount: `NT$ ${finalPrice.toLocaleString()}`,
                    coach_name: coachData.name,
                    contact_phone: customerPhone,
                    skill_level: (item as any).skillLevel || (item as any).details?.skillLevel || '未填寫',
                    video_link: ((item as any).videoUrl || (item as any).details?.mediaUrl) ? `<a href="${(item as any).videoUrl || (item as any).details?.mediaUrl}">${(item as any).videoUrl || (item as any).details?.mediaUrl}</a>` : '無影片連結',
                    order_time: currentTime,
                    last_five_digits: paymentMethod === 'bank' ? lastFiveDigits : '無(LINE Pay)',
                    payment_method: paymentMethodName,
                    system_footer: `${lastFiveHtml}<br/><br/>--- SK8滑雪&電動滑板nocap ---`
                  }
                });
              } catch (e) {
                console.error('Coach email failed:', e);
              }

              // (B) 寄給 客戶 (確認信)
              try {
                await sendWithSDK({
                  template_id: courseTemplateId,
                  template_params: {
                    to_email: customerEmail,
                    subject: `【預約成功】感謝預約 ${item.name}`,
                    status_html: statusRedHtml,
                    customer_name: customerName,
                    course_name: item.name,
                    course_table: bookingListHtml,
                    total_amount: `NT$ ${finalPrice.toLocaleString()}`,
                    coach_name: coachData.name,
                    contact_phone: customerPhone,
                    skill_level: (item as any).skillLevel || (item as any).details?.skillLevel || '未填寫',
                    video_link: ((item as any).videoUrl || (item as any).details?.mediaUrl) ? `<a href="${(item as any).videoUrl || (item as any).details?.mediaUrl}">${(item as any).videoUrl || (item as any).details?.mediaUrl}</a>` : '無影片連結',
                    order_time: currentTime,
                    last_five_digits: paymentMethod === 'bank' ? lastFiveDigits : '無(LINE Pay)',
                    payment_method: paymentMethodName,
                    system_footer: `${lastFiveHtml}<br/><br/>--- SK8滑雪&電動滑板nocap ---`
                  }
                });
              } catch (e) {
                console.error('Customer email failed:', e);
              }

              // (C) 寄給 老闆 (Admin)
              if (emailJsSettings?.admin_email) {
                try {
                  await sendWithSDK({
                    template_id: courseTemplateId,
                    template_params: {
                      to_email: emailJsSettings?.admin_email,
                      subject: `【後台通知】新預約 - ${customerName}`,
                      status_html: statusRedHtml,
                      customer_name: customerName,
                      course_name: item.name,
                      course_table: bookingListHtml,
                      total_amount: `NT$ ${finalPrice.toLocaleString()}`,
                      coach_name: coachData.name,
                      contact_phone: customerPhone,
                      skill_level: (item as any).skillLevel || (item as any).details?.skillLevel || '未填寫',
                      video_link: ((item as any).videoUrl || (item as any).details?.mediaUrl) ? `<a href="${(item as any).videoUrl || (item as any).details?.mediaUrl}">${(item as any).videoUrl || (item as any).details?.mediaUrl}</a>` : '無影片連結',
                      order_time: currentTime,
                      last_five_digits: paymentMethod === 'bank' ? lastFiveDigits : '無(LINE Pay)',
                      payment_method: paymentMethodName,
                      system_footer: `${lastFiveHtml}<br/><br/>--- SK8滑雪&電動滑板nocap ---`
                    }
                  });
                } catch (e) {
                  console.error('Admin email failed:', e);
                }
              }
            } else {
              console.warn('EmailJS not configured or missing template ID, falling back to mailto');
              const mailtoLink = `mailto:${coachData.email}?subject=${encodeURIComponent(`預約通知`)}&body=${encodeURIComponent(`學員預約了您的課程`)}`;
              setTimeout(() => { window.location.href = mailtoLink; }, 500);
            }
          } else {
            console.warn('Coach data found but email is missing:', coachData);
          }
        }
      }

      // 2. 處理 商品訂單 通知
      const productItems = cart.filter(item => item.type === 'product');
      if (productItems.length > 0) {
        const productTemplateId = emailJsSettings?.template_id_product || emailJsSettings?.template_id;
        const currentTime = new Date().toLocaleString('zh-TW', { hour12: false });
        
        if (isEmailConfigured && productTemplateId) {
          const productList = productItems.map(p => `- ${p.name} (x${p.quantity})`).join('\n');

          const sendWithSDK = async (params: any) => {
            const hardClean = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '');
            const cleanedUid = hardClean(emailJsSettings!.public_key || '');
            const cleanedTid = hardClean(params.template_id || '');
            const cleanedSid = hardClean(emailJsSettings!.service_id || 'default_service');

            return new Promise((resolve, reject) => {
            const invokeSDK = () => {
              const emailjs = (window as any).emailjs;
              emailjs.send(cleanedSid, cleanedTid, params.template_params, cleanedUid)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            };

              if ((window as any).emailjs) {
                invokeSDK();
              } else {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = invokeSDK;
                script.onerror = reject;
                document.head.appendChild(script);
              }
            });
          };

          // 處理取貨資訊
          const deliveryMethodLabel = deliveryMethod === 'convenience_store' ? '超商領取' : '據點領取';
          const deliveryDetailLabel = deliveryMethod === 'convenience_store' ? '門市資訊' : '領取據點';
          let deliveryDetailValue = '';
          if (deliveryMethod === 'convenience_store') {
            deliveryDetailValue = convenienceStoreInfo;
          } else {
            const loc = pickupLocations.find(l => l.id === pickupLocationId);
            deliveryDetailValue = loc ? `${loc.name}${loc.address ? ` (${loc.address})` : ''}` : '未指定據點';
          }

          const paymentMethodName = paymentMethod === 'bank' ? '銀行轉帳' : 'LINE Pay';
          const lastFiveHtml = paymentMethod === 'bank' 
            ? `<br/><br/><div style="margin-top: 10px; padding: 12px; background-color: #fff5f5; border-radius: 8px; border: 1px solid #feb2b2; color: #c53030; font-size: 13px; font-weight: bold; line-height: 1.6;">付款方式：銀行轉帳<br/>匯款末五碼對帳：<span style="font-family: monospace; font-size: 15px; font-weight: 900; letter-spacing: 1px; color: #e53e3e;">${lastFiveDigits || '未填寫'}</span></div>`
            : `<br/><br/><div style="margin-top: 10px; padding: 12px; background-color: #f7fafc; border-radius: 8px; border: 1px solid #e2e8f0; color: #4a5568; font-size: 13px; font-weight: bold; line-height: 1.6;">付款方式：LINE Pay (無需填寫末五碼)</div>`;
          const fullFooter = `${lastFiveHtml}<br/><br/>--- SK8滑雪&電動滑板nocap ---`;

          // 為了防止客戶「商品範本與課程範本共用同一個 EmailJS ID」導致商品信件欄位空白，
          // 我們在此特別做智慧相容：如果該範本有課程標籤，會自動對應填入。
          const compatibilityParams = {
            status_html: '<span style="color: #10b981; font-weight: bold; font-size: 1.2em;">成功購買商品</span>',
            course_name: productItems.map(p => `${p.name} (x${p.quantity})`).join(', '),
            coach_name: `無 (商品出貨：${deliveryMethodLabel})`,
            course_table: `
              <div style="padding: 12px; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0; font-size: 13px; line-height: 1.5; color: #166534; margin-bottom: 12px;">
                <strong style="font-size: 14px;">📦 商品明細：</strong><br/>
                ${productItems.map(p => `• ${p.name} x ${p.quantity} (NT$ ${(p.price * p.quantity).toLocaleString()})`).join('<br/>')}
                <br/><br/>
                <strong style="font-size: 14px;">🚚 配送資訊：</strong><br/>
                • 配送方式：${deliveryMethodLabel}<br/>
                • ${deliveryDetailLabel}：${deliveryDetailValue}
              </div>`,
            total_amount: `NT$ ${totalPrice.toLocaleString()}`,
            skill_level: '商品購買 (免填)',
            video_link: '商品購買 (免填)'
          };

          // (A) 寄給 客戶
          try {
            await sendWithSDK({
              template_id: productTemplateId,
              template_params: {
                to_email: customerEmail,
                subject: `【訂單確認】感謝購買 SK8 商品`,
                customer_name: customerName,
                product_list: productList,
                total_price: totalPrice.toLocaleString(),
                delivery_method: deliveryMethodLabel,
                delivery_info: `${deliveryDetailLabel}：${deliveryDetailValue}`,
                contact_phone: customerPhone,
                order_time: currentTime,
                last_five_digits: paymentMethod === 'bank' ? lastFiveDigits : '無(LINE Pay)',
                payment_method: paymentMethodName,
                system_footer: fullFooter,
                ...compatibilityParams
              }
            });
          } catch (e) {
            console.error('Product customer email failed:', e);
          }

          // (B) 寄給 老闆 (Admin)
          if (emailJsSettings?.admin_email) {
            try {
              await sendWithSDK({
                template_id: productTemplateId,
                template_params: {
                  to_email: emailJsSettings.admin_email,
                  subject: `【後台通知】新商品訂單 - ${customerName}`,
                  customer_name: customerName,
                  product_list: productList,
                  total_price: totalPrice.toLocaleString(),
                  delivery_method: deliveryMethodLabel,
                  delivery_info: `${deliveryDetailLabel}：${deliveryDetailValue}`,
                  contact_phone: customerPhone,
                  order_time: currentTime,
                  last_five_digits: paymentMethod === 'bank' ? lastFiveDigits : '無(LINE Pay)',
                  payment_method: paymentMethodName,
                  system_footer: fullFooter,
                  ...compatibilityParams
                }
              });
            } catch (e) {
              console.error('Product admin email failed:', e);
            }
          }
        }
      }

      alert('訂單已提交！管理員將會盡快核對您的轉帳資訊。');
      clearCart();
      onClose();
    } catch (err) {
      console.error('Submit order failed:', err);
      alert('提交失敗，請稍後再試或聯繫客服。');
    } finally {
      setIsUploading(false);
    }
  };

  const blackMetallic = 'linear-gradient(180deg, #374151 0%, #1f2937 45%, #111827 50%, #000000 100%)';

  const isFormIncomplete = !customerName || !customerPhone || !customerEmail || 
    (paymentMethod === 'bank' && lastFiveDigits.length !== 5) || 
    (hasPhysicalProducts && deliveryMethod === 'convenience_store' && !convenienceStoreInfo) ||
    (hasPhysicalProducts && deliveryMethod === 'pickup_location' && !pickupLocationId);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-xl overflow-hidden rounded-[40px] shadow-2xl flex flex-col ${
            mode === 'skiing' ? 'bg-[#f8fafc] text-gray-900' : 'bg-[#0a0a0a] text-white'
          }`}
        >
          <div className="p-8 pb-4 flex justify-between items-center border-b border-current/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                <Landmark size={24} />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase opacity-80">核對付款資訊</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-current/10 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
              <>
                {/* Bank Info Card - Intense Black Metallic Style */}
                <div 
                  className={`rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-2 transition-all duration-500 relative`}
                  style={{ 
                    background: blackMetallic,
                    borderColor: '#374151'
                  }}
                >
                  <div className="p-8 space-y-6 relative z-10 text-white">
                    {/* Surface Shine Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-5 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] bg-white/5 text-slate-400 shrink-0">
                          <Landmark size={26} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-xl tracking-tighter leading-none mb-1.5 text-white drop-shadow-md whitespace-nowrap">
                            {bankInfo.bankName}
                          </h3>
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 whitespace-nowrap">
                            {bankInfo.branch}
                          </p>
                        </div>
                      </div>
                      <div className="md:text-right shrink-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1 text-white/60 leading-none">總計金額</p>
                        <p className="text-3xl font-black italic tracking-tighter text-white leading-none">NT${totalPrice.toLocaleString()}</p>
                        <p className="text-[11px] font-bold text-white/40 mt-2 md:text-right">要使用優惠券 請至購物車</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      <div className="flex flex-col border-l-2 border-white/30 pl-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-white/60">收款戶名</span>
                        <span className="font-black text-base tracking-tight text-white">{bankInfo.accountName}</span>
                      </div>
                      <div className="flex flex-col border-l-2 border-white/30 pl-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-white/60">帳戶類別</span>
                        <span className="font-black text-base tracking-tight text-white">{bankInfo.type}</span>
                      </div>
                    </div>

                    <div className="relative pt-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-center text-white/60">收款帳號 (點擊複製)</p>
                      <button 
                        onClick={handleCopy}
                        className="w-full group relative flex items-center justify-center gap-4 p-5 md:p-6 rounded-2xl transition-all active:scale-[0.98] border border-white/10 bg-white/5 shadow-2xl"
                      >
                        <span className="text-xl md:text-3xl font-black tracking-[0.05em] font-mono text-white whitespace-nowrap">
                          {bankInfo.accountNumber}
                        </span>
                        <div className={`p-2 md:p-2.5 rounded-xl transition-all shadow-md shrink-0 ${
                          isCopied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:scale-110'
                        }`}>
                          {isCopied ? <Check size={20} /> : <Copy size={20} />}
                        </div>
                      </button>
                      {isCopied && (
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest"
                        >
                          已複製到剪貼簿
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Section Removed */}
                <div className="space-y-4 pt-4">
                  {/* Last Five Digits Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full bg-slate-400" />
                        <h3 className="font-black uppercase tracking-widest text-[11px] opacity-50">Step 2: 輸入付款帳號末五碼</h3>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={5}
                        value={lastFiveDigits}
                        onChange={(e) => setLastFiveDigits(e.target.value.replace(/\D/g, ''))}
                        placeholder="請輸入付款帳號末五碼對帳"
                        className="w-full px-5 py-4 bg-neutral-800 rounded-3xl border-2 border-white/5 outline-none font-bold text-sm text-white placeholder-white/20 focus:border-slate-400 focus:bg-neutral-800/80 transition-all text-center tracking-[0.25em] font-mono"
                      />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 tracking-wider leading-relaxed">
                      ⚠️ 對帳用；若末五碼不匹配或未接收到匯款，視同訂單不成立。
                    </p>
                  </div>
                </div>
              </>

            {/* Customer Info Section */}
            <div className="space-y-3 pt-3 border-t border-current/5 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 rounded-full bg-primary" />
                <h3 className="font-black uppercase tracking-widest text-[11px] opacity-80">聯絡資訊</h3>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="收件人姓名"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="tel"
                  placeholder="聯絡電話"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="email"
                  placeholder="電子信箱"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                />
                <textarea
                  placeholder="備註, 尺寸, 顏色"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Delivery Method Section (Only if has physical products) */}
            {hasPhysicalProducts && (
              <div className="space-y-2 pt-2 border-t border-current/5 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 rounded-full bg-primary" />
                  <h3 className="font-black uppercase tracking-widest text-[10px] opacity-80">取貨方式</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => setDeliveryMethod('convenience_store')}
                    className={`py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition-all ${
                      deliveryMethod === 'convenience_store' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    超商領取
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('pickup_location')}
                    className={`py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition-all ${
                      deliveryMethod === 'pickup_location' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    據點領取
                  </button>
                </div>

                {deliveryMethod === 'convenience_store' ? (
                  <input
                    type="text"
                    placeholder="請輸入超商門市名稱/店號 (例如: 7-11 鑫安門市)"
                    value={convenienceStoreInfo}
                    onChange={e => setConvenienceStoreInfo(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                  />
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="w-full p-3.5 pr-10 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-primary/50 outline-none transition-all text-sm font-medium text-left cursor-pointer"
                    >
                      {pickupLocationId
                        ? (() => {
                            const loc = pickupLocations.find(l => l.id === pickupLocationId);
                            return loc ? `${loc.name}${loc.address ? ` (${loc.address})` : ''}` : '請選擇領取據點';
                          })()
                        : '請選擇領取據點'
                      }
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronRight size={16} className={`transition-transform ${showLocationDropdown ? '-rotate-90' : 'rotate-90'}`} />
                      </div>
                    </button>
                    {showLocationDropdown && (
                      <div className="mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10">
                        {pickupLocations.length > 0 ? pickupLocations.map(loc => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => {
                              setPickupLocationId(loc.id);
                              setShowLocationDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors border-b border-gray-50 last:border-0 ${
                              pickupLocationId === loc.id ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'
                            }`}
                          >
                            {loc.name}{loc.address ? ` (${loc.address})` : ''}
                          </button>
                        )) : (
                          <div className="px-4 py-3 text-sm text-gray-400">此區域目前無可用據點</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8 pt-4 border-t border-current/5">
            <button 
              disabled={isFormIncomplete || isUploading}
              onClick={handleSubmit}
              className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                isFormIncomplete || isUploading ? 'cursor-not-allowed border-2 border-white/10' : 'shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-[1.02]'
              }`}
              style={{ 
                background: isFormIncomplete || isUploading 
                  ? (mode === 'skiing' ? '#f1f5f9' : 'rgba(255,255,255,0.05)') 
                  : '#ef4444',
                color: isFormIncomplete || isUploading 
                  ? (mode === 'skiing' ? '#94a3b8' : 'rgba(255,255,255,0.3)') 
                  : '#ffffff',
                border: isFormIncomplete || isUploading 
                  ? (mode === 'skiing' ? '2px solid #e2e8f0' : '2px solid rgba(255,255,255,0.1)') 
                  : 'none'
              }}
            >
              {/* Button Shine Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-slate-200 border-t-black rounded-full animate-spin" />
              ) : (
                <span className="relative z-10 flex items-center gap-3 font-black">
                  {paymentMethod === 'bank' && lastFiveDigits.length !== 5 
                    ? '請填寫末五碼對帳' 
                    : (!customerName || !customerPhone || !customerEmail)
                    ? '請填寫聯絡資訊'
                    : (hasPhysicalProducts && deliveryMethod === 'convenience_store' && !convenienceStoreInfo)
                    ? '請填寫超商門市資訊'
                    : (hasPhysicalProducts && deliveryMethod === 'pickup_location' && !pickupLocationId)
                    ? '請選擇取貨據點'
                    : '確認送出訂單'}
                  <Send size={20} />
                </span>
              )}
            </button>
            <p className="text-center text-[10px] font-black opacity-30 mt-5 uppercase tracking-[0.25em]">
              提交後管理員將在 24 小時內完成審核
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
