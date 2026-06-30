import { logger } from "../logger";
import { getAccessToken, clearTokenCache } from "./auth";

const TIMEOUT_MS = 15_000;

function getBaseUrl(): string {
  return process.env.DIAMANOPAY_BASE_URL ?? "https://api.diamanopay.com";
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  retry = true,
): Promise<T> {
  const token = await getAccessToken();

  let res: Response;
  try {
    res = await fetchWithTimeout(`${getBaseUrl()}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    logger.error({ err, method, path }, "DiamanoPay network error");
    throw new Error(`DiamanoPay inaccessible: ${msg}`);
  }

  logger.info(
    { method, path, status: res.status },
    "DiamanoPay API response",
  );

  if (res.status === 401 && retry) {
    clearTokenCache();
    return request<T>(method, path, body, false);
  }

  const responseBody = await res.json().catch(() => ({ error: res.statusText }));

  if (!res.ok) {
    logger.error(
      { method, path, status: res.status, body: responseBody },
      "DiamanoPay API error",
    );
    throw Object.assign(new Error(`DiamanoPay error ${res.status}`), {
      status: res.status,
      data: responseBody,
    });
  }

  return responseBody as T;
}

export const diamanopayClient = {
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  get: <T>(path: string) => request<T>("GET", path),
};
