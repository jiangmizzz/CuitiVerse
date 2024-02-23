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
