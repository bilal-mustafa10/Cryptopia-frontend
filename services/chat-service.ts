export interface ChatResponse {
  type: 'message' | 'tool' | 'error' | 'complete';
  content: string;
  session_id?: string;
}

let currentSessionId: string | null = null;

export async function sendChatMessage(
  message: string,
  onUpdate: (update: string) => void
): Promise<void> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({ 
        message, 
        stream: true,
        session_id: currentSessionId 
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chat response: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Process all complete lines
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          const parsed = JSON.parse(line) as ChatResponse;
          if (parsed.session_id) {
            currentSessionId = parsed.session_id;
          }
          if (parsed.type === 'message' || parsed.type === 'tool') {
            onUpdate(parsed.content);
          } else if (parsed.type === 'error') {
            throw new Error(parsed.content);
          }
        } catch (e) {
          console.error("Error parsing SSE:", e, "Line:", line);
        }
      }
      
      // Keep the last incomplete line in the buffer
      buffer = lines[lines.length - 1];
    }

    // Process any remaining data
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer) as ChatResponse;
        if (parsed.session_id) {
          currentSessionId = parsed.session_id;
        }
        if (parsed.type === 'message' || parsed.type === 'tool') {
          onUpdate(parsed.content);
        }
      } catch (e) {
        console.error("Error parsing final SSE chunk:", e);
      }
    }
  } catch (error: any) {
    console.error("Chat service error:", error);
    throw error;
  }
}

export function clearSession() {
  currentSessionId = null;
}
