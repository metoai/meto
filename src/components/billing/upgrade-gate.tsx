"use client";

import { useState, type ReactNode } from "react";
import type { BillingFeature } from "@/lib/entitlements";
import { useEntitlements } from "@/hooks/use-entitlements";
import { UpgradeModal } from "@/components/billing/upgrade-modal";

type UpgradeGateProps = {
  feature: BillingFeature;
  children: ReactNode;
  /** When true, render children but intercept click */
  intercept?: boolean;
  className?: string;
};

export function UpgradeGate({
  feature,
  children,
  intercept = true,
  className,
}: UpgradeGateProps) {
  const { entitlements, loaded } = useEntitlements();
  const [modalOpen, setModalOpen] = useState(false);

  const allowed =
    loaded &&
    entitlements &&
    (feature === "gap_fix" || feature === "quick_update"
      ? entitlements.canUseUpdateChat
      : feature === "llm_score"
        ? entitlements.canUseLlmScore
        : feature === "llm_compile"
          ? entitlements.canUseLlmCompile
          : feature === "onboarding_ai"
            ? entitlements.canRedoOnboardingAi
            : entitlements.isProAccess);

  if (!loaded || allowed) {
    return <>{children}</>;
  }

  if (!intercept) {
    return (
      <>
        <div className={className}>{children}</div>
        <UpgradeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          feature={feature}
        />
      </>
    );
  }

  return (
    <>
      <span
        className={className}
        role="presentation"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setModalOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
      >
        {children}
      </span>
      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        feature={feature}
      />
    </>
  );
}

export function useUpgradeModal() {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState<BillingFeature | null>(null);

  return {
    openUpgrade: (f?: BillingFeature) => {
      setFeature(f ?? null);
      setOpen(true);
    },
    modal: (
      <UpgradeModal
        open={open}
        onClose={() => setOpen(false)}
        feature={feature}
      />
    ),
  };
}
