import { DateTime } from 'luxon';

type Prayer = { name: string; timeISO: string };

export async function scheduleDailyAlarms(prayers: Prayer[]) {
  await chrome.alarms.clearAll();
  for (const p of prayers) {
    const when = DateTime.fromISO(p.timeISO).toMillis();
    chrome.alarms.create(p.name, { when });
  }
}

export function clearAndRescheduleOnNewDay() {
  const now = DateTime.now();
  const next = now.plus({ days: 1 }).startOf('day');
  chrome.alarms.create('midnight', { when: next.toMillis() });
}
