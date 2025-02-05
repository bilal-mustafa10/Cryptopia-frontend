import { FloatingDockDemo } from "@/app/components/ui/FloatingDockDemo";

export default async function ChartsPage() {
  return (
    <div className="min-h-screen w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Welcome to your charts
      </p>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-30">
        <FloatingDockDemo />
      </div>
    </div>
  );
}
