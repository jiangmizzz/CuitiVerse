/**
 * 用于保存用户探索的路径
 */
import { create } from "zustand";
import { MetaphorType, Settings, normType } from "../vite-env";

interface ExploreTrack {
  noumenon: { nid: string; text: string }; //物像
  //喻体
  metaphor: MetaphorType;
  foreignMetaphor: {
    //喻体转译
    text: string;
  };
}

interface ExploreState extends ExploreTrack {
  setNoumenon: (newId: string, newValue: string) => void;
  setMetaphor: (newValue: MetaphorType) => void;
  setForeign: (newValue: string) => void;
  generatePrompt: (
    track: ExploreTrack,
    background: Settings,
    type: "Appropriate" | "Emotion" | "Inference"
  ) => string;
}

export const useExploreStore = create<ExploreState>()((set) => ({
  noumenon: {
    nid: "",
    text: "",
  },
  metaphor: {
    mid: "",
    text: "",
    normType: "Identity" satisfies normType,
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
          normType: "Identity" satisfies normType,
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
  generatePrompt: (track, background, type) => {
    //TODO:根据background和track设计验证的prompt
    return type + String(track) + String(background);
  },
}));
