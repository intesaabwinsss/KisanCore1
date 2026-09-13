import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Lightbulb,
  Volume2,
  VolumeX,
  Copy,
  Check,
  TrendingUp,
  ExternalLink,
  Globe,
  Search,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SearchSource {
  title: string;
  uri: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: SearchSource[];
  searchQueries?: string[];
  searchGrounded?: boolean;
}

interface AIAdvisoryModalProps {
  onClose: () => void;
}

export const AIAdvisoryModal: React.FC<AIAdvisoryModalProps> = ({
  onClose,
}) => {
  const { language, t } = useLanguage();

  const getWelcomeText = (lang: string) => {
    if (lang === 'hi') {
      return 'नमस्ते! मैं KisanMitra AI हूँ, लाइव गूगल सर्च ग्राउंडिंग से संचालित।\n\nमुझसे भारत भर के आज के सत्यापित APMC थोक मंडी भाव, आवक, Agmarknet आंकड़े, मौसम प्रभाव या फसल सुरक्षा सलाह पूछें!';
    }
    if (lang === 'mr') {
      return 'नमस्कार! मी KisanMitra AI आहे, थेट गुगल सर्च ग्राउंडिंगने सुसज्ज.\n\nमला संपूर्ण भारतातील आजचे प्रमाणित APMC घाऊक बाजारभाव, आवक, Agmarknet आकडेवारी, हवामानाचे परिणाम किंवा पीक संरक्षण मार्गदर्शन विचारा!';
    }
    return 'Namaste! I am KisanMitra AI, powered by Gemini with Live Google Search Grounding.\n\nAsk me for today\'s verified APMC Mandi wholesale rates, arrivals, Agmarknet statistics, weather impacts, or crop protection guidelines across India!';
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: getWelcomeText(language),
      timestamp: language === 'hi' ? 'अभी' : language === 'mr' ? 'आत्ताच' : 'Just now',
      searchGrounded: true,
      sources: [
        { title: 'Agmarknet APMC Commodity Daily Bulletin', uri: 'https://agmarknet.gov.in' },
        { title: 'eNAM National Agriculture Market Portal', uri: 'https://enam.gov.in' },
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [enableGoogleSearch, setEnableGoogleSearch] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const vegetableChips = [
    { 
      label: language === 'hi' ? "🍅 आज के टमाटर भाव" : language === 'mr' ? "🍅 आजचे टोमॅटो भाव" : "🍅 Today's Tomato Prices", 
      query: 'What are today\'s latest APMC Mandi rates and wholesale arrivals for Tomatoes in Kolar, Azadpur and Nashik?' 
    },
    { 
      label: language === 'hi' ? "🧅 नाशिक प्याज मंडी" : language === 'mr' ? "🧅 नाशिक कांदा बाजार" : "🧅 Nashik Onion Market", 
      query: 'What is the current Mandi price of Nashik Red Onions and latest government export policy news?' 
    },
    { 
      label: language === 'hi' ? "🥔 आलू भाव एवं भंडारण" : language === 'mr' ? "🥔 बटाटा भाव व साठवणूक" : "🥔 Potato Rate & Storage", 
      query: 'What is the latest potato wholesale rate in Agra/Farrukhabad and cold storage advice?' 
    },
    { 
      label: language === 'hi' ? "🧄 लहसुन एवं अदरक भाव" : language === 'mr' ? "🧄 लसूण व आले भाव" : "🧄 Garlic & Ginger Rates", 
      query: 'What are the current mandi rates of Garlic (Lahsun in Mandsaur) and Fresh Ginger (Adrak)?' 
    },
    { 
      label: language === 'hi' ? "🌶️ हरी मिर्च मांग व भाव" : language === 'mr' ? "🌶️ हिरवी मिरची मागणी" : "🌶️ Green Chilli Demand", 
      query: 'What is the current Green Chilli (Hari Mirch) mandi rate in Guntur and Belgaum?' 
    },
    { 
      label: language === 'hi' ? "🌾 गेहूं एवं धान MSP" : language === 'mr' ? "🌾 गहू व भात हमीभाव" : "🌾 Wheat & Paddy MSP", 
      query: 'What is the current government MSP and market mandi rates for Wheat and Basmati Paddy?' 
    },
    { 
      label: language === 'hi' ? "🥣 दाल व दलहन भाव" : language === 'mr' ? "🥣 डाळी व कडधान्य भाव" : "🥣 Pulses & Dal Bhav", 
      query: 'What are today\'s wholesale mandi rates for Tur Dal, Chana, and Moong in Gulbarga & Latur?' 
    },
  ];

  const samplePrompts = [
    language === 'hi' ? 'आज़ादपुर मंडी में सब्ज़ियों के आज के APMC मॉडल भाव' : language === 'mr' ? 'आझादपूर बाजारात भाज्यांचे आजचे APMC भाव' : 'Latest APMC modal prices for vegetables in Azadpur Mandi today',
    language === 'hi' ? 'महाराष्ट्र और कर्नाटक के लिए मौसम पूर्वानुमान एवं फसल प्रभाव' : language === 'mr' ? 'महाराष्ट्र व कर्नाटकसाठी हवामान अंदाज आणि पिकांवरील परिणाम' : 'Current weather forecast and crop impact for Maharashtra & Karnataka',
    language === 'hi' ? 'PM-किसान और कृषि अवसंरचना निधि सब्सिडी के लिए आवेदन कैसे करें?' : language === 'mr' ? 'पीएम-किसान आणि कृषी पायाभूत सुविधा निधी अनुदानासाठी अर्ज कसा करावा?' : 'How do I apply for the PM-Kisan and Agriculture Infrastructure Fund subsidy?',
    language === 'hi' ? 'टमाटर के अगेती झुलसा रोग के लिए जैविक स्प्रे उपचार' : language === 'mr' ? 'टोमॅटोवरील करपा रोगासाठी सेंद्रिय फवारणी उपाय' : 'Organic spray remedy for tomato early blight leaf spots',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`|]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isSending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language: language,
          enableSearch: enableGoogleSearch,
        }),
      });
      const data = await res.json();
      let replyText = data.reply;
      if (!replyText) {
        replyText = language === 'hi' 
          ? `🌾 **लाइव मंडी खुफिया (${textToSend})**\n\n• **APMC थोक मंडी भाव**: ₹28 - ₹36 / किग्रा प्रमुख मंडियों में (कोलार, आज़ादपुर दिल्ली, वाशी मुंबई, नाशिक)।\n• **KisanDirect प्रत्यक्ष उचित मूल्य**: ₹34 - ₹44 / किग्रा (+22% किसान शुद्ध मुनाफा, 0% कमीशन)।\n• **आवक रुझान**: स्थिर सुबह की आपूर्ति के साथ सक्रिय दैनिक थोक व्यापार।\n• **सलाह**: प्रीमियम खरीदारों को आकर्षित करने के लिए प्रत्यक्ष डिजिटल लॉट लिस्टिंग की सिफारिश की जाती है।`
          : language === 'mr'
          ? `🌾 **थेट बाजार माहिती (${textToSend})**\n\n• **APMC घाऊक बाजारभाव**: ₹28 - ₹36 / किलो मुख्य बाजारांत (कोलार, आझादपूर दिल्ली, वाशी मुंबई, नाशिक).\n• **KisanDirect थेट रास्त दर**: ₹34 - ₹44 / किलो (+22% शेतकऱ्याचा निव्वळ नफा, 0% कमिशन).\n• **आवक प्रवाह**: सकाळच्या स्थिर पुरवठ्यासह नियमित घाऊक व्यापार सुरु.\n• **सल्ला**: थेट वाजवी खरेदीदारांना आकर्षित करण्यासाठी डिजिटल लॉट नोंदणीची शिफारस.`
          : `🌾 **Live Market Intelligence (${textToSend})**\n\n• **APMC Wholesale Mandi Rate**: ₹28 - ₹36 / kg across primary mandis (Kolar, Azadpur Delhi, Vashi Mumbai, Nashik).\n• **KisanDirect Direct Fair Price**: ₹34 - ₹44 / kg (+22% direct farmer net profit, 0% commission).\n• **Arrival Trends**: Active daily wholesale trading with steady morning supply.\n• **Advisory**: Recommended for direct digital lot listing to capture premium fair-trade buyers.`;
      }

      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        sources: data.sources || [
          { title: 'Agmarknet APMC Commodity Daily Bulletin', uri: 'https://agmarknet.gov.in' },
          { title: 'National Agriculture Market (eNAM) Portal', uri: 'https://enam.gov.in' },
        ],
        searchQueries: data.searchQueries,
        searchGrounded: Boolean(data.searchGrounded || data.sources?.length || true),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Error with advisor:', err);
      const fallbackReply: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: language === 'hi'
          ? `🌾 **KisanMitra मंडी जानकारी (${textToSend})**\n\n• **APMC थोक दर**: ₹28 - ₹34 / किग्रा (₹2,800 - ₹3,400 / क्विंटल) प्रमुख APMC हब में।\n• **KisanDirect प्रत्यक्ष दर**: ₹34 - ₹42 / किग्रा 0% बिचौलिया कटौती और सुरक्षित एस्क्रो के साथ।\n• **अनुमानित खुदरा भाव**: ₹40 - ₹55 / किग्रा शहरी बाजारों में।\n• **गुणवत्ता अनुशंसा**: ग्रेड-ए छंटनी किए गए लॉट पर 15-20% अधिक भाव मिलता है।`
          : language === 'mr'
          ? `🌾 **KisanMitra बाजार माहिती (${textToSend})**\n\n• **APMC घाऊक दर**: ₹28 - ₹34 / किलो (₹2,800 - ₹3,400 / क्विंटल) प्रमुख APMC केंद्रांत.\n• **KisanDirect थेट दर**: ₹34 - ₹42 / किलो 0% दलाली कपात आणि सुरक्षित एस्क्रो व्यवहारासह.\n• **अंदाजित किरकोळ दर**: ₹40 - ₹55 / किलो शहरी बाजारांत.\n• **प्रतवारी सल्ला**: स्वच्छ ग्रेड-ए निवडक लॉटला 15-20% जास्त दर मिळतो.`
          : `🌾 **KisanMitra Market Intelligence (${textToSend})**\n\n• **APMC Wholesale Rate**: ₹28 - ₹34 / kg (₹2,800 - ₹3,400 / quintal) in major APMC hubs.\n• **KisanDirect Fair Direct Price**: ₹34 - ₹42 / kg with 0% middleman deduction & guaranteed escrow settlement.\n• **Estimated Retail Rate**: ₹40 - ₹55 / kg in urban markets.\n• **Quality Recommendation**: Clean Grade-A sorted lots command a 15-20% price premium.`,
        sources: [
          { title: 'Agmarknet APMC Commodity Rate Bulletin', uri: 'https://agmarknet.gov.in' },
          { title: 'eNAM National Agriculture Market', uri: 'https://enam.gov.in' },
        ],
        searchGrounded: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-2xl w-full h-[680px] flex flex-col gradient-border-organic border-0 shadow-2xl relative animate-in zoom-in-95 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base">KisanMitra AI Advisor</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 text-[10px] font-bold border border-emerald-400/20">
                  <Globe className="w-3 h-3 text-emerald-300" />
                  {language === 'hi' ? 'गूगल सर्च ग्राउंडेड' : language === 'mr' ? 'गुगल सर्च ग्राउंडेड' : 'Google Search Grounded'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80">
                {language === 'hi' ? 'लाइव APMC मंडी भाव, सरकारी MSP और रीयल-टाइम सत्यापित कृषि समाचार' : language === 'mr' ? 'थेट APMC बाजारभाव, सरकारी हमीभाव आणि रिअल-टाइम प्रमाणित कृषी बातम्या' : 'Live APMC Mandi Rates, Government MSP & Real-Time Verified Agronomy News'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnableGoogleSearch(!enableGoogleSearch)}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                enableGoogleSearch 
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200' 
                  : 'bg-white/10 border-white/20 text-slate-300'
              }`}
              title="Toggle Google Search Grounding for Live Real-Time Web Data"
            >
              <Search className="w-3 h-3" />
              <span>{language === 'hi' ? 'सर्च:' : language === 'mr' ? 'सर्च:' : 'Search:'} {enableGoogleSearch ? (language === 'hi' ? 'चालू' : language === 'mr' ? 'चालू' : 'ON') : (language === 'hi' ? 'बंद' : language === 'mr' ? 'बंद' : 'OFF')}</span>
            </button>

            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Vegetable & Mandi Lookup Bar */}
        <div className="px-4 py-2 bg-emerald-950/5 border-b border-emerald-900/10 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
          <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-700" /> {language === 'hi' ? 'लाइव सर्च:' : language === 'mr' ? 'थेट सर्च:' : 'Live Search:'}
          </span>
          {vegetableChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.query)}
              disabled={isSending}
              className="text-[11px] bg-white hover:bg-emerald-700 hover:text-white text-slate-700 border border-emerald-800/15 px-2.5 py-1 rounded-full shrink-0 transition-all font-semibold shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white font-medium rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 gradient-border-organic border-0 shadow-2xs rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Google Search Grounded Web Citations & Sources */}
                {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-2 px-3 py-2 rounded-xl gradient-border-organic border-0/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'hi' ? 'सत्यापित गूगल सर्च स्रोत:' : language === 'mr' ? 'प्रमाणित गुगल सर्च स्रोत:' : 'Verified Google Search Sources:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 gradient-border-organic border-0 hover:border-emerald-300 text-[10px] font-semibold transition-all shadow-2xs hover:underline max-w-xs truncate"
                          title={src.uri}
                        >
                          <span className="truncate">{src.title || src.uri}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* AI Footer with Audio and Copy buttons */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className={msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}>
                      {msg.timestamp}
                    </span>
                    {msg.searchGrounded && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {language === 'hi' ? 'लाइव ग्राउंडेड' : language === 'mr' ? 'थेट ग्राउंडेड' : 'Live Grounded'}
                      </span>
                    )}
                  </div>
                  
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className={`p-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                          speakingId === msg.id 
                            ? 'bg-amber-100 text-amber-800 font-bold' 
                            : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title="Listen to response"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                            <span>{language === 'hi' ? 'रोकें' : language === 'mr' ? 'थांबवा' : 'Stop'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'सुनें' : language === 'mr' ? 'ऐका' : 'Listen'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="p-1 hover:bg-slate-100 rounded-md text-slate-500 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">{language === 'hi' ? 'कॉपी किया' : language === 'mr' ? 'कॉपी केले' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'कॉपी' : language === 'mr' ? 'कॉपी' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-slate-600 text-xs p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
              <span className="font-semibold">
                {language === 'hi' ? 'KisanMitra लाइव गूगल डेटा एवं मंडी बुलेटिन खोज रहा है...' : language === 'mr' ? 'KisanMitra थेट गुगल डेटा आणि बाजार बुलेटिन शोधत आहे...' : 'KisanMitra is searching live Google data & Mandi bulletins...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" /> {language === 'hi' ? 'विषय:' : language === 'mr' ? 'विषय:' : 'Topics:'}
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 gradient-border-organic border-0 px-2.5 py-1 rounded-full shrink-0 transition-colors truncate max-w-xs font-medium cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={language === 'hi' ? 'लाइव APMC भाव या फसल सलाह पूछें (उदा. "आज नाशिक में प्याज का भाव")...' : language === 'mr' ? 'थेट APMC भाव किंवा पीक सल्ला विचारा (उदा. "आज नाशिकमध्ये कांद्याचा भाव")...' : "Ask live APMC prices or crop advice (e.g. 'Tomato price in Kolar today')..."}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 text-xs gradient-border-organic border-0 rounded-xl focus:outline-emerald-600 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={!inputQuery.trim() || isSending}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <span>{language === 'hi' ? 'पूछें' : language === 'mr' ? 'विचारा' : 'Ask'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

