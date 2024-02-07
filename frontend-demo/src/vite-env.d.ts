/// <reference types="vite/client" />

export interface MessageProps {
  sender: "user" | "robot";
  content: string;
  isLoading: boolean;
}
