import { useState } from 'react';
import { useStore } from '../store';
import { Calculator as CalcIcon, DollarSign, CloudRain, AlertCircle, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function Calculator() {
  const { user, activePlanId, monitor, addClaim } = useStore();
  
  const [hourlyIncome, setHourlyIncome] = useState(user.dailyIncome ? Math.round(user.dailyIncome / user.workingHours) : 60);
  const [lostHours, setLostHours] = useState(3);
  const [disruptionType, setDisruptionType] = useState('Rainfall');
  const [claimPhase, setClaimPhase] = useState<'idle' | 'detecting' | 'creating' | 'trust' | 'risk' | 'approved' | 'paid'>('idle');

  // Magic formula: payout = income × hours × factor
  const factor = 1.0; 
  const calculatedPayout = Math.round(hourlyIncome * lostHours * factor);

  const handleTriggerClaim = () => {
    if (!monitor.hasAlert) return;
    setClaimPhase('detecting');
    
    setTimeout(() => setClaimPhase('creating'), 800);
    setTimeout(() => setClaimPhase('trust'), 1600);
    setTimeout(() => setClaimPhase('risk'), 2400);
    setTimeout(() => {
      setClaimPhase('approved');
      addClaim({
        type: disruptionType,
        lostHours: lostHours,
        amount: calculatedPayout
      });
    }, 3200);
    setTimeout(() => setClaimPhase('paid'), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0 animate-fade-in flex flex-col md:flex-row gap-6">
      
      {/* Configuration Panel */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payout Calculator</h1>
          <p className="text-slate-500 mt-1 text-sm">Estimate your exact insurance payout.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Disruption Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Rainfall', 'Heat', 'AQI', 'Curfew', 'App Outage'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDisruptionType(type)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    disruptionType === type 
                      ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
              <span>Hourly Income (₹)</span>
              <span className="text-primary-600 font-bold">₹{hourlyIncome}</span>
            </label>
            <input 
              type="range" 
              className="w-full accent-primary-600" 
              min="20" max="200" step="5"
              value={hourlyIncome}
              onChange={(e) => setHourlyIncome(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
              <span>₹20</span>
              <span>₹200</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
              <span>Estimated Lost Hours</span>
              <span className="text-primary-600 font-bold">{lostHours} hrs</span>
            </label>
            <input 
              type="range" 
              className="w-full accent-primary-600" 
              min="1" max="10" step="0.5"
              value={lostHours}
              onChange={(e) => setLostHours(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
              <span>1 hr</span>
              <span>10 hrs</span>
            </div>
          </div>

        </div>
      </div>

      {/* Result Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4 sticky top-24 h-max">
        
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
          
          <h3 className="text-slate-400 text-sm font-medium mb-1">Estimated Payout</h3>
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-4xl font-extrabold tracking-tight">₹{calculatedPayout}</span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><CalcIcon className="w-3.5 h-3.5" /> Formula</span>
              <span className="text-slate-300 font-mono">₹{hourlyIncome} × {lostHours}h</span>
            </div>
            <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Cause</span>
              <span className="text-slate-300">{disruptionType}</span>
            </div>
          </div>

          {activePlanId ? (
            monitor.hasAlert ? (
              <button 
                onClick={handleTriggerClaim}
                disabled={claimPhase !== 'idle'}
                className={`w-full mt-6 py-3.5 px-4 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary-500/20 ${
                  claimPhase === 'paid'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : claimPhase !== 'idle'
                    ? 'bg-primary-400 cursor-wait text-white'
                    : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white'
                }`}
              >
                {claimPhase === 'paid' ? (
                  <>Payout Sent <Zap className="w-4 h-4 fill-current" /></>
                ) : claimPhase !== 'idle' ? (
                  <>Processing...</>
                ) : (
                  <>Trigger Auto-Claim <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            ) : (
              <div className="mt-6 text-center text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
                No disruption detected. Claim not allowed.
              </div>
            )
          ) : (
            <div className="mt-6 text-center text-xs text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              Active plan required to claim
            </div>
          )}
        </div>

        {/* Live Logic Steps Demo */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
           <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Claim Lifecycle</h4>
           <div className="space-y-4">
             {[
               { icon: CloudRain, text: 'Disruption detected', active: monitor.hasAlert || claimPhase !== 'idle' },
               { icon: Zap, text: 'Claim created', active: ['creating', 'trust', 'risk', 'approved', 'paid'].includes(claimPhase) },
               { icon: ShieldCheck, text: 'Trust score check', active: ['trust', 'risk', 'approved', 'paid'].includes(claimPhase) },
               { icon: CalcIcon, text: 'Risk check', active: ['risk', 'approved', 'paid'].includes(claimPhase) },
               { icon: DollarSign, text: 'Claim approved', active: ['approved', 'paid'].includes(claimPhase) }
             ].map((step, i) => (
               <div key={i} className={`flex items-center gap-3 ${step.active ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                   <step.icon className="w-4 h-4" />
                 </div>
                 <span className={`text-sm ${step.active ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{step.text}</span>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
