export async function getSettings(): Promise<any> {
  const { settings } = await chrome.storage.sync.get(['settings']);
  return settings || {};
}

export async function setSettings(partial: any) {
  const current = await getSettings();
  const settings = { ...current, ...partial };
  await chrome.storage.sync.set({ settings });
}

export async function getLocation(): Promise<{ lat: number; lon: number }> {
  const { location } = await chrome.storage.sync.get(['location']);
  return location || { lat: 0, lon: 0 };
}

export async function setLocation(loc: { lat: number; lon: number }) {
  await chrome.storage.sync.set({ location: loc });
}

export async function getNotificationPrefs(): Promise<Record<string, boolean>> {
  const settings = await getSettings();
  return settings.notifications || {};
}
