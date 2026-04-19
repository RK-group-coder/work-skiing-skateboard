import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Mail, Instagram, Facebook, MessageCircle, Send, X, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
  const { mode } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'admin', text: '您好！我是 SK8 的專業顧問，有任何關於課程或裝備的問題嗎？' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', text: message }]);
    setMessage('');
    // Simulate auto-reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'admin', text: '收到您的訊息！我們的教練會盡快與您聯繫。' }]);
    }, 1000);
  };

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
        <p className="text-text-muted mb-12 max-w-lg mx-auto">
          有任何課程疑問、裝備挑選建議或商業合作，隨時透過以下管道與我們聯繫。
        </p>

        {/* Social Links Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <Mail size={24} />, name: 'Gmail', color: '#EA4335', link: 'mailto:official@sk8.com' },
            { icon: <MessageCircle size={24} />, name: 'LINE', color: '#06C755', link: '#' },
            { icon: <Instagram size={24} />, name: 'Instagram', color: '#E4405F', link: '#' },
            { icon: <Facebook size={24} />, name: 'Facebook', color: '#1877F2', link: '#' },
          ].map((social) => (
            <motion.a
              key={social.name}
              href={social.link}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-6 rounded-3xl bg-card-bg border border-white/5 hover:border-primary/30 transition-all shadow-lg"
            >
              <div style={{ color: social.color }} className="mb-3">
                {social.icon}
              </div>
              <span className="font-bold text-sm">{social.name}</span>
            </motion.a>
          ))}
        </div>

        {/* Direct Chat CTA */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsChatOpen(true)}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-all rounded-full" />
          <div className="relative glass-pill py-8 px-10 border-2 border-primary overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl">
                <MessageCircle size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black">24/7 在線即時諮詢</h3>
                <p className="text-sm opacity-70">直接與專業滑降教練進行 1 對 1 交談</p>
              </div>
            </div>
            <button className="bg-text text-bg px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">
              立即開啟對話
            </button>
          </div>
        </motion.div>
      </div>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed bottom-32 right-6 md:right-12 z-[100] w-[calc(100vw-3rem)] md:w-96 h-[500px] flex flex-col bg-card-bg border border-white/20 rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-6 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
                  <User size={20} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold leading-tight uppercase">SK8 客服主任</h4>
                  <div className="flex items-center gap-1 text-[10px] opacity-80">
                    <ShieldCheck size={10} /> 官方認證
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.role === 'admin' 
                    ? 'self-start bg-secondary text-text rounded-tl-none' 
                    : 'self-end bg-primary text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10 bg-black/5 flex items-center gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="輸入您的問題..."
                className="flex-1 bg-card-bg border border-white/10 p-3 rounded-2xl outline-none focus:border-primary transition-colors text-sm"
              />
              <button 
                onClick={handleSend}
                className="p-3 bg-primary text-white rounded-xl active:scale-95 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
