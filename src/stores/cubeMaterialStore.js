import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Material } from "../features/materials";
import { color } from "../features/tuples";

const defaultMaterial = new Material();
defaultMaterial.color = color(1, 1, 0.5);
defaultMaterial.ambient = 0.4;

const store = (set) => ({
  material: defaultMaterial,
  reset: () => {
    set({ material: defaultMaterial });
  },
  updateMaterial: (newMaterial) => {
    set({ material: newMaterial });
  }
});

export const useCubeMaterialStore = create(
  persist(store, { name: "cubeMaterialStorage" })
);
