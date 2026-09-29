import React from 'react';
import { LayoutGrid, Plus, SlidersHorizontal } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'add' | 'settings';
  onChangeTab: (tab: 'home' | 'add' | 'settings') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-4 relative">
        {/* Tab 1: หน้าหลัก (Home) */}
        <button
          type="button"
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center w-20 py-1 transition ${
            currentTab === 'home'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">หน้าหลัก</span>
        </button>

        {/* Tab 2: เพิ่มรายการ (Middle elevated button +) */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            type="button"
            onClick={() => onChangeTab('add')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-95 ${
              currentTab === 'add'
                ? 'bg-blue-600 text-white shadow-blue-500/40 ring-4 ring-blue-100 scale-105'
                : 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700'
            }`}
            aria-label="เพิ่มรายการใหม่"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
          <span
            className={`text-[11px] mt-1 tracking-tight ${
              currentTab === 'add' ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            เพิ่มรายการ
          </span>
        </div>

        {/* Tab 3: ตั้งค่า (Settings) */}
        <button
          type="button"
          onClick={() => onChangeTab('settings')}
          className={`flex flex-col items-center justify-center w-20 py-1 transition ${
            currentTab === 'settings'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">ตั้งค่า</span>
        </button>
      </div>
    </nav>
  );
};
