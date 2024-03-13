/**
 * 用于保存用户探索的路径
 */
import { create } from "zustand";
import { ExploreTrack, MetaphorType } from "../vite-env";

interface ExploreState extends ExploreTrack {
  setNoumenon: (newId: string, newValue: string) => void;
  setMetaphor: (newValue: MetaphorType) => void;
  setForeign: (newValue: string[]) => void;
  isCompleted: () => boolean;
  //生成格式化的验证prompt
  generateTrack: () => string;
}

export const useExploreStore = create<ExploreState>()((set, get) => ({
  noumenon: {
    nid: "",
    text: "",
  },
  metaphor: {
    mid: "",
    text: [],
    normType: "Iconic",
    emotion: "Neutral",
    meaning: [],
  },
  foreignMetaphor: {
    text: [],
  },
  //作为前置条件的量修改都会导致后面路径上的量被重置
  setNoumenon: (newId, newValue) => {
    set(() => {
      return {
        noumenon: { nid: newId, text: newValue },
        metaphor: {
          mid: "",
          text: [],
          normType: "Iconic",
          emotion: "Neutral",
          meaning: [],
        },
        foreignMetaphor: { text: [] },
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
        foreignMetaphor: { text: [] },
      };
    });
  },
  setForeign: (newValue) => {
    set(() => {
      return { foreignMetaphor: { text: [...newValue] } };
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
    return `The current translation path is: element: ${track.noumenon.text} --> symbol: ${track.metaphor.text}(way of rhetoric: ${track.metaphor.normType}) --> foreign symbol: ${track.foreignMetaphor.text}`;
  },
}));
