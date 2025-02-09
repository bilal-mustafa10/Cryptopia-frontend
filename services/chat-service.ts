// src/services/chatService.ts

export interface ChatResponse {
  response: string;
  // If in the future you need to support images or other fields, add them here.
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Disable streaming by setting stream to false
    body: JSON.stringify({ message, stream: false }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chat response.");
  }

  return await res.json();
}
