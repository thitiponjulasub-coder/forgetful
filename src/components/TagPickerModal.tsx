import React from 'react';
import { Bluetooth, Battery, Check, X } from 'lucide-react';
import { SmartTag } from '../types';

interface TagPickerModalProps {
  tags: SmartTag[];
  selectedTagId: string;
  onSelectTag: (tag: SmartTag) => void;
  onClose: () => void;
}

export const TagPickerModal: React.FC<TagPickerModalProps> = ({
  tags,
  selectedTagId,
  onSelectTag,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bluetooth className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">เลือกอุปกรณ์ Smart Tag</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {tags.map((tag) => {
            const isSelected = tag.id === selectedTagId;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  onSelectTag(tag);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{tag.name}</div>
                    <div className="text-[11px] text-slate-500">{tag.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Battery className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{tag.battery}%</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};
