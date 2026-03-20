import { useStore } from '../store';
import { Shield, Check, Zap } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic Shield',
    price: 49,
    coverage: 300,
    weeklyCap: 1500,
    features: ['Rainfall tracking', 'Platform Outage protection', '24/7 Support'],
    color: 'slate'
  },
  {
    id: 'standard',
    name: 'Standard Shield',
    price: 69,
    coverage: 400,
    weeklyCap: 2000,
    features: ['All Basic features', 'Extreme heat protection', 'Faster claim processing'],
    color: 'primary',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Shield',
    price: 99,
    coverage: 500,
    weeklyCap: 2500,
    features: ['All Standard features', 'Curfew/Strike coverage', 'Instant automatic payouts'],
    color: 'accent'
  }
];

export default function Plans() {
  const { activePlanId, subscribe, user } = useStore();

  const getZoneRisk = (zone: string) => {
    if (['Adyar', 'Velachery'].includes(zone)) return 10;
    if (['T Nagar', 'Tambaram'].includes(zone)) return 5;
    return 0; // Anna Nagar and default
  };

  const getTrustDiscount = (score: number) => {
    if (score > 80) return 15;
    if (score > 70) return 10;
    if (score > 60) return 5;
    return 0;
  };

  const zoneRisk = getZoneRisk(user.zone || 'Anna Nagar');
  const trustDiscount = getTrustDiscount(user.trustScore || 72);
  const seasonalRisk = 2; // Simulated random between 0 and 5

  const getFinalPremium = (basePrice: number) => {
    return basePrice + zoneRisk - trustDiscount + seasonalRisk;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-0 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Choose Your Protection</h1>
        <p className="text-slate-500 text-lg">Secure your daily income against unexpected disruptions like rain, extreme heat, and app outages.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-sm font-medium">
          <Zap className="w-4 h-4 fill-current text-indigo-500" />
          <span>AI-adjusted premium based on your risk profile, Trust Score, zone risk, and season.</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-6 bg-slate-900 rounded-2xl p-5 text-white shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Premium Breakdown</h3>
        <div className="space-y-2 text-sm">
           <div className="flex justify-between"><span className="text-slate-300">Base Premium</span><span>Plan dependent</span></div>
           <div className="flex justify-between"><span className="text-slate-300">Zone Risk ({user.zone || 'Anna Nagar'})</span><span className="text-red-400">+₹{zoneRisk}</span></div>
           <div className="flex justify-between"><span className="text-slate-300">Trust Score Discount ({user.trustScore || 72}/100)</span><span className="text-green-400">-₹{trustDiscount}</span></div>
           <div className="flex justify-between"><span className="text-slate-300">Seasonal Risk (Monsoon)</span><span className="text-red-400">+₹{seasonalRisk}</span></div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
           <p className="text-xs text-slate-400">Premium is calculated using Trust Score, zone risk and seasonal risk. Updates dynamically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => {
          const isActive = activePlanId === plan.id;
          const isPopular = plan.popular;

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
                  <span className="text-4xl font-extrabold text-slate-900">₹{getFinalPremium(plan.price)}</span>
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
                onClick={() => subscribe(plan.id)}
                disabled={isActive}
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
    </div>
  );
}
