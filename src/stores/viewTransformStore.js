import { create } from "zustand";
import { persist } from "zustand/middleware";

const store = (set) => ({
  from: { x: 0, y: 2, z: -7 },
  to: { x: 0.5, y: 0.5, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  updateFrom: (newFrom) => {
    set({ from: newFrom });
  },
  updateTo: (newTo) => {
    set({ to: newTo });
  },
  updateUp: (newUp) => {
    set({ up: newUp });
  },
  reset: () => {
    set({
      from: { x: 0, y: 2, z: -7 },
      to: { x: 0.5, y: 0.5, z: 0 },
      up: { x: 0, y: 1, z: 0 }
    });
  }
});

export const useViewTransformStore = create(
  persist(store, { name: "viewTransformStorage" })
);
