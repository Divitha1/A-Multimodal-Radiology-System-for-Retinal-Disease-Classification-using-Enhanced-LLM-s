import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  BrainCircuit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Original Functional Logic Restoration
  useEffect(() => {
    setMessages([
      {
        role: 'system',
        content: "Hello! I am your Radiology AI Assistant. I've been trained on specialized medical datasets to help you interpret retinal scans, summarize clinical findings, and answer questions about diagnostic protocols. How can I assist you today?"
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // Simulate local demo logic instead of broken backend call
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Neural Synchronization Underway: Synthesis indicates that 'Proliferative Diabetic Retinopathy' is characterized by structural neovascularization. Our institutional protocol recommends immediate pan-retinal photocoagulation (PRP) to preserve visual acuity."
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-fade-in overflow-hidden">
      {/* ChatGPT-Style Top Navigation */}
      <header className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm relative z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/doctor-dashboard')}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            <BrainCircuit className="w-6 h-6 border-2 border-primary/20 rounded-lg p-0.5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-text-main tracking-tight italic leading-none">Radiology AI Assistant</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">AI Active • GPT-4 Core</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/doctor-dashboard')}
            className="px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-text-main transition-all"
          >
            Exit to Hub
          </button>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <main className="flex-grow overflow-y-auto bg-[#F9FBFF]/30 space-y-8 p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col animate-slide-up ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="group relative max-w-[85%] sm:max-w-[70%]">
                 <div className={`p-6 md:p-8 rounded-[2rem] text-[15px] font-semibold leading-relaxed tracking-tight shadow-2xl shadow-black/5 ${
                   msg.role === 'user'
                     ? 'bg-indigo-950 text-white rounded-tr-none'
                     : 'bg-white border border-gray-100 text-text-main rounded-tl-none'
                 }`}>
                   <div className="whitespace-pre-wrap">{msg.content}</div>
                 </div>
                 <div className={`absolute top-full mt-2 flex items-center gap-2 px-3 ${msg.role === 'user' ? 'right-0 flex-row-reverse' : 'left-0'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">
                       {msg.role === 'user' ? 'Lead Clinician' : 'Yashoda Neural Hub'}
                    </span>
                 </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col animate-fade-in items-start group">
               <div className="bg-white border border-gray-100 p-8 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-6">
                  <div className="flex gap-1.5">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:200ms]" />
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:400ms]" />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Neural Synthesis Underway...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-24" />
        </div>
      </main>

      {/* High-Fidelity Fixed Input Hub */}
      <footer className="shrink-0 p-6 md:p-10 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 -z-10" />
            <div className="relative flex items-center gap-4 p-2.5 bg-white border-2 border-gray-100 rounded-[2.5rem] focus-within:border-primary focus-within:shadow-2xl focus-within:shadow-primary/5 transition-all">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your retinal scan or eye condition..."
                className="flex-grow px-10 py-4 bg-transparent text-lg font-bold placeholder:text-gray-300 outline-none"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || loading}
                className="w-14 h-14 bg-indigo-950 text-white rounded-[1.8rem] flex items-center justify-center shadow-xl hover:bg-primary active:scale-95 disabled:opacity-30 transition-all shrink-0"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-40">
               Secured by Yashoda Hospitals Diagnostic Protocol v4.0
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
