import { readString, writeString } from "./storage";
import { STORAGE } from "./storageKeys";

/** Default matches previous hard-coded app behavior. */
export function getAllowUserSuppliedJavascriptForInit(): boolean {
  const v = readString(STORAGE.brazeAllowUserJs);
  if (v === null) return true;
  return v === "1" || v === "true";
}

export function setAllowUserSuppliedJavascriptForInit(enabled: boolean): void {
  writeString(STORAGE.brazeAllowUserJs, enabled ? "1" : "0");
}
