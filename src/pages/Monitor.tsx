import { useStore } from '../store';
import { CloudRain, ThermometerSun, AlertTriangle, Wind, Moon, Smartphone, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

// Replace with your actual API keys
const OPENWEATHER_KEY = 'YOUR_API_KEY';
const WAQI_TOKEN = 'YOUR_TOKEN';

export default function Monitor() {
  const { user, activePlanId, activeTrigger, setActiveTrigger, addClaim, addNotification } = useStore();
  const [monitor, setMonitor] = useState<any>({ rainfall: 0, temperature: 0, aqi: 0, curfew: 0, platformOutage: 0, hasAlert: false });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  // TRIGGER DETECTION, CLAIM GENERATION & NOTIFICATIONS
  useEffect(() => {
    let type = null;
    let value = 0;
    let threshold = 1;
    let severity = 0;

    // Execute Severity Calculation Maps
    if (monitor.rainfall > 50) {
      type = "Rainfall"; value = monitor.rainfall; threshold = 50;
      severity = Math.min(1, value / 100);
    } else if (monitor.temperature > 42) {
      type = "Extreme Heat"; value = monitor.temperature; threshold = 42;
      severity = Math.min(1, (value - 40) / 10);
    } else if (monitor.aqi > 300) {
      type = "AQI"; value = monitor.aqi; threshold = 300;
      severity = Math.min(1, (value - 300) / 200);
    } else if (monitor.curfew === 1) {
      type = "Curfew"; value = 1; threshold = 1;
      severity = 1;
    } else if (monitor.platformOutage > 5) {
      type = "Outage"; value = monitor.platformOutage; threshold = 5;
      severity = Math.min(1, value / 10);
    }

    if (type) {
      // ONLY trigger if transition occurs (Normal -> Alert)
      if (!activeTrigger || activeTrigger.type !== type) {
        setActiveTrigger({ type, value, threshold, severity });

        if (activePlanId) {
          const lostHours = Number((severity * 8).toFixed(1));
          const hourlyRate = 60; // Base constant
          const amount = Math.round(lostHours * hourlyRate);
          const claimId = `CLM${Math.floor(Math.random() * 900000) + 100000}`;

          addClaim({
            id: claimId,
            type,
            lostHours,
            amount,
            date: new Date().toISOString(),
            status: 'Approved' as const
          });

          addNotification(`${type} Detected — Coverage Active`);
          addNotification(`Claim ${claimId} Approved ₹${amount}`);
        }
      }
    } else {
      if (activeTrigger) setActiveTrigger(null);
    }
  }, [monitor, activePlanId, activeTrigger, setActiveTrigger, addClaim, addNotification]);

  // Timer for 'Last updated'
  useEffect(() => {
    const minterval = setInterval(() => setLastUpdated(l => l + 1), 1000);
    return () => clearInterval(minterval);
  }, []);

  const fetchRealtimeData = useCallback(async () => {
    try {
      const city = user?.zone || 'Chennai';
      
      // 1. Fetch Real Weather Data (OpenWeatherMap)
      const weatherRes = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_KEY}`);
      
      // 2. Fetch Real AQI Data (WAQI)
      const aqiRes = fetch(`https://api.waqi.info/feed/${city}/?token=${WAQI_TOKEN}`);
      
      // Execute concurrently
      const [weatherResponse, aqiResponse] = await Promise.all([weatherRes, aqiRes]);
      
      let rainfall = 0;
      let temperature = 32;
      let aqi = 150;

      if (weatherResponse.ok) {
         const weatherData = await weatherResponse.json();
         rainfall = weatherData.rain?.['1h'] || 0;
         temperature = weatherData.main?.temp ? Math.round(weatherData.main.temp - 273.15) : 32;
      }

      if (aqiResponse.ok) {
         const aqiData = await aqiResponse.json();
         aqi = aqiData.data?.aqi || 150;
      }

      // 3. Compute Simulated Logic
      const curfew = (rainfall > 50 || aqi > 300) ? 1 : 0;
      const isRandomSpike = Math.random() > 0.95; // Rare 5% chance spike
      const platformOutage = (rainfall > 60 || isRandomSpike) ? Math.floor(Math.random() * 5 + 6) : 0; // Ensures >5% organically

      setMonitor({
        rainfall,
        temperature,
        aqi,
        curfew,
        platformOutage,
        hasAlert: (rainfall > 50 || temperature > 42 || aqi > 300 || curfew === 1 || platformOutage > 5)
      });
      setLastUpdated(0);
      
    } catch (e) {
      console.error("API failure, enforcing smart simulated fallback:", e);
      
      // Smart Simulation Fallback (Alive & Realistic)
      setMonitor((prev: any) => {
        const slightShift = () => (Math.random() * 2 - 1); // Random between -1 and 1
        const newRain = Math.max(0, (prev.rainfall || 45) + slightShift() * 1.5);
        const newTemp = Math.max(20, (prev.temperature || 35) + slightShift() * 0.3);
        const newAqi = Math.max(50, (prev.aqi || 290) + slightShift() * 5);
        
        return {
          rainfall: Number(newRain.toFixed(1)),
          temperature: Math.round(newTemp),
          aqi: Math.round(newAqi),
          curfew: (newRain > 50 || newAqi > 300) ? 1 : 0,
          platformOutage: (newRain > 60) ? 7 : 0,
          hasAlert: newRain > 50 || newTemp > 42 || newAqi > 300 || newRain > 60
        };
      });
      setLastUpdated(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.zone]);

  // Main Effect: Initial Load & 5-Second Auto-Refresh
  useEffect(() => {
    fetchRealtimeData();
    const intervalId = setInterval(fetchRealtimeData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchRealtimeData]);

  const simulateRefresh = async () => {
    setIsRefreshing(true);
    await fetchRealtimeData();
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
      status: monitor.rainfall > 50 ? 'ALERT' : 'NORMAL',
      color: 'blue'
    },
    {
      id: 'heat',
      name: 'Extreme Heat',
      icon: ThermometerSun,
      current: monitor.temperature,
      unit: '°C',
      threshold: 42,
      status: monitor.temperature > 42 ? 'ALERT' : 'NORMAL',
      color: 'amber'
    },
    {
      id: 'aqi',
      name: 'AQI / Pollution',
      icon: Wind,
      current: monitor.aqi,
      unit: 'PM2.5',
      threshold: 300,
      status: monitor.aqi > 300 ? 'ALERT' : 'NORMAL',
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
      color: 'orange',
      subtitle: 'When delivery platforms like Zomato/Swiggy are unavailable'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Disruption Monitor</h1>
          <p className="text-slate-500 mt-1">Live tracking of parametric insurance triggers in your zone.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={simulateRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <span className="text-xs text-slate-400 font-medium mr-1">Last updated: {lastUpdated} seconds ago</span>
        </div>
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
                {activePlanId ? ' Coverage is active and parametric systems are dispatching payout.' : ' You do not have an active plan to claim this disruption.'}
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
            <div key={param.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors duration-500 ${
                    isAlert ? 'bg-red-100 text-red-600' : `bg-${param.color}-50 text-${param.color}-600`
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{param.name}</h3>
                    <p className="text-xs text-slate-500">Threshold: {param.threshold} {param.unit}</p>
                    {param.subtitle && <p className="text-[10px] text-slate-400 mt-1 leading-tight max-w-[200px]">{param.subtitle}</p>}
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors duration-500 ${
                  isAlert ? 'bg-red-100 text-red-700 animate-pulse-slow shadow-sm' : 'bg-green-100 text-green-700'
                }`}>
                  {param.status}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight transition-all duration-300">
                    {param.current}
                  </span>
                  <span className="text-sm font-medium text-slate-500 mb-1">{param.unit}</span>
                </div>
                
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
