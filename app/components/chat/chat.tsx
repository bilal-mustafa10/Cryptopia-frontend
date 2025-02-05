"use client";

import { Button } from "@/components/ui/button";
import { CornerRightUp } from "lucide-react";
import { useState, useRef, useEffect, SetStateAction } from "react";
import { streamText, StreamResponse } from "@/utils/stream-text";
import { useChatStore } from "@/hooks/use-chat-store";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AIThinking } from "./AIThinking";

export function Chat() {
  const [message, setMessage] = useState("");
  const [streamingContent, setStreamingContent] = useState<StreamResponse | null>(null);
  const { messages, addMessage, isLoading, setIsLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

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
    let currentResponse = '';

    try {
      // Set initial thinking state
      setStreamingContent({
        type: 'thinking',
        content: 'Analyzing your request...',
        step: 'start'
      });

      for await (const chunk of streamText(message)) {
        setStreamingContent(chunk);
        if (chunk.type === 'message') {
          currentResponse = chunk.content;
        }
      }

      if (currentResponse) {
        addMessage({
          id: (Date.now() + 1).toString(),
          content: currentResponse,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setStreamingContent({
        type: 'error',
        content: 'Failed to get response from the agent.',
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setStreamingContent(null);
      }, 500);
    }
  };

  const renderStreamingContent = () => {
    if (!streamingContent) return null;

    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/user-avatar.svg" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <div className="grid gap-1 w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">CrypGod</span>
          </div>
          
          {streamingContent.type === 'thinking' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span>{streamingContent.content}</span>
            </div>
          )}
          
          {streamingContent.type === 'tool_usage' && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"/>
                {streamingContent.content}
              </p>
              {streamingContent.details && (
                <p className="text-xs text-muted-foreground/60 pl-4">
                  {streamingContent.details}
                </p>
              )}
            </div>
          )}
          
          {streamingContent.type === 'message' && (
            <div className="text-sm text-foreground">
              {streamingContent.content}
              <span className="inline-block w-1 h-4 ml-0.5 bg-foreground animate-pulse" />
            </div>
          )}
          
          {streamingContent.type === 'error' && (
            <p className="text-sm text-red-500">
              {streamingContent.content}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white border rounded-3xl h-[calc(90vh-40px)] dark:bg-neutral-900 dark:border-neutral-700">
      <div className="border-b p-4 flex items-center justify-between border-neutral-700">
        <h1 className="text-xl font-semibold">CrypGod</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage
                src={msg.role === "user" ? "/avatar.svg" : "/user-avatar.svg"}
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
              <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {streamingContent && renderStreamingContent()}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-700">
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
