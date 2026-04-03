import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Calculator as CalcIcon, DollarSign, CloudRain, AlertCircle, Zap, ShieldCheck } from 'lucide-react';

export default function Calculator() {
  const { user, activePlanId, monitor, activeTrigger } = useStore();
  
  const [hourlyIncome, setHourlyIncome] = useState(user.dailyIncome ? Math.round(user.dailyIncome / user.workingHours) : 60);
  const [claimPhase, setClaimPhase] = useState<'idle' | 'detecting' | 'creating' | 'trust' | 'risk' | 'approved' | 'paid'>('idle');

  // Single Source of Truth derivations
  const autoType = activeTrigger ? activeTrigger.type : 'None';
  // Clamped severity 0-1 mapped exactly to 8 max allowed hours
  const lostHours = activeTrigger ? Number((Math.min(1, Math.max(0, activeTrigger.severity)) * 8).toFixed(1)) : 0;

  // Execute parametric animation sequence on init if alert exists
  useEffect(() => {
    if (monitor.hasAlert && activePlanId && claimPhase === 'idle') {
      setClaimPhase('detecting');
      setTimeout(() => setClaimPhase('creating'), 1000);
      setTimeout(() => setClaimPhase('trust'), 2000);
      setTimeout(() => setClaimPhase('risk'), 3000);
      setTimeout(() => setClaimPhase('approved'), 4000);
      setTimeout(() => setClaimPhase('paid'), 5000);
    } else if (!monitor.hasAlert && claimPhase !== 'idle') {
      setClaimPhase('idle');
    }
  }, [monitor.hasAlert, activePlanId, claimPhase]);

  const calculatedPayout = Math.round(hourlyIncome * lostHours);

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0 animate-fade-in flex flex-col md:flex-row gap-6">
      
      {/* Configuration Panel */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Parametric Yield Output</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time mathematical breakdown of your autonomous payouts.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 border-b border-slate-100 pb-2">Active Telemetry Detected</label>
            <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
               <AlertCircle className="w-5 h-5 flex-shrink-0" />
               <span className="font-bold">{autoType !== 'None' ? autoType + ' Disturbance Binding Active' : 'No Parameters Detected'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-1">GigShield APIs automatically sync to global feeds routing payouts autonomously without your input.</p>
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
              <span>Hourly Income Calibration (₹)</span>
              <span className="text-primary-600 font-bold">₹{hourlyIncome}</span>
            </label>
            <input 
              type="range" 
              className="w-full accent-primary-600 opacity-60" 
              min="20" max="200" step="5"
              value={hourlyIncome}
              onChange={(e) => setHourlyIncome(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
              <span>(Pre-filled from Profile)</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
              <span>Estimated Lost Hours</span>
              <span className="text-primary-600 font-bold">{lostHours} hrs</span>
            </label>
            <input 
              type="range" 
              className="w-full accent-primary-600 opacity-40 pointer-events-none" 
              min="0" max="10" step="0.5"
              value={lostHours}
              readOnly
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
              <span>(Auto-calibrated from severity metrics)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Result Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4 sticky top-24 h-max">
        
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
          
          <h3 className="text-slate-400 text-sm font-medium mb-1">Yield Generation</h3>
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-4xl font-extrabold tracking-tight">₹{calculatedPayout}</span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><CalcIcon className="w-3.5 h-3.5" /> Formula</span>
              <span className="text-slate-300 font-mono">₹{hourlyIncome} × {lostHours}h</span>
            </div>
            <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Origin</span>
              <span className="text-slate-300">{autoType}</span>
            </div>
          </div>

          {activePlanId ? (
            monitor.hasAlert ? (
              <div className="w-full mt-6 py-3.5 px-4 rounded-xl text-sm font-bold flex justify-center items-center gap-2 border bg-green-500/10 text-green-400 border-green-500/30">
                {claimPhase === 'paid' ? (
                  <>Payout Finalized <Zap className="w-4 h-4 fill-current" /></>
                ) : (
                  <>Auto payout in progress <span className="animate-spin ml-1 border-t-2 border-white w-4 h-4 rounded-full"></span></>
                )}
              </div>
            ) : (
              <div className="mt-6 text-center text-xs text-slate-500 bg-slate-800 p-3 rounded-xl border border-slate-700 font-medium">
                Scanning global parameters passively...
              </div>
            )
          ) : (
            <div className="mt-6 text-center text-xs text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 shadow-sm">
              Activation required to release yields
            </div>
          )}
        </div>

        {/* Live Logic Steps Demo */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
           <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Zero-Touch Lifecycle</h4>
           <div className="space-y-4">
             {[
               { icon: CloudRain, text: 'Disruption mapped', active: monitor.hasAlert || claimPhase !== 'idle' },
               { icon: Zap, text: 'Node created', active: ['creating', 'trust', 'risk', 'approved', 'paid'].includes(claimPhase) },
               { icon: ShieldCheck, text: 'Trust evaluation', active: ['trust', 'risk', 'approved', 'paid'].includes(claimPhase) },
               { icon: CalcIcon, text: 'Fraud algorithm bounds', active: ['risk', 'approved', 'paid'].includes(claimPhase) },
               { icon: DollarSign, text: 'UPI Yield Dropped', active: ['approved', 'paid'].includes(claimPhase) }
             ].map((step, i) => (
               <div key={i} className={`flex items-center gap-3 ${step.active ? 'opacity-100' : 'opacity-40 grayscale'} transition-all duration-300`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${step.active ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
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
