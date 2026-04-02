import { useNavigate } from 'react-router-dom';
import { Check, X, Shield } from 'lucide-react';

const features = [
  { name: 'Rainfall coverage', basic: true, standard: true, premium: true },
  { name: 'Platform outage coverage', basic: true, standard: true, premium: true },
  { name: 'Extreme heat coverage', basic: false, standard: true, premium: true },
  { name: 'AQI / Pollution coverage', basic: false, standard: true, premium: true },
  { name: 'Curfew / Strike coverage', basic: false, standard: false, premium: true },
  { name: 'Instant automatic payouts', basic: false, standard: false, premium: true },
  { name: 'Basic fraud protection', basic: true, standard: true, premium: true },
  { name: 'Advanced Trust Score benefit', basic: false, standard: true, premium: true },
  { name: 'Priority claim processing', basic: false, standard: true, premium: true },
  { name: 'Highest weekly payout cap', basic: false, standard: false, premium: true },
  { name: 'IRDAI aligned coverage', basic: true, standard: true, premium: true }
];

export default function Compare() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 lg:pb-0 animate-fade-in">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Compare Our Protection Plans</h1>
        <p className="text-slate-500 text-lg">Find the right coverage for how you ride</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-6 min-w-[200px] w-1/3 bg-slate-50 text-slate-500 font-semibold align-bottom">Feature</th>
                <th className="p-6 min-w-[150px] text-center border-l border-slate-100">
                  <Shield className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <div className="text-lg font-bold text-slate-900">Basic Shield</div>
                </th>
                <th className="p-6 min-w-[150px] text-center border-l border-slate-100 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-0 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-b-xl">
                    Most Popular
                  </div>
                  <Shield className="w-8 h-8 mx-auto text-primary-500 mb-2 mt-4" />
                  <div className="text-lg font-bold text-primary-700">Standard Shield</div>
                </th>
                <th className="p-6 min-w-[150px] text-center border-l border-slate-100">
                  <Shield className="w-8 h-8 mx-auto text-accent-500 mb-2" />
                  <div className="text-lg font-bold text-accent-700">Premium Shield</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 text-sm font-medium text-slate-700 bg-white">{f.name}</td>
                  <td className="p-4 text-center border-l border-slate-100 bg-white">
                    {f.basic ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-4 text-center border-l border-slate-100 bg-primary-50/20">
                    {f.standard ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-4 text-center border-l border-slate-100 bg-white">
                    {f.premium ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-6 bg-slate-50 border-r border-slate-100"></td>
                <td className="p-6 text-center border-slate-100">
                  <button onClick={() => navigate('/plans')} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-medium text-sm transition-colors">Subscribe Now</button>
                </td>
                <td className="p-6 text-center border-l border-slate-100 bg-primary-50/20 px-6">
                  <button onClick={() => navigate('/plans')} className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm">Subscribe Now</button>
                </td>
                <td className="p-6 text-center border-l border-slate-100">
                  <button onClick={() => navigate('/plans')} className="w-full py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm">Subscribe Now</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center pt-6">
        <p className="text-xs text-slate-500 font-medium">All plans are IRDAI aligned parametric income protection products. Coverage is for loss of working income only.</p>
      </div>
    </div>
  );
}
