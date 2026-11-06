"use client";

import { useEffect, useRef, useState, useId } from "react";

type FigureBaseProps = {
  className?: string;
  intensity?: number;
  play?: boolean;
};

// Smooth pointer tracking hook with physics damping and autonomous loop
function usePointerTracker(play = true) {
  const [pointer, setPointer] = useState({ x: 0, y: 0, active: false });
  const [autoPhase, setAutoPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!play) return;
    let start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      setAutoPhase(elapsed);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [play]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setPointer({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setPointer((prev) => ({ ...prev, active: false }));
  };

  const effectiveX = pointer.active ? pointer.x : Math.sin(autoPhase * 0.9) * 0.4;
  const effectiveY = pointer.active ? pointer.y : Math.cos(autoPhase * 0.7) * 0.3;

  return {
    containerRef,
    pointer: { x: effectiveX, y: effectiveY, active: pointer.active },
    handlePointerMove,
    handlePointerLeave,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. COMPILER FIGURE: High-Craft Isometric AST Transformer Engine
   Multi-tier physical slabs with live compression telemetry & format tags
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
  intensity = 0.65,
  play = true,
}: CompilerFigureProps) {
  const { containerRef, pointer, handlePointerMove, handlePointerLeave } = usePointerTracker(play);
  const uid = useId();

  // Dynamic gap expansion and 3D angle
  const gapSpread = Math.max(22, 34 + pointer.y * 18 * intensity);
  const tiltX = pointer.x * 5 * intensity;

  const formatConfig: Record<
    string,
    { label: string; file: string; color: string; bg: string; border: string; lang: string }
  > = {
    claude: {
      label: "Claude XML",
      file: "claude-project.xml",
      color: "#ea580c",
      bg: "rgba(234, 88, 12, 0.12)",
      border: "rgba(234, 88, 12, 0.4)",
      lang: "XML · System Prompt",
    },
    cursor: {
      label: "Cursor Rules",
      file: ".cursorrules",
      color: "#2563eb",
      bg: "rgba(37, 99, 235, 0.12)",
      border: "rgba(37, 99, 235, 0.4)",
      lang: "Markdown · Rules",
    },
    chatgpt: {
      label: "ChatGPT",
      file: "custom-instructions.txt",
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.12)",
      border: "rgba(5, 150, 105, 0.4)",
      lang: "Plain Text · Directives",
    },
    universal: {
      label: "Universal",
      file: "context.json",
      color: "#7c3aed",
      bg: "rgba(124, 58, 237, 0.12)",
      border: "rgba(124, 58, 237, 0.4)",
      lang: "JSON Schema 2.0",
    },
  };

  const fmt = formatConfig[format] ?? formatConfig.claude;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full select-none flex items-center justify-center cursor-crosshair ${className}`}
      aria-label="High-craft isometric context compiler figure"
    >
      <svg
        viewBox="0 0 440 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[420px] transition-transform duration-200 ease-out"
        style={{ transform: `rotate(${tiltX}deg)` }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`baseTop-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`middleTop-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={`activeTop-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={fmt.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={fmt.color} stopOpacity="0.08" />
          </linearGradient>
          {/* Drop Shadow filter */}
          <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* ─── LAYER 0 (Bottom): Raw Stored Directives Plinth ─── */}
        <g transform={`translate(0, ${180 + gapSpread * 0.5})`} className="text-neutral-900 dark:text-neutral-100">
          {/* 3D Base Slab */}
          {/* Left Edge */}
          <polygon
            points="60,55 220,105 220,117 60,67"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          {/* Right Edge */}
          <polygon
            points="220,105 380,55 380,67 220,117"
            fill="currentColor"
            fillOpacity="0.28"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          {/* Top Face */}
          <polygon
            points="220,5 380,55 220,105 60,55"
            fill={`url(#baseTop-${uid})`}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />

          {/* Directives Content Rows on Slab Face */}
          <g transform="translate(130, 42)">
            <rect x="0" y="0" width="80" height="18" rx="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" />
            <text x="8" y="12" fontSize="9" fontFamily="monospace" fontWeight="600" fill="currentColor" fillOpacity="0.8">
              RAW PROFILE
            </text>
            <text x="96" y="12" fontSize="9.5" fontFamily="monospace" fill="currentColor" fillOpacity="0.6">
              4,850 tokens (uncompressed)
            </text>
          </g>
          <g transform="translate(110, 68)">
            <line x1="0" y1="0" x2="220" y2="0" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
            <text x="25" y="14" fontSize="9" fontFamily="monospace" fill="currentColor" fillOpacity="0.5">
              identity · stack rules · credentials · raw notes
            </text>
          </g>
        </g>

        {/* ─── Vertical Isometric Ray Guides ─── */}
        <g stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.2" className="text-neutral-500">
          <line x1="60" y1={235 + gapSpread * 0.5} x2="60" y2={55 - gapSpread * 0.5} />
          <line x1="380" y1={235 + gapSpread * 0.5} x2="380" y2={55 - gapSpread * 0.5} />
          <line x1="220" y1={285 + gapSpread * 0.5} x2="220" y2={105 - gapSpread * 0.5} />
        </g>

        {/* ─── LAYER 1 (Middle): Compression & AST Engine Slab ─── */}
        <g transform="translate(0, 115)" className="text-emerald-500">
          {/* Slab Sides */}
          <polygon points="60,55 220,105 220,116 60,66" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />
          <polygon points="220,105 380,55 380,66 220,116" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />
          {/* Top Face */}
          <polygon points="220,5 380,55 220,105 60,55" fill={`url(#middleTop-${uid})`} stroke="#10b981" strokeWidth="1.5" />

          {/* Engine Metric Center Banner */}
          <g transform="translate(145, 45)">
            <rect x="0" y="0" width="150" height="26" rx="6" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="1.2" />
            <circle cx="16" cy="13" r="4" fill="#10b981" />
            <text x="28" y="16" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#10b981">
              {`${reduction} PRUNED`}
            </text>
            <text x="96" y="16" fontSize="9" fontFamily="monospace" fontWeight="500" fill="#10b981" fillOpacity="0.8">
              AST OPTIMIZED
            </text>
          </g>

          {/* Connector Diodes */}
          <circle cx="110" cy="55" r="3" fill="#10b981" />
          <circle cx="330" cy="55" r="3" fill="#10b981" />
        </g>

        {/* ─── LAYER 2 (Top): Target Format Compiled Slab ─── */}
        <g transform={`translate(0, ${50 - gapSpread * 0.5})`} filter={`url(#shadow-${uid})`}>
          {/* Slab Sides */}
          <polygon
            points="60,55 220,105 220,118 60,68"
            fill={fmt.color}
            fillOpacity="0.2"
            stroke={fmt.color}
            strokeWidth="1.5"
          />
          <polygon
            points="220,105 380,55 380,68 220,118"
            fill={fmt.color}
            fillOpacity="0.35"
            stroke={fmt.color}
            strokeWidth="1.5"
          />
          {/* Top Face */}
          <polygon
            points="220,5 380,55 220,105 60,55"
            fill={`url(#activeTop-${uid})`}
            stroke={fmt.color}
            strokeWidth="2"
          />

          {/* Card Content on Top Face */}
          {/* Header Badge */}
          <g transform="translate(105, 34)">
            <rect x="0" y="0" width="230" height="30" rx="6" fill="currentColor" className="text-white dark:text-neutral-900" stroke={fmt.color} strokeWidth="1.5" />
            {/* Format Icon/Bullet */}
            <circle cx="16" cy="15" r="5" fill={fmt.color} />
            <text x="28" y="18.5" fontSize="12" fontWeight="700" fontFamily="monospace" fill={fmt.color}>
              {fmt.file}
            </text>
            <rect x="145" y="6" width="76" height="18" rx="4" fill={fmt.bg} stroke={fmt.border} strokeWidth="1" />
            <text x="183" y="18" textAnchor="middle" fontSize="9.5" fontWeight="600" fontFamily="monospace" fill={fmt.color}>
              READY
            </text>
          </g>

          {/* Output Token Metrics Banner */}
          <g transform="translate(125, 75)">
            <rect x="0" y="0" width="190" height="20" rx="4" fill="currentColor" className="text-neutral-900/90 dark:text-black/80" stroke={fmt.color} strokeOpacity="0.4" strokeWidth="1" />
            <text x="14" y="13.5" fontSize="10" fontFamily="monospace" fontWeight="600" fill="#ffffff">
              {`PAYLOAD: ${tokens}`}
            </text>
            <text x="122" y="13.5" fontSize="9" fontFamily="monospace" fill="#10b981">
              ● COMPILED
            </text>
          </g>

          {/* Active 3D Corner Markers */}
          <circle cx="60" cy="55" r="3.5" fill={fmt.color} />
          <circle cx="380" cy="55" r="3.5" fill={fmt.color} />
          <circle cx="220" cy="105" r="3.5" fill={fmt.color} />
        </g>
      </svg>

      {/* Floating Agency Telemetry Readout */}
      <div className="absolute top-2 right-3 text-[10.5px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        Format: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{fmt.label}</span> · <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{reduction}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MCP ROUTER FIGURE: Dynamic Gateway Hub & High-Speed Vector Ray Conduits
   Physical server node radiating active data packets with real live latency
───────────────────────────────────────────────────────────────────────────── */
type McpRouterFigureProps = FigureBaseProps & {
  copied?: boolean;
};

export function ContentConnectedMcpRouterFigure({
  copied = false,
  className = "",
  intensity = 0.7,
  play = true,
}: McpRouterFigureProps) {
  const { containerRef, pointer, handlePointerMove, handlePointerLeave } = usePointerTracker(play);
  const [packetPhase, setPacketPhase] = useState(0);

  useEffect(() => {
    let frame: number;
    let start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) / 1600) % 1;
      setPacketPhase(t);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const activeTarget =
    pointer.x < -0.2 ? "cursor" : pointer.x > 0.2 ? "claude" : "cli";

  // Coordinates:
  // Center Hub: (220, 140)
  // Cursor IDE: (90, 75)
  // Claude Desktop: (350, 75)
  // Terminal CLI: (220, 230)
  const endpoints = {
    cursor: { x: 90, y: 75, name: "Cursor IDE", tag: ".cursorrules", ping: "14ms", color: "#3b82f6" },
    claude: { x: 350, y: 75, name: "Claude Desktop", tag: "MCP SSE Stream", ping: "22ms", color: "#ea580c" },
    cli: { x: 220, y: 230, name: "Claude Code CLI", tag: "stdio Pipe", ping: "8ms", color: "#10b981" },
  };

  const center = { x: 220, y: 140 };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full select-none flex items-center justify-center cursor-crosshair ${className}`}
      aria-label="High-craft isometric MCP router hub"
    >
      <svg
        viewBox="0 0 440 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[420px]"
      >
        {/* Subtle Isometric Grid Hairlines */}
        <g stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.1" className="text-neutral-400 dark:text-neutral-600">
          <line x1="220" y1="20" x2="380" y2="100" />
          <line x1="220" y1="20" x2="60" y2="100" />
          <line x1="60" y1="100" x2="220" y2="180" />
          <line x1="380" y1="100" x2="220" y2="180" />
          <line x1="220" y1="180" x2="380" y2="260" />
          <line x1="220" y1="180" x2="60" y2="260" />
        </g>

        {/* ─── Heavy Routed Bus Ribbons ─── */}
        {/* Branch 1: Center -> Cursor */}
        <path
          d={`M ${center.x} ${center.y} L 150 ${center.y} L ${endpoints.cursor.x} ${endpoints.cursor.y + 24}`}
          stroke={activeTarget === "cursor" ? "#3b82f6" : "currentColor"}
          strokeWidth={activeTarget === "cursor" ? "2.5" : "1.5"}
          strokeOpacity={activeTarget === "cursor" ? 1 : 0.3}
          strokeDasharray={activeTarget === "cursor" ? "none" : "4 4"}
          className="transition-all duration-150"
        />
        {/* Branch 2: Center -> Claude */}
        <path
          d={`M ${center.x} ${center.y} L 290 ${center.y} L ${endpoints.claude.x} ${endpoints.claude.y + 24}`}
          stroke={activeTarget === "claude" ? "#ea580c" : "currentColor"}
          strokeWidth={activeTarget === "claude" ? "2.5" : "1.5"}
          strokeOpacity={activeTarget === "claude" ? 1 : 0.3}
          strokeDasharray={activeTarget === "claude" ? "none" : "4 4"}
          className="transition-all duration-150"
        />
        {/* Branch 3: Center -> CLI */}
        <path
          d={`M ${center.x} ${center.y} L ${center.x} ${endpoints.cli.y - 20}`}
          stroke={activeTarget === "cli" ? "#10b981" : "currentColor"}
          strokeWidth={activeTarget === "cli" ? "2.5" : "1.5"}
          strokeOpacity={activeTarget === "cli" ? 1 : 0.3}
          strokeDasharray={activeTarget === "cli" ? "none" : "4 4"}
          className="transition-all duration-150"
        />

        {/* ─── High-Speed Photon Energy Packets ─── */}
        {/* To Cursor */}
        <circle
          cx={center.x + (endpoints.cursor.x - center.x) * packetPhase}
          cy={center.y + (endpoints.cursor.y + 24 - center.y) * packetPhase}
          r="4"
          fill="#3b82f6"
          filter="drop-shadow(0 0 4px #3b82f6)"
        />
        {/* To Claude */}
        <circle
          cx={center.x + (endpoints.claude.x - center.x) * packetPhase}
          cy={center.y + (endpoints.claude.y + 24 - center.y) * packetPhase}
          r="4"
          fill="#ea580c"
          filter="drop-shadow(0 0 4px #ea580c)"
        />
        {/* To CLI */}
        <circle
          cx={center.x}
          cy={center.y + (endpoints.cli.y - 20 - center.y) * packetPhase}
          r="4"
          fill="#10b981"
          filter="drop-shadow(0 0 4px #10b981)"
        />

        {/* ─── Center Node: Meto MCP Gateway Module ─── */}
        <g transform={`translate(${center.x}, ${center.y})`} className="cursor-pointer">
          {/* Base Plinth */}
          <polygon points="0,-28 55,-5 0,18 -55,-5" fill="currentColor" className="text-white dark:text-neutral-900" stroke="var(--primary)" strokeWidth="2" />
          <polygon points="-55,-5 0,18 0,28 -55,5" fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="1" />
          <polygon points="0,18 55,-5 55,5 0,28" fill="var(--primary)" fillOpacity="0.35" stroke="var(--primary)" strokeWidth="1" />

          {/* Pulsing Core Diode */}
          <circle cx="0" cy="-5" r="14" fill="var(--primary)" fillOpacity="0.18" />
          <circle cx="0" cy="-5" r="6" fill="var(--primary)" />

          {/* Central Gateway Header */}
          <text x="0" y="-12" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            METO MCP GATEWAY
          </text>
          <text x="0" y="8" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--primary)" fontWeight="600">
            PORT 3000 · SSE
          </text>
        </g>

        {/* ─── Client Endpoint 1: Cursor IDE ─── */}
        <g
          transform={`translate(${endpoints.cursor.x}, ${endpoints.cursor.y})`}
          className="transition-transform duration-200"
          style={{ transform: activeTarget === "cursor" ? "translate(90px, 71px)" : "translate(90px, 75px)" }}
        >
          <rect
            x="-75"
            y="-24"
            width="150"
            height="48"
            rx="8"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke={activeTarget === "cursor" ? "#3b82f6" : "currentColor"}
            strokeWidth={activeTarget === "cursor" ? "2" : "1.2"}
            strokeOpacity={activeTarget === "cursor" ? 1 : 0.25}
          />
          <circle cx="-58" cy="-5" r="4" fill="#3b82f6" />
          <text x="-48" y="-1" fontSize="11" fontWeight="700" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            Cursor IDE
          </text>
          <text x="-48" y="13" fontSize="9" fontFamily="monospace" fill="#10b981" fontWeight="600">
            {`${endpoints.cursor.ping} · Live SSE`}
          </text>
          <rect x="25" y="-16" width="42" height="16" rx="4" fill="rgba(59, 130, 246, 0.12)" stroke="#3b82f6" strokeWidth="1" />
          <text x="46" y="-5" textAnchor="middle" fontSize="7.5" fontWeight="600" fontFamily="monospace" fill="#3b82f6">
            SYNCED
          </text>
        </g>

        {/* ─── Client Endpoint 2: Claude Desktop ─── */}
        <g
          transform={`translate(${endpoints.claude.x}, ${endpoints.claude.y})`}
          className="transition-transform duration-200"
          style={{ transform: activeTarget === "claude" ? "translate(350px, 71px)" : "translate(350px, 75px)" }}
        >
          <rect
            x="-75"
            y="-24"
            width="150"
            height="48"
            rx="8"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke={activeTarget === "claude" ? "#ea580c" : "currentColor"}
            strokeWidth={activeTarget === "claude" ? "2" : "1.2"}
            strokeOpacity={activeTarget === "claude" ? 1 : 0.25}
          />
          <circle cx="-58" cy="-5" r="4" fill="#ea580c" />
          <text x="-48" y="-1" fontSize="11" fontWeight="700" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            Claude Desktop
          </text>
          <text x="-48" y="13" fontSize="9" fontFamily="monospace" fill="#10b981" fontWeight="600">
            {`${endpoints.claude.ping} · Stream`}
          </text>
          <rect x="25" y="-16" width="42" height="16" rx="4" fill="rgba(234, 88, 12, 0.12)" stroke="#ea580c" strokeWidth="1" />
          <text x="46" y="-5" textAnchor="middle" fontSize="7.5" fontWeight="600" fontFamily="monospace" fill="#ea580c">
            SYNCED
          </text>
        </g>

        {/* ─── Client Endpoint 3: Claude Code CLI ─── */}
        <g
          transform={`translate(${endpoints.cli.x}, ${endpoints.cli.y})`}
          className="transition-transform duration-200"
          style={{ transform: activeTarget === "cli" ? "translate(220px, 226px)" : "translate(220px, 230px)" }}
        >
          <rect
            x="-85"
            y="-22"
            width="170"
            height="44"
            rx="8"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke={activeTarget === "cli" ? "#10b981" : "currentColor"}
            strokeWidth={activeTarget === "cli" ? "2" : "1.2"}
            strokeOpacity={activeTarget === "cli" ? 1 : 0.25}
          />
          <circle cx="-68" cy="-4" r="4" fill="#10b981" />
          <text x="-56" y="0" fontSize="11" fontWeight="700" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            Claude Code CLI
          </text>
          <text x="-56" y="13" fontSize="9" fontFamily="monospace" fill="#10b981" fontWeight="600">
            {`${endpoints.cli.ping} · stdio pipe`}
          </text>
          <rect x="35" y="-14" width="42" height="16" rx="4" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="1" />
          <text x="56" y="-3" textAnchor="middle" fontSize="7.5" fontWeight="600" fontFamily="monospace" fill="#10b981">
            ACTIVE
          </text>
        </g>
      </svg>

      {/* Agency Telemetry Readout */}
      <div className="absolute top-2 right-3 text-[10.5px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        Routing: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{endpoints[activeTarget].name}</span> · <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{endpoints[activeTarget].ping}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PRIVACY VAULT FIGURE: Precision Hardware Isolation Boundary
   Physical titanium partition separating redacted credentials from clean payload
───────────────────────────────────────────────────────────────────────────── */
type PrivacyVaultFigureProps = FigureBaseProps & {
  isMasked?: boolean;
};

export function ContentConnectedPrivacyVaultFigure({
  isMasked = true,
  className = "",
  intensity = 0.7,
  play = true,
}: PrivacyVaultFigureProps) {
  const { containerRef, pointer, handlePointerMove, handlePointerLeave } = usePointerTracker(play);
  const uid = useId();

  // Shield vertical translation
  const shieldOffset = isMasked ? 0 : 28;
  const dialRotation = isMasked ? 0 : 90 + pointer.x * 25;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full select-none flex items-center justify-center cursor-crosshair ${className}`}
      aria-label="High-craft hardware privacy isolation vault"
    >
      <svg
        viewBox="0 0 440 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[420px]"
      >
        <defs>
          <linearGradient id={`vaultBase-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`shieldGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4d00" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff6b2c" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* ─── Heavy Isometric Base Plinth ─── */}
        <polygon
          points="220,35 390,90 220,145 50,90"
          fill={`url(#vaultBase-${uid})`}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-neutral-400 dark:text-neutral-600"
        />
        {/* Plinth Edges */}
        <polygon points="50,90 220,145 220,157 50,102" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" className="text-neutral-500" />
        <polygon points="220,145 390,90 390,102 220,157" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" className="text-neutral-500" />

        {/* ─── Left Compartment: Redacted / Secret Zone ─── */}
        <g transform="translate(130, 90)">
          {/* Zone Base Card */}
          <rect x="-65" y="-36" width="130" height="72" rx="8" fill="rgba(239, 68, 68, 0.08)" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="-48" cy="-20" r="4" fill="#ef4444" />
          <text x="-38" y="-16.5" fontSize="10" fontWeight="700" fontFamily="monospace" fill="#ef4444">
            RESTRICTED VAULT
          </text>

          {/* Secret Items */}
          <g transform="translate(-52, 2)">
            <text x="0" y="0" fontSize="9" fontFamily="monospace" fill="currentColor" className="text-neutral-700 dark:text-neutral-300">
              API KEY:
            </text>
            <text x="46" y="0" fontSize="9.5" fontWeight="600" fontFamily="monospace" fill="#ef4444">
              {isMasked ? "sk-••••••••" : "sk-proj-7x9..."}
            </text>
            <text x="0" y="16" fontSize="9" fontFamily="monospace" fill="currentColor" className="text-neutral-700 dark:text-neutral-300">
              CLIENT NDA:
            </text>
            <text x="64" y="16" fontSize="9.5" fontWeight="600" fontFamily="monospace" fill="#ef4444">
              [STRIPPED]
            </text>
          </g>
        </g>

        {/* ─── Right Compartment: Clean Public Egress Zone ─── */}
        <g transform="translate(310, 90)">
          {/* Zone Base Card */}
          <rect x="-65" y="-36" width="130" height="72" rx="8" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="1.5" />
          <circle cx="-48" cy="-20" r="4" fill="#10b981" />
          <text x="-38" y="-16.5" fontSize="10" fontWeight="700" fontFamily="monospace" fill="#10b981">
            PUBLIC EGRESS
          </text>

          {/* Clean Public Items */}
          <g transform="translate(-52, 2)">
            <text x="0" y="0" fontSize="9" fontFamily="monospace" fill="currentColor" className="text-neutral-700 dark:text-neutral-300">
              DEV PERSONA:
            </text>
            <text x="74" y="0" fontSize="9.5" fontWeight="600" fontFamily="monospace" fill="#10b981">
              [ALLOWED]
            </text>
            <text x="0" y="16" fontSize="9" fontFamily="monospace" fill="currentColor" className="text-neutral-700 dark:text-neutral-300">
              CODE RULES:
            </text>
            <text x="72" y="16" fontSize="9.5" fontWeight="600" fontFamily="monospace" fill="#10b981">
              [ALLOWED]
            </text>
          </g>
        </g>

        {/* ─── Center: Vertical Physical Isolation Shield Wall ─── */}
        <g transform={`translate(220, ${110 + shieldOffset})`} className="transition-transform duration-300 ease-out">
          {/* Vertical Shield Slab */}
          <polygon
            points="0,-65 24,-52 24,35 0,22"
            fill="currentColor"
            className="text-neutral-900 dark:text-neutral-100"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          <polygon
            points="-24,-52 0,-65 0,22 -24,35"
            fill="var(--primary)"
            fillOpacity="0.25"
            stroke="var(--primary)"
            strokeWidth="2"
          />

          {/* Laser Security Lattice Slits */}
          <line x1="-12" y1="-25" x2="-12" y2="15" stroke="var(--primary)" strokeWidth="1.5" />
          <line x1="12" y1="-25" x2="12" y2="15" stroke="var(--primary)" strokeWidth="1.5" />
          <circle cx="0" cy="-20" r="4" fill="var(--primary)" />

          {/* Shield Status Badge */}
          <g transform="translate(0, -78)">
            <rect x="-65" y="-12" width="130" height="24" rx="5" fill="currentColor" className="text-neutral-950 dark:text-black" stroke="var(--primary)" strokeWidth="1.5" />
            <text x="0" y="3.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="monospace" fill="var(--primary)">
              {isMasked ? "ISOLATION ACTIVE" : "SHIELD LIFTED"}
            </text>
          </g>
        </g>

        {/* ─── Rotary Security Dial (Front Stage) ─── */}
        <g transform="translate(220, 205)">
          <ellipse cx="0" cy="0" rx="42" ry="20" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" className="text-neutral-700 dark:text-neutral-300" />
          {/* Dial Needle */}
          <g style={{ transform: `rotate(${dialRotation}deg)`, transformOrigin: "0px 0px" }} className="transition-transform duration-200">
            <line x1="-26" y1="0" x2="26" y2="0" stroke="var(--primary)" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="6" fill="var(--primary)" />
          </g>
          <text x="0" y="32" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fontWeight="600" fill="currentColor" className="text-neutral-600 dark:text-neutral-400">
            ROTARY KEY ENCRYPTOR
          </text>
        </g>
      </svg>

      {/* Agency Telemetry Readout */}
      <div className="absolute top-2 right-3 text-[10.5px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        Shield: <span className={isMasked ? "text-rose-600 dark:text-rose-400 font-semibold" : "text-amber-600 dark:text-amber-400 font-semibold"}>{isMasked ? "Enforced · Redacted" : "Bypassed"}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. SYNC TREE FIGURE: Multi-Agent Single-Source Version Mesh
   Elevated source-of-truth plinth branching to .cursorrules, CLAUDE.md, and MCP
───────────────────────────────────────────────────────────────────────────── */
type SyncTreeFigureProps = FigureBaseProps & {};

export function ContentConnectedSyncTreeFigure({
  className = "",
  intensity = 0.7,
  play = true,
}: SyncTreeFigureProps) {
  const { containerRef, pointer, handlePointerMove, handlePointerLeave } = usePointerTracker(play);
  const [activeBranch, setActiveBranch] = useState<number | null>(null);

  const branches = [
    { id: 0, title: "Cursor IDE", file: ".cursorrules", rules: "18 directives", hash: "#c901a", x: 90, y: 175, color: "#3b82f6" },
    { id: 1, title: "Claude AI", file: "CLAUDE.md", rules: "18 directives", hash: "#d4e21", x: 220, y: 220, color: "#ea580c" },
    { id: 2, title: "Terminal CLI", file: "MCP Gateway", rules: "8 live tools", hash: "#b882f", x: 350, y: 175, color: "#10b981" },
  ];

  const root = { x: 220, y: 65 };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full select-none flex items-center justify-center cursor-crosshair ${className}`}
      aria-label="High-craft cross-tool rule sync mesh"
    >
      <svg
        viewBox="0 0 440 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[420px]"
      >
        {/* Isometric Grid Guides */}
        <g stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.1" className="text-neutral-400 dark:text-neutral-600">
          <line x1="220" y1="20" x2="390" y2="105" />
          <line x1="220" y1="20" x2="50" y2="105" />
          <line x1="50" y1="105" x2="220" y2="190" />
          <line x1="390" y1="105" x2="220" y2="190" />
        </g>

        {/* ─── Branch Connectors (Root -> 3 Nodes) ─── */}
        {branches.map((b) => {
          const isElevated =
            activeBranch === b.id || (pointer.active && Math.abs(pointer.x - (b.x - 220) / 120) < 0.4);

          return (
            <g key={b.id}>
              {/* Heavy Conduit Line */}
              <path
                d={`M ${root.x} ${root.y + 16} L ${b.x} ${root.y + 60} L ${b.x} ${b.y - 24}`}
                stroke={isElevated ? b.color : "currentColor"}
                strokeWidth={isElevated ? "2.5" : "1.5"}
                strokeOpacity={isElevated ? 1 : 0.3}
                strokeDasharray={isElevated ? "none" : "4 4"}
                className="transition-all duration-150"
              />
              {/* Pulse Diode */}
              <circle
                cx={(root.x + b.x) / 2}
                cy={(root.y + 60 + b.y - 24) / 2}
                r="3.5"
                fill={isElevated ? b.color : "#10b981"}
              />
            </g>
          );
        })}

        {/* ─── ROOT NODE: Meto Source of Truth (v2.4) ─── */}
        <g transform={`translate(${root.x}, ${root.y})`}>
          {/* Elevated Hexagonal Plinth */}
          <polygon
            points="0,-32 60,-6 0,20 -60,-6"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          <polygon points="-60,-6 0,20 0,30 -60,4" fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="1" />
          <polygon points="0,20 60,-6 60,4 0,30" fill="var(--primary)" fillOpacity="0.35" stroke="var(--primary)" strokeWidth="1" />

          {/* Central Beacon */}
          <circle cx="0" cy="-6" r="14" fill="var(--primary)" fillOpacity="0.18" />
          <circle cx="0" cy="-6" r="6" fill="var(--primary)" />

          <text x="0" y="-14" textAnchor="middle" fontSize="10.5" fontWeight="700" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            METO SINGLE TRUTH (v2.4)
          </text>
          <text x="0" y="8" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--primary)" fontWeight="600">
            18 DIRECTIVES ACTIVE
          </text>
        </g>

        {/* ─── 3 Branch Target Nodes ─── */}
        {branches.map((b) => {
          const isElevated =
            activeBranch === b.id || (pointer.active && Math.abs(pointer.x - (b.x - 220) / 120) < 0.4);
          const yShift = isElevated ? -8 : 0;

          return (
            <g
              key={b.id}
              transform={`translate(${b.x}, ${b.y + yShift})`}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setActiveBranch(b.id)}
              onMouseLeave={() => setActiveBranch(null)}
            >
              {/* Drop Guide when Elevated */}
              {isElevated ? (
                <line x1="0" y1="24" x2="0" y2="34" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" className="text-neutral-400" />
              ) : null}

              {/* Node Card Box */}
              <rect
                x="-70"
                y="-24"
                width="140"
                height="48"
                rx="8"
                fill="currentColor"
                className="text-white dark:text-neutral-900"
                stroke={isElevated ? b.color : "currentColor"}
                strokeWidth={isElevated ? "2" : "1.2"}
                strokeOpacity={isElevated ? 1 : 0.25}
              />

              <circle cx="-54" cy="-5" r="4" fill={b.color} />
              <text x="-44" y="-1" fontSize="11" fontWeight="700" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
                {b.title}
              </text>
              <text x="-44" y="13" fontSize="9" fontFamily="monospace" fill="currentColor" className="text-neutral-500">
                {b.file}
              </text>

              {/* Synced Badge */}
              <rect x="22" y="-16" width="40" height="16" rx="4" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="1" />
              <text x="42" y="-5" textAnchor="middle" fontSize="7.5" fontWeight="600" fontFamily="monospace" fill="#10b981">
                SYNCED
              </text>
            </g>
          );
        })}
      </svg>

      {/* Agency Telemetry Readout */}
      <div className="absolute top-2 right-3 text-[10.5px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        Sync State: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● 100% In Sync · 0ms Drift</span>
      </div>
    </div>
  );
}
