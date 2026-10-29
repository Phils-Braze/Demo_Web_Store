import { readString, writeString } from "./storage";
import { STORAGE } from "./storageKeys";

export type BrazeSettings = {
  apiKey: string;
  baseUrl: string;
  /** Braze REST API key (Manage Settings → API Keys) — for `/users/export/ids` profile import. */
  restApiKey: string;
  /** REST instance URL, e.g. `https://todd.braze.com` (demo) or your dashboard REST endpoint. */
  restEndpoint: string;
};

export function getBrazeSettings(): BrazeSettings {
  return {
    apiKey: readString(STORAGE.brazeApiKey) ?? "",
    baseUrl: readString(STORAGE.brazeSdkEndpoint) ?? "",
    restApiKey: readString(STORAGE.brazeRestApiKey) ?? "",
    restEndpoint: readString(STORAGE.brazeRestEndpoint) ?? "",
  };
}

export function saveBrazeSettings(settings: BrazeSettings): void {
  writeString(STORAGE.brazeApiKey, settings.apiKey);
  writeString(STORAGE.brazeSdkEndpoint, settings.baseUrl);
  writeString(STORAGE.brazeRestApiKey, settings.restApiKey);
  writeString(STORAGE.brazeRestEndpoint, settings.restEndpoint);
}

/**
 * Braze Web SDK `baseUrl` must be a hostname only (no protocol, no path).
 * Accepts pasted URLs and strips to host.
 */
export function normalizeBrazeBaseUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return "";

  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withProto);
    return u.hostname || "";
  } catch {
    const s = raw
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .trim();
    return s;
  }
}

/** Normalize REST base URL with no trailing slash. */
export function normalizeBrazeRestEndpoint(input: string): string {
  const raw = input.trim();
  if (!raw) return "";
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withProto);
    if (!u.hostname) return "";
    return `${u.protocol}//${u.host}`;
  } catch {
    return "";
  }
}
