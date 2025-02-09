// src/hooks/use-chat-store.ts
import { create } from "zustand";
import type { Message } from "@/types"; // Ensure your Message type includes id, content, role, timestamp, etc.
import { sendChatMessage } from "@/services/chat-service";
import { streamText } from "@/utils/stream-text";

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setIsLoading: (loading: boolean) => void;
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
  sendMessage: async (content: string) => {
    // Prevent sending if a message is already being processed
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

    // Add the user's message and enable the loading state using the helper methods
    get().addMessage(userMessage);
    get().setIsLoading(true);

    // Create a unique ID for the assistant's placeholder message
    const assistantMessageId = Date.now().toString() + "-assistant";

    // Add a placeholder message with "CrypGod is thinking..." text
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
      // Call the API which returns a JSON with { response: string }
      const responseData = await sendChatMessage(content);

      // Clear the placeholder text before starting to stream the final response
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content: "" } : msg,
        ),
      }));

      // Stream the response word by word using the streamText generator
      let streamedContent = "";
      for await (const word of streamText(responseData.response)) {
        streamedContent += word;
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamedContent }
              : msg,
          ),
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // If an error occurs, update the placeholder message with an error message
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Failed to get response from the agent." }
            : msg,
        ),
      }));
    } finally {
      // Disable loading state after processing is complete
      get().setIsLoading(false);
    }
  },
}));
