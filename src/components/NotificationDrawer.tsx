import React from 'react';
import { Bell, Check, Clock, Radio, Volume2, X } from 'lucide-react';
import { ReminderItem } from '../types';
import { sound, speakThaiTTS } from '../utils/soundAndTTS';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReminderItem[];
  onTriggerAlert: (item: ReminderItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onTriggerAlert,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xs bg-white h-full shadow-2xl p-4 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div className="space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">การแจ้งเตือนล่าสุด</h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                    {item.remindTimeHour}:{item.remindTimeMinute} น.
                  </span>
                </div>
                {item.location && (
                  <p className="text-[11px] text-slate-500">สถานที่: {item.location}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Smart Tag อยู่ในระยะ
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onTriggerAlert(item);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    ทดสอบเตือน
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              sound.playChime();
              speakThaiTTS('ระบบแจ้งเตือน RemindItem ทำงานเป็นปกติ');
            }}
            className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>ทดสอบเสียงกระดิ่งเตือน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
