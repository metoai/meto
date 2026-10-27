"use client";

import { useState } from "react";
import Avatar from "boring-avatars";

export const METO_AVATAR_PALETTE = [
  "#FF4D00", // Meto primary brand orange
  "#FF7A00", // Warm bright orange
  "#1A1A1A", // Obsidian dark
  "#3B82F6", // Accent blue
  "#10B981", // Signal emerald
];

export interface ProfileAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
  variant?: "beam" | "marble" | "pixel" | "sunset" | "bauhaus" | "ring";
  className?: string;
  square?: boolean;
}

export function ProfileAvatar({
  name,
  avatarUrl,
  size = 32,
  variant = "beam",
  className = "",
  square = false,
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const seed = (name?.trim() || "meto-user").toLowerCase();
  const radiusClass = square ? "rounded-xl" : "rounded-full";

  if (avatarUrl && !imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name ? `${name}'s avatar` : "Profile avatar"}
        width={size}
        height={size}
        onError={() => setImageError(true)}
        className={`object-cover shrink-0 ${radiusClass} ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${radiusClass} ${className}`}
      style={{ width: size, height: size }}
      aria-label={name ? `${name}'s avatar` : "User avatar"}
    >
      <Avatar
        size={size}
        name={seed}
        variant={variant}
        colors={METO_AVATAR_PALETTE}
        square={square}
      />
    </div>
  );
}
