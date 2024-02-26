/**
 * 用于保存用户探索的路径
 */
import { create } from "zustand";
import { MetaphorType, Settings, normType } from "../vite-env";

interface ExploreTrack {
  noumenon: { nid: string; text: string }; //物像
  //喻体
  metaphor: Omit<MetaphorType, "mid">;
  foreignMetaphor: {
    //喻体转译
    text: string;
  };
}

interface ExploreState extends ExploreTrack {
  setNoumenon: (newId: string, newValue: string) => void;
  setMetaphor: (newValue: Omit<MetaphorType, "mid">) => void;
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
    text: "",
    normType: "Identity" satisfies normType,
  },
  foreignMetaphor: {
    text: "",
  },
  setNoumenon: (newId, newValue) => {
    set(() => {
      return { noumenon: { nid: newId, text: newValue } };
    });
  },
  setMetaphor: (newValue) => {
    set(() => {
      return {
        metaphor: { text: newValue.text, normType: newValue.normType },
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
