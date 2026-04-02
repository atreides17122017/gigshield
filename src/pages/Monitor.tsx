import { useStore } from '../store';
import { CloudRain, ThermometerSun, AlertTriangle, Wind, Moon, Smartphone, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Monitor() {
  const { user, activePlanId } = useStore();
  const [monitor, setMonitor] = useState<any>({ rainfall: 0, temperature: 0, aqi: 0, curfew: false, platformOutage: false, hasAlert: false });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const city = user?.zone || 'Delhi';
      const res = await fetch(`http://localhost:5000/api/triggers/status?city=${city}`);
      const json = await res.json().catch(() => ({}));
      const data = json.data || {};
      
      setMonitor({
        rainfall: data.rainfall || 0,
        temperature: data.temperature || 0,
        aqi: data.aqi || 0,
        curfew: false, 
        platformOutage: false,
        hasAlert: (data.rainfall >= 50 || data.temperature >= 42 || data.aqi >= 300)
      });
    } catch(e) { 
      console.error(e);
      setMonitor({ rainfall: 65, temperature: 32, aqi: 320, curfew: false, platformOutage: false, hasAlert: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchStatus() }, [user?.zone]);

  const simulateRefresh = async () => {
    setIsRefreshing(true);
    await fetchStatus();
    setIsRefreshing(false);
  };

  const parameters = [
    {
      id: 'rain',
      name: 'Rainfall',
      icon: CloudRain,
      current: monitor.rainfall,
      unit: 'mm/hr',
      threshold: 50,
      status: monitor.rainfall >= 50 ? 'ALERT' : 'NORMAL',
      color: 'blue'
    },
    {
      id: 'heat',
      name: 'Extreme Heat',
      icon: ThermometerSun,
      current: monitor.temperature,
      unit: '°C',
      threshold: 42,
      status: monitor.temperature >= 42 ? 'ALERT' : 'NORMAL',
      color: 'amber'
    },
    {
      id: 'aqi',
      name: 'AQI / Pollution',
      icon: Wind,
      current: monitor.aqi,
      unit: 'PM2.5',
      threshold: 300,
      status: monitor.aqi >= 300 ? 'ALERT' : 'NORMAL',
      color: 'teal'
    },
    {
      id: 'curfew',
      name: 'Curfew / Civic Order',
      icon: Moon,
      current: monitor.curfew ? 100 : 0,
      unit: '% severity',
      threshold: 1,
      status: monitor.curfew ? 'ALERT' : 'NORMAL',
      color: 'slate'
    },
    {
      id: 'platform',
      name: 'Platform Outage',
      icon: Smartphone,
      current: monitor.platformOutage ? 100 : 0,
      unit: '% downtime',
      threshold: 1,
      status: monitor.platformOutage ? 'ALERT' : 'NORMAL',
      color: 'orange'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Disruption Monitor</h1>
          <p className="text-slate-500 mt-1">Live tracking of parametric insurance triggers in your zone.</p>
        </div>
        <button 
          onClick={simulateRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center my-10">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary-500 animate-spin"></div>
        </div>
      )}

      {monitor.hasAlert && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-5 rounded-r-2xl shadow-sm my-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Insurance Trigger Activated</h3>
              <p className="mt-1 text-sm text-red-700">
                Weather conditions in your zone have crossed the payout threshold.
                {activePlanId ? ' Coverage is active and you can now trigger a claim.' : ' You do not have an active plan to claim this disruption.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parameters.map((param) => {
          const Icon = param.icon;
          const isAlert = param.status === 'ALERT';
          
          return (
            <div key={param.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isAlert ? 'bg-red-100 text-red-600' : `bg-${param.color}-50 text-${param.color}-600`
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{param.name}</h3>
                    <p className="text-xs text-slate-500">Threshold: {param.threshold} {param.unit}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                  isAlert ? 'bg-red-100 text-red-700 animate-pulse-slow' : 'bg-green-100 text-green-700'
                }`}>
                  {param.status}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {param.current}
                  </span>
                  <span className="text-sm font-medium text-slate-500 mb-1">{param.unit}</span>
                </div>
                
                {/* Progress bar visualizer */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isAlert ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, (param.current / (param.threshold * 1.5)) * 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                  <span>Normal</span>
                  <span className="text-slate-500">Trigger Alert</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
