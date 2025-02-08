// CryptoWallet.tsx
import { GlassCard } from "@/components/ui/GlassCard";

const portfolio = [
  { name: "BTC", percentage: 40, color: "bg-blue-500", amount: "$9,418.00" },
  { name: "ETH", percentage: 30, color: "bg-orange-500", amount: "$7,113.00" },
  { name: "USDT", percentage: 20, color: "bg-green-500", amount: "$4,742.00" },
  { name: "USDC", percentage: 10, color: "bg-purple-500", amount: "$2,371.00" },
];

export default function CryptoWallet() {
  return (
    <GlassCard>
      {/* Balance Section */}
      <div className="space-y-2 backdrop-blur-sm bg-white/[0.02] p-4 border border-white/[0.05]">
        <span className="text-sm text-zinc-400 font-medium">Main Wallet</span>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
          $23,547.00
        </h1>
      </div>

      {/* Portfolio Distribution */}
      <div className="space-y-4 backdrop-blur-sm bg-white/[0.02] p-4 border border-white/[0.05]">
        <div className="relative h-2 w-full flex overflow-hidden rounded-full">
          {portfolio.map((asset, index) => (
            <div
              key={index}
              className="flex h-full"
              style={{ width: `${asset.percentage}%` }}
            >
              {Array.from({ length: Math.floor(asset.percentage / 3) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className={`h-full ${asset.color} rounded-full backdrop-blur-xl`}
                    style={{
                      width: `calc(${100 / Math.floor(asset.percentage / 3)}% - 2px)`,
                      marginRight: "2px",
                      opacity: 0.8,
                    }}
                  />
                ),
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          {portfolio.map((asset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${asset.color} opacity-80`}
                />
                <span className="text-zinc-300">
                  {asset.name}{" "}
                  <span className="text-zinc-500">{asset.amount}</span>
                  {"  "}
                  <span className="text-zinc-400">({asset.percentage}%)</span>
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
