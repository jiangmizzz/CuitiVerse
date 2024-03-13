/// <reference types="vite/client" />

export type eduType =
  | "elementary"
  | "secondary"
  | "bachelor's degree"
  | "master's degree"
  | "Ph.D.";

export type normType =
  | "Iconic"
  | "Homophony"
  | "Homophonic pun"
  | "Synonym"
  | "Homograph"
  | "Satire";

export type optKey = "def" | "similar" | "gen_img" | "chat" | "trans";

export type checkType = "Appropriate" | "Emotion" | "Inference";

export type seriesType = "Animal" | "Plant" | "Fruit" | "Other";

export type emotionType = "Positive" | "Neutral" | "Negative";

export type conditionType =
  | "element"
  | "rhetoric"
  | "symbol"
  | "custom"
  | "emotion";

export interface Settings {
  culture: string;
  age: number;
  edu: eduType;
  u1: number;
  u2: number;
  remark: string;
}

export interface ExploreTrack {
  noumenon: { nid: string; text: string }; //物像
  //喻体
  metaphor: MetaphorType;
  foreignMetaphor: {
    //喻体转译
    text: string[];
  };
}

export interface Node {
  id: string; //nid
  value: number; //物像数量
  label: string; //标签，即物像名
}

export interface Edge {
  id: string; //以+间隔的nid
  title: string; //悬停到边上时的文本
  from: string; //to和from都是边的两端
  to: string;
  value: number; //组合数量
}
export interface NoumenonType {
  nid: string; //物像id
  name: string[]; //物像名
  metaphors: {
    //该物像对应的喻体分布情况
    type: normType;
    count: number;
  }[];
}
export interface PaintingType {
  pid: string; //画作id
  name: string[]; //画作名
  src: string; //画作链接
  noumenons: (NoumenonType & {
    positions: number[][]; //选框位置列表，内层4个number表示起始点的x,y,w,h
  })[];
  combinations: (NoumenonType & {
    //组合物象
    elements: string[]; //组合中包含的nid
  })[];
}

export interface MetaphorType {
  mid: string; //标识喻体的唯一id
  text: string[]; //喻体文本
  //本体到喻体的转化类型（颜色编码）
  normType: normType;
  emotion: emotionType;
  meaning: string[]; //定义，双语
  element?: string[]; //foreign symbol才有的element部分，双语
}

export type ExchangeItem = (
  | {
      opt: "def" | "gen_img";
      content: string;
    }
  | {
      opt: "chat" | "similar";
      content: string[]; // chat形式时content为string[2], similar形式时为src列表
    }
) & { id: number; isLoading: boolean };

export interface ExtensionMsg {
  id: number;
  sender: "user" | "robot";
  content: string;
  isLoading: boolean;
}

export interface ResponseType<T> {
  success: boolean;
  data: T;
  errcode: number;
  errmsg: string;
}
export interface cloudData {
  value: number;
  name: string;
  nid: string;
}

export interface CloudData {
  type: seriesType;
  data: {
    value: number;
    name: string;
    nid: string;
  }[];
}
