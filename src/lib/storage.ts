const USERS_KEY = "ib_users";
const SESSION_KEY = "ib_session";
const ATTEMPTS_KEY = "ib_attempts";
const FAVORITES_KEY = "ib_favorites";

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers(): StoredUser[] {
    return read<StoredUser[]>(USERS_KEY, []);
  },

  saveUsers(users: StoredUser[]) {
    write(USERS_KEY, users);
  },

  getSession(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(SESSION_KEY);
  },

  setSession(userId: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(SESSION_KEY, userId);
  },

  clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_KEY);
  },

  getAttempts() {
    return read<import("@/types").InterviewAttempt[]>(ATTEMPTS_KEY, []);
  },

  saveAttempts(attempts: import("@/types").InterviewAttempt[]) {
    write(ATTEMPTS_KEY, attempts);
  },

  getFavorites(): Record<string, string[]> {
    return read<Record<string, string[]>>(FAVORITES_KEY, {});
  },

  saveFavorites(favorites: Record<string, string[]>) {
    write(FAVORITES_KEY, favorites);
  },
};

export type { StoredUser };
