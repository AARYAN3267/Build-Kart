import React, { useState } from 'react';
import { Bell, Check, Package, AlertTriangle, Truck, Sparkles } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, setNotifications } = useAppData();
  const { role, currentUser } = useAuth();

  // Filter notifications for current role/user
  const relevantNotifs = notifications.filter((n) => {
    if (role === 'vendor') {
      return n.targetRole === 'vendor' && (!n.vendorId || n.vendorId === currentUser?.id);
    }
    if (role === 'client') {
      return n.targetRole === 'client' && (!n.clientId || n.clientId === currentUser?.id);
    }
    return true;
  });

  const unreadCount = relevantNotifs.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notificationService.markAllAsRead(notifications, role);
    // Directly updating via central state
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'transport':
        return <Truck className="w-4 h-4 text-emerald-500" />;
      case 'recovery':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-[#102A43] hover:bg-slate-100 transition focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#102A43]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {relevantNotifs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No notifications yet
                </div>
              ) : (
                relevantNotifs.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-slate-50 transition flex items-start gap-3 ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#102A43] truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                Simulated Enterprise Event Stream (SAP Event Mesh Ready)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
