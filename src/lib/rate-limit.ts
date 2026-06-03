import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

/** Optional Upstash Redis sliding window (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). */
async function checkUpstashRateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number } | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["TTL", key],
      ]),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { result?: unknown[] };
    const count = Number(data.result?.[0] ?? 0);
    let ttl = Number(data.result?.[1] ?? -1);

    if (ttl < 0 && count === 1) {
      await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([["EXPIRE", key, windowSec]]),
      });
      ttl = windowSec;
    }

    if (count > limit) {
      return {
        ok: false,
        retryAfterSec: Math.max(1, ttl > 0 ? ttl : windowSec),
      };
    }

    return { ok: true };
  } catch {
    return null;
  }
}

export async function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
  userId?: string
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const key = userId ? `${scope}:user:${userId}` : `${scope}:ip:${ip}`;
  const windowSec = Math.ceil(windowMs / 1000);

  const distributed = await checkUpstashRateLimit(key, limit, windowSec);
  const result = distributed ?? checkRateLimit(key, limit, windowMs);

  if (result.ok) return null;

  return NextResponse.json(
    { error: "Too many requests. Try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSec) },
    }
  );
}
