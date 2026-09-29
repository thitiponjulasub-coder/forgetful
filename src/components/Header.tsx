import React from 'react';
import { Bell, User, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications?: () => void;
  notificationCount?: number;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  notificationCount = 1,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      {/* Left: App Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white flex-shrink-0">
          <Bell className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
            RemindItem
          </h1>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-none">
            เตือนของและสิ่งสำคัญ
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition active:scale-95"
          title="การแจ้งเตือน"
          aria-label="แจ้งเตือน"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-xs transition active:scale-95"
          title="โปรไฟล์ผู้ใช้งาน"
          aria-label="โปรไฟล์"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
