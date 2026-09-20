import type { ComponentType, SVGProps } from "react";
import { Zap, ShieldCheck, ArrowUpRight } from "lucide-react";

export type HeroMetaItemData = {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconColorClass?: string;
};

export const DEFAULT_HERO_META: HeroMetaItemData[] = [
  {
    id: "setup",
    label: "2 minute setup",
    icon: Zap,
    iconColorClass: "text-[var(--primary)]",
  },
  {
    id: "privacy",
    label: "Your data stays yours",
    icon: ShieldCheck,
    iconColorClass: "text-emerald-500 dark:text-emerald-400",
  },
  {
    id: "mcp",
    label: "MCP compatible",
    icon: ArrowUpRight,
    iconColorClass: "text-sky-500 dark:text-sky-400",
  },
];

export type HeroMetaItemProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  iconColorClass?: string;
};

export function HeroMetaItem({
  icon: Icon,
  label,
  iconColorClass = "text-[var(--text-secondary)]",
}: HeroMetaItemProps) {
  return (
    <span className="inline-flex items-center gap-1.5 font-normal">
      <Icon
        className={`h-3.5 w-3.5 shrink-0 stroke-[2] ${iconColorClass}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

export type HeroMetaProps = {
  items?: HeroMetaItemData[];
  className?: string;
};

export function HeroMeta({ items = DEFAULT_HERO_META, className = "" }: HeroMetaProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-[13px] sm:text-[14px] text-[var(--text-secondary)] ${className}`}
    >
      {items.map((item, index) => (
        <div key={item.id} className="inline-flex items-center gap-x-6">
          <HeroMetaItem
            icon={item.icon}
            label={item.label}
            iconColorClass={item.iconColorClass}
          />
          {index < items.length - 1 ? (
            <span
              className="hidden sm:inline-block h-1 w-1 rounded-full bg-[var(--border)]"
              aria-hidden="true"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
