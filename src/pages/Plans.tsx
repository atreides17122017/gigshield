import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Shield, Check, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

const plansBase = [
  {
    id: 'basic',
    name: 'Basic Shield',
    coverage: 300,
    weeklyCap: 1500,
    features: ['Rainfall tracking', 'Platform Outage protection', 'Basic fraud protection', 'IRDAI aligned coverage'],
    color: 'slate'
  },
  {
    id: 'standard',
    name: 'Standard Shield',
    coverage: 400,
    weeklyCap: 2000,
    features: ['All Basic features', 'Extreme heat protection', 'AQI / Pollution coverage', 'Advanced Trust Score benefit'],
    color: 'primary',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Shield',
    coverage: 500,
    weeklyCap: 2500,
    features: ['All Standard features', 'Curfew / Strike coverage', 'Instant automatic payouts', 'Highest weekly payout cap'],
    color: 'accent'
  }
];

export default function Plans() {
  const { activePlanId, user, token, subscribe } = useStore();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    // Fetch AI premiums
    const fetchQuotes = async () => {
      try {
        if (!token) {
          // Mock data if not logged in for viewing
          setQuotes({
            basic: { personalised_premium: 49, adjustment_reason: "Standard calculation" },
            standard: { personalised_premium: 69, adjustment_reason: "Standard calculation" },
            premium: { personalised_premium: 99, adjustment_reason: "Standard calculation" }
          });
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/api/policies/quote`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setQuotes(data);
        } else {
          // Fallback
          setQuotes({
            basic: { personalised_premium: 49, adjustment_reason: "AI-adjusted pricing based on risk profile" },
            standard: { personalised_premium: 69, adjustment_reason: "AI-adjusted pricing based on risk profile" },
            premium: { personalised_premium: 99, adjustment_reason: "AI-adjusted pricing based on risk profile" }
          });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchQuotes();
  }, [token]);

  const handleSubscribeClick = (plan: any, price: number) => {
    setSelectedPlan({ ...plan, price });
    setShowModal(true);
  };

  const confirmSubscription = async () => {
    if (!token) return navigate('/login');
    
    try {
      await fetch(`${BASE_URL}/api/policies/subscribe`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_tier: selectedPlan.id,
          weekly_premium: selectedPlan.price
        })
      });
      // In a real app we'd update global state here
      subscribe(selectedPlan.id);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-0 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Choose Your Protection</h1>
        <p className="text-slate-500 text-lg">Secure your daily income against unexpected disruptions like rain, extreme heat, and app outages.</p>
        <button onClick={() => navigate('/compare')} className="text-primary-600 font-medium hover:underline">Compare all plans in detail</button>
      </div>

      {!loading && quotes && (
        <div className="max-w-2xl mx-auto mt-6 bg-green-50 rounded-2xl p-5 border border-green-200 shadow-sm text-green-900">
          <div className="flex items-center gap-2 mb-3">
             <Zap className="w-5 h-5 text-green-600" />
             <h3 className="text-sm font-bold uppercase tracking-wider text-green-800">Your AI-calculated premium for {user?.zone || 'your zone'} — Monsoon</h3>
          </div>
          <p className="text-sm mb-2">
            Basic Shield: ₹{quotes.basic?.personalised_premium}/week<br/>
            Standard Shield: ₹{quotes.standard?.personalised_premium}/week<br/>
            Premium Shield: ₹{quotes.premium?.personalised_premium}/week
          </p>
          <p className="text-xs text-green-700 italic">
            Reason: {quotes.standard?.adjustment_reason || "Based on risk profiles and trust score"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plansBase.map((plan) => {
          const isActive = activePlanId === plan.id;
          const isPopular = plan.popular;
          const price = quotes ? quotes[plan.id]?.personalised_premium : 0;

          return (
            <div 
              key={plan.id}
              className={`relative rounded-3xl border-2 p-6 flex flex-col ${
                isActive 
                  ? 'border-green-500 bg-green-50/10 shadow-lg shadow-green-500/10' 
                  : isPopular 
                    ? 'border-primary-500 bg-white shadow-xl shadow-primary-500/10 scale-105 z-10' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
              } transition-all duration-300`}
            >
              {isPopular && !isActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Most Popular
                </div>
              )}
              {isActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                  <Check className="w-3 h-3" /> Current Plan
                </div>
              )}

              <div className="mb-6 border-b border-slate-100 pb-6 text-center">
                <Shield className={`w-12 h-12 mx-auto mb-4 ${
                  isPopular || isActive ? 'text-primary-500' : 'text-slate-400'
                }`} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹{loading ? "..." : price}</span>
                  <span className="text-slate-500 text-sm mb-1">/ week</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-sm mb-4">
                  <span className="text-slate-500">Daily Coverage</span>
                  <span className="font-bold text-slate-900">₹{plan.coverage}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-sm mb-6">
                  <span className="text-slate-500">Weekly Cap</span>
                  <span className="font-bold text-slate-900">₹{plan.weeklyCap}</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isPopular || isActive ? 'text-primary-500' : 'text-slate-400'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribeClick(plan, price)}
                disabled={isActive || loading}
                className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                    : isPopular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                {isActive ? (
                  <>Current Protection <Check className="w-4 h-4" /></>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Confirm Subscription</h2>
            <p className="text-slate-600 mb-4">
              You are subscribing to <strong>{selectedPlan.name}</strong> for <strong>₹{selectedPlan.price}/week</strong>.
            </p>
            <p className="text-slate-600 mb-4">
              First charge: Today.<br/>
              Payment: Platform Deduction.
            </p>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6">
               <p className="text-xs text-slate-500 flex items-start gap-2">
                 <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                 This product is designed in alignment with IRDAI microinsurance regulations. Coverage is for income loss only.
               </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSubscription}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
