export interface StreamResponse {
  type: 'thinking' | 'tool_usage' | 'message' | 'error';
  content: string;
  step?: string;
  tool_type?: string;
  details?: string;
}

export async function* streamText(message: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        stream: true,
      }),
    });

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data && data.type && data.content) {
              yield data as StreamResponse;
            }
          } catch (e) {
            // Silently skip invalid JSON
          }
        }
      }
    }

    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer);
        if (data && data.type && data.content) {
          yield data as StreamResponse;
        }
      } catch (e) {
        // Silently skip invalid JSON
      }
    }
  } catch (error) {
    yield {
      type: 'error',
      content: 'Error connecting to the agent. Please try again.',
    };
  }
}
