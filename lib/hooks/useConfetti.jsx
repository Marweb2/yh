import { create } from "zustand";

const useConfetti = create((set) => ({
  isActive: false,
  onActive: () => set({ isActive: true }),
  onDisable: () => set({ isActive: false }),
}));

export default useConfetti;
