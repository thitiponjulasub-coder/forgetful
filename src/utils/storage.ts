import { ReminderItem, SmartTag } from '../types';

export const DEFAULT_TAGS: SmartTag[] = [
  {
    id: 'tag-1',
    name: 'Smart Tag (RemindTag-01)',
    type: 'Bluetooth LE Beacon',
    battery: 94,
    signalStrength: -62,
    status: 'connected',
    lastSeen: 'เชื่อมต่ออยู่ (100% สัญญาณเสถียร)',
  },
  {
    id: 'tag-2',
    name: 'Smart Tag (WalletTag-Pro)',
    type: 'Ultra-thin Card BLE',
    battery: 88,
    signalStrength: -68,
    status: 'connected',
    lastSeen: 'เชื่อมต่ออยู่',
  },
  {
    id: 'tag-3',
    name: 'AirTag (Backpack)',
    type: 'UWB / BLE',
    battery: 76,
    signalStrength: -75,
    status: 'connected',
    lastSeen: 'เชื่อมต่ออยู่',
  },
];

export const INITIAL_ITEMS: ReminderItem[] = [
  {
    id: 'item-1',
    title: 'กุญแจ',
    location: 'ลิ้นชักโต๊ะทำงาน',
    category: 'daily',
    remindDate: 'วันนี้, 27 มี.ค. 2025',
    remindTimeHour: '18',
    remindTimeMinute: '00',
    repeatInterval: '5m',
    customRepeatMinutes: 5,
    proximityEnabled: true,
    proximityDistance: 10,
    trackingType: 'ble',
    bleDeviceId: 'tag-1',
    bleDeviceName: 'Smart Tag (RemindTag-01)',
    bleDeviceStatus: 'connected',
    bleBattery: 94,
    currentDistanceMeters: 3.2,
    instantNotification: true,
    notify15MinBefore: true,
    ttsEnabled: true,
    createdAt: '2025-03-27T08:00:00Z',
    isResolved: false,
  },
  {
    id: 'item-2',
    title: 'กระเป๋าสตางค์',
    location: 'โต๊ะข้างเตียงนอน',
    category: 'valuable',
    remindDate: 'วันนี้, 27 มี.ค. 2025',
    remindTimeHour: '08',
    remindTimeMinute: '30',
    repeatInterval: '5m',
    customRepeatMinutes: 5,
    proximityEnabled: true,
    proximityDistance: 5,
    trackingType: 'ble',
    bleDeviceId: 'tag-2',
    bleDeviceName: 'Smart Tag (WalletTag-Pro)',
    bleDeviceStatus: 'connected',
    bleBattery: 88,
    currentDistanceMeters: 1.5,
    instantNotification: true,
    notify15MinBefore: true,
    ttsEnabled: true,
    createdAt: '2025-03-27T08:15:00Z',
    isResolved: false,
  },
  {
    id: 'item-3',
    title: 'ยาประจำตัว (หลังอาหาร)',
    location: 'ตู้เย็นชั้น 2',
    category: 'health',
    remindDate: 'วันนี้, 27 มี.ค. 2025',
    remindTimeHour: '12',
    remindTimeMinute: '30',
    repeatInterval: '10m',
    proximityEnabled: false,
    proximityDistance: 10,
    trackingType: 'ble',
    bleDeviceId: 'tag-1',
    bleDeviceName: 'Smart Tag (RemindTag-01)',
    bleDeviceStatus: 'connected',
    bleBattery: 94,
    currentDistanceMeters: 4.8,
    instantNotification: true,
    notify15MinBefore: true,
    ttsEnabled: true,
    createdAt: '2025-03-27T09:00:00Z',
    isResolved: true,
  },
];

const STORAGE_KEY = 'reminditem_saved_items_v2';
const TAGS_KEY = 'reminditem_smart_tags_v2';

export function loadItems(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_ITEMS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_ITEMS;
  }
}

export function saveItems(items: ReminderItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to localStorage', e);
  }
}

export function loadTags(): SmartTag[] {
  try {
    const raw = localStorage.getItem(TAGS_KEY);
    if (!raw) return DEFAULT_TAGS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TAGS;
  }
}
