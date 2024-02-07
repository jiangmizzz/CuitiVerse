//chat历史记录
import { create } from "zustand";
import { MessageProps } from "../vite-env";

interface historyState {
  msgs: Omit<MessageProps, "isLoading">[];
  updateMsgs: (newMsgs: MessageProps[]) => void;
  //   deleteMsg: (index: number) => void;
}

export const useHistoryStore = create<historyState>()((set) => ({
  msgs: [],
  //更新历史msg列表
  updateMsgs: (newMsgs) => {
    set(() => {
      const msgs: Omit<MessageProps, "isLoading">[] = [];
      for (const item of newMsgs) {
        msgs.push({ sender: item.sender, content: item.content });
      }
      return { msgs: msgs };
    });
  },
}));
