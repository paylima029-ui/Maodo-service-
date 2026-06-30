import { logger } from "../logger";
import type { DiamanoPayTokenResponse } from "./types";

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

const TIMEOUT_MS = 10_000;

let tokenCache: TokenCache | null = null;

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.DIAMANOPAY_CLIENT_ID;
  const clientSecret = process.env.DIAMANOPAY_CLIENT_SECRET;
  const baseUrl = process.env.DIAMANOPAY_BASE_URL ?? "https://api.diamanopay.com";

  if (!clientId || !clientSecret) {
    throw new Error("DIAMANOPAY_CLIENT_ID and DIAMANOPAY_CLIENT_SECRET are required");
  }

  logger.info("Requesting new DiamanoPay access token");

  let res: Response;
  try {
    res = await fetchWithTimeout(`${baseUrl}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    logger.error({ err }, "DiamanoPay auth network error");
    throw new Error(`DiamanoPay inaccessible: ${msg}`);
  }

  if (!res.ok) {
    const body = await res.text();
    logger.error({ status: res.status, body }, "DiamanoPay auth failed");
    throw new Error(`DiamanoPay auth failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as DiamanoPayTokenResponse;
  const token = data.accessToken;

  if (!token) {
    throw new Error("DiamanoPay auth: no accessToken in response");
  }

  const expiresIn = data.expiresIn ?? 3600;
  tokenCache = {
    accessToken: token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  logger.info({ expiresIn }, "DiamanoPay token obtained");
  return tokenCache.accessToken;
}

export function clearTokenCache(): void {
  tokenCache = null;
}
