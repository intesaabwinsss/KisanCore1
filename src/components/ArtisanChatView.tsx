import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Languages, 
  Globe, 
  User, 
  Bot, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { ChatMessage, LanguageCode } from '../types';
import { SAMPLE_CHAT_MESSAGES } from '../data/artisanData';

interface ArtisanChatViewProps {
  currentLanguage: LanguageCode;
  isDarkMode?: boolean;
}

export const ArtisanChatView: React.FC<ArtisanChatViewProps> = ({
  currentLanguage,
  isDarkMode = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [showAutoTranslation, setShowAutoTranslation] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Arjun Prajapati',
      senderRole: 'Artisan',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      text: inputMessage,
      translatedText: `[Auto-Translated to English]: "${inputMessage}"`,
      originalLanguage: currentLanguage,
      timestamp: 'Just now',
      isCurrentUser: true,
    };

    setMessages([...messages, newMsg]);
    setInputMessage('');

    // Simulate instant AI assistant response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        senderName: 'KisanMandi AI',
        senderRole: 'AI Assistant',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
        text: 'Great update! I have notified volunteer Sarah Jenkins and buyer inquiries about your new production batch. Your response time is under 4 minutes!',
        originalLanguage: 'en',
        timestamp: 'Just now',
        isCurrentUser: false,
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1000);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-4 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
              <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100">
              Multilingual Real-Time Chat
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Communicate with international buyers and volunteers in your native language with instant AI translation.
          </p>
        </div>

        {/* Translation Toggle */}
        <button
          onClick={() => setShowAutoTranslation(!showAutoTranslation)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            showAutoTranslation
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>AI Auto-Translate: {showAutoTranslation ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className={`rounded-2xl border p-4 sm:p-6 min-h-[450px] max-h-[550px] overflow-y-auto flex flex-col justify-between space-y-4 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/50 border-slate-200'
      }`}>
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = msg.isCurrentUser;
            const isAI = msg.senderRole === 'AI Assistant';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.avatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover border border-teal-500 shrink-0 mt-0.5"
                />

                <div className={`max-w-md space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                    <span>•</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-teal-600 text-white rounded-tr-xs shadow-2xs'
                      : isAI
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-tl-xs'
                        : isDarkMode
                          ? 'bg-slate-800 text-slate-100 rounded-tl-xs'
                          : 'bg-white text-slate-800 gradient-border-organic border-0 rounded-tl-xs shadow-2xs'
                  }`}>
                    <p>{msg.text}</p>
                    
                    {showAutoTranslation && msg.translatedText && (
                      <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-[11px] opacity-90 italic">
                        {msg.translatedText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Type in your language (Hindi, English, etc)...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={`flex-1 p-3 rounded-xl border text-xs focus:outline-hidden ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>

    </div>
  );
};
