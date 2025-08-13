import { scheduleDailyAlarms, clearAndRescheduleOnNewDay } from '../lib/schedule';
import { getTodayPrayers } from '../lib/prayer';
import { getSettings, getLocation } from '../lib/storage';

async function setupAlarms() {
  const settings = await getSettings();
  const loc = await getLocation();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const prayers = await getTodayPrayers({
    lat: loc.lat,
    lon: loc.lon,
    tz,
    method: settings.method,
    madhab: settings.madhab,
    latitudeRule: settings.latitudeRule,
    date: new Date()
  });
  await scheduleDailyAlarms(prayers);
}

chrome.runtime.onInstalled.addListener(async () => {
  const defaults = {
    method: 'MWL',
    madhab: 'Shafi',
    latitudeRule: 'MiddleOfTheNight',
    notifications: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true }
  } as any;
  const location = { lat: 0, lon: 0 };
  await chrome.storage.sync.set({ settings: defaults, location });
  await setupAlarms();
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (['Fajr','Dhuhr','Asr','Maghrib','Isha'].includes(alarm.name)) {
    showNotification(alarm.name);
  } else if (alarm.name === 'midnight') {
    setupAlarms();
    clearAndRescheduleOnNewDay();
  }
});

chrome.storage.onChanged.addListener(() => {
  setupAlarms();
});

async function showNotification(prayer: string) {
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Prayer time',
    message: `${prayer} time`
  });
}

clearAndRescheduleOnNewDay();
