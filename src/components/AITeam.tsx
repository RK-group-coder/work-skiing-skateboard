import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Megaphone, Lightbulb, MessageCircle, Crown, Image as ImageIcon, Sparkles, KeyRound, Check, X, Settings2, History, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OpenAI from 'openai';

type AIPersona = 'marketing' | 'planner' | 'editor' | 'director';

interface Message {
  id: string;
  sender: 'user' | AIPersona;
  text: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

const personas = [
  { id: 'marketing', name: 'AI 行銷', icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', desc: '資料分析、廣告投放' },
  { id: 'planner', name: 'AI 企劃', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', desc: '活動發想、專案規劃' },
  { id: 'editor', name: 'AI 小編', icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: '社群貼文、文案撰寫' },
  { id: 'director', name: 'AI 總監', icon: Crown, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', desc: '統籌決策、最終評估' },
] as const;

const personaPrompts: Record<AIPersona, string> = {
  marketing: "你是一位名為「AI 行銷」的專業行銷專家。針對極限運動（滑板、滑雪）相關的品牌，提供資料分析、廣告投放建議、以及市場行銷策略。在群組討論中，如果其他專家的提議不符合市場效益或行銷邏輯，你可以提出反對意見並堅持自己的立場。請以繁體中文回答，語氣要專業且具備商業思維。",
  planner: "你是一位名為「AI 企劃」的活動企劃專家。負責發想滑雪體驗營、滑板賽事等活動計畫，並提供詳細的活動流程與創意點子。在群組討論中，如果別人的提議缺乏創意或執行性，你可以提出質疑並給出更好的點子，甚至可以和其他專家爭論。請以繁體中文回答，語氣要熱情且富有創意。",
  editor: "你是一位名為「AI 小編」的社群媒體編輯。負責為品牌撰寫吸睛的貼文文案，並且善用 emoji 與流行的網路用語。在群組討論中，如果你覺得別人的提議太無聊或不適合社群傳播，請大膽吐槽並提出你的年輕化觀點。請以繁體中文回答，語氣要活潑有趣且貼近街頭文化。",
  director: "你是一位名為「AI 總監」的品牌營運總監。你的任務是從宏觀的角度進行統籌決策。在群組討論中，你通常是最後發言的人，請務必根據前面其他專家的討論結果進行客觀評估，如果他們吵架，請調停並給出最終的決策與資源分配策略。請以繁體中文回答，語氣要穩重、有決斷力且具備領導者風範。"
};

interface AITeamProps {
  products?: any[];
  courses?: any[];
  orders?: any[];
  vouchers?: any[];
  coaches?: any[];
  categories?: any[];
}

export default function AITeam({ products = [], courses = [], orders = [], vouchers = [], coaches = [] }: AITeamProps) {
  const [activePersonas, setActivePersonas] = useState<Set<AIPersona>>(new Set(['editor', 'director']));
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial-1', sender: 'director', text: '各位好，我是 AI 總監。這裡是我們的跨部門智能工作群組。請在上方的選單勾選需要參與討論的成員，我們會在收到您的訊息後，依序提出各自專業的看法與討論！', timestamp: new Date(Date.now() - 60000) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [typingPersona, setTypingPersona] = useState<AIPersona | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Key state
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sk8_openai_api_key') || '');
  const [showKeySetting, setShowKeySetting] = useState(!localStorage.getItem('sk8_openai_api_key'));
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [isShortMode, setIsShortMode] = useState(true);

  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat History State
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('sk8_ai_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
      } catch (e) { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('sk8_ai_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Sync current messages to session
  useEffect(() => {
    const userMessages = messages.filter(m => m.sender === 'user');
    if (userMessages.length === 0) return;

    if (!currentSessionId) {
      const newId = Date.now().toString();
      const title = userMessages[0].text.slice(0, 20) + (userMessages[0].text.length > 20 ? '...' : '');
      const newSession: ChatSession = { id: newId, title, messages, updatedAt: new Date() };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newId);
    } else {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages, updatedAt: new Date() } : s));
    }
  }, [messages]);

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([
      { id: 'initial-1', sender: 'director', text: '各位好，我是 AI 總監。這裡是我們的跨部門智能工作群組。請在上方的選單勾選需要參與討論的成員，我們會在收到您的訊息後，依序提出各自專業的看法與討論！', timestamp: new Date() }
    ]);
    setShowHistory(false);
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      startNewChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingPersona]);

  const handleSaveKey = () => {
    if (tempKey.trim().startsWith('sk-')) {
      localStorage.setItem('sk8_openai_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setShowKeySetting(false);
    } else if (tempKey.trim() === '') {
      localStorage.removeItem('sk8_openai_api_key');
      setApiKey('');
      setShowKeySetting(false);
    } else {
      alert('無效的 API Key 格式。請確認您的金鑰是以 "sk-" 開頭。');
    }
  };

  const togglePersona = (id: AIPersona) => {
    setActivePersonas(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // Prevent deselecting all
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return;
    
    if (!apiKey) {
      alert('請先設定 OpenAI API Key 才能與 AI 對話！');
      setShowKeySetting(true);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
      imageUrl: selectedImage || undefined
    };

    const currentMessages = [...messages, newMessage];
    setMessages(currentMessages);
    setInputValue('');
    setSelectedImage(null);

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true 
    });

    // 決定發言順序：行銷 -> 企劃 -> 小編 -> 總監 (總監必定最後說話)
    const order: AIPersona[] = ['marketing', 'planner', 'editor', 'director'];
    const responders = order.filter(p => activePersonas.has(p));

    // 準備對話歷史紀錄 (包含所有參與者的發言)
    let conversationHistory = currentMessages.slice(-15).map(msg => {
      const senderName = msg.sender === 'user' ? '管理員' : personas.find(p => p.id === msg.sender)?.name;
      const textContent = msg.sender === 'user' ? msg.text : `【${senderName} 的發言】：${msg.text}`;
      
      if (msg.imageUrl) {
        return {
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: [
            { type: "text" as const, text: textContent || "請參考這張圖片。" },
            { type: "image_url" as const, image_url: { url: msg.imageUrl } }
          ]
        };
      } else {
        return {
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: textContent
        };
      }
    });

    // 依序呼叫每一位勾選的 AI，並將前一個 AI 的回答加入上下文
    for (const responder of responders) {
      setTypingPersona(responder);

      try {
        const lengthPrompt = isShortMode ? " 請務必控制在 50 個字以內，極度簡明扼要地表達你的觀點。" : " 請提供詳細且完整的觀點與分析。";
        const imageGenPrompt = " 如果你認為需要視覺參考圖（例如資料數據圖表、宣傳海報、產品設計），或是使用者明確要求你產圖，請在回覆中加入 `[GENERATE_IMAGE: 這裡寫詳細的英文提示詞]`。系統會自動為你產出圖片。提示詞必須是英文的，若產圖表請描述數據視覺化的風格。";
        
        const siteDataContext = `\n\n【網站即時數據資料庫 (唯讀)】\n以下是網站當前營運的實際數據，請根據這些真實數據給出分析與建議：\n` +
          `- 商品清單: ${JSON.stringify(products.map(p => ({ 名稱: p.name, 價格: p.price, 庫存: p.stock, 類別: p.mode })))}\n` +
          `- 課程清單: ${JSON.stringify(courses.map(c => ({ 名稱: c.name, 價格: c.price, 類別: c.mode })))}\n` +
          `- 最近十筆訂單: ${JSON.stringify(orders.slice(0, 10).map(o => ({ 總金額: o.items?.reduce((sum:number, i:any)=>sum+(i.price*i.quantity),0), 購買項目: o.items?.map((i:any)=>i.name).join(','), 日期: new Date(o.created_at).toLocaleDateString() })))}\n` +
          `- 總訂單數: ${orders.length}\n` +
          `- 教練團隊: ${JSON.stringify(coaches.map(c => ({ 姓名: c.name, 專長: c.mode })))}\n` +
          `- 優惠券: ${JSON.stringify(vouchers.map(v => ({ 代碼: v.code, 折扣: v.discount_value, 類型: v.discount_type })))}\n`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: personaPrompts[responder] + " 你現在在一個多人討論群組裡，你的發言前綴不需要加上自己的名字，直接以第一人稱回答即可。請針對前面的對話提出你的專業見解。" + lengthPrompt + imageGenPrompt + siteDataContext },
            ...conversationHistory as any // type assertion needed for array content vs string content
          ],
        });

        let responseText = response.choices[0]?.message?.content || '（無回應）';
        let generatedImageUrl: string | undefined = undefined;

        const imageGenMatch = responseText.match(/\[GENERATE_IMAGE:\s*(.*?)\]/);
        if (imageGenMatch && apiKey) {
          const imgPrompt = imageGenMatch[1];
          responseText = responseText.replace(/\[GENERATE_IMAGE:\s*.*?\]/, '').trim();
          
          try {
            let imageResponse;
            try {
              imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: imgPrompt,
                n: 1,
                size: "1024x1024"
              });
            } catch (dalle3Error: any) {
              if (dalle3Error.message?.includes('exist') || dalle3Error.message?.includes('support') || dalle3Error.message?.includes('not found')) {
                // Fallback to dall-e-2 if dall-e-3 is not available on this API endpoint
                imageResponse = await openai.images.generate({
                  model: "dall-e-2",
                  prompt: imgPrompt,
                  n: 1,
                  size: "1024x1024"
                });
              } else {
                throw dalle3Error;
              }
            }
            if (imageResponse?.data?.[0]?.url) {
              generatedImageUrl = imageResponse.data[0].url;
            }
          } catch (imgError: any) {
            console.warn("OpenAI Image generation failed, falling back to free API:", imgError.message);
            // Ultimate fallback for endpoints that do not support OpenAI images at all
            const safePrompt = encodeURIComponent(imgPrompt + " (bar chart, modern UI, vibrant colors, data visualization)");
            generatedImageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=800&height=600&nologo=true`;
          }
        }
        
        const responseMessage: Message = {
          id: Date.now().toString() + Math.random().toString(),
          sender: responder,
          text: responseText,
          timestamp: new Date(),
          imageUrl: generatedImageUrl
        };

        setMessages(prev => [...prev, responseMessage]);
        
        // 將這位 AI 的發言加入歷史紀錄，讓下一個 AI 能看到
        conversationHistory.push({
          role: 'assistant',
          content: `【${personas.find(p=>p.id===responder)?.name} 的發言】：${responseText}`
        });

      } catch (error: any) {
        console.error(error);
        const errorMessage: Message = {
          id: Date.now().toString() + Math.random().toString(),
          sender: responder,
          text: `【系統錯誤】無法連線至 OpenAI。錯誤訊息：${error.message}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        break; // 若發生錯誤則中斷後續 AI 的發言
      }
    }

    setTypingPersona(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // const activeNames = personas.filter(p => activePersonas.has(p.id)).map(p => p.name).join('、');

  return (
    <div className="flex flex-col h-[80vh] min-h-[600px] bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* API Key Settings Overlay */}
      <AnimatePresence>
        {showKeySetting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-[32px] shadow-2xl max-w-md w-full relative"
            >
              {apiKey && (
                <button onClick={() => setShowKeySetting(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
                  <X size={24} />
                </button>
              )}
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <KeyRound size={32} />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight mb-2">設定 OpenAI API Key</h3>
              <p className="text-sm font-bold text-gray-500 mb-6 leading-relaxed">
                為了讓您的 AI 工作團隊擁有大腦，請輸入您的 OpenAI API 金鑰 (sk-...)。<br/>此金鑰僅會儲存在您的瀏覽器中，不會外洩至伺服器。
              </p>
              
              <div className="space-y-4">
                <input 
                  type="password"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={tempKey}
                  onChange={e => setTempKey(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm font-bold"
                />
                <button 
                  onClick={handleSaveKey}
                  style={{ backgroundColor: '#000000', color: '#ffffff' }}
                  className="w-full py-4 font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Check size={20} /> 儲存金鑰並開始使用
                </button>
                <div className="text-center">
                  <button onClick={() => { setTempKey(''); handleSaveKey(); }} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                    清除現有金鑰
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Personas Selection */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => { setShowSettings(false); setShowHistory(!showHistory); }}
              className={`p-2 rounded-xl transition-colors ${showHistory ? 'bg-gray-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 shadow-sm'}`}
            >
              <History size={20} />
            </button>
            <button 
              onClick={() => { setShowHistory(false); setShowSettings(!showSettings); }}
              className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-gray-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 shadow-sm'}`}
            >
              <Settings2 size={20} />
            </button>
            
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 left-0 w-72 md:w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 flex flex-col max-h-[400px]"
                >
                  <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <span className="font-black text-sm text-gray-900">對話紀錄</span>
                    <button 
                      onClick={startNewChat} 
                      style={{ backgroundColor: '#000000', color: '#ffffff' }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus size={14} /> 新對話
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {sessions.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs font-bold">目前沒有對話紀錄</div>
                    ) : (
                      sessions.map(session => (
                        <div 
                          key={session.id}
                          onClick={() => loadSession(session)}
                          className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${currentSessionId === session.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex flex-col overflow-hidden pr-2">
                            <span className="text-sm font-black text-gray-900 truncate">{session.title}</span>
                            <span className="text-[10px] text-gray-400 font-bold">{new Date(session.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <button 
                            onClick={(e) => deleteSession(e, session.id)}
                            className="p-2 text-gray-900 hover:text-white hover:bg-red-500 bg-gray-200 rounded-lg transition-all shrink-0 ml-2 shadow-sm"
                            title="刪除紀錄"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <Sparkles className="text-primary hidden md:block" size={20} />
              <h3 className="text-xl font-black italic tracking-tight uppercase">AI 專案會議群組</h3>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-gray-400 text-sm font-bold">點選以加入討論成員</div>
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <div 
                      onClick={() => setIsShortMode(!isShortMode)}
                      className="flex items-center bg-gray-100 rounded-xl p-1 relative shadow-inner cursor-pointer select-none w-40"
                    >
                      <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${isShortMode ? 'left-1' : 'left-[calc(50%+2px)]'}`}
                      />
                      <div className={`relative z-10 flex-1 text-center py-1 text-xs font-black transition-colors duration-300 ${isShortMode ? 'text-black' : 'text-gray-400'}`}>
                        短對話
                      </div>
                      <div className={`relative z-10 flex-1 text-center py-1 text-xs font-black transition-colors duration-300 ${!isShortMode ? 'text-black' : 'text-gray-400'}`}>
                        長對話
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowKeySetting(true)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:text-black hover:border-black transition-colors shadow-sm"
                    >
                      <KeyRound size={14} /> API 設定
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {personas.map((persona) => {
                    const Icon = persona.icon;
                    const isActive = activePersonas.has(persona.id);
                    return (
                      <button
                        key={persona.id}
                        onClick={() => togglePersona(persona.id as AIPersona)}
                        className={`relative flex items-center gap-3 p-3 md:p-4 rounded-2xl transition-all duration-300 border-2 text-left ${
                          isActive 
                            ? 'bg-white border-black shadow-md scale-100 ring-2 ring-black/5' 
                            : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm scale-95 opacity-80 hover:opacity-100 grayscale hover:grayscale-0'
                        }`}
                      >
                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-transparent'}`}>
                          <Check size={10} strokeWidth={4} />
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${persona.bg} ${persona.color}`}>
                          <Icon size={20} />
                        </div>
                        <div className="overflow-hidden pr-2">
                          <div className={`font-black text-sm whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{persona.name}</div>
                          <div className="text-[10px] font-bold text-gray-400 truncate mt-0.5 hidden md:block">{persona.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/30">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const pData = isUser ? null : personas.find(p => p.id === msg.sender);
              const PersonaIcon = pData?.icon;

              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    isUser ? 'bg-black text-white' : `${pData?.bg} ${pData?.color} border ${pData?.border}`
                  }`}>
                    {isUser ? <Bot size={20} className="opacity-50" /> : PersonaIcon && <PersonaIcon size={20} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[75%]`}>
                    <div className="flex items-baseline gap-2 mb-1.5 mx-1">
                      <span className="text-xs font-black text-gray-500">{isUser ? '您 (專案負責人)' : pData?.name}</span>
                      <span className="text-[10px] font-bold text-gray-300">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`p-4 rounded-[24px] text-sm md:text-base font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                      isUser 
                        ? 'bg-black text-white rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                    }`}>
                      {msg.imageUrl && (
                        <div className="mb-3 rounded-xl overflow-hidden shadow-sm">
                          <img src={msg.imageUrl} alt="Uploaded content" className="max-w-full max-h-64 object-contain" />
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {typingPersona && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-4 flex-row"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${personas.find(p=>p.id===typingPersona)?.bg} ${personas.find(p=>p.id===typingPersona)?.color} border ${personas.find(p=>p.id===typingPersona)?.border}`}>
                  {React.createElement(personas.find(p=>p.id===typingPersona)?.icon || Bot, { size: 20 })}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-baseline gap-2 mb-1.5 mx-1">
                    <span className="text-xs font-black text-gray-500">{personas.find(p=>p.id===typingPersona)?.name} 正在思考...</span>
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-[24px] rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[52px]">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className={`w-2 h-2 rounded-full ${personas.find(p=>p.id===typingPersona)?.color} opacity-40`} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className={`w-2 h-2 rounded-full ${personas.find(p=>p.id===typingPersona)?.color} opacity-60`} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className={`w-2 h-2 rounded-full ${personas.find(p=>p.id===typingPersona)?.color} opacity-80`} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-24 w-24 object-cover rounded-2xl border border-gray-200 shadow-sm" />
              <button 
                onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 shadow-md transition-transform"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <div className="relative flex items-end gap-3 bg-gray-50 p-2 rounded-[28px] border border-gray-200 focus-within:border-gray-300 focus-within:ring-4 focus-within:ring-gray-100 transition-all">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-black hover:bg-gray-200 transition-colors rounded-2xl shrink-0"
            >
              <ImageIcon size={20} />
            </button>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={apiKey ? `輸入訊息...` : '請先設定 API Key 才能傳送訊息'}
              disabled={!apiKey}
              className="w-full max-h-32 bg-transparent border-none focus:ring-0 resize-none py-3.5 text-sm font-bold outline-none disabled:opacity-50"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={(!inputValue.trim() && !selectedImage) || typingPersona !== null || !apiKey}
              style={(inputValue.trim() || selectedImage) && typingPersona === null && apiKey ? { backgroundColor: '#000000', color: '#ffffff' } : {}}
              className={`p-3 rounded-2xl shrink-0 transition-all ${
                (inputValue.trim() || selectedImage) && typingPersona === null && apiKey
                  ? 'shadow-md hover:scale-105 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="text-center mt-3 text-[10px] font-bold text-gray-400">
            AI 之間可能會產生爭論與不同觀點，AI 總監會進行最終評估。支援上傳圖片進行討論。
          </div>
        </div>
      </div>
    </div>
  );
}
