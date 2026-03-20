import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import type { User } from '../store';
import { ArrowRight, UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    platform: 'Zomato',
    zone: 'Anna Nagar',
    workingHours: 8,
    upiId: ''
  });
  const [password, setPassword] = useState('');
  
  const register = useStore(state => state.register);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workingHours' ? Number(value) : value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate assigning an AI trust score
    const aiTrustScore = Math.floor(Math.random() * 41) + 50; // Generate between 50 and 90
    
    register({
      ...formData,
      trustScore: aiTrustScore
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-400/20 blur-[100px]" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Join GigShield
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Create an account to protect your daily earnings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50" placeholder="Rahul Kumar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50" placeholder="rahul@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50" placeholder="+91 9999999999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
                <input required type="text" name="upiId" value={formData.upiId} onChange={handleChange} className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50" placeholder="rahul@upi" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Platform</label>
                <select name="platform" value={formData.platform} onChange={handleChange} className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50">
                  <option value="Zomato">Zomato</option>
                  <option value="Swiggy">Swiggy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Zone</label>
                <select name="zone" value={formData.zone} onChange={handleChange} className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50">
                  <option value="Adyar">Adyar (High Risk)</option>
                  <option value="T Nagar">T Nagar (Medium Risk)</option>
                  <option value="Velachery">Velachery (High Risk)</option>
                  <option value="Anna Nagar">Anna Nagar (Low Risk)</option>
                  <option value="Tambaram">Tambaram (Medium Risk)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                <span>Weekly Work Hours</span>
                <span className="text-primary-600 font-bold">{formData.workingHours} hrs/day</span>
              </label>
              <input 
                type="range" name="workingHours" min="2" max="14" step="1"
                value={formData.workingHours} onChange={handleChange}
                className="w-full accent-primary-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <input required type="password" className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50/50" placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all active:scale-[0.98]"
              >
                Register & Check Trust Score <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm font-medium">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-bold">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
