import React, { useEffect } from 'react';
import { AlertTriangle, Bell, Check, Clock, Volume2, X } from 'lucide-react';
import { ReminderItem } from '../types';
import { sound, speakThaiTTS } from '../utils/soundAndTTS';

interface AlertModalProps {
  item: ReminderItem;
  onClose: () => void;
  onResolve: () => void;
  onSnooze: (minutes: number) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  item,
  onClose,
  onResolve,
  onSnooze,
}) => {
  useEffect(() => {
    // Sound & TTS on open
    sound.playAlarm();
    if (item.ttsEnabled) {
      setTimeout(() => {
        speakThaiTTS(`อย่าลืม${item.title}${item.location ? ` ที่${item.location}` : ''}`);
      }, 500);
    }
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Pulsing Warning Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="absolute inset-0 rounded-full bg-rose-400 opacity-30 animate-ping pointer-events-none" />
          </div>
        </div>

        {/* Title & Location */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full inline-block">
            ตรวจพบการเดินห่าง / ถึงเวลาเตือน
          </span>
          <h3 className="text-2xl font-bold text-slate-900 pt-1">
            อย่าลืม &ldquo;{item.title}&rdquo; !
          </h3>
          {item.location && (
            <p className="text-sm font-semibold text-blue-600 bg-blue-50 py-1 px-3 rounded-lg inline-block">
              วางไว้ที่: {item.location}
            </p>
          )}
          <p className="text-xs text-slate-500 pt-1">
            Smart Tag ตรวจพบระยะห่างเกินรัศมี {item.proximityDistance} เมตร หรือถึงเวลากำหนดเตือนแล้ว
          </p>
        </div>

        {/* TTS Replay Button */}
        {item.ttsEnabled && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                speakThaiTTS(`อย่าลืม${item.title}${item.location ? ` ที่${item.location}` : ''}`);
              }}
              className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>ฟังเสียงเตือนซ้ำ</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* Picked up (Resolved) */}
          <button
            type="button"
            onClick={onResolve}
            className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-[0.98]"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>ฉันหยิบของแล้ว</span>
          </button>

          {/* Snooze (เลื่อนเตือนอีก 5 นาที) */}
          <button
            type="button"
            onClick={() => onSnooze(5)}
            className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>เตือนซ้ำอีก 5 นาที (Snooze)</span>
          </button>

          {/* Dismiss */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-1 text-slate-400 hover:text-slate-600 text-xs font-medium"
          >
            ปิดหน้าต่างเตือน
          </button>
        </div>
      </div>
    </div>
  );
};
