import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardViewProps {
  products: any[];
  courses: any[];
  vouchers: any[];
  coaches: any[];
  orders: any[];
  categories?: any[];
}


const DashboardView: React.FC<DashboardViewProps> = ({ products, courses, vouchers, coaches, orders, categories = [] }) => {
  const [dataMode, setDataMode] = useState<'all' | 'skiing' | 'skateboard'>('all');

  // Compute generic counts based on mode
  const totalCourses = courses.filter(c => dataMode === 'all' || c.mode === dataMode).length;
  const totalProducts = products.filter(p => dataMode === 'all' || p.mode === dataMode).length;
  
  // Filter coaches by mode
  const totalCoaches = coaches.filter(c => dataMode === 'all' || c.mode === dataMode).length;
  
  // Filter vouchers deeply by target_type and actual target's mode
  const totalVouchers = vouchers.filter(v => {
    if (dataMode === 'all') return true;
    if (v.target_type === 'global' || v.target_type === 'all_courses') return true;
    if (v.target_type === dataMode) return true;
    
    // Check if voucher targets a specific entity that belongs to the current dataMode
    if (v.target_type === 'product' && v.target_id) {
      const product = products.find(p => p.id === v.target_id);
      if (product && product.mode === dataMode) return true;
    }
    if (v.target_type === 'course' && v.target_id) {
      const course = courses.find(c => c.id === v.target_id);
      if (course && course.mode === dataMode) return true;
    }
    if (v.target_type === 'category' && v.target_id) {
      const category = categories?.find(c => c.id === v.target_id);
      if (category && category.mode === dataMode) return true;
    }
    
    return false;
  }).length;

  // Process Orders for Revenue and Charts
  const processedData = useMemo(() => {
    let totalCourseRev = 0;
    let totalProductRev = 0;
    
    // Group by month for charts (1-12)
    const monthlyData: Record<number, { name: string; courseRev: number; productRev: number; courseCount: number; productCount: number; courseInv: number; productInv: number; coaches: number }> = {};
    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = { name: `${i}月`, courseRev: 0, productRev: 0, courseCount: 0, productCount: 0, courseInv: 0, productInv: 0, coaches: 0 };
    }

    let skiingRev = 0;
    let skateboardRev = 0;

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const month = date.getMonth() + 1; // 1-12
      
      order.items?.forEach((item: any) => {
        const itemMode = item.mode || order.mode;
        if (dataMode !== 'all' && itemMode !== dataMode) return;

        const itemTotal = (item.price || 0) * (item.quantity || 1);
        const itemQty = item.quantity || 1;
        const isCourse = item.type === 'course_booking';

        if (isCourse) {
          totalCourseRev += itemTotal;
          if (monthlyData[month]) {
            monthlyData[month].courseRev += itemTotal;
            monthlyData[month].courseCount += itemQty;
          }
        } else {
          totalProductRev += itemTotal;
          if (monthlyData[month]) {
            monthlyData[month].productRev += itemTotal;
            monthlyData[month].productCount += itemQty;
          }
        }

        if (itemMode === 'skiing') skiingRev += itemTotal;
        else if (itemMode === 'skateboard') skateboardRev += itemTotal;
      });
    });

    // Calculate Real Inventory Trend (Backwards from Current Stock)
    // We assume current products stock is the stock at the end of the current month (month 12 for chart purposes, or current month)
    const currentMonth = new Date().getMonth() + 1;
    let runningProductStock = products.filter(p => dataMode === 'all' || p.mode === dataMode).reduce((sum, p) => sum + (p.stock || 0), 0);
    let runningCourseStock = courses.filter(c => dataMode === 'all' || c.mode === dataMode).length * 20; // Assume each course adds ~20 slots of "inventory"
    
    // Work backwards from 12 down to 1
    for (let i = 12; i >= 1; i--) {
      monthlyData[i].productInv = runningProductStock;
      monthlyData[i].courseInv = runningCourseStock;
      
      // The stock at the start of this month was: (End of month stock) + (Sales during this month)
      runningProductStock += monthlyData[i].productCount;
      runningCourseStock += monthlyData[i].courseCount;
    }

    // Calculate Coach Growth based on created_at
    const sortedCoaches = [...coaches].filter(c => dataMode === 'all' || c.mode === dataMode).sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });

    let cumulativeCoaches = 0;
    for (let i = 1; i <= 12; i++) {
      const addedThisMonth = sortedCoaches.filter(c => {
        if (!c.created_at) return i === currentMonth; // Default to current month if no date
        return new Date(c.created_at).getMonth() + 1 === i;
      }).length;
      cumulativeCoaches += addedThisMonth;
      monthlyData[i].coaches = cumulativeCoaches;
    }

    // If total coaches is > 0 but cumulative is 0 (due to parsing issues), just make it a flat line
    if (cumulativeCoaches === 0 && totalCoaches > 0) {
      for (let i = 1; i <= 12; i++) monthlyData[i].coaches = totalCoaches;
    }

    const chartData = Object.values(monthlyData);
    const totalRev = totalCourseRev + totalProductRev;
    
    const brandData = [
      { name: '滑雪品牌', value: skiingRev },
      { name: '滑板品牌', value: skateboardRev }
    ].filter(d => dataMode === 'all' || (dataMode === 'skiing' && d.name === '滑雪品牌') || (dataMode === 'skateboard' && d.name === '滑板品牌'));

    return { totalCourseRev, totalProductRev, totalRev, chartData, brandData };
  }, [orders, dataMode, products, courses, coaches, totalCoaches]);

  const { totalCourseRev, totalProductRev, totalRev, chartData, brandData } = processedData;

  const formatCurrency = (val: number) => `NT$ ${val.toLocaleString()}`;

  // Helper styles for active buttons to combat Tailwind missing classes
  const activeStyle = { backgroundColor: '#111827', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
  const inactiveStyle = { color: '#6b7280' };

  return (
    <div className="space-y-6 max-w-[1200px] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black italic tracking-tighter">SK8 儀表板</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Mode Tabs */}
        <div className="flex flex-1 gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setDataMode('all')}
            style={dataMode === 'all' ? activeStyle : inactiveStyle}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${dataMode === 'all' ? '' : 'hover:text-gray-900'}`}
          >總和</button>
          <button 
            onClick={() => setDataMode('skiing')}
            style={dataMode === 'skiing' ? { backgroundColor: '#0ea5e9', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)' } : inactiveStyle}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${dataMode === 'skiing' ? '' : 'hover:text-sky-500'}`}
          >滑雪</button>
          <button 
            onClick={() => setDataMode('skateboard')}
            style={dataMode === 'skateboard' ? { backgroundColor: '#ef4444', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' } : inactiveStyle}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${dataMode === 'skateboard' ? '' : 'hover:text-red-500'}`}
          >滑板</button>
        </div>
      </div>

      {/* KPI Cards Row 1 & 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '課程總數量', value: totalCourses },
          { label: '商品總數量', value: totalProducts },
          { label: '優惠券總數量', value: totalVouchers },
          { label: '教練總數量', value: totalCoaches },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-400 mb-2">{kpi.label}</span>
            <div className="text-3xl font-black text-gray-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue KPI Cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-gray-400 mb-2 block">課程總銷量</span>
            <div className="text-3xl font-black text-gray-900">{formatCurrency(totalCourseRev)}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-gray-400 mb-2 block">商品總銷量</span>
            <div className="text-3xl font-black text-gray-900">{formatCurrency(totalProductRev)}</div>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl shadow-gray-900/20 flex justify-between items-end text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-xs font-bold text-gray-400 mb-2 block">總營業額</span>
            <div className="text-4xl font-black">{formatCurrency(totalRev)}</div>
          </div>
        </div>
      </div>

      {/* Chart: Revenue Trend */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-6">營業額趨勢</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1f2937" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1f2937" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="courseRev" stroke="#1f2937" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart: Sales Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-6">銷量對比</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              <Bar dataKey="courseCount" name="課程銷量" fill="#1f2937" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="productCount" name="商品銷量" fill="#6b7280" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart: Inventory Trend & Brand Pie */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-6">庫存趨勢</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                <Line type="monotone" dataKey="courseInv" name="課程數量" stroke="#1f2937" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="productInv" name="商品數量" stroke="#9ca3af" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 mb-2">品牌營收分布</h3>
          <div className="w-full h-[220px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
                <Pie 
                  data={brandData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={40} 
                  outerRadius={60} 
                  paddingAngle={5} 
                  dataKey="value" 
                  stroke="none"
                  isAnimationActive={false}
                  label={({ name, percent }) => `${(name || '').replace('品牌','')}\n${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={true}
                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === '滑雪品牌' ? '#0ea5e9' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {brandData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.name === '滑雪品牌' ? '#0ea5e9' : '#ef4444' }}/> 
                {d.name} {totalRev > 0 ? Math.round((d.value/totalRev)*100) : 0}%
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-6">教練團隊成長</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="coaches" name="教練數量" fill="#1f2937" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
