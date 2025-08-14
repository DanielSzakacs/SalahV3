/**
 * Reads extension settings from chrome storage.
 */
export async function getSettings(): Promise<any> {
  const { settings } = await chrome.storage.sync.get(['settings']);
  return settings || {};
}

/**
 * Merges and saves partial settings to storage.
 */
export async function setSettings(partial: any) {
  const current = await getSettings();
  const settings = { ...current, ...partial };
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
