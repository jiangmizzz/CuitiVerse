/**
 * 用于生成符合条件的symbol
 */
import { create } from "zustand";
import { conditionType } from "../vite-env";

type ConditionFormat = {
  [key in conditionType]: boolean;
};

interface ConditionState {
  keeping: ConditionFormat; //要求保持一致的条件
  requirement: ConditionFormat; //设问内容
  reset: () => void; //重置前两项
  isNoKeeping: () => boolean; //是否缺失条件
  isNoReq: () => boolean; //是否缺失设问
  isRepeated: () => boolean; //keeping 和 requirement 是否有重叠
  setCondition: (
    newValue: Partial<Pick<ConditionState, "keeping" | "requirement">>
  ) => void;
}

export const useConditionsStore = create<ConditionState>()((set, get) => ({
  keeping: {
    element: false,
    rhetoric: false,
    symbol: false,
    custom: false,
    emotion: false,
  },
  requirement: {
    element: false,
    rhetoric: false,
    symbol: false,
    custom: false,
    emotion: false,
  },
  //恢复初始选择态
  reset: () => {
    set(() => {
      return {
        keeping: {
          element: false,
          rhetoric: false,
          symbol: false,
          custom: false,
          emotion: false,
        },
        requirement: {
          element: false,
          rhetoric: false,
          symbol: false,
          custom: false,
          emotion: false,
        },
      };
    });
  },
  isNoKeeping: () => {
    const tmp = get().keeping;
    for (const key in tmp) {
      const key1: keyof ConditionFormat = key as keyof ConditionFormat;
      if (tmp[key1] !== false) {
        return false;
      }
    }
    return true;
  },
  isNoReq: () => {
    const tmp = get().requirement;
    for (const key in tmp) {
      const key1: keyof ConditionFormat = key as keyof ConditionFormat;
      if (tmp[key1] !== false) {
        return false;
      }
    }
    return true;
  },
  isRepeated: () => {
    const keeping = get().keeping;
    const requirement = get().requirement;
    for (const key in keeping) {
      const key1: keyof ConditionFormat = key as keyof ConditionFormat;
      if (keeping[key1] === true && requirement[key1] === true) {
        return true;
      }
    }
    return false;
  },
  setCondition: (newValue) => {
    set(() => {
      return {
        ...newValue,
      };
    });
  },
}));
