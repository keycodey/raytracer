import { create } from "zustand";
import { persist } from "zustand/middleware";

const store = (set) => ({
  translation: { x: 0, y: 1, z: 0 },
  scaling: { x: 1, y: 0.7, z: 1 },
  rotation: { x: 0, y: -0.7854, z: 0 },
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
      translation: { x: 0, y: 1, z: 0 },
      scaling: { x: 1, y: 0.7, z: 1 },
      rotation: { x: 0, y: -0.7854, z: 0 }
    });
  }
});

export const useCubeStore = create(persist(store, { name: "cubeStorage" }));
