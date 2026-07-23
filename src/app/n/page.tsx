import { NHero } from "@/components/n/n-hero";
import { NTransformation } from "@/components/n/n-transformation";
import { NEcosystem } from "@/components/n/n-ecosystem";
import { NUseCases } from "@/components/n/n-use-cases";
import { NContextScore } from "@/components/n/n-context-score";
import { NContinuousSync } from "@/components/n/n-continuous-sync";
import { NUniversalAccess } from "@/components/n/n-universal-access";
import { NPricing } from "@/components/n/n-pricing";
import { NFinalCta } from "@/components/n/n-final-cta";

export default function NPage() {
  return (
    <>
      {/* 1. Hero */}
      <NHero />

      {/* 2. Transformation Visual — the most important section */}
      <NTransformation />

      {/* 3. Ecosystem */}
      <NEcosystem />

      {/* 4. Use Case Segmentation */}
      <NUseCases />

      {/* 5. Context Score */}
      <NContextScore />

      {/* 6. Continuous Sync */}
      <NContinuousSync />

      {/* 7. Universal Access */}
      <NUniversalAccess />

      {/* 8. Pricing */}
      <NPricing />

      {/* 9. Final CTA */}
      <NFinalCta />
    </>
  );
}
