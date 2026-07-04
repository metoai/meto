import { AI_BRAND_ICON_CLASS } from "@/lib/ai-brand-icon";
import { MCP_TOOL_ICONS, type McpToolId } from "@/lib/ai-platform-icons";

type McpToolIconProps = {
  tool: McpToolId;
  size?: number;
  className?: string;
};

export function McpToolIcon({
  tool,
  size = 20,
  className = "",
}: McpToolIconProps) {
  const { url, label } = MCP_TOOL_ICONS[tool];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`${AI_BRAND_ICON_CLASS} shrink-0 object-contain ${className}`}
      loading="lazy"
      decoding="async"
      title={label}
    />
  );
}
