import React, { useState, useRef, useEffect } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Minimize2,
} from "lucide-react";

export default function ChatWidget() {
  const { chatOpen, setChatOpen, chatMessages, sendChatMessage } = usePlatform();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, chatOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText("");
  };

  const handleSuggestion = (text) => {
    sendChatMessage(text);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="bg-[#0B3D91] hover:bg-[#07265D] text-white p-3.5 rounded-full shadow-2xl border-2 border-amber-400 flex items-center space-x-2 transition-all transform hover:scale-105 group"
          title="Open Setu Saathi AI Chat"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0B3D91]"></span>
          </div>
          <span className="text-xs font-bold font-serif-gov pr-1 hidden sm:inline text-amber-200">
            Setu Saathi AI
          </span>
        </button>
      )}

      {chatOpen && (
        <div className="bg-white rounded-xl shadow-2xl border-2 border-[#0B3D91] w-[350px] sm:w-[400px] h-[520px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#07265D] text-white p-3.5 flex items-center justify-between border-b-2 border-amber-500">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-[#07265D] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-sm font-serif-gov text-white">Setu Saathi</h3>
                  <span className="text-[9px] bg-amber-400 text-blue-950 font-extrabold px-1.5 py-0.2 rounded">
                    MoSPI AI
                  </span>
                </div>
                <div className="text-[10px] text-gray-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                  <span>Competency & Learning Assistant</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-300 hover:text-white p-1 rounded"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {chatMessages.map((msg, idx) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed shadow-xs ${
                      isBot
                        ? "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                        : "bg-[#0B3D91] text-white rounded-tr-none"
                    }`}
                  >
                    {isBot && (
                      <div className="text-[10px] font-bold text-blue-900 mb-1 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Setu Intelligence</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isBot ? "text-gray-400" : "text-blue-200"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {isBot && msg.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSuggestion(sug)}
                          className="text-[10px] bg-blue-50 hover:bg-blue-100 text-[#0B3D91] border border-blue-200 rounded-full px-2.5 py-1 text-left font-medium transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-gray-100 border-t border-gray-200 flex items-center space-x-1.5 overflow-x-auto text-[10px] text-gray-600">
            <span className="font-bold text-gray-500">Quick:</span>
            <button
              onClick={() => handleSuggestion("Why was this course recommended?")}
              className="bg-white px-2 py-0.5 rounded border text-blue-700 whitespace-nowrap hover:bg-blue-50"
            >
              Why recommended?
            </button>
            <button
              onClick={() => handleSuggestion("What are my critical skill gaps?")}
              className="bg-white px-2 py-0.5 rounded border text-blue-700 whitespace-nowrap hover:bg-blue-50"
            >
              My Gaps
            </button>
            <button
              onClick={() => handleSuggestion("Explain my last quiz mistake")}
              className="bg-white px-2 py-0.5 rounded border text-blue-700 whitespace-nowrap hover:bg-blue-50"
            >
              Quiz Mistake
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about competencies, courses, or MoSPI rules..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#0B3D91] hover:bg-[#07265D] disabled:opacity-40 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
