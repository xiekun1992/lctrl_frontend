import { create } from "zustand";

const useStore = create((set) => ({
  remotes: [],
  curDevice: {},
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
}));

export default useStore;
