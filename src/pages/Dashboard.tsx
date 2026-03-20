import { useStore } from '../store';
import { 
  CloudRain, 
  ThermometerSun, 
  Wind,
  Moon, 
  Smartphone,
  ShieldAlert,
  Wallet,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, activePlanId, monitor } = useStore();

  const PlanAlert = () => {
    if (!activePlanId) {
      return (
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900">No Active Protection</h3>
              <p className="text-sm text-orange-700">You are currently at risk. Subscribe to a plan to protect your income.</p>
            </div>
          </div>
          <Link to="/plans" className="shrink-0 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm w-full sm:w-auto text-center">
            View Plans
          </Link>
        </div>
      );
    }
    
    if (monitor.hasAlert) {
      return (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Heavy Rain Detected — Coverage Active</h3>
              <p className="text-sm text-red-700">Condition threshold crossed. You are eligible to trigger a claim for lost hours.</p>
            </div>
          </div>
          <Link to="/calculator" className="shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm w-full sm:w-auto text-center">
            Trigger Claim
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-slate-500 mt-1">Here's your income protection summary.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 text-sm font-medium capitalize">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {user.platform || 'Gig'} Partner Active
        </div>
      </div>

      <PlanAlert />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trust Score Card */}
        <div className="bg-indigo-900 rounded-2xl p-5 border border-indigo-800 shadow-sm relative overflow-hidden group text-white">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/30 rounded-full blur-2xl"></div>
          <p className="text-sm font-medium text-indigo-200 mb-1">AI Trust Score</p>
          <div className="flex items-end gap-2 text-white">
            <span className="text-3xl font-extrabold">{user.trustScore || 72}</span>
            <span className="text-indigo-300 font-medium mb-1">/ 100</span>
          </div>
          <div className="mt-3 text-xs text-indigo-100 leading-tight">
             Higher trust score = lower premium and faster claims
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-primary-500" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Avg Daily Income</p>
          <p className="text-2xl font-bold text-slate-900">₹{user.dailyIncome}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
             <Clock className="w-3.5 h-3.5" />
             <span>{user.workingHours} hrs/day</span>
          </div>
        </div>

        {/* Weekly Earnings Projection */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm font-medium text-slate-500">Weekly Target</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{user.dailyIncome * 6}</p>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">65% on track this week</p>
        </div>

        {/* Active Plan */}
        <div className={`rounded-2xl p-5 border shadow-sm ${activePlanId ? 'bg-gradient-to-br from-primary-600 to-accent-600 border-transparent text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className="flex justify-between items-start mb-1">
            <p className={`text-sm font-medium ${activePlanId ? 'text-primary-100' : 'text-slate-500'}`}>Protection Plan</p>
            {activePlanId && <CheckCircle2 className="w-5 h-5 text-primary-200" />}
          </div>
          <p className="text-xl font-bold">{activePlanId ? activePlanId.charAt(0).toUpperCase() + activePlanId.slice(1) : 'None'}</p>
          <div className="mt-4">
            {activePlanId ? (
              <p className="text-xs text-primary-100">Coverage up to ₹2000/week</p>
            ) : (
              <Link to="/plans" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                View Plans <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* AI Risk Analysis Panel */}
      <h2 className="text-lg font-bold text-slate-900 pt-4 tracking-tight">AI Risk Analysis Panel</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Rainfall', icon: CloudRain, value: `${monitor.rainfall} mm`, risk: monitor.rainfall >= 50 ? 'High' : 'Low', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Heat', icon: ThermometerSun, value: `${monitor.temperature}°C`, risk: monitor.temperature >= 42 ? 'High' : 'Low', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'AQI / Pollution', icon: Wind, value: monitor.aqi, risk: monitor.aqi >= 300 ? 'High' : 'Medium', color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-200' },
          { label: 'Curfew / Strike', icon: Moon, value: monitor.curfew ? 'Active' : 'Clear', risk: monitor.curfew ? 'High' : 'None', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
          { label: 'App Outage', icon: Smartphone, value: monitor.platformOutage ? 'Active' : 'Clear', risk: monitor.platformOutage ? 'High' : 'None', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className={`p-3 rounded-xl ${item.bg} ${item.color} mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-slate-600">{item.label}</h3>
              <p className="text-lg font-bold text-slate-900 mt-1">{item.value}</p>
              <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                item.risk === 'High' ? 'bg-red-100 text-red-700' : 
                item.risk === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                'bg-green-100 text-green-700'
              }`}>
                {item.risk} RISK
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
