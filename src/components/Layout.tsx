import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Activity, 
  Calculator, 
  History, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ListVideo,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Chatbot from './Chatbot';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/plans', label: 'Subscription Plans', icon: ShieldCheck },
  { path: '/compare', label: 'Compare Plans', icon: ListVideo },
  { path: '/monitor', label: 'Disruption Monitor', icon: Activity },
  { path: '/calculator', label: 'Payout Calculator', icon: Calculator },
  { path: '/history', label: 'Claim History', icon: History },
  { path: '/coverage', label: 'Coverage', icon: AlertCircle },
  { path: '/faq', label: 'FAQ', icon: HelpCircle },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user, logout, notifications } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-6">
        <div className="w-8 h-8 rounded-lg outline-none bg-primary-600 flex items-center justify-center text-white font-bold">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900">
          GigShield
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 border-l-4 border-primary-600 text-primary-600 font-medium'
                    : 'text-slate-600 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
        <div className="flex justify-center flex-wrap gap-2 text-[11px] text-slate-400 font-medium">
          <Link to="/terms" className="hover:text-slate-600">Terms & Conditions</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-slate-200 bg-white z-50">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col h-full overflow-y-auto">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen relative">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg text-slate-900">GigShield</span>
          </div>

          <div className="hidden lg:block"></div>

          <div className="flex items-center gap-3 relative">
            <button 
               onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
               className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications?.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            
            {isNotifOpen && (
              <div className="absolute top-full right-10 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50 font-semibold text-sm text-slate-800">Notifications</div>
                <div className="max-h-64 overflow-y-auto outline-none p-2 space-y-1">
                   {notifications?.length > 0 ? notifications.map((n, i) => (
                     <div key={i} className="p-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-600 transition-colors">
                       {n.message}
                     </div>
                   )) : <div className="p-4 text-center text-sm text-slate-400">No new notifications</div>}
                </div>
              </div>
            )}

            <button 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
              className="h-8 w-8 outline-none rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium shadow-sm cursor-pointer ring-2 ring-white hover:ring-primary-100 transition-all"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col p-1">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"><User className="w-4 h-4"/> Profile</Link>
                <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"><Settings className="w-4 h-4"/> Settings</Link>
                <Link to="/history" onClick={() => setIsProfileOpen(false)} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"><History className="w-4 h-4"/> Claims</Link>
                <button onClick={handleLogout} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 text-left transition-colors"><LogOut className="w-4 h-4"/> Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-x-hidden max-w-7xl mx-auto w-full flex flex-col">
          <div className="flex-1">
             <Outlet />
          </div>
          
          <footer className="mt-20 py-8 border-t border-slate-200 w-full animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                GigShield is a parametric income protection product designed in alignment with IRDAI microinsurance guidelines. Coverage is for income loss only. Terms & Conditions apply.
              </p>
              <div className="flex justify-center flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Link to="/coverage" className="hover:text-primary-600 transition-colors">Coverage</Link>
                <Link to="/faq" className="hover:text-primary-600 transition-colors">FAQ</Link>
                <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Global Chatbot */}
        <Chatbot />
      </main>
    </div>
  );
}
