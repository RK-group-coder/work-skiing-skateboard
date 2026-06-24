import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Send, User as UserIcon, MessageSquare, X, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  user_id: string;
  user_email: string;
  content: string;
  image_url?: string;
  is_from_admin: boolean;
  created_at: string;
  read_by_admin: boolean;
}

const AdminSupport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, { full_name?: string, email?: string }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (data) {
        setMessages(data);
        const userIds = [...new Set(data.map(m => m.user_id))].filter(Boolean);
        if (userIds.length > 0) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);
          if (profileData) {
            const profileMap = profileData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            setProfiles(profileMap);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel('admin-support-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUserId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !pendingImage) || !selectedUserId || isUploading) return;

    setIsUploading(true);
    let imageUrl = '';

    // get user email from the latest message
    const userMessages = messages.filter(m => m.user_id === selectedUserId);
    const userEmail = userMessages.length > 0 ? userMessages[0].user_email : '';

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
        user_id: selectedUserId,
        user_email: userEmail,
        content,
        is_from_admin: true,
      };
      if (imageUrl) payload.image_url = imageUrl;

      // Optimistic clear
      setNewMessage('');
      setPendingImage(null);
      setPendingImagePreview(null);

      const { data, error } = await supabase.from('support_messages').insert(payload).select().single();

      if (error) throw error;
      
      if (data) {
        setMessages(prev => [...prev, data as Message]);
      } else {
        fetchMessages();
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert('發送失敗: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUserId) return;
    
    setPendingImage(file);
    setPendingImagePreview(URL.createObjectURL(file));
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingImage = () => {
    setPendingImage(null);
    setPendingImagePreview(null);
  };

  // Group by user
  const userGroups = messages.reduce((acc, msg) => {
    if (!acc[msg.user_id]) acc[msg.user_id] = [];
    acc[msg.user_id].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  const sortedUsers = Object.keys(userGroups).sort((a, b) => {
    const lastMsgA = userGroups[a][userGroups[a].length - 1];
    const lastMsgB = userGroups[b][userGroups[b].length - 1];
    return new Date(lastMsgB.created_at).getTime() - new Date(lastMsgA.created_at).getTime();
  });

  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId);
    const unreadMsgs = messages.filter(m => m.user_id === userId && !m.is_from_admin && !m.read_by_admin);
    if (unreadMsgs.length > 0) {
      // 樂觀更新本地狀態
      setMessages(prev => prev.map(m => 
        (m.user_id === userId && !m.is_from_admin && !m.read_by_admin) 
          ? { ...m, read_by_admin: true } 
          : m
      ));
      // 更新資料庫
      try {
        await supabase
          .from('support_messages')
          .update({ read_by_admin: true })
          .eq('user_id', userId)
          .eq('is_from_admin', false)
          .eq('read_by_admin', false);
      } catch (err) {
        console.error('Failed to mark messages as read:', err);
      }
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-200px)] bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar - User List */}
      {!selectedUserId && (
        <div className="w-full flex flex-col bg-gray-50 h-full">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="font-black text-xl italic tracking-tight">客訴與詢問</h3>
            <p className="text-xs text-gray-500 font-bold mt-1">來自用戶的訊息</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sortedUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-bold flex flex-col items-center">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                目前沒有任何訊息
              </div>
            ) : (
              sortedUsers.map(userId => {
                const msgs = userGroups[userId];
                const lastMsg = msgs[msgs.length - 1];
                const unreadCount = msgs.filter(m => !m.is_from_admin && !m.read_by_admin).length;

                return (
                  <button
                    key={userId}
                    onClick={() => handleSelectUser(userId)}
                    className="w-full text-left p-4 border-b border-gray-100 transition-colors flex gap-3 hover:bg-white active:bg-gray-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0 relative">
                      <UserIcon size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-sm truncate text-gray-900">{profiles[userId]?.full_name || '未命名'}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold shrink-0 ml-2">
                        {new Date(lastMsg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                      {lastMsg.is_from_admin ? '您: ' : ''}{lastMsg.image_url && !lastMsg.content ? '[傳送了一張圖片]' : lastMsg.content}
                    </p>
                  </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      {selectedUserId && (
        <div className="w-full flex flex-col bg-white h-full animate-in slide-in-from-right-8 duration-300">
          {/* Chat Header */}
          <div className="p-4 md:p-6 border-b border-gray-200 flex items-center gap-3 bg-white shadow-sm z-10">
            <button 
              onClick={() => setSelectedUserId(null)}
              className="p-2 -ml-2 mr-1 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-black shrink-0"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
              <UserIcon size={20} />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold truncate text-gray-900">{profiles[selectedUserId]?.full_name || '未命名'}</h4>
              <p className="text-xs text-gray-500 font-bold truncate">{profiles[selectedUserId]?.email || userGroups[selectedUserId][0].user_email}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
            {userGroups[selectedUserId].map(msg => {
              const isAdmin = msg.is_from_admin;
              return (
                <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl flex flex-col ${isAdmin ? 'bg-black text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm shadow-sm'}`}>
                    {msg.image_url && (
                      <img src={msg.image_url} alt="Uploaded" className="rounded-xl mb-2 max-w-full cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.image_url, '_blank')} />
                    )}
                    {msg.content && <p className="whitespace-pre-wrap break-words text-sm font-medium">{msg.content}</p>}
                    <div className={`text-[10px] mt-1 text-right ${isAdmin ? 'text-gray-400' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
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
                className="p-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-50 shrink-0"
                title="上傳圖片"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </button>
              <div className="flex-1 bg-gray-100 rounded-2xl flex items-center min-h-[44px]">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={pendingImagePreview ? "加上文字說明..." : "回覆訊息..."}
                  className="w-full px-4 py-3 bg-transparent border-transparent focus:ring-0 outline-none font-medium text-sm"
                  disabled={isUploading}
                />
              </div>
              <button 
                type="submit" 
                disabled={(!newMessage.trim() && !pendingImage) || isUploading}
                className="px-6 py-3 bg-black text-white rounded-2xl font-black disabled:opacity-50 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shrink-0 h-[44px]"
              >
                {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> <span className="hidden md:inline">發送</span></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
