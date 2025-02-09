export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  image_url?: string;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  iconPath: string;
  iconColor: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  image_url?: string;
  cryptoData?: CryptoData; // <-- optional field for custom widget data
}
