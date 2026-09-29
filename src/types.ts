export interface ReminderItem {
  id: string;
  title: string;
  location: string;
  category?: string;
  remindDate: string;
  remindTimeHour: string;
  remindTimeMinute: string;
  repeatInterval: 'none' | '1m' | '5m' | '10m' | 'custom';
  customRepeatMinutes?: number;
  proximityEnabled: boolean;
  proximityDistance: number; // in meters (5, 10, 20, or custom)
  customProximityDistance?: number;
  trackingType: 'ble' | 'gps';
  bleDeviceId: string;
  bleDeviceName: string;
  bleDeviceStatus: 'connected' | 'disconnected' | 'out_of_range';
  bleBattery: number;
  currentDistanceMeters: number;
  instantNotification: boolean;
  notify15MinBefore: boolean;
  ttsEnabled: boolean;
  createdAt: string;
  isResolved: boolean;
}

export interface SmartTag {
  id: string;
  name: string;
  type: string;
  battery: number;
  signalStrength: number; // RSSI dBm e.g. -55
  status: 'connected' | 'disconnected';
  lastSeen: string;
}
