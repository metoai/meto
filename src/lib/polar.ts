import { Polar } from "@polar-sh/sdk";
import { getSiteUrl } from "@/lib/site";

let polarClient: Polar | null = null;

export function getPolarServer(): "sandbox" | "production" {
  return process.env.POLAR_SERVER === "production" ? "production" : "sandbox";
}

export function getPolar(): Polar {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN is not configured.");
  }

  if (!polarClient) {
    polarClient = new Polar({
      accessToken,
      server: getPolarServer(),
    });
  }

  return polarClient;
}

export function getPolarProProductId(): string {
  const productId = process.env.POLAR_PRO_PRODUCT_ID;
  if (!productId) {
    throw new Error("POLAR_PRO_PRODUCT_ID is not configured.");
  }
  return productId;
}

export function getSiteOrigin(): string {
  return getSiteUrl();
}
