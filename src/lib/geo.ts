import { getLocation, setLocation } from './storage';

/**
 * Returns the current geographic position or a stored manual location.
 */
export async function getCurrentPosition(): Promise<{ lat: number; lon: number }> {
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
    await setLocation(loc);
    return loc;
  } catch {
    return getLocation();
  }
}

/**
 * Stores a manual location override.
 */
export async function setManualLocation(loc: { lat: number; lon: number }) {
  await setLocation(loc);
}

/**
 * Clears any manual location override.
 */
export async function clearManualLocation() {
  await setLocation({ lat: 0, lon: 0 });
}
