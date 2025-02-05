import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconExchange,
  IconHome,
  IconChartDots,
  IconChartPie,
  IconRouteSquare,
  IconTransactionBitcoin,
  IconFileAnalytics,
} from "@tabler/icons-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard",
    },

    {
      title: "Portfolio",
      icon: (
        <IconChartPie className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/portfolio",
    },
    {
      title: "Charts",
      icon: (
        <IconChartDots className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/charts",
    },
    {
      title: "Guides",
      icon: (
        <IconRouteSquare className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/guides",
    },
    {
      title: "Exchange",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/exchange",
    },

    {
      title: "Interactions",
      icon: (
        <IconTransactionBitcoin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/interactions",
    },
    {
      title: "Reports",
      icon: (
        <IconFileAnalytics className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/reports",
    },
  ];
  return (
    <div className="flex items-center justify-center h-[10rem] w-full">
      <FloatingDock items={links} />
    </div>
  );
}
