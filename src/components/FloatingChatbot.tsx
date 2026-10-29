import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, Phone, Sparkles,
  ExternalLink, ChevronRight, RotateCcw,
  Globe, Check
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Language } from '../i18n/translations';
import { DemaqLogo } from './DemaqLogo';
import { useApp } from '../context/AppContext';
import { getExtensiveChatbotReply, ChatActionChip } from '../lib/chatbotEngine';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionChips?: ChatActionChip[];
}

interface FloatingChatbotProps {
  config: SiteConfig;
}

const SUPPORTED_LANGS: Array<{ code: Language | 'ar'; label: string; flag: string }> = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'am', label: 'አማ', flag: '🇪🇹' },
  { code: 'om', label: 'ORO', flag: '🌳' },
  { code: 'ti', label: 'ትግ', flag: '🇪🇹' },
  { code: 'so', label: 'SO', flag: '🇸🇴' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' }
];

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ config }) => {
  const { language, setLanguage, theme, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<string>(language || 'en');
  const isLight = theme === 'light';

  // Keep activeLang in sync with app language if app language changes
  useEffect(() => {
    setActiveLang(language);
  }, [language]);

  const getGreeting = (lang: string) => {
    if (lang === 'am') {
      return "ሰላም! እንኳን ወደ DemaQ Digital Solution በደህና መጡ። የስክሪን ስፋት (ለምሳሌ፡ '4x3 ሜትር') ወይም የቴክኒክ ጥያቄ ይጻፉልኝ።";
    }
    if (lang === 'om') {
      return "Akkam! Baga nagaan gara DemaQ Digital Solution dhuftan. Bal'ina iskiriinii (fakkeenyaaf '4x3m') ykn gaaffii teeknikaa na gaafadhaa.";
    }
    if (lang === 'ti') {
      return "ሰላም! ናብ DemaQ Digital Solution ብደሓን መጻእኩም። ስፍሓት ስክሪን (ንኣብነት '4x3m') ወይ ዝኾነ ናይ ቴክኒክ ሕቶ ሕተቱ።";
    }
    if (lang === 'so') {
      return "Ku soo dhowow DemaQ. Fadlan qor cabbirka shaashadda (tusaale '4x3m') si aan kuugu xisaabiyo.";
    }
    if (lang === 'ar') {
      return "مرحباً بك في ديماك (DemaQ Digital Solution) في أديس أبابا. اكتب أبعاد الشاشة (مثال: '4x3m') أو اسأل عن أي تفاصيل تقنية.";
    }
    return "ሰላም! Welcome to DemaQ Digital Solution in Addis Ababa. Enter screen dimensions (e.g. '4x3m') for instant engineering specs, or ask any technical question.";
  };

  const getInitialChips = (lang: string): ChatActionChip[] => {
    if (lang === 'am') {
      return [
        { label: '📐 የ 4x3m ስክሪን አስላ', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ የቤተክርስቲያን ስክሪን', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: '⚡ የኤሌክትሪክና ጀነሬተር ስሌት', actionType: 'prompt', target: 'Power and generator sizing' },
        { label: '⚙️ ኖቫስታር VS ሁይዱ', actionType: 'prompt', target: 'NovaStar vs Huidu' },
        { label: '📱 በፍላሽና በዋይፋይ ማጫወት', actionType: 'prompt', target: 'USB and Wi-Fi playback' },
        { label: '🔧 ጥቁር ሞጁል ጥገና', actionType: 'prompt', target: 'Troubleshoot dark module' },
        { label: `WhatsApp: ${config.phone}`, actionType: 'external', target: config.whatsappUrl }
      ];
    }
    if (lang === 'om') {
      return [
        { label: '📐 Iskiriinii 4x3m shallagaa', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ Mana Sagadaa', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: '⚡ Humna Elektiriikii', actionType: 'prompt', target: 'Power and generator sizing' },
        { label: 'AR Kaameraa', actionType: 'navigate', target: 'ar-visualizer' },
        { label: `WhatsApp: ${config.phone}`, actionType: 'external', target: config.whatsappUrl }
      ];
    }
    if (lang === 'ti') {
      return [
        { label: '📐 ስፍሓት 4x3m ጸብጽብ', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ ናይ ቤተክርስቲያን ስክሪን', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: '⚡ ሓይሊ ኤሌክትሪክ', actionType: 'prompt', target: 'Power and generator sizing' },
        { label: `WhatsApp: ${config.phone}`, actionType: 'external', target: config.whatsappUrl }
      ];
    }
    if (lang === 'so') {
      return [
        { label: '📐 Xisaabi 4x3m', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ Shaashadda Kaniisadda', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: '⚡ Korontada & Jeneraalka', actionType: 'prompt', target: 'Power and generator sizing' },
        { label: `WhatsApp: ${config.phone}`, actionType: 'external', target: config.whatsappUrl }
      ];
    }
    return [
      { label: '📐 Calculate 4×3m Wall', actionType: 'prompt', target: 'Calculate 4x3m wall' },
      { label: '⛪ Church Sanctuary Screen', actionType: 'prompt', target: 'Church Sanctuary Screen' },
      { label: '⚡ Power & Generator Sizing', actionType: 'prompt', target: 'Power and generator sizing' },
      { label: '⚙️ NovaStar vs Huidu', actionType: 'prompt', target: 'NovaStar vs Huidu' },
      { label: '📱 USB & Wi-Fi Playback', actionType: 'prompt', target: 'USB and Wi-Fi playback' },
      { label: '🔧 Troubleshoot Dark Module', actionType: 'prompt', target: 'Troubleshoot dark module' },
      { label: `Direct Line: ${config.phone}`, actionType: 'external', target: config.whatsappUrl }
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: getGreeting(activeLang),
      timestamp: 'Just now',
      actionChips: getInitialChips(activeLang)
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLanguageSwitch = (newLang: string) => {
    setActiveLang(newLang);
    if (['en', 'am', 'om', 'ti', 'so'].includes(newLang)) {
      setLanguage(newLang as Language);
    }
    // Update initial greeting message if it's the only one
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [{
          id: 'm1',
          sender: 'bot',
          text: getGreeting(newLang),
          timestamp: 'Just now',
          actionChips: getInitialChips(newLang)
        }];
      }
      return [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'bot',
          text: `🌐 Switched language to ${newLang.toUpperCase()}. ${getGreeting(newLang)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionChips: getInitialChips(newLang)
        }
      ];
    });
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `m-reset-${Date.now()}`,
        sender: 'bot',
        text: getGreeting(activeLang),
        timestamp: 'Just now',
        actionChips: getInitialChips(activeLang)
      }
    ]);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleChipClick = (chip: ChatActionChip) => {
    if (chip.actionType === 'prompt') {
      handleSend(chip.target);
    } else if (chip.actionType === 'external') {
      window.open(chip.target, '_blank');
    } else if (chip.actionType === 'navigate') {
      const el = document.getElementById(chip.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let botResponseText = '';
    let chips: ChatActionChip[] | undefined = undefined;

    // Call server proxy route `/api/chat`
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: activeLang,
          conversationHistory: messages.slice(-6)
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply && typeof data.reply === 'string' && data.reply.trim().length > 0) {
          botResponseText = data.reply;
        }
        if (Array.isArray(data.chips) && data.chips.length > 0) {
          chips = data.chips;
        }
      }
    } catch {
      // Handled silently by fallback
    }

    // High-fidelity trained engineering fallback
    if (!botResponseText) {
      const engineRes = getExtensiveChatbotReply(userText, activeLang);
      botResponseText = engineRes.reply;
      chips = engineRes.chips;
    }

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionChips: chips
      }
    ]);
  };

  // Multilingual quick prompt suggestions
  const getQuickPrompts = () => {
    if (activeLang === 'am') {
      return [
        'የ 4x3m ስክሪን አስላ',
        'የኤሌክትሪክና ጀነሬተር ፍጆታ',
        'የቤተክርስቲያን ስክሪን',
        'ኖቫስታር VS ሁይዱ',
        'በፍላሽና ስልክ ማጫወት',
        'ጥቁር ሞጁል ጥገና',
        'የ 6x4m የውጭ ስክሪን',
        'ዋጋና ፕሮፎርማ'
      ];
    }
    if (activeLang === 'om') {
      return [
        'Iskiriinii 4x3m shallagaa',
        'Humna Elektiriikii',
        'Mana Sagadaa',
        'NovaStar vs Huidu',
        'USB fi Wi-Fi',
        'Suphaa Modiyulii',
        'Proforma gaafadhaa'
      ];
    }
    if (activeLang === 'ti') {
      return [
        'ስፍሓት 4x3m ጸብጽብ',
        'ሓይሊ ኤሌክትሪክ',
        'ናይ ቤተክርስቲያን ስክሪን',
        'NovaStar vs Huidu',
        'ጽገና ሞጁላት'
      ];
    }
    if (activeLang === 'so') {
      return [
        'Xisaabi 4x3m',
        'Korontada & Jeneraalka',
        'Shaashadda Kaniisadda',
        'NovaStar vs Huidu',
        'Dayactirka Module-ka'
      ];
    }
    if (activeLang === 'ar') {
      return [
        'حساب شاشة 4×3 م',
        'استهلاك الكهرباء والمولدات',
        'شاشات الكنائس والقاعات',
        'مقارنة NovaStar و Huidu',
        'صيانة اللوحات والشاشات'
      ];
    }
    return [
      'Calculate 4x3m wall',
      'Power & Generator sizing',
      'Church Sanctuary Screen',
      'NovaStar vs Huidu',
      'USB & Wi-Fi Playback',
      'Troubleshoot dark module',
      'Calculate 6x4m outdoor',
      'Request Proforma'
    ];
  };

  // Format message text with crisp rendering
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-cyan-600 dark:text-cyan-400">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      const isBullet = line.trim().startsWith('•');
      const isHeader = line.includes('📐') || line.includes('⚡') || line.includes('⛪') || line.includes('⚙️') || line.includes('📱') || line.includes('🔍') || line.includes('☀️') || line.includes('🔧') || line.includes('📍') || line.includes('🛡️') || line.includes('📄');

      return (
        <div
          key={idx}
          className={`${isBullet ? 'pl-2 text-[11px] leading-relaxed my-0.5' : isHeader ? 'font-semibold text-xs mb-1' : 'text-xs leading-relaxed'}`}
        >
          {renderedLine}
        </div>
      );
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-0 bg-transparent border-0 cursor-pointer focus:outline-none"
          aria-label="Open DemaQ Engineering Assistant"
        >
          {/* Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 opacity-70 blur-sm group-hover:opacity-100 animate-pulse transition-opacity" />

          {/* Button Surface */}
          <div
            className={`relative flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-2xl transition-all duration-200 transform group-hover:scale-105 ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-slate-950 border-cyan-500/50 text-white'
            }`}
          >
            {/* Logo Icon */}
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <DemaqLogo size="sm" showText={false} theme={theme} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
            </div>

            <div className="text-left hidden sm:block pr-1">
              <div className="text-xs font-bold font-display flex items-center gap-1.5 leading-tight">
                <span>Demaq Bot</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
                  LIVE
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-tight">
                Ask specs, calc & quotes
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed inset-x-3 bottom-3 sm:static sm:w-[420px] h-[580px] max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 shadow-slate-400/50'
              : 'bg-slate-950 border-slate-800 text-slate-100 shadow-cyan-950/50'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-2.5 border-b flex items-center justify-between shrink-0 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DemaqLogo size="sm" showText={false} theme={theme} />
              <div>
                <div className="text-xs font-bold font-display flex items-center gap-1.5">
                  <span>{t.chatbot?.title || 'Demaq Engineering Assistant'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Ethiopia · Hardware Trained Engine
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 ${
                  isLight ? 'hover:bg-slate-200' : 'hover:bg-slate-800'
                }`}
                title="Reset Conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <a
                href={config.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1.5 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400 ${
                  isLight ? 'hover:bg-slate-200' : 'hover:bg-slate-800'
                }`}
                title="Direct WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'
                }`}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multilingual Selector Strip */}
          <div
            className={`px-3 py-1.5 border-b flex items-center justify-between gap-1 text-[11px] shrink-0 ${
              isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-500" />
              LANG:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {SUPPORTED_LANGS.map((lang) => {
                const isSelected = activeLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSwitch(lang.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold shadow-xs'
                        : isLight
                        ? 'bg-white text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang.flag} {lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            className={`flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs ${
              isLight ? 'bg-slate-100/50' : 'bg-slate-950/80'
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white font-medium rounded-br-xs shadow-sm'
                      : isLight
                      ? 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>

                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Quick Action Chips */}
                {msg.actionChips && msg.actionChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[96%]">
                    {msg.actionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChipClick(chip)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-left ${
                          chip.actionType === 'prompt'
                            ? isLight
                              ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-900 shadow-xs'
                              : 'bg-cyan-950/50 hover:bg-cyan-900/60 border-cyan-800 text-cyan-300'
                            : isLight
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                            : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{chip.label}</span>
                        {chip.actionType === 'external' ? (
                          <ExternalLink className="w-2.5 h-2.5 opacity-70 shrink-0" />
                        ) : chip.actionType === 'prompt' ? (
                          <Send className="w-2.5 h-2.5 opacity-70 shrink-0 text-cyan-500" />
                        ) : (
                          <ChevronRight className="w-2.5 h-2.5 opacity-70 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 italic font-mono text-[11px] py-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span>Engineering calculation in progress...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div
            className={`px-3 py-1.5 border-t overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800/80'
            }`}
          >
            {getQuickPrompts().map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-md border font-mono transition-colors cursor-pointer shrink-0 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div
            className={`p-3 border-t shrink-0 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeLang === 'am'
                    ? "ስፋት (ለምሳሌ 4x3 ሜትር) ወይም ማንኛውንም ጥያቄ ይጻፉ..."
                    : activeLang === 'om'
                    ? "Bal'ina (fakkeenyaaf 4x3m) ykn gaaffii barreessaa..."
                    : activeLang === 'ti'
                    ? "ስፍሓት (ንኣብነት 4x3m) ወይ ሕቶ ጸሓፉ..."
                    : activeLang === 'so'
                    ? "Qor cabbirka (tusaale 4x3m) ama weydiin..."
                    : activeLang === 'ar'
                    ? "اكتب الأبعاد (مثال: 4x3m) أو أي سؤال..."
                    : "Ask specs, dimensions (e.g. 4x3m), or power sizing..."
                }
                className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-cyan-500 placeholder-slate-400'
                    : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500 placeholder-slate-500'
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
