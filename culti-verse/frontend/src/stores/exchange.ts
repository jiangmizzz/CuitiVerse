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
  ) => void;
  addItem: (mid: string, item: ExchangeItem) => void;
  deleteItem: (mid: string, id: number) => void;
  replaceImg: (mid: string, id: number, item: Omit<ExchangeItem, "id">) => void;
}

export const useExchangeStore = create<ExchangeState>()((set) => ({
  counter: 0,
  exchangesMap: new Map<string, ExchangeItem[]>([]),
  addLoading: (mid, type, ask) => {
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
  },
  addItem: (mid, item) => {
    //清除上一个loading item (loading item只能在此处清除)
    //然后再添加new item
    set((prevState) => {
      const lastMsgs = prevState.exchangesMap.get(mid)!;
      return {
        counter: prevState.counter + 1,
        exchangesMap: prevState.exchangesMap.set(mid, [
          ...lastMsgs.slice(0, lastMsgs.length - 1),
          { ...item, id: prevState.counter },
        ]),
      };
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
      if (index !== -1) {
        lastMsgs.slice(0, index).push({ ...item, id: id } as ExchangeItem);
        return {
          exchangesMap: prevState.exchangesMap.set(
            mid,
            lastMsgs.concat(lastMsgs.slice(index + 1))
          ),
        };
      } else return {};
    });
  },
}));
