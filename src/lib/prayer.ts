import { PrayerTimes, CalculationMethod, Madhab, Coordinates, CalculationParameters, HighLatitudeRule } from 'adhan';
import { DateTime } from 'luxon';

export type Prayer = { name: string; timeISO: string };
export type PrayerSettings = {
  method: string;
  madhab: string;
  latitudeRule: string;
};

/**
 * Returns prayer times for the given date based on settings and location.
 */
export function getTodayPrayers(
  settings: PrayerSettings,
  location: { lat: number; lon: number; tz: string },
  date: Date = new Date()
): Prayer[] {
  const coords = new Coordinates(location.lat, location.lon);
  const params: CalculationParameters =
    (CalculationMethod as any)[settings.method]?.() || CalculationMethod.MuslimWorldLeague();
  params.madhab = (Madhab as any)[settings.madhab] || Madhab.Shafi;
  params.highLatitudeRule =
    (HighLatitudeRule as any)[settings.latitudeRule] || HighLatitudeRule.MiddleOfTheNight;
  const dt = DateTime.fromJSDate(date).setZone(location.tz);
  const pt = new PrayerTimes(coords, dt.toJSDate(), params);
  const names = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const results: Prayer[] = [];
  for (const n of names) {
    const time = (pt as any)[n.toLowerCase()];
    results.push({ name: n, timeISO: DateTime.fromJSDate(time).setZone(location.tz).toISO()! });
  }
  return results;
}

/**
 * Returns the next prayer after the given time or null if none remain today.
 */
export function getNextPrayer(prayers: Prayer[], nowISO: string = new Date().toISOString()): Prayer | null {
  const now = DateTime.fromISO(nowISO);
  for (const p of prayers) {
    if (DateTime.fromISO(p.timeISO) > now) return p;
  }
  return null;
}
