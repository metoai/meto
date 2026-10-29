"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Grainient } from "@/components/ui/grainient";

const HERO_DARK_PALETTE = ["#0a0812", "#240b05", "#9a3412", "#ff4d00", "#ffaa70"];
const HERO_LIGHT_PALETTE = ["#ffffff", "#fff5eb", "#fed7aa", "#ff9e66", "#ff5500"];

export function LandingHeroBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted
    ? resolvedTheme === "light"
    : typeof document !== "undefined"
    ? !document.documentElement.classList.contains("dark")
    : false;

  return (
    <div className="landing-hero-bg pointer-events-none select-none overflow-hidden" aria-hidden>
      {/* 1. Grainient Living Brand Canvas with film grain & fluid wave motion */}
      <div className="absolute inset-0 z-0 opacity-80 dark:opacity-75 meto-hero-mask">
        <Grainient
          colors={isLight ? HERO_LIGHT_PALETTE : HERO_DARK_PALETTE}
          intro={false}
          lightMode={false}
          angle={45}
          flow={0.85}
          speed={0.45}
          silk={0.35}
          grainAmount={0.06}
          grainSize={1.2}
          softness={0.9}
          interactive={true}
          stir={1.0}
          className="w-full h-full"
        />
      </div>

      {/* 2. Subtle Dot Matrix Pattern */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:bg-[radial-gradient(#333333_1px,transparent_1px)] dark:opacity-20 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 3. Soft ambient orange warmth in the bottom corner with smooth motion drift */}
      <div className="absolute -bottom-32 -left-32 z-[2] w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-[var(--primary)]/15 via-[var(--primary)]/5 to-transparent blur-3xl opacity-70 dark:opacity-40 meto-motion-gradient-b" />
    </div>
  );
}
