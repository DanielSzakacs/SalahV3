import { schedulePrayers } from '../lib/schedule';
import { getTodayPrayers } from '../lib/prayer';
import { getSettings, getLocation } from '../lib/storage';
import { showNotification } from '../lib/notify';
import { playAdhan, playSilent } from '../lib/audio';

const DEBUG = import.meta.env.DEV;

async function setup() {
  const settings = await getSettings();
  const loc = await getLocation();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const prayers = getTodayPrayers(
    { method: settings.method, madhab: settings.madhab, latitudeRule: settings.latitudeRule },
    { lat: loc.lat, lon: loc.lon, tz }
  );
  await schedulePrayers(prayers);
  if (DEBUG) console.log('scheduled prayers', prayers);
}

chrome.runtime.onInstalled.addListener(async () => {
  const defaults = {
    method: 'MWL',
    madhab: 'Shafi',
    latitudeRule: 'MiddleOfTheNight',
    notifications: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
    adhanMode: 'silent',
    adhanUrl: '',
    adhanVolume: 0.7
  } as any;
  const location = { lat: 0, lon: 0 };
  await chrome.storage.sync.set({ settings: defaults, location });
  await setup();
});

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === 'midnight') {
    await setup();
    return;
  }
  const settings = await getSettings();
  const prefs = settings.notifications || {};
  if (!prefs[alarm.name]) return;
  await showNotification(alarm.name, `${alarm.name} time`);
  if (settings.adhanMode === 'url') {
    await playAdhan(settings.adhanUrl, settings.adhanVolume || 0.7);
  } else {
    await playSilent();
  }
});

chrome.storage.onChanged.addListener(() => {
  setup();
});

if (DEBUG) {
  chrome.runtime.onMessage.addListener(msg => {
    if (msg === 'simulate') {
      chrome.alarms.create('Fajr', { when: Date.now() + 60_000 });
    }
  });
}

setup();
