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
            chatStarted ? "py-4 lg:py-6" : "justify-start py-8 pb-6 lg:py-10 lg:pb-12"
          }`}
        >
          <div
            className={`flex w-full flex-col ${
              chatStarted ? "min-h-0 flex-1 items-stretch" : "max-w-[1000px] items-center"
            }`}
          >
            {!chatStarted ? (
              <div className="mb-8 w-full sm:mb-10">
                <LandingHeroCopy
                  chatStarted={false}
                  isLoggedIn={isLoggedIn}
                  loggedInHref={loggedInHref}
                  loggedInLabel={loggedInLabel}
                />
              </div>
            ) : null}

            <div
              className={`w-full ${
                chatStarted
                  ? "mx-auto flex min-h-0 max-w-[720px] flex-1 flex-col"
                  : "landing-animate-in w-full"
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
