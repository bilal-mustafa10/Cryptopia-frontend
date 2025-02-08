// DashboardPage.tsx
'use client';

import { FloatingDockDemo } from "@/app/components/ui/FloatingDockDemo";
import { Chat } from "@/app/components/chat/chat";
import { Crypto } from "@/app/components/charts/crypto";
import CryptoWallet from "@/app/components/wallet/crypto-wallet";
import CryptoTransactions from "@/app/components/wallet/crypto-transaction";
import { useState } from "react";

export default function DashboardPage() {
    const [activeTabs, setActiveTabs] = useState([
        "Portfolio",
        "Charts",
        "Transactions",
        "Chat",
    ]);

    return (
        <div className="relative h-screen dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]">
            {/* Web App Icon at Top Left */}
            <div className="fixed top-0 left-0 z-40 p-4">
                <div className="w-16 h-16 border-white/5 relative backdrop-blur-3xl bg-black/20 rounded-full flex items-center justify-center cursor-pointer" onClick={() => window.location.href = '/'}>
                    <img src="/icon.svg" alt="Web App Icon" className="w-12 h-12" />
                </div>
            </div>

            {/* Floating Dock Positioned in the Middle */}
            <div className="fixed left-0 top-1/2 z-30 p-4 transform -translate-y-1/2">
                <FloatingDockDemo activeTabs={activeTabs} setActiveTabs={setActiveTabs} />
            </div>

            {/* Main Content – Pushed to the Right */}
            <div className="flex p-4 ml-24 h-full">
                <div className="flex-1 h-full">
                    <div className="grid grid-cols-10 gap-4 h-full">
                        {(activeTabs.includes("Portfolio") ||
                            activeTabs.includes("Charts") ||
                            activeTabs.includes("Transactions")) && (
                            <div className="sm:col-span-10 md:col-span-6 flex flex-col gap-4 h-full">
                                {activeTabs.includes("Charts") && (
                                    <Crypto />
                                )}
                                {activeTabs.includes("Portfolio") && (
                                    <CryptoWallet />
                                )}
                                {activeTabs.includes("Transactions") && (
                                    <CryptoTransactions />
                                )}
                            </div>
                        )}

                        {activeTabs.includes("Chat") && (
                            <div className="sm:col-span-10 md:col-span-4">
                                <Chat />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
