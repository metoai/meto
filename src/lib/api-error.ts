import { NextResponse } from "next/server";

export function apiErrorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function catchApiError(error: unknown, fallback: string, status = 500) {
  console.error(fallback, error);
  return apiErrorResponse(fallback, status);
}
