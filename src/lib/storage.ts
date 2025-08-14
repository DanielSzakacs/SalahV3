export interface AdhanSettings {
  audioEnabled: boolean;
  popupEnabled: boolean;
  source: string;
  customUrl: string;
  volume: number;
}

export interface Settings {
  language?: string;
  adhan?: AdhanSettings;
  [key: string]: any;
}

/**
 * Reads extension settings from chrome storage.
 */
export async function getSettings(): Promise<Settings> {
  const { settings } = await chrome.storage.sync.get(['settings']);
  return (settings || {}) as Settings;
}

/**
 * Merges and saves partial settings to storage.
 */
export async function setSettings(partial: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  const settings = { ...current, ...partial } as Settings;
  await chrome.storage.sync.set({ settings });
}

/**
 * Returns stored location override if available.
 */
export async function getLocation(): Promise<{ lat: number; lon: number }> {
  const { location } = await chrome.storage.sync.get(['location']);
  return location || { lat: 0, lon: 0 };
}

/**
 * Persists a location override in storage.
 */
export async function setLocation(loc: { lat: number; lon: number }) {
  await chrome.storage.sync.set({ location: loc });
}

/**
 * Returns stored notification preferences per prayer.
 */
export async function getNotificationPrefs(): Promise<Record<string, boolean>> {
  const settings = await getSettings();
  return settings.notifications || {};
}
