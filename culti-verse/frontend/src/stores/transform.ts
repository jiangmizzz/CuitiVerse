/**
 * 记录symbol的多次转译历史、以及每次的转译结果
 */
import { create } from "zustand";
import { MetaphorType, conditionType } from "../vite-env";

//单个tab包含的数据量
interface TransformEntry {
  tid: string; // index自增不重复，是唯一的，作为key时与mid拼接，实现全局唯一
  culture: string;
  keeping: conditionType[];
  requirement: conditionType[];
}

interface TransformState {
  //单个 symbol 与多个 tab 的映射, mid -- tabs
  tabsMap: Map<string, { counter: number; tabs: TransformEntry[] }>;
  //单个 tab 与多个 foreign symbol 的映射, mid+tid -- foreign symbols
  fsMap: Map<string, MetaphorType[]>;
  addTab: (mid: string, newTab: Omit<TransformEntry, "tid">) => string; //返回tid
  deleteTab: (mid: string, tid: string) => void;
  setFs: (mid: string, tid: string, symbols: MetaphorType[]) => void;
}

export const useTransformStore = create<TransformState>()((set) => ({
  tabsMap: new Map<string, { counter: number; tabs: TransformEntry[] }>([]),
  fsMap: new Map<string, MetaphorType[]>([]),
  //添加一个新tab
  addTab: (mid, newTab) => {
    let tid = "";
    set((prevState) => {
      if (prevState.tabsMap.has(mid)) {
        const prev = prevState.tabsMap.get(mid)!;
        tid = prev.counter.toString();
        return {
          tabsMap: prevState.tabsMap.set(mid, {
            counter: prev.counter + 1,
            tabs: [
              ...prev.tabs,
              {
                tid: prev.counter.toString(),
                culture: newTab.culture,
                keeping: [...newTab.keeping],
                requirement: [...newTab.requirement],
              },
            ],
          }),
        };
      } else {
        tid = "1";
        return {
          tabsMap: prevState.tabsMap.set(mid, {
            counter: 2,
            tabs: [
              {
                tid: "1",
                culture: newTab.culture,
                keeping: [...newTab.keeping],
                requirement: [...newTab.requirement],
              },
            ],
          }),
        };
      }
    });
    return tid;
  },
  //删除一个tab
  deleteTab: (mid, tid) => {
    set((prevState) => {
      const prev = prevState.tabsMap.get(mid)!;
      const index = prev.tabs.findIndex((t) => t.tid === tid);
      if (index >= 0) {
        const newFsMap = prevState.fsMap;
        newFsMap.delete(mid + tid); //tips: mid + tid 实现唯一性
        if (prev.tabs.length === 1) {
          //如果tabs为空则删除此键值对
          const newTabsMap = prevState.tabsMap;
          newTabsMap.delete(mid);
          return {
            tabsMap: newTabsMap,
            fsMap: newFsMap,
          };
        } else {
          return {
            tabsMap: prevState.tabsMap.set(mid, {
              counter: prev.counter,
              tabs: prev.tabs
                .slice(0, index)
                .concat(prev.tabs.slice(index + 1)),
            }),
            fsMap: newFsMap,
          };
        }
      } else {
        return {};
      }
    });
  },
  //设置单个tab内容
  setFs: (mid, tid, symbols) => {
    set((prevState) => {
      return {
        fsMap: prevState.fsMap.set(mid + tid, [...symbols]),
      };
    });
  },
}));
