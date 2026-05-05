import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const { mode } = useTheme();
  const [header, setHeader] = React.useState({
    title: 'CONNECT WITH SK8',
    desc: '有任何課程疑問或商業合作建議？歡迎透過以下管道與我們保持聯繫。'
  });
  const [links, setLinks] = React.useState({
    gmail: 'mailto:official@sk8.com',
    line: 'https://line.me/ti/p/@sk8_official',
    instagram: 'https://www.instagram.com/sk8_extreme',
    facebook: 'https://www.facebook.com/SK8ExtremeCenter',
  });

  React.useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_settings')
          .select('contact_title, contact_desc, contact_gmail, contact_line, contact_instagram, contact_facebook')
          .eq('id', mode)
          .single();
        if (error) throw error;
        if (data) {
          setHeader({
            title: data.contact_title || 'CONNECT WITH SK8',
            desc: data.contact_desc || '有任何課程疑問或商業合作建議？歡迎透過以下管道與我們保持聯繫。'
          });
          setLinks({
            gmail: data.contact_gmail || 'mailto:official@sk8.com',
            line: data.contact_line || 'https://line.me/ti/p/@sk8_official',
            instagram: data.contact_instagram || 'https://www.instagram.com/sk8_extreme',
            facebook: data.contact_facebook || 'https://www.facebook.com/SK8ExtremeCenter',
          });
        }
      } catch (err) {
        console.error('Error fetching contact:', err);
      }
    };
    fetchContact();
  }, [mode]);

  const contacts = [
    {
      href: links.gmail,
      color: '#EA4335',
      label: 'Gmail',
      sub: links.gmail,
      icon: <Mail size={32} color="#EA4335" />,
    },
    {
      href: links.line,
      color: '#06C755',
      label: 'LINE',
      sub: links.line,
      icon: <MessageCircle size={32} color="#06C755" />,
    },
    {
      href: links.instagram,
      color: '#E4405F',
      label: 'Instagram',
      sub: links.instagram,
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#E4405F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
    {
      href: links.facebook,
      color: '#1877F2',
      label: 'Facebook',
      sub: links.facebook,
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#1877F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="py-24 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-black mb-4 italic tracking-tighter"
        >
          {header.title.includes('SK8') 
            ? <>{header.title.split('SK8')[0]}<span className="text-primary italic">SK8</span>{header.title.split('SK8')[1]}</>
            : header.title
          }
        </motion.h2>
        <p className="text-text-muted mb-16 max-w-lg mx-auto">
          {header.desc}
        </p>

        {/* Social Links Matrix - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {contacts.map(({ href, color, label, icon }) => {
            const finalHref = label === 'Gmail' && !href.startsWith('mailto:') ? `mailto:${href}` : href;
            
            return (
              <motion.a
                key={label}
                href={finalHref}
                target={finalHref.startsWith('mailto:') ? undefined : '_blank'}
                rel={finalHref.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                whileHover={{ y: -10, scale: 1.02 }}
                className="flex flex-col items-center p-8 md:p-12 rounded-[32px] bg-card-bg border border-white/5 shadow-xl hover:border-primary/50 transition-all group"
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                  style={{ backgroundColor: `${color}1A` }}
                >
                  {icon}
                </div>
                <span className="font-black text-xl italic uppercase tracking-wider">{label}</span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
