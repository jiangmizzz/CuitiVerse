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
  //生成对个人文化背景的描述语段
  generateDesc: () => string;
}

export const useSettingStore = create<SettingState>()((set, get) => ({
  culture: "United States",
  age: 20,
  edu: "bachelor's degree",
  u1: 3,
  u2: 3,
  remark: "",
  updateInfo: (newValue) => {
    set(() => {
      return {
        culture: newValue.culture,
        age: newValue.age,
        edu: newValue.edu,
        u1: newValue.u1,
        u2: newValue.u2,
        remark: newValue.remark,
      };
    });
  },
  reset: () => {
    set(() => {
      return {
        culture: "United States",
        age: 20,
        edu: "bachelor's degree",
        u1: 3,
        u2: 3,
        remark: "",
      };
    });
  },
  generateDesc: () => {
    return `The following is my personal cultural background: I come from ${
      get().culture
    }, I am ${get().age} years old this year, and my education level is a ${
      get().edu
    }. My level of understanding of Chinese culture is approximately ${
      get().u1
    } points (on a scale of 1 to 5), and my level of understanding of traditional Chinese painting is approximately ${
      get().u2
    } points (on a scale of 1 to 5). ${
      get().remark !== ""
        ? "In addition, I would like to note the following about my cultural background: " +
          get().remark
        : ""
    }`;
  },
}));
