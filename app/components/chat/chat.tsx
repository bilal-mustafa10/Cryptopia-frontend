// src/app/components/Chat.tsx
"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CornerRightUp } from "lucide-react";
import { useChatStore } from "@/hooks/use-chat-store";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { sendChatMessage } from "@/services/chat-service";
import { streamText } from "@/utils/stream-text";
import { CryptoWidget } from "@/app/components/cards/crypto-price";
import { Message } from "@/types";

export function Chat() {
  const [message, setMessage] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    removeMessage, // added below in the chat store
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the bottom when messages or streaming content changes
  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Helper to process the assistant response
  async function processAssistantResponse(originalText: string) {
    setIsLoading(true);
    const userMessageId = Date.now().toString();
    const assistantMessageId = (Date.now() + 1).toString();

    try {
      // Add user message immediately
      addMessage({
        id: userMessageId,
        content: originalText,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Create a temporary message for streaming content
      addMessage({
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      await sendChatMessage(originalText, (update) => {
        // Update the temporary message with new content
        removeMessage(assistantMessageId);
        addMessage({
          id: assistantMessageId,
          content: update,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      });
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        id: assistantMessageId,
        content: "Error: Failed to get response from the agent.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isError: true,
        originalMessage: originalText,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Called when the user submits the message form.
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Remove focus from the input.
    inputRef.current?.blur();

    const originalText = message;
    // Process the assistant response.
    await processAssistantResponse(originalText);
    setMessage("");
  };

  // Called when the user clicks the retry button on an error message.
  const handleRetry = async (errorMsg: Message) => {
    // Remove the error message from the chat.
    removeMessage(errorMsg.id);
    // Re-use the original text from the error message to try again.
    await processAssistantResponse(errorMsg.originalMessage!);
  };

  // Render a chat message. If the message is flagged as an error, render a Retry button.
  const renderMessage = (msg: Message) => {
    // If this is an assistant error message, render with a Retry button.
    if (msg.role === "assistant" && msg.isError) {
      return (
        <div key={msg.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="/avatar.svg" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">CrypGod</span>
              <span className="text-xs text-muted-foreground">
                {msg.timestamp}
              </span>
            </div>
            <div className="text-sm text-red-500">
              {msg.content}
              <Button
                onClick={() => handleRetry(msg)}
                size="sm"
                variant="outline"
                className="ml-2"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={msg.id} className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={msg.role === "user" ? "/user-avatar.svg" : "/avatar.svg"}
          />
          <AvatarFallback>{msg.role === "user" ? "U" : "C"}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {msg.role === "user" ? "You" : "CrypGod"}
            </span>
            <span className="text-xs text-muted-foreground">
              {msg.timestamp}
            </span>
          </div>
          {msg.role === "assistant" && msg.cryptoData ? (
            // Render the CryptoWidget if cryptoData exists.
            <div className="w-64 my-4">
              <CryptoWidget
                name={"Bitcoin"}
                symbol={"BTC"}
                price={30000}
                change24h={2.45}
                iconPath={"crypto/btc.svg"}
                iconColor={"text-yellow-500"}
              />
            </div>
          ) : (
            <div
              className={cn(
                "text-foreground",
                msg.role === "assistant" &&
                  "prose prose-zinc dark:prose-invert max-w-none",
              )}
            >
              {msg.role === "assistant" ? (
                <MarkdownRenderer>{msg.content}</MarkdownRenderer>
              ) : (
                msg.content
              )}
              {msg.image_url && (
                <img
                  src={msg.image_url}
                  alt="Generated by DALLE-3"
                  className="mt-2 rounded-lg shadow-lg w-[400px] object-contain p-2"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <GlassCard>
      <div className="flex flex-col h-[calc(95vh)] relative">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-white/5">
          <h1 className="text-xl font-semibold">CrypGod</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => renderMessage(msg))}

          {/* Streaming assistant message */}
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

          {/* Loading indicator */}
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

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-white/5"
        >
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
    </GlassCard>
  );
}
