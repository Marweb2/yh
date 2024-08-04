import { create } from "zustand";

const useLogout = create((set) => ({
  isActive: false,
  onActive: () => set({ isActive: true }),
  onDisable: () => set({ isActive: false }),
}));

export default useLogout;
