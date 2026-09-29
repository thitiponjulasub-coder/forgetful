import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Archive,
  MapPin,
  Bell,
  Clock,
  Repeat,
  Radio,
  Bluetooth,
  Zap,
  Volume2,
  Mic,
  Save,
  ChevronDown,
  Check,
  Play,
  VolumeX,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ReminderItem, SmartTag } from '../types';
import { testReminderTTS, sound } from '../utils/soundAndTTS';

interface AddItemScreenProps {
  onSaveItem: (item: Omit<ReminderItem, 'id' | 'createdAt' | 'isResolved'>) => void;
  onCancel: () => void;
  tags: SmartTag[];
  onOpenTagSelector: () => void;
  selectedTag: SmartTag;
}

export const AddItemScreen: React.FC<AddItemScreenProps> = ({
  onSaveItem,
  onCancel,
  tags,
  onOpenTagSelector,
  selectedTag,
}) => {
  // Form State
  const [title, setTitle] = useState('กุญแจ');
  const [location, setLocation] = useState('');
  
  // Date State
  const [dateSelection, setDateSelection] = useState<'today' | 'tomorrow' | 'weekend'>('today');
  const [displayDate, setDisplayDate] = useState('วันนี้, 27 มี.ค. 2025');
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  // Time State
  const [hour, setHour] = useState('18');
  const [minute, setMinute] = useState('00');
  const [timePreset, setTimePreset] = useState<'morning' | 'noon' | 'evening'>('evening');

  // Repeat Snooze State
  const [repeatPreset, setRepeatPreset] = useState<'none' | '1m' | '5m' | '10m' | 'custom'>('5m');
  const [customRepeatMinutes, setCustomRepeatMinutes] = useState(3);

  // Proximity & Tracking State
  const [proximityEnabled, setProximityEnabled] = useState(true);
  const [proximityDistance, setProximityDistance] = useState<number>(10);
  const [customDistance, setCustomDistance] = useState<number>(15);
  const [isCustomDistance, setIsCustomDistance] = useState(false);
  const [trackingType, setTrackingType] = useState<'ble' | 'gps'>('ble');

  // Notification Options
  const [instantNotification, setInstantNotification] = useState(true);
  const [notify15MinBefore, setNotify15MinBefore] = useState(true);

  // TTS State
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Handlers for quick date preset
  const handleDatePreset = (preset: 'today' | 'tomorrow' | 'weekend') => {
    setDateSelection(preset);
    sound.playChime();
    if (preset === 'today') {
      setDisplayDate('วันนี้, 27 มี.ค. 2025');
    } else if (preset === 'tomorrow') {
      setDisplayDate('พรุ่งนี้, 28 มี.ค. 2025');
    } else {
      setDisplayDate('เสาร์นี้, 29 มี.ค. 2025');
    }
  };

  // Handlers for quick time preset
  const handleTimePreset = (preset: 'morning' | 'noon' | 'evening') => {
    setTimePreset(preset);
    sound.playChime();
    if (preset === 'morning') {
      setHour('08');
      setMinute('00');
    } else if (preset === 'noon') {
      setHour('12');
      setMinute('00');
    } else {
      setHour('18');
      setMinute('00');
    }
  };

  // Play preview speech
  const handlePreviewTTS = () => {
    if (!title.trim()) return;
    setIsPlayingTTS(true);
    testReminderTTS(title || 'กุญแจ', location || 'ลิ้นชักโต๊ะทำงาน', (speaking) => {
      setIsPlayingTTS(speaking);
    });
  };

  // Save handler
  const handleSave = () => {
    if (!title.trim()) return;
    sound.playSuccess();

    onSaveItem({
      title: title.trim(),
      location: location.trim(),
      category: 'daily',
      remindDate: displayDate,
      remindTimeHour: hour.padStart(2, '0'),
      remindTimeMinute: minute.padStart(2, '0'),
      repeatInterval: repeatPreset,
      customRepeatMinutes: customRepeatMinutes,
      proximityEnabled,
      proximityDistance: isCustomDistance ? customDistance : proximityDistance,
      trackingType,
      bleDeviceId: selectedTag.id,
      bleDeviceName: selectedTag.name,
      bleDeviceStatus: 'connected',
      bleBattery: selectedTag.battery,
      currentDistanceMeters: 3.2,
      instantNotification,
      notify15MinBefore,
      ttsEnabled,
    });
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* 1. Header Banner Card */}
      <div className="bg-gradient-to-br from-[#edf2ff] via-[#e6edff] to-[#dbe6fd] rounded-2xl p-4 sm:p-5 border border-blue-200/60 shadow-xs relative overflow-hidden">
        <div className="absolute right-[-15px] top-[-15px] w-24 h-24 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-blue-700 text-xs font-semibold mb-2.5 border border-blue-100 shadow-xs">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>จัดการของและวันสำคัญ</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          เพิ่มรายการสิ่งของใหม่
        </h2>

        {/* Subtitle */}
        <p className="text-xs text-slate-600 leading-relaxed">
          ตั้งเตือนความจำสิ่งของหรือธุระสำคัญของคุณ เพื่อความสบายใจในทุกวัน
        </p>
      </div>

      {/* 2. Input: ชื่อสิ่งของ / รายการ */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-800 flex items-center gap-1">
            ชื่อสิ่งของ / รายการ <span className="text-rose-500 font-bold">*</span>
          </label>
          <span className="text-slate-400 text-[11px]">ระบุชัดเจน</span>
        </div>
        
        <div className="relative flex items-center bg-white rounded-xl border border-slate-200 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
          <div className="pl-3.5 pr-1 text-slate-400 flex items-center justify-center">
            <Archive className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น กุญแจ, กระเป๋าสตางค์, ยาประจำตัว"
            className="w-full py-3 pr-3.5 pl-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
          />
        </div>

        {/* Quick Suggestions Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar text-xs">
          {['กุญแจ', 'กระเป๋าสตางค์', 'ร่มพับ', 'ยาประจำตัว', 'แว่นตา', 'พาสปอร์ต'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTitle(item);
                sound.playChime();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition ${
                title === item
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              + {item}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Input: สถานที่เก็บ / ตำแหน่งวางของ */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-800">
          สถานที่เก็บ / ตำแหน่งวางของ
        </label>
        
        <div className="relative flex items-center bg-white rounded-xl border border-slate-200 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
          <div className="pl-3.5 pr-1 text-slate-400 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="เช่น ลิ้นชักโต๊ะทำงาน, ตู้เย็นชั้น 2"
            className="w-full py-3 pr-3.5 pl-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
          />
        </div>

        {/* Quick Location Suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar text-xs">
          {['ลิ้นชักโต๊ะทำงาน', 'โต๊ะข้างเตียง', 'ตู้เย็นชั้น 2', 'ราวแขวนหน้าประตู', 'ในกระเป๋าเป้'].map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocation(loc);
                sound.playChime();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition ${
                location === loc
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              + {loc}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Section Card: กำหนดการแจ้งเตือน */}
      <div className="bg-[#f8faff] rounded-2xl p-4 border border-blue-100 shadow-xs space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              กำหนดการแจ้งเตือน
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              เลือกวันเวลาที่ต้องการให้สะกิดเตือน
            </p>
          </div>
        </div>

        {/* 4.1 วันที่แจ้งเตือน */}
        <div className="space-y-2 pt-1 border-t border-blue-100/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">วันที่แจ้งเตือน</span>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              {dateSelection === 'today' ? 'วันนี้' : dateSelection === 'tomorrow' ? 'พรุ่งนี้' : 'สุดสัปดาห์'}
            </span>
          </div>

          {/* Date Selector Display Card */}
          <button
            type="button"
            onClick={() => setShowDatePickerModal(!showDatePickerModal)}
            className="w-full bg-white rounded-xl border border-blue-200 px-3.5 py-2.5 flex items-center justify-between shadow-xs hover:border-blue-400 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{displayDate}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Quick Date Pills */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => handleDatePreset('today')}
              className={`py-1.5 px-3 rounded-full text-xs font-medium transition text-center ${
                dateSelection === 'today'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => handleDatePreset('tomorrow')}
              className={`py-1.5 px-3 rounded-full text-xs font-medium transition text-center ${
                dateSelection === 'tomorrow'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              พรุ่งนี้
            </button>
            <button
              type="button"
              onClick={() => handleDatePreset('weekend')}
              className={`py-1.5 px-3 rounded-full text-xs font-medium transition text-center ${
                dateSelection === 'weekend'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              สุดสัปดาห์นี้
            </button>
          </div>
        </div>

        {/* 4.2 เวลาแจ้งเตือน */}
        <div className="space-y-2 pt-1 border-t border-blue-100/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              เวลาแจ้งเตือน
            </span>
            <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              โหมด 24 ชม.
            </span>
          </div>

          {/* Digital Time Picker Container */}
          <div className="bg-blue-50/70 rounded-xl p-3 border border-blue-100/80">
            <div className="flex items-center justify-center gap-6 mb-1 text-[11px] font-medium text-slate-500">
              <span className="w-16 text-center">ชั่วโมง</span>
              <span className="w-4"></span>
              <span className="w-16 text-center">นาที</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              {/* Hour Input Box */}
              <div className="relative">
                <input
                  type="text"
                  maxLength={2}
                  value={hour}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (Number(val) <= 23 || val === '') {
                      setHour(val);
                      setTimePreset('evening');
                    }
                  }}
                  className="w-18 h-12 bg-white rounded-lg border border-slate-200 text-2xl font-bold text-slate-900 text-center shadow-xs focus:border-blue-500 outline-none"
                />
              </div>

              {/* Colon */}
              <span className="text-2xl font-bold text-slate-400 pb-1">:</span>

              {/* Minute Input Box */}
              <div className="relative">
                <input
                  type="text"
                  maxLength={2}
                  value={minute}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (Number(val) <= 59 || val === '') {
                      setMinute(val);
                      setTimePreset('evening');
                    }
                  }}
                  className="w-18 h-12 bg-white rounded-lg border border-slate-200 text-2xl font-bold text-slate-900 text-center shadow-xs focus:border-blue-500 outline-none"
                />
              </div>

              <span className="text-sm font-semibold text-slate-700 ml-1">น.</span>
            </div>
          </div>

          {/* Quick Time Chips */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => handleTimePreset('morning')}
              className={`py-1.5 px-3 rounded-full text-xs font-medium transition text-center ${
                timePreset === 'morning'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              เช้า 08:00
            </button>
            <button
              type="button"
              onClick={() => handleTimePreset('noon')}
              className={`py-1.5 px-3 rounded-full text-xs font-medium transition text-center ${
                timePreset === 'noon'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              เที่ยง 12:00
            </button>
            <button
              type="button"
              onClick={() => handleTimePreset('evening')}
              className={`py-1.5 px-3 rounded-full text-xs font-medium transition text-center ${
                timePreset === 'evening'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              เย็น 18:00
            </button>
          </div>
        </div>

        {/* 4.3 ความถี่การเตือนซ้ำ (Repeat / Snooze) */}
        <div className="space-y-2 pt-1 border-t border-blue-100/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Repeat className="w-3.5 h-3.5 text-blue-600" />
              <span>ความถี่การเตือนซ้ำ (Repeat / Snooze)</span>
            </div>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              {repeatPreset === 'none'
                ? 'ไม่เตือนซ้ำ'
                : repeatPreset === '1m'
                ? 'ทุกๆ 1 นาที'
                : repeatPreset === '5m'
                ? 'ทุกๆ 5 นาที'
                : repeatPreset === '10m'
                ? 'ทุกๆ 10 นาที'
                : `ทุกๆ ${customRepeatMinutes} นาที`}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            เตือนซ้ำจนกว่าจะกดยืนยันว่าหยิบของแล้ว
          </p>

          {/* Repeat Chips Row 1 */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setRepeatPreset('none');
                sound.playChime();
              }}
              className={`py-1.5 px-2 rounded-full text-xs font-medium transition text-center ${
                repeatPreset === 'none'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ไม่เตือนซ้ำ
            </button>
            <button
              type="button"
              onClick={() => {
                setRepeatPreset('1m');
                sound.playChime();
              }}
              className={`py-1.5 px-2 rounded-full text-xs font-medium transition text-center ${
                repeatPreset === '1m'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ทุกๆ 1 นาที
            </button>
            <button
              type="button"
              onClick={() => {
                setRepeatPreset('5m');
                sound.playChime();
              }}
              className={`py-1.5 px-2 rounded-full text-xs font-medium transition text-center ${
                repeatPreset === '5m'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ทุกๆ 5 นาที
            </button>
          </div>

          {/* Repeat Chips Row 2 */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setRepeatPreset('10m');
                sound.playChime();
              }}
              className={`py-1.5 px-2 rounded-full text-xs font-medium transition text-center ${
                repeatPreset === '10m'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ทุกๆ 10 นาที
            </button>
            <button
              type="button"
              onClick={() => {
                setRepeatPreset('custom');
                sound.playChime();
              }}
              className={`py-1.5 px-2 rounded-full text-xs font-medium transition text-center flex items-center justify-center gap-1 ${
                repeatPreset === 'custom'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>กำหนดเอง</span>
            </button>
            <div className="flex items-center justify-center bg-blue-50/70 border border-blue-200/80 rounded-full py-1 px-2">
              <input
                type="number"
                min={1}
                max={60}
                value={customRepeatMinutes}
                onChange={(e) => {
                  setCustomRepeatMinutes(Number(e.target.value) || 1);
                  setRepeatPreset('custom');
                }}
                className="w-8 text-center text-xs font-bold text-blue-700 bg-transparent outline-none"
              />
              <span className="text-[11px] font-semibold text-blue-700">นาที</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Section Card: เตือนตามระยะทาง & เคลื่อนที่ */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <Radio className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                เตือนตามระยะทาง & เคลื่อนที่
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ป้องกันการลืมของเมื่อเดินออกห่างหรือเคลื่อนย้าย
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded">
              Proximity
            </span>
            <button
              type="button"
              onClick={() => {
                setProximityEnabled(!proximityEnabled);
                sound.playChime();
              }}
              className={`w-5 h-5 rounded flex items-center justify-center transition ${
                proximityEnabled ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {proximityEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          </div>
        </div>

        {proximityEnabled && (
          <>
            {/* ระยะทางตรวจจับ */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">ระยะทางตรวจจับ</span>
                <span className="text-blue-600 font-semibold">
                  รัศมี {isCustomDistance ? customDistance : proximityDistance} เมตร
                </span>
              </div>

              {/* Distance Pills */}
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20].map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => {
                      setProximityDistance(dist);
                      setIsCustomDistance(false);
                      sound.playChime();
                    }}
                    className={`py-1.5 rounded-full text-xs font-medium transition text-center ${
                      !isCustomDistance && proximityDistance === dist
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {dist} เมตร
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setIsCustomDistance(true);
                    sound.playChime();
                  }}
                  className={`py-1.5 rounded-full text-xs font-medium transition text-center ${
                    isCustomDistance
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  กำหนดเอง
                </button>
              </div>

              {isCustomDistance && (
                <div className="flex items-center gap-3 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                  <span className="text-xs text-slate-700 font-medium">ระบุรัศมี:</span>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={customDistance}
                    onChange={(e) => setCustomDistance(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-xs font-bold text-blue-700 w-12 text-right">
                    {customDistance} ม.
                  </span>
                </div>
              )}
            </div>

            {/* รูปแบบการติดตาม / อุปกรณ์ */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold">[]</span>
                  รูปแบบการติดตาม / อุปกรณ์
                </span>
                <span className="text-blue-600 font-semibold">เลือกได้ 2 รูปแบบ</span>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTrackingType('ble');
                    sound.playChime();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    trackingType === 'ble'
                      ? 'bg-blue-50 border-2 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bluetooth className="w-4 h-4 text-blue-600" />
                  <span>Smart Tag (BLE)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrackingType('gps');
                    sound.playChime();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    trackingType === 'gps'
                      ? 'bg-blue-50 border-2 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>พิกัด GPS Geofence</span>
                </button>
              </div>

              {/* BLE Device Card */}
              {trackingType === 'ble' ? (
                <div className="bg-[#f8faff] rounded-xl p-3 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {selectedTag.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          บลูทูธพลังงานต่ำ (BLE) • เชื่อมต่ออยู่
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onOpenTagSelector}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs hover:bg-blue-50 transition"
                    >
                      เปลี่ยน
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 bg-white/80 p-2 rounded-lg border border-blue-50 leading-relaxed">
                    เหมาะสำหรับสิ่งของพกติดตัว เช่น กุญแจ กระเป๋าสตางค์ เตือนทันทีเมื่อเดินห่างเกินรัศมีบลูทูธ
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/80">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900">
                      พิกัด GPS Geofence (บ้าน / ที่ทำงาน)
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                    แจ้งเตือนเมื่อคุณเดินทางออกจากพื้นที่รัศมีที่กำหนด เช่น ออกจากบ้านโดยไม่หยิบของไปด้วย
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 6. Notification Options Rows */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        {/* Row 1: เปิดการแจ้งเตือนทันที */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                เปิดการแจ้งเตือนทันที
              </div>
              <div className="text-[11px] text-slate-500">
                ส่งข้อความเตือนเมื่อถึงกำหนด
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={instantNotification}
            onClick={() => {
              setInstantNotification(!instantNotification);
              sound.playChime();
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer ${
              instantNotification ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center">
              {instantNotification && <Check className="w-2.5 h-2.5 text-blue-600 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* Row 2: เตือนล่วงหน้า 15 นาที */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">
              เตือนล่วงหน้า 15 นาที
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNotify15MinBefore(!notify15MinBefore);
              sound.playChime();
            }}
            className={`w-5 h-5 rounded flex items-center justify-center transition ${
              notify15MinBefore ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
            }`}
          >
            {notify15MinBefore && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* 7. Section Card: อ่านออกเสียงชื่อสิ่งที่ลืม (TTS) */}
      <div className="bg-[#f8faff] rounded-2xl p-4 border border-blue-100 shadow-xs space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  อ่านออกเสียงชื่อสิ่งที่ลืม (TTS)
                </span>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  เสียงพูด
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                อ่านชื่อของและสถานที่เมื่อแจ้งเตือน เช่น &ldquo;อย่าลืม{title || 'กุญแจ'} {location ? `ที่${location}` : 'ที่ลิ้นชักโต๊ะทำงาน'}&rdquo;
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTtsEnabled(!ttsEnabled);
              sound.playChime();
            }}
            className={`w-5 h-5 rounded flex items-center justify-center transition flex-shrink-0 ${
              ttsEnabled ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
            }`}
          >
            {ttsEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
        </div>

        {/* Sub-row: ทดลองฟังตัวอย่างเสียง */}
        <div className="flex items-center justify-between pt-2 border-t border-blue-100/70 bg-white/70 p-2.5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
            <Mic className="w-4 h-4 text-blue-600" />
            <span>ทดลองฟังตัวอย่างเสียงแจ้งเตือน</span>
          </div>

          <button
            type="button"
            onClick={handlePreviewTTS}
            disabled={isPlayingTTS}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
              isPlayingTTS
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Play className={`w-3 h-3 fill-current ${isPlayingTTS ? 'animate-spin' : ''}`} />
            <span>{isPlayingTTS ? 'กำลังเล่น...' : 'ทดลองฟัง'}</span>
          </button>
        </div>
      </div>

      {/* 8. Action Buttons */}
      <div className="space-y-2 pt-2">
        {/* Primary Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-[0.98] transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>บันทึกรายการ</span>
        </button>

        {/* Secondary Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs text-center transition cursor-pointer"
        >
          ยกเลิก
        </button>
      </div>

      {/* Simple Date Picker Modal popup */}
      {showDatePickerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              เลือกวันที่ต้องการให้แจ้งเตือน
            </h4>

            <div className="space-y-1.5">
              {[
                { label: 'วันนี้ (27 มี.ค. 2025)', val: 'วันนี้, 27 มี.ค. 2025', preset: 'today' },
                { label: 'พรุ่งนี้ (28 มี.ค. 2025)', val: 'พรุ่งนี้, 28 มี.ค. 2025', preset: 'tomorrow' },
                { label: 'วันเสาร์นี้ (29 มี.ค. 2025)', val: 'เสาร์นี้, 29 มี.ค. 2025', preset: 'weekend' },
                { label: 'วันอาทิตย์นี้ (30 มี.ค. 2025)', val: 'อาทิตย์นี้, 30 มี.ค. 2025', preset: 'weekend' },
                { label: 'สัปดาห์หน้า (3 เม.ย. 2025)', val: '3 เม.ย. 2025', preset: 'weekend' },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => {
                    setDisplayDate(d.val);
                    setDateSelection(d.preset as 'today' | 'tomorrow' | 'weekend');
                    setShowDatePickerModal(false);
                    sound.playChime();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                    displayDate === d.val
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowDatePickerModal(false)}
              className="w-full py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
