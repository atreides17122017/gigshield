<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
import { useStore } from '../store';
import { FileText, CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react';

export default function History() {
<<<<<<< HEAD
  const { token } = useStore();
  const [claims, setClaims] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total_claims: 0, total_paid: 0, hours_protected: 0, success_rate: 100 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('http://localhost:5000/api/claims', { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json().catch(() => ({}))),
      fetch('http://localhost:5000/api/claims/stats', { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json().catch(() => ({})))
    ]).then(([claimsJson, statsJson]) => {
      setClaims(claimsJson.data || claimsJson || []);
      setStats(statsJson.data || statsJson || { total_claims: 0, total_paid: 0, hours_protected: 0, success_rate: 100 });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  const totalPaid = stats.total_paid;
  const totalHours = stats.hours_protected;
=======
  const { claims } = useStore();

  const totalPaid = claims.reduce((acc, c) => c.status === 'Approved' ? acc + c.amount : acc, 0);
  const totalHours = claims.reduce((acc, c) => acc + c.lostHours, 0);
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-0 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Claim History</h1>
        <p className="text-slate-500 mt-1">Review your past parametric insurance payouts.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Claims', value: claims.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Paid', value: `₹${totalPaid}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Hours Protected', value: `${totalHours} hrs`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
<<<<<<< HEAD
          { label: 'Success Rate', value: `${stats.success_rate || 100}%`, icon: CheckCircle2, color: 'text-primary-500', bg: 'bg-primary-50' }
=======
          { label: 'Success Rate', value: '100%', icon: CheckCircle2, color: 'text-primary-500', bg: 'bg-primary-50' }
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Claim ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Lost Hours</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
<<<<<<< HEAD
              {!loading && claims.length > 0 ? claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">CLM-{claim.id}</td>
                  <td className="px-6 py-4">{new Date(claim.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {claim.trigger_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{claim.disruption_hours || 4} hrs</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{claim.amount}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                      claim.status.includes('approved') || claim.status.includes('success') ? 'bg-green-50 text-green-700 border-green-200' :
                      claim.status.includes('pending') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {claim.status.includes('approved') && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {claim.status.includes('pending') && <Clock className="w-3.5 h-3.5" />}
                      {claim.status.includes('failed') || claim.status.includes('rejected') && <XCircle className="w-3.5 h-3.5" />}
                      {claim.status.replace('_', ' ')}
=======
              {claims.length > 0 ? claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">{claim.id}</td>
                  <td className="px-6 py-4">{claim.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {claim.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{claim.lostHours} hrs</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{claim.amount}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      claim.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      claim.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {claim.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {claim.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {claim.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {claim.status}
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No claims history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
