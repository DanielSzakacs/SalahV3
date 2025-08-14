import { DateTime } from 'luxon';
import { getTodayPrayers, getNextPrayer } from '../../../lib/prayer';
import { getSettings, getLocation, setLocation } from '../../../lib/storage';
import { getCurrentPosition } from '../../../lib/geo';
import { getMessage } from '../../../lib/i18n';
import template from './Prayers.html?raw';

/**
 * Renders today's prayer times and next prayer countdown.
 */
export async function render(container: HTMLElement): Promise<void> {
  container.innerHTML = template;
  const nextDiv = container.querySelector('#next') as HTMLDivElement;
  const nameEl = nextDiv.querySelector('.name') as HTMLSpanElement;
  const timeEl = nextDiv.querySelector('.time') as HTMLSpanElement;
  const countdownEl = nextDiv.querySelector('.countdown') as HTMLSpanElement;
  const list = container.querySelector('#prayer-list') as HTMLUListElement;
  const btn = container.querySelector('#locate-btn') as HTMLButtonElement;
  btn.textContent = getMessage('locate_me');
  try {
    const settings = await getSettings();
    const loc = await getLocation();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const prayers = getTodayPrayers(
      { method: settings.method, madhab: settings.madhab, latitudeRule: settings.latitudeRule },
      { lat: loc.lat, lon: loc.lon, tz }
    );
    prayers.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name}: ${DateTime.fromISO(p.timeISO).toFormat('HH:mm')}`;
      list.appendChild(li);
    });
    const next = getNextPrayer(prayers);
    if (next) {
      nameEl.textContent = next.name;
      timeEl.textContent = DateTime.fromISO(next.timeISO).toFormat('HH:mm');
      function tick() {
        const diff = DateTime.fromISO(next.timeISO).diffNow(['hours', 'minutes', 'seconds']);
        countdownEl.textContent = diff.toFormat('hh:mm:ss');
      }
      tick();
      setInterval(tick, 1000);
    }
    btn.onclick = async () => {
      try {
        const pos = await getCurrentPosition();
        await setLocation(pos);
        await render(container);
      } catch {
        alert(getMessage('error_location'));
      }
    };
  } catch {
    container.textContent = getMessage('error_generic');
  }
}
