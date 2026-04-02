import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: "How does the automatic payout work?",
    a: "GigShield monitors weather and disruption APIs every 15 minutes. When a trigger threshold is crossed in your delivery zone, your claim is created automatically and payment is processed to your UPI ID. You do not need to file anything. Check your Claim History for details."
  },
  {
    q: "What disruptions are covered?",
    a: "Heavy rainfall exceeding 50mm in 3 hours, extreme heat above 43°C for 4+ hours, severe air pollution with AQI above 300, verified government curfews or civic strikes, and delivery platform outages exceeding 2 hours. Coverage of specific triggers depends on your plan tier."
  },
  {
    q: "What is not covered?",
    a: "GigShield does not cover vehicle repairs, health or medical expenses, road accidents, voluntary absence, losses caused by war or military action, government-declared pandemics or epidemics, nuclear or biological events, or any fraudulent or misrepresented claims. Full details are on our Terms & Conditions page."
  },
  {
    q: "When does my coverage start?",
    a: "Your coverage starts immediately after payment is confirmed. There is no waiting period for GigShield's parametric income protection product."
  },
  {
    q: "How is my premium calculated?",
    a: "Your premium is personalised by our AI model using your delivery zone's historical flood and heat data, the current season, your Trust Score, and your claim history. Riders with longer clean histories pay less."
  },
  {
    q: "What is the Trust Score?",
    a: "Your Trust Score (0-100) reflects your platform tenure, claim history cleanliness, activity consistency, zone stability, and verification compliance. A higher score means lower premiums and faster claim approvals."
  },
  {
    q: "What if my claim is rejected unfairly?",
    a: "You can raise a dispute from the Claim History page within 7 days. Our team reviews all disputes within 48 hours and will reinstate the payout if the rejection was incorrect."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings at any time. The current week is non-refundable. No further charges after cancellation."
  },
  {
    q: "Is GigShield regulated?",
    a: "GigShield is a parametric income protection product designed in alignment with IRDAI microinsurance guidelines and the Digital Personal Data Protection Act 2023. Your data is used only for premium calculation and claim verification."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 lg:pb-0 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex justify-center items-center gap-2">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 text-lg">Everything you need to know about GigShield's parametric insurance.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-500 shrink-0" />
                  <span className="font-semibold text-slate-800 text-base">{faq.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-primary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary-500" />
                )}
              </button>
              
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-2 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
