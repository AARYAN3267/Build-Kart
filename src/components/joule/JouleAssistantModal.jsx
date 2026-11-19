import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  CornerDownLeft
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { jouleService } from '../../services/jouleService';
import { formatCurrency } from '../../utils/formatters';
import { AgentActivityPanel } from './AgentActivityPanel';

export const JouleAssistantModal = ({ isOpen, onClose }) => {
  const { products, vendors, orders, addToCart, triggerVendorFailure } = useAppData();
  const { role, currentUser } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'joule',
      text: role === 'vendor'
        ? `Hello ${currentUser?.name || 'Partner'}, I am Joule, your AI Supply Chain Assistant. I continuously monitor your inventory velocity, pending orders, and heavy logistics turnaround.`
        : `Hello ${currentUser?.name || 'there'}! I am Joule, your AI Construction Material Assistant. Ask me to compare Bhopal vendor prices, find guaranteed 24-hour jobsite delivery, or solve stock shortages.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: []
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested Prompts based on Role
  const clientSuggestedPrompts = [
    "I need 50 bags of cement near MP Nagar.",
    "Find the cheapest electrical wire.",
    "Which vendor can deliver steel rods within 24 hours?",
    "Compare cement prices from nearby shops.",
    "Track my current order."
  ];

  const vendorSuggestedPrompts = [
    "Which products have low stock?",
    "Show my pending orders.",
    "Which products sell the most?",
    "Suggest pricing improvements."
  ];

  const currentSuggestedPrompts = role === 'vendor' ? vendorSuggestedPrompts : clientSuggestedPrompts;

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isProcessing) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    try {
      let response;
      if (role === 'vendor') {
        response = await jouleService.processVendorQuery(text, {
          products,
          orders,
          vendorId: currentUser?.id || '3267'
        });
      } else {
        response = await jouleService.processCustomerQuery(text, {
          products,
          vendors,
          orders
        });
      }

      const botMsg = {
        id: `joule-${Date.now()}`,
        sender: 'joule',
        text: response.reply,
        suggestedProducts: response.suggestedProducts,
        orders: response.orders,
        items: response.items,
        quickActions: response.quickActions || [],
        agentNotes: response.agentNotes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#102A43] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">Joule AI Assistant</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Autonomous Supply Chain Optimization & Material Advisory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAgentPanel(!showAgentPanel)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                showAgentPanel
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">Agent Mesh</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area with Optional Agent Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Messages Stream */}
          <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Interactive Suggested Product Cards */}
                      {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                            Recommended Available Commodities
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.suggestedProducts.map((p) => (
                              <div
                                key={p.id}
                                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-blue-400 transition"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-xs text-[#102A43] truncate">{p.name}</h4>
                                    <p className="text-[11px] text-slate-500">
                                      {p.vendorName} • {p.availableQuantity} in stock
                                    </p>
                                    <span className="text-xs font-extrabold text-blue-700">
                                      {formatCurrency(p.discountPrice)}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    addToCart(p, 1);
                                    alert(`Added 1 unit of ${p.name} to cart.`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex-shrink-0 flex items-center gap-1"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Agent Telemetry Footnote */}
                      {msg.agentNotes && (
                        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span>{msg.agentNotes}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Joule Agents querying shared inventory graph...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="p-3 bg-white border-t border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Suggested Prompts
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {currentSuggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 whitespace-nowrap border border-slate-200 transition text-xs font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={
                    role === 'vendor'
                      ? "Ask Joule about inventory, pending orders, or dispatch..."
                      : "Ask Joule: 'Find 50 bags of cement near MP Nagar'..."
                  }
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isProcessing}
                  className="p-3 bg-[#102A43] hover:bg-blue-700 text-white rounded-2xl disabled:opacity-50 transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Agent Mesh Activity (Desktop / Toggle) */}
          {showAgentPanel && (
            <div className="w-80 border-l border-slate-200 bg-slate-50 p-4 overflow-y-auto hidden md:block">
              <AgentActivityPanel compact={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
