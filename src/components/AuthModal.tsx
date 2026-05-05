import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'skiing' | 'skateboard';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, mode = 'skiing' }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isSkiing = mode === 'skiing';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();

    try {
      if (isRegister) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: { data: { full_name: trimmedFullName } }
        });
        if (signUpError) throw signUpError;
        alert('註冊成功！請檢查您的信箱進行驗證。');
        setIsRegister(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ 
          email: trimmedEmail, 
          password 
        });
        if (signInError) throw signInError;
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || '發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-md overflow-hidden rounded-[40px] shadow-2xl ${
          isSkiing ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
        }`}
      >
        {/* Decoration */}
        <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-20 rounded-full ${
          isSkiing ? 'bg-blue-400' : 'bg-red-400'
        }`} />

        <div className="relative p-8 md:p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                {isRegister ? 'Join ' : 'Welcome '}
                <span style={{ color: isSkiing ? '#00c6ff' : '#ff416c' }}>
                  {isRegister ? 'SK8' : 'Back'}
                </span>
              </h2>
              <p className="text-xs font-bold opacity-40 mt-2 uppercase tracking-widest">
                {isRegister ? '建立您的專屬帳號' : '登入您的帳號以繼續結帳'}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isSkiing ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-xs font-bold">
                {error}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 ml-1">
                  使用者名稱 Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input
                    required type="text" value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="請輸入您的名稱"
                    className={`w-full pl-12 pr-6 py-4 rounded-2xl font-bold text-sm outline-none transition-all ${
                      isSkiing ? 'bg-gray-100 focus:ring-2 focus:ring-blue-300' : 'bg-white/10 focus:ring-2 focus:ring-red-400'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 ml-1">
                電子郵件 Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  required type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className={`w-full pl-12 pr-6 py-4 rounded-2xl font-bold text-sm outline-none transition-all ${
                    isSkiing ? 'bg-gray-100 focus:ring-2 focus:ring-blue-300' : 'bg-white/10 focus:ring-2 focus:ring-red-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 ml-1">
                密碼 Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  required type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-6 py-4 rounded-2xl font-bold text-sm outline-none transition-all ${
                    isSkiing ? 'bg-gray-100 focus:ring-2 focus:ring-blue-300' : 'bg-white/10 focus:ring-2 focus:ring-red-400'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 mt-2 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: isSkiing
                  ? 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'
                  : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                  {isRegister ? '立即註冊' : '登入帳號'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-8 pt-6 border-t border-current/10 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"
            >
              {isRegister ? '已經有帳號了？ 點此登入' : '還沒有帳號？ 立即免費註冊'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
