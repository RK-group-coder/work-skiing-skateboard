import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../hooks/useTheme';
import { Send, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import OpenAI from 'openai';

interface Message {
  id: string;
  content: string;
  image_url?: string;
  is_from_admin: boolean;
  created_at: string;
}

interface CustomerSupportProps {
  user: User | null;
  onBack: () => void;
  onLoginRequest: () => void;
}

const CustomerSupport: React.FC<CustomerSupportProps> = ({ user, onBack, onLoginRequest }) => {
  const { mode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      // Setup realtime subscription
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages((prev) => [...prev, newMsg]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !pendingImage) || !user || isUploading) return;

    setIsUploading(true);
    let imageUrl = '';

    try {
      if (pendingImage) {
        const fileExt = pendingImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, pendingImage);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const content = newMessage.trim();
      const payload: any = {
        user_id: user.id,
        user_email: user.email,
        content,
        is_from_admin: false,
      };
      if (imageUrl) payload.image_url = imageUrl;

      // Optimistic clear UI
      setNewMessage('');
      setPendingImage(null);
      setPendingImagePreview(null);

      const { data, error } = await supabase.from('support_messages').insert(payload).select().single();

      if (error) throw error;
      
      // 手動加入剛送出的訊息 (避免 postgres_changes 未生效)
      if (data) {
        setMessages(prev => [...prev, data as Message]);
      } else {
        fetchMessages();
      }

      setIsAiTyping(true);

      // 觸發 AI 自動回覆
      setTimeout(async () => {
        let aiText = "您好！我們已經收到您的訊息。目前客服人員正在協助其他顧客，稍後將會盡快為您解答！";
        const apiKey = localStorage.getItem('sk8_openai_api_key');
        
        if (apiKey) {
          try {
            // 取得網站資訊作為 AI 的上下文
            const [productsRes, coursesRes] = await Promise.all([
              supabase.from('products').select('name, price, mode, is_active').eq('is_active', true),
              supabase.from('courses').select('name, price, mode')
            ]);

            const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
            
            // 整理對話歷史
            const recentMessages = messages.slice(-5);
            const openaiMessages: any[] = recentMessages.map(m => ({
              role: m.is_from_admin ? 'assistant' : 'user',
              content: m.content || '(傳送了一張圖片)'
            }));

            // 加入當前這則最新訊息
            if (imageUrl && !content.trim()) {
              openaiMessages.push({
                role: 'user',
                content: [
                  { type: "text", text: "這是一張圖片，請根據這張圖片協助我或給我建議。" },
                  { type: "image_url", image_url: { url: imageUrl } }
                ]
              });
            } else if (imageUrl && content.trim()) {
              openaiMessages.push({
                role: 'user',
                content: [
                  { type: "text", text: content },
                  { type: "image_url", image_url: { url: imageUrl } }
                ]
              });
            } else {
              openaiMessages.push({ role: 'user', content: content.trim() });
            }

            const systemPrompt = `你是一位專業且熱情的「SK8 極限運動（滑雪、滑板）客服助理」。
請根據以下商店與課程資訊，為顧客解答問題。
如果顧客問的問題不在這些資訊內，請友善地回答「這部分需要為您確認，會請專人為您服務」。
回覆請保持簡短、有禮貌、活潑，並使用繁體中文，可以使用 emoji。

【可購買的商品清單】
${JSON.stringify(productsRes.data || [])}

【可預約的課程清單】
${JSON.stringify(coursesRes.data || [])}
`;

            const response = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                ...openaiMessages
              ]
            });
            
            if (response.choices[0]?.message?.content) {
              aiText = response.choices[0].message.content;
            }
          } catch (error) {
            console.error("OpenAI error in CustomerSupport:", error);
            // 發生錯誤時退回 mock
            if (imageUrl && !content.trim()) {
              aiText = "我們已經收到您傳送的圖片。客服專員會盡快為您確認內容！";
            }
          }
        } else {
          // 沒有 API Key 時的 Mock 邏輯
          if (imageUrl && !content.trim()) {
            aiText = "我們已經收到您傳送的圖片。客服專員會盡快為您確認內容！";
          } else {
            const lowerMsg = content.toLowerCase();
            if (lowerMsg.includes('課程') || lowerMsg.includes('預約') || lowerMsg.includes('教練')) {
              aiText = "關於課程預約的問題，您可以先在「首頁」查看各教練可用的時段。如果有更細節的需求，專員稍後會親自回覆您！";
            } else if (lowerMsg.includes('退款') || lowerMsg.includes('取消') || lowerMsg.includes('改期')) {
              aiText = "瞭解您的需求。取消或改期的處理通常需要由專員人工確認，我們已記錄您的問題，會盡快協助您處理。";
            } else if (lowerMsg.includes('商品') || lowerMsg.includes('滑板') || lowerMsg.includes('滑雪') || lowerMsg.includes('買')) {
              aiText = "感謝您對我們裝備的興趣！如果有庫存或尺寸相關的疑問，客服專員會馬上為您解答。";
            }
          }
        }

        const aiPayload = {
          user_id: user.id,
          user_email: user.email,
          content: aiText + "\n\n*(AI自動回覆)*",
          is_from_admin: true,
        };

        const { data: aiData, error: aiError } = await supabase.from('support_messages').insert(aiPayload).select().single();
        if (!aiError && aiData) {
          setMessages(prev => [...prev, aiData as Message]);
        }
        setIsAiTyping(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert('發送失敗: ' + err.message);
      setIsAiTyping(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPendingImage(file);
    setPendingImagePreview(URL.createObjectURL(file));
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingImage = () => {
    setPendingImage(null);
    setPendingImagePreview(null);
  };

  if (!user) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center ${mode === 'skiing' ? 'bg-gray-50' : 'bg-gray-900 text-white'}`}>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl font-black mb-4">客服專區</h2>
          <p className="mb-8 opacity-70">請先登入以使用線上客服功能</p>
          <div className="flex gap-4 justify-center">
            <button onClick={onBack} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 font-bold hover:bg-gray-300 transition-colors">返回首頁</button>
            <button onClick={onLoginRequest} className="px-6 py-3 rounded-xl text-white font-bold transition-colors" style={{ background: 'var(--primary-gradient)' }}>立即登入</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${mode === 'skiing' ? 'bg-white' : 'bg-[#000000]'} overflow-hidden`}>
      {/* Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b ${mode === 'skiing' ? 'border-gray-200 bg-white' : 'border-gray-800 bg-[#000000]'}`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} className={mode === 'skiing' ? 'text-black' : 'text-white'} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold italic">
              SK8
            </div>
            <div>
              <h1 className={`font-bold text-lg leading-none ${mode === 'skiing' ? 'text-black' : 'text-white'}`}>SK8 客服中心</h1>
              <p className={`text-xs mt-1 ${mode === 'skiing' ? 'text-gray-500' : 'text-gray-400'}`}>通常在幾小時內回覆</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${mode === 'skiing' ? 'bg-gray-50' : 'bg-[#111111]'}`}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold italic mb-4 opacity-50">
              SK8
            </div>
            <p className={`font-bold ${mode === 'skiing' ? 'text-gray-500' : 'text-gray-400'}`}>有什麼我們可以幫忙的嗎？</p>
            <p className={`text-sm mt-2 ${mode === 'skiing' ? 'text-gray-400' : 'text-gray-500'}`}>發送訊息給客服中心</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = !msg.is_from_admin;
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold italic text-xs mr-2 shrink-0">
                    SK8
                  </div>
                )}
                <div 
                  className={`max-w-[75%] px-4 py-3 rounded-2xl flex flex-col ${
                    isUser 
                      ? 'bg-blue-500 text-white rounded-br-sm' 
                      : mode === 'skiing'
                        ? 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm'
                        : 'bg-gray-800 text-white border border-gray-700 rounded-bl-sm'
                  }`}
                >
                  {msg.image_url && (
                    <img src={msg.image_url} alt="Uploaded" className="rounded-xl mb-2 max-w-full cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.image_url, '_blank')} />
                  )}
                  {msg.content && <p className="whitespace-pre-wrap break-words text-[15px]">{msg.content}</p>}
                  <div className={`text-[10px] mt-1 text-right ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold italic text-xs mr-2 shrink-0 shadow-sm">
              SK8
            </div>
            <div className={`px-4 py-3 rounded-2xl flex items-center gap-1.5 ${mode === 'skiing' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-gray-800 border border-gray-700'} rounded-bl-sm h-[44px]`}>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 pb-safe border-t ${mode === 'skiing' ? 'border-gray-200 bg-white' : 'border-gray-800 bg-[#000000]'}`}>
        {pendingImagePreview && (
          <div className="mb-3 relative inline-block">
            <img src={pendingImagePreview} alt="Preview" className="h-20 w-auto rounded-lg border border-gray-200 object-cover shadow-sm" />
            <button 
              type="button" 
              onClick={removePendingImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-black shadow-md transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageSelect} 
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${mode === 'skiing' ? 'text-gray-500' : 'text-gray-400'} disabled:opacity-50 shrink-0`}
          >
            <ImageIcon size={24} />
          </button>
          <div className={`flex-1 min-h-[44px] max-h-32 rounded-3xl flex items-center px-4 ${mode === 'skiing' ? 'bg-gray-100' : 'bg-gray-900'}`}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={pendingImagePreview ? "加上文字說明..." : "傳送訊息..."}
              className="w-full bg-transparent border-none focus:outline-none py-3 text-[15px]"
              style={{ color: mode === 'skiing' ? '#000' : '#fff' }}
              disabled={isUploading}
            />
          </div>
          <button 
            type="submit" 
            disabled={(!newMessage.trim() && !pendingImage) || isUploading}
            className={`p-3 rounded-full transition-colors shrink-0 ${
              (newMessage.trim() || pendingImage) && !isUploading
                ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                : 'text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            {isUploading ? <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Send size={24} className={(newMessage.trim() || pendingImage) ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerSupport;
