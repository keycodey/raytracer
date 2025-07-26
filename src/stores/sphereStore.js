import { create } from "zustand";
import { persist } from "zustand/middleware";

const store = (set) => ({
  translation: { x: 3, y: 1, z: -4 },
  scaling: { x: 0.7, y: 0.7, z: 0.7 },
  rotation: { x: 0, y: 0, z: 0 },
  updateTranslation: (newTranslation) => {
    set({ translation: newTranslation });
  },
  updateScaling: (newScaling) => {
    set({ scaling: newScaling });
  },
  updateRotation: (newRotation) => {
    set({ rotation: newRotation });
  },
  reset: () => {
    set({
      translation: { x: 3, y: 1, z: -4 },
      scaling: { x: 0.7, y: 0.7, z: 0.7 },
      rotation: { x: 0, y: 0, z: 0 }
    });
  }
});

export const useSphereStore = create(persist(store, { name: "sphereStorage" }));
