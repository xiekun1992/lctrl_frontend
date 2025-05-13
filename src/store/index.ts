import { create } from "zustand";

const useStore = create((set) => ({
  remotes: [],
  curDevice: {},
  primaryScreen: {
    pos: { top: 150, left: 400 },
    screens: [
      { x: 0, y: 0, width: 1366, height: 768 },
      { x: 1366, y: 0, width: 1920, height: 1080 },
    ],
  },
  remoteScreens: [
    {
      pos: { top: 0, left: 380 },
      screens: [
        { x: 0, y: 0, width: 1366, height: 768 },
        { x: 1366, y: 0, width: 1920, height: 1080 },
      ],
    },
  ],
  settings: {
    autoDiscover: true,
  },
  updateRemoteScreens(screens) {
    return set((state) => {
      return screens;
    });
  },
  setRemotes(remotes) {
    return set((state) => {
      return {
        remotes,
      };
    });
  },
  setCurDevice(device) {
    return set((state) => {
      return {
        curDevice: device,
      };
    });
  },
  setSettings(settings) {
    return set((state) => {
      return {
        settings,
      };
    });
  },
}));

export default useStore;
