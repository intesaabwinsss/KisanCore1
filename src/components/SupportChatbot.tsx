import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { MessageCircle, X, Send, Phone, Bot, User, Minimize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const SupportChatbot: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const getInitialGreeting = () => {
    if (language === 'hi') return 'नमस्ते! मैं किसानमित्र AI सहायता बॉट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?';
    if (language === 'mr') return 'नमस्कार! मी किसानमित्र AI सहाय्यक बॉट आहे. आज मी आपल्याला कशी मदत करू शकतो?';
    return 'Hello! I am the KisanMitra AI Support Bot. How can I help you today?';
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getInitialGreeting(),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  // Update initial message if language changes and only initial message is present
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [{ ...prev[0], text: getInitialGreeting() }];
      }
      return prev;
    });
  }, [language]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, language }),
      });

      const data = await response.json();
      
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text || (
          language === 'hi' 
            ? 'क्षमा करें, मुझे कनेक्ट करने में समस्या आ रही है। कृपया थोड़ी देर बाद पुनः प्रयास करें या हमारी सहायता टीम को 1800-123-4567 पर कॉल करें।'
            : language === 'mr'
            ? 'क्षमस्व, कनेक्ट करण्यात अडचण येत आहे. कृपया नंतर पुन्हा प्रयत्न करा किंवा आमच्या 1800-123-4567 हेल्पलाइनवर कॉल करा.'
            : "I'm having trouble connecting right now. Please try again later or call our human support team at 1800-123-4567."
        ),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'hi' 
          ? 'क्षमा करें, एक त्रुटि हुई। तत्काल सहायता के लिए कृपया 1800-123-4567 पर संपर्क करें।'
          : language === 'mr'
          ? 'क्षमस्व, त्रुटी आढळली. तात्काळ मदतीसाठी कृपया 1800-123-4567 वर संपर्क साधा.'
          : "Sorry, I encountered an error. Please contact 1800-123-4567 for immediate assistance.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all hover:-translate-y-1 group cursor-pointer"
        title={language === 'hi' ? 'सहायता एवं समर्थन' : language === 'mr' ? 'मदत आणि सहाय्य' : 'Help & Support'}
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed right-4 sm:right-6 z-50 flex flex-col bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 border border-emerald-200/60 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out ${isMinimized ? 'bottom-6 w-72 h-14' : 'bottom-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh]'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-t-2xl text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-5 h-5 text-emerald-50" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">
              {language === 'hi' ? 'ग्राहक सहायता' : language === 'mr' ? 'ग्राहक सहाय्य' : 'Customer Support'}
            </h3>
            <p className="text-[10px] text-emerald-100/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {language === 'hi' ? 'ऑनलाइन (AI सहायक)' : language === 'mr' ? 'ऑनलाइन (AI सहाय्यक)' : 'Online (AI Assistant)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            title={isMinimized ? (language === 'hi' ? 'विस्तार करें' : language === 'mr' ? 'विस्तार करा' : 'Expand') : (language === 'hi' ? 'छोटा करें' : language === 'mr' ? 'लहान करा' : 'Minimize')}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            title={language === 'hi' ? 'बंद करें' : language === 'mr' ? 'बंद करा' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Toll Free Banner */}
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-center gap-2">
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-xs font-semibold text-amber-800">
              {language === 'hi' ? 'टोल-फ्री सहायता: 1800-123-4567' : language === 'mr' ? 'टोल-फ्री मदत: 1800-123-4567' : 'Toll-Free Help: 1800-123-4567'}
            </span>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-slate-200' : 'bg-emerald-100'}`}>
                  {msg.sender === 'user' ? (
                    <User className="w-3.5 h-3.5 text-slate-600" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-sm chat-markdown-user' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm chat-markdown'
                }`}>
                  <div className="markdown-body prose prose-sm prose-emerald leading-relaxed">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-6 h-6 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center mt-1">
                  <Bot className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-1.5 shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={language === 'hi' ? 'अपना संदेश लिखें...' : language === 'mr' ? 'आपला संदेश लिहा...' : 'Type your message...'}
                className="w-full pl-4 pr-12 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 rounded-xl text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-1.5 p-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-400">
                {language === 'hi' ? 'किसानमित्र AI द्वारा संचालित' : language === 'mr' ? 'किसानमित्र AI द्वारा समर्थित' : 'Powered by KisanMitra AI'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
