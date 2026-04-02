import { useState } from 'react';
<<<<<<< HEAD
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
=======
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
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
<<<<<<< HEAD
  X,
  ListVideo,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Chatbot from './Chatbot';
=======
  X
} from 'lucide-react';
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/plans', label: 'Subscription Plans', icon: ShieldCheck },
<<<<<<< HEAD
  { path: '/compare', label: 'Compare Plans', icon: ListVideo },
=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  { path: '/monitor', label: 'Disruption Monitor', icon: Activity },
  { path: '/calculator', label: 'Payout Calculator', icon: Calculator },
  { path: '/history', label: 'Claim History', icon: History },
  { path: '/notifications', label: 'Notifications', icon: Bell },
<<<<<<< HEAD
  { path: '/coverage', label: 'Coverage', icon: AlertCircle },
  { path: '/faq', label: 'FAQ', icon: HelpCircle },
=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-6">
<<<<<<< HEAD
        <div className="w-8 h-8 rounded-lg outline-none bg-primary-600 flex items-center justify-center text-white font-bold">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900">
=======
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
          G
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
          GigShield
        </span>
      </div>

<<<<<<< HEAD
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
=======
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
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
<<<<<<< HEAD
                    ? 'bg-primary-50 border-l-4 border-primary-600 text-primary-600 font-medium'
                    : 'text-slate-600 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
=======
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

<<<<<<< HEAD
      <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
=======
      <div className="p-4 border-t border-slate-100">
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
<<<<<<< HEAD
        <div className="flex justify-center flex-wrap gap-2 text-[11px] text-slate-400 font-medium">
          <Link to="/terms" className="hover:text-slate-600">Terms & Conditions</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
        </div>
=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
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
<<<<<<< HEAD
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col h-full overflow-y-auto">
=======
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
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
<<<<<<< HEAD
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen relative">
=======
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
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

<<<<<<< HEAD
          <div className="hidden lg:block"></div>
=======
          <div className="hidden lg:block">
            {/* Contextual topbar space (e.g. Page Title based on route) */}
          </div>
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium shadow-sm cursor-pointer ring-2 ring-white">
<<<<<<< HEAD
              {user?.name?.charAt(0).toUpperCase() || 'U'}
=======
              {user.name.charAt(0).toUpperCase() || 'U'}
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
            </div>
          </div>
        </header>

        {/* Page Content */}
<<<<<<< HEAD
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
=======
        <div className="flex-1 p-4 lg:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
      </main>
    </div>
  );
}
