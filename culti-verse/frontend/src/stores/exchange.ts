/**
 * 用于保存用户在C和D区域中的操作数据历史
 */
import { create } from "zustand";
import { ExchangeItem, optKey } from "../vite-env";

interface ExchangeState {
  counter: number;
  exchangesMap: Map<string, ExchangeItem[]>; //喻体的mid与操作历史一一映射
  addLoading: (
    mid: string,
    type: Exclude<optKey, "trans">,
    ask: string
  ) => number;
  addItem: (
    mid: string,
    item: Pick<ExchangeItem, Exclude<keyof ExchangeItem, "id" | "isLoading">>
  ) => void;
  deleteItem: (mid: string, id: number) => void;
  replaceImg: (mid: string, id: number, item: Omit<ExchangeItem, "id">) => void;
}

export const useExchangeStore = create<ExchangeState>()((set, get) => ({
  counter: 0,
  exchangesMap: new Map<string, ExchangeItem[]>([]),
  addLoading: (mid, type, ask) => {
    const tmp = get().counter;
    set((prevState) => {
      if (!prevState.exchangesMap.has(mid)) {
        return {
          counter: prevState.counter + 1,
          exchangesMap: prevState.exchangesMap.set(mid, [
            type === "chat"
              ? {
                  id: prevState.counter,
                  opt: type,
                  content: [ask],
                  isLoading: true,
                }
              : type === "similar"
              ? {
                  id: prevState.counter,
                  opt: type,
                  content: [],
                  isLoading: true,
                }
              : {
                  id: prevState.counter,
                  opt: type,
                  content: "",
                  isLoading: true,
                },
          ]),
        };
      } else {
        return {
          counter: prevState.counter + 1,
          exchangesMap: prevState.exchangesMap.set(mid, [
            ...prevState.exchangesMap.get(mid)!,
            type === "chat"
              ? {
                  id: prevState.counter,
                  opt: type,
                  content: [ask],
                  isLoading: true,
                }
              : type === "similar"
              ? {
                  id: prevState.counter,
                  opt: type,
                  content: [],
                  isLoading: true,
                }
              : {
                  id: prevState.counter,
                  opt: type,
                  content: "",
                  isLoading: true,
                },
          ]),
        };
      }
    });
    return tmp;
  },
  addItem: (mid, item) => {
    set((prevState) => {
      if (!prevState.exchangesMap.has(mid)) {
        return {
          counter: prevState.counter + 1,
          exchangesMap: prevState.exchangesMap.set(mid, [
            {
              ...item,
              id: prevState.counter,
              isLoading: false,
            } as ExchangeItem,
          ]),
        };
      } else {
        const lastMsgs = prevState.exchangesMap.get(mid)!;
        return {
          counter: prevState.counter + 1,
          exchangesMap: prevState.exchangesMap.set(mid, [
            ...lastMsgs,
            {
              ...item,
              id: prevState.counter,
              isLoading: false,
            } as ExchangeItem,
          ]),
        };
      }
    });
  },
  deleteItem: (mid, id) => {
    set((prevState) => {
      const lastMsgs = prevState.exchangesMap.get(mid)!;
      const index = lastMsgs.findIndex((item) => item.id === id);
      if (index !== -1) {
        return {
          exchangesMap: prevState.exchangesMap.set(
            mid,
            lastMsgs.slice(0, index).concat(lastMsgs.slice(index + 1))
          ),
        };
      } else return {};
    });
  },
  //替换指定位置的元素（目前只用于重新生成图片）
  replaceImg: (mid, id, item) => {
    set((prevState) => {
      const lastMsgs = prevState.exchangesMap.get(mid)!;
      const index = lastMsgs.findIndex((item) => item.id === id);
      const tmp = lastMsgs.slice(0, index);
      if (index !== -1) {
        tmp.push({ ...item, id: id } as ExchangeItem);
        return {
          exchangesMap: prevState.exchangesMap.set(
            mid,
            tmp.concat(lastMsgs.slice(index + 1))
          ),
        };
      } else return {};
    });
  },
}));
