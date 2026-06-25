import { LandingHeroBackground } from "@/components/landing/landing-hero-background";
import { LandingHeroCopy } from "@/components/landing/landing-hero-copy";
import { LandingHeroNav } from "@/components/landing/landing-hero-nav";
import { LandingHeroPartners } from "@/components/landing/landing-hero-partners";

type LandingHeroSectionProps = {
  chatStarted: boolean;
  isLoggedIn?: boolean;
  loggedInHref?: string;
  loggedInLabel?: string;
  children: React.ReactNode;
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
        chatStarted ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
      }`}
    >
      <LandingHeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-4 sm:px-6">
        <LandingHeroNav
          isLoggedIn={isLoggedIn}
          loggedInHref={loggedInHref}
          loggedInLabel={loggedInLabel}
        />

        <div
          className={`flex flex-1 flex-col items-center ${
            chatStarted ? "py-4 lg:py-6" : "justify-center py-10 pb-8 lg:py-12 lg:pb-10"
          }`}
        >
          <div
            className={`flex w-full max-w-[720px] flex-col ${
              chatStarted ? "min-h-0 flex-1 items-stretch" : "flex-1 items-center"
            }`}
          >
            {!chatStarted ? (
              <div className="mb-10 w-full sm:mb-12">
                <LandingHeroCopy chatStarted={false} />
              </div>
            ) : null}

            <div
              className={`w-full ${
                chatStarted
                  ? "flex min-h-0 flex-1 flex-col"
                  : "landing-animate-in"
              }`}
              style={chatStarted ? undefined : { animationDelay: "0.1s" }}
            >
              {children}
            </div>

            {!chatStarted ? <LandingHeroPartners /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
