const STORAGE_KEY = "bb.registeredDeviceToken";

export interface RegisteredDeviceToken {
  userId: string;
  token: string;
}

export function loadRegisteredDeviceToken(): RegisteredDeviceToken | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as RegisteredDeviceToken).userId === "string" &&
      typeof (parsed as RegisteredDeviceToken).token === "string"
    ) {
      return parsed as RegisteredDeviceToken;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveRegisteredDeviceToken(entry: RegisteredDeviceToken): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {}
}

export function clearRegisteredDeviceToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
