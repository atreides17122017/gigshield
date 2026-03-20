import { useState } from 'react';
import { BellRing, Smartphone, Mail, Map, BarChart3, Globe, Moon, Shield as ShieldIcon, Trash2 } from 'lucide-react';

export default function Settings() {
  const [toggles, setToggles] = useState({
    push: true,
    sms: true,
    email: false,
    location: true,
    analytics: false,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ label, desc, stateKey, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 rounded-xl px-2 -mx-2 transition-colors">
      <div className="flex items-start gap-3">
        {Icon && <div className="mt-0.5 text-slate-400"><Icon className="w-5 h-5" /></div>}
        <div>
          <p className="font-medium text-slate-900 text-sm">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <button 
        onClick={() => handleToggle(stateKey)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          toggles[stateKey as keyof typeof toggles] ? 'bg-primary-500' : 'bg-slate-200'
        }`}
      >
        <span 
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            toggles[stateKey as keyof typeof toggles] ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-0 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">App Settings</h1>
        <p className="text-slate-500 mt-1">Configure your app experience and privacy.</p>
      </div>

      <div className="space-y-6">
        
        {/* Notifications */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BellRing className="w-4 h-4 text-primary-500" /> Alert Preferences
          </h2>
          <div className="space-y-1">
            <ToggleSwitch label="Push Notifications" desc="Instant alerts for active disruption triggers." stateKey="push" icon={Smartphone} />
            <ToggleSwitch label="SMS Alerts" desc="Critical alerts via text message." stateKey="sms" icon={ShieldIcon} />
            <ToggleSwitch label="Email Summaries" desc="Weekly coverage and claim summaries." stateKey="email" icon={Mail} />
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldIcon className="w-4 h-4 text-primary-500" /> Privacy & Data
          </h2>
          <div className="space-y-1">
            <ToggleSwitch label="Background Location" desc="Required for live weather tracking in your exact zone." stateKey="location" icon={Map} />
            <ToggleSwitch label="Anonymous Analytics" desc="Help us improve the app by sharing usage data." stateKey="analytics" icon={BarChart3} />
          </div>
        </section>

        {/* App Preferences */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary-500" /> Application settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none text-sm text-slate-700 max-w-xs bg-slate-50">
                <option>English</option>
                <option>Hindi (हिंदी)</option>
                <option>Telugu (తెలుగు)</option>
                <option>Tamil (தமிழ்)</option>
              </select>
            </div>
            
            <div className="pt-2">
              <ToggleSwitch label="Dark Mode" desc="Switch app to dark appearance (Mock)" stateKey="darkMode" icon={Moon} />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50/50 rounded-3xl p-6 border border-red-100 shadow-sm mt-8">
          <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-4">Danger Zone</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="font-medium text-red-900 text-sm">Delete Account</p>
              <p className="text-xs text-red-700 mt-1 max-w-sm">Permanently delete your account, claims history, and active subscriptions.</p>
            </div>
            <button className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
