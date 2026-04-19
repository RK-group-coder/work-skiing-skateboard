import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const { mode } = useTheme();

  return (
    <section id="contact" className="py-24 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-black mb-4 italic tracking-tighter"
        >
          CONNECT WITH <span className="text-primary italic">SK8</span>
        </motion.h2>
        <p className="text-text-muted mb-16 max-w-lg mx-auto">
          有任何課程疑問或商業合作建議？歡迎透過以下管道與我們保持聯繫。
        </p>

        {/* Social Links Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Gmail */}
          <motion.a 
            href="mailto:official@sk8.com" 
            whileHover={{ y: -10, scale: 1.02 }} 
            className="flex flex-col items-center p-8 rounded-[32px] bg-card-bg border border-white/5 shadow-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#EA4335]/10 flex items-center justify-center mb-6 group-hover:bg-[#EA4335]/20 transition-colors">
              <Mail size={32} color="#EA4335" />
            </div>
            <span className="font-black text-lg mb-1 italic">Gmail</span>
            <span className="text-xs text-text-muted">official@sk8.com</span>
          </motion.a>

          {/* LINE */}
          <motion.a 
            href="#" 
            whileHover={{ y: -10, scale: 1.02 }} 
            className="flex flex-col items-center p-8 rounded-[32px] bg-card-bg border border-white/5 shadow-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#06C755]/10 flex items-center justify-center mb-6 group-hover:bg-[#06C755]/20 transition-colors">
              <MessageCircle size={32} color="#06C755" />
            </div>
            <span className="font-black text-lg mb-1 italic">LINE</span>
            <span className="text-xs text-text-muted">@sk8_official</span>
          </motion.a>

          {/* Instagram */}
          <motion.a 
            href="#" 
            whileHover={{ y: -10, scale: 1.02 }} 
            className="flex flex-col items-center p-8 rounded-[32px] bg-card-bg border border-white/5 shadow-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#E4405F]/10 flex items-center justify-center mb-6 group-hover:bg-[#E4405F]/20 transition-colors">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#E4405F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <span className="font-black text-lg mb-1 italic">Instagram</span>
            <span className="text-xs text-text-muted">@sk8_extreme</span>
          </motion.a>

          {/* Facebook */}
          <motion.a 
            href="#" 
            whileHover={{ y: -10, scale: 1.02 }} 
            className="flex flex-col items-center p-8 rounded-[32px] bg-card-bg border border-white/5 shadow-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center mb-6 group-hover:bg-[#1877F2]/20 transition-colors">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#1877F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <span className="font-black text-lg mb-1 italic">Facebook</span>
            <span className="text-xs text-text-muted">SK8 Extreme Center</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
