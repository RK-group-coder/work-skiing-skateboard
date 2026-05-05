import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, BookOpen, Tag, LogOut, ChevronLeft, Settings2, Save, Image as ImageIcon, Plus, Pencil, Trash2, X, Users, Search, Landmark, MoreHorizontal, Check, UserPlus, LogIn, Database, Calendar, MapPin, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import DashboardView from './DashboardView';

interface AdminPortalProps { 
  onBack: () => void; 
  initialUser?: User | null;
}

interface HomepageSettings {
  id: string;
  hero_title: string; hero_subtitle: string; hero_bg_image: string; hero_badge: string;
  trust_item_1: string; trust_item_2: string; trust_item_3: string; trust_item_4: string;
  footer_desc: string;
  contact_title: string; contact_desc: string;
  contact_gmail: string; contact_line: string; contact_instagram: string; contact_facebook: string;
  courses_title: string; courses_desc: string;
  shop_title: string; shop_desc: string;
  about_team: string; about_story: string; about_join: string;
  terms_of_service?: string; privacy_policy?: string; refund_policy?: string;
}

interface Product {
  id?: string;
  mode: 'skiing' | 'skateboard';
  name: string;
  price: number;
  special_price?: number;
  stock: number;
  weight: string;
  dimensions: string;
  material: string;
  size_chart_url: string;
  tag: string;
  category_id?: string;
  description: string;
  image_url: string;
  rating: number;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  mode: 'skiing' | 'skateboard';
  created_at?: string;
}

interface Course {
  id?: string;
  mode: 'skiing' | 'skateboard';
  name: string;
  price: number;
  first_lesson_price: number;
  additional_lesson_price: number;
  description: string;
  image_url: string;
  is_active: boolean;
}

interface Coach {
  id?: string;
  name: string;
  email?: string;
  mode: 'skiing' | 'skateboard';
  image_url: string;
  description: string;
}

interface CourseLocation {
  id?: string;
  name: string;
  mode: 'skiing' | 'skateboard';
  address: string;
}

interface CourseSchedule {
  id?: string;
  blocked_date: string;
  time_slots: string[];
  mode: 'skiing' | 'skateboard';
}

interface CourseTimeSettings {
  mode: 'skiing' | 'skateboard';
  weekday_slots: string[];
  weekend_slots: string[];
}

interface Voucher {
  id?: string;
  code: string;
  title: string;
  description?: string;
  type: 'percent' | 'fixed';
  value: number;
  min_amount: number;
  valid_until?: string;
  target_type: 'global' | 'skiing' | 'skateboard' | 'category' | 'product' | 'course' | 'all_courses';
  target_id?: string;
  is_active: boolean;
  is_published: boolean;
}

interface Order {
  id: string;
  created_at: string;
  items: any[];
  total_price: number;
  bank_info: any;
  screenshot_data: string;
  status: 'pending_verification' | 'confirmed' | 'cancelled';
  mode: 'skiing' | 'skateboard';
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_method?: string;
  delivery_info?: any;
}

const EMPTY_PRODUCT: Product = { 
  mode: 'skiing', 
  name: '', 
  price: 0, 
  special_price: 0,
  stock: 0,
  weight: '',
  dimensions: '',
  material: '',
  size_chart_url: '',
  tag: '', 
  description: '', 
  image_url: '', 
  rating: 5.0, 
  is_active: true 
};
const EMPTY_COURSE: Course = { mode: 'skiing', name: '', price: 0, first_lesson_price: 0, additional_lesson_price: 0, description: '', image_url: '', is_active: true };
const EMPTY_COACH: Coach = { name: '', email: '', mode: 'skiing', image_url: '', description: '' };
const EMPTY_LOCATION: CourseLocation = { name: '', mode: 'skiing', address: '' };
const EMPTY_VOUCHER: Voucher = { code: '', title: '', description: '', type: 'percent', value: 10, min_amount: 0, valid_until: '', target_type: 'global', target_id: '', is_active: true, is_published: true };

// ── Shared UI Constants & Helpers ─────────────────────────────────────
const inputCls = "w-full px-4 py-3 bg-neutral-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary outline-none transition-all font-semibold text-sm text-gray-900";
const labelCls = "block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1.5";

const handleFileUpload = async (file: File, bucket: string = 'media') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
  } catch (err: any) {
    alert('圖片上傳失敗: ' + err.message);
    return null;
  }
};

const ImageUploadField = ({ label, value, onChange, bucket }: { label: string; value: string; onChange: (url: string) => void; bucket?: string }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const url = await handleFileUpload(e.target.files[0], bucket);
    if (url) onChange(url);
    setUploading(false);
  };
  return (
    <div className="space-y-2">
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-4">
        <div onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden">
          {value ? <img src={value} alt="Preview" className="w-full h-full object-cover" /> : (
            <>
              <ImageIcon size={20} className="text-gray-400 group-hover:text-primary" />
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary mt-1">{uploading ? '上傳中...' : '選取圖片'}</span>
            </>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
          <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="或輸入圖片網址..." className={inputCls} />
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({ form, setForm, onSave, onCancel, categories, loading }: { form: Product; setForm: (v: Product) => void; onSave: () => void; onCancel: () => void; categories: Category[]; loading: boolean }) => (
  <div className="bg-white border border-gray-100 rounded-[28px] p-6 space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>分類 Mode</label>
        <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value as any })} className={inputCls}>
          <option value="skiing">滑雪 Skiing</option>
          <option value="skateboard">滑板 Skateboard</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>產品分類 Category</label>
        <select value={form.category_id || ''} onChange={e => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
          <option value="">選擇分類...</option>
          {categories.filter(c => c.mode === form.mode).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>商品名稱 Name</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="商品名稱" />
      </div>
      <div>
        <label className={labelCls}>標籤 Tag (e.g. HOT, NEW)</label>
        <input type="text" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className={inputCls} placeholder="標籤" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className={labelCls}>原價 Price (NT$)</label>
        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>特價 Special Price (NT$)</label>
        <input type="number" value={form.special_price} onChange={e => setForm({ ...form, special_price: Number(e.target.value) })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>庫存數量 Stock</label>
        <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className={inputCls} />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className={labelCls}>重量 Weight</label>
        <input type="text" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className={inputCls} placeholder="e.g. 1.5kg" />
      </div>
      <div>
        <label className={labelCls}>體積/尺寸 Dimensions</label>
        <input type="text" value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} className={inputCls} placeholder="e.g. 150x20x5cm" />
      </div>
      <div>
        <label className={labelCls}>材質 Material</label>
        <input type="text" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className={inputCls} placeholder="e.g. 碳纖維" />
      </div>
    </div>
    <div>
      <label className={labelCls}>描述 Description</label>
      <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="詳細商品描述" />
    </div>
    <div className="space-y-6">
      <ImageUploadField label="商品主圖 Main Image" value={form.image_url} onChange={url => setForm({ ...form, image_url: url })} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic Sub-images Implementation */}
        {(() => {
          const subImages = (form.size_chart_url || "").split(',').filter(Boolean);
          // Show all current sub-images + one empty slot
          const displaySlots = [...subImages, ""];
          
          return displaySlots.map((url, index) => {
            // Only show this slot if it's the first one OR the previous one was filled
            if (index > 0 && !displaySlots[index - 1]) return null;
            
            return (
              <ImageUploadField 
                key={index}
                label={`商品附圖 ${index + 1}`}
                value={url}
                onChange={(newUrl) => {
                  const newSubImages = [...subImages];
                  if (index < subImages.length) {
                    if (newUrl) newSubImages[index] = newUrl;
                    else newSubImages.splice(index, 1); // Delete if cleared
                  } else if (newUrl) {
                    newSubImages.push(newUrl);
                  }
                  setForm({ ...form, size_chart_url: newSubImages.join(',') });
                }}
              />
            );
          });
        })()}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })} className={`flex items-center gap-2 text-sm font-bold transition-colors ${form.is_active ? 'text-green-600' : 'text-gray-400'}`}>
        {form.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />} {form.is_active ? '上架中' : '已下架'}
      </button>
    </div>
    <div className="flex gap-3 pt-2">
      <button onClick={onSave} disabled={loading} style={{ backgroundColor: '#6b7280', color: '#ffffff' }} className="flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md">
        <Save size={16} /> 儲存商品
      </button>
      <button onClick={onCancel} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-colors">取消</button>
    </div>
  </div>
);

const CourseForm = ({ form, setForm, onSave, onCancel, loading }: { form: Course; setForm: (v: Course) => void; onSave: () => void; onCancel: () => void; loading: boolean }) => (
  <div className="bg-white border border-gray-100 rounded-[28px] p-6 space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className={labelCls}>課程類別 Mode</label>
        <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value as any })} className={inputCls}>
          <option value="skiing">滑雪 Skiing</option>
          <option value="skateboard">滑板 Skateboard</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>課程名稱 Course Name</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="請輸入課程標題" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className={labelCls}>第一堂課價格 First Lesson (NT$)</label>
        <input type="number" value={form.first_lesson_price} onChange={e => setForm({ ...form, first_lesson_price: Number(e.target.value) })} className={inputCls} placeholder="初次體驗/單堂價格" />
      </div>
      <div>
        <label className={labelCls}>續購價格 (第二堂起) Add-on Price (NT$)</label>
        <input type="number" value={form.additional_lesson_price} onChange={e => setForm({ ...form, additional_lesson_price: Number(e.target.value) })} className={inputCls} placeholder="續購優惠價格" />
      </div>
    </div>

    <div>
      <label className={labelCls}>課程描述 Description</label>
      <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="請簡短描述課程內容與特色" />
    </div>


    <div className="flex items-center gap-3 pt-2">
      <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })} className={`flex items-center gap-2 text-sm font-bold transition-colors ${form.is_active ? 'text-green-600' : 'text-gray-400'}`}>
        {form.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />} {form.is_active ? '開放報名中' : '暫停報名'}
      </button>
    </div>

    <div className="flex gap-4 pt-4">
      <button onClick={onSave} disabled={loading} style={{ backgroundColor: '#6b7280', color: '#ffffff' }} className="flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50">
        <Save size={18} /> 儲存課程設定
      </button>
      <button onClick={onCancel} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-colors">取消</button>
    </div>
  </div>
);

const VoucherForm = ({ form, setForm, onSave, onCancel, categories, products, courses, loading }: { form: Voucher; setForm: (v: Voucher) => void; onSave: () => void; onCancel: () => void; categories: Category[]; products: Product[]; courses: Course[]; loading: boolean }) => (
  <div className="bg-white border border-gray-100 rounded-[28px] p-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>優惠名稱 Title</label>
        <input type="text" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="e.g. 首次課程 9 折優惠" />
      </div>
      <div>
        <label className={labelCls}>優惠碼 CODE</label>
        <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputCls} placeholder="e.g. SAVE20" />
      </div>
    </div>
    <div>
      <label className={labelCls}>自訂內文 Description (選填)</label>
      <textarea rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="e.g. 適用於特定商品或課程&#10;安全第一優先" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>適用對象 Target Type</label>
        <select value={form.target_type} onChange={e => setForm({ ...form, target_type: e.target.value as any, target_id: '' })} className={inputCls}>
          <option value="global">🌐 全站通用 Global</option>
          <option value="skiing">⛷ 僅限滑雪商品 Skiing Products</option>
          <option value="skateboard">🛹 僅限滑板商品 Skateboard Products</option>
          <option value="all_courses">🎓 僅限所有課程 All Courses</option>
          <option value="category">📁 特定商品分類 Category</option>
          <option value="product">🛍 特定單一商品 Product</option>
          <option value="course">🏫 特定單一課程 Course</option>
        </select>
      </div>
    </div>
    {['category', 'product', 'course'].includes(form.target_type) && (
      <div className="animate-in slide-in-from-top-2 duration-300">
        <label className={labelCls}>{form.target_type === 'category' ? '選擇分類 Select Category' : form.target_type === 'product' ? '選擇商品 Select Product' : '選擇課程 Select Course'}</label>
        <select value={form.target_id} onChange={e => setForm({ ...form, target_id: e.target.value })} className={inputCls}>
          <option value="">請選擇...</option>
          {form.target_type === 'category' && categories.map(c => <option key={c.id} value={c.id}>[{c.mode === 'skiing' ? '滑雪' : '滑板'}] {c.name}</option>)}
          {form.target_type === 'product' && products.map(p => <option key={p.id} value={p.id}>[{p.mode === 'skiing' ? '滑雪' : '滑板'}] {p.name}</option>)}
          {form.target_type === 'course' && courses.map(course => <option key={course.id} value={course.id}>[{course.mode === 'skiing' ? '滑雪' : '滑板'}] {course.name}</option>)}
        </select>
      </div>
    )}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>折扣類型 Type</label>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className={inputCls}>
          <option value="percent">百分比 (% Off)</option>
          <option value="fixed">固定金額 (Cash Off)</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>折扣值 Value ({form.type === 'percent' ? '%' : 'NT$'})</label>
        <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className={inputCls} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>最低消費 Min (NT$)</label>
        <input type="number" value={form.min_amount} onChange={e => setForm({ ...form, min_amount: Number(e.target.value) })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>有效期限 Valid Until (選填)</label>
        <input type="date" value={form.valid_until || ''} onChange={e => setForm({ ...form, valid_until: e.target.value })} className={inputCls} />
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-6">
      <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })} className={`flex items-center gap-2 text-sm font-bold transition-colors ${form.is_active ? 'text-green-600' : 'text-gray-400'}`}>
        {form.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />} {form.is_active ? '啟用中 (可使用)' : '已停用'}
      </button>
      <button type="button" onClick={() => setForm({ ...form, is_published: !form.is_published })} className={`flex items-center gap-2 text-sm font-bold transition-colors ${form.is_published ? 'text-blue-600' : 'text-gray-400'}`}>
        {form.is_published ? <Check size={20} className="bg-blue-100 rounded-full p-0.5" /> : <X size={20} className="bg-gray-100 rounded-full p-0.5" />} {form.is_published ? '發布於網站' : '不發布 (隱藏碼)'}
      </button>
    </div>
    <div className="flex gap-3 pt-2">
      <button onClick={onSave} disabled={loading} style={{ backgroundColor: '#6b7280', color: '#ffffff' }} className="flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md">
        <Save size={16} /> 儲存優惠券
      </button>
      <button onClick={onCancel} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-colors">取消</button>
    </div>
  </div>
);

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack, initialUser }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(initialUser?.email?.toLowerCase() === 'pokai2952@gmail.com');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'courses' | 'vouchers' | 'homepage' | 'orders' | 'users'>('dashboard');
  const [orderType, setOrderType] = useState<'product' | 'course'>('product');
  const [orderFilter, setOrderFilter] = useState<'all' | 'skiing' | 'skateboard'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForm, setCategoryForm] = useState<{ name: string; mode: 'skiing' | 'skateboard' }>({ name: '', mode: 'skiing' });

  // System settings (EmailJS)
  const [emailJsSettings, setEmailJsSettings] = useState({ 
    service_id: '', 
    template_id: '', 
    template_id_course: '', 
    template_id_product: '', 
    public_key: '',
    admin_email: ''
  });
  const [isSavingSystemSettings, setIsSavingSystemSettings] = useState(false);

  // Homepage settings
  const [homepageSettings, setHomepageSettings] = useState<Record<string, HomepageSettings>>({
    skiing: {
      id: 'skiing', hero_title: '征服雪山，突破極限', hero_subtitle: '專業滑雪課程，從初學到進階，帶你探索雪地的無限可能',
      hero_bg_image: '', hero_badge: "Let's Go Skiing",
      trust_item_1: '教練十年資歷', trust_item_2: '國際專業證照', trust_item_3: '專屬小班教學', trust_item_4: '保險全程承保',
      footer_desc: '我們致力於提供最頂尖的戶外極限運動體驗。', contact_title: 'CONNECT WITH SK8',
      contact_desc: '有任何課程疑問或商業合作建議？歡迎透過以下管道與我們保持聯繫。',
      contact_gmail: 'mailto:official@sk8.com', contact_line: 'https://line.me/ti/p/@sk8_official',
      contact_instagram: 'https://www.instagram.com/sk8_extreme', contact_facebook: 'https://www.facebook.com/SK8ExtremeCenter',
      courses_title: '絕配您的滑行方案', courses_desc: '為您量身打造的課程。',
      shop_title: '滑雪裝備商店', shop_desc: '頂級滑雪裝備，讓你征服每一座雪山的極致首選。',
      about_team: '我們的滑雪教練團隊均擁有國際證照，具備十年以上的教學經驗。',
      about_story: '從第一座雪山的挑戰開始，我們致力於推廣高品質的滑雪文化。',
      about_join: '我們正在尋找對於滑雪充滿熱忱的夥伴！',
      terms_of_service: '1. 訂單成立條件：當您在網站完成預約或下單，且收到系統初步確認信後，訂單即進入保留狀態。\n2. 契約生效：訂單於管理員確認收到款項並更新狀態為「已確認」時正式生效。\n3. 免責聲明：極限運動具有一定風險，參加課程前請務必衡量自身身體狀況。',
      privacy_policy: '1. 收集資訊：我們收集您的姓名、聯絡電話、電子郵件及銀行轉帳截圖（後五碼）。\n2. 使用用途：僅用於訂單核對、聯絡課程事宜及寄送訂單通知。\n3. 個資保護：除非法律要求，否則我們不會將您的個資提供給第三方。\n4. 權利：您可以隨時聯繫官方客服要求查詢、更正或刪除您的個人資料。',
      refund_policy: '1. 商品類：符合《消保法》七天鑑賞期（由收受商品後隔日起算），請保持商品完整包裝。\n2. 課程類：\n   - 開課 7 天前取消：全額退費（扣除轉帳手續費）。\n   - 開課 3-6 天前取消：退還 50%。\n   - 開課 3 天內取消：恕不退費，但可轉讓名額（請事先告知）。'
    },
    skateboard: {
      id: 'skateboard', hero_title: '極速前行，電動新世代', hero_subtitle: '專業電動滑板課程與裝備，體驗最先進的電動滑行技術',
      hero_bg_image: '', hero_badge: 'Ride the Urban Wave',
      trust_item_1: '專業教練帶領', trust_item_2: '安全防護保證', trust_item_3: '高效電池技術', trust_item_4: '售後維修服務',
      footer_desc: '我們致力於提供最先進的電動滑行體驗。', contact_title: 'GET IN TOUCH',
      contact_desc: '對電動滑板有興趣或有任何維修需求？我們的團隊隨時為您提供支援。',
      contact_gmail: 'mailto:skateboard@sk8.com', contact_line: 'https://line.me/ti/p/@sk8_skate',
      contact_instagram: 'https://www.instagram.com/sk8_skateboard', contact_facebook: 'https://www.facebook.com/SK8Skateboard',
      courses_title: '打造您的電動旅程', courses_desc: '從基礎操作到專家級調校，我們的課程為各種程度的玩家提供指導。',
      shop_title: '電動滑板商店', shop_desc: '頂級電動滑板裝備，體驗極速快感。',
      about_team: '我們的滑板團隊由電子工程師與極限運動員組成。',
      about_story: 'SK8 誕生於城市街道，我們希望透過科技重新定義現代人的通勤與冒險方式。',
      about_join: '喜歡追求速度嗎？加入我們的技術開發或推廣團隊！',
      terms_of_service: '1. 訂單成立條件：當您在網站完成預約或下單，且收到系統初步確認信後，訂單即進入保留狀態。\n2. 契約生效：訂單於管理員確認收到款項並更新狀態為「已確認」時正式生效。\n3. 免責聲明：極限運動具有一定風險，參加課程前請務必衡量自身身體狀況。',
      privacy_policy: '1. 收集資訊：我們收集您的姓名、聯絡電話、電子郵件及銀行轉帳截圖（後五碼）。\n2. 使用用途：僅用於訂單核對、聯絡課程事宜及寄送訂單通知。\n3. 個資保護：除非法律要求，否則我們不會將您的個資提供給第三方。\n4. 權利：您可以隨時聯繫官方客服要求查詢、更正或刪除您的個人資料。',
      refund_policy: '1. 商品類：符合《消保法》七天鑑賞期（由收受商品後隔日起算），請保持商品完整包裝。\n2. 課程類：\n   - 開課 7 天前取消：全額退費（扣除轉帳手續費）。\n   - 開課 3-6 天前取消：退還 50%。\n   - 開課 3 天內取消：恕不退費，但可轉讓名額（請事先告知）。'
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Product>(EMPTY_PRODUCT);
  const [productFilter, setProductFilter] = useState<'all' | 'skiing' | 'skateboard'>('all');

  // Courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState<Course>(EMPTY_COURSE);
  const [courseFilter, setCourseFilter] = useState<'all' | 'skiing' | 'skateboard'>('all');

  // Vouchers
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isAddingVoucher, setIsAddingVoucher] = useState(false);
  const [voucherForm, setVoucherForm] = useState<Voucher>(EMPTY_VOUCHER);
  
  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderImage, setSelectedOrderImage] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [pickupLocationName, setPickupLocationName] = useState('');
  const [pickupLocationAddress, setPickupLocationAddress] = useState('');
  const [pickupLocationMode, setPickupLocationMode] = useState<'skiing' | 'skateboard'>('skiing');
  const [isSavingPickupLocation, setIsSavingPickupLocation] = useState(false);

  // Course Data Hub (Coaches, Locations, Schedules)
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [locations, setLocations] = useState<CourseLocation[]>([]);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [timeSettings, setTimeSettings] = useState<Record<string, CourseTimeSettings>>({
    skiing: { mode: 'skiing', weekday_slots: [], weekend_slots: [] },
    skateboard: { mode: 'skateboard', weekday_slots: [], weekend_slots: [] }
  });
  const [scheduleMode, setScheduleMode] = useState<'skiing' | 'skateboard'>('skiing');
  const [isAddingCoach, setIsAddingCoach] = useState(false);
  const [coachForm, setCoachForm] = useState<Coach>(EMPTY_COACH);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState<CourseLocation>(EMPTY_LOCATION);
  const [courseHubTab, setCourseHubTab] = useState<'coaches' | 'locations' | 'schedule'>('schedule');

  useEffect(() => {
    if (isLoggedIn) {
      scrollContainerRef.current?.scrollTo(0, 0);
      fetchHomepageSettings();
      fetchProducts();
      fetchCategories();
      fetchCourses();
      fetchVouchers();
      fetchCourseData();
      fetchOrders();
      fetchPickupLocations();
      fetchSystemSettings();
      fetchUsers();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from profiles table...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching users:', error);
        throw error;
      }
      
      console.log('Users fetched successfully:', data);
      setUsersList(data || []);
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      // Fallback empty if fetch fails
      setUsersList([]);
    }
  };

  // ── Fetch functions ──────────────────────────────────────────────
  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase.from('system_settings').select('value').eq('key', 'emailjs').single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
      if (data) setEmailJsSettings(data.value);
    } catch (err) {
      console.error('Error fetching system settings:', err);
    }
  };

  const handleSaveSystemSettings = async () => {
    setIsSavingSystemSettings(true);
    try {
      const { error } = await supabase.from('system_settings').upsert({
        key: 'emailjs',
        value: emailJsSettings
      }, { onConflict: 'key' });
      if (error) throw error;
      alert('系統設定已儲存！');
    } catch (err: any) {
      alert('儲存設定失敗: ' + err.message);
    } finally {
      setIsSavingSystemSettings(false);
    }
  };

  const fetchHomepageSettings = async () => {
    try {
      const { data, error } = await supabase.from('homepage_settings').select('*');
      if (error) throw error;
      if (data?.length) {
        const map: Record<string, HomepageSettings> = { ...homepageSettings };
        data.forEach((item: HomepageSettings) => { map[item.id] = { ...map[item.id], ...item }; });
        setHomepageSettings(map);
      }
    } catch (err) { console.error('Error fetching homepage settings:', err); }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) { console.error('Error fetching products:', err); }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setCategories(data);
    } catch (err) { console.error('Error fetching categories:', err); }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setCourses(data);
    } catch (err) { console.error('Error fetching courses:', err); }
  };

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setVouchers(data);
    } catch (err) { console.error('Error fetching vouchers:', err); }
  };

  const fetchOrders = async () => {
    setOrdersError(null);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setOrders(data);
    } catch (err: any) { 
      console.error('Error fetching orders:', err);
      setOrdersError(err.message);
    }
  };

  const fetchPickupLocations = async () => {
    try {
      const { data, error } = await supabase.from('pickup_locations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setPickupLocations(data);
    } catch (err) {
      console.error('Error fetching pickup locations', err);
    }
  };

  const fetchCourseData = async () => {
    try {
      const [coachRes, locRes, schRes, timeRes] = await Promise.all([
        supabase.from('coaches').select('*').order('name'),
        supabase.from('locations').select('*').order('name'),
        supabase.from('course_schedules').select('*').order('blocked_date'),
        supabase.from('course_time_settings').select('*')
      ]);
      if (coachRes.data) setCoaches(coachRes.data);
      if (locRes.data) setLocations(locRes.data);
      if (schRes.data) setSchedules(schRes.data);
      if (timeRes.data) {
        const map: any = {};
        timeRes.data.forEach((s: any) => { map[s.mode] = s; });
        setTimeSettings(prev => ({ ...prev, ...map }));
      }
    } catch (err) { console.error('Error fetching course data:', err); }
  };

  // ── Save / Delete functions ──────────────────────────────────────
  const handleSaveHomepage = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('homepage_settings').upsert(homepageSettings[id]);
      if (error) throw error;
      alert('儲存成功！');
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      if (productForm.id) {
        const { error } = await supabase.from('products').update(productForm).eq('id', productForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert({ ...productForm });
        if (error) throw error;
      }
      await fetchProducts();
      setEditingProduct(null); setIsAddingProduct(false); setProductForm(EMPTY_PRODUCT);
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('確定要刪除這個商品嗎？')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await fetchProducts();
    } catch (err: any) { alert('刪除失敗: ' + err.message); }
  };

  const handleSaveCategory = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('categories').insert(categoryForm);
      if (error) throw error;
      await fetchCategories();
      setCategoryForm({ name: '', mode: 'skiing' });
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('確定要刪除這個分類嗎？')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      await fetchCategories();
    } catch (err: any) { alert('刪除失敗: ' + err.message); }
  };

  // ── Course Data Hub Handlers ─────────────────────────────────────
  const handleSaveCoach = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('coaches').upsert(coachForm);
      if (error) throw error;
      await fetchCourseData();
      setIsAddingCoach(false); setCoachForm(EMPTY_COACH);
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteCoach = async (id: string) => {
    if (!confirm('確定要刪除這位教練嗎？')) return;
    try {
      await supabase.from('coaches').delete().eq('id', id);
      fetchCourseData();
    } catch (err: any) { alert('刪除失敗: ' + err.message); }
  };

  const handleSaveLocation = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('locations').upsert(locationForm);
      if (error) throw error;
      await fetchCourseData();
      setIsAddingLocation(false); setLocationForm(EMPTY_LOCATION);
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('確定要刪除這個地點嗎？')) return;
    try {
      await supabase.from('locations').delete().eq('id', id);
      fetchCourseData();
    } catch (err: any) { alert('刪除失敗: ' + err.message); }
  };

  const toggleBlockedDate = async (date: string) => {
    const existing = schedules.find(s => s.blocked_date === date && s.mode === scheduleMode);
    try {
      if (existing) {
        await supabase.from('course_schedules').delete().eq('id', existing.id);
      } else {
        await supabase.from('course_schedules').insert({ blocked_date: date, mode: scheduleMode, time_slots: [] });
      }
      fetchCourseData();
    } catch (err: any) { console.error('Toggle date failed:', err); }
  };

  const handleSaveTimeSlots = async (mode: 'skiing' | 'skateboard') => {
    setLoading(true);
    try {
      const { error } = await supabase.from('course_time_settings').upsert(timeSettings[mode]);
      if (error) throw error;
      alert('時段設定已更新！');
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleSaveCourse = async () => {
    setLoading(true);
    try {
      if (courseForm.id) {
        const { error } = await supabase.from('courses').update(courseForm).eq('id', courseForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('courses').insert({ ...courseForm });
        if (error) throw error;
      }
      await fetchCourses();
      setEditingCourse(null); setIsAddingCourse(false); setCourseForm(EMPTY_COURSE);
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('確定要刪除這個課程嗎？')) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      await fetchCourses();
    } catch (err: any) { alert('刪除失敗: ' + err.message); }
  };

  const handleSaveVoucher = async () => {
    setLoading(true);
    try {
      if (voucherForm.id) {
        const { error } = await supabase.from('vouchers').update(voucherForm).eq('id', voucherForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('vouchers').insert({ ...voucherForm });
        if (error) throw error;
      }
      await fetchVouchers();
      setEditingVoucher(null); setIsAddingVoucher(false); setVoucherForm(EMPTY_VOUCHER);
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('確定要刪除這個優惠券嗎？')) return;
    try {
      const { error } = await supabase.from('vouchers').delete().eq('id', id);
      if (error) throw error;
      await fetchVouchers();
    } catch (err: any) { alert('儲存失敗: ' + err.message); }
  };

  const handleSavePickupLocation = async () => {
    if (!pickupLocationName.trim() || !pickupLocationAddress.trim()) {
      alert('請填寫完整資訊');
      return;
    }
    setIsSavingPickupLocation(true);
    try {
      const { error } = await supabase.from('pickup_locations').insert([{
        name: pickupLocationName.trim(),
        address: pickupLocationAddress.trim(),
        mode: pickupLocationMode
      }]);
      if (error) throw error;
      setPickupLocationName('');
      setPickupLocationAddress('');
      fetchPickupLocations();
    } catch (err: any) {
      alert('儲存失敗: ' + err.message);
    } finally {
      setIsSavingPickupLocation(false);
    }
  };

  const handleDeletePickupLocation = async (id: string) => {
    if (!confirm('確定要刪除此據點嗎？')) return;
    try {
      const { error } = await supabase.from('pickup_locations').delete().eq('id', id);
      if (error) throw error;
      fetchPickupLocations();
    } catch (err: any) {
      alert('刪除失敗: ' + err.message);
    }
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ 
          email: trimmedEmail, 
          password,
          options: { data: { full_name: trimmedFullName } }
        });
        if (error) throw error;
        alert('註冊成功！請查看您的信箱驗證帳號。'); setIsRegister(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: trimmedEmail, 
          password 
        });
        if (error) throw error;
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) setError('帳號或密碼錯誤，請重新確認。');
      else if (msg.includes('Email not confirmed')) setError('帳號尚未驗證，請查看信箱。');
      else setError(msg || '操作失敗，請稍後再試');
    } finally { setLoading(false); }
  };



  // ── Tab render ───────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {

      // ── 商品管理 ───────────────────────────────────────────────
      case 'products': {
        const filtered = productFilter === 'all' ? products : products.filter(p => p.mode === productFilter);
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {(['all', 'skiing', 'skateboard'] as const).map(f => (
                  <button key={f} onClick={() => setProductFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${productFilter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-100 hover:text-black'}`}>
                    {f === 'all' ? '全部' : f === 'skiing' ? '⛷ 滑雪' : '🛹 滑板'}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => { setIsAddingProduct(true); setEditingProduct(null); setProductForm(EMPTY_PRODUCT); }}
                style={{ backgroundColor: '#111827', color: '#ffffff' }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-md">
                <Plus size={18} /> 新增商品
              </button>
            </div>

            {/* Add form */}
            {isAddingProduct && (
              <div className="max-w-4xl mx-auto mb-10 animate-in zoom-in-95 duration-300">
                <ProductForm form={productForm} setForm={setProductForm} onSave={handleSaveProduct} onCancel={() => setIsAddingProduct(false)} categories={categories} loading={loading} />
              </div>
            )}

            {/* List */}
            <div className="space-y-3">
              {filtered.length === 0 && !isAddingProduct && (
                <div className="text-center py-20 text-gray-300 font-bold">尚無商品，點擊「新增商品」開始新增</div>
              )}
              {filtered.map(p => {
                const catName = categories.find(c => c.id === p.category_id)?.name;
                return (
                  <div key={p.id}>
                    {editingProduct?.id === p.id ? (
                      <ProductForm form={productForm} setForm={setProductForm}
                        onSave={handleSaveProduct} onCancel={() => setEditingProduct(null)} categories={categories} loading={loading} />
                    ) : (
                      <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100" />
                          : <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"><Package size={20} className="text-gray-300" /></div>
                        }
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-sm truncate">{p.name}</div>
                          <div className="text-xs text-gray-400 font-medium">
                            {catName ? <span className="text-primary">{catName} · </span> : ''}
                            {p.tag && <span>{p.tag} · </span>}
                            {p.mode === 'skiing' ? '⛷ 滑雪' : '🛹 滑板'}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-black text-sm">NT${p.price.toLocaleString()}</div>
                          {p.special_price ? <div className="text-[10px] text-red-500 font-bold italic">SALE NT${p.special_price.toLocaleString()}</div> : null}
                          <div className={`text-[10px] font-bold ${p.is_active ? 'text-green-500' : 'text-gray-300'}`}>{p.is_active ? '上架中' : '已下架'}</div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => { setEditingProduct(p); setProductForm(p); setIsAddingProduct(false); }}
                            className="w-9 h-9 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => p.id && handleDeleteProduct(p.id)}
                            className="w-9 h-9 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pickup Locations Management */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg">實體據點管理</h3>
                  <p className="text-sm font-medium text-gray-400">設置商品結帳時可選擇的取貨據點</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input type="text" placeholder="據點名稱" value={pickupLocationName} onChange={e => setPickupLocationName(e.target.value)} className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-200 outline-none font-medium" />
                <input type="text" placeholder="據點地址" value={pickupLocationAddress} onChange={e => setPickupLocationAddress(e.target.value)} className="flex-[2] px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-200 outline-none font-medium" />
                <select value={pickupLocationMode} onChange={e => setPickupLocationMode(e.target.value as 'skiing' | 'skateboard')} className="px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-200 outline-none font-bold">
                  <option value="skiing">⛷️ 滑雪區</option>
                  <option value="skateboard">🛹 滑板區</option>
                </select>
                <button onClick={handleSavePickupLocation} disabled={isSavingPickupLocation} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
                  <Plus size={18} /> 新增
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pickupLocations.map(loc => (
                  <div key={loc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white border border-gray-200">
                          {loc.mode === 'skiing' ? '滑雪' : '滑板'}
                        </span>
                        <span className="font-bold text-sm">{loc.name}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{loc.address}</p>
                    </div>
                    <button onClick={() => handleDeletePickupLocation(loc.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // ── 分類管理 ───────────────────────────────────────────────
      case 'categories': {
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-900">
                <Plus size={18} className="text-primary" /> 新增商品分類
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className={labelCls}>分類名稱 Name</label>
                    <input type="text" placeholder="例如：專業滑雪板" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className={inputCls} />
                  </div>
                  <div className="w-full md:w-48">
                    <label className={labelCls}>所屬模式 Mode</label>
                    <select value={categoryForm.mode} onChange={e => setCategoryForm({ ...categoryForm, mode: e.target.value as any })} className={inputCls}>
                      <option value="skiing">⛷ 滑雪 Skiing</option>
                      <option value="skateboard"> 滑板 Skateboard</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSaveCategory}
                  disabled={loading || !categoryForm.name}
                  style={{ backgroundColor: '#111827', color: '#ffffff' }}
                  className="w-full py-4 rounded-2xl font-black hover:opacity-90 transition-all disabled:opacity-50 disabled:bg-gray-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={18} /> 儲存分類
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {['skiing', 'skateboard'].map((m) => (
                <div key={m} className="bg-white border border-gray-100 rounded-[28px] overflow-hidden">
                  <div className={`px-6 py-4 font-black flex items-center justify-between ${m === 'skiing' ? 'bg-sky-50 text-sky-600' : 'bg-red-50 text-red-600'}`}>
                    <span>{m === 'skiing' ? '⛷ 滑雪分類' : '🛹 滑板分類'}</span>
                    <span className="text-xs opacity-50">{categories.filter(c => c.mode === m).length} ITEMS</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {categories.filter(c => c.mode === m).map(cat => (
                      <div key={cat.id} className="px-6 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                        <span className="font-bold">{cat.name}</span>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="w-8 h-8 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {categories.filter(c => c.mode === m).length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-300 font-bold italic">尚無分類</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── 課程設置 ───────────────────────────────────────────────
      case 'courses': {
        const filtered = courseFilter === 'all' ? courses : courses.filter(c => c.mode === courseFilter);
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

            {/* ── 課程列表 ── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {(['all', 'skiing', 'skateboard'] as const).map(f => (
                  <button key={f} onClick={() => setCourseFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${courseFilter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-100 hover:text-black'}`}>
                    {f === 'all' ? '全部' : f === 'skiing' ? '⛷ 滑雪' : '🛹 滑板'}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => { setIsAddingCourse(true); setEditingCourse(null); setCourseForm(EMPTY_COURSE); }}
                style={{ backgroundColor: '#111827', color: '#ffffff' }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-md">
                <Plus size={18} /> 新增課程
              </button>
            </div>

            {isAddingCourse && (
              <div className="max-w-4xl mx-auto mb-10 animate-in zoom-in-95 duration-300">
                <CourseForm form={courseForm} setForm={setCourseForm} onSave={handleSaveCourse} onCancel={() => setIsAddingCourse(false)} loading={loading} />
              </div>
            )}

            <div className="space-y-3">
              {filtered.length === 0 && !isAddingCourse && (
                <div className="text-center py-20 text-gray-300 font-bold">尚無課程，點擊「新增課程」開始新增</div>
              )}
              {filtered.map(c => (
                <div key={c.id}>
                  {editingCourse?.id === c.id ? (
                    <CourseForm form={courseForm} setForm={setCourseForm}
                      onSave={handleSaveCourse} onCancel={() => setEditingCourse(null)} loading={loading} />
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <BookOpen size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm truncate text-gray-900">{c.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">
                            {c.mode === 'skiing' ? '⛷ Skiing 滑雪課程' : '🛹 Skateboard 滑板課程'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-black text-sm text-gray-900">NT${c.first_lesson_price.toLocaleString()} / NT${c.additional_lesson_price.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold ${c.is_active ? 'text-green-500' : 'text-gray-400'}`}>
                          {c.is_active ? '開放報名' : '已關閉'}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingCourse(c); setCourseForm(c); setIsAddingCourse(false); }}
                          className="w-9 h-9 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => c.id && handleDeleteCourse(c.id)}
                          className="w-9 h-9 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── 課程附屬設置 ── */}
            <div className="mt-10 pt-10 border-t-2 border-dashed border-gray-100 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Database size={16} className="text-primary" /> 課程附屬設置（教練 / 場地 / 排表）
              </h3>

              {/* Sub Tabs */}
              <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
                {[
                  { id: 'schedule', label: '預約排表', icon: <Calendar size={16} /> },
                  { id: 'coaches', label: '教練管理', icon: <Users size={16} /> },
                  { id: 'locations', label: '場地管理', icon: <MapPin size={16} /> }
                ].map(t => (
                  <button key={t.id} onClick={() => setCourseHubTab(t.id as any)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${courseHubTab === t.id ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Schedule */}
              {courseHubTab === 'schedule' && (() => {
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h4 className="text-xl font-black italic uppercase flex items-center gap-2 text-gray-900">
                          排課日曆 <span className="text-gray-400 font-medium tracking-normal text-base not-italic">({currentYear} / {currentMonth + 1})</span>
                        </h4>
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                          {['skiing', 'skateboard'].map(m => (
                            <button key={m} onClick={() => setScheduleMode(m as any)}
                              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${scheduleMode === m ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                              {m === 'skiing' ? '⛷ 滑雪端' : '🛹 滑板端'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-3">
                        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                          <div key={d} className="text-center text-[10px] font-black text-gray-300 py-2">{d}</div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const isBlocked = schedules.some(s => s.blocked_date === dateStr && s.mode === scheduleMode);
                          return (
                            <button key={day} onClick={() => toggleBlockedDate(dateStr)}
                              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${isBlocked ? 'bg-red-50 border-red-200 text-red-600 hover:bg-neutral-50 hover:border-neutral-200 hover:text-neutral-400' : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500'}`}>
                              <span className="text-sm font-black">{day}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">
                          {scheduleMode === 'skiing' ? '滑雪端' : '滑板端'} 時段設置
                        </h4>
                        {['weekday', 'weekend'].map(type => (
                          <div key={type} className="space-y-3">
                            <label className={labelCls}>{type === 'weekday' ? '📅 平日預設時段' : '🎉 假日預設時段'}</label>
                            <textarea
                              rows={2}
                              value={timeSettings[scheduleMode][`${type}_slots` as keyof CourseTimeSettings] as any}
                              onChange={e => {
                                const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setTimeSettings({ ...timeSettings, [scheduleMode]: { ...timeSettings[scheduleMode], [`${type}_slots`]: val } });
                              }}
                              className={`${inputCls} text-xs font-mono`}
                              placeholder="例如: 09:00, 13:00, 15:00"
                            />
                          </div>
                        ))}
                        <button onClick={() => handleSaveTimeSlots(scheduleMode)} disabled={loading}
                          style={{ backgroundColor: '#111827', color: '#ffffff' }}
                          className="w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md">
                          <Save size={14} /> 儲存時段
                        </button>
                        <div className="pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400">
                            <AlertCircle size={14} /> 說明
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                            時段請用英文逗號 `,` 隔開。藍色代表當天開放，紅色代表公休不開放預約。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Coaches */}
              {courseHubTab === 'coaches' && (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <button onClick={() => { setIsAddingCoach(true); setCoachForm(EMPTY_COACH); }}
                      style={{ backgroundColor: '#111827', color: '#ffffff' }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold hover:opacity-90 shadow-md transition-all active:scale-95">
                      <Plus size={18} /> 新增教練
                    </button>
                  </div>
                  {isAddingCoach && (
                    <div id="coach-editor" className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-black italic tracking-tight">{coachForm.id ? '編輯教練資料' : '建立新教練'}</h4>
                        <button onClick={() => setIsAddingCoach(false)} className="text-gray-400 hover:text-black"><X size={20}/></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>教練姓名</label>
                          <input type="text" value={coachForm.name} onChange={e => setCoachForm({ ...coachForm, name: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>所屬標籤</label>
                          <select value={coachForm.mode} onChange={e => setCoachForm({ ...coachForm, mode: e.target.value as any })} className={inputCls}>
                            <option value="skiing">滑雪 Skiing</option>
                            <option value="skateboard">滑板 Skateboard</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>教練 Email</label>
                        <input type="email" value={coachForm.email || ''} onChange={e => setCoachForm({ ...coachForm, email: e.target.value })} className={inputCls} placeholder="example@gmail.com" />
                        <p className="text-[10px] text-gray-400 mt-1 font-bold">當有人預約此教練時，系統會發信到這個信箱通知他</p>
                      </div>
                      <div>
                        <label className={labelCls}>教練簡介</label>
                        <textarea value={coachForm.description} onChange={e => setCoachForm({ ...coachForm, description: e.target.value })} className={inputCls} />
                      </div>
                      <ImageUploadField label="教練照片" value={coachForm.image_url} onChange={u => setCoachForm({ ...coachForm, image_url: u })} />
                      <div className="flex gap-3">
                        <button onClick={handleSaveCoach} style={{ backgroundColor: '#111827', color: '#ffffff' }} className="flex-1 py-4 rounded-2xl font-black shadow-lg shadow-black/10 active:scale-95 transition-all">
                          {coachForm.id ? '儲存修改內容' : '確認新增教練'}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coaches.map(c => (
                      <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 group">
                        {c.image_url
                          ? <img src={c.image_url} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-md" alt="" />
                          : <span className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                              <svg viewBox="0 0 40 40" fill="none" className="w-16 h-16">
                                <ellipse cx="20" cy="34" rx="13" ry="9" fill="#9ca3af"/>
                                <circle cx="20" cy="16" r="8" fill="#6b7280"/>
                              </svg>
                            </span>
                        }
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-sm">{c.name}</div>
                          {c.email && (
                            <div className="text-[10px] font-bold text-gray-500 mt-0.5 truncate" title={c.email}>{c.email}</div>
                          )}
                          <div className="text-[10px] font-bold text-gray-400 mt-0.5">{c.mode === 'skiing' ? '⛷ 滑雪教練' : '🛹 滑板教練'}</div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <button 
                            onClick={() => { 
                              setCoachForm(c); 
                              setIsAddingCoach(true);
                              setTimeout(() => {
                                document.getElementById('coach-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 100);
                            }} 
                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all"
                          >
                            <Settings2 size={14} />
                          </button>
                          <button 
                            onClick={() => c.id && handleDeleteCoach(c.id)} 
                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              {courseHubTab === 'locations' && (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <button onClick={() => { setIsAddingLocation(true); setLocationForm(EMPTY_LOCATION); }}
                      style={{ backgroundColor: '#111827', color: '#ffffff' }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold hover:opacity-90 shadow-md transition-all active:scale-95">
                      <Plus size={18} /> 新增地點
                    </button>
                  </div>
                  {isAddingLocation && (
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 max-w-2xl mx-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>地點名稱</label>
                          <input type="text" value={locationForm.name} onChange={e => setLocationForm({ ...locationForm, name: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>適用類型</label>
                          <select value={locationForm.mode} onChange={e => setLocationForm({ ...locationForm, mode: e.target.value as any })} className={inputCls}>
                            <option value="skiing">滑雪 Skiing</option>
                            <option value="skateboard">滑板 Skateboard</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>地址/詳細位置</label>
                        <input type="text" value={locationForm.address} onChange={e => setLocationForm({ ...locationForm, address: e.target.value })} className={inputCls} />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleSaveLocation} style={{ backgroundColor: '#111827', color: '#ffffff' }} className="flex-1 py-3 rounded-xl font-bold">儲存</button>
                        <button onClick={() => setIsAddingLocation(false)} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold">取消</button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    {locations.map(l => (
                      <div key={l.id} className="bg-white px-8 py-5 rounded-[28px] border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary"><MapPin size={24} /></div>
                          <div>
                            <div className="font-black text-sm">{l.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{l.address}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{l.mode}</span>
                          <button onClick={() => l.id && handleDeleteLocation(l.id)} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      }

      // ── 優惠券設置 ─────────────────────────────────────────────
      case 'vouchers': {
        const getTargetLabel = (v: Voucher) => {
          switch (v.target_type) {
            case 'global': return '🌐 全站通用';
            case 'skiing': return '⛷ 滑雪商品';
            case 'skateboard': return '🛹 滑板商品';
            case 'all_courses': return '🎓 所有課程';
            case 'category': {
              const cat = categories.find(c => c.id === v.target_id);
              return `📁 分類: ${cat ? cat.name : '未知'}`;
            }
            case 'product': {
              const prod = products.find(p => p.id === v.target_id);
              return `🛍 商品: ${prod ? prod.name : '未知'}`;
            }
            case 'course': {
              const crs = courses.find(c => c.id === v.target_id);
              return `🏫 課程: ${crs ? crs.name : '未知'}`;
            }
            default: return '未知範圍';
          }
        };

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end">
              <button 
                onClick={() => { setIsAddingVoucher(true); setEditingVoucher(null); setVoucherForm(EMPTY_VOUCHER); }}
                style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-md">
                <Plus size={18} /> 新增優惠券
              </button>
            </div>

            {isAddingVoucher && (
              <VoucherForm form={voucherForm} setForm={setVoucherForm}
                onSave={handleSaveVoucher} onCancel={() => setIsAddingVoucher(false)} categories={categories} products={products} courses={courses} loading={loading} />
            )}

            <div className="space-y-3">
              {vouchers.length === 0 && !isAddingVoucher && (
                <div className="text-center py-20 text-gray-300 font-bold">尚無優惠券，點擊「新增優惠券」開始新增</div>
              )}
              {vouchers.map(v => (
                <div key={v.id}>
                  {editingVoucher?.id === v.id ? (
                    <VoucherForm form={voucherForm} setForm={setVoucherForm}
                      onSave={handleSaveVoucher} onCancel={() => setEditingVoucher(null)} categories={categories} products={products} courses={courses} loading={loading} />
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <Tag size={20} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm font-mono tracking-wider">{v.title} <span className="text-gray-400 text-xs">({v.code})</span></div>
                        {v.description && <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5 whitespace-pre-wrap">{v.description}</div>}
                        <div className="text-xs text-gray-400 mt-1">
                          <span className="font-bold text-primary">{v.type === 'percent' ? `${v.value}% OFF` : `NT$${v.value.toLocaleString()} OFF`}</span>
                          {v.min_amount > 0 && ` · 門檻 NT$${v.min_amount.toLocaleString()}`}
                          {' · '}<span className="text-gray-600">{getTargetLabel(v)}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-400">{v.valid_until ? `至 ${v.valid_until}` : '無期限'}</div>
                        <div className="flex flex-col items-end gap-1 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${v.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {v.is_active ? '可使用' : '未啟用'}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${v.is_published ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                            {v.is_published ? '網站顯示' : '網站隱藏'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingVoucher(v); setVoucherForm(v); setIsAddingVoucher(false); }}
                          className="w-9 h-9 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => v.id && handleDeleteVoucher(v.id)}
                          className="w-9 h-9 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      // ── 首頁設定 ───────────────────────────────────────────────
      case 'homepage':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {['skiing', 'skateboard'].map((id) => {
                const settings = homepageSettings[id];
                if (!settings) return null;
                return (
                <div key={id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-3 rounded-2xl ${id === 'skiing' ? 'bg-sky-50 text-sky-600' : 'bg-red-50 text-red-600'}`}><Settings2 size={24} /></div>
                    <h3 className="text-xl font-black uppercase tracking-tight italic">
                      {id === 'skiing' ? '滑雪端' : '滑板端'} <span className="text-gray-400">HERO SETTINGS</span>
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: 'Hero Title (大標)', key: 'hero_title', type: 'input' },
                      { label: 'Hero Badge (標記)', key: 'hero_badge', type: 'input' },
                      { label: 'Hero Subtitle (內文)', key: 'hero_subtitle', type: 'textarea' },
                    ].map(({ label, key, type }) => {
                      const settings = homepageSettings[id];
                      if (!settings) return null;
                      return (
                        <div key={key}>
                          <label className={labelCls}>{label}</label>
                          {type === 'textarea'
                            ? <textarea rows={3} value={(settings as any)[key]} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, [key]: e.target.value } })} className={`${inputCls} resize-none`} />
                            : <input type="text" value={(settings as any)[key]} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, [key]: e.target.value } })} className={inputCls} />
                          }
                        </div>
                      );
                    })}
                    <ImageUploadField 
                      label="Background Image (背景圖)" 
                      value={settings.hero_bg_image} 
                      onChange={url => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, hero_bg_image: url } })} 
                    />
                    <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-2xl">
                      {[1, 2, 3, 4].map(num => (
                        <div key={num}>
                          <label className={labelCls}>Trust Item {num}</label>
                          <input type="text" value={(settings as any)[`trust_item_${num}`]} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, [`trust_item_${num}`]: e.target.value } })} className={inputCls} />
                        </div>
                      ))}
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Contact Section (聯絡區塊)
                      </h4>
                      <input type="text" placeholder="Section Title" value={settings.contact_title} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, contact_title: e.target.value } })} className={inputCls} />
                      <textarea rows={2} placeholder="Section Description" value={settings.contact_desc} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, contact_desc: e.target.value } })} className={`${inputCls} resize-none`} />
                      <div className="grid grid-cols-1 gap-3 bg-neutral-50 p-4 rounded-2xl">
                        <p className={labelCls}>聯絡跳轉連結 Contact Links</p>
                        {[
                          { key: 'contact_gmail', label: '📧 Gmail', placeholder: 'mailto:official@sk8.com' },
                          { key: 'contact_line', label: '💬 LINE', placeholder: 'https://line.me/ti/p/@yourID' },
                          { key: 'contact_instagram', label: '📷 Instagram', placeholder: 'https://www.instagram.com/yourID' },
                          { key: 'contact_facebook', label: '📘 Facebook', placeholder: 'https://www.facebook.com/yourPage' },
                        ].map(({ key, label, placeholder }) => (
                          <div key={key}>
                            <label className={labelCls}>{label}</label>
                            <input type="text" placeholder={placeholder} value={(settings as any)[key]} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, [key]: e.target.value } })} className={inputCls} />
                          </div>
                        ))}
                      </div>
                    </div>

                            {/* Other sections */}
                    {[
                      { title: 'Courses Section (課程區塊)', keys: [{ label: 'Title', key: 'courses_title', type: 'input' }, { label: 'Desc', key: 'courses_desc', type: 'textarea' }] },
                      { title: 'Shop Section (商店區塊)', keys: [{ label: 'Title', key: 'shop_title', type: 'input' }, { label: 'Desc', key: 'shop_desc', type: 'textarea' }] },
                      { title: 'Footer (頁尾)', keys: [{ label: 'Desc', key: 'footer_desc', type: 'textarea' }] },
                      { title: 'About Us (關於我們)', keys: [{ label: 'Team Intro', key: 'about_team', type: 'textarea' }, { label: 'Brand Story', key: 'about_story', type: 'textarea' }, { label: 'Join Us', key: 'about_join', type: 'textarea' }] },
                      { title: 'Legal Policies (法律條款)', keys: [{ label: 'Terms of Service (服務條款)', key: 'terms_of_service', type: 'textarea' }, { label: 'Privacy Policy (隱私權政策)', key: 'privacy_policy', type: 'textarea' }, { label: 'Refund Policy (退換貨政策)', key: 'refund_policy', type: 'textarea' }] },
                    ].map(({ title, keys }) => (
                      <div key={title} className="space-y-3 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {title}
                        </h4>
                        {keys.map(({ label, key, type }) => (
                          <div key={key}>
                            <label className={labelCls}>{label}</label>
                            {type === 'textarea'
                              ? <textarea rows={2} value={(settings as any)[key]} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, [key]: e.target.value } })} className={`${inputCls} resize-none`} />
                              : <input type="text" value={(settings as any)[key]} onChange={e => setHomepageSettings({ ...homepageSettings, [id]: { ...settings, [key]: e.target.value } })} className={inputCls} />
                            }
                          </div>
                        ))}
                      </div>
                    ))}

                    <button onClick={() => handleSaveHomepage(id)} disabled={loading}
                      style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                      className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg mt-2">
                      <Save size={18} /> 儲存變更
                    </button>
                  </div>
                </div>
                );
              })}
            </div>

            {/* EmailJS System Settings */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 mt-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Settings2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tight">系統 API 設置 <span className="text-gray-400 font-normal">(EmailJS 自動寄信)</span></h3>
                  <p className="text-sm font-bold text-gray-400 mt-1">填寫您的 EmailJS 金鑰，啟用「訂單完成自動寄發通知信給教練」的功能。</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-gray-500">Service ID</label>
                  <input type="text" value={emailJsSettings.service_id} onChange={e => setEmailJsSettings({ ...emailJsSettings, service_id: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold" placeholder="service_xxxxxxxx" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-gray-500">Public Key (Account)</label>
                  <input type="text" value={emailJsSettings.public_key} onChange={e => setEmailJsSettings({ ...emailJsSettings, public_key: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold" placeholder="xxxx_xxxxxxxxx_xxxx" />
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-blue-500">教練預約模板 ID (Course)</label>
                  <input type="text" value={emailJsSettings.template_id_course || emailJsSettings.template_id} onChange={e => setEmailJsSettings({ ...emailJsSettings, template_id_course: e.target.value })} className="w-full px-5 py-4 bg-blue-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="template_course_xxx" />
                  <p className="text-[10px] text-gray-400 mt-1 font-bold">用於寄信給教練的內容版型</p>
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-emerald-500">商品訂單模板 ID (Product)</label>
                  <input type="text" value={emailJsSettings.template_id_product || emailJsSettings.template_id} onChange={e => setEmailJsSettings({ ...emailJsSettings, template_id_product: e.target.value })} className="w-full px-5 py-4 bg-emerald-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" placeholder="template_product_xxx" />
                  <p className="text-[10px] text-gray-400 mt-1 font-bold">用於寄給管理員或客戶的商品清單</p>
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-gray-400">備用模板 ID (General)</label>
                  <input type="text" value={emailJsSettings.template_id} onChange={e => setEmailJsSettings({ ...emailJsSettings, template_id: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-500 outline-none font-bold" placeholder="template_xxxxxxxx" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-[10px] font-black uppercase tracking-widest block mb-2 text-orange-500">老闆/管理員通知信箱 (Admin Email)</label>
                  <input type="email" value={emailJsSettings.admin_email} onChange={e => setEmailJsSettings({ ...emailJsSettings, admin_email: e.target.value })} className="w-full px-5 py-4 bg-orange-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold" placeholder="admin@example.com" />
                  <p className="text-[10px] text-gray-400 mt-1 font-bold">所有訂單（商品與課程）都會同步發送一份副本到此信箱供老闆核對</p>
                </div>
              </div>
              <div className="flex justify-end pt-6">
                <button 
                  onClick={handleSaveSystemSettings} 
                  disabled={isSavingSystemSettings} 
                  style={{ backgroundColor: '#000000', color: '#ffffff' }}
                  className="px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] disabled:opacity-50 flex items-center gap-3"
                >
                  <Save size={18} /> 儲存 API 設定
                </button>
              </div>
            </div>

          </div>
        );

      // ── 訂單管理 ───────────────────────────────────────────────
      case 'orders': {
        const filteredByType = orders.filter(o => {
          if (orderType === 'product') return o.items.some(item => item.type === 'product');
          return o.items.some(item => item.type === 'course_booking');
        });
        
        const filtered = orderFilter === 'all' 
          ? filteredByType 
          : filteredByType.filter(o => o.mode === orderFilter);

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Order Image Modal */}
            {selectedOrderImage && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedOrderImage(null)}>
                <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center">
                  <button className="absolute top-0 right-0 p-4 text-white hover:scale-110 transition-transform"><X size={32} /></button>
                  <img src={selectedOrderImage} alt="Transfer Screenshot" className="max-w-full max-h-full object-contain shadow-2xl rounded-xl" />
                </div>
              </div>
            )}

            {/* Type Selector & Mode Filter */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner w-full md:w-auto">
                <button 
                  onClick={() => setOrderType('product')}
                  className={`flex-1 md:w-40 py-3 rounded-xl font-black text-sm transition-all ${orderType === 'product' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  商品訂單
                </button>
                <button 
                  onClick={() => setOrderType('course')}
                  className={`flex-1 md:w-40 py-3 rounded-xl font-black text-sm transition-all ${orderType === 'course' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  課程預約
                </button>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {(['all', 'skiing', 'skateboard'] as const).map(f => (
                  <button key={f} onClick={() => setOrderFilter(f)}
                    className={`flex-1 md:px-6 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${orderFilter === f ? 'bg-gray-200 text-gray-900 border border-gray-300' : 'bg-gray-100 text-gray-500 border border-gray-100 hover:text-gray-900'}`}>
                    {f === 'all' ? '全部' : f === 'skiing' ? '滑雪' : '滑板'}
                  </button>
                ))}
              </div>
            </div>


            
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-xl italic uppercase tracking-tighter">
                {orderType === 'product' ? 'Product Orders' : 'Course Bookings'} 
                <span className="text-gray-300 ml-2">[{filtered.length}]</span>
              </h3>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {ordersError && (
                <div className="p-12 bg-red-50 border border-red-100 rounded-[40px] text-center">
                  <AlertCircle size={32} className="mx-auto mb-4 text-red-500" />
                  <h4 className="text-red-900 font-black mb-1">讀取失敗</h4>
                  <button onClick={fetchOrders} className="mt-6 px-8 py-3 bg-red-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-500/20">重試</button>
                </div>
              )}

              {!ordersError && filtered.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                  <Database size={48} className="mx-auto mb-4 text-gray-100" />
                  <p className="text-gray-300 font-black uppercase tracking-widest">目前沒有符合條件的訂單</p>
                </div>
              )}

              {!ordersError && filtered.map(order => {
                const isExpanded = expandedOrders.has(order.id);
                const toggleExpand = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setExpandedOrders(prev => {
                    const next = new Set(prev);
                    if (next.has(order.id)) next.delete(order.id);
                    else next.add(order.id);
                    return next;
                  });
                };
                const itemNames = order.items.map(i => i.name).join(', ');

                return (
                <div key={order.id} className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  {/* Collapsed Summary Row */}
                  <div 
                    onClick={toggleExpand}
                    className="flex items-center gap-4 p-5 md:p-6 cursor-pointer select-none hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="font-black text-sm text-gray-900 truncate min-w-0 shrink-0 w-20 md:w-28">
                      {order.customer_name || '未具名'}
                    </div>

                    <div className="flex-1 text-xs font-medium text-gray-400 truncate min-w-0 hidden md:block">
                      {itemNames}
                    </div>

                    <div className="font-black text-sm text-gray-900 shrink-0 tabular-nums">
                      NT${order.total_price.toLocaleString()}
                    </div>

                    <div className="text-[10px] font-bold text-gray-400 shrink-0 tabular-nums">
                      {new Date(order.created_at).toLocaleString('zh-TW')}
                    </div>

                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform shrink-0 ${isExpanded ? 'rotate-180 bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <ChevronLeft size={14} className="rotate-[-90deg]" />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t-2 border-black">
                      <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10">
                    
                        {/* Main Details */}
                        <div className="flex-1 space-y-8">
                          {/* Header Info */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                                order.mode === 'skiing' ? 'bg-sky-50 text-sky-600' : 'bg-red-50 text-red-600'
                              }`}>
                                {order.mode === 'skiing' ? '⛷ Skiing' : '🛹 Skateboard'}
                              </span>
                              <span className="text-xs font-black text-gray-300 uppercase tracking-widest">ID: {order.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar size={14} />
                              <span className="text-xs font-bold">{new Date(order.created_at).toLocaleString('zh-TW')}</span>
                            </div>
                          </div>

                          {/* Items & Price */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">訂購項目</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-start justify-between bg-neutral-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="flex-1">
                                      <div className="font-black text-sm text-gray-900 leading-tight">{item.name}</div>
                                      {item.type === 'course_booking' && item.details && (
                                        <div className="mt-4 space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-white rounded-xl border border-gray-100">
                                              <div className="text-[9px] font-black text-gray-400 uppercase mb-1">指定教練</div>
                                              <div className="text-xs font-black text-gray-900">
                                                {coaches.find(c => c.id === (item.details.coachId || item.details.coach_id))?.name || '未指定'}
                                              </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-gray-100">
                                              <div className="text-[9px] font-black text-gray-400 uppercase mb-1">上課地點</div>
                                              <div className="text-xs font-black text-gray-900">
                                                {locations.find(l => l.id === item.details.locationId)?.name || '未指定'}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">預約明細</div>
                                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                              {Object.entries(item.details.times || {}).map(([date, slots]: [string, any]) => (
                                                <div key={date} className="border-b border-gray-50 last:border-0 p-3">
                                                  <div className="text-[10px] font-black text-gray-400 mb-2">{date}</div>
                                                  <div className="space-y-1.5">
                                                    {Object.entries(slots).map(([time, qty]: [string, any]) => (
                                                      <div key={time} className="flex items-center justify-between text-xs font-bold bg-gray-50/50 p-2 rounded-lg">
                                                        <span className="text-gray-900">{time}</span>
                                                        <span className="text-gray-400 px-2 py-0.5 bg-white rounded border border-gray-100">{qty}人</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <span className="ml-4 px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-baseline gap-3 pt-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">實付總額</span>
                                <span className="text-3xl font-black italic text-gray-900 tracking-tighter">NT${order.total_price.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Customer & Delivery Information */}
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">客戶聯絡與配送</h4>
                              <div className="bg-neutral-900 p-6 rounded-[32px] text-white space-y-4 shadow-xl shadow-gray-900/10">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60"><Users size={16} /></div>
                                    <div>
                                      <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">姓名</div>
                                      <div className="font-bold text-sm">{order.customer_name || '未提供'}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60"><Settings2 size={16} /></div>
                                    <div>
                                      <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">電話</div>
                                      <div className="font-bold text-sm">{order.customer_phone || '未提供'}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60"><Search size={16} /></div>
                                    <div>
                                      <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">Email</div>
                                      <div className="font-medium text-xs opacity-80 truncate max-w-[150px]">{order.customer_email || '未提供'}</div>
                                    </div>
                                  </div>
                                </div>

                                {orderType === 'product' && (
                                  <div className="pt-4 border-t border-white/10 space-y-3">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 mt-1"><MapPin size={16} /></div>
                                      <div>
                                        <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">配送方式</div>
                                        <div className="font-bold text-xs">{order.delivery_method === 'convenience_store' ? '🏪 超商領取' : '📍 據點領取'}</div>
                                        <div className="text-[10px] font-medium text-white/60 mt-1">
                                          {order.delivery_method === 'convenience_store' 
                                            ? order.delivery_info?.store || '無門市資訊'
                                            : (pickupLocations.find(l => l.id === order.delivery_info?.location_id)?.name || '未指定據點')}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bank Info */}
                          <div className="p-5 bg-neutral-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400"><Landmark size={20} /></div>
                              <div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">轉帳帳戶</div>
                                <div className="text-sm font-bold text-gray-900">{order.bank_info?.bankName} - {order.bank_info?.accountName}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">末五碼/帳號</div>
                              <div className="text-sm font-black font-mono text-gray-900">{order.bank_info?.accountNumber}</div>
                            </div>
                          </div>
                        </div>

                        {/* Screenshot Preview */}
                        <div className="w-full lg:w-64 shrink-0">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">轉帳截圖</div>
                          <div 
                            onClick={(e) => { e.stopPropagation(); setSelectedOrderImage(order.screenshot_data); }}
                            className="aspect-[3/4] bg-neutral-100 rounded-[32px] overflow-hidden cursor-pointer group relative border-4 border-white shadow-2xl hover:scale-[1.02] transition-all"
                          >
                            <img src={order.screenshot_data} alt="Transfer" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/40 px-4 py-2 rounded-full backdrop-blur-sm">查看大圖</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        );
      }

      // ── 使用者管理 ──────────────────────────────────────────────
      case 'users': {
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">使用者 ID (名稱)</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">註冊日期時間</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Array.isArray(usersList) && usersList.map((u) => (
                      <tr key={u?.id || Math.random().toString()} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-8 py-5">
                          <div>
                            <div className="font-bold text-gray-900">{u?.full_name || '未命名使用者'}</div>
                            <div className="text-[10px] text-gray-400 font-medium">{u?.email || '無電子郵件'}</div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-sm font-medium text-gray-600">
                            {u?.created_at ? new Date(u.created_at).toLocaleDateString() : '未知日期'}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {u?.created_at ? new Date(u.created_at).toLocaleTimeString() : '--:--'}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => setSelectedUser(u)}
                            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-colors"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-gray-300 font-bold italic">
                          尚無使用者資料
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <AnimatePresence>
              {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedUser(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
                  >
                    <div className="p-10">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-2xl font-black mb-1 italic uppercase tracking-tight">{selectedUser?.full_name || '未命名'}</h3>
                          <p className="text-gray-400 font-medium text-sm">User Detailed Information</p>
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Email Address</label>
                            <div className="font-bold text-gray-900">{selectedUser?.email || '無電子郵件'}</div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Role</label>
                            <div className="inline-flex px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-black uppercase">Standard User</div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Account ID (UID)</label>
                          <div className="text-xs font-mono bg-gray-50 p-3 rounded-xl border border-gray-100 break-all text-gray-500">
                            {selectedUser?.id || 'N/A'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Created At</label>
                            <div className="text-sm font-bold text-gray-700">
                              {selectedUser?.created_at ? new Date(selectedUser.created_at).toLocaleString() : '未知日期'}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Security Status</label>
                            <div className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                              <Check size={14} /> Encrypted & Secure
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                          <p className="text-[10px] text-amber-700 font-bold italic leading-relaxed">
                            * 注意：系統不提供顯示使用者密碼的功能。這是基於最高等級的安全規範，密碼已在資料庫中進行不可逆加密，即使是管理員也無法讀取。
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      // ── Dashboard ──────────────────────────────────────────────
      default:
        return (
          <DashboardView 
            products={products}
            courses={courses}
            vouchers={vouchers}
            coaches={coaches}
            orders={orders}
            categories={categories}
          />
        );
    }
  };

  const tabLabel: Record<string, string> = {
    dashboard: 'Dashboard', products: '商品管理', categories: '分類管理', courses: '課程設置', vouchers: '優惠券設置', homepage: '首頁設定', orders: '訂單管理', users: '使用者管理'
  };
  const tabDesc: Record<string, string> = {
    dashboard: '歡迎回來，管理員。', products: '新增、編輯或下架商品。', categories: '管理商品分類標籤。', courses: '管理課程項目、教練、場地與預約時間表。', vouchers: '設定折扣碼與優惠券。', homepage: '設定網站首頁的大標、內文與背景圖。', orders: '核對銀行轉帳截圖並管理訂單狀態。', users: '檢視所有註冊會員的詳細資訊。'
  };

  // ── Login screen ─────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
          <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-black mb-10 transition-colors">
            <ChevronLeft size={20} /><span className="font-bold">返回首頁</span>
          </button>
          <h2 className="text-4xl font-black mb-2 italic tracking-tighter uppercase">
            {isRegister ? 'Join' : 'Welcome'} <span className="text-primary">{isRegister ? 'SK8' : 'Back'}</span>
          </h2>
          <p className="text-neutral-500 mb-8 font-medium">{isRegister ? '建立您的專屬帳號' : '登入帳號'}</p>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">{error}</div>}
            {isRegister && (
              <div>
                <label className={labelCls}>Username 使用者名稱</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-6 py-4 bg-neutral-100 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all font-bold" placeholder="請輸入您的名稱" required />
              </div>
            )}
            <div>
              <label className={labelCls}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 bg-neutral-100 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all font-bold" placeholder="name@example.com" required />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 bg-neutral-100 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all font-bold" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: '#6b7280', color: '#ffffff', opacity: loading ? 0.5 : 1 }}
              className="w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl mt-6">
              {loading
                ? <div style={{ width: 24, height: 24, border: '4px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" />
                : <span className="flex items-center gap-2">{isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}{isRegister ? '立即註冊' : '登入帳號'}</span>
              }
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm font-bold text-neutral-400 hover:text-primary transition-colors">
              {isRegister ? '已經有帳號了？ 點此登入' : '還沒有管理員權限？ 點此註冊'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main layout ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-xl font-black italic tracking-tighter">SK8 <span className="text-primary italic">ADMIN</span></h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-900"><MenuIcon /></button>
      </div>

      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm" />}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col p-8 z-40 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black italic tracking-tighter">SK8 <span className="text-primary italic">ADMIN</span></h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-gray-400"><X size={20} /></button>
        </div>

        {/* Back to Site Button */}
        <button 
          onClick={onBack}
          style={{ backgroundColor: '#171717', color: '#ffffff' }}
          className="mb-6 flex items-center gap-3 px-6 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        >
          <ChevronLeft size={18} /> 回到主網站
        </button>

        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', label: '儀表板總覽', icon: <LayoutDashboard size={20} /> },
            { id: 'products', label: '商品管理', icon: <Package size={20} /> },
            { id: 'categories', label: '分類管理', icon: <Tag size={20} /> },
            { id: 'courses', label: '課程設置', icon: <BookOpen size={20} /> },
            { id: 'vouchers', label: '優惠券設置', icon: <Tag size={20} /> },
            { id: 'orders', label: '訂單管理', icon: <Package size={20} /> },
            { id: 'users', label: '使用者管理', icon: <Users size={20} /> },
            { id: 'homepage', label: '首頁內容設定', icon: <Settings2 size={20} /> },
          ].map(({ id, label, icon }) => (
            <button key={id}
              onClick={() => { setActiveTab(id as any); setIsMobileMenuOpen(false); }}
              style={activeTab === id ? { backgroundColor: '#111827', color: '#ffffff' } : {}}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === id ? 'shadow-xl translate-x-2' : 'text-gray-400 hover:bg-neutral-50 hover:text-gray-900'}`}>
              {icon} {label}
            </button>
          ))}
        </nav>

        <button onClick={() => { setIsLoggedIn(false); onBack(); }} className="mt-auto flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all">
          <LogOut size={20} /> 登出系統
        </button>
      </aside>

      {/* Main content */}
      <div ref={scrollContainerRef} className="flex-1 w-full overflow-y-auto">
        <main className="p-6 md:p-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 italic tracking-tight uppercase">{tabLabel[activeTab]}</h2>
              <p className="text-gray-400 font-medium text-sm md:text-base">{tabDesc[activeTab]}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary text-gray-900 rounded-2xl font-black text-sm hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
              >
                <Search size={18} className="text-primary" /> 預覽網站成果
              </button>
              <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 font-bold text-sm shadow-sm text-gray-900">
                🕒 系統時間: {new Date().toLocaleDateString()}
              </div>
            </div>
          </header>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default AdminPortal;
