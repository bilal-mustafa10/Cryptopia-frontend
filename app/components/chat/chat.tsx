"use client";

import { Button } from "@/components/ui/button";
import { CornerRightUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { streamText, StreamResponse } from "@/utils/stream-text";
import { useChatStore } from "@/hooks/use-chat-store";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AIThinking } from "./AIThinking";
import { GlassCard } from "@/components/ui/GlassCard";

// MarkdownRenderer with GitHub Flavored Markdown support
const MarkdownRenderer = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ node, ...props }) => (
          <div className="relative inline-block">
            <img
              {...props}
              alt={props.alt}
              className="rounded-lg shadow-lg w-[400px] object-contain my-2"
            />
          </div>
        ),
      }}
      className="prose prose-zinc dark:prose-invert max-w-none"
    >
      {children}
    </ReactMarkdown>
  );
};

export function Chat() {
  const [message, setMessage] = useState("");
  const [streamingContent, setStreamingContent] =
    useState<StreamResponse | null>(null);
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
    let currentResponse: string | { content: string; image_url: string } = "";

    try {
      // Set initial thinking state
      setStreamingContent({
        type: "thinking",
        content: "Analyzing your request...",
        step: "start",
      } as StreamResponse);

      // Process streaming chunks from the API
      for await (const chunk of streamText(message)) {
        setStreamingContent(chunk as StreamResponse);
        if (chunk.type === "message" || chunk.type === "image") {
          currentResponse = chunk.content;
          // If it's an image response, include the image_url
          if (chunk.type === "image" && "image_url" in chunk) {
            currentResponse = {
              content: chunk.content,
              image_url: chunk.image_url ? chunk.image_url : "",
            };
          }
        }
      }

      if (currentResponse) {
        addMessage({
          id: (Date.now() + 1).toString(),
          content:
            typeof currentResponse === "string"
              ? currentResponse
              : currentResponse.content,
          image_url:
            typeof currentResponse === "string"
              ? undefined
              : currentResponse.image_url,
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
        type: "error",
        content: "Failed to get response from the agent.",
      } as StreamResponse);
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

          {streamingContent.type === "thinking" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AIThinking />
              <span>{streamingContent.content}</span>
            </div>
          )}

          {streamingContent.type === "tool_usage" && (
            <div className="text-muted-foreground">
              <p>{streamingContent.content}</p>
              {streamingContent.details && (
                <p className="text-sm opacity-80">{streamingContent.details}</p>
              )}
            </div>
          )}

          {streamingContent.type === "message" && (
            <MarkdownRenderer>{streamingContent.content}</MarkdownRenderer>
          )}

          {streamingContent.type === "image" && (
            <div className="grid gap-2">
              <MarkdownRenderer>{streamingContent.content}</MarkdownRenderer>
              {streamingContent.image_url && (
                <img
                  src={streamingContent.image_url}
                  alt="Generated by DALLE-3"
                  className="rounded-lg shadow-lg w-[400px] object-contain"
                />
              )}
            </div>
          )}

          {streamingContent.type === "error" && (
            <div className="text-destructive">{streamingContent.content}</div>
          )}
        </div>
      </div>
    );
  };

  const renderMessage = (message: any) => (
    <div key={message.id} className="flex items-start gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage
          src={message.role === "user" ? "/user-avatar.svg" : "/avatar.svg"}
        />
        <AvatarFallback>{message.role === "user" ? "U" : "C"}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {message.role === "user" ? "You" : "CrypGod"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
        </div>
        <div
          className={cn(
            "text-foreground",
            message.role === "assistant" &&
              "prose prose-zinc dark:prose-invert max-w-none",
          )}
        >
          {message.role === "assistant" ? (
            <MarkdownRenderer>{message.content}</MarkdownRenderer>
          ) : (
            message.content
          )}
          {message.image_url && (
            <img
              src={message.image_url}
              alt="Generated by DALLE-3"
              className="mt-2 rounded-lg shadow-lg w-[400px] object-contain p-2"
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <GlassCard>
      <div className="flex flex-col h-[calc(95vh)] relative">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between border-white/5">
          <h1 className="text-xl font-semibold">CrypGod</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => renderMessage(msg))}
          {streamingContent && renderStreamingContent()}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-white/5"
        >
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
    </GlassCard>
  );
}
