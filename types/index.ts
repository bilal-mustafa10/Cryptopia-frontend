export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface AIResponse {
  content: string;
  role: "assistant";
}
