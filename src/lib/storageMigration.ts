import type { Product } from "../types/product";
import { carts } from "./mockBackend";
import { getSession, startSession } from "./session";
import { readJson, readString, removeItem, writeString } from "./storage";
import { LEGACY_STORAGE, STORAGE } from "./storageKeys";

const SCHEMA_VERSION = 2;

/**
 * v1 stored a bare user ID and one global cart. v2 stores a session object and per-user carts.
 * Runs once before first render so existing demo users stay logged in with their data.
 */
export function migrateStorage(): void {
  if (Number(readString(STORAGE.schemaVersion) ?? 1) >= SCHEMA_VERSION) return;

  const legacyUser = readString(LEGACY_STORAGE.currentUserId)?.trim();
  if (legacyUser && !getSession()) startSession(legacyUser);

  const legacyCart = readJson<unknown>(LEGACY_STORAGE.cartItems, []);
  if (
    legacyUser &&
    Array.isArray(legacyCart) &&
    legacyCart.length > 0 &&
    carts.get(legacyUser).length === 0
  ) {
    carts.save(legacyUser, legacyCart as Product[]);
  }

  removeItem(LEGACY_STORAGE.currentUserId);
  removeItem(LEGACY_STORAGE.cartItems);
  writeString(STORAGE.schemaVersion, String(SCHEMA_VERSION));
}
