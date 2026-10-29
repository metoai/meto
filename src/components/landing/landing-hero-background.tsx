"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Grainient } from "@/components/ui/grainient";

const HERO_DARK_PALETTE = ["#180e08", "#381508", "#7c2807", "#ff4d00", "#ff9e66"];
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
      {/* 1. Grainient Living Brand Canvas with warm ember fluid wave motion */}
      <div className="absolute inset-0 z-0 opacity-80 dark:opacity-90 meto-hero-mask">
        <Grainient
          colors={isLight ? HERO_LIGHT_PALETTE : HERO_DARK_PALETTE}
          intro={false}
          lightMode={false}
          angle={45}
          flow={0.85}
          speed={0.45}
          silk={0.35}
          grainAmount={0.05}
          grainSize={1.1}
          softness={0.9}
          interactive={true}
          stir={1.0}
          className="w-full h-full"
        />
      </div>

      {/* 2. Subtle Dot Matrix Pattern */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:bg-[radial-gradient(#404040_1px,transparent_1px)] dark:opacity-25 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 3. Luminous upper-center ambient warmth (lifts dark void behind headline & card) */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-[2] w-[850px] max-w-full h-[460px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,85,0,0.18)_0%,rgba(255,120,40,0.07)_50%,transparent_75%)] blur-2xl opacity-60 dark:opacity-85 pointer-events-none" />

      {/* 4. Soft ambient orange warmth in the bottom corner with smooth motion drift */}
      <div className="absolute -bottom-28 -left-28 z-[2] w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-[var(--primary)]/20 via-[var(--primary)]/8 to-transparent blur-3xl opacity-70 dark:opacity-65 meto-motion-gradient-b" />

      {/* 5. Delicate top-right secondary ambient accent */}
      <div className="absolute -top-20 -right-20 z-[2] w-[380px] h-[380px] rounded-full bg-gradient-to-bl from-[var(--primary)]/14 via-[var(--primary)]/5 to-transparent blur-3xl opacity-50 dark:opacity-55" />
    </div>
  );
}
