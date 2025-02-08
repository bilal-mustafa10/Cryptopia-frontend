// FloatingDock.tsx
"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  activeTabs,
  setActiveTabs,
  desktopClassName,
}: {
  items: { title: string; icon: React.ReactNode }[];
  activeTabs: string[];
  setActiveTabs: (tabs: string[]) => void;
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        activeTabs={activeTabs}
        setActiveTabs={setActiveTabs}
        className={desktopClassName}
      />
    </>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  activeTabs,
  setActiveTabs,
}: {
  items: { title: string; icon: React.ReactNode }[];
  className?: string;
  activeTabs: string[];
  setActiveTabs: (tabs: string[]) => void;
}) => {
  let mouseY = useMotionValue(Infinity); // Track mouse Y movement

  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.pageY)} // Track Y-axis movement
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex md:flex-col h-auto w-16 gap-4 items-center rounded-full bg-gray-50 dark:bg-neutral-900 px-4 py-8",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer
          key={item.title}
          mouseY={mouseY}
          title={item.title}
          icon={item.icon}
          activeTabs={activeTabs}
          setActiveTabs={setActiveTabs}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseY,
  title,
  icon,
  activeTabs,
  setActiveTabs,
}: {
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
  activeTabs: string[];
  setActiveTabs: (tabs: string[]) => void;
}) {
  const pathname = usePathname();
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);
  const isActive = activeTabs.includes(title);

  const handleToggle = () => {
    if (isActive) {
      setActiveTabs(activeTabs.filter((tab) => tab !== title));
    } else {
      setActiveTabs([...activeTabs, title]);
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleToggle}
      className={cn(
        "aspect-square rounded-full flex items-center justify-center relative cursor-pointer bg-gray-200 dark:bg-neutral-800",
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 2, y: "-50%" }}
            className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-12 top-1/2 -translate-y-1/2 w-fit text-xs"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className={cn(
          "flex items-center justify-center",
          isActive ? "text-white" : "text-neutral-500",
        )}
      >
        {icon}
      </motion.div>
    </motion.div>
  );
}
