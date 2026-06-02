"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import { useEntitlements } from "@/hooks/use-entitlements";
import type { BillingFeature } from "@/lib/entitlements";

type UpgradeLockedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  feature: BillingFeature;
};

export function UpgradeLockedLink({
  feature,
  href,
  onClick,
  className,
  children,
  ...rest
}: UpgradeLockedLinkProps) {
  const { entitlements, loaded } = useEntitlements();
  const [modalOpen, setModalOpen] = useState(false);

  const allowed =
    loaded &&
    entitlements &&
    (feature === "gap_fix" || feature === "quick_update"
      ? entitlements.canUseUpdateChat
      : feature === "llm_compile"
        ? entitlements.canUseLlmCompile
        : entitlements.isProAccess);

  if (!loaded || allowed) {
    return (
      <Link href={href} onClick={onClick} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setModalOpen(true);
        }}
      >
        {children}
      </button>
      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        feature={feature}
      />
    </>
  );
}
