import { useState } from 'react';
import { CloudRain, ThermometerSun, Wind, Shield, Smartphone, X } from 'lucide-react';

const coveredItems = [
  {
    title: 'Heavy Rainfall',
    threshold: '50mm / 3 hrs',
    payout: '100% of daily income',
    plans: 'Basic, Standard, Premium',
    desc: "When heavy rain stops you from riding, GigShield automatically detects it via weather API and pays your full day's income directly to your UPI.",
    icon: CloudRain,
    bg: 'bg-blue-500',
    iconBg: 'bg-blue-600',
    color: 'text-blue-500'
  },
  {
    title: 'Extreme Heat',
    threshold: '43°C / 4+ hrs',
    payout: '50% of daily income',
    plans: 'Standard, Premium',
    desc: "When dangerous heat makes outdoor delivery unsafe, GigShield covers half your day's lost income.",
    icon: ThermometerSun,
    bg: 'bg-amber-500',
    iconBg: 'bg-amber-600',
    color: 'text-amber-500'
  },
  {
    title: 'Severe Pollution',
    threshold: 'AQI > 300',
    payout: '50% of daily income',
    plans: 'Standard, Premium',
    desc: 'When hazardous air quality levels prevent safe outdoor work, GigShield covers half your daily lost income automatically.',
    icon: Wind,
    bg: 'bg-slate-500',
    iconBg: 'bg-slate-600',
    color: 'text-slate-500'
  },
  {
    title: 'Curfew / Strike',
    threshold: 'Verified order',
    payout: '100% of daily income',
    plans: 'Premium',
    desc: "When a verified government curfew or civic strike prevents you from working, GigShield pays your full day's income.",
    icon: Shield,
    bg: 'bg-primary-500',
    iconBg: 'bg-primary-600',
    color: 'text-primary-500'
  },
  {
    title: 'Platform Outage',
    threshold: 'Downtime > 2 hrs',
    payout: 'Pro-rated by hours',
    plans: 'Basic, Standard, Premium',
    desc: 'When Zomato or Swiggy goes down for more than 2 hours, GigShield calculates and pays your lost income for those hours.',
    icon: Smartphone,
    bg: 'bg-green-500',
    iconBg: 'bg-green-600',
    color: 'text-green-500'
  }
];

const notCoveredItems = [
  {
    title: 'Vehicle Repairs',
    desc: 'Mechanical breakdowns, punctures, or any vehicle maintenance costs are not covered by GigShield.'
  },
  {
    title: 'Health & Medical',
    desc: 'Personal illness, injury, or hospitalisation expenses are outside the scope of this income protection product.'
  },
  {
    title: 'Road Accidents',
    desc: 'Accidents during delivery are not covered. Maintain separate vehicle and personal accident insurance.'
  },
  {
    title: 'Voluntary Absence',
    desc: 'Choosing not to work on a given day is not a covered parametric event under GigShield.'
  },
  {
    title: 'War & Civil Conflict',
    desc: 'Losses caused by war, military action, terrorism, armed conflict, or civil unrest are excluded from all coverage under IRDAI microinsurance standards.'
  },
  {
    title: 'Pandemic / Epidemic',
    desc: 'Losses arising from government-declared national pandemics, epidemics, or WHO-classified health emergencies are excluded in accordance with IRDAI microinsurance exclusion guidelines.'
  },
  {
    title: 'Fraudulent Claims',
    desc: 'Claims involving GPS spoofing, location manipulation, duplicate filing, or any misrepresentation will be permanently rejected and the account suspended.'
  }
];

export default function Coverage() {
  const [tab, setTab] = useState<'covered' | 'not-covered'>('covered');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-0 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Coverage Details</h1>
        <p className="text-slate-500 text-lg">Understand exactly what triggers a payout and what is excluded.</p>
      </div>

      <div className="flex justify-center border-b border-slate-200">
        <div className="flex gap-8">
          <button
            onClick={() => setTab('covered')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
              tab === 'covered' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            What's Covered
          </button>
          <button
            onClick={() => setTab('not-covered')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
              tab === 'not-covered' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            What's Not Covered
          </button>
        </div>
      </div>

      {tab === 'covered' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coveredItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`${item.bg} p-6 flex flex-col items-center justify-center text-white`}>
                  <div className={`${item.iconBg} p-4 rounded-2xl mb-4 shadow-inner`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Threshold</span>
                    <span className={`font-bold ${item.color}`}>{item.threshold}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Payout</span>
                    <span className="font-bold text-slate-900">{item.payout}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Plans</span>
                    <span className="font-medium text-slate-700 text-sm">{item.plans}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pt-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'not-covered' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notCoveredItems.map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex items-start gap-4 hover:border-slate-300 transition-colors">
              <div className="p-2 bg-slate-200/50 rounded-xl shrink-0">
                <X className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center pt-8">
        <p className="text-xs text-slate-500 font-medium">GigShield is a parametric income protection product designed in alignment with IRDAI microinsurance guidelines. Coverage is for income loss only.</p>
      </div>
    </div>
  );
}
