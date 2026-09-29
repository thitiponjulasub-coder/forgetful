import React, { useState } from 'react';
import {
  Archive,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Plus,
  Battery,
  Navigation,
  Trash2,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';
import { ReminderItem } from '../types';
import { sound, speakThaiTTS } from '../utils/soundAndTTS';

interface HomeScreenProps {
  items: ReminderItem[];
  onToggleResolve: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onTriggerAlert: (item: ReminderItem) => void;
  onAddNew: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  items,
  onToggleResolve,
  onDeleteItem,
  onTriggerAlert,
  onAddNew,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pingingItemId, setPingingItemId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
        ? !item.isResolved
        : item.isResolved;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handlePingTag = (item: ReminderItem) => {
    setPingingItemId(item.id);
    sound.playRadarPing();
    setTimeout(() => {
      sound.playRadarPing();
    }, 400);

    setTimeout(() => {
      setPingingItemId(null);
    }, 1200);
  };

  const activeCount = items.filter((i) => !i.isResolved).length;

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Top Welcome / Status Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md shadow-blue-500/20 relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-200 bg-white/10 px-2 py-0.5 rounded-full inline-block mb-1.5">
              ระบบตรวจจับและเตือนความจำ
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              สิ่งของที่กำลังติดตาม
            </h2>
            <p className="text-xs text-blue-100 mt-1">
              มี {activeCount} รายการที่กำลังดูแลและเชื่อมต่อ Smart Tag
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Quick Simulator Action */}
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs text-blue-100">ทดสอบระบบตรวจจับ:</span>
          <button
            type="button"
            onClick={() => {
              const active = items.find((i) => !i.isResolved) || items[0];
              if (active) onTriggerAlert(active);
            }}
            className="text-xs font-bold bg-white text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 shadow-xs transition active:scale-95 flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>จำลองเดินลืมของ</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-2">
        {/* Search Bar */}
        <div className="relative flex items-center bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="ค้นหาชื่อของ หรือสถานที่เก็บ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            ทั้งหมด ({items.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              filter === 'active'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            กำลังติดตาม ({activeCount})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              filter === 'resolved'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            หยิบแล้ว ({items.length - activeCount})
          </button>
        </div>
      </div>

      {/* Item List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">ไม่พบรายการสิ่งของ</h3>
              <p className="text-xs text-slate-500 mt-1">
                คุณสามารถกดปุ่มเครื่องหมายบวกเพื่อเพิ่มรายการสิ่งของใหม่
              </p>
            </div>
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มรายการสิ่งของ</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 ${
                item.isResolved
                  ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                  : 'border-slate-200/90 shadow-xs hover:border-blue-300'
              }`}
            >
              {/* Top Row: Title, Category Badge, Check button */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.isResolved
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <Archive className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-base ${
                          item.isResolved
                            ? 'text-slate-500 line-through'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {item.isResolved && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          หยิบแล้ว
                        </span>
                      )}
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mark as Picked Up Checkbox Button */}
                <button
                  type="button"
                  onClick={() => onToggleResolve(item.id)}
                  title={item.isResolved ? 'เปลี่ยนเป็นยังไม่หยิบ' : 'ยืนยันว่าหยิบของแล้ว'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90 ${
                    item.isResolved
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-400'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Status Meta Info */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                {/* Reminder Schedule */}
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <div className="text-[10px] text-slate-400">เวลาเตือน</div>
                    <div className="font-semibold text-slate-800">
                      {item.remindTimeHour}:{item.remindTimeMinute} น.
                    </div>
                  </div>
                </div>

                {/* Proximity Distance & Tag Info */}
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <div className="text-[10px] text-slate-400">Smart Tag (BLE)</div>
                    <div className="font-semibold text-emerald-700 flex items-center gap-1">
                      <span>{item.currentDistanceMeters} ม.</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (รัศมี {item.proximityDistance}ม.)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Item */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  {/* Ping Tag button */}
                  <button
                    type="button"
                    onClick={() => handlePingTag(item)}
                    disabled={pingingItemId === item.id}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                      pingingItemId === item.id
                        ? 'bg-emerald-100 text-emerald-700 animate-bounce'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{pingingItemId === item.id ? 'กำลังส่งเสียง...' : 'ส่งเสียงเรียก'}</span>
                  </button>

                  {/* Speak Name button */}
                  {item.ttsEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        speakThaiTTS(
                          `อย่าลืม${item.title}${item.location ? ` ที่${item.location}` : ''}`
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3 text-slate-500" />
                      <span>พูด</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onTriggerAlert(item)}
                    className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold px-2 py-1 rounded-lg"
                  >
                    ทดสอบเตือน
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                    title="ลบรายการ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
