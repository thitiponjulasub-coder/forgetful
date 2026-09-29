/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ReminderItem, SmartTag } from './types';
import { loadItems, saveItems, loadTags } from './utils/storage';
import { Header } from './components/Header';
import { AddItemScreen } from './components/AddItemScreen';
import { HomeScreen } from './components/HomeScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { AlertModal } from './components/AlertModal';
import { TagPickerModal } from './components/TagPickerModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { sound, speakThaiTTS } from './utils/soundAndTTS';
import { CheckCircle2, User, X, Sparkles, Bell } from 'lucide-react';

export default function App() {
  // Default to 'add' tab so it shows the exact screen from user's image right upon loading!
  const [currentTab, setCurrentTab] = useState<'add' | 'home' | 'settings'>('add');
  const [items, setItems] = useState<ReminderItem[]>([]);
  const [tags, setTags] = useState<SmartTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<SmartTag | null>(null);

  // Modals & Drawers
  const [activeAlertItem, setActiveAlertItem] = useState<ReminderItem | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    const loadedTags = loadTags();
    setTags(loadedTags);
    if (loadedTags.length > 0) {
      setSelectedTag(loadedTags[0]);
    }
    const loadedItems = loadItems();
    setItems(loadedItems);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add new item handler
  const handleSaveItem = (newItemData: Omit<ReminderItem, 'id' | 'createdAt' | 'isResolved'>) => {
    const newItem: ReminderItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isResolved: false,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);
    showToast(`บันทึก "${newItem.title}" เรียบร้อยแล้ว`);

    // Optionally switch to home tab or stay
    setTimeout(() => {
      setCurrentTab('home');
    }, 600);
  };

  // Toggle resolve
  const handleToggleResolve = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextState = !item.isResolved;
        if (nextState) {
          sound.playSuccess();
          showToast(`ทำเครื่องหมายว่าหยิบ "${item.title}" แล้ว`);
        } else {
          sound.playChime();
        }
        return { ...item, isResolved: nextState };
      }
      return item;
    });
    setItems(updated);
    saveItems(updated);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (confirm(`คุณต้องการลบ "${target?.title || 'รายการนี้'}" ใช่หรือไม่?`)) {
      const updated = items.filter((i) => i.id !== id);
      setItems(updated);
      saveItems(updated);
      showToast('ลบรายการเรียบร้อยแล้ว');
      sound.playChime();
    }
  };

  // Snooze alert
  const handleSnooze = (minutes: number) => {
    if (!activeAlertItem) return;
    showToast(`เลื่อนเวลาเตือน "${activeAlertItem.title}" ออกไปอีก ${minutes} นาที`);
    setActiveAlertItem(null);
    sound.playChime();
  };

  // Resolve from alert modal
  const handleResolveFromAlert = () => {
    if (!activeAlertItem) return;
    handleToggleResolve(activeAlertItem.id);
    setActiveAlertItem(null);
  };

  // Reset demo data
  const handleResetData = () => {
    localStorage.removeItem('reminditem_saved_items_v2');
    const fresh = loadItems();
    setItems(fresh);
    showToast('รีเซ็ตข้อมูลตัวอย่างเรียบร้อยแล้ว');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-start items-center selection:bg-blue-100">
      {/* Container simulating mobile frame */}
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col relative shadow-xl border-x border-slate-200/80">
        
        {/* App Header */}
        <Header
          onOpenNotifications={() => setIsNotificationOpen(true)}
          notificationCount={items.filter((i) => !i.isResolved).length}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'add' && selectedTag && (
            <AddItemScreen
              onSaveItem={handleSaveItem}
              onCancel={() => setCurrentTab('home')}
              tags={tags}
              selectedTag={selectedTag}
              onOpenTagSelector={() => setIsTagModalOpen(true)}
            />
          )}

          {currentTab === 'home' && (
            <HomeScreen
              items={items}
              onToggleResolve={handleToggleResolve}
              onDeleteItem={handleDeleteItem}
              onTriggerAlert={(item) => setActiveAlertItem(item)}
              onAddNew={() => setCurrentTab('add')}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen tags={tags} onResetData={handleResetData} />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Alert Pop-up Modal (When alarm triggers) */}
        {activeAlertItem && (
          <AlertModal
            item={activeAlertItem}
            onClose={() => setActiveAlertItem(null)}
            onResolve={handleResolveFromAlert}
            onSnooze={handleSnooze}
          />
        )}

        {/* Tag Selector Modal */}
        {isTagModalOpen && selectedTag && (
          <TagPickerModal
            tags={tags}
            selectedTagId={selectedTag.id}
            onSelectTag={(tag) => setSelectedTag(tag)}
            onClose={() => setIsTagModalOpen(false)}
          />
        )}

        {/* Notifications Drawer */}
        <NotificationDrawer
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          items={items.filter((i) => !i.isResolved)}
          onTriggerAlert={(item) => setActiveAlertItem(item)}
        />

        {/* User Profile Modal */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  บัญชีผู้ใช้งาน
                </h3>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-2 py-2">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-blue-500/30">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">ผู้ใช้งาน RemindItem</h4>
                  <p className="text-xs text-slate-500">thitipon111@hotmail.com</p>
                </div>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>สถานะระบบ:</span>
                  <span className="font-bold text-emerald-600">ออนไลน์พร้อมใช้งาน</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Smart Tag ที่จับคู่:</span>
                  <span className="font-bold text-blue-700">{tags.length} ตัว</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>เสียงเตือนภาษาไทย:</span>
                  <span className="font-bold text-purple-700">เปิดใช้งาน (TTS)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-xs"
              >
                ตกลง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
