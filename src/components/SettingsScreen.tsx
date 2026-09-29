import React, { useState } from 'react';
import {
  Bluetooth,
  Volume2,
  Sliders,
  Shield,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Battery,
  Radio,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { SmartTag } from '../types';
import { sound, speakThaiTTS } from '../utils/soundAndTTS';

interface SettingsScreenProps {
  tags: SmartTag[];
  onResetData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ tags, onResetData }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleScanBLE = () => {
    setIsScanning(true);
    sound.playRadarPing();
    setTimeout(() => {
      setIsScanning(false);
      sound.playSuccess();
    }, 2000);
  };

  const handleTestSpeech = () => {
    setTestSuccess(true);
    speakThaiTTS('ระบบแจ้งเตือน RemindItem พร้อมทำงาน ตรวจพบสัญญาณ Smart Tag ในระยะปกติ');
    setTimeout(() => setTestSuccess(false), 3000);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Settings Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">ตั้งค่าระบบ RemindItem</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          จัดการอุปกรณ์ Smart Tag (BLE), เสียงพูดเตือน (TTS) และพิกัดตรวจจับ
        </p>
      </div>

      {/* Smart Tag BLE Manager */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bluetooth className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">อุปกรณ์ Smart Tag ที่จับคู่</h3>
              <p className="text-[11px] text-slate-500">บลูทูธพลังงานต่ำ (BLE)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleScanBLE}
            disabled={isScanning}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 transition ${
              isScanning
                ? 'bg-blue-100 text-blue-700 animate-pulse'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'กำลังค้นหา...' : 'สแกนอุปกรณ์'}</span>
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{tag.name}</div>
                  <div className="text-[11px] text-slate-500">{tag.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-slate-600 font-medium">
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{tag.battery}%</span>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-md">
                  เชื่อมต่อ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TTS Speech Settings */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">เสียงพูดแจ้งเตือน (Thai TTS)</h3>
            <p className="text-[11px] text-slate-500">ปรับความเร็วและระดับเสียงของเครื่อง</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>ความเร็วเสียง (Rate): {speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>โทนเสียง (Pitch): {speechPitch}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={handleTestSpeech}
            className="w-full py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>ทดสอบเสียงพูดจำลอง</span>
          </button>
        </div>
      </div>

      {/* Reset & Developer Options */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          การจัดการข้อมูล
        </h3>
        <p className="text-xs text-slate-500">
          คุณสามารถรีเซ็ตกลับเป็นตัวอย่างเริ่มต้น (กุญแจ, ลิ้นชักโต๊ะทำงาน ฯลฯ)
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm('ต้องการรีเซ็ตข้อมูลตัวอย่างทั้งหมดหรือไม่?')) {
              onResetData();
              sound.playSuccess();
            }
          }}
          className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตข้อมูลตัวอย่าง</span>
        </button>
      </div>
    </div>
  );
};
