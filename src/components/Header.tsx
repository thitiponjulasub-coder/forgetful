import React from 'react';
import { Bell, User as UserIcon, Cloud, CloudOff } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  onOpenNotifications?: () => void;
  notificationCount?: number;
  onOpenProfile?: () => void;
  currentUser: User | null;
  isFirebaseConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  notificationCount = 0,
  onOpenProfile,
  currentUser,
  isFirebaseConnected = true,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      {/* Left: App Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white flex-shrink-0">
          <Bell className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
              RemindItem
            </h1>
            {isFirebaseConnected && (
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"
                title="Firebase Cloud Synced"
              />
            )}
          </div>
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
          className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition active:scale-95 cursor-pointer"
          title="การแจ้งเตือน"
          aria-label="แจ้งเตือน"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* User Profile Avatar / Sign-in */}
        <button
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-xs transition active:scale-95 overflow-hidden cursor-pointer border-2 border-white"
          title={currentUser ? currentUser.displayName || 'โปรไฟล์ผู้ใช้งาน' : 'เข้าสู่ระบบ'}
          aria-label="โปรไฟล์"
        >
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'User'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : currentUser ? (
            <span className="text-xs font-bold uppercase">
              {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
            </span>
          ) : (
            <UserIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
