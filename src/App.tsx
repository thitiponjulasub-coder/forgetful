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
import { sound } from './utils/soundAndTTS';
import {
  auth,
  signInWithGoogle,
  logOut,
  subscribeToUserItems,
  saveItemToFirestore,
  deleteItemFromFirestore,
  updateItemResolveInFirestore,
} from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  CheckCircle2,
  User as UserIcon,
  X,
  Cloud,
  LogIn,
  LogOut,
  Database,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  // Default to 'add' tab so it shows the exact screen from user's image right upon loading!
  const [currentTab, setCurrentTab] = useState<'add' | 'home' | 'settings'>('add');
  const [items, setItems] = useState<ReminderItem[]>([]);
  const [tags, setTags] = useState<SmartTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<SmartTag | null>(null);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Modals & Drawers
  const [activeAlertItem, setActiveAlertItem] = useState<ReminderItem | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 1. Initialize Tags and Local Items
  useEffect(() => {
    const loadedTags = loadTags();
    setTags(loadedTags);
    if (loadedTags.length > 0) {
      setSelectedTag(loadedTags[0]);
    }
  }, []);

  // 2. Listen to Firebase Auth and sync with Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        // Subscribe to real-time updates from Firestore for this user
        const unsubscribeItems = subscribeToUserItems(
          user.uid,
          (firestoreItems) => {
            if (firestoreItems.length > 0) {
              setItems(firestoreItems);
              saveItems(firestoreItems);
            } else {
              // If Firestore is empty for new user, seed with initial local items
              const local = loadItems();
              setItems(local);
              // Save each seed item to Firestore
              local.forEach((it) => {
                saveItemToFirestore(user.uid, it).catch(console.error);
              });
            }
          },
          (err) => {
            console.error('Firestore subscription error:', err);
          }
        );

        return () => {
          unsubscribeItems();
        };
      } else {
        // Fallback to local items if not logged in
        const local = loadItems();
        setItems(local);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Add new item handler
  const handleSaveItem = async (newItemData: Omit<ReminderItem, 'id' | 'createdAt' | 'isResolved'>) => {
    const newItem: ReminderItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      userId: currentUser?.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: false,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);

    // Save to Firestore if authenticated
    if (currentUser) {
      try {
        await saveItemToFirestore(currentUser.uid, newItem);
      } catch (err) {
        console.error('Failed to sync item to Firestore:', err);
      }
    }

    showToast(`บันทึก "${newItem.title}" เรียบร้อยแล้ว`);

    // Switch to home view
    setTimeout(() => {
      setCurrentTab('home');
    }, 600);
  };

  // Toggle resolve
  const handleToggleResolve = async (id: string) => {
    let nextState = false;
    const updated = items.map((item) => {
      if (item.id === id) {
        nextState = !item.isResolved;
        if (nextState) {
          sound.playSuccess();
          showToast(`ทำเครื่องหมายว่าหยิบ "${item.title}" แล้ว`);
        } else {
          sound.playChime();
        }
        return { ...item, isResolved: nextState, updatedAt: new Date().toISOString() };
      }
      return item;
    });

    setItems(updated);
    saveItems(updated);

    // Sync to Firestore
    if (currentUser) {
      try {
        await updateItemResolveInFirestore(currentUser.uid, id, nextState);
      } catch (err) {
        console.error('Failed to update resolve in Firestore:', err);
      }
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    const target = items.find((i) => i.id === id);
    if (confirm(`คุณต้องการลบ "${target?.title || 'รายการนี้'}" ใช่หรือไม่?`)) {
      const updated = items.filter((i) => i.id !== id);
      setItems(updated);
      saveItems(updated);

      if (currentUser) {
        try {
          await deleteItemFromFirestore(currentUser.uid, id);
        } catch (err) {
          console.error('Failed to delete item from Firestore:', err);
        }
      }

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

  // Google Login
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showToast('เข้าสู่ระบบสำเร็จ เชื่อมต่อ Firebase เรียบร้อย');
      sound.playSuccess();
    } catch (err) {
      console.error('Sign in failed:', err);
      showToast('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Google Logout
  const handleSignOut = async () => {
    try {
      await logOut();
      showToast('ออกจากระบบแล้ว');
      sound.playChime();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Reset demo data
  const handleResetData = () => {
    localStorage.removeItem('reminditem_saved_items_v2');
    const fresh = loadItems();
    setItems(fresh);
    if (currentUser) {
      fresh.forEach((it) => {
        saveItemToFirestore(currentUser.uid, it).catch(console.error);
      });
    }
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
          currentUser={currentUser}
          isFirebaseConnected={true}
        />

        {/* Cloud Sync Status Ribbon if logged in */}
        {currentUser ? (
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-emerald-800">
            <div className="flex items-center gap-1.5 font-medium">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>ซิงค์กับ Firebase Firestore เรียบร้อยแล้ว</span>
            </div>
            <span className="font-semibold text-emerald-700 truncate max-w-[120px]">
              {currentUser.displayName || currentUser.email}
            </span>
          </div>
        ) : (
          <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-blue-800">
            <div className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>โหมดออฟไลน์ / โลคอลสตอเรจ</span>
            </div>
            <button
              onClick={handleGoogleSignIn}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              เข้าสู่ระบบซิงค์คลาวด์
            </button>
          </div>
        )}

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
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  บัญชีผู้ใช้งาน
                </h3>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {currentUser ? (
                <div className="text-center space-y-2 py-2">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-blue-100 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-blue-500/30">
                      {currentUser.displayName?.[0] || 'U'}
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {currentUser.displayName || 'ผู้ใช้งาน RemindItem'}
                    </h4>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>เชื่อมต่อ Firebase Cloud สำเร็จ</span>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await handleSignOut();
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition mt-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Cloud className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">เข้าสู่ระบบ Firebase</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      ซิงค์รายการสิ่งของและพิกัด Smart Tag ลงบนคลาวด์ ข้อมูลไม่สูญหาย
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await handleGoogleSignIn();
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>เข้าสู่ระบบด้วย Google</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>ฐานข้อมูล:</span>
                  <span className="font-bold text-slate-800">Cloud Firestore</span>
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
                className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
