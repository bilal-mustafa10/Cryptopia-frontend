// FloatingDockDemo.tsx
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { ChartArea, ChartPie, MessageCircle, Rotate3d } from "lucide-react";

export function FloatingDockDemo({
                                   activeTabs,
                                   setActiveTabs,
                                 }: {
  activeTabs: string[];
  setActiveTabs: (activeTabs: string[]) => void;
}) {
  const links = [
    {
      title: "Portfolio",
      icon: <ChartPie className="h-full w-full" />,
    },
    {
      title: "Charts",
      icon: <ChartArea className="h-full w-full" />,
    },
    {
      title: "Transactions",
      icon: <Rotate3d className="h-full w-full" />,
    },
    {
      title: "Chat",
      icon: <MessageCircle className="h-full w-full" />,
    },
  ];

  return (
      <div className="flex items-center justify-center h-[10rem] w-full">
        <FloatingDock
            items={links}
            activeTabs={activeTabs}
            setActiveTabs={setActiveTabs}
        />
      </div>
  );
}
