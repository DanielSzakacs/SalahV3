import { DateTime } from 'luxon';
import type { Prayer } from './prayer';

/**
 * Schedules chrome alarms for the provided prayers and a midnight reschedule.
 */
export async function schedulePrayers(prayers: Prayer[]) {
  await chrome.alarms.clearAll();
  const now = DateTime.now();
  for (const p of prayers) {
    const when = DateTime.fromISO(p.timeISO);
    if (when > now) chrome.alarms.create(p.name, { when: when.toMillis() });
  }
  const midnight = now.plus({ days: 1 }).startOf('day');
  chrome.alarms.create('midnight', { when: midnight.toMillis() });
}

/**
 * Removes all prayer alarms.
 */
export async function clearPrayers() {
  await chrome.alarms.clearAll();
}
