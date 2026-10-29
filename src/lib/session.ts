import { readJson, removeItem, subscribeToKey, writeJson } from "./storage";
import { STORAGE } from "./storageKeys";

export type Session = {
  userId: string;
  /** New on every login, stable across refresh. */
  sessionId: string;
  startedAt: string;
};

function isSession(v: unknown): v is Session {
  if (!v || typeof v !== "object") return false;
  const s = v as Partial<Session>;
  return (
    typeof s.userId === "string" &&
    s.userId.length > 0 &&
    typeof s.sessionId === "string" &&
    typeof s.startedAt === "string"
  );
}

export function getSession(): Session | null {
  const s = readJson<unknown>(STORAGE.session, null);
  return isSession(s) ? s : null;
}

export function startSession(userId: string): Session {
  const session: Session = {
    userId,
    sessionId: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
  };
  writeJson(STORAGE.session, session);
  return session;
}

export function endSession(): void {
  removeItem(STORAGE.session);
}

/** Called when another tab logs in or out. */
export function subscribeToSession(fn: (session: Session | null) => void): () => void {
  return subscribeToKey(STORAGE.session, () => fn(getSession()));
}
