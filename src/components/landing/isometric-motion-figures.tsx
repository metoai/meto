// No "use client" – pure server components. CSS animations via inline style keyframes.
// Each figure is a clean SVG visual metaphor: icons, motion paths, minimal signal.

/* ─────────────────────────────────────────────────────────────────────────────
   Shared: inject keyframes once via a <style> tag in the SVG's <defs>
───────────────────────────────────────────────────────────────────────────── */
function FigureStyles() {
  return (
    <style>{`
      @keyframes mf-pulse { 0%,100%{opacity:.18} 50%{opacity:.7} }
      @keyframes mf-flow { 0%{stroke-dashoffset:60} 100%{stroke-dashoffset:0} }
      @keyframes mf-spin { from{transform-origin:50% 50%;transform:rotate(0deg)} to{transform-origin:50% 50%;transform:rotate(360deg)} }
      @keyframes mf-ping { 0%{r:0;opacity:.7} 100%{r:14;opacity:0} }
      @keyframes mf-node-in { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
      @keyframes mf-lock { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      @keyframes mf-slide { 0%{transform:translateX(-8px);opacity:0} 60%{opacity:1} 100%{transform:translateX(0);opacity:1} }
      @keyframes mf-layer { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      @keyframes mf-blink { 0%,100%{opacity:1} 48%,52%{opacity:0} }
    `}</style>
  );
}

type FigureBaseProps = {
  className?: string;
  intensity?: number;
  play?: boolean;
};

/* ─────────────────────────────────────────────────────────────────────────────
   1. COMPILER FIGURE
   Visual: 3 stacked layers (Raw → AST → Compiled) with animated compression pulse
   server-renderable SVG
───────────────────────────────────────────────────────────────────────────── */
type CompilerFigureProps = FigureBaseProps & {
  format?: "claude" | "cursor" | "chatgpt" | "universal";
  tokens?: string;
  reduction?: string;
};

export function ContentConnectedCompilerFigure({
  format = "claude",
  tokens = "1.8k tokens",
  reduction = "-62%",
  className = "",
}: CompilerFigureProps) {
  // Format-specific icon shape (letter badge)
  const formatLabel: Record<string, string> = {
    claude: "C",
    cursor: "⌥",
    chatgpt: "G",
    universal: "∞",
  };
  const badge = formatLabel[format] ?? "C";

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 180"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[320px] h-auto"
        aria-hidden="true"
      >
        <FigureStyles />

        {/* Background: subtle radial glow */}
        <defs>
          <radialGradient id="cmp-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255,77,0,0.07)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="160" cy="90" rx="130" ry="80" fill="url(#cmp-glow)" />

        {/* Layer 3 — Raw Profile (bottom) */}
        <g style={{ animation: "mf-layer 4s ease-in-out infinite", animationDelay: "0s" }}>
          <rect x="40" y="128" width="240" height="30" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
          <rect x="40" y="128" width="240" height="30" rx="8" fill="currentColor" fillOpacity="0.03" />
          <text x="60" y="148" fill="currentColor" fillOpacity="0.3" fontSize="10" fontFamily="'Geist Mono', monospace">RAW PROFILE</text>
          <text x="246" y="148" fill="currentColor" fillOpacity="0.25" fontSize="9" fontFamily="'Geist Mono', monospace">4,850 tok</text>
        </g>

        {/* Layer 2 — AST Normalizer (middle) */}
        <g style={{ animation: "mf-layer 4s ease-in-out infinite", animationDelay: "0.6s" }}>
          <rect x="30" y="92" width="260" height="34" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
          <rect x="30" y="92" width="260" height="34" rx="8" fill="currentColor" fillOpacity="0.04" />
          <text x="50" y="113" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="'Geist Mono', monospace">AST NORMALIZER</text>
          {/* Animated compression dots */}
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={200 + i * 14}
              cy="109"
              r="3"
              fill="#ff4d00"
              fillOpacity="0.5"
              style={{
                animation: "mf-pulse 1.8s ease-in-out infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </g>

        {/* Layer 1 — Compiled Output (top) */}
        <g style={{ animation: "mf-layer 4s ease-in-out infinite", animationDelay: "1.2s" }}>
          <rect x="20" y="38" width="280" height="48" rx="10" fill="none" stroke="#ff4d00" strokeOpacity="0.3" strokeWidth="1.5" />
          <rect x="20" y="38" width="280" height="48" rx="10" fill="rgba(255,77,0,0.04)" />

          {/* Format badge icon */}
          <rect x="34" y="50" width="28" height="24" rx="6" fill="#ff4d00" fillOpacity="0.12" />
          <text x="48" y="66" textAnchor="middle" fill="#ff4d00" fontSize="13" fontWeight="600" fontFamily="system-ui">{badge}</text>

          {/* File name */}
          <text x="72" y="58" fill="currentColor" fillOpacity="0.7" fontSize="10" fontFamily="'Geist Mono', monospace">
            {format === "claude" ? "claude-project.xml" : format === "cursor" ? ".cursorrules" : format === "chatgpt" ? "custom-instructions.txt" : "context.json"}
          </text>

          {/* Reduction badge */}
          <rect x="210" y="52" width="74" height="18" rx="5" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
          <text x="247" y="64" textAnchor="middle" fill="rgb(34,197,94)" fontSize="9.5" fontWeight="600" fontFamily="'Geist Mono', monospace">{reduction} PRUNED</text>
        </g>

        {/* Downward flow arrows between layers */}
        <line x1="160" y1="90" x2="160" y2="94" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="160" y1="128" x2="160" y2="132" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Token count label bottom */}
        <text x="160" y="174" textAnchor="middle" fill="currentColor" fillOpacity="0.3" fontSize="9.5" fontFamily="'Geist Mono', monospace">
          {tokens} compiled
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MCP ROUTER FIGURE
   Visual: Hub circle with animated signal lines radiating to 3 tool logos
   server-renderable SVG with CSS animation
───────────────────────────────────────────────────────────────────────────── */
type McpRouterFigureProps = FigureBaseProps & {
  copied?: boolean;
};

export function ContentConnectedMcpRouterFigure({
  className = "",
}: McpRouterFigureProps) {
  // 3 targets: left-top, right-top, right-bottom
  const targets = [
    { x: 60, y: 55, label: "Cursor", badge: "⌥", delay: "0s", latency: "14ms" },
    { x: 260, y: 55, label: "Claude", badge: "C", delay: "0.4s", latency: "22ms" },
    { x: 260, y: 135, label: "CLI", badge: ">_", delay: "0.8s", latency: "8ms" },
  ];
  const hub = { x: 160, y: 95 };

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 180"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[320px] h-auto"
        aria-hidden="true"
      >
        <FigureStyles />
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="52%" r="30%">
            <stop offset="0%" stopColor="rgba(255,77,0,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Hub glow */}
        <ellipse cx={hub.x} cy={hub.y} rx="90" ry="70" fill="url(#hub-glow)" />

        {/* Signal lines to each target */}
        {targets.map((t, i) => (
          <g key={i}>
            <line
              x1={hub.x} y1={hub.y}
              x2={t.x} y2={t.y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            {/* Animated travelling photon */}
            <circle r="2.5" fill="#ff4d00" fillOpacity="0.8">
              <animateMotion
                dur={`${1.5 + i * 0.3}s`}
                repeatCount="indefinite"
                begin={t.delay}
                path={`M${hub.x},${hub.y} L${t.x},${t.y}`}
              />
            </circle>
          </g>
        ))}

        {/* Hub circle — METO MCP */}
        <circle cx={hub.x} cy={hub.y} r="30" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
        <circle cx={hub.x} cy={hub.y} r="30" fill="currentColor" fillOpacity="0.04" />
        {/* Hub ping animation */}
        <circle cx={hub.x} cy={hub.y} r="0" fill="none" stroke="#ff4d00" strokeOpacity="0.4" strokeWidth="1.5">
          <animate attributeName="r" from="8" to="34" dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={hub.x} y={hub.y - 4} textAnchor="middle" fill="currentColor" fillOpacity="0.7" fontSize="8" fontWeight="700" fontFamily="'Geist Mono', monospace">MCP</text>
        <text x={hub.x} y={hub.y + 8} textAnchor="middle" fill="currentColor" fillOpacity="0.4" fontSize="7" fontFamily="'Geist Mono', monospace">METO</text>

        {/* Tool node circles */}
        {targets.map((t, i) => (
          <g key={i} style={{ animation: "mf-node-in 0.6s ease-out both", animationDelay: `${i * 0.15}s` }}>
            <circle cx={t.x} cy={t.y} r="22" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
            <circle cx={t.x} cy={t.y} r="22" fill="currentColor" fillOpacity="0.04" />
            <text x={t.x} y={t.y + 1} textAnchor="middle" dominantBaseline="middle" fill="currentColor" fillOpacity="0.65" fontSize="11" fontWeight="600" fontFamily="system-ui">{t.badge}</text>
            <text x={t.x} y={t.y + 15} textAnchor="middle" fill="currentColor" fillOpacity="0.3" fontSize="7" fontFamily="'Geist Mono', monospace">{t.label}</text>
            {/* Latency chip */}
            <text x={t.x} y={t.y - 15} textAnchor="middle" fill="#22c55e" fontSize="7.5" fontWeight="600" fontFamily="'Geist Mono', monospace">{t.latency}</text>
          </g>
        ))}

        {/* Live indicator */}
        <circle cx="20" cy="170" r="3.5" fill="#22c55e" fillOpacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="30" y="174" fill="currentColor" fillOpacity="0.3" fontSize="9" fontFamily="'Geist Mono', monospace">Live MCP · 3 connected</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PRIVACY VAULT FIGURE
   Visual: Lock icon center, left zone (redacted bars) vs right zone (allowed bars)
   server-renderable SVG
───────────────────────────────────────────────────────────────────────────── */
type PrivacyVaultFigureProps = FigureBaseProps & {
  isMasked?: boolean;
};

export function ContentConnectedPrivacyVaultFigure({
  isMasked = true,
  className = "",
}: PrivacyVaultFigureProps) {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 180"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[320px] h-auto"
        aria-hidden="true"
      >
        <FigureStyles />

        {/* Left Zone — Restricted */}
        <rect x="12" y="30" width="120" height="140" rx="10" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" />
        <rect x="12" y="30" width="120" height="140" rx="10" fill="rgba(239,68,68,0.03)" />

        {/* Redacted bars: secrets masked */}
        {[0, 1, 2].map((i) => {
          const y = 68 + i * 30;
          return (
            <g key={i}>
              <rect x="26" y={y} width="40" height="10" rx="3" fill="currentColor" fillOpacity="0.12" />
              <rect
                x="74"
                y={y}
                width={isMasked ? 48 : 48}
                height="10"
                rx="3"
                fill={isMasked ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.15)"}
                style={{ animation: isMasked ? "mf-pulse 2.5s ease-in-out infinite" : "none", animationDelay: `${i * 0.2}s` }}
              />
              {isMasked && (
                <text x="98" y={y + 7.5} textAnchor="middle" fill="rgb(239,68,68)" fontSize="7" fontWeight="700" fontFamily="'Geist Mono', monospace">••••••••</text>
              )}
              {!isMasked && (
                <text x="98" y={y + 7.5} textAnchor="middle" fill="rgb(239,68,68)" fontSize="7" fontFamily="'Geist Mono', monospace">sk-proj-7x9</text>
              )}
            </g>
          );
        })}

        <text x="72" y="52" textAnchor="middle" fill="rgb(239,68,68)" fontSize="8.5" fontWeight="700" fontFamily="'Geist Mono', monospace">RESTRICTED</text>

        {/* Center: Lock icon */}
        <g style={{ animation: "mf-lock 3s ease-in-out infinite" }}>
          {/* Lock body */}
          <rect x="148" y="82" width="24" height="20" rx="4" fill="none" stroke="currentColor" strokeOpacity={isMasked ? "0.6" : "0.2"} strokeWidth="1.5" />
          <rect x="148" y="82" width="24" height="20" rx="4" fill="currentColor" fillOpacity={isMasked ? "0.08" : "0.03"} />
          {/* Lock shackle */}
          {isMasked ? (
            <path d="M152 82 L152 76 Q160 70 168 76 L168 82" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M152 82 L152 76 Q160 70 168 76" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" />
          )}
          {/* Keyhole */}
          <circle cx="160" cy="90" r="3" fill="none" stroke="currentColor" strokeOpacity={isMasked ? "0.4" : "0.15"} strokeWidth="1.2" />
          <line x1="160" y1="93" x2="160" y2="98" stroke="currentColor" strokeOpacity={isMasked ? "0.4" : "0.15"} strokeWidth="1.2" />
        </g>

        {/* Divider line */}
        <line x1="160" y1="40" x2="160" y2="168" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Right Zone — Public Egress */}
        <rect x="188" y="30" width="120" height="140" rx="10" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="1.5" />
        <rect x="188" y="30" width="120" height="140" rx="10" fill="rgba(34,197,94,0.03)" />

        {/* Allowed bars with checkmarks */}
        {["Dev persona", "Code rules", "Framework"].map((label, i) => {
          const y = 68 + i * 30;
          return (
            <g key={i}>
              <rect x="202" y={y} width="40" height="10" rx="3" fill="currentColor" fillOpacity="0.08" />
              <text x="202" y={y + 7.5} fill="currentColor" fillOpacity="0.3" fontSize="6.5" fontFamily="'Geist Mono', monospace">{label}</text>
              {/* Green check */}
              <circle cx="278" cy={y + 5} r="5.5" fill="rgba(34,197,94,0.15)" />
              <text x="278" y={y + 8.5} textAnchor="middle" fill="rgb(34,197,94)" fontSize="7" fontWeight="700">✓</text>
            </g>
          );
        })}

        <text x="248" y="52" textAnchor="middle" fill="rgb(34,197,94)" fontSize="8.5" fontWeight="700" fontFamily="'Geist Mono', monospace">PUBLIC EGRESS</text>

        {/* Bottom label */}
        <text x="160" y="176" textAnchor="middle" fill="currentColor" fillOpacity="0.25" fontSize="9" fontFamily="'Geist Mono', monospace">
          {isMasked ? "ISOLATION ACTIVE" : "SHIELD LIFTED"}
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. SYNC TREE FIGURE
   Visual: Central M node → 4 tool branches with animated propagation pulses
   server-renderable SVG
───────────────────────────────────────────────────────────────────────────── */
export function ContentConnectedSyncTreeFigure({
  className = "",
}: FigureBaseProps) {
  const root = { x: 160, y: 70 };
  const targets = [
    { x: 60, y: 148, label: "Cursor", file: ".cursorrules", delay: "0s" },
    { x: 140, y: 148, label: "Claude", file: "CLAUDE.md", delay: "0.3s" },
    { x: 220, y: 148, label: "Windsurf", file: ".windsurfrules", delay: "0.6s" },
    { x: 300, y: 148, label: "CLI", file: "MCP Gateway", delay: "0.9s" },
  ];

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 360 180"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[360px] h-auto"
        aria-hidden="true"
      >
        <FigureStyles />
        <defs>
          <radialGradient id="sync-glow" cx="44%" cy="39%" r="35%">
            <stop offset="0%" stopColor="rgba(255,77,0,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <ellipse cx={root.x} cy={root.y} rx="120" ry="55" fill="url(#sync-glow)" />

        {/* Branch lines */}
        {targets.map((t, i) => (
          <g key={i}>
            <line
              x1={root.x} y1={root.y + 22}
              x2={t.x} y2={t.y - 12}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            {/* Animated propagation dot */}
            <circle r="2" fill="#ff4d00" fillOpacity="0.7">
              <animateMotion
                dur={`${1.2 + i * 0.15}s`}
                repeatCount="indefinite"
                begin={t.delay}
                path={`M${root.x},${root.y + 22} L${t.x},${t.y - 12}`}
              />
            </circle>
          </g>
        ))}

        {/* Root node — METO */}
        <circle cx={root.x} cy={root.y} r="22" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
        <text x={root.x} y={root.y + 1} textAnchor="middle" dominantBaseline="middle" fill="currentColor" fillOpacity="0.8" fontSize="14" fontWeight="800" fontFamily="system-ui">M</text>

        {/* Sync state chip above root */}
        <rect x="110" y="22" width="100" height="16" rx="5" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />
        <text x="160" y="33.5" textAnchor="middle" fill="rgb(34,197,94)" fontSize="8" fontWeight="600" fontFamily="'Geist Mono', monospace">0ms drift · In Sync</text>

        {/* Target nodes */}
        {targets.map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={t.y} r="14" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
            {/* Green synced dot */}
            <circle cx={t.x + 10} cy={t.y - 10} r="4" fill="#22c55e" fillOpacity="0.9" style={{ animation: "mf-pulse 2s ease-in-out infinite", animationDelay: `${i * 0.25}s` }} />
            <text x={t.x} y={t.y + 1} textAnchor="middle" dominantBaseline="middle" fill="currentColor" fillOpacity="0.5" fontSize="8" fontWeight="600" fontFamily="system-ui">{t.label[0]}</text>
            <text x={t.x} y={t.y + 20} textAnchor="middle" fill="currentColor" fillOpacity="0.3" fontSize="7" fontFamily="'Geist Mono', monospace">{t.file}</text>
            <text x={t.x} y={t.y + 29} textAnchor="middle" fill="currentColor" fillOpacity="0.25" fontSize="6.5" fontFamily="system-ui">{t.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
