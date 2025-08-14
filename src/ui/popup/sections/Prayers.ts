import { DateTime } from 'luxon';
import { getTodayPrayers, getNextPrayer } from '../../../lib/prayer';
import { getSettings, getLocation } from '../../../lib/storage';
import { getMessage } from '../../../lib/i18n';

/**
 * Renders a horizontal timeline of today's prayers with progress.
 */
export async function render(): Promise<HTMLElement> {
  const card = document.createElement('div');
  card.className = 'card';
  const container = document.createElement('div');
  container.className = 'prayer-timeline';
  const line = document.createElement('div');
  line.className = 'prayer-line';
  const progress = document.createElement('div');
  progress.className = 'progress';
  line.appendChild(progress);
  const points = document.createElement('div');
  points.className = 'prayer-points';
  container.appendChild(line);
  container.appendChild(points);
  card.appendChild(container);

  try {
    const settings = await getSettings();
    const loc = await getLocation();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const prayers = getTodayPrayers(
      { method: settings.method, madhab: settings.madhab, latitudeRule: settings.latitudeRule },
      { lat: loc.lat, lon: loc.lon, tz }
    ).filter(p => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(p.name));

    prayers.forEach(p => {
      const pt = document.createElement('div');
      pt.className = 'prayer-point';
      const circle = document.createElement('div');
      circle.className = 'circle';
      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = getMessage(`prayer_${p.name.toLowerCase()}`);
      const time = document.createElement('div');
      time.className = 'time';
      time.textContent = DateTime.fromISO(p.timeISO).toFormat('h:mm a');
      pt.appendChild(circle);
      pt.appendChild(name);
      pt.appendChild(time);
      points.appendChild(pt);
    });

    const next = getNextPrayer(prayers);
    if (next) {
      const idx = prayers.findIndex(p => p.name === next.name);
      const el = points.children[idx] as HTMLElement;
      el.classList.add('next');
    }

    function updateProgress() {
      const now = DateTime.now().setZone(tz);
      const first = DateTime.fromISO(prayers[0].timeISO);
      const last = DateTime.fromISO(prayers[prayers.length - 1].timeISO);
      const total = last.toMillis() - first.toMillis();
      const current = now.toMillis() - first.toMillis();
      const pct = Math.max(0, Math.min(1, current / total)) * 100;
      progress.style.width = `${pct}%`;
    }
    updateProgress();
    setInterval(updateProgress, 60000);
  } catch {
    card.textContent = getMessage('error_generic');
  }

  return card;
}
