import { LandingHeroBackground } from "@/components/landing/landing-hero-background";
import { LandingHeroCopy } from "@/components/landing/landing-hero-copy";
import { LandingHeroNav } from "@/components/landing/landing-hero-nav";

type LandingHeroSectionProps = {
  chatStarted: boolean;
  isLoggedIn?: boolean;
  loggedInHref?: string;
  loggedInLabel?: string;
  children?: React.ReactNode;
};

export function LandingHeroSection({
  chatStarted,
  isLoggedIn = false,
  loggedInHref,
  loggedInLabel,
  children,
}: LandingHeroSectionProps) {
  return (
    <section
      className={`relative flex flex-col bg-[var(--bg)] ${
        chatStarted
          ? "h-[100dvh] overflow-hidden"
          : "min-h-[100dvh] lg:h-[100dvh] lg:max-h-[940px] overflow-hidden"
      }`}
    >
      <LandingHeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-between px-4 sm:px-6 lg:px-8">
        {/* Refined 72px Top Navigation */}
        <LandingHeroNav
          isLoggedIn={isLoggedIn}
          loggedInHref={loggedInHref}
          loggedInLabel={loggedInLabel}
        />

        {/* Hero Content Area */}
        <div
          className={`flex flex-1 flex-col justify-center ${
            chatStarted ? "py-4 lg:py-6" : "py-2 sm:py-4 lg:py-0"
          }`}
        >
          {chatStarted ? (
            <div className="flex w-full min-h-0 flex-1 items-stretch">
              <div className="mx-auto flex min-h-0 max-w-[720px] flex-1 flex-col">
                {children}
              </div>
            </div>
          ) : (
            /* 2-Column Editorial Split: Left 57%, Right 43% */
            <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[57%_43%] xl:gap-12 my-auto">
              {/* Left Column: Pill Label, 2-line Headline, Copy, CTAs, Trust Signals */}
              <div className="flex w-full flex-col">
                <LandingHeroCopy
                  chatStarted={false}
                  isLoggedIn={isLoggedIn}
                  loggedInHref={loggedInHref}
                  loggedInLabel={loggedInLabel}
                />
              </div>

              {/* Right Column: Central Meto Identity Card, Connections, and AI Integrations */}
              {children ? (
                <div
                  className="landing-animate-in flex w-full justify-center lg:justify-end lg:-translate-y-6 xl:-translate-y-7"
                  style={{ animationDelay: "0.1s" }}
                >
                  {children}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Clean bottom spacer */}
        <div className="pb-4 sm:pb-6 lg:pb-8 w-full" />
      </div>
    </section>
  );
}
