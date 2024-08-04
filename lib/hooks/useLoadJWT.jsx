import { create } from "zustand";

const useLoadJWT = create((set) => ({
  isActive: false,
  onActive: () => set({ isActive: true }),
  onDisable: () => set({ isActive: false }),
}));

export default useLoadJWT;
