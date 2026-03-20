import { useStore } from '../store';
import { Bell, CloudLightning, ShieldCheck, DollarSign, CalendarHeart } from 'lucide-react';

export default function Notifications() {
  const { notifications } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <CloudLightning className="w-5 h-5 text-red-600" />;
      case 'success': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'info': return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'warning': return <CalendarHeart className="w-5 h-5 text-amber-600" />;
      default: return <Bell className="w-5 h-5 text-primary-600" />;
    }
  };

  const getBgInfo = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-red-100 border-red-200';
      case 'success': return 'bg-green-100 border-green-200';
      case 'info': return 'bg-blue-100 border-blue-200';
      case 'warning': return 'bg-amber-100 border-amber-200';
      default: return 'bg-primary-100 border-primary-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-0 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-slate-500 mt-1">Alerts and updates regarding your GigShield coverage.</p>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`p-3 rounded-full border ${getBgInfo(note.type)} shrink-0`}>
              {getIcon(note.type)}
            </div>
            <div className="flex-1 mt-1">
              <p className="text-slate-900 font-medium">{note.message}</p>
              <p className="text-xs text-slate-500 mt-1.5 flex flex-wrap gap-3">
                <span>Just now</span>
                <span className="capitalize">{note.type}</span>
              </p>
            </div>
          </div>
        )) : (
          <div className="text-center py-16 bg-white border border-slate-200 border-dashed rounded-3xl">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No new notifications</p>
          </div>
        )}
        
        {/* Mock unread old notification */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-start gap-4">
          <div className="p-3 rounded-full border bg-amber-100 border-amber-200 shrink-0">
            <CalendarHeart className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 mt-1">
            <p className="text-slate-700 line-through decoration-slate-300">Renewal reminder: Your Basic Shield plan expires in 2 days.</p>
            <p className="text-xs text-slate-400 mt-1.5 flex flex-wrap gap-3">
              <span>2 days ago</span>
              <span>Warning</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
