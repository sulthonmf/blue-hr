import { create } from 'zustand';

export type DeviceMode = 'WEB' | 'IOS' | 'ANDROID';

interface FrameState {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
}

export const useFrameStore = create<FrameState>((set) => ({
  deviceMode: 'WEB',
  setDeviceMode: (mode: DeviceMode) => set({ deviceMode: mode })
}));
