import { create } from "zustand";

const usePopup = create((set) => ({
  isActive: false,
  onActive: () => set({ isActive: true }),
  onDisable: () => set({ isActive: false }),
}));

export default usePopup;
