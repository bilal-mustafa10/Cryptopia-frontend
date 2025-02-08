import { FloatingDockDemo } from "@/app/components/ui/FloatingDockDemo";
import { Chat } from "@/app/components/chat/chat";
import { Crypto } from "@/app/components/charts/crypto";
import CryptoWallet from "@/app/components/wallet/crypto-wallet";
import CryptoTransactions from "@/app/components/wallet/crypto-transaction";

export default function DashboardPage() {
  return (
    <div className="min-h-screen dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]">
      <div className="flex p-4 flex-col">
        {/* 10-column grid */}
        <div className="grid grid-cols-10 gap-4">
          {/* Left Column: 60% (6/10) */}
          <div className="sm:col-span-10 md:col-span-6 flex flex-col space-y-4">
            {/* Wallet on top */}
            <CryptoWallet />
            {/* Chart below */}
            <Crypto />

            <CryptoTransactions />
          </div>

          {/* Right Column: 40% (4/10) */}
          <div className="sm:col-span-10 md:col-span-4">
            <Chat />
          </div>
        </div>
      </div>

      {/* Floating dock fixed at the bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30">
        <FloatingDockDemo />
      </div>
    </div>
  );
}
