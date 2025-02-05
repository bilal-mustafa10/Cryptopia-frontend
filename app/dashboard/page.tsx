import { FloatingDockDemo } from "@/app/components/ui/FloatingDockDemo";
import { Chat } from "@/app/components/chat/chat";
import { Crypto } from "@/app/components/charts/crypto";

export default function DashboardPage() {
  return (
    <div className="min-h-screen dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]">
      <div className="flex p-4 flex-col">
        <div className={`grid grid-cols-10 gap-2`}>
          <div
            className={`sm:col-span-10 md:col-span-5 lg:col-span-5 xl:col-span-6 2xl:col-span-6`}
          >
            <Crypto />
          </div>
          <div
            className={`relative h-full rounded-xl w-full flex flex-col justify-start transition duration-300 space-y-2 sm:col-span-10 md:col-span-5 lg:col-span-5 xl:col-span-4 2xl:col-span-4`}
          >
            <Chat />
          </div>
        </div>
      </div>

      {/* Floating dock remains fixed at the bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30">
        <FloatingDockDemo />
      </div>
    </div>
  );
}
