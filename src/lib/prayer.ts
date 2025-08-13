import { PrayerTimes, CalculationMethod, Madhab, Coordinates, CalculationParameters, HighLatitudeRule } from 'adhan';
import { DateTime } from 'luxon';

type Options = {
  lat: number;
  lon: number;
  tz: string;
  method: string;
  madhab: string;
  latitudeRule: string;
  date: Date;
};

type Prayer = { name: string; timeISO: string };

export async function getTodayPrayers(opts: Options): Promise<Prayer[]> {
  const coords = new Coordinates(opts.lat, opts.lon);
  const params: CalculationParameters = (CalculationMethod as any)[opts.method]?.() || CalculationMethod.MuslimWorldLeague();
  params.madhab = (Madhab as any)[opts.madhab] || Madhab.Shafi;
  params.highLatitudeRule = (HighLatitudeRule as any)[opts.latitudeRule] || HighLatitudeRule.MiddleOfTheNight;
  const date = DateTime.fromJSDate(opts.date).setZone(opts.tz);
  const pt = new PrayerTimes(coords, date.toJSDate(), params);
  const ptAny: any = pt;
  const names = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  return names.map(n => ({ name: n, timeISO: DateTime.fromJSDate(ptAny[n.toLowerCase()]).setZone(opts.tz).toISO() }));
}

export function getNextPrayer(nowISO: string, prayers: Prayer[]): Prayer | null {
  const now = DateTime.fromISO(nowISO);
  for (const p of prayers) {
    if (DateTime.fromISO(p.timeISO) > now) {
      return p;
    }
  }
  return null;
}
