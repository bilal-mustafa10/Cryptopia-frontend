import { create } from "zustand";
import type { Message } from "@/types";

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: "1",
      content:
        "Hello! I'm CrypGod, your AI crypto assistant. I can help you with cryptocurrency analysis, market trends, and trading strategies. How can I assist you today?",
      role: "assistant",
      timestamp: Date.now().toString(),
    },
  ],
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setIsLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),
}));
