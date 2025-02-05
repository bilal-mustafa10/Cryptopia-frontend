"use client";

import { Button } from "@/components/ui/button";
import { CornerRightUp, Plus, Send } from "lucide-react";
import { useState, useRef, useEffect, SetStateAction } from "react";
import { streamText } from "@/utils/stream-text";
import { useChatStore } from "@/hooks/use-chat-store";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const API_URL = "/api/chat"; // Replace with your actual API endpoint

export function Chat() {
  const [message, setMessage] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const { messages, addMessage, isLoading, setIsLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Removed unnecessary dependencies: streamingContent

  const simulateAPICall = async (userMessage: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const responses = [
      "Based on my analysis of the current market trends, I can see that Bitcoin is showing strong momentum. The technical indicators suggest a potential breakout above the resistance level at $45,000. However, it's important to note that market volatility remains high.",
      "Looking at the cryptocurrency market, I notice several interesting patterns. Ethereum's recent upgrade has significantly improved its scalability, which could drive increased adoption. The DeFi sector also shows promising growth metrics.",
      "From a trading perspective, I recommend maintaining a diversified portfolio. The current market conditions suggest that both large-cap cryptocurrencies and select alt-coins could perform well in the coming weeks.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user" as const,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(userMessage);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await simulateAPICall(message);
      setIsLoading(false);
      let fullContent = "";

      for await (const chunk of streamText(response)) {
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      setStreamingContent("");
      addMessage({
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col bg-white border rounded-3xl h-[calc(78vh-40px)] dark:bg-neutral-900 dark:border-neutral-700 `}
    >
      <div className="border-b p-4 flex items-center justify-between border-neutral-700">
        <h1 className="text-xl font-semibold">CrypGod</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage
                src={msg.role === "user" ? "/avatar.svg" : "/avatar.svg"}
                alt={msg.role === "user" ? "User Avatar" : "CrypGod Avatar"}
              />
              <AvatarFallback>{msg.role === "user" ? "Y" : "C"}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {msg.role === "user" ? "You" : "CrypGod"}
                </span>
              </div>
              <p className="text-sm text-foreground">{msg.content}</p>
            </div>
          </div>
        ))}
        {streamingContent && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="/avatar.svg" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">CrypGod</span>
              </div>
              <p className="text-sm text-foreground">
                {streamingContent}
                <span className="inline-block w-1 h-4 ml-0.5 bg-foreground animate-pulse" />
              </p>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="/avatar.svg" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">CrypGod</span>
              </div>
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-neutral-700"
      >
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setMessage(e.target.value)
            }
            placeholder="Type a message..."
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading}
            className="shrink-0 bg-white/5 py-1 px-1 hover:bg-white/10"
          >
            <CornerRightUp
              className={cn("w-4 h-4 transition-opacity dark:text-white", {
                "opacity-100": message,
                "opacity-30": !message,
              })}
            />
          </Button>
        </div>
      </form>
    </div>
  );
}
