"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Grainient } from "@/components/ui/grainient";

const HERO_DARK_PALETTE = ["#0b0b0b", "#1a0b06", "#872a08", "#ff4d00", "#ffaa70"];
const HERO_LIGHT_PALETTE = ["#ffffff", "#fff7ed", "#ffedd5", "#fed7aa", "#ff6b2c"];

export function LandingHeroBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  return (
    <div className="landing-hero-bg pointer-events-none select-none overflow-hidden" aria-hidden>
      {/* 1. Grainient WebGL Brand Canvas with film grain & fluid motion */}
      <div className="absolute inset-0 z-0 opacity-45 dark:opacity-35 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_25%,#000_35%,transparent_100%)]">
        {mounted && (
          <Grainient
            colors={isLight ? HERO_LIGHT_PALETTE : HERO_DARK_PALETTE}
            lightMode={isLight}
            angle={55}
            flow={0.7}
            speed={0.4}
            silk={0.3}
            grainAmount={0.06}
            grainSize={1.1}
            softness={0.9}
            interactive={true}
            stir={0.8}
            className="w-full h-full"
          />
        )}
      </div>

      {/* 2. Subtle Dot Matrix Pattern */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] opacity-20 dark:bg-[radial-gradient(#333333_1px,transparent_1px)] dark:opacity-25 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 3. Soft ambient orange warmth in the bottom corner */}
      <div className="absolute -bottom-32 -left-32 z-[2] w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-[var(--primary)]/12 via-[var(--primary)]/4 to-transparent blur-3xl opacity-60 dark:opacity-30 meto-motion-gradient-b" />
    </div>
  );
}
