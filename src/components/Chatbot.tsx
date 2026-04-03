import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Shield, Send } from 'lucide-react';

const rules = [
  {
    keywords: ['claim', 'file', 'how do i'],
    response: "Insurix works automatically. When a disruption is detected in your zone, your claim is created instantly with no action needed. You get a notification when your payout is processed. Check Claim History for details."
  },
  {
    keywords: ['covered', 'coverage', 'what is covered'],
    response: "Insurix covers 5 disruptions: Heavy rainfall (50mm/3hrs), Extreme heat (43C/4hrs), Severe pollution (AQI>300), Curfew or Strike, and Platform outages over 2 hours. Coverage of specific triggers depends on your plan. Visit our Coverage page for full details."
  },
  {
    keywords: ['not covered', 'excluded', 'exclusion'],
    response: "Insurix does not cover vehicle repairs, health expenses, accidents, voluntary absence from work, war or military events, government-declared pandemics or epidemics, or fraudulent claims. See Terms and Conditions for the full exclusions list."
  },
  {
    keywords: ['pandemic', 'war', 'covid', 'epidemic'],
    response: "Government-declared pandemics, epidemics, and losses from war or civil conflict are explicitly excluded from Insurix coverage under IRDAI microinsurance exclusion standards."
  },
  {
    keywords: ['premium', 'price', 'cost', 'how much'],
    response: "Your premium is personalised by our AI model using your zone risk history, current season, Trust Score, and claim history. Riders with clean long-term records pay less. Check Subscription Plans to see your personalised rates."
  },
  {
    keywords: ['trust', 'trust score', 'score'],
    response: "Your Trust Score (0-100) is calculated from your platform tenure (25%), claim history (30%), activity consistency (20%), zone stability (15%), and verification compliance (10%). Higher score means lower premiums and faster claim approvals."
  },
  {
    keywords: ['payout', 'payment', 'when', 'money'],
    response: "Approved payouts reach your registered UPI within 30 minutes. Amount is calculated as your hourly rate multiplied by disruption hours, capped by your plan's daily limit."
  },
  {
    keywords: ['cancel', 'cancellation'],
    response: "Cancel anytime from Settings. The current week is non-refundable. No future charges after cancellation."
  },
  {
    keywords: ['irdai', 'regulated', 'legal', 'regulation'],
    response: "Insurix is designed in alignment with IRDAI microinsurance guidelines and the Digital Personal Data Protection Act 2023. Your data is used only for premium calculation and claim verification, never sold."
  },
  {
    keywords: ['fraud', 'fake', 'spoofing'],
    response: "Insurix uses a 6-layer signal validation system including GPS, network IP, accelerometer data, weather confirmation, platform activity logs, and Trust Score to detect fraudulent claims. Coordinated fraud rings are detected using DBSCAN clustering analysis."
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    response: "Hello! I am Insurix Assistant. I can help with coverage, claims, premiums, Trust Score, cancellation, and IRDAI compliance. What would you like to know?"
  }
];

const defaultResponse = "I can help with: coverage details, claim process, premium calculation, Trust Score, cancellation, and regulatory compliance. Try asking about any of these.";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([
    { sender: 'bot', text: "Hello! I am Insurix Assistant. I can help with coverage, claims, premiums, Trust Score, cancellation, and IRDAI compliance. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Process response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let foundResponse = defaultResponse;

      for (const rule of rules) {
        if (rule.keywords.some(k => lower.includes(k))) {
          foundResponse = rule.response;
          break;
        }
      }

      setMessages(prev => [...prev, { sender: 'bot', text: foundResponse }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-primary-500/30 transition-transform ${isOpen ? 'scale-0' : 'scale-100'}`}
        title="Ask Insurix Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-[380px] h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200 animate-fade-in">
          {/* Header */}
          <div className="bg-primary-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2 font-bold">
              <Shield className="w-5 h-5" />
              <span>Insurix Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-500 p-1 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
