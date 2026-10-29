import type { Product } from "../types/product";
import { emptyProfile, type UserProfile } from "../types/profile";
import { readJson, subscribeToKey, writeJson } from "./storage";
import { STORAGE } from "./storageKeys";

/**
 * Simulated server database. Data is keyed by user ID and survives logout,
 * the way a real backend would. The client only caches the active user's rows.
 */
export function createUserTable<T>(key: string) {
  const readAll = (): Record<string, T> => {
    const all = readJson<unknown>(key, {});
    return all && typeof all === "object" && !Array.isArray(all)
      ? (all as Record<string, T>)
      : {};
  };
  return {
    get(userId: string): T | undefined {
      return readAll()[userId];
    },
    set(userId: string, value: T): void {
      writeJson(key, { ...readAll(), [userId]: value });
    },
  };
}

const profileTable = createUserTable<UserProfile>(STORAGE.profiles);
const cartTable = createUserTable<Product[]>(STORAGE.carts);

export const profiles = {
  get(userId: string): UserProfile | null {
    const row = profileTable.get(userId);
    return row ? { ...emptyProfile(userId), ...row, userId } : null;
  },
  /** First login for an unknown user ID creates an empty profile. */
  ensure(userId: string): UserProfile {
    const existing = profiles.get(userId);
    if (existing) return existing;
    const created = emptyProfile(userId);
    profileTable.set(userId, created);
    return created;
  },
  patch(userId: string, patch: Partial<UserProfile>): UserProfile {
    const next = { ...profiles.ensure(userId), ...patch, userId };
    profileTable.set(userId, next);
    return next;
  },
  /** Called when another tab changes any profile. */
  subscribe(fn: () => void): () => void {
    return subscribeToKey(STORAGE.profiles, fn);
  },
};

export const carts = {
  get(userId: string): Product[] {
    const items = cartTable.get(userId);
    return Array.isArray(items) ? items : [];
  },
  save(userId: string, items: Product[]): void {
    cartTable.set(userId, items);
  },
};
