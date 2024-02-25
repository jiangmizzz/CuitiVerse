/// <reference types="vite/client" />

export type eduType =
  | "elementary"
  | "secondary"
  | "bachelor's degree"
  | "master's degree"
  | "Ph.D.";

export type normType =
  | "Identity"
  | "Homophony"
  | "Homophonic pun"
  | "Synonym"
  | "Homograph"
  | "Satire";

export interface Settings {
  culture: string;
  age: number;
  edu: eduType;
  u1: number;
  u2: number;
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
