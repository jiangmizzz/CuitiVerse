/**
 * 保存用户设置的 cutural background
 */
import { create } from "zustand";
import type { Settings } from "../vite-env";

interface SettingState extends Settings {
  //save settings
  updateInfo: (newValue: Settings) => void;
  //重置至初始值
  reset: () => void;
}

export const useSettingStore = create<SettingState>()((set) => ({
  culture: "America",
  age: 20,
  edu: "bachelor's degree",
  u1: 3,
  u2: 3,
  updateInfo: (newValue) => {
    set(() => {
      return {
        culture: newValue.culture,
        age: newValue.age,
        edu: newValue.edu,
        u1: newValue.u1,
        u2: newValue.u2,
      };
    });
  },
  reset: () => {
    set(() => {
      return {
        culture: "America",
        age: 20,
        edu: "bachelor's degree",
        u1: 3,
        u2: 3,
      };
    });
  },
}));
