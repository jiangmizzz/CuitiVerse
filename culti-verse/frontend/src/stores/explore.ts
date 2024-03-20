/**
 * 用于保存用户探索的路径
 */
import { create } from "zustand";
import { ExploreTrack, MetaphorType } from "../vite-env";

interface ExploreState extends ExploreTrack {
  setNoumenon: (newId: string, newValue: string[]) => void;
  setMetaphor: (newValue: MetaphorType) => void;
  setForeign: (newValue: MetaphorType) => void;
  isCompleted: () => boolean;
  //生成格式化的验证prompt
  generateTrack: () => string;
}

export const useExploreStore = create<ExploreState>()((set, get) => ({
  noumenon: {
    nid: "",
    text: [],
  },
  metaphor: {
    mid: "",
    text: [],
    normType: "Iconic",
    emotion: "Neutral",
    meaning: [],
  },
  foreignMetaphor: {
    mid: "",
    text: [],
    normType: "Iconic",
    emotion: "Neutral",
    meaning: [],
    element: [],
  },
  //作为前置条件的量修改都会导致后面路径上的量被重置
  setNoumenon: (newId, newValue) => {
    set(() => {
      return {
        noumenon: { nid: newId, text: [...newValue] },
        metaphor: {
          mid: "",
          text: [],
          normType: "Iconic",
          emotion: "Neutral",
          meaning: [],
        },
        foreignMetaphor: {
          mid: "",
          text: [],
          normType: "Iconic",
          emotion: "Neutral",
          meaning: [],
          element: [],
        },
      };
    });
  },
  setMetaphor: (newValue) => {
    set(() => {
      return {
        metaphor: {
          mid: newValue.mid,
          text: [...newValue.text],
          normType: newValue.normType,
          emotion: newValue.emotion,
          meaning: [...newValue.meaning],
        },
        foreignMetaphor: {
          mid: "",
          text: [],
          normType: "Iconic",
          emotion: "Neutral",
          meaning: [],
          element: [],
        },
      };
    });
  },
  setForeign: (newValue) => {
    set(() => {
      return {
        foreignMetaphor: {
          mid: newValue.mid,
          text: [...newValue.text],
          normType: newValue.normType,
          emotion: newValue.emotion,
          meaning: [...newValue.meaning],
          element: [...newValue.element!],
        },
      };
    });
  },
  isCompleted: () => {
    if (
      get().noumenon.nid != "" &&
      get().metaphor.mid != "" &&
      get().foreignMetaphor.text.length !== 0
    ) {
      return true;
    } else return false;
  },
  generateTrack: () => {
    const track = get() as ExploreTrack;
    return `The current translation path is: 
    1. Chinese Norm 
    element:  ${track.noumenon.text[1]}; 
    symbol: ${track.metaphor.text[1]} (rhetoric: ${track.metaphor.normType}); 
    custom: ${track.metaphor.meaning[1]}; 
    emotion: ${track.metaphor.emotion}; 
    2. Foreign Norm 
    element: ${track.foreignMetaphor.element![1]}; 
    symbol: ${track.foreignMetaphor.text[1]} (rhetoric: ${
      track.foreignMetaphor.normType
    }); 
    custom: ${track.foreignMetaphor.meaning[1]}; 
    emotion: ${track.foreignMetaphor.emotion}; \n`;
  },
}));
