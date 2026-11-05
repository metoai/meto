"use client";

import { useEffect, useRef, useState, useId } from "react";

type FigureBaseProps = {
  className?: string;
  intensity?: number;
  play?: boolean;
};

// Hook for tracking normalized pointer coordinates (-1 to 1) with dampening
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
    setPointer({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)), active: true });
  };

  const handlePointerLeave = () => {
    setPointer((prev) => ({ ...prev, active: false }));
  };

  // If pointer is idle, generate gentle autonomous oscillation
  const effectiveX = pointer.active ? pointer.x : Math.sin(autoPhase * 0.8) * 0.35;
  const effectiveY = pointer.active ? pointer.y : Math.cos(autoPhase * 0.6) * 0.25;

  return { containerRef, pointer: { x: effectiveX, y: effectiveY, active: pointer.active }, handlePointerMove, handlePointerLeave };
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. COMPILER FIGURE: Multi-Tier Isometric Exploded Code Engine
   Visualizes raw directives compressing into format-specific syntax layers
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
  intensity = 0.6,
  play = true,
}: CompilerFigureProps) {
  const { containerRef, pointer, handlePointerMove, handlePointerLeave } = usePointerTracker(play);
  const uid = useId();

  // Gap expands as pointer moves along X or Y
  const gapSpread = Math.max(14, 24 + pointer.y * 12 * intensity);
  const tiltX = pointer.x * 6 * intensity;

  const formatLabels: Record<string, { label: string; file: string; color: string }> = {
    claude: { label: "Claude XML", file: "claude-project.xml", color: "#ea580c" },
    cursor: { label: "Cursor Rules", file: ".cursorrules", color: "#3b82f6" },
    chatgpt: { label: "GPT Directives", file: "custom-instructions.txt", color: "#10b981" },
    universal: { label: "Universal JSON", file: "context.json", color: "#8b5cf6" },
  };

  const currentFmt = formatLabels[format] ?? formatLabels.claude;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full aspect-[5/4] select-none flex items-center justify-center cursor-crosshair overflow-hidden ${className}`}
      aria-label="Multi-tier isometric context compiler figure"
    >
      <svg
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[260px] max-h-[200px] transition-transform duration-150 ease-out"
        style={{ transform: `rotate(${tiltX}deg)` }}
      >
        <defs>
          <linearGradient id={`gradTop-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id={`gradActive-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentFmt.color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={currentFmt.color} stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* ─── Layer 0: Raw Base Slab (4.8k Raw Inputs) ─── */}
        <g transform={`translate(0, ${150 + gapSpread * 0.5})`} className="text-neutral-500 dark:text-neutral-400">
          {/* Isometric Slab: Top Face */}
          <polygon
            points="140,0 230,45 140,90 50,45"
            fill={`url(#gradTop-${uid})`}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="text-neutral-300 dark:text-neutral-700"
          />
          {/* Slab Edge */}
          <polygon
            points="50,45 140,90 140,96 50,51"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-neutral-400 dark:text-neutral-600"
          />
          <polygon
            points="140,90 230,45 230,51 140,96"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-neutral-400 dark:text-neutral-600"
          />
          {/* Raw Directive Mock Lines */}
          <line x1="100" y1="35" x2="140" y2="55" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="120" y1="28" x2="160" y2="48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="85" y1="42" x2="125" y2="62" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />

          {/* Label */}
          <text x="140" y="80" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="currentColor" fillOpacity="0.7">
            RAW STORED CONTEXT · 4.8k
          </text>
        </g>

        {/* ─── Connector Hairline Guides (Vertical Rays) ─── */}
        <g stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" className="text-neutral-400 dark:text-neutral-600">
          <line x1="50" y1={195 + gapSpread * 0.5} x2="50" y2={45 - gapSpread * 0.5} />
          <line x1="230" y1={195 + gapSpread * 0.5} x2="230" y2={45 - gapSpread * 0.5} />
          <line x1="140" y1={240 + gapSpread * 0.5} x2="140" y2={90 - gapSpread * 0.5} />
        </g>

        {/* ─── Layer 1: Compressor & Normalizer Engine (Middle Slab) ─── */}
        <g transform="translate(0, 95)" className="text-neutral-700 dark:text-neutral-300">
          <polygon
            points="140,0 230,45 140,90 50,45"
            fill={`url(#gradTop-${uid})`}
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-neutral-400 dark:text-neutral-600"
          />
          <polygon
            points="50,45 140,90 140,97 50,52"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-neutral-400 dark:text-neutral-600"
          />
          <polygon
            points="140,90 230,45 230,52 140,97"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-neutral-400 dark:text-neutral-600"
          />

          {/* Isometric Logic Nodes */}
          <circle cx="115" cy="42" r="3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="140" cy="55" r="3" fill="currentColor" fillOpacity="0.8" />
          <circle cx="165" cy="42" r="3" fill="currentColor" fillOpacity="0.6" />
          <line x1="115" y1="42" x2="140" y2="55" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="140" y1="55" x2="165" y2="42" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />

          {/* Engine Metric Text */}
          <text x="140" y="32" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" fillOpacity="0.8">
            METO COMPRESSION AST
          </text>
          <text x="140" y="78" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="monospace" fill="#10b981">
            {`${reduction} PRUNED`}
          </text>
        </g>

        {/* ─── Layer 2: Top Compiled Output Slab (Format Specific) ─── */}
        <g transform={`translate(0, ${40 - gapSpread * 0.5})`}>
          {/* Active Highlight Top Face */}
          <polygon
            points="140,0 230,45 140,90 50,45"
            fill={`url(#gradActive-${uid})`}
            stroke={currentFmt.color}
            strokeWidth="1.5"
          />
          {/* Slab Edge */}
          <polygon
            points="50,45 140,90 140,98 50,53"
            fill={currentFmt.color}
            fillOpacity="0.18"
            stroke={currentFmt.color}
            strokeWidth="1"
          />
          <polygon
            points="140,90 230,45 230,53 140,98"
            fill={currentFmt.color}
            fillOpacity="0.25"
            stroke={currentFmt.color}
            strokeWidth="1"
          />

          {/* Format File Label */}
          <rect
            x="85"
            y="26"
            width="110"
            height="18"
            rx="4"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke={currentFmt.color}
            strokeWidth="1"
          />
          <text
            x="140"
            y="38"
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fontFamily="monospace"
            fill={currentFmt.color}
          >
            {currentFmt.file}
          </text>

          {/* Output Tokens Callout */}
          <text
            x="140"
            y="65"
            textAnchor="middle"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="500"
            fill="currentColor"
            className="text-neutral-800 dark:text-neutral-200"
          >
            OUTPUT: {tokens}
          </text>

          {/* Active Corner Diodes */}
          <circle cx="50" cy="45" r="2.5" fill={currentFmt.color} />
          <circle cx="230" cy="45" r="2.5" fill={currentFmt.color} />
          <circle cx="140" cy="90" r="2.5" fill={currentFmt.color} />
        </g>
      </svg>

      {/* Interactive Helper Indicator */}
      <div className="absolute bottom-1 right-2 text-[8.5px] font-mono text-neutral-400 dark:text-neutral-500 flex items-center gap-1 opacity-60">
        <span>gap: {(gapSpread).toFixed(0)}px</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MCP ROUTER FIGURE: Dynamic Gateway Hub & Vector Ray Streams
   Visualizes live MCP stream routing to Cursor, Claude Desktop, and CLI
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
  const [pulsePos, setPulsePos] = useState(0);

  useEffect(() => {
    let frame: number;
    let start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) / 1800) % 1;
      setPulsePos(t);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Determine active branch depending on pointer position
  const activeTarget =
    pointer.x < -0.2 ? "cursor" : pointer.x > 0.2 ? "claude" : "cli";

  // Hub Center: (140, 110)
  // Target Cursor: (55, 60)
  // Target Claude: (225, 60)
  // Target CLI: (140, 185)
  const targets = {
    cursor: { x: 55, y: 60, name: "Cursor IDE", ping: "14ms", protocol: "MCP / SSE" },
    claude: { x: 225, y: 60, name: "Claude Desktop", ping: "22ms", protocol: "MCP / Stream" },
    cli: { x: 140, y: 185, name: "Claude Code CLI", ping: "8ms", protocol: "MCP / stdio" },
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full aspect-[5/4] select-none flex items-center justify-center cursor-crosshair overflow-hidden ${className}`}
      aria-label="Isometric MCP Router Hub figure"
    >
      <svg
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[260px] max-h-[200px]"
      >
        {/* Background Isometric Grid Hairlines */}
        <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" className="text-neutral-400 dark:text-neutral-600">
          <line x1="140" y1="20" x2="250" y2="75" />
          <line x1="140" y1="20" x2="30" y2="75" />
          <line x1="30" y1="75" x2="140" y2="130" />
          <line x1="250" y1="75" x2="140" y2="130" />
          <line x1="140" y1="130" x2="250" y2="185" />
          <line x1="140" y1="130" x2="30" y2="185" />
        </g>

        {/* ─── Ray Bus Conduits ─── */}
        {/* Branch 1: Center -> Cursor */}
        <line
          x1="140"
          y1="110"
          x2={targets.cursor.x}
          y2={targets.cursor.y}
          stroke="currentColor"
          strokeWidth={activeTarget === "cursor" ? "1.75" : "1"}
          strokeDasharray="3 3"
          className={activeTarget === "cursor" ? "text-[var(--primary)]" : "text-neutral-300 dark:text-neutral-700"}
        />
        {/* Branch 2: Center -> Claude */}
        <line
          x1="140"
          y1="110"
          x2={targets.claude.x}
          y2={targets.claude.y}
          stroke="currentColor"
          strokeWidth={activeTarget === "claude" ? "1.75" : "1"}
          strokeDasharray="3 3"
          className={activeTarget === "claude" ? "text-emerald-500" : "text-neutral-300 dark:text-neutral-700"}
        />
        {/* Branch 3: Center -> CLI */}
        <line
          x1="140"
          y1="110"
          x2={targets.cli.x}
          y2={targets.cli.y}
          stroke="currentColor"
          strokeWidth={activeTarget === "cli" ? "1.75" : "1"}
          strokeDasharray="3 3"
          className={activeTarget === "cli" ? "text-blue-500" : "text-neutral-300 dark:text-neutral-700"}
        />

        {/* ─── Moving Data Packet Diodes ─── */}
        {/* Packet on cursor line */}
        <circle
          cx={140 + (targets.cursor.x - 140) * pulsePos}
          cy={110 + (targets.cursor.y - 110) * pulsePos}
          r="2.5"
          fill="var(--primary)"
        />
        {/* Packet on claude line */}
        <circle
          cx={140 + (targets.claude.x - 140) * pulsePos}
          cy={110 + (targets.claude.y - 110) * pulsePos}
          r="2.5"
          fill="#10b981"
        />
        {/* Packet on CLI line */}
        <circle
          cx={140 + (targets.cli.x - 140) * pulsePos}
          cy={110 + (targets.cli.y - 110) * pulsePos}
          r="2.5"
          fill="#3b82f6"
        />

        {/* ─── Center Node: Meto MCP Gateway Hub ─── */}
        <g transform="translate(140, 110)">
          {/* Plinth */}
          <polygon
            points="0,-22 38,-3 0,16 -38,-3"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-neutral-900 dark:text-white"
          />
          {/* Depth edge */}
          <polygon
            points="-38,-3 0,16 0,22 -38,3"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-neutral-900 dark:text-white"
          />
          <polygon
            points="0,16 38,-3 38,3 0,22"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-neutral-900 dark:text-white"
          />
          {/* Pulsing Core */}
          <circle cx="0" cy="-3" r={copied ? "9" : "6"} fill="var(--primary)" fillOpacity="0.2" />
          <circle cx="0" cy="-3" r="3.5" fill="var(--primary)" />
          <text
            x="0"
            y="-10"
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            fontFamily="monospace"
            fill="currentColor"
            className="text-neutral-800 dark:text-neutral-100"
          >
            METO MCP HUB
          </text>
        </g>

        {/* ─── Target Node 1: Cursor IDE ─── */}
        <g transform={`translate(${targets.cursor.x}, ${targets.cursor.y})`}>
          <rect
            x="-42"
            y="-18"
            width="84"
            height="36"
            rx="5"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke={activeTarget === "cursor" ? "var(--primary)" : "currentColor"}
            strokeWidth={activeTarget === "cursor" ? "1.5" : "1"}
            strokeOpacity={activeTarget === "cursor" ? 1 : 0.2}
          />
          <circle cx="-30" cy="-4" r="2.5" fill="var(--primary)" />
          <text x="-22" y="-1" fontSize="7.5" fontWeight="600" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            CURSOR
          </text>
          <text x="-22" y="9" fontSize="6.5" fontFamily="monospace" fill="#10b981">
            {targets.cursor.ping} · SSE
          </text>
        </g>

        {/* ─── Target Node 2: Claude Desktop ─── */}
        <g transform={`translate(${targets.claude.x}, ${targets.claude.y})`}>
          <rect
            x="-42"
            y="-18"
            width="84"
            height="36"
            rx="5"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke={activeTarget === "claude" ? "#10b981" : "currentColor"}
            strokeWidth={activeTarget === "claude" ? "1.5" : "1"}
            strokeOpacity={activeTarget === "claude" ? 1 : 0.2}
          />
          <circle cx="-30" cy="-4" r="2.5" fill="#10b981" />
          <text x="-22" y="-1" fontSize="7.5" fontWeight="600" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            CLAUDE
          </text>
          <text x="-22" y="9" fontSize="6.5" fontFamily="monospace" fill="#10b981">
            {targets.claude.ping} · Stream
          </text>
        </g>

        {/* ─── Target Node 3: Claude Code CLI ─── */}
        <g transform={`translate(${targets.cli.x}, ${targets.cli.y})`}>
          <rect
            x="-44"
            y="-16"
            width="88"
            height="32"
            rx="5"
            fill="currentColor"
            className="text-white dark:text-neutral-900"
            stroke={activeTarget === "cli" ? "#3b82f6" : "currentColor"}
            strokeWidth={activeTarget === "cli" ? "1.5" : "1"}
            strokeOpacity={activeTarget === "cli" ? 1 : 0.2}
          />
          <circle cx="-32" cy="0" r="2.5" fill="#3b82f6" />
          <text x="-24" y="-1" fontSize="7.5" fontWeight="600" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
            TERMINAL / CLI
          </text>
          <text x="-24" y="8" fontSize="6.5" fontFamily="monospace" fill="#10b981">
            {targets.cli.ping} · stdio
          </text>
        </g>
      </svg>

      <div className="absolute bottom-1 right-2 text-[8.5px] font-mono text-neutral-400 dark:text-neutral-500 opacity-70">
        routed: {targets[activeTarget].name}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PRIVACY VAULT FIGURE: Isometric Hardware Isolation Boundary
   Visualizes isolation barrier shielding credentials from public payload
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
  const shieldElevation = isMasked ? 28 : 6;
  const dialRotation = isMasked ? 0 : 90 + pointer.x * 20;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full aspect-[5/4] select-none flex items-center justify-center cursor-crosshair overflow-hidden ${className}`}
      aria-label="Isometric Hardware Privacy Vault figure"
    >
      <svg
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[260px] max-h-[200px]"
      >
        {/* Base Isometric Plinth */}
        <polygon
          points="140,25 245,78 140,130 35,78"
          fill="currentColor"
          fillOpacity="0.04"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-400 dark:text-neutral-600"
        />

        {/* ─── Left Compartment: Protected Vault Zone ─── */}
        <g transform="translate(85, 80)">
          <polygon
            points="0,-18 45,5 0,28 -45,5"
            fill="#ef4444"
            fillOpacity={isMasked ? "0.08" : "0.14"}
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray={isMasked ? "none" : "2 2"}
          />
          {/* Secret token indicator */}
          <circle cx="0" cy="5" r="3" fill="#ef4444" />
          <text x="0" y="-3" textAnchor="middle" fontSize="6.5" fontWeight="600" fontFamily="monospace" fill="#ef4444">
            SECRET ZONE
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" className="text-neutral-600 dark:text-neutral-400">
            {isMasked ? "sk-••••••••" : "sk-proj-7x9"}
          </text>
        </g>

        {/* ─── Right Compartment: Clean Egress Zone ─── */}
        <g transform="translate(195, 80)">
          <polygon
            points="0,-18 45,5 0,28 -45,5"
            fill="#10b981"
            fillOpacity="0.08"
            stroke="#10b981"
            strokeWidth="1.2"
          />
          <circle cx="0" cy="5" r="3" fill="#10b981" />
          <text x="0" y="-3" textAnchor="middle" fontSize="6.5" fontWeight="600" fontFamily="monospace" fill="#10b981">
            PUBLIC EGRESS
          </text>
          <text x="0" y="18" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" className="text-neutral-600 dark:text-neutral-400">
            CLEAN PAYLOAD
          </text>
        </g>

        {/* ─── Central Barrier: Physical Isolation Shield Gate ─── */}
        <g transform={`translate(140, ${100 - shieldElevation})`} className="transition-transform duration-300 ease-out">
          {/* Vertical Shield Plate */}
          <polygon
            points="0,-42 16,-34 16,30 0,22"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="var(--primary)"
            strokeWidth="1.5"
            className="text-neutral-900 dark:text-white"
          />
          <polygon
            points="-16,-34 0,-42 0,22 -16,30"
            fill="currentColor"
            fillOpacity="0.35"
            stroke="var(--primary)"
            strokeWidth="1.5"
            className="text-neutral-900 dark:text-white"
          />
          {/* Laser-cut indicator slits on shield */}
          <line x1="-8" y1="-10" x2="-8" y2="10" stroke="var(--primary)" strokeWidth="1" />
          <line x1="8" y1="-10" x2="8" y2="10" stroke="var(--primary)" strokeWidth="1" />

          {/* Status Label */}
          <text
            x="0"
            y="-48"
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            fontFamily="monospace"
            fill="var(--primary)"
          >
            {isMasked ? "ISOLATION ACTIVE" : "SHIELD LIFTED"}
          </text>
        </g>

        {/* ─── Rotary Security Dial (Lower Stage) ─── */}
        <g transform="translate(140, 160)">
          <ellipse
            cx="0"
            cy="0"
            rx="32"
            ry="16"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-800 dark:text-neutral-200"
          />
          {/* Rotating Dial Ticks */}
          <g style={{ transform: `rotate(${dialRotation}deg)`, transformOrigin: "0px 0px" }} className="transition-transform duration-200">
            <line x1="-20" y1="0" x2="20" y2="0" stroke="var(--primary)" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4" fill="var(--primary)" />
          </g>
          <text x="0" y="24" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="currentColor" className="text-neutral-500">
            ROTARY ENCRYPTOR
          </text>
        </g>
      </svg>

      <div className="absolute bottom-1 right-2 text-[8.5px] font-mono text-neutral-400 dark:text-neutral-500 opacity-70">
        shield: {isMasked ? "enforced" : "bypassed"}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. SYNC TREE FIGURE: Multi-Tool Git/MCP Single-Source Branch
   Visualizes one single truth propagating to .cursorrules, CLAUDE.md, etc.
───────────────────────────────────────────────────────────────────────────── */
type SyncTreeFigureProps = FigureBaseProps & {};

export function ContentConnectedSyncTreeFigure({
  className = "",
  intensity = 0.7,
  play = true,
}: SyncTreeFigureProps) {
  const { containerRef, pointer, handlePointerMove, handlePointerLeave } = usePointerTracker(play);
  const [activeBranch, setActiveBranch] = useState<number | null>(null);

  // 3 Branch targets
  const branches = [
    { id: 0, title: "Cursor", file: ".cursorrules", hash: "#c901a", x: 60, y: 140 },
    { id: 1, title: "Claude", file: "CLAUDE.md", hash: "#d4e21", x: 140, y: 175 },
    { id: 2, title: "Terminal", file: "MCP Gateway", hash: "#b882f", x: 220, y: 140 },
  ];

  const rootNode = { x: 140, y: 55 };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full aspect-[5/4] select-none flex items-center justify-center cursor-crosshair overflow-hidden ${className}`}
      aria-label="Isometric Cross-Tool Sync Tree figure"
    >
      <svg
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[260px] max-h-[200px]"
      >
        {/* Background Grid Lines */}
        <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" className="text-neutral-400 dark:text-neutral-600">
          <line x1="140" y1="20" x2="260" y2="80" />
          <line x1="140" y1="20" x2="20" y2="80" />
          <line x1="20" y1="80" x2="140" y2="140" />
          <line x1="260" y1="80" x2="140" y2="140" />
        </g>

        {/* ─── Branch Connectors (Root -> 3 Nodes) ─── */}
        {branches.map((b) => {
          const isHovered = activeBranch === b.id || (pointer.active && Math.abs(pointer.x - (b.x - 140) / 80) < 0.4);
          return (
            <g key={b.id}>
              {/* Isometric Conduit Line */}
              <path
                d={`M ${rootNode.x} ${rootNode.y} L ${b.x} ${rootNode.y + 40} L ${b.x} ${b.y}`}
                stroke={isHovered ? "var(--primary)" : "currentColor"}
                strokeWidth={isHovered ? "1.5" : "1"}
                strokeDasharray={isHovered ? "none" : "3 3"}
                className={isHovered ? "" : "text-neutral-300 dark:text-neutral-700"}
              />
              {/* Pulse diode along branch */}
              <circle
                cx={(rootNode.x + b.x) / 2}
                cy={(rootNode.y + 40 + b.y) / 2}
                r="2"
                fill={isHovered ? "var(--primary)" : "#10b981"}
              />
            </g>
          );
        })}

        {/* ─── Root Node: Meto Source of Truth (v2.4) ─── */}
        <g transform={`translate(${rootNode.x}, ${rootNode.y})`}>
          <polygon
            points="0,-20 36,-2 0,16 -36,-2"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="var(--primary)"
            strokeWidth="1.5"
            className="text-neutral-900 dark:text-white"
          />
          {/* Depth edge */}
          <polygon
            points="-36,-2 0,16 0,22 -36,4"
            fill="var(--primary)"
            fillOpacity="0.2"
            stroke="var(--primary)"
            strokeWidth="0.8"
          />
          <polygon
            points="0,16 36,-2 36,4 0,22"
            fill="var(--primary)"
            fillOpacity="0.3"
            stroke="var(--primary)"
            strokeWidth="0.8"
          />

          <circle cx="0" cy="-2" r="3.5" fill="var(--primary)" />
          <text
            x="0"
            y="-8"
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            fontFamily="monospace"
            fill="currentColor"
            className="text-neutral-900 dark:text-white"
          >
            METO TRUTH (v2.4)
          </text>
        </g>

        {/* ─── 3 Branch Target Nodes ─── */}
        {branches.map((b) => {
          const isElevated = activeBranch === b.id || (pointer.active && Math.abs(pointer.x - (b.x - 140) / 80) < 0.4);
          const yOffset = isElevated ? -6 : 0;

          return (
            <g
              key={b.id}
              transform={`translate(${b.x}, ${b.y + yOffset})`}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setActiveBranch(b.id)}
              onMouseLeave={() => setActiveBranch(null)}
            >
              {/* Drop guide when elevated */}
              {isElevated ? (
                <line x1="0" y1="18" x2="0" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-neutral-400" />
              ) : null}

              {/* Node Card Box */}
              <rect
                x="-36"
                y="-18"
                width="72"
                height="36"
                rx="5"
                fill="currentColor"
                className="text-white dark:text-neutral-900"
                stroke={isElevated ? "var(--primary)" : "currentColor"}
                strokeWidth={isElevated ? "1.5" : "1"}
                strokeOpacity={isElevated ? 1 : 0.25}
              />

              <circle cx="-24" cy="-4" r="2.5" fill="#10b981" />
              <text x="-16" y="-1" fontSize="7" fontWeight="600" fontFamily="monospace" fill="currentColor" className="text-neutral-900 dark:text-white">
                {b.title}
              </text>
              <text x="-16" y="9" fontSize="6" fontFamily="monospace" fill="currentColor" className="text-neutral-500">
                {b.file}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-1 right-2 text-[8.5px] font-mono text-neutral-400 dark:text-neutral-500 opacity-70">
        status: all branches in sync
      </div>
    </div>
  );
}
