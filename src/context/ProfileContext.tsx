import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { profiles } from "../lib/mockBackend";
import {
  endSession,
  getSession,
  startSession,
  subscribeToSession,
  type Session,
} from "../lib/session";
import { readString, writeString } from "../lib/storage";
import { STORAGE } from "../lib/storageKeys";
import type { UserProfile } from "../types/profile";

export type { UserProfile };

/** `login` = explicit Log in click in this tab. `restore` = resumed from storage (refresh or other tab). */
export type LoginKind = "login" | "restore";

function loadGuestDarkMode(): boolean {
  return readString(STORAGE.guestDarkMode) === "1";
}

type ProfileContextValue = {
  currentUserId: string | null;
  /** New on every login, stable across refresh. `null` when logged out. */
  sessionId: string | null;
  /** How the current session began in this tab. `null` when logged out. */
  loginKind: LoginKind | null;
  profile: UserProfile | null;
  login: (userId: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  /** Used when logged out (persists in localStorage). */
  guestDarkMode: boolean;
  setGuestDarkMode: (enabled: boolean) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => getSession());
  const [loginKind, setLoginKind] = useState<LoginKind | null>(() =>
    getSession() ? "restore" : null,
  );
  /** Client cache of the active user's profile; the source of truth is the mock backend. */
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const s = getSession();
    return s ? profiles.ensure(s.userId) : null;
  });
  const [guestDarkMode, setGuestDarkModeState] = useState(loadGuestDarkMode);

  const userId = session?.userId ?? null;

  /** Another tab logged in or out: follow it silently. */
  useEffect(
    () =>
      subscribeToSession((next) => {
        setSession(next);
        setLoginKind(next ? "restore" : null);
        setProfile(next ? profiles.ensure(next.userId) : null);
      }),
    [],
  );

  /** Another tab edited a profile: refresh the cache. */
  useEffect(
    () =>
      profiles.subscribe(() => {
        if (userId) setProfile(profiles.ensure(userId));
      }),
    [userId],
  );

  const setGuestDarkMode = useCallback((enabled: boolean) => {
    setGuestDarkModeState(enabled);
    writeString(STORAGE.guestDarkMode, enabled ? "1" : "0");
  }, []);

  const login = useCallback((rawId: string) => {
    const id = rawId.trim();
    if (!id) return;
    const next = startSession(id);
    setProfile(profiles.ensure(id));
    setSession(next);
    setLoginKind("login");
  }, []);

  const logout = useCallback(() => {
    endSession();
    setSession(null);
    setLoginKind(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      if (!userId) return;
      setProfile(profiles.patch(userId, patch));
    },
    [userId],
  );

  const sessionId = session?.sessionId ?? null;

  const value = useMemo(
    () => ({
      currentUserId: userId,
      sessionId,
      loginKind,
      profile,
      login,
      logout,
      updateProfile,
      guestDarkMode,
      setGuestDarkMode,
    }),
    [
      userId,
      sessionId,
      loginKind,
      profile,
      login,
      logout,
      updateProfile,
      guestDarkMode,
      setGuestDarkMode,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile outside ProfileProvider");
  return ctx;
}
