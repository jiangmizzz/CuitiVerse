/**
 * 用于保存用户探索的路径
 */
import { create } from "zustand";
import {
  ExploreTrack,
  MetaphorType,
  Settings,
  checkType,
  normType,
} from "../vite-env";

interface ExploreState extends ExploreTrack {
  setNoumenon: (newId: string, newValue: string) => void;
  setMetaphor: (newValue: MetaphorType) => void;
  setForeign: (newValue: string) => void;
  isCompleted: () => boolean;
  generatePrompt: (background: Settings, type: checkType) => string;
}

export const useExploreStore = create<ExploreState>()((set, get) => ({
  noumenon: {
    nid: "",
    text: "",
  },
  metaphor: {
    mid: "",
    text: "",
    normType: "Iconic" satisfies normType,
  },
  foreignMetaphor: {
    text: "",
  },
  //作为前置条件的量修改都会导致后面路径上的量被重置
  setNoumenon: (newId, newValue) => {
    set(() => {
      return {
        noumenon: { nid: newId, text: newValue },
        metaphor: {
          mid: "",
          text: "",
          normType: "Iconic" satisfies normType,
        },
        foreignMetaphor: { text: "" },
      };
    });
  },
  setMetaphor: (newValue) => {
    set(() => {
      return {
        metaphor: {
          mid: newValue.mid,
          text: newValue.text,
          normType: newValue.normType,
        },
        foreignMetaphor: { text: "" },
      };
    });
  },
  setForeign: (newValue) => {
    set(() => {
      return { foreignMetaphor: { text: newValue } };
    });
  },
  isCompleted: () => {
    if (
      get().noumenon.nid != "" &&
      get().metaphor.mid != "" &&
      get().foreignMetaphor.text != ""
    ) {
      return true;
    } else return false;
  },
  generatePrompt: (background, type) => {
    const track = get() as ExploreTrack;
    //TODO:根据background和track设计验证的prompt
    return type + String(track) + String(background);
  },
}));
