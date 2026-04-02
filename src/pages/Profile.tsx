<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState } from 'react';
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
import { useStore } from '../store';
import { Save, User as UserIcon, MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react';

export default function Profile() {
<<<<<<< HEAD
  const { user, token, updateProfile } = useStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    platform: user?.platform || 'Zomato',
    zone: user?.zone || 'Delhi',
    dailyIncome: user?.dailyIncome || 500,
    workingHours: user?.workingHours || 8,
=======
  const { user, updateProfile } = useStore();
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    platform: user.platform,
    zone: user.zone,
    dailyIncome: user.dailyIncome,
    workingHours: user.workingHours,
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  });

  const [saving, setSaving] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json().catch(() => ({})))
      .then(d => {
        const data = d.data || d;
        setFormData({
          name: data?.name || user?.name || '',
          email: data?.email || user?.email || '',
          platform: data?.platform || user?.platform || 'Zomato',
          zone: data?.zone || user?.zone || 'Delhi',
          dailyIncome: data?.daily_income || user?.dailyIncome || 500,
          workingHours: data?.working_hours || user?.workingHours || 8
        });
      })
      .catch(console.error);
  }, [token, user]);

=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyIncome' || name === 'workingHours' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setSaving(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-0 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Partner Profile</h1>
        <p className="text-slate-500 mt-1">Your coverage and payouts are calculated based on this data.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        
        <div className="flex items-center gap-5 mb-8 border-b border-slate-100 pb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-md ring-4 ring-primary-50">
<<<<<<< HEAD
            {formData.name ? formData.name.charAt(0).toUpperCase() : <UserIcon className="w-10 h-10" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{formData.name || 'Delivery Partner'}</h2>
=======
            {formData.name.charAt(0).toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{formData.name || 'Partner Name'}</h2>
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
            <p className="text-slate-500 text-sm mt-0.5">{formData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4 whitespace-nowrap"><Briefcase className="w-4 h-4 text-slate-400" /> Work Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 bg-slate-50" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500">Delivery Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all text-slate-700">
                <option value="Zomato">Zomato</option>
                <option value="Swiggy">Swiggy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Primary Delivery Zone</label>
              <select name="zone" value={formData.zone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all text-slate-700">
                <option value="Adyar">Adyar (High Risk)</option>
                <option value="T Nagar">T Nagar (Medium Risk)</option>
                <option value="Velachery">Velachery (High Risk)</option>
                <option value="Anna Nagar">Anna Nagar (Low Risk)</option>
                <option value="Tambaram">Tambaram (Medium Risk)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4 whitespace-nowrap"><IndianRupee className="w-4 h-4 text-slate-400" /> Income Setup</h3>
            
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-4">
              <p className="text-xs text-primary-800 font-medium">This information is critical. We use this to calculate your exact payout during disruptions.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Average Daily Income (₹)</label>
              <input type="number" name="dailyIncome" value={formData.dailyIncome} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Working Hours / Day</label>
              <input type="number" name="workingHours" value={formData.workingHours} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" />
              <p className="text-[11px] text-slate-400 mt-1">Calculated hourly rate: ₹{Math.round(formData.dailyIncome / (formData.workingHours || 1))}/hr</p>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${saving ? 'bg-primary-400 cursor-wait text-white' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md active:scale-95'}`}
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Profile Updates</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
