export interface CryptoData {
  timestamp: number;
  bitcoin: number;
  ethereum: number;
  solana: number;
  cardano: number;
}

export interface CryptoChartProps {
  data: CryptoData[];
  crypto: keyof Omit<CryptoData, "timestamp">;
  color: string;
}
