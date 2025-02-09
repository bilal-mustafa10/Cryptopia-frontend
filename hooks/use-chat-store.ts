// src/hooks/use-chat-store.ts
import { create } from "zustand";
import type { Message } from "@/types";
import { sendChatMessage } from "@/services/chat-service";
import { streamText } from "@/utils/stream-text";

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setIsLoading: (loading: boolean) => void;
  removeMessage: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      id: "1",
      content:
        "Hello! I'm CrypGod, your AI crypto assistant. I can help you with cryptocurrency analysis, market trends, and trading strategies. How can I assist you today?",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ],
  isLoading: false,
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setIsLoading: (loading: boolean) =>
    set(() => ({
      isLoading: loading,
    })),
  removeMessage: (id: string) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),
  sendMessage: async (content: string) => {
    if (get().isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp,
    };

    get().addMessage(userMessage);
    get().setIsLoading(true);

    const assistantMessageId = Date.now().toString() + "-assistant";
    const placeholderMessage: Message = {
      id: assistantMessageId,
      content: "CrypGod is thinking...",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    get().addMessage(placeholderMessage);

    try {
      await sendChatMessage(content, (update) => {
        // Update the assistant message in the store as new data comes in
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: update } : msg,
          ),
        }));
      });
    } catch (error) {
      console.error("Error sending message:", error);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Failed to get response from the agent." }
            : msg,
        ),
      }));
    } finally {
      get().setIsLoading(false);
    }
  },
}));
