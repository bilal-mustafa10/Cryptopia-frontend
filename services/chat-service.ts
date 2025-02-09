export interface ChatResponse {
  response: string;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  // Maximum allowed timeout for setTimeout in many browsers (approx 24.8 days)
  const maxTimeout = 2147483647;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), maxTimeout);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({ message, stream: false }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch chat response.");
    }

    return await res.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out after maximum allowed time.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
