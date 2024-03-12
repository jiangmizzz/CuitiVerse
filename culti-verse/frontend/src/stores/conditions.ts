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
  setCondition: (newValue) => {
    set(() => {
      return {
        ...newValue,
      };
    });
  },
}));
