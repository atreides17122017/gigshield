import { CloudRain, Zap, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/70 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="Insurix Logo" className="w-10 h-10 rounded-lg object-contain bg-white shadow-lg shadow-primary-500/20" />
            <span className="text-2xl font-black tracking-tight text-slate-900">Insurix</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">Log In</Link>
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95">Get Protected</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">

          {/* Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-200 text-accent-700 text-sm font-bold animate-fade-in">
              <Zap className="w-4 h-4" /> AI-Calculated Parametric Insurance
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Don't let <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary-500">bad weather</span> stop your income.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              The first microinsurance platform for Swiggy and Zomato delivery partners in India. Automatic triggers, zero claim filing, instant UPI payouts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1">
                Protect Your Income Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-float lg:h-[500px] flex items-center justify-center">
            {/* Visual Glass Card */}
            <div className="absolute w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-2xl shadow-primary-900/10 z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Heavy Rainfall Detected</h4>
                  <p className="text-sm opacity-80">Threshold crossed: 65mm/hr</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <h3 className="font-black text-2xl text-center text-slate-900">₹400 Payout Initiated</h3>
                <p className="text-center text-slate-500 text-sm font-medium">Auto-credited to your UPI account</p>
              </div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary-400 rounded-full blur-[60px] opacity-60"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent-400 rounded-full blur-[70px] opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900">How Insurix Works</h2>
            <p className="text-lg text-slate-500">Parametric coverage means you never have to argue with adjusters or submit manual proof. It's math, not magic.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Premium Pricing</h3>
              <p className="text-slate-600 leading-relaxed">Our Machine Learning models evaluate your delivery zone's specific weather risks and calculate fair, transparent weekly premiums just for you.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-accent-200 hover:bg-accent-50/30 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="text-accent-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automatic Disruption Triggers</h3>
              <p className="text-slate-600 leading-relaxed">Whether it's an extreme heatwave (43°C+), hazardous AQI pollution (&gt;300), or server outages, the API systems detect it instantly.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Cash Payouts</h3>
              <p className="text-slate-600 leading-relaxed">When the trigger conditions are met, your lost hourly income is calculated and automatically remitted via UPI before the day is over.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / IRDAI */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center items-center gap-2 mb-6 opacity-50">
            <img src="/favicon.png" alt="Insurix Logo" className="w-8 h-8 rounded-lg object-contain bg-white" />
            <span className="text-2xl font-black text-white tracking-tight">Insurix</span>
          </div>

          <p className="max-w-3xl mx-auto text-sm leading-relaxed">
            Insurix is a parametric income protection product designed strictly in alignment with IRDAI microinsurance guidelines. Coverage is explicitly for income loss only and does not serve as medical, health, or vehicle replacement insurance.
            Losses arising from vehicle repairs, health emergencies, war, civil conflict, and government-declared pandemics are permanently excluded.
          </p>

          <div className="pt-8 border-t border-slate-800 flex justify-center gap-6 text-sm">
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/coverage" className="hover:text-white transition-colors">Coverage Details</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
