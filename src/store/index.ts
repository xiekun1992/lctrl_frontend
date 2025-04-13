import { create } from "zustand";

const useStore = create((set) => ({
  remotes: [],
  curDevice: {},
  settings: {
    autoDiscover: true,
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
