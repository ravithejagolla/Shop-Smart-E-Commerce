import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I am your AI Shopping Assistant.\nWhat are you looking for today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/ask`,
        { message: userMessage }
      );

      const assistantReply = response.data.answer;
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[380px] h-[550px] max-h-[75vh] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-300 border border-slate-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-5 py-4 flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                  <span className="material-symbols-outlined text-white">robot_2</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-indigo-800"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-[16px] leading-tight">AI Assistant</h3>
                <p className="text-indigo-100/80 text-xs font-medium">Online & ready to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="relative z-10 text-indigo-200 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] block">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto bg-slate-50 shadow-inner space-y-5">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-full ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-md">
                        <span className="material-symbols-outlined text-white text-[18px]">smart_toy</span>
                    </div>
                )}
                <div
                  className={`relative px-4 py-3 text-[14px] leading-relaxed break-words max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-md shadow-indigo-600/20"
                      : "bg-white text-slate-700 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100"
                  }`}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 flex-row">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <span className="material-symbols-outlined text-white text-[18px]">smart_toy</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-4 shadow-sm flex items-center gap-1.5 h-[44px]">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-5px_10px_-5px_rgba(0,0,0,0.02)]">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-slate-100 border-transparent focus:bg-white text-slate-800 text-[14px] rounded-full pl-5 pr-14 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white h-10 w-10 flex items-center justify-center rounded-full disabled:bg-slate-300 disabled:text-slate-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:active:scale-100 disabled:shadow-none cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[20px] ml-1 group-disabled:ml-0 transition-all">send</span>
                </button>
              </form>
              <div className="flex justify-center mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[12px] text-indigo-400">bolt</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Answers by Shop Smart AI</span>
                  </div>
              </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 filter z-50 overflow-hidden group cursor-pointer ${
            isOpen ? "bg-slate-800 text-white shadow-slate-800/40 hover:bg-slate-900" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-600/40 hover:shadow-indigo-600/60 hover:-translate-y-1"
        }`}
      >
        <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full origin-center"></span>
        <span className="material-symbols-outlined text-[32px] relative z-10 transition-transform duration-300">
          {isOpen ? "keyboard_arrow_down" : "robot_2"}
        </span>
        {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white"></span>
            </span>
        )}
      </button>
    </div>
  );
}
